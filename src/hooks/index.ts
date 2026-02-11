import { Web3Provider } from '@ethersproject/providers'
import { useAccount, useWalletClient } from 'wagmi'
import { useMemo } from 'react'

import { ChainId } from '../sdk'

/**
 * Bridge hook: returns the same interface as the old web3-react useActiveWeb3React,
 * but backed by wagmi v2.
 */
export function useActiveWeb3React(): {
  library: Web3Provider | undefined
  chainId: ChainId | undefined
  account: string | undefined
  active: boolean
} {
  const { address, chainId, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  const library = useMemo(() => {
    if (!walletClient || !isConnected) return undefined
    try {
      const { chain, transport } = walletClient
      const network = { chainId: chain.id, name: chain.name }
      const provider = new Web3Provider(transport as any, network)
      provider.pollingInterval = 15000
      return provider
    } catch (e) {
      console.error('[useActiveWeb3React] Failed to create provider:', e)
    }
    return undefined
  }, [walletClient, isConnected])

  return {
    library,
    chainId: chainId as ChainId | undefined,
    account: address,
    active: isConnected
  }
}

export function useEagerConnect(): boolean {
  return true
}

export function useInactiveListener(_suppress?: boolean): void {
  // no-op
}
