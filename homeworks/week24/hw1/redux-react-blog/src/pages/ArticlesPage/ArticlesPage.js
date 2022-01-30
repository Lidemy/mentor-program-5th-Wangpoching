import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Article from '../../components/Article'
import Paginator from '../../components/Paginator'
import { limit } from '../../constants/paginator'
import { Wrapper, Container, EmptyDataTitle } from '../../layout/basicLayout'
import Loading from '../../components/Loading'

import { scrollTop } from '../../utils'
import { getArticlesIfNeeded, selectAllArticles } from '../../redux/articlesSlice'

function ArticlesPage() {
  const dispatch = useDispatch()
  const { loading, articles, totalAmount, currentPage } = useSelector(selectAllArticles)
  let pageAmount
  if (totalAmount) {
    pageAmount = Math.ceil(totalAmount/limit)
  }
  const navigate = useNavigate()

  useEffect(() => {
    async function getArticles() {
      try {
        dispatch(getArticlesIfNeeded(currentPage, limit))
      } catch (error) {
        alert(error.message)
        navigate('/home')
      }
    }
    scrollTop()
    getArticles()
  }, [currentPage, navigate, dispatch])
  
  return(
    <Wrapper>
      <Container>
        {loading && <Loading />}
        {articles.length === 0 && 
          <EmptyDataTitle>還沒有任何文章。</EmptyDataTitle>
        }
        {articles.length !== 0 && articles.map(article => <Article article={article} key={article.id}/>)}
        {articles.length !== 0 && 
          <Paginator
            pageAmount={pageAmount}
            currentPage={currentPage}
            getArticlesIfNeeded={getArticlesIfNeeded}
            limit={limit}
          >ArticlesPage</Paginator>
        }
      </Container>
    </Wrapper>
  )
}

export default ArticlesPage