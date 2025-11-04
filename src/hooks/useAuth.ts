import { useState, useEffect, createContext, useContext } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/services/firebase' // ajuste se usar Firebase

interface AuthContextType {
  user: User | null
}

const AuthContext = createContext<AuthContextType>({ user: null })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
