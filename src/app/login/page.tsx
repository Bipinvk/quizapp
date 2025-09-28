'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from 'react-spinners/PulseLoader';
import { 
  User, 
  Mail, 
  Lock, 
  LogIn, 
  UserPlus, 
  Eye, 
  EyeOff, 
  BookOpen,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const { setToken } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!isLogin && !formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isLogin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!isLogin && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setFormErrors({});
    
    try {
      const url = isLogin ? '/api/login/' : '/api/register/';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          ...(isLogin ? {} : { email: formData.email }) 
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (isLogin) {
          setToken(data.access);
          toast.success('Welcome back! 🎉');
          router.push('/dashboard');
        } else {
          toast.success('Account created successfully! Please login.');
          setIsLogin(true);
          setFormData({ username: '', email: '', password: '' });
          setFormErrors({});
        }
      } else {
        // Handle specific field errors
        if (data.username) {
          setFormErrors(prev => ({...prev, username: data.username[0]}));
        }
        if (data.email) {
          setFormErrors(prev => ({...prev, email: data.email[0]}));
        }
        if (data.password) {
          setFormErrors(prev => ({...prev, password: data.password[0]}));
        }
        
        toast.error(data.error || data.detail || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '' });
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full 
                        flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back!' : 'Join QuizApp'}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? 'Sign in to continue your learning journey' 
              : 'Create your account and start learning today'
            }
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => isLogin || toggleMode()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg 
                          transition-all duration-200 font-medium cursor-pointer active:scale-95
                          ${isLogin 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                          }`}
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button
                onClick={() => !isLogin || toggleMode()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg 
                          transition-all duration-200 font-medium cursor-pointer active:scale-95
                          ${!isLogin 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                          }`}
              >
                <UserPlus className="w-4 h-4" />
                Register
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                    if (formErrors.username) {
                      setFormErrors(prev => ({...prev, username: ''}));
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 
                            focus:ring-blue-500 focus:border-transparent transition-all duration-200
                            ${formErrors.username 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-gray-300 hover:border-gray-400'
                            }`}
                />
              </div>
              {formErrors.username && (
                <p className="mt-2 text-sm text-red-600">{formErrors.username}</p>
              )}
            </div>

            {/* Email Field (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) {
                        setFormErrors(prev => ({...prev, email: ''}));
                      }
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 
                              focus:ring-blue-500 focus:border-transparent transition-all duration-200
                              ${formErrors.email 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300 hover:border-gray-400'
                              }`}
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (formErrors.password) {
                      setFormErrors(prev => ({...prev, password: ''}));
                    }
                  }}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 
                            focus:ring-blue-500 focus:border-transparent transition-all duration-200
                            ${formErrors.password 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-gray-300 hover:border-gray-400'
                            }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer 
                           hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 
                       rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none 
                       focus:ring-4 focus:ring-blue-300 font-medium transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                       cursor-pointer active:scale-95 hover:shadow-lg flex items-center 
                       justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size={4} color="#ffffff" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline 
                         transition-colors cursor-pointer active:scale-95"
              >
                {isLogin ? 'Create one now' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">AI-Powered</h3>
            <p className="text-sm text-gray-600">Smart quiz generation</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Learn Anywhere</h3>
            <p className="text-sm text-gray-600">Mobile responsive</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Secure</h3>
            <p className="text-sm text-gray-600">Your data is safe</p>
          </div>
        </div>
      </div>
    </div>
  );
}