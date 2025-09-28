'use client';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const { token, setToken } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setToken(null);
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={token ? '/dashboard' : '/'} className="text-2xl font-bold text-blue-600">QuizApp</Link>
        <div>
          {token ? (
            <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Logout
            </button>
          ) : (
            <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}