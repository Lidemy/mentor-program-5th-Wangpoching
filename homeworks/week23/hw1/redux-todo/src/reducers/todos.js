import {
  ADD_TODO,
  DELETE_TODO,
  EDIT_TODO,
  TOGGLE_TODO,
  TOGGLE_ALL_TODOS,
  CLEAR_COMPLETED
} from '../constants/ActionTypes'

let id = 1

let initialState = window.localStorage.getItem('todos') || ''
if (initialState && JSON.parse(initialState).length) {
  initialState = JSON.parse(initialState)
  id = initialState[initialState.length - 1].id + 1
} else {
  initialState = []
}

export default function todos(state = initialState, {type, payload}) {
  switch (type) {
    case ADD_TODO:
      return [
        ...state,
        {
          id: id++,
          content: payload.content,
          isDone: false
        }
      ]

    case DELETE_TODO:
      return state.filter(todo =>
        todo.id !== payload.id
      )

    case EDIT_TODO:
      return state.map(todo =>
        todo.id === payload.id ?
          { ...todo, content: payload.content } :
          todo
      )

    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id === payload.id ?  
          { ...todo, isDone: !todo.isDone } :
          todo
      )

    case TOGGLE_ALL_TODOS:
      const areAllCompleted = state.every(todo => todo.isDone)
      return state.map(todo => ({
        ...todo, 
        isDone: !areAllCompleted 
      }))

    case CLEAR_COMPLETED:
      return state.filter(todo => !todo.isDone)

    default:
      return state
  }
}