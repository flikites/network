import { NetworkStack } from '../../src/NetworkStack'
import { PeerDescriptor } from '@streamr/dht'
import {
    StreamPartIDUtils
} from '@streamr/protocol'
import { hexToBinary, waitForCondition } from '@streamr/utils'
import { createRandomNodeId, createStreamMessage } from '../utils/utils'
import { randomEthereumAddress } from '@streamr/test-utils'

describe('NetworkStack', () => {

    let stack1: NetworkStack
    let stack2: NetworkStack
    const streamPartId = StreamPartIDUtils.parse('stream1#0')

    const epDescriptor: PeerDescriptor = {
        kademliaId: hexToBinary(createRandomNodeId()),
        websocket: { ip: 'localhost', port: 32222 },
        nodeName: 'entrypoint'
    }

    beforeEach(async () => {
        stack1 = new NetworkStack({
            layer0: {
                peerDescriptor: epDescriptor,
                entryPoints: [epDescriptor],
                nodeName: 'entrypoint'
            },
            networkNode: {}
        })
        stack2 = new NetworkStack({
            layer0: {
                websocketPortRange: { min: 32223, max: 32223 },
                peerIdString: 'network-stack',
                entryPoints: [epDescriptor],
                nodeName: 'node2'
            },
            networkNode: {}
        })

        await stack1.start()
        stack1.getStreamrNode()!.setStreamPartEntryPoints(streamPartId, [epDescriptor])
        await stack2.start()
        stack2.getStreamrNode()!.setStreamPartEntryPoints(streamPartId, [epDescriptor])
    })

    afterEach(async () => {
        await Promise.all([
            stack1.stop(),
            stack2.stop()
        ])
    })

    it('Can use NetworkNode pub/sub via NetworkStack', async () => {
        let receivedMessages = 0
        await stack1.getStreamrNode().waitForJoinAndSubscribe(streamPartId)
        stack1.getStreamrNode().on('newMessage', () => {
            receivedMessages += 1
        })
        const msg = createStreamMessage(
            JSON.stringify({ hello: 'WORLD' }),
            streamPartId,
            randomEthereumAddress()
        )
        await stack2.getStreamrNode().waitForJoinAndPublish(streamPartId, msg)
        await waitForCondition(() => receivedMessages === 1)
    })

})
