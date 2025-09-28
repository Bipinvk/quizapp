'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from 'react-spinners/PulseLoader';

interface Question {
  id: number;
  text: string;
  correct_option: string;
}

interface Result {
  score: number;
  answers: { [key: number]: string };
  quiz: { questions: Question[] };
  quizId: number;
}

export default function Results() {
  const params = useParams();
  const quizId = typeof params.id === 'string' ? params.id : '';
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!quizId || !token) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/results/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) {
          toast.error('Failed to load results');
          return;
        }

        const data: Result[] = await res.json();
        const thisResult = data.find((r) => String(r.quizId) === quizId) || null;
        setResult(thisResult);
      } catch {
        toast.error('Error loading results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId, token]);

  if (loading) {
    return (
      <div className="text-center mt-20">
        <Spinner color="#3b82f6" size={15} />
      </div>
    );
  }

  if (!result) {
    return (
      <p className="text-center text-gray-600">
        No results found for this quiz.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Quiz Results</h1>
      <p className="text-xl mb-6">
        Score: {result.score} / {result.quiz.questions.length}
      </p>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left border">Q#</th>
            <th className="p-3 text-left border">Question</th>
            <th className="p-3 text-left border">Your Answer</th>
            <th className="p-3 text-left border">Correct</th>
            <th className="p-3 text-left border">Status</th>
          </tr>
        </thead>
        <tbody>
          {result.quiz.questions.map((q, i) => {
            const userAns = result.answers[q.id];
            const isCorrect = userAns === q.correct_option;
            return (
              <tr
                key={q.id}
                className={isCorrect ? 'bg-green-50' : 'bg-red-50'}
              >
                <td className="p-3 border">{i + 1}</td>
                <td className="p-3 border">{q.text}</td>
                <td className="p-3 border">{userAns || '-'}</td>
                <td className="p-3 border">{q.correct_option}</td>
                <td className="p-3 border">
                  {isCorrect ? '✅ Correct' : '❌ Wrong'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        onClick={() => router.back()}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
