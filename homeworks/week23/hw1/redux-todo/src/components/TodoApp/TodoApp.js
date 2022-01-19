import styled from '@emotion/styled/macro'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from '../../reducers'
import AddTodo from '../../containers/AddTodo'
import Todos from '../../containers/Todos'
import FunctionColumn from '../../containers/FunctionColumn'
import { MEDIA_QUERY_MD } from '../../constants/breakpoints'

const Container = styled.div`
  min-height: 800px;
  height: 100%;
  padding: 10px;
  background-color: #ededed;
`;

const TodoCard = styled.div`
  position: relative;
  margin-right: auto;
  margin-left: auto;
  max-width: 760px;
  background-color: #FFFDE7;
  margin-top: 100px;
  padding: 15px 20px;
  box-shadow: 2px 2px 6px #cccccc;
  color: #189BA3;
  :before,:after {
    content: '';
    position: absolute;
    top: 30px;
    display: block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #6fc6cc;
    box-shadow: 3px 3px 4px #cccccc;
  }
  :before {
    left: 30px
  }
  :after {
    right: 30px
  }
`

const Title = styled.h1`
  font-size: 64px;
  margin: 20px 0 15px;
  text-align: center;

  ${MEDIA_QUERY_MD} {
    font-size: 32px;
  }
`

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
store.subscribe(() => {
  window.localStorage.setItem('todos', JSON.stringify(store.getState().todos))
})

export default function TodoApp() {
  return (
    <Provider store={store}>
      <Container>
        <TodoCard>
          <Title>Todo List</Title>
          <AddTodo />
          <Todos />
          <FunctionColumn />
        </TodoCard>
      </Container>
    </Provider>
  )
}