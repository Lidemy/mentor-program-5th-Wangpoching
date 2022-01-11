import env from 'react-dotenv'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth'
import { getIdToken } from './utils'
import { thirdPartyRegister, normalRegister } from './WebAPI'

const firebaseConfig = {
  apiKey: env.API_KEY,
  authDomain: env.AUTH_DOMAIN,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.MESSAGINGSENDER_ID,
  appId: env.APP_ID,
  measurementId: env.MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const auth = getAuth()
const googleProvider = new GoogleAuthProvider()

const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider)
    const IdToken = await getIdToken(auth)
    try {
      const res = await thirdPartyRegister(IdToken)
      if (!res.ok) {
        throw new Error('登入失敗')
      }
    } catch (err) {
      await signOut(auth)
      throw new Error('登入失敗')
    }
  } catch (err) {
      throw new Error(err.message)
  }
}

const signInByEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (err) {
    throw new Error(err.message)
  }
}

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password)
    const IdToken = await getIdToken(auth)
    try {
      const res = await normalRegister(IdToken, name)
      if (!res.ok) {
        throw new Error('註冊失敗')
      }
    } catch (err) {
      await signOut(auth)
      throw new Error('註冊失敗')
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

const sendPasswordResetMail = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (err) {
    throw new Error(err.message)
  }
}

const logout = async () => {
  await signOut(auth)
}

export {
  auth,
  signInWithGoogle,
  signInByEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordResetMail,
  logout
}