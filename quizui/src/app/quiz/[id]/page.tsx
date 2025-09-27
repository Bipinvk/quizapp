'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import toast from 'react-hot-toast'

interface Question {
  id: number
  text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
}

interface QuizData {
  questions: Question[]
}

export default function TakeQuiz() {
  const params = useParams()
  const id = params.id as string
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!token) router.push('/login')
    else fetchQuiz()
  }, [token, id, router])

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}quizzes/${id}/`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setQuiz(await res.json())
      else toast.error('Quiz not found')
    } catch {
      toast.error('Network error')
    }
    setLoading(false)
  }

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [quiz!.questions[currentIndex].id]: option })
    if (currentIndex < quiz!.questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      submitAnswers()
    }
  }

  const submitAnswers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}quizzes/${id}/submit/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answers }),
      })
      if (res.ok) {
        toast.success('Quiz submitted!')
        router.push(`/results/${id}`)
      } else {
        toast.error('Submit failed')
      }
    } catch {
      toast.error('Network error')
    }
  }

  if (loading || !quiz) return <p className="text-center">Loading quiz...</p>

  const q = quiz.questions[currentIndex]
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <h2 className="text-xl font-bold mb-4">Question {currentIndex + 1}/{quiz.questions.length}</h2>
      <p className="mb-4">{q.text}</p>
      <div className="space-y-2">
        <button onClick={() => handleSelect('A')} className="w-full p-3 border rounded hover:bg-gray-100 dark:hover:bg-gray-600">A: {q.option_a}</button>
        <button onClick={() => handleSelect('B')} className="w-full p-3 border rounded hover:bg-gray-100 dark:hover:bg-gray-600">B: {q.option_b}</button>
        <button onClick={() => handleSelect('C')} className="w-full p-3 border rounded hover:bg-gray-100 dark:hover:bg-gray-600">C: {q.option_c}</button>
        <button onClick={() => handleSelect('D')} className="w-full p-3 border rounded hover:bg-gray-100 dark:hover:bg-gray-600">D: {q.option_d}</button>
      </div>
    </div>
  )
}