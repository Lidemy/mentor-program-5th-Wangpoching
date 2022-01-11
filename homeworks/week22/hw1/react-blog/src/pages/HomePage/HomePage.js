import styled from '@emotion/styled'
import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../context.js'
import { ReactComponent as Gossip } from '../../images/gossip.svg'
import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as  Bulb } from '../../images/bulb_black.svg'
import { Wrapper } from '../../layout/basicLayout'
import { scrollTop } from '../../utils'
import {
  MEDIA_QUERY_SM,
  MEDIA_QUERY_MD,
  MEDIA_QUERY_LG
} from '../../constants/breakpoints'

const Banner = styled.div`
  margin: 170px auto;
  padding: 0px 30px;
  max-width: 1200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${MEDIA_QUERY_LG} {
    margin: 100px auto;
    padding: 0 80px;
    max-width: 1100px;
  }
  ${MEDIA_QUERY_MD} {
    justify-content: center;
    flex-direction: column-reverse; /*banner 圖片在上*/
  }
  ${MEDIA_QUERY_SM} {
    margin: 60px auto 50px auto;
    padding: 0 30px;
  }
`

const SlogonContainer = styled.div`
  flex-basis: 27%;
  line-height: 1.5;

  ${MEDIA_QUERY_MD} {
    margin-top: 60px;
    width: 100%; /*column 排版寬度滿幅*/
  }
`

const SlogonTitle = styled.h1`
  margin-bottom: 15px;
  font-size: 34px;
  color: ${({ theme }) => theme.text.primary}
`

const SlogonContent = styled.p`
  color: ${({ theme }) => theme.text.second}
`

const GossipIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 64%;
  max-width: 700px;
  align-items: center;

  ${MEDIA_QUERY_MD} {
    width: 100%;
  }
`

const ArrowIcon = styled(Arrow)`
  position: absolute;
  right: 18px;
  height: 100%;
  font-size: 15px;
  transition: all 0.3s ease 0s;
`

const AllArticlesLink = styled(Link)`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  padding: 8px 40px 8px 20px;
  border-radius: 20px;
  background-color: rgb(0, 81, 195);
  text-decoration: none;
  color: rgb(255, 255, 255);
  z-index: 0;
  :hover svg {
    right: 15px;
  }
`

const GossipIcon = styled(Gossip)`
  width: 100%
`

const BulbIcon = styled(Bulb)`
  fill: #FFFF37;
  width: 30%;
  flex-basis: 30%;
  visibility: ${({ theme }) => theme === 'dark' ? 'visible' : 'hidden'};
`

function HomePage() {
  const { theme } = useContext(ThemeContext) //首頁的燈要判斷 theme 的狀態

  useEffect(() => {
    scrollTop()
  }, [])

  return (
    <Wrapper>
      <Banner>
        <SlogonContainer>
          <SlogonTitle>Jibber Jabber</SlogonTitle>
          <SlogonContent> Who can be the Olympic gold medalist of jibber-jabber? </SlogonContent>
          <AllArticlesLink to='/articles'>
            所有文章
            <ArrowIcon></ArrowIcon>
          </AllArticlesLink>
        </SlogonContainer>
        <GossipIconContainer>
          <BulbIcon theme={theme}/>
          <GossipIcon />
        </GossipIconContainer>
      </Banner>
    </Wrapper>
  )
}

export default HomePage

