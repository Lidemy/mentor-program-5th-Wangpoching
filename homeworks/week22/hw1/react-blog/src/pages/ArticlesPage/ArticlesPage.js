import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePaginator } from '../../hooks/usePaginator'
import Article from '../../components/Article'
import Paginator from '../../components/Paginator'
import Loading from '../../components/Loading'
import { limit } from '../../constants/paginator'
import { getArticles } from '../../WebAPI'
import { Wrapper, Container, EmptyDataTitle } from '../../layout/basicLayout'
import { scrollTop } from '../../utils'

function ArticlesPage() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage, setArticleAmount, pageAmount] = usePaginator(limit)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchArticles() {
      try {
        setIsLoading(true)
        const response = await getArticles(currentPage, limit)
        if (!response.ok) {
          alert('取得文章失敗')
          setIsLoading(false)
          navigate('/home')
          return
        }
        const res = await response.json()
        setArticleAmount(Number(response.headers.get('article-amount')))
        setArticles(res.data)
        setIsLoading(false)
      } catch (error) {
        alert('取得文章失敗')
        setIsLoading(false)
        navigate('/home')
      }
    }
    scrollTop()

    fetchArticles()
  }, [currentPage, setArticleAmount, navigate])
  
  return(
    <Wrapper>
      <Container>
        {isLoading && <Loading />}
        {articles.length === 0 && 
          <EmptyDataTitle>還沒有任何文章。</EmptyDataTitle>
        }
        {articles.length !== 0 && articles.map(article => <Article article={article} key={article.id}/>)}
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

export default ArticlesPage