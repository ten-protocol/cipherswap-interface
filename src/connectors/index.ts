import { InjectedConnector } from '@web3-react/injected-connector'

import { NetworkConnector } from './NetworkConnector'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '8443')

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL }
})

export const injected = new InjectedConnector({
  supportedChainIds: [8443]
})

/**
 * Prompt MetaMask to add TEN Testnet as a custom network.
 * Call this when wallet connection fails due to wrong chain.
 */
export async function addTenTestnetToMetaMask(): Promise<void> {
  if (!window.ethereum || !window.ethereum.request) return
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x20FB',
          chainName: 'TEN Testnet',
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: [process.env.REACT_APP_NETWORK_URL || ''],
          blockExplorerUrls: ['https://testnet.tenscan.io']
        }
      ]
    })
  } catch (error) {
    console.error('Failed to add TEN Testnet to MetaMask', error)
  }
}
