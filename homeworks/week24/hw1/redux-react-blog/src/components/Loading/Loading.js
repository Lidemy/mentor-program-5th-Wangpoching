import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const LoadingBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.background.body};
  color: ${({ theme }) => theme.text.primary};
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`

const SpinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spin = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 0.25rem solid ${({ theme }) => theme.loading.border};
  border-top-color: ${({ theme }) => theme.loading.focus};
  animation: ${SpinAnimation} 1s infinite linear;
`

export default function Loading() {
  return (
    <LoadingBackground>
      <Spin />
    </LoadingBackground>
  )
}