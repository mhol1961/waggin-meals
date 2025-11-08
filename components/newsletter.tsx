'use client';

import { useState, FormEvent } from 'react';
import { Mail } from 'lucide-react';

export function Newsletter() {
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
          source: 'page'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Welcome to the pack! Check your email for a special welcome gift.');
        setFirstName('');
        setEmail('');

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
    <section className="bg-[#8FAE8F] px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="w-10 h-10 text-white" />
            <h2 className="text-4xl font-normal text-white" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Join Our Pack!
            </h2>
          </div>
          <p className="text-lg text-white/90" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Get exclusive nutrition tips, recipes, special offers, and updates delivered to your inbox.
          </p>
        </div>

        {/* Functional Newsletter Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={status === 'loading'}
                className="px-4 py-3 rounded-lg text-gray-900 bg-gray-50 border-2 border-gray-200 focus:border-[#8FAE8F] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                className="px-4 py-3 rounded-lg text-gray-900 bg-gray-50 border-2 border-gray-200 focus:border-[#8FAE8F] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-6 py-3 rounded-lg text-lg font-semibold bg-[#8FAE8F] text-white hover:bg-[#6d8c6d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
            </button>

            {message && (
              <p
                className={`text-sm mt-4 text-center ${status === 'success' ? 'text-green-700' : 'text-red-700'}`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {message}
              </p>
            )}
          </form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex flex-wrap justify-center gap-8 text-white/80 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span>No spam, ever</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
            <span>Weekly nutrition tips</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            <span>Exclusive offers</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <span>Unsubscribe anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
