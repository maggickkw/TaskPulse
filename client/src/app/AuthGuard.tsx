import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-30 pt-10">
        <div className="w-full max-w-lg rounded-lg bg-white p-10 text-center shadow-lg">
          <h1 className="mb-6 text-3xl font-bold">{isSignup ? 'Create Account' : 'Please Sign In'}</h1>
          {isSignup ? (
            <SignupForm
              onSignup={signup}
              onSwitchToLogin={() => setIsSignup(false)}
            />
          ) : (
            <LoginForm
              onLogin={login}
              onSwitchToSignup={() => setIsSignup(true)}
            />
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
