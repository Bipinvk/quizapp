import { Heart, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg 
                            flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text 
                             bg-gradient-to-r from-blue-600 to-indigo-600">
                QuizApp
              </span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Create, share, and take AI-powered quizzes on any topic. 
              Learn smarter with personalized quiz experiences.
            </p>
    
          </div>

    
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-center sm:text-left">
              &copy; 2025 QuizApp. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <a href="/terms" className="hover:text-gray-700 transition-colors cursor-pointer">
                Terms of Service
              </a>
              <span>•</span>
              <a href="/privacy" className="hover:text-gray-700 transition-colors cursor-pointer">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}