import { fetchPrivateKeyWithGas, randomEthereumAddress } from '@streamr/test-utils'
import 'jest-extended'
import { StreamPermission } from 'streamr-client'
import { createTestClient, runCommand } from './utils'

describe('permission', () => {

    it('grant and revoke', async () => {
        const privateKey = await fetchPrivateKeyWithGas()
        const client = createTestClient(privateKey)
        const stream = await client.createStream(`/${Date.now()}`)
        const otherUser = randomEthereumAddress()
        const hasPermission = () => client.hasPermission({
            user: otherUser,
            permission: StreamPermission.PUBLISH,
            streamId: stream.id,
            allowPublic: false
        })
        await runCommand(`stream grant-permission ${stream.id} ${otherUser} publish`, {
            privateKey
        })
        expect(await hasPermission()).toBeTrue()
        await runCommand(`stream revoke-permission ${stream.id} ${otherUser} publish`, {
            privateKey
        })
        expect(await hasPermission()).toBeFalse()
        await client.destroy()
    }, 40 * 1000)
})
