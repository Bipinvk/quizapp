'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './context/AuthContext'
export default function Home() {
  const { token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (token) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [token, router])

  return <div className="text-center">Redirecting...</div>
}