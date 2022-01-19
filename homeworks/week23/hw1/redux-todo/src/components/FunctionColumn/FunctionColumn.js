import styled from '@emotion/styled/macro'
import { useCallback } from 'react'
import { MEDIA_QUERY_MD } from '../../constants/breakpoints'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../../constants/TodoFilters'
import Filter from '../../containers/Filter'

const Container = styled.div`
  display: flex;
  justify-content: space-between
`

const Counter = styled.div`
  text-align: center;
  
  ${MEDIA_QUERY_MD} {
    font-size: 12px;
  }
`

const FilterSwitcher = styled.div`
  display: flex;
  justify-content: space-between
`

const ClearCompletedButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;

  ${MEDIA_QUERY_MD} {
    font-size: 12px
  }
`

export default function FunctionColumn({ activeCount, clearCompleted }) {
  const handleClearCompleted = useCallback(
    () => {
      clearCompleted()
    }, [clearCompleted])
  const isOnlyItem = activeCount > 1
  return (
    <Container>
      <Counter>{`${activeCount} ${isOnlyItem ? 'items' : 'item'} left`}</Counter>
      <FilterSwitcher>
        <Filter filter={SHOW_ALL}>All</Filter>
        <Filter filter={SHOW_COMPLETED}>Active</Filter>
        <Filter filter={SHOW_ACTIVE}>Completed</Filter>
      </FilterSwitcher>
      <ClearCompletedButton 
        onClick={handleClearCompleted}
      >
        Clear completed
      </ClearCompletedButton>
    </Container>
  )
}
