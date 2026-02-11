import { defineChain, http } from 'viem'
import { createConfig, fallback, injected, unstable_connector } from 'wagmi'

export const TEN_CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID) || 8443
const TEN_RPC_URL = process.env.REACT_APP_NETWORK_URL || 'https://testnet-rpc.ten.xyz/v1/'

export const tenChain = defineChain({
  id: TEN_CHAIN_ID,
  name: 'TEN PROTOCOL',
  nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
  rpcUrls: { default: { http: [TEN_RPC_URL] } },
  blockExplorers: { default: { name: 'Tenscan', url: 'https://testnet.tenscan.io' } }
})

export const wagmiConfig = createConfig({
  chains: [tenChain],
  ssr: true,
  connectors: [injected()],
  transports: {
    [tenChain.id]: fallback([
      unstable_connector(injected),
      http(TEN_RPC_URL)
    ])
  }
})
