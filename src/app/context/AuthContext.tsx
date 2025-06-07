'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type UserRole = 'admin' | 'takmir' | 'warga'

interface User {
  id: number
  name: string
  email: string
  role: string
  roles?: string[]
  access_token?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (userData: User, token: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          if (isMounted) {
            setUser(null)
            setLoading(false)
          }
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        })

        if (response.ok && isMounted) {
          const userData = await response.json()
          setUser(userData)
        } else if (isMounted) {
          setUser(null)
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        if (isMounted) {
          setUser(null)
          localStorage.removeItem('token')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [])

  const login = async (userData: User, token: string) => {
    setLoading(true)
    try {
      localStorage.setItem('token', token)
      setUser(userData)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        })
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('token')
      setLoading(false)
      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {loading ? (
      <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
      }}>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
      }}>
      <div style={{
        width: 64,
        height: 64,
        border: '6px solid #fff',
        borderTop: '6px solid #43e97b',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>
        {`
        @keyframes spin {
        0% { transform: rotate(0deg);}
        100% { transform: rotate(360deg);}
        }
        `}
      </style>
      <h2 style={{
        marginTop: 24,
        color: '#fff',
        fontWeight: 700,
        letterSpacing: 1,
        fontSize: 24,
        textShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        Memuat...
      </h2>
      </div>
      </div>
      ) : children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}