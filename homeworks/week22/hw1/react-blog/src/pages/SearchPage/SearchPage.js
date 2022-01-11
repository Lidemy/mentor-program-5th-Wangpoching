import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePaginator } from '../../hooks/usePaginator'
import Article from '../../components/Article'
import Paginator from '../../components/Paginator'
import Loading from '../../components/Loading'
import { limit } from '../../constants/paginator'
import { getArticles } from '../../WebAPI'
import { useParams } from 'react-router-dom'
import { Wrapper, Container, EmptyDataTitle } from '../../layout/basicLayout'
import { MEDIA_QUERY_SM } from '../../constants/breakpoints'

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
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const [currentPage, setCurrentPage, setArticleAmount, pageAmount] = usePaginator(limit)
  let { keyword } = useParams()

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await getArticles(currentPage, limit, keyword)
        if (!response.ok) {
          alert('搜尋文章發生問題')
          setIsLoading(false)
          navigate('/home')
          return
        }
        const res = await response.json()
        setArticleAmount(Number(response.headers.get('article-amount')))
        setArticles(res.data)
        setIsLoading(false)
      } catch (error) {
        alert('搜尋文章發生問題')
        setIsLoading(false)
        navigate('/home')
      }
    }
    fetchArticles()
  }, [currentPage, setArticleAmount, keyword, navigate])

  return(
    <Wrapper>
      <Container>
        {isLoading && <Loading />}
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
            setCurrentPage={setCurrentPage}
          />
        }
      </Container>
    </Wrapper>
  )
}

export default SearchPage