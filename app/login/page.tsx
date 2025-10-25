'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e8f4fb] py-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link href="/">
            <img
              src="/images/logo-waggin-meals.png"
              alt="Waggin Meals"
              className="h-16 w-auto mx-auto mb-4"
            />
          </Link>
          <h1
            className="text-3xl font-normal text-[#3c3a47] mb-2"
            style={{ fontFamily: "'Abril Fatface', serif" }}
          >
            Welcome Back
          </h1>
          <p
            className="text-[#666666]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Log in to manage your account and orders
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {error}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
                required
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
                required
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center space-y-3">
            <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#a5b5eb] hover:text-[#8a9fd9] font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
