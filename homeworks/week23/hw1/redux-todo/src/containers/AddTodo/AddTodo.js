import { connect } from 'react-redux'
import AddTodo from '../../components/AddTodo'
import { addTodo, toggleAllTodos } from '../../actionsCreator'
import { getCompletedTodoCount } from '../../selectors'

const mapStateToProps = (state) => ({
  todosCount: state.todos.length,
  completedCount: getCompletedTodoCount(state.todos)
})

const mapDispatchToProps = (dispatch) => ({
  addTodo: (payload) => {
    dispatch(addTodo(payload))
  },
  toggleAllTodos: () => {
    dispatch(toggleAllTodos())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(AddTodo)