import env from 'react-dotenv'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: env.API_KEY,
  authDomain: env.AUTH_DOMAIN,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.MESSAGINGSENDER_ID,
  appId: env.APP_ID,
  measurementId: env.MEASUREMENT_ID
}

// Initialize firebase instance
initializeApp(firebaseConfig)
const auth = getAuth()
const googleAuthProvider = new GoogleAuthProvider()

export { auth, googleAuthProvider }

