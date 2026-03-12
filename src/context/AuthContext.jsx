import React, { createContext, useContext, useState, useEffect } from 'react'
import { MOCK_CREDENTIALS } from '../constants'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('cfm_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { /* ignore */ }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Simulate async API call
    await new Promise((r) => setTimeout(r, 900))

    if (
      email.toLowerCase().trim() === MOCK_CREDENTIALS.email &&
      password === MOCK_CREDENTIALS.password
    ) {
      const userData = { email: email.toLowerCase().trim(), name: 'Field Manager', role: 'manager' }
      setUser(userData)
      sessionStorage.setItem('cfm_user', JSON.stringify(userData))
      return { success: true }
    }

    return { success: false, error: 'Invalid credentials. Use test@test.com / 123456' }
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('cfm_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
