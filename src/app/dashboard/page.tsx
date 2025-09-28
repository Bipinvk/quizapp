"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Spinner from "react-spinners/PulseLoader";
import { Plus, BookOpen, Calendar, Trophy, TrendingUp, Clock } from "lucide-react";

interface Quiz {
  id: number;
  topic: string;
  num_questions: number;
  difficulty: string;
  created_at: string;
}

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [formData, setFormData] = useState({
    topic: "",
    num_questions: 5,
    difficulty: "easy",
  });
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/quizzes/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setQuizzes(await res.json());
      else console.error("Failed to load quizzes");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/quizzes/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (res.ok) {
        toast.success("Quiz created successfully!");
        fetchQuizzes();
        setFormData({ topic: "", num_questions: 5, difficulty: "easy" });
        setShowCreateForm(false);
      } else {
        toast.error("Failed to create quiz");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const stats = {
    totalQuizzes: quizzes.length,
    totalQuestions: quizzes.reduce((sum, quiz) => sum + quiz.num_questions, 0),
    avgDifficulty: quizzes.length > 0 ? 
      Math.round(quizzes.map(q => q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3)
        .reduce((a, b) => a + b, 0) / quizzes.length * 10) / 10 : 0
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Ready to create and take some quizzes?
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 
                         text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl
                         hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 
                         transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <Plus className="w-5 h-5" />
              Create New Quiz
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Difficulty</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgDifficulty || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Quiz Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Quiz
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., JavaScript Basics"
                    value={formData.topic}
                    onChange={(e) =>
                      setFormData({ ...formData, topic: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={20}
                    value={formData.num_questions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        num_questions: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCreate}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                           p-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 
                           transition-all duration-200 font-medium disabled:opacity-50
                           disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={loading || !formData.topic.trim()}
                >
                  {loading ? (
                    <>
                      <Spinner size={4} color="#ffffff" />
                      Creating Quiz...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Quiz
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl 
                           hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quizzes Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Quizzes</h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'}
            </span>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Spinner color="#3b82f6" size={8} />
                <p className="mt-4 text-gray-600">Loading your quizzes...</p>
              </div>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No quizzes yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get started by creating your first quiz. Choose a topic, set the difficulty, and start learning!
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 
                         text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 
                         hover:to-indigo-700 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Create Your First Quiz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 
                           hover:shadow-lg hover:scale-105 transition-all duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                        {quiz.topic}
                      </h3>
                      <span className={`ml-3 px-2 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{quiz.num_questions} questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => router.push(`/quiz/${quiz.id}`)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                                 px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 
                                 transition-all duration-200 font-medium text-sm flex items-center 
                                 justify-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        Take Quiz
                      </button>
                      <button
                        onClick={() => router.push(`/results/${quiz.id}`)}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg 
                                 hover:bg-gray-200 transition-colors duration-200 font-medium 
                                 text-sm flex items-center justify-center gap-2"
                      >
                        <Trophy className="w-4 h-4" />
                        Results
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}