import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from './context/AuthContext'
import ToastProvider from './components/ToastProvider'
import Navbar from './components/Navbar'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Quiz App',
  description: 'Generate and take AI-powered quizzes',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ToastProvider />
            <Navbar />
            <main className="container mx-auto p-4">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}