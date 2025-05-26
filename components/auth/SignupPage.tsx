import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { AuthLayout } from './AuthLayout';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { APP_NAME } from '../../constants';

export const SignupPage: React.FC = () => {
  const { signup, setCurrentView, isLoading, error } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    await signup(name, email, password);
    // Navigation is handled by AppContext/AppCore on successful signup
  };

  return (
    <AuthLayout title={`Create your ${APP_NAME} account`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
          placeholder="John Doe"
        />
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
          autoComplete="new-password"
          required
          placeholder="•••••••• (min. 6 characters)"
        />
        <Input
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
          placeholder="••••••••"
        />

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div>
          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading} disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-dark">
        Already have an account?{' '}
        <button
          onClick={() => setCurrentView('login')}
          className="font-medium text-macrum-primary hover:text-macrum-primary_hover"
        >
          Sign In
        </button>
      </p>
    </AuthLayout>
  );
};
