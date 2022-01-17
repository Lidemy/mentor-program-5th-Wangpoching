import { connect } from 'react-redux'
import FunctionColumn from '../../components/FunctionColumn'
import { clearCompleted } from '../../actionsCreator'
import { getCompletedTodoCount } from '../../selectors'

const mapStateToProps = (state) => ({
  activeCount: state.todos.length - getCompletedTodoCount(state.todos)
})

const mapDidpatchToProps = (dispatch) => ({
  clearCompleted: () => {
    dispatch(clearCompleted())
  }
})

export default connect(mapStateToProps, mapDidpatchToProps)(FunctionColumn)