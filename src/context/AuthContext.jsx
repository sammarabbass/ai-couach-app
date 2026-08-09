import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi } from '../api/auth.api'
import { getTokens, setTokens } from '../api/client'
import { connectSocket, disconnectSocket } from '../lib/socket'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadMe = useCallback(async () => {
    const tokens = getTokens()
    if (!tokens?.accessToken) {
      setLoading(false)
      return
    }
    try {
      const me = await authApi.me()
      setUser(me.user ?? me)
      connectSocket()
    } catch {
      setTokens(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMe()
  }, [loadMe])

  const login = async (email, password) => {
    const res = await authApi.login({ email, password })
    setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken })
    setUser(res.user)
    connectSocket()
    return res.user
  }

  const register = async (payload) => {
    const res = await authApi.register(payload)
    setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken })
    setUser(res.user)
    connectSocket()
    return res.user
  }

  const logout = () => {
    setTokens(null)
    setUser(null)
    disconnectSocket()
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
