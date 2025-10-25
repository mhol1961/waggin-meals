'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#a5b5eb] to-[#c5d4f7] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-2xl p-4 shadow-lg mb-4">
            <img
              src="/images/logo-waggin-meals.png"
              alt="Waggin Meals"
              className="h-16 w-auto"
            />
          </div>
          <h1
            className="text-3xl font-normal text-white mb-2"
            style={{ fontFamily: "'Abril Fatface', serif" }}
          >
            Admin Login
          </h1>
          <p
            className="text-white/90 text-sm"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Access your content management system
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {error}
                </p>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-[#3c3a47] mb-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#a5b5eb] transition-colors"
                placeholder="Enter your username"
                required
                autoComplete="username"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#3c3a47] mb-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#a5b5eb] transition-colors"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Back to Website */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <a
              href="/"
              className="text-sm text-[#666666] hover:text-[#a5b5eb] transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              ← Back to Website
            </a>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
            This is a secure admin area. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
