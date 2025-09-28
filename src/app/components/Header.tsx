'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, User, LogOut, BookOpen, Home, Plus } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token, setToken } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setToken(null);
    setMobileMenuOpen(false);
    router.push('/login');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link
            href={token ? '/dashboard' : '/'}
            className="flex items-center gap-2 text-2xl font-bold text-transparent bg-clip-text 
                     bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 
                     hover:to-indigo-700 transition-all duration-200 cursor-pointer active:scale-95"
            onClick={closeMobileMenu}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg 
                          flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            QuizApp
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {token ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 
                           transition-colors duration-200 font-medium cursor-pointer active:scale-95"
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 
                                rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 
                             text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 
                             hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 
                             focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer
                             active:scale-95"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                       className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                             text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 
                             hover:to-indigo-700 transition-all duration-200 cursor-pointer
                             active:scale-95"
                >
                  Login
                </Link>
              
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer active:scale-95"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {token ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 
                             transition-colors duration-200 font-medium py-3 px-3 rounded-lg 
                             hover:bg-blue-50 cursor-pointer active:scale-95"
                  >
                    <Home className="w-5 h-5" />
                    Dashboard
                  </Link>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-3 px-3 py-2 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 
                                    rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">My Account</p>
                        <p className="text-sm text-gray-500">Manage your profile</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 text-red-600 hover:text-red-700 
                               transition-colors duration-200 font-medium py-3 px-3 rounded-lg 
                               hover:bg-red-50 w-full cursor-pointer active:scale-95"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                      className="flex justify-center items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                             text-white py-3 px-3 rounded-lg font-medium hover:from-blue-700 
                             hover:to-indigo-700 transition-all duration-200 cursor-pointer
                             active:scale-95"
                  >
                    <User className="w-5 h-5" />
                    Login
                  </Link>
                  
               
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}