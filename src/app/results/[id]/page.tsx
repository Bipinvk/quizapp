'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from 'react-spinners/PulseLoader';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Home,
  Share2,
  Download,
  Calendar,
  User,
  BookOpen,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

interface Question {
  id: number;
  text: string;
  correct_option: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
}

interface Quiz {
  id: number;
  topic: string;
  num_questions: number;
  difficulty: string;
  questions: Question[];
}

interface User {
  id: number;
  username: string;
  email: string;
}

interface Result {
  id: number;
  score: number;
  answers: { [key: number]: string };
  quiz: Quiz;
  completed_at: string;
  user: User;
}

export default function Results() {
  const params = useParams();
  const quizId = typeof params.id === 'string' ? params.id : '';
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [retaking, setRetaking] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!quizId || !token) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/results/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          console.error('Failed to load results');
          return;
        }

        const data: Result[] = await res.json();
        console.log(data, "Fetched results");

        // Find the result for the current quiz
        const thisResult = data.find((r) => String(r.quiz.id) === quizId) || null;
        setResult(thisResult);
      } catch (err) {
        console.error(err);
        toast.error('Error loading results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId, token]);

  const handleRetakeQuiz = async () => {
    setRetaking(true);
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push(`/quiz/${quizId}`);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (percentage: number) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "Outstanding! 🎉", icon: <Award className="w-5 h-5" /> };
    if (percentage >= 80) return { message: "Great job! 👏", icon: <Trophy className="w-5 h-5" /> };
    if (percentage >= 70) return { message: "Good work! 👍", icon: <Target className="w-5 h-5" /> };
    if (percentage >= 60) return { message: "Not bad! 📚", icon: <BookOpen className="w-5 h-5" /> };
    return { message: "Keep practicing! 💪", icon: <TrendingUp className="w-5 h-5" /> };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full 
                        flex items-center justify-center mb-6 mx-auto animate-pulse">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <Spinner color="#3b82f6" size={8} />
          <p className="mt-4 text-gray-600 font-medium">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <XCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any results for this quiz. You may need to take the quiz first.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push(`/quiz/${quizId}`)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 
                       rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 
                       transition-all duration-200 cursor-pointer active:scale-95"
            >
              Take Quiz
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg 
                       hover:bg-gray-50 transition-colors duration-200 cursor-pointer active:scale-95"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.quiz.questions.length) * 100);
  const correctAnswers = result.score;
  const totalQuestions = result.quiz.questions.length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const performance = getPerformanceMessage(percentage);

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className={`bg-gradient-to-r ${getScoreGradient(percentage)} p-8 text-white`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Quiz Completed!</h1>
                <p className="text-white/90 text-lg">{result.quiz.topic}</p>
                <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                  {performance.icon}
                  <span className="font-medium">{performance.message}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 rounded-full border-4 border-white/30 bg-white/20 
                              flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{percentage}%</div>
                    <div className="text-sm opacity-90">Score</div>
                  </div>
                </div>
                <div className="text-white/90">
                  {correctAnswers} of {totalQuestions} correct
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{incorrectAnswers}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 capitalize">{result.quiz.difficulty}</div>
                <div className="text-sm text-gray-600">Difficulty</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {new Date(result.completed_at).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 
                     rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors 
                     duration-200 cursor-pointer active:scale-95 font-medium"
          >
            <BookOpen className="w-4 h-4" />
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
          
          <button
            onClick={handleRetakeQuiz}
            disabled={retaking}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 
                     text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 
                     transition-all duration-200 cursor-pointer active:scale-95 font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {retaking ? (
              <>
                <Spinner size={4} color="#ffffff" />
                Loading...
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </>
            )}
          </button>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 
                     rounded-xl hover:bg-gray-700 transition-colors duration-200 cursor-pointer 
                     active:scale-95 font-medium"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
        </div>

        {/* Detailed Results */}
        {showDetails && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Question by Question Review
              </h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {result.quiz.questions.map((q, i) => {
                  const userAnswer = result.answers[q.id];
                  const isCorrect = userAnswer === q.correct_option;
                  
                  return (
                    <div key={q.id} className={`p-6 rounded-xl border-2 ${
                      isCorrect 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          isCorrect 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {i + 1}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">{q.text}</h3>
                          
                          <div className="grid gap-3">
                            <div className={`p-3 rounded-lg border ${
                              userAnswer ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-900">Your Answer:</span>
                              </div>
                              <span className="text-gray-700">
                                {userAnswer ? `${userAnswer}: ${q[`option_${userAnswer.toLowerCase() as 'a'|'b'|'c'|'d'}`]}` : 'No answer selected'}
                              </span>
                            </div>
                            
                            <div className="p-3 rounded-lg border border-green-200 bg-green-50">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-green-900">Correct Answer:</span>
                              </div>
                              <span className="text-gray-700">
                                {q.correct_option}: {q[`option_${q.correct_option.toLowerCase() as 'a'|'b'|'c'|'d'}`]}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center gap-2">
                            {isCorrect ? (
                              <div className="flex items-center gap-2 text-green-700 font-medium">
                                <CheckCircle className="w-4 h-4" />
                                Correct
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-red-700 font-medium">
                                <XCircle className="w-4 h-4" />
                                Incorrect
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}