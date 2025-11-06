import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAMfHbrzGcV7NljeLpVjIZoJ7FPstZKEkI",
  authDomain: "trabalho-04---agenda-com.firebaseapp.com",
  projectId: "trabalho-04---agenda-com",
  storageBucket: "trabalho-04---agenda-com.firebasestorage.app",
  messagingSenderId: "1049011659891",
  appId: "1:1049011659891:web:c0aa48b53f6c13f5dcb606",
  measurementId: "G-5H6BZ1PJGY"
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
