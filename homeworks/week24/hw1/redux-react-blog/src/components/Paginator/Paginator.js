import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { bookmarkPerPaginator } from '../../constants/paginator'
import { ReactComponent as  NextPaginator } from '../../images/pagination_next_black.svg'
import { ReactComponent as  PreviousPaginator } from '../../images/pagination_previous_black.svg'

import { strictFloor } from '../../utils'

const PaginatorContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  button + button {
    margin-left: 5px;
  }
`

const NextPaginatorIcon = styled(NextPaginator)`
  fill: ${({ theme }) => theme.button.modify};
`

const PreviousPaginatorIcon = styled(PreviousPaginator)`
  fill: ${({ theme }) => theme.button.modify};
`

const SwitchPaginatorButton = styled.button`
  background: transparent;
  display: flex;
  align-items: center;
  border: none;
`

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

function Paginator(props) {
  const { children } = props
  const navigate = useNavigate()
  let currentPage
  let page
  let getArticlesIfNeeded
  let searchArticles
  let pageAmount
  let limit
  let keyword
  if (children === 'ArticlesPage') {
    page = 'ArticlesPage';
    ({ currentPage, getArticlesIfNeeded, pageAmount, limit } = props)
  } else {
    page = 'SearchPage';
    ({ currentPage, searchArticles, pageAmount, limit, keyword } = props)
  }
  const dispatch = useDispatch()
  const firstBookmark = strictFloor(currentPage/bookmarkPerPaginator) * bookmarkPerPaginator + 1
  const bookmarkAmount = pageAmount - firstBookmark >= bookmarkPerPaginator ? bookmarkPerPaginator : (pageAmount - firstBookmark + 1)
  const fetchArticles = (currentPage, limit, keyword) => {
    if (page === 'ArticlesPage') {
      try {
        dispatch(getArticlesIfNeeded(currentPage, limit))
      } catch (err) {
        alert(err.message)
        navigate.goBack()
      }
    } else {
      dispatch(searchArticles({currentPage, limit, keyword}))
    }
  }
  const handleClick = (e) => {
    fetchArticles(Number(e.target.innerText), limit, keyword)
  }
  const handleNextPaginator = () => {
    fetchArticles(firstBookmark + bookmarkPerPaginator, limit, keyword)  
  }
  const handlePreviousPaginator = () => {
    fetchArticles(firstBookmark - bookmarkPerPaginator, keyword)
  }
  const renderBookmark = (page) => {
    return (
      <Bookmark 
        $selected={page === currentPage} 
        key={page}
        onClick={handleClick}
      >{page}
      </Bookmark>        
    )
  }
  return (
    <PaginatorContainer>
      {(firstBookmark > 1) && <SwitchPaginatorButton onClick={handlePreviousPaginator}><PreviousPaginatorIcon/></SwitchPaginatorButton>}
      {[...Array(bookmarkAmount)].map((x, index) => renderBookmark(index + firstBookmark))}
      {(pageAmount >= firstBookmark + bookmarkPerPaginator) && <SwitchPaginatorButton onClick={handleNextPaginator}><NextPaginatorIcon /></SwitchPaginatorButton>}
    </PaginatorContainer>
  )
}

Paginator.propTypes = {
  currentPage: PropTypes.number.isRequired,
  getArticlesIfNeeded: PropTypes.func,
  searchArticles: PropTypes.func,
  pageAmount: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired
}

export default Paginator
