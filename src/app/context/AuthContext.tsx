'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  token: string | null
  setToken: (token: string | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
const [token, setTokenState] = useState<string | null>(
  Cookies.get('access_token') ?? null
)
  const router = useRouter()

  const setToken = (newToken: string | null) => {
    if (newToken) {
      Cookies.set('access_token', newToken, { expires: 1/24 })  // 1 hour
      setTokenState(newToken)
    } else {
      Cookies.remove('access_token')
      setTokenState(null)
    }
  }

  const logout = () => {
    setToken(null)
    router.push('/login')
  }

  // Token refresh logic (optional, call /token/refresh if 401)
  useEffect(() => {
    const refreshToken = Cookies.get('refresh_token')
    if (!token && refreshToken) {
      // Fetch new access (implement if needed)
    }
  }, [token])

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be inside AuthProvider')
  return context
}