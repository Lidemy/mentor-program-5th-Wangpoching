import styled from '@emotion/styled'
import { ReactComponent as  NextPaginator } from '../../images/pagination_next_black.svg'
import { ReactComponent as  PreviousPaginator } from '../../images/pagination_previous_black.svg'
import { bookmarkPerPaginator } from '../../constants/paginator'
import { strictFloor } from '../../utils'
import PropTypes from 'prop-types'

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

function Paginator({ currentPage, setCurrentPage, pageAmount }) {
  const firstBookmark = strictFloor(currentPage/bookmarkPerPaginator) * bookmarkPerPaginator + 1
  const bookmarkAmount = pageAmount - firstBookmark >= bookmarkPerPaginator ? bookmarkPerPaginator : (pageAmount - firstBookmark + 1)
  const handleClick = (e) => {
    setCurrentPage(Number(e.target.innerText))
  }
  const handleNextPaginator = () => {
    setCurrentPage(firstBookmark + bookmarkPerPaginator)
  }
  const handlePreviousPaginator = () => {
    setCurrentPage(firstBookmark - bookmarkPerPaginator)
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
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func, 
  pageAmount: PropTypes.number
}

export default Paginator
