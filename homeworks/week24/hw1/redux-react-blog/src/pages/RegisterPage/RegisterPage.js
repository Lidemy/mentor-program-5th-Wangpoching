import styled from '@emotion/styled'
import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { ReactComponent as OpenEyeIcon } from '../../images/visibility.svg'
import { ReactComponent as CloseEyeIcon } from '../../images/visibility_off.svg'
import { Wrapper, Container } from '../../layout/basicLayout'
import { MEDIA_QUERY_SM } from '../../constants/breakpoints'
import Loading from '../../components/Loading'

import { register, googleSignIn, selectCurrentUser } from '../../redux/usersSlice'

const RegisterContainer = styled.div`
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

const LoginLink = styled(Link)`
  transition: all 0.3s ease 0s;
  color: ${({ theme }) => theme.text.remind};
  &:hover {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
  }
`

const LoginLinkContainer = styled.div`
  color: ${({ theme }) => theme.text.primary};
`

const ErrorMessage = styled.div`
  width: fit-content;
  color: ${({ theme }) => theme.error};
  margin: 0 auto;
  margin-bottom: 5px;
`

function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [errorMessage, setErrorMessage] = useState('')
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [doubleCheckPassword, setDoubleCheckPassword] = useState('')
  const [name, setName] = useState('')
  const { currentUser, loading } = useSelector(selectCurrentUser)

  const handleRegisterWithEmailAndPassword = useCallback(
    async () => {
      if (!name || !email || !password) {
        setErrorMessage('電子郵件、密碼及使用者名稱不可為空')
        return
      }
      if (password !== doubleCheckPassword) {
        setErrorMessage('兩次密碼輸入不同，請重新確認')
        return        
      }
      try {
        setErrorMessage('')
        await dispatch(register({email, password, name})).unwrap()
      } catch (err) {
        setErrorMessage(err.message)
      }
    }, [name, email, password, doubleCheckPassword, dispatch]
  )

  const handleSignInWithGoogle = useCallback(
    async () => {
      try {
        setErrorMessage('')
        await dispatch(googleSignIn()).unwrap()
      } catch (err) {
        setErrorMessage(err.message)
      }
    }, [dispatch]
  )

  const handleShowPassword = (e) => {
    setShowPassword((pre) => !pre)
  }
  const handleFocus = () => {
    setErrorMessage('')
  }
  const handleChange = (e) => {
    const { value, name } = e.target
    switch (name) {
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      case 'name':
        setName(value)
        break
      case 'doublecheck-password':
        setDoubleCheckPassword(e.target.value)
        break
      default:
        return
    }
  }

  useEffect(() => {
    if (loading) return
    if (currentUser) {
      navigate('/home')
    }
  }, [currentUser, loading, navigate])
  
  return (
    <Wrapper>
      <Container>
        <RegisterContainer>
          {loading && <Loading />}
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <InputContainer>
            <Input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="Full Name"
            />
          </InputContainer>
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
              placeholder='Password'
            />
            {
              showPassword ? 
              <CloseEyeIcon
                onClick={handleShowPassword}
              /> : 
              <OpenEyeIcon
                onClick={handleShowPassword}
              />
            }
          </InputContainer>
          <InputContainer>
            <Input
              type={showPassword ? "text" : "password"}
              name="doublecheck-password"
              value={doubleCheckPassword}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder='Double Check Password'
            />
            {
              showPassword ? 
              <CloseEyeIcon
                onClick={handleShowPassword}
              /> : 
              <OpenEyeIcon
                onClick={handleShowPassword}
              />
            }
          </InputContainer>
          <LoginBtn 
            onClick={handleRegisterWithEmailAndPassword}
          >
            Register
          </LoginBtn>
          <LoginGoogleBtn
            onClick={handleSignInWithGoogle}
          >
            Register with Google
          </LoginGoogleBtn>
          <LoginLinkContainer>
            Already have an account? <LoginLink to='/'>Login</LoginLink> now.
          </LoginLinkContainer>
        </RegisterContainer>
      </Container>
    </Wrapper>
  )
}

export default RegisterPage