"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Spinner from "react-spinners/PulseLoader";
import { useCallback } from "react";

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
  const { token } = useAuth();
  const router = useRouter();

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/quizzes/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) setQuizzes(await res.json());
      else toast.error("Failed to load quizzes");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

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
        toast.success("Quiz created!");
        fetchQuizzes();
        setFormData({ topic: "", num_questions: 5, difficulty: "easy" });
      } else {
        toast.error("Network error");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-lg shadow-md mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Topic"
            value={formData.topic}
            onChange={(e) =>
              setFormData({ ...formData, topic: e.target.value })
            }
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
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
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <select
            value={formData.difficulty}
            onChange={(e) =>
              setFormData({ ...formData, difficulty: e.target.value })
            }
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition w-full disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Quiz"}
        </button>
      </form>
      <h2 className="text-2xl font-semibold mb-4">Your Quizzes</h2>
      {loading ? (
        <div className="text-center">
          <Spinner color="#3b82f6" />
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold">{quiz.topic}</h3>
              <p className="text-gray-600">
                {quiz.num_questions} Questions • {quiz.difficulty}
              </p>
              <p className="text-gray-500 text-sm">
                {new Date(quiz.created_at).toLocaleDateString()}
              </p>
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => router.push(`/quiz/${quiz.id}`)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                >
                  Take
                </button>
                <button
                  onClick={() => router.push(`/results/${quiz.id}`)}
                  className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition"
                >
                  Results
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
