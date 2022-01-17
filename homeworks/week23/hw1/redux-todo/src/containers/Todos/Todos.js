import { connect } from 'react-redux'
import {
  deleteTodo,
  editTodo,
  toggleTodo
} from '../../actionsCreator'
import Todos from '../../components/Todos'
import { getVisibleTodos } from '../../selectors'

const mapStateToProps = state => ({
  todos: getVisibleTodos(state.todos, state.visibilityFilter)
})

const mapDispatchToProps = dispatch => ({
  deleteTodo: (id) => {
    dispatch(deleteTodo(id))
  },
  editTodo: (id, content) => {
    dispatch(editTodo(id, content))
  },
  toggleTodo: (id) => {
    dispatch(toggleTodo(id))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Todos)
