import assert from 'assert'
import ControlMessage from '../../../../src/protocol/control_layer/ControlMessage'
import ProxyConnectionResponse from '../../../../src/protocol/control_layer/proxy_connection_response/ProxyConnectionResponse'
import '../../../../src/protocol/control_layer/proxy_connection_response/ProxyConnectionResponseSerializerV2'
import { toStreamID } from '../../../../src/utils/StreamID'
import { ProxyDirection } from '../../../../src/utils/types'

const VERSION = 2
const streamId = toStreamID('stream')
const streamPartition = 0
const senderId = 'node'
const accepted = true
const direction = ProxyDirection.PUBLISH

// Message definitions
const message = new ProxyConnectionResponse({
    version: VERSION,
    streamId,
    streamPartition,
    senderId,
    requestId: 'requestId',
    direction,
    accepted
})
const serializedMessage = JSON.stringify([
    VERSION,
    ControlMessage.TYPES.ProxyConnectionResponse,
    'requestId',
    streamId,
    streamPartition,
    senderId,
    direction,
    accepted
])

describe('ProxyPublishStreamConnectionResponseSerializerV2', () => {
    describe('deserialize', () => {
        it('correctly parses messages', () => {
            assert.deepStrictEqual(ControlMessage.deserialize(serializedMessage), message)
        })
    })
    describe('serialize', () => {
        it('correctly serializes messages', () => {
            assert.deepStrictEqual(message.serialize(VERSION, 30), serializedMessage)
        })
    })
})
