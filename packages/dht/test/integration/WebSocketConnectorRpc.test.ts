import { ProtoRpcClient, RpcCommunicator, toProtoRpcClient } from '@streamr/proto-rpc'
import { WebSocketConnectorRpcClient } from '../../src/proto/packages/dht/protos/DhtRpc.client'
import { generateId } from '../utils/utils'
import {
    NodeType,
    PeerDescriptor,
    WebSocketConnectionRequest,
    WebSocketConnectionResponse
} from '../../src/proto/packages/dht/protos/DhtRpc'
import { mockWebSocketConnectorRpc } from '../utils/utils'
import { RpcMessage } from '../../src/proto/packages/proto-rpc/protos/ProtoRpc'

describe('WebSocketConnectorRpc', () => {
    let rpcCommunicator1: RpcCommunicator
    let rpcCommunicator2: RpcCommunicator
    let client1: ProtoRpcClient<WebSocketConnectorRpcClient>
    let client2: ProtoRpcClient<WebSocketConnectorRpcClient>

    const peerDescriptor1: PeerDescriptor = {
        kademliaId: generateId('peer1'),
        type: NodeType.NODEJS
    }

    const peerDescriptor2: PeerDescriptor = {
        kademliaId: generateId('peer2'),
        type: NodeType.NODEJS
    }

    beforeEach(() => {
        rpcCommunicator1 = new RpcCommunicator()
        rpcCommunicator1.registerRpcMethod(
            WebSocketConnectionRequest,
            WebSocketConnectionResponse,
            'requestConnection',
            mockWebSocketConnectorRpc.requestConnection
        )

        rpcCommunicator2 = new RpcCommunicator()
        rpcCommunicator2.registerRpcMethod(
            WebSocketConnectionRequest,
            WebSocketConnectionResponse,
            'requestConnection',
            mockWebSocketConnectorRpc.requestConnection
        )

        rpcCommunicator1.on('outgoingMessage', (message: RpcMessage) => {
            rpcCommunicator2.handleIncomingMessage(message)
        })

        rpcCommunicator2.on('outgoingMessage', (message: RpcMessage) => {
            rpcCommunicator1.handleIncomingMessage(message)
        })

        client1 = toProtoRpcClient(new WebSocketConnectorRpcClient(rpcCommunicator1.getRpcClientTransport()))
        client2 = toProtoRpcClient(new WebSocketConnectorRpcClient(rpcCommunicator2.getRpcClientTransport()))
    })

    afterEach(async () => {
        rpcCommunicator1.stop()
        rpcCommunicator2.stop()
    })

    it('Happy path', async () => {
        const response1 = client1.requestConnection({
            ip: '127.0.0.1',
            port: 9099
        },
        { targetDescriptor: peerDescriptor2 },
        )
        const res1 = await response1
        expect(res1.accepted).toEqual(true)

        const response2 = client2.requestConnection({
            ip: '127.0.0.1',
            port: 9111
        },
        { targetDescriptor: peerDescriptor1 },
        )
        const res2 = await response2
        expect(res2.accepted).toEqual(true)
    })
})
