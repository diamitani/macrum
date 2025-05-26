import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { AuthLayout } from './AuthLayout';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { APP_NAME } from '../../constants';

export const LoginPage: React.FC = () => {
  const { login, setCurrentView, isLoading, error } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        // Basic client-side validation, error state in context handles API errors
        alert("Please enter both email and password."); 
        return;
    }
    await login(email, password);
    // Navigation is handled by AppContext/AppCore on successful login
  };

  return (
    <AuthLayout title="Sign in to your account">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
        
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div>
          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-dark">
        Not a member?{' '}
        <button
          onClick={() => setCurrentView('signup')}
          className="font-medium text-macrum-primary hover:text-macrum-primary_hover"
        >
          Sign up for {APP_NAME}
        </button>
      </p>
    </AuthLayout>
  );
};
