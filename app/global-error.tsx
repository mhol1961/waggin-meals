'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log critical error to error reporting service
    console.error('Critical application error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backgroundColor: '#fef2f2',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>
          <div style={{
            maxWidth: '600px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💔</div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem',
            }}>
              Something went seriously wrong
            </h1>
            <p style={{
              color: '#6b7280',
              marginBottom: '2rem',
            }}>
              We're sorry, but a critical error has occurred. Please try refreshing the page.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#f97316',
                color: 'white',
                fontWeight: '600',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
