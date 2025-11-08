"use client";

import { useState, FormEvent } from 'react';
import { Mail } from 'lucide-react';

export function FooterNewsletter() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          source: 'footer'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Welcome to the pack! Check your email for a special welcome gift.');
        setFirstName('');
        setEmail('');

        // Reset success message after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Unable to connect. Please try again later.');
    }
  };

  return (
    <div className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-white/20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mail className="w-5 h-5 text-[#d4e4d4]" />
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Join Our Nutrition Newsletter
          </h3>
        </div>
        <p className="text-xs opacity-90 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Get expert tips, exclusive recipes, and special offers delivered to your inbox weekly.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            disabled={status === 'loading'}
            className="flex-1 px-4 py-2.5 rounded-full text-sm text-gray-900 bg-white border-2 border-transparent focus:border-[#8FAE8F] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
            className="flex-1 px-4 py-2.5 rounded-full text-sm text-gray-900 bg-white border-2 border-transparent focus:border-[#8FAE8F] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-2.5 rounded-full text-sm font-semibold bg-[#8FAE8F] text-white hover:bg-[#6d8c6d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {message && (
          <p
            className={`text-xs mt-3 ${status === 'success' ? 'text-green-300' : 'text-red-300'}`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
