import styled from '@emotion/styled'
import { bookmarkPerPaginator } from '../constants/paginator'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { strictFloor } from '../utils'

const Bookmark = styled.button`
  display: flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 3px;
  text-decoration: none;
  font-size: 15px;
  color: ${({ theme, $selected }) => $selected ? theme.background.body : theme.button.modify};
  border: 1px solid ${({ theme }) => theme.button.modify};
  transition: 0.3s;
  background-color: ${({ theme, $selected }) => $selected ? theme.button.modify : 'transparent'};
  &:hover {
    background-color: ${({ theme }) => theme.button.modify};
    color: ${({ theme }) => theme.background.body};
  }
`

const usePaginator = (props) => {
  // 取得變數
  const { children, currentPage, pageAmount, limit } = props
  let getArticlesIfNeeded
  let searchArticles
  let keyword
  if (children === 'ArticlesPage') {
    ({ getArticlesIfNeeded } = props)
  } else {
    ({ searchArticles, keyword } = props)
  }

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // 取得文章
  const fetchArticles = async (currentPage, limit, keyword) => {
    try {
      // 所有文章
      if (children === 'ArticlesPage') {
        dispatch(getArticlesIfNeeded(currentPage, limit))
      } else {
      // 搜尋文章
        await dispatch(searchArticles({currentPage, limit, keyword})).unwrap()
      }
    } catch (err) {
      alert(err.message)
      navigate.goBack()
    }
  }

  const handleChangePage = (e) => {
    fetchArticles(Number(e.target.innerText), limit, keyword)
  }
  const handleNextPaginator = () => {
    fetchArticles(firstBookmark + bookmarkPerPaginator, limit, keyword)  
  }
  const handlePreviousPaginator = () => {
    fetchArticles(firstBookmark - bookmarkPerPaginator, keyword)
  }
  // 產生頁籤
  const renderBookmark = (page) => {
    return (
      <Bookmark 
        $selected={page === currentPage} 
        key={page}
        onClick={handleChangePage}
      >{page}
      </Bookmark>        
    )
  }
  // 第一個頁籤的標籤 => 第 n 組 Paginator *  Paginator 包含的頁籤數目 + 1
  const firstBookmark = strictFloor(currentPage/bookmarkPerPaginator) * bookmarkPerPaginator + 1
  // 檢查是不是最後一個 Paginator? 如果是的話頁籤數目 = 總頁數 - 第一個頁籤顯示的頁數 + 1
  const bookmarkAmount = pageAmount - firstBookmark >= bookmarkPerPaginator ? bookmarkPerPaginator : (pageAmount - firstBookmark + 1)

  return [
    firstBookmark,
    bookmarkAmount,
    pageAmount,
    bookmarkPerPaginator,
    handleNextPaginator,
    handlePreviousPaginator,
    renderBookmark
  ]
}

export default usePaginator

