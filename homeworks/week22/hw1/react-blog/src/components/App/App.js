import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase'
import { ThemeContext, AuthContext } from '../../context.js'
import themes from '../../themes'
import Footer from '../Footer'
import Header from '../Header'
import { useState } from 'react'
import LoginPage from '../../pages/LoginPage'
import RegisterPage from '../../pages/RegisterPage'
import ResetPage from '../../pages/ResetPage'
import ArticlesPage from '../../pages/ArticlesPage'
import ArticlePage from '../../pages/ArticlePage'
import AboutMePage from '../../pages/AboutMePage'
import EditPage from '../../pages/EditPage'
import HomePage from '../../pages/HomePage'
import SearchPage from '../../pages/SearchPage'
import { Global, ThemeProvider } from '@emotion/react'

function App() {
  const [theme, setTheme] = useState('light')
  const themeMode = theme === 'light' ? themes.light : themes.dark
  const [user, loading, error] = useAuthState(auth)
  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      <AuthContext.Provider value={{user, loading, error}}>
        <ThemeProvider theme={themeMode}>
          <Global styles={{body: {background: themeMode.background.body}}} />
          <Router basename="/react-blog">
            <Header/>
              <Routes>
                <Route exact path='/' element={<LoginPage />} />
                <Route exact path='/register' element={<RegisterPage />} />
                <Route exact path='/reset' element={<ResetPage />} />
                <Route exact path='/home' element={<HomePage />} />
                <Route exact path='/articles' element={<ArticlesPage />} />
                <Route exact path='/article/:id' element={<ArticlePage />} />
                <Route exact path='/edit/:id' element={<EditPage />} />
                <Route exact path='/write' element={<EditPage />} />
                <Route exact path='/me' element={<AboutMePage />} />
                <Route exact path='/search/:keyword' element={<SearchPage />} />
              </Routes>
            <Footer/>
          </Router>
        </ThemeProvider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  )
}

export default App
