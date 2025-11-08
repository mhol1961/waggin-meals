'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service (e.g., Sentry)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Dog Icon */}
        <div className="mb-8">
          <div className="text-8xl mb-4">🐕</div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Don't worry - even the best dogs have accidents sometimes!
          </p>
        </div>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl text-left">
            <h2 className="font-semibold text-red-900 mb-2">Error Details:</h2>
            <p className="text-sm text-red-700 font-mono break-words">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border-2 border-gray-200 transition-colors shadow-lg hover:shadow-xl"
          >
            Go Home
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">
            Need help?
          </h3>
          <p className="text-gray-600 mb-4">
            If this error persists, please contact our support team.
          </p>
          <Link
            href="/contact"
            className="text-orange-600 hover:text-orange-700 font-medium underline"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
}
