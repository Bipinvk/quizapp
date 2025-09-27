
'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie';

const authSchema = z.object({
  username: z.string().min(1, 'Username required'),
  email: z.string().email('Invalid email').optional(),
  password: z.string().min(6, 'Password min 6 chars'),
})

type AuthForm = z.infer<typeof authSchema>

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const { register, handleSubmit, formState: { errors } } = useForm<AuthForm>({ resolver: zodResolver(authSchema) })
  const { setToken } = useAuth()
  const router = useRouter()

  const onSubmit = async (data: AuthForm) => {
    const url = isLogin ? `${process.env.NEXT_PUBLIC_API_URL}login/` : `${process.env.NEXT_PUBLIC_API_URL}register/`
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const json = await res.json()
        setToken(json.access)
        Cookies.set('refresh_token', json.refresh)  // Optional
        toast.success(isLogin ? 'Logged in!' : 'Registered!')
        router.push('/dashboard')
      } else {
        toast.error((await res.json()).error || 'Auth failed')
      }
    } catch {
      toast.error('Network error')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">{isLogin ? 'Login' : 'Register'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('username')} placeholder="Username" className="w-full p-2 border rounded dark:bg-gray-700" />
        {errors.username && <p className="text-red-500">{errors.username.message}</p>}
        {!isLogin && (
          <>
            <input {...register('email')} placeholder="Email" className="w-full p-2 border rounded dark:bg-gray-700" />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </>
        )}
        <input type="password" {...register('password')} placeholder="Password" className="w-full p-2 border rounded dark:bg-gray-700" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        <button type="submit" className="w-full bg-primary text-white p-2 rounded hover:bg-blue-700">Submit</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} className="mt-4 text-primary hover:underline">
        Switch to {isLogin ? 'Register' : 'Login'}
      </button>
    </div>
  )
}