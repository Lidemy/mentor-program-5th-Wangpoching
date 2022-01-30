import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { thirdPartyRegister, normalRegister, getMe, editMe } from '../WebAPI'
import { auth, googleAuthProvider } from '../firebase'
import { getIdToken, isAnyOf } from '../utils'
import { 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth'

const initialState = {
  loading: false,
  currentUser: null,
  error: null,
  detail: {
    name: null,
    email: null,
    description: null,
    loading: false,
    didInvalidate: false,
    error: null
  }
}

export const register = createAsyncThunk('users/register', async ({email, password, name}) => {
  const user = await createUserWithEmailAndPassword(auth, email, password, name)
  const IdToken = await getIdToken(auth)
  try {
    const res = await normalRegister(IdToken, name)
    if (!res.ok) {
      throw new Error('註冊失敗')
    }
    return user.user.uid
  } catch (error) {
    await auth.currentUser.delete()
    throw new Error(error.message)
  }
})

export const login = createAsyncThunk('users/login', async ({email, password}) => {
  const user = await signInWithEmailAndPassword(auth, email, password)
  return user.user.uid
})

export const logout = createAsyncThunk('users/logout', async () => {
  const res = await signOut(auth)
  return res
})

export const googleSignIn = createAsyncThunk('users/googleSignIn', async (args, thunkAPI) => {
  const user = await signInWithPopup(auth, googleAuthProvider)
  const IdToken = await getIdToken(auth)
  try {
    const res = await thirdPartyRegister(IdToken)
    if (!res.ok) {
      throw new Error('登入失敗')
    }
    return user.user.uid
  } catch (error) {
    await thunkAPI.dispatch(logout())
    throw new Error(error.message)
  }
})

const getAboutMe = createAsyncThunk('users/getAboutMe', async (args, thunkAPI) => {
  const IdToken = await getIdToken(auth)
  const res = await getMe(IdToken)
  if (!res.ok) {
    throw new Error('取得個人資料失敗')
  }
  const body = await res.json()
  return body.data
})

export const editAboutMe = createAsyncThunk('users/editAboutMe', async (descriptionInput, thunkAPI) => {
  const IdToken = await getIdToken(auth)
  const res = await editMe(IdToken, descriptionInput)
  if (!res.ok) {
    throw new Error('更新個人資料失敗')
  }
  return res
})

const detailsReducer = (state = {
  loading: false,
  didInvalidate: false,
  name: null,
  email: null,
  avatar: null,
  description: null
}, action) => {
  switch (action.type) {
    case 'users/didInvalidate':
      return {
        ...state,
        didInvalidate: true
      }
    case getAboutMe.pending().type:
    case editAboutMe.pending().type:
      return {
        ...state,
        loading: true,
        didInvalidate: false
      }
    case editAboutMe.fulfilled().type:
      return {
        ...state,
        loading: false,
        didInvalidate: false,
      }    
    case getAboutMe.fulfilled().type:
      const { name, email, avatar, description} = action.payload
      return {
        ...state,
        name,
        email,
        avatar,
        description,
        loading: false,
        didInvalidate: false
      }
    case getAboutMe.rejected().type:
    case editAboutMe.rejected().type:
      return {
        ...state,
        loading: false,
        didInvalidate: false,
        error: action.error.message
      }
    default:
      return state
  }
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload
    },
    didInvalidate(state, action) {
      state.detail = detailsReducer(state.detail, action)
    }
  },
  extraReducers(builder) {
    builder
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false
      })
      .addMatcher(
        isAnyOf(getAboutMe.pending, getAboutMe.fulfilled, getAboutMe.rejected, editAboutMe.pending, editAboutMe.fulfilled, editAboutMe.rejected),
        (state, action) => {
          state.detail = detailsReducer(state.detail, action)
      })
      .addMatcher(
        isAnyOf(register.pending, login.pending, logout.pending, googleSignIn.pending),
        (state, action) => {
          state.loading = true
      })
      .addMatcher(
        isAnyOf(register.fulfilled, login.fulfilled, googleSignIn.fulfilled), 
        (state, action) => {
          state.loading = false
          state.currentUser = action.payload
      })
      .addMatcher(
        isAnyOf(register.rejected, login.rejected, logout.rejected, googleSignIn.rejected),
        (state, action) => {
          state.loading = false
          state.error = action.error.message
      })
  },
})

const shouldgetAboutMe = (state) =>  {
  const { name, loading, didInvalidate } = state.user.detail
  if (!name) {
    return true
  }
  if (loading) {
    return false
  }
  return didInvalidate
}

export const getAboutMeIfNeeded = () => async (dispatch, getState) => {
  if (shouldgetAboutMe(getState())) {
    await dispatch(getAboutMe()).unwrap()
  }
}

// selector
export const selectCurrentUser = (state) => {
  const { loading, currentUser } = state.user
  return {
    loading,
    currentUser
  }
}

export default usersSlice.reducer

export const { setUser, didInvalidate } = usersSlice.actions