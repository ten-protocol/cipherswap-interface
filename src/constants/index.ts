import { AbstractConnector } from '@web3-react/abstract-connector'

import { ChainId, JSBI, Percent, Token, WETH } from '../sdk'
import { injected } from '../connectors'

export const ROUTER_ADDRESS = '0xBF838e93082Cc05B61E89C6792f338ECe8590d9c'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const ARB = new Token(ChainId.CARDONA, '0x67385C066C14E3F5FA5Ca4C7755ae13883d09a18', 18, 'ARB', 'ARB')
export const DAI = new Token(ChainId.CARDONA, '0x7422ab95742858e21b9F6299fF66B24FB2a478FD', 18, 'DAI', 'Dai Stablecoin')
export const GRT = new Token(ChainId.CARDONA, '0xefb2408b7A3Db3594A2ad179d2C08A6Be1E1AE55', 18, 'GRT', 'GRT')
export const LINK = new Token(ChainId.CARDONA, '0x7BBfC2E6e6FCAdcad676a1585B669bdC80D43aeB', 18, 'LINK', 'LINK')
export const MKR = new Token(ChainId.CARDONA, '0xe1986ced537437423837b4Ef6210B51108EA76F1', 18, 'MKR', 'Maker')
export const META = new Token(ChainId.CARDONA, '0xb89BfFe2370512b63f613ca3Fd5D5Ad70538cE93', 18, 'META', 'METALAMP')
export const TRX = new Token(ChainId.CARDONA, '0x6cBEC9d3123F9976F768634F4f87680524Cc5101', 18, 'TRX', 'TRX')
export const TUSD = new Token(ChainId.CARDONA, '0xa40Eb0638fa439E672f266886D8CdC6Ded67751f', 18, 'TUSD', 'TUSD')
export const USDC = new Token(ChainId.CARDONA, '0xe751e20d336f7bE90D14c84e987Af4A712c48108', 18, 'USDC', 'USD//C')
export const USDT = new Token(ChainId.CARDONA, '0x120D0f5447313514e5DA0A3FdCd60Be730442235', 18, 'USDT', 'Tether USD')
export const GALA = new Token(ChainId.CARDONA, '0x7De9cC01cfF47760D5DECC901Bb783e62c009a68', 18, 'GALA', 'Gala')
export const MNT = new Token(ChainId.CARDONA, '0xe0840f693e4fBf888448dAbe00a6d3203F4E67F8', 18, 'MNT', 'Mantle')
export const SHIB = new Token(ChainId.CARDONA, '0x41Fb5b5BA5dc9d0D90c59Fa9123ae0A14eC5A553', 18, 'SHIB', 'SHIBA INU')

const WETH_ONLY: ChainTokenList = {
  [ChainId.CARDONA]: [WETH[ChainId.CARDONA]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.CARDONA]: [...WETH_ONLY[ChainId.CARDONA], DAI, USDC, USDT, MKR]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.CARDONA]: [
    ...WETH_ONLY[ChainId.CARDONA],
    ARB,
    DAI,
    GRT,
    LINK,
    MKR,
    META,
    TRX,
    TUSD,
    USDC,
    USDT,
    GALA,
    MNT,
    SHIB
  ]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.CARDONA]: [...WETH_ONLY[ChainId.CARDONA], DAI, USDC, USDT]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.CARDONA]: [
    [USDC, USDT],
    [DAI, USDT]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
