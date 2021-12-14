import styled from '@emotion/styled/macro';
import InputBox from '../InputBox';
import Todos from '../Todos';
import FunctionColumn from '../FunctionColumn';
import { createContext } from 'react';
import useTodoApi from '../../API/useTodoApi'
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

export const TodoContext = createContext()

export default function TodoApp() {
  const [ id, todos, setTodos, inputTodoRef, handleAddTodo ] = useTodoApi()
  return (
    <TodoContext.Provider value={{todos, setTodos, id, inputTodoRef, handleAddTodo }}>
      <Container>
        <TodoCard>
          <Title>Todo List</Title>
          <InputBox />
          <Todos />
          <FunctionColumn />
        </TodoCard>
      </Container>
    </TodoContext.Provider>
  );
}