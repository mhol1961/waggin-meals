'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Success - redirect to account
      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-16 px-4">
      <div className="max-w-md mx-auto">
        {/* Logo */}
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
            Create Account
          </h1>
          <p
            className="text-[#666666]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Join Waggin Meals for fresh, healthy pet nutrition
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {error}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#8FAE8F]"
                  required
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#8FAE8F]"
                  required
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#8FAE8F]"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#8FAE8F]"
                required
                minLength={6}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              <p className="text-xs text-[#666666] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Must be at least 6 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8FAE8F] text-white py-3 rounded-lg font-semibold hover:bg-[#6d8c6d] transition-colors disabled:opacity-50"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Already have an account?{' '}
              <Link href="/login" className="text-[#8FAE8F] hover:text-[#6d8c6d] font-semibold">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
