'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Result {
  id: number
  score: number
  answers: Record<number, string>
  quiz: {
    questions: Array<{
      id: number
      text: string
      correct_option: string
    }>
  }
}

export default function Results() {
  const params = useParams()
  const id = params.id as string
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!token) router.push('/login')
    else fetchResults()
  }, [token, router])

  const fetchResults = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}results/`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        const matchingResult = data.find((r: Result) => r.quiz.id === parseInt(id))
        if (matchingResult) setResult(matchingResult)
        else toast.error('No results for this quiz')
      } else {
        toast.error('Failed to load results')
      }
    } catch {
      toast.error('Network error')
    }
    setLoading(false)
  }

  if (loading || !result) return <p className="text-center">Loading results...</p>

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Results: {result.score} / {result.quiz.questions.length}</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="p-2 border">Question</th>
            <th className="p-2 border">Your Answer</th>
            <th className="p-2 border">Correct</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {result.quiz.questions.map((q, index) => {
            const userAns = result.answers[q.id]
            const isCorrect = userAns === q.correct_option
            return (
              <tr key={q.id} className={isCorrect ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}>
                <td className="p-2 border">{index + 1}. {q.text}</td>
                <td className="p-2 border">{userAns || 'N/A'}</td>
                <td className="p-2 border">{q.correct_option}</td>
                <td className="p-2 border">{isCorrect ? 'Correct' : 'Wrong'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="mt-4 space-x-4">
        <button onClick={() => router.push(`/quiz/${id}`)} className="bg-primary text-white p-2 rounded">Retake Quiz</button>
        <button onClick={() => router.push('/dashboard')} className="bg-gray-500 text-white p-2 rounded">Back to Dashboard</button>
      </div>
    </div>
  )
}