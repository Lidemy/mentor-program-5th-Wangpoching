import { Global, ThemeProvider } from '@emotion/react'
import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom'
import { auth } from '../../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth'

import themes from '../../themes'
import Footer from '../Footer'
import Header from '../Header'
import LoginPage from '../../pages/LoginPage'
import RegisterPage from '../../pages/RegisterPage'
import ResetPage from '../../pages/ResetPage'
import HomePage from '../../pages/HomePage'
import AboutMePage from '../../pages/AboutMePage'
import ArticlesPage from '../../pages/ArticlesPage'
import ArticlePage from '../../pages/ArticlePage'
import EditPage from '../../pages/EditPage'
import SearchPage from '../../pages/SearchPage'

import { setUser } from '../../redux/usersSlice'

function App() {
  const { themeMode } = useSelector(state => state.theme)
  const theme = themeMode === 'light' ? themes.light : themes.dark
  const dispatch = useDispatch()

  // 偵測 auth 變化
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(setUser(user.uid))
      } else {
        dispatch(setUser(null))
      }
    })
  }, [dispatch])

  return (
    <ThemeProvider theme={theme}>
      <Global styles={{body: {background: theme.background.body}}} />
      <Router basename="/react-blog-redux-">
        <Header/>
          <Routes>
            <Route exact path='/' element={<LoginPage />} />
            <Route exact path='/register' element={<RegisterPage />} />
            <Route exact path='/reset' element={<ResetPage />} />
            <Route exact path='/home' element={<HomePage />} />
            <Route exact path='/me' element={<AboutMePage />} />
            <Route exact path='/articles' element={<ArticlesPage />} />
            <Route exact path='/article/:id' element={<ArticlePage />} />
            <Route exact path='/edit/:id' element={<EditPage />} />
            <Route exact path='/write' element={<EditPage />} />
            <Route exact path='/search/:keyword' element={<SearchPage />} />
          </Routes>
        <Footer/>
      </Router>
    </ThemeProvider>
  )
}

export default App
