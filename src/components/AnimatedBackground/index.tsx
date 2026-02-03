import React from 'react'
import styled, { keyframes } from 'styled-components'
import heroBg from '../../assets/images/hero-bg.svg'
import tenOrb from '../../assets/images/ten-orb.png'
import crystal1 from '../../assets/images/crystal-1.svg'
import crystal2 from '../../assets/images/crystal-2.svg'
import asteroid1 from '../../assets/images/asteroid-1.svg'
import asteroid2 from '../../assets/images/asteroid-2.svg'

const float = keyframes`
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(5%, 5%) rotate(2deg);
  }
  66% {
    transform: translate(-5%, 3%) rotate(-2deg);
  }
`

const orbFloat = keyframes`
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.15;
  }
  50% {
    transform: translate(10px, -15px) scale(1.02);
    opacity: 0.2;
  }
`

// Flying across screen - diagonal paths with spin
const flyAcross1 = keyframes`
  0% {
    transform: translate(-100px, -50px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translate(calc(100vw + 100px), calc(100vh - 200px)) rotate(720deg);
    opacity: 0;
  }
`

const flyAcross2 = keyframes`
  0% {
    transform: translate(calc(100vw + 50px), -100px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translate(-150px, calc(100vh + 50px)) rotate(-540deg);
    opacity: 0;
  }
`

const flyAcross3 = keyframes`
  0% {
    transform: translate(-80px, calc(100vh + 50px)) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.5;
  }
  90% {
    opacity: 0.5;
  }
  100% {
    transform: translate(calc(100vw + 80px), -100px) rotate(900deg);
    opacity: 0;
  }
`

// Slower orbital movement with continuous spin
const orbit1 = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(150px, -100px) rotate(180deg);
  }
  50% {
    transform: translate(300px, 50px) rotate(360deg);
  }
  75% {
    transform: translate(150px, 150px) rotate(540deg);
  }
  100% {
    transform: translate(0, 0) rotate(720deg);
  }
`

const orbit2 = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(-200px, 120px) rotate(240deg);
  }
  66% {
    transform: translate(-100px, -150px) rotate(480deg);
  }
  100% {
    transform: translate(0, 0) rotate(720deg);
  }
`

// Gentle floating with spin
const floatSpin = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(40px, -60px) rotate(90deg);
  }
  50% {
    transform: translate(-30px, -30px) rotate(180deg);
  }
  75% {
    transform: translate(-50px, 40px) rotate(270deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
`

const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 150%;
    height: 150%;
    background: radial-gradient(ellipse at center, rgba(0, 212, 170, 0.15) 0%, transparent 50%);
    animation: ${float} 20s ease-in-out infinite;
  }

  &::before {
    top: -50%;
    left: -25%;
    animation-delay: -10s;
  }

  &::after {
    bottom: -50%;
    right: -25%;
  }
`

const HeroPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${heroBg});
  background-size: cover;
  background-position: center;
  opacity: 0.3;
`

const OrbImage = styled.img`
  position: absolute;
  width: 400px;
  height: auto;
  opacity: 0.15;
  animation: ${orbFloat} 15s ease-in-out infinite;
  filter: blur(1px);

  &.top-right {
    top: 5%;
    right: -5%;
    animation-delay: -5s;
  }

  &.bottom-left {
    bottom: 10%;
    left: -8%;
    width: 300px;
    animation-delay: -10s;
  }

  @media (max-width: 768px) {
    width: 250px;
    opacity: 0.1;

    &.bottom-left {
      width: 200px;
    }
  }
`

const FloatingElement = styled.img<{
  $size: number
  $top?: string
  $bottom?: string
  $left?: string
  $right?: string
  $delay: number
  $duration: number
  $opacity?: number
}>`
  position: absolute;
  width: ${({ $size }) => $size}px;
  height: auto;
  opacity: ${({ $opacity }) => $opacity || 0.7};
  top: ${({ $top }) => $top || 'auto'};
  bottom: ${({ $bottom }) => $bottom || 'auto'};
  left: ${({ $left }) => $left || 'auto'};
  right: ${({ $right }) => $right || 'auto'};
  animation-delay: ${({ $delay }) => $delay}s;
  animation-duration: ${({ $duration }) => $duration}s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;

  &.fly1 {
    animation-name: ${flyAcross1};
  }
  &.fly2 {
    animation-name: ${flyAcross2};
  }
  &.fly3 {
    animation-name: ${flyAcross3};
  }
  &.orbit1 {
    animation-name: ${orbit1};
  }
  &.orbit2 {
    animation-name: ${orbit2};
  }
  &.floatSpin {
    animation-name: ${floatSpin};
  }

  @media (max-width: 768px) {
    opacity: ${({ $opacity }) => ($opacity || 0.7) * 0.5};
    width: ${({ $size }) => $size * 0.5}px;
  }
`

export default function AnimatedBackground() {
  return (
    <BackgroundWrapper>
      <HeroPattern />
      <OrbImage src={tenOrb} alt="" className="top-right" />
      <OrbImage src={tenOrb} alt="" className="bottom-left" />

      {/* Flying across screen - dramatic movement */}
      <FloatingElement src={crystal1} alt="" className="fly1" $size={70} $top="0" $left="0" $delay={0} $duration={25} $opacity={0.7} />
      <FloatingElement src={crystal2} alt="" className="fly2" $size={55} $top="0" $left="0" $delay={-8} $duration={30} $opacity={0.6} />
      <FloatingElement src={asteroid1} alt="" className="fly3" $size={60} $top="0" $left="0" $delay={-15} $duration={35} $opacity={0.5} />
      <FloatingElement src={crystal1} alt="" className="fly1" $size={45} $top="20%" $left="0" $delay={-12} $duration={28} $opacity={0.5} />
      <FloatingElement src={asteroid2} alt="" className="fly2" $size={50} $top="0" $left="0" $delay={-20} $duration={32} $opacity={0.4} />

      {/* Orbiting elements - circular paths with spin */}
      <FloatingElement src={crystal2} alt="" className="orbit1" $size={60} $top="15%" $left="10%" $delay={0} $duration={40} $opacity={0.6} />
      <FloatingElement src={crystal1} alt="" className="orbit2" $size={50} $bottom="20%" $right="15%" $delay={-10} $duration={35} $opacity={0.5} />
      <FloatingElement src={asteroid1} alt="" className="orbit1" $size={45} $top="50%" $right="5%" $delay={-20} $duration={45} $opacity={0.4} />

      {/* Gentle floating spinners - ambient movement */}
      <FloatingElement src={crystal2} alt="" className="floatSpin" $size={40} $top="30%" $right="25%" $delay={-5} $duration={20} $opacity={0.5} />
      <FloatingElement src={asteroid2} alt="" className="floatSpin" $size={35} $bottom="40%" $left="20%" $delay={-12} $duration={25} $opacity={0.4} />
    </BackgroundWrapper>
  )
}
