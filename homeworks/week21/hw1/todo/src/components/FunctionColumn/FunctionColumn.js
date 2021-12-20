import styled from '@emotion/styled/macro';
import { useContext, useMemo, useState, useCallback } from 'react'
import { TodoContext } from '../TodoApp/TodoApp.js'
import { ThemeProvider } from '@emotion/react'
import { MEDIA_QUERY_MD } from '../../constants/breakpoints'

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

const StateSwitcher = styled.div`
  display: flex;
  justify-content: space-between
`

const StateAll = styled.button`
  cursor: pointer;
  background: none;
  color: inherit;
  border: 2px solid transparent;
  padding: 0 10px;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  border-color: ${(props) => props.theme.selectedState === 'show-all' ? 'rgba(175, 47, 47, 0.2);' : 'transparent;'}
  ${MEDIA_QUERY_MD} {
    font-size: 12px
  }
`
const StateActive = styled.button`
  cursor: pointer;
  background: none;
  color: inherit;
  border: 2px solid transparent;
  padding: 0 10px;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  border-color: ${(props) => props.theme.selectedState === 'show-active' ? 'rgba(175, 47, 47, 0.2);' : 'transparent;'}
  ${MEDIA_QUERY_MD} {
    font-size: 12px
  }
`
const StateCompleted = styled.button`
  cursor: pointer;
  background: none;
  color: inherit;
  border: 2px solid transparent;
  padding: 0 10px;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  border-color: ${(props) => props.theme.selectedState === 'show-completed' ? 'rgba(175, 47, 47, 0.2);' : 'transparent;'}
  ${MEDIA_QUERY_MD} {
    font-size: 12px
  }
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

const computeNumberCompleted = (todos) => (
  todos.filter((todo) => !todo.isDone).length
)

export default function FunctionColumn() {
  const [selectedState, setselectedState] = useState('show-all')
  const { todos, setTodos } = useContext(TodoContext)
  const numCompleted = useMemo(() => computeNumberCompleted(todos), [todos])

  const handleSwitchSelectedState = (e) => {
    const { classList } = e.target
    if (!classList.contains('button-switch')) return
    setTodos((preState) => {
      return preState.map((todo) => ({
        ...todo,
        isShow: classList.contains('show-all') ? true : classList.contains('show-active') ? !todo.isDone : todo.isDone
      }))
    })
    setselectedState(classList[0])
  }

  const handleClearCompleted = useCallback(
    () => {
      setTodos((preState) => {
        return preState.filter((todo) => !todo.isDone)
      })    
    }, [setTodos])

  const theme = {
    selectedState
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Counter>{numCompleted} items left</Counter>
        <StateSwitcher onClick={handleSwitchSelectedState}>
          <StateAll className="show-all button-switch">All</StateAll>
          <StateActive className="show-active button-switch">Active</StateActive>
          <StateCompleted className="show-completed button-switch">Completed</StateCompleted>
        </StateSwitcher>
        <ClearCompletedButton onClick={handleClearCompleted}>Clear completed</ClearCompletedButton>
      </Container>
    </ThemeProvider>
  )
}
