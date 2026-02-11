export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '8443')

/**
 * Prompt MetaMask to add TEN Testnet as a custom network.
 */
export async function addTenTestnetToMetaMask(): Promise<void> {
  const ethereum = window.ethereum as { request?: (...args: any[]) => Promise<any> } | undefined
  if (!ethereum?.request) return
  try {
    await ethereum.request({
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
