import { SET_VISIBILITY_FILTER } from '../constants/ActionTypes'
import * as filterTypes from '../constants/TodoFilters.js'

const visibilityFilter = (state = filterTypes.SHOW_ALL, {type, payload}) => {
  switch (type) {
    case SET_VISIBILITY_FILTER:
      return payload.filter

    default:
      return state
  }
}

export default visibilityFilter
