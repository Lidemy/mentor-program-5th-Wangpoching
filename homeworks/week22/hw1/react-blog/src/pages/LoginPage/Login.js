import styled from '@emotion/styled'
import { AuthContext } from '../../context'
import { useEffect, useState, useContext, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInByEmailAndPassword, signInWithGoogle } from '../../firebase'
import { ReactComponent as OpenEyeIcon } from '../../images/visibility.svg'
import { ReactComponent as CloseEyeIcon } from '../../images/visibility_off.svg'
import Loading from '../../components/Loading'
import { Wrapper, Container } from '../../layout/basicLayout'
import { MEDIA_QUERY_SM } from '../../constants/breakpoints'

const LoginContainer = styled.div`
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
  svg {
    cursor: pointer;
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    fill: ${({ theme }) => theme.button.submit};    
  }
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

const LoginBtn = styled.button`
  padding: 10px;
  font-size: 18px;
  margin-bottom: 10px;
  border: none;
  color: ${({ theme }) => theme.text.negative};
  background-color: ${({ theme }) => theme.button.submit};
  border-radius: 3px;
`

const LoginGoogleBtn = styled(LoginBtn)`
  background-color: ${({ theme }) => theme.button.google};
  border-radius: 3px;
`

const RegisterLink = styled(Link)`
  transition: all 0.3s ease 0s;
  color: ${({ theme }) => theme.text.remind};
  &:hover {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
  }
`

const ResetLink = styled(RegisterLink)`
`

const ResetLinkContainer = styled.div`
  color: ${({ theme }) => theme.text.primary};
`

const RegisterLinkContainer = styled(ResetLinkContainer)`
`

const ErrorMessage = styled.div`
  width: fit-content;
  color: ${({ theme }) => theme.error};
  margin: 0 auto;
  margin-bottom: 5px;
`


function Login() {
  const { user, loading } = useContext(AuthContext)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSignInByEmailAndPassword = useCallback(
    async () => {
      setErrorMessage('')
      if (!email || !password) {
        setErrorMessage('電子郵件及密碼不可為空')
        return
      }
      setIsLoading(true)
      try {
        await signInByEmailAndPassword(email, password)
        setIsLoading(false)
      } catch (err) {
        setErrorMessage(err.message)
        setIsLoading(false)
      }
    }, [email , password]
  )

  const handleSignInWithGoogle = useCallback(
    async () => {
      setErrorMessage('')
      setIsLoading(true)
      try {
        await signInWithGoogle()
        setIsLoading(false)
      } catch (err) {
        setErrorMessage(err.message)
        setIsLoading(false)
      }
    }, []
  )
  
  const handleShowPassword = () => {
    setShowPassword((pre) => !pre)
  }
  const handleFocus = () => {
    setErrorMessage('')
  }
  const handleChange = (e) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value)
    }
    if (e.target.name === 'password') {
      setPassword(e.target.value)
    }
  }
  
  useEffect(() => {
    if (isLoading) return
    if (loading) return
    if (user) navigate('/home')
  }, [user, loading, navigate, isLoading])

  return (
    <Wrapper>
      <Container>
        <LoginContainer>
          {isLoading && <Loading />}
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <InputContainer>
            <Input
              type="text"
              name="email"
              value={email}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="E-mail Address"
            />
          </InputContainer>
          <InputContainer>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="Password"
            />
            {showPassword ? <CloseEyeIcon onClick={handleShowPassword}/> : <OpenEyeIcon onClick={handleShowPassword}/>}
          </InputContainer>
          <LoginBtn
            onClick={handleSignInByEmailAndPassword}
          >
            Login
          </LoginBtn>
          <LoginGoogleBtn
            onClick={handleSignInWithGoogle}
          >
            Login with Google
          </LoginGoogleBtn>
          <ResetLinkContainer>
            <ResetLink to="/reset">Forgot Password</ResetLink>
          </ResetLinkContainer>
          <RegisterLinkContainer>
            Don't have an account? <RegisterLink to="/register">Register</RegisterLink> now.
          </RegisterLinkContainer>
        </LoginContainer>
      </Container>
    </Wrapper>
  )
}

export default Login