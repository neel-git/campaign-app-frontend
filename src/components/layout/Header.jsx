// src/components/layout/Header.jsx
import { useState } from 'react';
import { LoginModal } from '../auth/LoginModal';
import { SignupModal } from '../auth/SignupModal';

export const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const switchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  }
  return (
    <header className="fixed w-full bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">
              Practice Management
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Login
            </button>
            <button
              onClick={() => setIsSignupOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
      <SignupModal 
        isOpen={isSignupOpen} 
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={switchToLogin}
      />
    </header>
  );
};