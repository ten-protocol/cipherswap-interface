import { useMemo } from 'react'
import { useBalance, useReadContracts } from 'wagmi'
import { erc20Abi } from 'viem'

import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount } from '../../sdk'
import { useAllTokens } from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import { isAddress } from '../../utils'
import { TEN_CHAIN_ID } from '../../lib/wagmiConfig'

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(
  uncheckedAddresses?: (string | undefined)[]
): { [address: string]: CurrencyAmount | undefined } {
  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  )

  const primaryAddress = addresses.length > 0 ? addresses[0] : undefined

  const { data: balanceData, error: ethError, status: ethStatus } = useBalance({
    address: primaryAddress as `0x${string}` | undefined,
    chainId: TEN_CHAIN_ID,
    query: {
      enabled: !!primaryAddress,
      refetchInterval: 15000
    }
  })

  return useMemo(() => {
    if (!primaryAddress || !balanceData) return {}
    return {
      [primaryAddress]: CurrencyAmount.ether(JSBI.BigInt(balanceData.value.toString()))
    }
  }, [primaryAddress, balanceData])
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 * Uses wagmi's useReadContracts hook which routes through the authenticated TEN Gateway.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )

  const contracts = useMemo(
    () =>
      validatedTokens.map(token => ({
        address: token.address as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf' as const,
        args: [address as `0x${string}`],
        chainId: TEN_CHAIN_ID
      })),
    [validatedTokens, address]
  )

  const enabled = !!address && validatedTokens.length > 0

  const { data, isLoading, error: readError, status: readStatus } = useReadContracts({
    contracts: address ? contracts : [],
    query: {
      enabled,
      refetchInterval: 15000
    }
  })

  const balances = useMemo(() => {
    if (!data || !address) return {}
    const result: { [tokenAddress: string]: TokenAmount } = {}
    validatedTokens.forEach((token, i) => {
      const entry = data[i]
      if (entry && entry.status === 'success' && entry.result != null) {
        const raw = JSBI.BigInt(entry.result.toString())
        result[token.address] = new TokenAmount(token, raw)
      }
    })
    return result
  }, [data, address, validatedTokens])

  return [balances, isLoading]
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token])
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(() => currencies?.filter((currency): currency is Token => currency instanceof Token) ?? [], [
    currencies
  ])

  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(() => currencies?.some(currency => currency === ETHER) ?? false, [currencies])
  const ethBalance = useETHBalances(containsETH ? [account] : [])

  return useMemo(
    () =>
      currencies?.map(currency => {
        if (!account || !currency) return undefined
        if (currency instanceof Token) return tokenBalances[currency.address]
        if (currency === ETHER) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency])[0]
}

// mimics useAllBalances
export function useAllTokenBalances(): { [tokenAddress: string]: TokenAmount | undefined } {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const balances = useTokenBalances(account ?? undefined, allTokensArray)
  return balances ?? {}
}
