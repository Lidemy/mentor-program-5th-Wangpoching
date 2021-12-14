// STEP 1：載入 emotion 的 styled 套件
import styled from '@emotion/styled/macro';
import Todo from '../Todo';
import { useContext } from 'react';
import { TodoContext } from '../TodoApp/TodoApp.js'

const Container = styled.ul`
  list-style-type: none;
  padding: 0;
`

function Todos() {
  const { todos } = useContext(TodoContext)
  return (
    <Container>
      {todos.filter((todo) => todo.isShow).map((todo) => <Todo todo={todo} key={todo.id}/>)}
    </Container>
  );
}

export default Todos;
