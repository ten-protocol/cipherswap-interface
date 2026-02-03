import React from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'
import styled from 'styled-components'

import { ChainId } from '../../sdk'
import Logo from '../../assets/images/logo.svg'
import WordmarkLogo from '../../assets/images/wordmark-logo.svg'
import TenLogo from '../../assets/images/ten-logo.svg'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { YellowCard } from '../Card'
import Settings from '../Settings'
import Row, { RowBetween } from '../Row'
import Web3Status from '../Web3Status'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: absolute;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-wrap: wrap;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0.5rem;
`};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`

const TitleText = styled(Row)`
  width: fit-content;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    img {
      width: 4.5rem;
    }
  `};
`

const PoweredByBadge = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.text3};
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(0, 212, 170, 0.08);
  border: 1px solid rgba(0, 212, 170, 0.15);
  margin-left: 16px;
  transition: all 0.3s ease;

  :hover {
    background: rgba(0, 212, 170, 0.12);
    border-color: rgba(0, 212, 170, 0.3);
    box-shadow: 0 0 15px rgba(0, 212, 170, 0.2);

    img {
      filter: drop-shadow(0 0 4px rgba(0, 212, 170, 0.4));
    }
  }

  img {
    height: 14px;
    width: auto;
    transition: filter 0.3s ease;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-left: 0;
    margin-top: 8px;
    padding: 4px 10px;
    font-size: 10px;

    img {
      height: 12px;
    }
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.TEN_TESTNET]: 'TEN Testnet'
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isDark] = useDarkModeManager()

  return (
    <HeaderFrame>
      <RowBetween style={{ alignItems: 'flex-start' }} padding="1rem 1rem 0 1rem">
        <HeaderElement>
          <Title href=".">
            {isDark ? (
              <UniIcon>
                <img src={Logo} alt="logo" />
              </UniIcon>
            ) : (
              <TitleText>
                <img style={{ marginLeft: '4px', marginTop: '4px' }} src={WordmarkLogo} alt="logo" />
              </TitleText>
            )}
          </Title>
          <PoweredByBadge href="https://ten.xyz" target="_blank" rel="noopener noreferrer">
            <span>Powered by</span>
            <img src={TenLogo} alt="TEN Protocol" />
          </PoweredByBadge>
        </HeaderElement>
        <HeaderControls>
          <HeaderElement>
            <TestnetWrapper>
              {!isMobile && chainId && NETWORK_LABELS[chainId] && <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>}
            </TestnetWrapper>
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} ETH
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
          </HeaderElement>
          <HeaderElementWrap>
            <Settings />
          </HeaderElementWrap>
        </HeaderControls>
      </RowBetween>
    </HeaderFrame>
  )
}
