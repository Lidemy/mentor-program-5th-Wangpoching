import styled from '@emotion/styled'
import { AuthContext } from '../../context'
import { useEffect, useState, useContext, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { sendPasswordResetMail } from '../../firebase'
import Loading from '../../components/Loading'
import { Wrapper, Container } from '../../layout/basicLayout'
import { MEDIA_QUERY_SM } from '../../constants/breakpoints'

const ResetContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  background-color: ${({ theme }) => theme.background.primary};
  padding: 30px;
  border-radius: 17px;
  margin: 0 auto;
  padding: 40px 40px 50px 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: ${({ theme }) => theme.boxShadow.primary};

  ${MEDIA_QUERY_SM} {
    margin-top: 30px;
    padding: 30px 30px 40px 30px;
  }
`

const InputContainer = styled.div`
  background: inherit;
  margin-bottom: 10px;
  position: relative;
  margin-top: 0px !important;
`

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 10px 40px 10px 10px;
  font-size: 18px;
  border: 1px solid transparent;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.background.body};
  color: ${({ theme }) => theme.text.primary};
`

const ResetBtn = styled.button`
  padding: 10px;
  font-size: 18px;
  margin-bottom: 10px;
  border: none;
  color: ${({ theme }) => theme.text.negative};
  background-color: ${({ theme }) => theme.button.submit};
  border-radius: 3px;
`

const ResgiterLink = styled(Link)`
  transition: all 0.3s ease 0s;
  color: ${({ theme }) => theme.text.remind};
  &:hover {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
  }
`

const RegisterLinkContainer = styled.div`
  color: ${({ theme }) => theme.text.primary};
`

const ErrorMessage = styled.div`
  width: fit-content;
  color: ${({ theme }) => theme.error};
  margin: 0 auto;
  margin-bottom: 5px;
`

function ResetPage() {
  const {user, loading } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSendPasswordResetMail = useCallback(
    async () => {
      if (!email) {
        setErrorMessage('電子郵件不可為空')
        return
      }
      setIsLoading(true)
      try {
        await sendPasswordResetMail(email)
        setIsLoading(false)
        setEmail('')
        alert('已送出密碼重設連結')
      } catch (err) {
        setErrorMessage(err.message)
        setIsLoading(false)
      }
    }, [email]
  )

  const handleFocus = () => {
    setErrorMessage('')
  }
  const handleChange = (e) => {
    setEmail(e.target.value)
  }

  useEffect(() => {
    if (loading) return
    if (user) navigate('/home')
  }, [user, loading, navigate])
  
  return (
    <Wrapper>
      <Container>
        <ResetContainer>
          {isLoading && <Loading />}
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <InputContainer>
            <Input
              type="text"
              value={email}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="E-mail Address"
            />
          </InputContainer>
          <ResetBtn
            onClick={handleSendPasswordResetMail}
          >
            Send password reset email
          </ResetBtn>
          <RegisterLinkContainer>
            Don't have an account? <ResgiterLink to="/register">Register</ResgiterLink> now.
          </RegisterLinkContainer>
        </ResetContainer>
      </Container>
    </Wrapper>
  )
}

export default ResetPage