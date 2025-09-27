'use client'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'  // Install lucide-react: npm install lucide-react

export default function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">AI Quiz App</h1>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {theme === 'dark' ? <Sun /> : <Moon />}
      </button>
    </nav>
  )
}