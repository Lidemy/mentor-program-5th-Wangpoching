import styled from '@emotion/styled/macro'
import { MEDIA_QUERY_MD } from '../../constants/breakpoints'

const TodoFilter = styled.button`
  cursor: pointer;
  background: none;
  color: inherit;
  border: 2px solid transparent;
  padding: 0 10px;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  border-color: ${({ $active }) => $active ? 'inherit' : 'transparent'};

  ${MEDIA_QUERY_MD} {
    font-size: 12px
  }
`

export default function Filter({ active, setVisibiltyFilter, children }) {
  return (
    <TodoFilter
      onClick={setVisibiltyFilter}
      $active={active}
    >
      {children}
    </TodoFilter>
  )
}
