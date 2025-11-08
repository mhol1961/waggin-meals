'use client';

import { useState } from 'react';

interface NewsletterSignupFormProps {
  source?: string;
  variant?: 'default' | 'blog';
}

export default function NewsletterSignupForm({ source = 'blog', variant = 'default' }: NewsletterSignupFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setMessage({
        type: 'success',
        text: data.message || 'Successfully subscribed!',
      });
      setEmail('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to subscribe. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'blog') {
    return (
      <div className="flex flex-col items-center">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md w-full">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#8FAE8F] disabled:opacity-50"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#8FAE8F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#6d8c6d] transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
            {message.text}
          </div>
        )}
        <p className="text-xs text-[#999999] mt-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  // Default variant
  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          placeholder="Enter your email"
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#8FAE8F] disabled:opacity-50"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#8FAE8F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#6d8c6d] transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          message.type === 'success'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
          {message.text}
        </div>
      )}
    </div>
  );
}
