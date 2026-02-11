import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useAccount, useConnect } from 'wagmi'
import usePrevious from '../../hooks/usePrevious'
import { useWalletModalOpen, useWalletModalToggle } from '../../state/application/hooks'

import Modal from '../Modal'
import AccountDetails from '../AccountDetails'
import MetamaskIcon from '../../assets/images/metamask.png'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import Loader from '../Loader'

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${(props: any) => (props.color === 'blue' ? ({ theme }: any) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  padding: 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`

const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.bg3};
  background-color: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text1};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;

  &:hover {
    border-color: ${({ theme }) => theme.primary1};
    background-color: ${({ theme }) => theme.bg2};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  img {
    width: 28px;
    height: 28px;
  }
`

const WALLET_VIEWS = {
  OPTIONS: 'options',
  ACCOUNT: 'account'
}

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions
}: {
  pendingTransactions: string[]
  confirmedTransactions: string[]
}) {
  const { address: account, isConnected } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  const walletModalOpen = useWalletModalOpen()
  const toggleWalletModal = useWalletModalToggle()

  const previousAccount = usePrevious(account)

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal()
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  // De-duplicate connectors by name
  const uniqueConnectors = connectors.filter((c, i, self) => i === self.findIndex(x => x.name === c.name))

  function getOptions() {
    return uniqueConnectors.map(connector => (
      <OptionButton key={connector.uid} onClick={() => connect({ connector })} disabled={isPending}>
        <img src={MetamaskIcon} alt={connector.name} />
        <span>{connector.name === 'Injected' ? 'Browser Wallet' : connector.name}</span>
        {isPending && <Loader />}
      </OptionButton>
    ))
  }

  function getModalContent() {
    if (error) {
      return (
        <UpperSection>
          <CloseIcon onClick={toggleWalletModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>Error connecting</HeaderRow>
          <ContentWrapper>
            <h5>Error connecting. Try refreshing the page.</h5>
            <h5 style={{ marginTop: '8px' }}>
              Please make sure you are connected to the TEN network via the TEN Gateway.
            </h5>
          </ContentWrapper>
        </UpperSection>
      )
    }
    if (isConnected && account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      )
    }
    return (
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        {walletView !== WALLET_VIEWS.ACCOUNT ? (
          <HeaderRow color="blue">
            <HoverText onClick={() => setWalletView(WALLET_VIEWS.ACCOUNT)}>Back</HoverText>
          </HeaderRow>
        ) : (
          <HeaderRow>
            <HoverText>Connect to a wallet</HoverText>
          </HeaderRow>
        )}
        <ContentWrapper>
          <OptionGrid>{getOptions()}</OptionGrid>
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={walletModalOpen} onDismiss={toggleWalletModal} minHeight={false} maxHeight={90}>
      <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
  )
}
