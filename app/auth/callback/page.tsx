'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthClient } from '@/lib/supabase/auth-client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = getAuthClient();

      // Get the code from the URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const code = hashParams.get('code');

      if (!code) {
        setError('No authorization code found');
        setTimeout(() => router.push('/auth/login'), 3000);
        return;
      }

      try {
        // Exchange the code for a session
        const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code);

        if (authError) {
          throw authError;
        }

        if (data.session) {
          // Successfully authenticated - redirect to account or checkout
          const redirectTo = sessionStorage.getItem('auth_redirect') || '/account';
          sessionStorage.removeItem('auth_redirect');
          router.push(redirectTo);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setTimeout(() => router.push('/auth/login'), 3000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error ? (
            <>
              <div className="text-center">
                <div className="text-red-600 text-5xl mb-4">✗</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Authentication Error
                </h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <p className="text-sm text-gray-500">Redirecting to login...</p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#8FAE8F] border-r-transparent mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Completing Sign In...
                </h2>
                <p className="text-gray-600">Please wait while we authenticate your account.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
