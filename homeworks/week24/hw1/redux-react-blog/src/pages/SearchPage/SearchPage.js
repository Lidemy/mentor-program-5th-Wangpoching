import styled from '@emotion/styled'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import Article from '../../components/Article'
import Paginator from '../../components/Paginator'
import Loading from '../../components/Loading'
import { limit } from '../../constants/paginator'
import { Wrapper, Container, EmptyDataTitle } from '../../layout/basicLayout'
import { MEDIA_QUERY_SM } from '../../constants/breakpoints'

import { searchArticles } from '../../redux/articlesSlice'

const Title = styled.p`
  margin-bottom: 30px;
  font-size: 22px;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.8;
  span {
    font-size: 22px;
    font-weight: 500;
    line-height: 1.8;
    border-bottom: 1px dotted ${({ theme }) => theme.text.second};
  }

  ${MEDIA_QUERY_SM} {
    font-size: 20px;
    span {
      font-size: 20px;
    }
  }
`

function SearchPage() {
  const { loading, articles, totalAmount, currentPage } = useSelector(state => state.article.searchArticles)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let pageAmount
  if (totalAmount) {
    pageAmount = Math.ceil(totalAmount/limit)
  }
  let { keyword } = useParams()

  useEffect(() => {
    async function searchArticlesByKeyword() {
      try {
        await dispatch(searchArticles({currentPage, limit, keyword})).unwrap()
      } catch (error) {
        alert('搜尋文章發生問題')
        navigate('/home')
      }
    }
    searchArticlesByKeyword()
  }, [currentPage, keyword, navigate, dispatch])

  return(
    <Wrapper>
      <Container>
        {loading && <Loading />}
        {articles.length === 0 ? (
          <EmptyDataTitle>沒有相關的文章。</EmptyDataTitle>
        ) : (
          <Title>
            以下是與「<span>{keyword}</span>」相符的文章
          </Title>
        )}
        {articles.map(article => <Article article={article} key={article.id}/>)}
        {articles.length !== 0 && 
          <Paginator
            pageAmount={pageAmount}
            currentPage={currentPage}
            searchArticles={searchArticles}
            limit={limit}
            keyword={keyword}
          >SearchPage</Paginator>
        }
      </Container>
    </Wrapper>
  )
}

export default SearchPage