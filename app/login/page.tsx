import { Suspense } from 'react';
import LoginClient from '@/components/login-client';

export const metadata = {
  title: "Customer Login | Waggin' Meals",
  description: "Log in to your Waggin' Meals account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back! 🐾
          </h1>
          <p className="text-gray-600">
            Enter your email to receive a login link
          </p>
        </div>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <LoginClient />
        </Suspense>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>New to Waggin' Meals?</p>
          <p className="mt-1">
            <a href="/" className="text-[#a5b5eb] hover:underline">
              Start shopping
            </a>
            {' '}to create an account
          </p>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            🔒 We'll send you a secure login link via email.
            <br />
            No password needed!
          </p>
        </div>
      </div>
    </div>
  );
}
