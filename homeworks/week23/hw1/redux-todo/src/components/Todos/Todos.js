import styled from '@emotion/styled/macro'
import Todo from '../Todo'

const Container = styled.ul`
  list-style-type: none;
  padding: 0;
`

function Todos({ todos, deleteTodo, editTodo, toggleTodo }) {
  return (
    <Container>
      {todos.map((todo) => 
        <Todo 
          todo={todo} 
          key={todo.id}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
          toggleTodo={toggleTodo}
        />
      )}
    </Container>
  )
}

export default Todos
