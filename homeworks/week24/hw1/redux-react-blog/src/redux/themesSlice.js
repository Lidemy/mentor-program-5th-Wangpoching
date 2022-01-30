import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  themeMode: 'light'
}

const themesSlice = createSlice({
  name: 'themes',
  initialState,
  reducers: {
    toggleTheme(state) {
      if (state.themeMode === 'light') {
        state.themeMode = 'dark'
        return
      }
      state.themeMode = 'light'
    },
  }
})

export default themesSlice.reducer

export const { toggleTheme } = themesSlice.actions