'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from 'react-spinners/PulseLoader';
import { 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Flag, 
  BookOpen,
  Target,
  Timer
} from 'lucide-react';

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
  const [submitting, setSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeStarted, setTimeStarted] = useState<Date>(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [quizTitle, setQuizTitle] = useState('');
  const { token } = useAuth();
  const router = useRouter();

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((new Date().getTime() - timeStarted.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeStarted]);

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
          console.error('Failed to load quiz');
          return;
        }

        const data = await res.json();
        setQuestions(data.questions ?? []);
        setQuizTitle(data.topic || 'Quiz');
        setTimeStarted(new Date());
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

    setSelectedOption(option);
    setAnswers((prev) => ({ ...prev, [qId]: option }));

    // Add a small delay for visual feedback
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        submitQuiz();
      }
    }, 300);
  };

  const goToPrevious = () => {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
      setSelectedOption(null);
    }
  };

  const goToNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelectedOption(null);
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
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
        toast.success('Quiz submitted successfully!');
        router.push(`/results/${quizId}`);
      } else {
        toast.error('Failed to submit quiz');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getOptionLetter = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  const isCurrentQuestionAnswered = () => {
    const qId = questions[currentQ]?.id;
    return qId ? answers[qId] : false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full 
                        flex items-center justify-center mb-6 mx-auto animate-pulse">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <Spinner color="#3b82f6" size={8} />
          <p className="mt-4 text-gray-600 font-medium">Loading your quiz...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Questions Available</h2>
          <p className="text-gray-600 mb-6">
            This quiz doesn't have any questions yet. Please try another quiz.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 
                     rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 
                     transition-all duration-200 cursor-pointer active:scale-95"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-white py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {quizTitle}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>Question {currentQ + 1} of {questions.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Timer className="w-4 h-4" />
                  <span>{formatTime(elapsedTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>{answeredCount} answered</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 
                       rounded-lg hover:bg-gray-50 transition-colors cursor-pointer active:scale-95"
            >
              Exit Quiz
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full 
                         transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="p-8">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl 
                            flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">{currentQ + 1}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed">
                  {q?.text}
                </h2>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {(['A', 'B', 'C', 'D'] as const).map((opt, index) => {
                const optionKey = `option_${opt.toLowerCase() as 'a' | 'b' | 'c' | 'd'}`;
                const isSelected = selectedOption === opt;
                const wasAnswered = answers[q.id] === opt;
                
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={submitting}
                    className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 
                              cursor-pointer active:scale-98 group
                              ${isSelected 
                                ? 'border-green-500 bg-green-50 shadow-lg' 
                                : wasAnswered
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md'
                              }
                              ${submitting ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center 
                                     font-semibold transition-all duration-200
                                     ${isSelected 
                                       ? 'border-green-500 bg-green-500 text-white' 
                                       : wasAnswered
                                       ? 'border-blue-500 bg-blue-500 text-white'
                                       : 'border-gray-300 text-gray-600 group-hover:border-blue-500 group-hover:text-blue-600'
                                     }`}>
                        {isSelected ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          getOptionLetter(index)
                        )}
                      </div>
                      <span className={`text-lg flex-1 transition-colors duration-200
                                      ${isSelected 
                                        ? 'text-green-900 font-medium' 
                                        : wasAnswered
                                        ? 'text-blue-900 font-medium'
                                        : 'text-gray-700 group-hover:text-blue-900'
                                      }`}>
                        {q[optionKey as keyof Question]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-100 p-6">
            <div className="flex justify-between items-center">
              <button
                onClick={goToPrevious}
                disabled={currentQ === 0}
                className="flex items-center gap-2 px-6 py-3 text-gray-700 border border-gray-300 
                         rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-3">
                {isCurrentQuestionAnswered() && (
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Answered</span>
                  </div>
                )}
              </div>

              {currentQ < questions.length - 1 ? (
                <button
                  onClick={goToNext}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 
                           text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 
                           hover:to-indigo-700 transition-all duration-200 cursor-pointer active:scale-95"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={submitQuiz}
                  disabled={submitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 
                           text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 
                           hover:to-emerald-700 transition-all duration-200 cursor-pointer 
                           active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Spinner size={4} color="#ffffff" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Flag className="w-4 h-4" />
                      Submit Quiz
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quiz Overview</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentQ(index);
                  setSelectedOption(null);
                }}
                className={`w-10 h-10 rounded-lg border-2 font-medium text-sm transition-all 
                          duration-200 cursor-pointer active:scale-95
                          ${index === currentQ
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : answers[questions[index].id]
                            ? 'border-green-500 bg-green-100 text-green-700 hover:bg-green-200'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                          }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            <span className="font-medium">{answeredCount}</span> of <span className="font-medium">{questions.length}</span> questions answered
          </p>
        </div>
      </div>
    </div>
  );
}