'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const quizSchema = z.object({
  topic: z.string().min(1, 'Topic required'),
  num_questions: z.number().min(5).max(20),
  difficulty: z.enum(['easy', 'medium', 'hard']),
})

type QuizFormType = z.infer<typeof quizSchema>

interface Quiz {
  id: number
  topic: string
  num_questions: number
  difficulty: string
  created_at: string
}

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(false)
  const { token, logout } = useAuth()
  const router = useRouter()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<QuizFormType>({ resolver: zodResolver(quizSchema) })

  useEffect(() => {
    if (!token) router.push('/login')
    else fetchQuizzes()
  }, [token, router])

  const fetchQuizzes = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}quizzes/`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setQuizzes(await res.json())
      else toast.error('Failed to load quizzes')
    } catch {
      toast.error('Network error')
    }
    setLoading(false)
  }

  const onCreate = async (data: QuizFormType) => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}quizzes/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        toast.success('Quiz created!')
        fetchQuizzes()
        reset()
      } else {
        toast.error((await res.json()).error)
      }
    } catch {
      toast.error('Network error')
    }
    setLoading(false)
  }

  if (loading) return <p className="text-center">Loading...</p>

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <form onSubmit={handleSubmit(onCreate)} className="grid md:grid-cols-4 gap-4">
        <input {...register('topic')} placeholder="Topic" className="p-2 border rounded col-span-2 dark:bg-gray-700" />
        {errors.topic && <p className="text-red-500">{errors.topic.message}</p>}
        <input type="number" {...register('num_questions', { valueAsNumber: true })} placeholder="Questions (5-20)" className="p-2 border rounded dark:bg-gray-700" />
        {errors.num_questions && <p className="text-red-500">{errors.num_questions.message}</p>}
        <select {...register('difficulty')} className="p-2 border rounded dark:bg-gray-700">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button type="submit" disabled={loading} className="bg-primary text-white p-2 rounded hover:bg-blue-700 md:col-start-4">Create Quiz</button>
      </form>
      <h2 className="text-2xl font-semibold">Quiz History</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-bold">{quiz.topic}</h3>
            <p>{quiz.num_questions} Questions - {quiz.difficulty}</p>
            <p className="text-sm text-gray-500">{new Date(quiz.created_at).toLocaleDateString()}</p>
            <div className="mt-2 space-x-2">
              <button onClick={() => router.push(`/quiz/${quiz.id}`)} className="bg-primary text-white px-3 py-1 rounded">Take/Retake</button>
              <button onClick={() => router.push(`/results/${quiz.id}`)} className="bg-gray-500 text-white px-3 py-1 rounded">View Results</button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={logout} className="bg-red-500 text-white p-2 rounded">Logout</button>
    </div>
  )
}