import styled from '@emotion/styled'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import draftToHtml from 'draftjs-to-html'
import { useDispatch, useSelector } from 'react-redux'

import Loading from '../../components/Loading'
import Reminder from '../../components/Reminder'
import { Wrapper, Container } from '../../layout/basicLayout'
import { MEDIA_QUERY_MD } from '../../constants/breakpoints'
import { ReactComponent as Back } from '../../images/back.svg'

import { formatTime, scrollTop } from '../../utils'
import { 
  getSingleArticleIfNeeded,
  deleteArticle, 
  fetchCsrfToken, 
  didInvalidate,
  selectSingleArticle
} from '../../redux/articlesSlice'
import { selectCurrentUser } from '../../redux/usersSlice'

const ArticleContainer = styled.div`
  width: 100%;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.boxShadow.second};
  background-color: ${({ theme }) => theme.background.opacity};
`;

const ArticleHeader = styled.div`
  display: flex;
  align-items: center;
  flex-flow: wrap;
  justify-content: flex-start;
  width: 100%;
  border-radius: 10px 10px 0 0;
  box-shadow: ${({ theme }) => theme.boxShadow.float};
  padding: 20px 25px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.background.header};
  color: ${({ theme }) => theme.text.primary};
`

const ArticleTitle = styled.div`
  font-size: 24px;
  margin-left: 10px;
  flex-basis: 72%;

  ${MEDIA_QUERY_MD} {
    flex-basis: 78%;
  }
`

const BackIcon = styled(Back)`
  height: 100%;
  fill: ${({ theme }) => theme.text.primary};
`

const ArticleBody = styled.div`
  padding: 25px;
`
const ArticleContent = styled.p`
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.5;
  font-size: 17px;
  word-break: break-word;
`

const ArticleInfo = styled.div`
  margin-bottom: 30px;
  div + div {
    margin-top: 5px;
  }
`
const ArticleAuthor = styled.div`
  color: ${({ theme }) => theme.text.second};
  font-size: 12px;
  white-space: pre-wrap;
`

const ArticleDate = styled.div`
  color: ${({ theme }) => theme.text.second};
  font-size: 12px;
  white-space: pre-wrap;
`

const ArticlesLink = styled(Link)`
  align-self: baseline;
  height: 30px;
`

const ArticleToolBar = styled.div`
  display: flex;
  margin-left: auto;
  ${MEDIA_QUERY_MD} {
    margin: 0 auto;
    margin-top: 15px;
  }
`

const ArticleEdit = styled(Link)`
  display: flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 3px;
  text-decoration: none;
  font-size: 15px;
  color: ${({ theme }) => theme.button.modify};
  border: 1px solid ${({ theme }) => theme.button.modify};
  transition: 0.3s;
  &:hover {
    background-color: ${({ theme }) => theme.button.modify};
    color: ${({ theme }) => theme.background.body};
  }
`

const ArticleDelete = styled.div`
  display: flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 3px;
  margin-left: 15px;
  cursor: pointer;
  color: ${({ theme }) => theme.button.modify};
  border: 1px solid ${({ theme }) => theme.button.modify};
  transition: 0.3s;
  &:hover {
    background-color: ${({ theme }) => theme.button.modify};
    color: ${({ theme }) => theme.background.body};
  }
`

function ArticlePage() {
  const [showReminder, setShowReminder] = useState(false)
  let { id } = useParams()
  id = Number(id)
  const { article, loading, csrfToken } = useSelector(selectSingleArticle)
  const { currentUser } = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleGetCsrfToken = useCallback(
    async () => {
      if (!csrfToken) {
        try {
          await dispatch(fetchCsrfToken(id)).unwrap()
        } catch (err) {
          alert('刪除文章發生問題')
          return
        }
      }
      setShowReminder(true)
    }, [id, csrfToken, dispatch]
  )

  const handleDeleteArticle = useCallback(
    async (csrfToken) => {
      try{
        await dispatch(deleteArticle({id, csrfToken})).unwrap()
        dispatch(didInvalidate())
        navigate('/articles')
        return
      } catch (err) {
        alert('刪除失敗')
        setShowReminder(false)
      }    
    }, [id, navigate, dispatch]
  )

  useEffect(() => {
    scrollTop()
    const fetchArticle = async () => {
      try {
        dispatch(getSingleArticleIfNeeded(id))
      } catch (err) {
        alert('獲取文章失敗')
        navigate('/articles')
      }
    }
    fetchArticle()
  }, [id, dispatch, navigate])

  return (
    <Wrapper>
      <Container>
      {loading && <Loading />}
        {article &&
          <ArticleContainer>
            <Reminder 
              $showReminder={showReminder} 
              handleDeleteArticle={handleDeleteArticle}
              csrfToken={csrfToken}
              setShowReminder={setShowReminder}
            />
            <ArticleHeader>
              <ArticlesLink to='/articles'>
                <BackIcon />
              </ArticlesLink>
              <ArticleTitle>
                {article.title}
              </ArticleTitle>
              {currentUser && article.authorUid === currentUser && 
                <ArticleToolBar>
                  <ArticleEdit to={`/edit/${article.id}`}>
                    編輯
                  </ArticleEdit>
                  <ArticleDelete onClick={handleGetCsrfToken}>
                    刪除
                  </ArticleDelete>
                </ArticleToolBar>
              }
            </ArticleHeader>
            <ArticleBody>
              <ArticleInfo>
                <ArticleAuthor>{`作者:  ${article.name}`}</ArticleAuthor>
                <ArticleDate>{`時間:  ${formatTime(article.createdAt)}`}</ArticleDate>
              </ArticleInfo>
              <ArticleContent 
                dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(article.content)) }}
              >
              </ArticleContent>
            </ArticleBody>
          </ArticleContainer>
        }
      </Container>
    </Wrapper>
  )
}

export default ArticlePage
