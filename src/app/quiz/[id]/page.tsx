'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from 'react-spinners/PulseLoader';

interface Question {
  id: number;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

export default function TakeQuiz() {
  const params = useParams();
  const quizId = typeof params.id === 'string' ? params.id : '';
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!quizId || !token) return;

    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/quizzes/${quizId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) {
          toast.error('Failed to load quiz');
          return;
        }

        const data = await res.json();
        setQuestions(data.questions ?? []);
      } catch {
        toast.error('Error loading quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, token]);

  const handleAnswer = (option: string) => {
    const qId = questions[currentQ]?.id;
    if (!qId) return;

    setAnswers((prev) => ({ ...prev, [qId]: option }));

    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/quizzes/${quizId}/submit/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers }),
        }
      );

      if (res.ok) {
        toast.success('Quiz submitted!');
        router.push(`/results/${quizId}`);
      } else {
        toast.error('Submit failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20">
        <Spinner color="#3b82f6" size={15} />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-600">
        No questions available for this quiz.
      </div>
    );
  }

  const q = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Quiz in Progress</h1>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-gray-600 mb-2">
        Question {currentQ + 1}/{questions.length}
      </p>
      <h2 className="text-xl font-semibold mb-4">{q.text}</h2>
      <div className="space-y-3">
        {(['A', 'B', 'C', 'D'] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            className="w-full text-left p-3 border rounded-md hover:bg-blue-50 transition"
          >
            {opt}: {q[`option_${opt.toLowerCase() as 'a' | 'b' | 'c' | 'd'}`]}
          </button>
        ))}
      </div>
    </div>
  );
}
