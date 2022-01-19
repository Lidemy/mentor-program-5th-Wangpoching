import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'

export const getCompletedTodoCount = todos => (
  todos.reduce((count, todo) =>
    todo.isDone ? count + 1 : count,
    0
  )
)

export const getVisibleTodos = (todos, visibilityFilter) => {
  switch (visibilityFilter) {
    case SHOW_ALL:
      return todos

    case SHOW_COMPLETED:
      return todos.filter(todo => todo.isDone)

    case SHOW_ACTIVE:
      return todos.filter(todo => !todo.isDone)
      
    default:
      return todos
  }
}