import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import usePaginator from '../../hooks/usePaginator'
import { ReactComponent as  NextPaginator } from '../../images/pagination_next_black.svg'
import { ReactComponent as  PreviousPaginator } from '../../images/pagination_previous_black.svg'

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

function Paginator(props) {
  const [
    firstBookmark,
    bookmarkAmount,
    pageAmount,
    bookmarkPerPaginator,
    handleNextPaginator,
    handlePreviousPaginator,
    renderBookmark
  ] = usePaginator(props)


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
