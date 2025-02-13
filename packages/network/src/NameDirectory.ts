/*
 * Get human-readable names for some Ethereum addresses in Streamr test environment
 * The list doesn't contain all known contract addresses or nodes, but we can add more
 * addresses if needed.
 * 
 * Currently contains hardcoded names for all streamr-docker-dev Broker/Tracker entities
 * -> in the future each node receives the peer names from Tracker
 *    and we can remove the hardcoded values
 */

import { EthereumAddress } from '@streamr/utils'

const NAMES: Record<string, string> = {
    '0xb9e7cebf7b03ae26458e32a059488386b05798e8': 'T1',
    '0x0540a3e144cdd81f402e7772c76a5808b71d2d30': 'T2',
    '0xf2c195be194a2c91e93eacb1d6d55a00552a85e2': 'T3',
    '0xde1112f631486cfc759a50196853011528bc5fa0': 'S1',
    '0xde222e8603fcf641f928e5f66a0cbf4de70d5352': 'B1',
    '0xde3331ca6b8b636e0b82bf08e941f727b8927442': 'B2',
    '0x6ccdd5d866ea766f6df5965aa98deccd629ff222': 'DOCKER_DEV_STREAM_REGISTRY',
    '0xd04af489677001444280366dd0885b03daade71d': 'DOCKER_DEV_STREAM_STORAGE_REGISTRY',
    '0x231b810d98702782963472e1d60a25496999e75d': 'DOCKER_DEV_STORAGE_NODE_REGISTRY'
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class NameDirectory {

    static MAX_FALLBACK_NAME_LENGTH = 8

    // if name is not known, creates a short name from the address
    static getName(address: EthereumAddress | string | undefined): string | undefined {
        if (address === undefined) {
            return undefined
        }
        const name = NAMES[address.toLowerCase()]
        if (name !== undefined) {
            return name
        } else {
            return (address.length > NameDirectory.MAX_FALLBACK_NAME_LENGTH) 
                ? address.substring(0, this.MAX_FALLBACK_NAME_LENGTH)
                : address
        }
    }
}
