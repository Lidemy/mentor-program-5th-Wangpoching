import * as types from '../constants/ActionTypes'

export const addTodo = (content) => ({ type: types.ADD_TODO, payload: { content } })
export const deleteTodo = (id) => ({ type: types.DELETE_TODO, payload: { id } })
export const editTodo = (id, content) => ({ type: types.EDIT_TODO, payload: { id, content } })
export const toggleTodo = (id) => ({ type: types.TOGGLE_TODO, payload: { id } })
export const toggleAllTodos = () => ({ type: types.TOGGLE_ALL_TODOS })
export const clearCompleted = () => ({ type: types.CLEAR_COMPLETED })
export const setVisibilityFilter = (filter) => ({ type: types.SET_VISIBILITY_FILTER, payload: { filter } })