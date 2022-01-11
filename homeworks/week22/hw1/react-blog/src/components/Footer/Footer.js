import styled from '@emotion/styled/macro'
import { ReactComponent as GithubIcon } from '../../images/github.svg'
import { ReactComponent as MailIcon } from '../../images/email.svg'
import {
  MEDIA_QUERY_SM
} from '../../constants/breakpoints'

const FooterContainer = styled.div`
  padding: 30px 50px;

  ${MEDIA_QUERY_SM} {
    margin: 30px auto 0 auto;
    padding: 20px 30px;
  }
`

const PersonalInfoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
  color: ${({ theme }) => theme.text.second};
`

const SourceContainer = styled(PersonalInfoContainer)`
  margin-top: 5px;
`

const IconLink = styled.a`
  display: flex;
  margin-left: 15px;
  text-decoration: none;
  transition: 0.3s;
  svg {
    height: 16px;
    fill: ${({ theme }) => theme.text.second};
  }
  &:hover {
    svg {
      fill: ${({ theme }) => theme.primary};
    }
  }
`

const Source = styled.a`
  display: flex;
  text-decoration: none;
  font-size: 12px;
  color: ${({ theme }) => theme.text.third};
  border-radius: 2px;
  transition: 0.3s;
  :hover {
    color: ${({ theme }) => theme.text.primary};
  }
`
function Footer() {
  return (
    <FooterContainer>
      <PersonalInfoContainer>
        <p>Peter Wang</p>
        <IconLink 
          href="https://github.com/wangpoching" 
          target="_blank"
        >
          <GithubIcon />
        </IconLink>
        <IconLink 
          href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=wangpeter588@gmail.com" 
          target="_blank"
        >
          <MailIcon />
        </IconLink>
      </PersonalInfoContainer>
      <SourceContainer>
          <Source 
            href="https://github.com/wangpoching" 
            target="_blank"
          >
            Source Code
          </Source>
      </SourceContainer>
    </FooterContainer>
  )
}

export default Footer
