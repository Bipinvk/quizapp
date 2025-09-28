import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import ToastProvider from "./components/ToastProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AI Quiz App",
  description: "Generate and take AI-powered quizzes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        {/* Accessibility - Skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:text-blue-600 focus:p-2 focus:rounded-md shadow-sm"
        >
          Skip to main content
        </a>

        <AuthProvider>
          <ToastProvider />

          {/* Header */}
          <header className="shadow-sm sticky top-0 z-50 bg-white">
            <Header />
          </header>

          {/* Main Content */}
          <main
            id="main-content"
            className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8  max-w-8xl"
          >
            {children}
          </main>

          {/* Footer */}
          <footer className=" border-t border-gray-200">
            <Footer />
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
