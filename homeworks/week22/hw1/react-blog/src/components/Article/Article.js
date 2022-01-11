import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { formatTime } from '../../utils'
import { MEDIA_QUERY_SM } from '../../constants/breakpoints'
import PropTypes from 'prop-types'


const ArticleContainer = styled(Link)`
  text-decoration: none;
  display: block;
  padding: 25px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.text.primary};
  transition: all 0.3s ease 0s;
  background-color: ${({ theme }) => theme.background.opacity};
  box-shadow: ${({ theme }) => theme.boxShadow.second};
  :hover {
    opacity: 0.5;
  }

  ${MEDIA_QUERY_SM} {
    padding: 20px;
  }
`

const ArticleTitle = styled.div`
  color: ${({ theme }) => theme.text.primary};
  font-size: 22px;
  font-weight: 500;

  ${MEDIA_QUERY_SM} {
    font-size: 20px;
  }
`

const ArticleContent = styled.div`
  color: ${({ theme }) => theme.text.second};
  margin-top: 10;
  p {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

const ArticleInfo = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.text.second};
  div {
    font-size: 12px;
  }
`

function Article({ article }) {
  return(
    <ArticleContainer to={`/article/${article.id}`}>
      <ArticleTitle>
        {article.title}
      </ArticleTitle>
      <ArticleContent>
        <p>{article.plainContent}</p>
      </ArticleContent>
      <ArticleInfo>
        <div>{article.name}</div>
        <div>{formatTime(article.createdAt)}</div>
      </ArticleInfo>      
    </ArticleContainer>
  )
}

Article.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    authorUid: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    plainContent: PropTypes.string,
    createdAt: PropTypes.string
  })
}

export default Article

