import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from './context/AuthContext'
import ToastProvider from './components/ToastProvider'
import Header from './components/Header';
import Footer from './components/Footer'

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
   <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <ToastProvider/>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}