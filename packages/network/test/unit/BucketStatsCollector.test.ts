import { WINDOW_LENGTH, BucketStatsCollector, getWindowNumber } from '../../src/logic/receipts/BucketStatsCollector'
import {
    MessageID,
    StreamMessage,
    StreamPartID,
    StreamPartIDUtils,
} from 'streamr-client-protocol'

function makeMsg(
    streamPartId: StreamPartID,
    publisherId: string,
    msgChainId: string,
    timestamp: number,
    payloadSize: number
): StreamMessage {
    return new StreamMessage({
        messageId: new MessageID(
            StreamPartIDUtils.getStreamID(streamPartId),
            StreamPartIDUtils.getStreamPartition(streamPartId),
            timestamp,
            0,
            publisherId,
            msgChainId
        ),
        prevMsgRef: null,
        content: {
            'key': 'a'.repeat(payloadSize - 10) // 10 is size of structure without 'a's
        }
    })
}

const TIMESTAMP = 1652252050000
const SP1 = StreamPartIDUtils.parse('stream-1#0')
const SP2 = StreamPartIDUtils.parse('stream-1#1')
const SP3 = StreamPartIDUtils.parse('stream-2#0')

describe(getWindowNumber, () => {
    const BASE_WINDOW_NUMBER = getWindowNumber(TIMESTAMP)
    const LOWER_BOUND = BASE_WINDOW_NUMBER * WINDOW_LENGTH
    const UPPER_BOUND = (BASE_WINDOW_NUMBER + 1) * WINDOW_LENGTH - 1

    it('works as expected', () => {
        expect(TIMESTAMP).toBeWithin(LOWER_BOUND, UPPER_BOUND)
        expect(getWindowNumber(LOWER_BOUND)).toEqual(BASE_WINDOW_NUMBER)
        expect(getWindowNumber(LOWER_BOUND + Math.floor(WINDOW_LENGTH * (1/2)))).toEqual(BASE_WINDOW_NUMBER)
        expect(getWindowNumber(UPPER_BOUND)).toEqual(BASE_WINDOW_NUMBER)

        // previous and next buckets
        expect(getWindowNumber(LOWER_BOUND - 1)).toEqual(BASE_WINDOW_NUMBER - 1)
        expect(getWindowNumber(UPPER_BOUND + 1)).toEqual(BASE_WINDOW_NUMBER + 1)
    })
})

describe(BucketStatsCollector, () => {
    let collector: BucketStatsCollector
    let testCaseStartTime: number

    beforeEach(() => {
        collector = new BucketStatsCollector()
        testCaseStartTime = Date.now()
    })

    it('initially node has no buckets', () => {
        expect(collector.getBuckets('nodeId')).toEqual([])
    })

    it('recording some data and getting the bucket', () => {
        collector.record('nodeId', makeMsg(SP1, 'publisherId', 'msgChainId', TIMESTAMP, 40))
        collector.record('nodeId', makeMsg(SP1, 'publisherId', 'msgChainId', TIMESTAMP + 15000, 160))
        collector.record('nodeId', makeMsg(SP1, 'publisherId', 'msgChainId', TIMESTAMP + 32000, 100))
        expect(collector.getBuckets('nodeId')).toEqual([
            {
                streamPartId: SP1,
                publisherId: 'publisherId',
                msgChainId: 'msgChainId',
                windowNumber: getWindowNumber(TIMESTAMP),
                messageCount: 3,
                totalPayloadSize: 40 + 160 + 100,
                lastUpdate: expect.toBeWithin(testCaseStartTime, Date.now() + 1)
            }
        ])
    })

    it('recording some data spanning multiple buckets and getting the buckets', () => {
        const makeFixedMsg = (timestamp: number, payloadSize: number) => {
            return makeMsg(SP1, 'publisherId', 'msgChainId', timestamp, payloadSize)
        }
        collector.record('nodeId', makeFixedMsg(TIMESTAMP, 40))
        collector.record('nodeId', makeFixedMsg(TIMESTAMP + (WINDOW_LENGTH / 2), 60))

        collector.record('nodeId', makeFixedMsg(TIMESTAMP + WINDOW_LENGTH, 100))
        collector.record('nodeId', makeFixedMsg(TIMESTAMP + WINDOW_LENGTH + 1000, 20))

        collector.record('nodeId', makeFixedMsg(TIMESTAMP + 2 * WINDOW_LENGTH + 2000, 15))
        collector.record('nodeId', makeFixedMsg(TIMESTAMP + 2 * WINDOW_LENGTH + WINDOW_LENGTH*(3/4), 20))

        collector.record('nodeId', makeFixedMsg(TIMESTAMP + 6 * WINDOW_LENGTH, 150))

        const firstWindowNumber = getWindowNumber(TIMESTAMP)
        expect(collector.getBuckets('nodeId')).toEqual([
            {
                streamPartId: SP1,
                publisherId: 'publisherId',
                msgChainId: 'msgChainId',
                windowNumber: firstWindowNumber,
                messageCount: 2,
                totalPayloadSize: 40 + 60,
                lastUpdate: expect.toBeWithin(testCaseStartTime, Date.now() + 1)
            },
            {
                streamPartId: SP1,
                publisherId: 'publisherId',
                msgChainId: 'msgChainId',
                windowNumber: firstWindowNumber + 1,
                messageCount: 2,
                totalPayloadSize: 100 + 20,
                lastUpdate: expect.toBeWithin(testCaseStartTime, Date.now() + 1)
            },
            {
                streamPartId: SP1,
                publisherId: 'publisherId',
                msgChainId: 'msgChainId',
                windowNumber: firstWindowNumber + 2,
                messageCount: 2,
                totalPayloadSize: 15 + 20,
                lastUpdate: expect.toBeWithin(testCaseStartTime, Date.now() + 1)
            },
            {
                streamPartId: SP1,
                publisherId: 'publisherId',
                msgChainId: 'msgChainId',
                windowNumber: firstWindowNumber + 6,
                messageCount: 1,
                totalPayloadSize: 150,
                lastUpdate: expect.toBeWithin(testCaseStartTime, Date.now() + 1)
            }
        ])
    })

    it('buckets are neighbor-specific', () => {
        const msg1 = makeMsg(SP1, 'publisherId', 'msgChainId', TIMESTAMP, 80)
        const msg2 = makeMsg(SP1, 'publisherId', 'msgChainId', TIMESTAMP + 10, 120)
        collector.record('nodeA', msg1)
        collector.record('nodeA', msg2)
        collector.record('nodeB', msg1)
        expect(collector.getBuckets('nodeA')).toEqual([
            {
                streamPartId: SP1,
                publisherId: 'publisherId',
                msgChainId: 'msgChainId',
                windowNumber: getWindowNumber(TIMESTAMP),
                messageCount: 2,
                totalPayloadSize: 80 + 120,
                lastUpdate: expect.toBeWithin(testCaseStartTime, Date.now() + 1)
            }
        ])
        expect(collector.getBuckets('nodeB')).toEqual([
            {
                streamPartId: SP1,
                publisherId: 'publisherId',
                msgChainId: 'msgChainId',
                windowNumber: getWindowNumber(TIMESTAMP),
                messageCount: 1,
                totalPayloadSize: 80,
                lastUpdate: expect.toBeWithin(testCaseStartTime, Date.now() + 1)
            }
        ])
    })

    it('buckets are streamPart-specific', () => {
        collector.record('nodeId', makeMsg(SP1, 'publisherId', 'msgChainId', TIMESTAMP, 40))
        collector.record('nodeId', makeMsg(SP2, 'publisherId', 'msgChainId', TIMESTAMP + 1, 40))
        collector.record('nodeId', makeMsg(SP3, 'publisherId', 'msgChainId', TIMESTAMP + 2, 40))
        expect(collector.getBuckets('nodeId')).toHaveLength(3)
    })

    it('buckets for a fixed streamPart are publisherId-specific', () => {
        const msgChainId = 'msgChainId'
        collector.record('nodeId', makeMsg(SP1, 'publisherOne', msgChainId, TIMESTAMP, 40))
        collector.record('nodeId', makeMsg(SP1, 'publisherTwo', msgChainId, TIMESTAMP + 1, 40))
        collector.record('nodeId', makeMsg(SP1, 'publisherThree', msgChainId, TIMESTAMP + 2, 40))
        expect(collector.getBuckets('nodeId')).toHaveLength(3)
    })

    it('buckets for a fixed (streamPart, publisherId)-pair are msgChain-specific', () => {
        const publisherId = 'publisherId'
        collector.record('nodeId', makeMsg(SP1, publisherId, 'msgChainOne', TIMESTAMP, 40))
        collector.record('nodeId', makeMsg(SP1, publisherId, 'msgChainTwo', TIMESTAMP + 1, 40))
        collector.record('nodeId', makeMsg(SP3, publisherId, 'msgChainThree', TIMESTAMP + 2, 40))
        expect(collector.getBuckets('nodeId')).toHaveLength(3)
    })
})
