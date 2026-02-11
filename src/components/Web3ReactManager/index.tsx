import React from 'react'
import { useAccount } from 'wagmi'
import styled from 'styled-components'
import Loader from '../Loader'

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { isReconnecting } = useAccount()

  // wagmi handles eager connect and network fallback automatically
  if (isReconnecting) {
    return (
      <MessageWrapper>
        <Loader />
      </MessageWrapper>
    )
  }

  return children
}
