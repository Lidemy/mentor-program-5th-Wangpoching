import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { auth } from '../firebase'
import { getIdToken, isAnyOf } from '../utils'
import { 
  getArticles, 
  getArticle, 
  saveArticle as saveArticleAPI, 
  deleteArticle as deleteArticleAPI
} from '../WebAPI'

const initialState = {
  manyArticles: {
    articles: [],
    currentPage: 1,
    totalAmount: 0,
    loading: false,
    didInvalidate: false,
    error: null
  },
  searchArticles: {
    articles: [],
    currentPage: 1,
    totalAmount: 0,
    loading: false,
    error: null
  },
  singleArticle: {
    article: null,
    loading: false,
    didInvalidate: false,
    error: null
  }
}

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async ({currentPage, limit}) => {
  const res = await getArticles(currentPage, limit)
  if (!res.ok) {
    throw new Error('獲取文章失敗')
  }
  const body = await res.json()
  const totalAmount = Number(res.headers.get('article-amount'))
  return {
    currentPage,
    totalAmount,
    articles: body.data
  }
})

export const searchArticles = createAsyncThunk('articles/searchArticles', async ({currentPage, limit, keyword}) => {
  const res = await getArticles(currentPage, limit, keyword)
  if (!res.ok) {
    throw new Error('搜尋文章發生問題')
  }
  const body = await res.json()
  const totalAmount = Number(res.headers.get('article-amount'))
  return {
    currentPage,
    totalAmount,
    articles: body.data
  }
})

export const fetchSingleArticle = createAsyncThunk('articles/fetchSingleArticle', async (id) => {
  const res = await getArticle(id)
  if (!res.ok) {
    throw new Error('獲取文章失敗')
  }
  const body = await res.json()
  return body.data
})

export const deleteArticle = createAsyncThunk('articles/deleteArticle', async ({id, csrfToken}) => {
  const idToken = await getIdToken(auth)
  const res = await deleteArticleAPI(idToken, id, csrfToken)
  if (!res.ok) {
    throw new Error('刪除文章發生問題')
  }
})

export const saveArticle = createAsyncThunk('articles/saveArticle', async ({id, articleTitle, contentToSave, plainContent, isEditingPage}) => {
  const idToken = await getIdToken(auth)
  const res = await saveArticleAPI(idToken, id, articleTitle, contentToSave, plainContent, isEditingPage)
  if (!res.ok) {
    if (isEditingPage) {
      throw new Error('編輯文章失敗')
    } else {
      throw new Error('新增文章失敗')
    }
  }
})

const manyArticlesReucer = (state = {
    articles: [],
    currentPage: 1,
    totalAmount: 0,
    loading: false,
    didInvalidate: false,
    error: null
  }, action) => {
  switch (action.type) {
    case fetchArticles.pending().type:
      return {
        ...state,
        loading: true,
        didInvalidate: false
      }
    case fetchArticles.fulfilled().type:
      const { totalAmount, articles, currentPage } = action.payload
      return {
        ...state,
        totalAmount,
        articles,
        currentPage,
        loading: false,
        didInvalidate: false
      }
    case fetchArticles.rejected().type:
      return {
        ...state,
        loading: false,
        error: action.error.message
      }
    default:
      return state
  }
}

const singleArticleReucer = (state = {
    article: null,
    loading: false,
    didInvalidate: false,
    error: null
  }, action) => {
  switch (action.type) {
    case fetchSingleArticle.pending().type:
    case deleteArticle.pending().type:
    case saveArticle.pending().type:
      return {
        ...state,
        loading: true,
        didInvalidate: false
      }
    case fetchSingleArticle.fulfilled().type:
      return {
        ...state,
        loading: false,
        didInvalidate: false,
        article: action.payload
      }
    case deleteArticle.fulfilled().type:
      return {
        article: null,
        loading: false,
        didInvalidate: false,
        error: null
      }
    case saveArticle.fulfilled().type:
      return {
        ...state,
        loading: false
      }
    case fetchSingleArticle.rejected().type:
    case deleteArticle.rejected().type:
    case saveArticle.rejected().type:
      return {
        ...state,
        loading: false,
        error: action.error.message
      }
    default:
      return state
  }
}

const searchArticlesReucer = (state = {
    articles: [],
    currentPage: 1,
    totalAmount: 0,
    loading: false,
    error: null
  }, action) => {
  switch (action.type) {
    case searchArticles.pending().type:
      return {
        ...state,
        loading: true,
        didInvalidate: false
      }
    case searchArticles.fulfilled().type:
      const { totalAmount, articles, currentPage } = action.payload
      return {
        ...state,
        totalAmount,
        articles,
        currentPage,
        loading: false,
        didInvalidate: false
      }
    case searchArticles.rejected().type:
      return {
        ...state,
        loading: false,
        error: action.error.message
      }
    default:
      return state
  }
}



const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setArticle(state, action) {
      state.singleArticle.article = action.payload
    },
    didInvalidate(state, action) {
      state.manyArticles.currentPage = 1
      state.singleArticle.didInvalidate = true
      state.manyArticles.didInvalidate = true
    }   
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        isAnyOf(fetchArticles.pending, fetchArticles.fulfilled, fetchArticles.rejected),
        (state, action) => {
          state.manyArticles = manyArticlesReucer(state.manyArticles, action)
      })
      .addMatcher(
        isAnyOf(
          fetchSingleArticle.pending,
          fetchSingleArticle.fulfilled,
          deleteArticle.pending,
          deleteArticle.fulfilled,
          deleteArticle.rejected,
          saveArticle.pending,
          saveArticle.fulfilled,
          saveArticle.rejected
        ),
        (state, action) => {
          state.singleArticle = singleArticleReucer(state.singleArticle, action)
      })
      .addMatcher(
        isAnyOf(searchArticles.pending, searchArticles.fulfilled, searchArticles.rejected),
        (state, action) => {
          state.searchArticles = searchArticlesReucer(state.searchArticles, action)
      })
  },
})

const shouldgetArticles = (state, currentPage) =>  {
  const { loading, didInvalidate, articles } = state.article.manyArticles
  if (!articles.length) {
    return true
  }
  if (currentPage !== state.article.manyArticles.currentPage) {
    return true
  }
  if (loading) {
    return false
  }
  return didInvalidate
}

export const getArticlesIfNeeded = (currentPage, limit) => async (dispatch, getState) => {
  if (shouldgetArticles(getState(), currentPage)) {
    try {
      await dispatch(fetchArticles({currentPage, limit})).unwrap()
    } catch (err) {
      throw new Error(err.message)
    }
  }
}

const selectArticleById = (state, articleId) => {
  if (state.article.manyArticles.articles.length) {
    return state.article.manyArticles.articles.find((article) => article.id === articleId)
  }
  return null
}

const shouldgetSingleArticle = (state, articleId) =>  {
  const { article, loading, didInvalidate } = state.article.singleArticle
  const selectResult = selectArticleById(state, articleId)
  // 完全找不到文章
  if (!selectResult) {
    if (!article || article.id !== articleId)
    return true
  }
  // 已經在獲取文章中
  if (loading) {
    return false
  }
  return didInvalidate
}

export const getSingleArticleIfNeeded = (articleId) => async (dispatch, getState) => {
  if (shouldgetSingleArticle(getState(), articleId)) {
    try {
      await dispatch(fetchSingleArticle(articleId)).unwrap()
    } catch (err) {
      throw new Error(err.message)
    }
  } else {
    const { article } = getState().article.singleArticle
    const selectResult = selectArticleById(getState(), articleId)
    if (!article || article.id !== articleId) {
      dispatch(setArticle(selectResult))
    }
  }
}

// selectors
export const selectAllArticles = (state) => state.article.manyArticles
export const selectSingleArticle = (state) => state.article.singleArticle

export default articlesSlice.reducer

export const { didInvalidate, setArticle } = articlesSlice.actions
