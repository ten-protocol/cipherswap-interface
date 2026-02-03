import React from 'react'
import styled from 'styled-components'
import TenLogo from '../../assets/images/ten-logo.svg'

const FooterWrapper = styled.footer`
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid rgba(0, 212, 170, 0.1);
  margin-top: auto;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 212, 170, 0.3), transparent);
  }
`

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`

const TenLogoWrapper = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  img {
    height: 28px;
    width: auto;
  }

  &:hover {
    filter: drop-shadow(0 0 10px rgba(0, 212, 170, 0.4));
    transform: scale(1.05);
  }
`

const BuiltOnText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.text3};
  font-weight: 500;

  img {
    height: 16px;
    width: auto;
  }
`

const FooterLink = styled.a`
  font-size: 12px;
  color: ${({ theme }) => theme.primary1};
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
    text-shadow: 0 0 10px rgba(0, 212, 170, 0.3);
  }
`

export default function Footer() {
  return (
    <FooterWrapper>
      <FooterContent>
        <TenLogoWrapper href="https://ten.xyz" target="_blank" rel="noopener noreferrer">
          <img src={TenLogo} alt="TEN Protocol" />
        </TenLogoWrapper>
        <BuiltOnText>
          <span>Built on TEN Protocol</span>
        </BuiltOnText>
        <FooterLink href="https://ten.xyz" target="_blank" rel="noopener noreferrer">
          ten.xyz
        </FooterLink>
      </FooterContent>
    </FooterWrapper>
  )
}
