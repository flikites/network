import { StreamID, StreamMessage, toStreamPartID } from '@streamr/protocol'
import { Logger, collect, wait } from '@streamr/utils'
import { Message, convertStreamMessageToMessage } from '../Message'
import { StreamrClientError } from '../StreamrClientError'
import { StreamStorageRegistry } from '../registry/StreamStorageRegistry'
import { Resends } from './Resends'

const logger = new Logger(module)

export const waitForStorage = async (
    message: Message,
    opts: {
        interval: number
        timeout: number
        count: number
        messageMatchFn?: (msgTarget: Message, msgGot: Message) => boolean
    },
    resends: Resends,
    streamStorageRegistry: StreamStorageRegistry
): Promise<void> => {
    if (!message) {
        throw new StreamrClientError('waitForStorage requires a Message', 'INVALID_ARGUMENT')
    }
    const macher = opts.messageMatchFn ?? ((msgTarget: Message, msgGot: Message) => (msgTarget.signature === msgGot.signature))
    const start = Date.now()
    let last: StreamMessage[] | undefined
    let found = false
    while (!found) {
        const duration = Date.now() - start
        if (duration > opts.timeout) {
            logger.debug('Timed out waiting for storage to contain message', {
                expected: message.streamMessage.getMessageID(),
                lastReceived: last?.map((l) => l.getMessageID()),
            })
            throw new Error(`timed out after ${duration}ms waiting for message`)
        }
        const getStorageNodes = (streamId: StreamID) => streamStorageRegistry.getStorageNodes(streamId)
        const resendStream = await resends.resend(toStreamPartID(message.streamId, message.streamPartition), { last: opts.count }, getStorageNodes)
        last = await collect(resendStream)
        for (const lastMsg of last) {
            if (macher(message, convertStreamMessageToMessage(lastMsg))) {
                found = true
                logger.debug('Found matching message')
                return
            }
        }
        logger.debug('Retry after delay (matching message not found)', {
            expected: message.streamMessage.getMessageID(),
            'last-3': last.slice(-3).map((l) => l.getMessageID()),
            delayInMs: opts.interval
        })
        await wait(opts.interval)
    }
    /* eslint-enable no-await-in-loop */
}
