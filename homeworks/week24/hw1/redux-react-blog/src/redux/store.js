import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './usersSlice'
import themesReducer from './themesSlice'
import articlesReducer from './articlesSlice'

export default configureStore({
  reducer: {
    user: usersReducer,
    theme: themesReducer,
    article: articlesReducer
  },
  devTools: true
})