'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { ArrowLeft } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setMessage('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage('Error updating password: ' + error.message);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a5b5eb]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e8f4fb]">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-[#a5b5eb] hover:text-[#8a9fd9] mb-8"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <h1
          className="text-4xl font-normal text-[#3c3a47] mb-8"
          style={{ fontFamily: "'Abril Fatface', serif" }}
        >
          Account Settings
        </h1>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3
            className="text-xl font-bold text-[#3c3a47] mb-6"
            style={{ fontFamily: "'Abril Fatface', serif" }}
          >
            Change Password
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {message && (
              <div className={`rounded-lg p-4 ${message.includes('Error') || message.includes('not match') || message.includes('at least') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                <p className="text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {message}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
                required
                minLength={6}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
                required
                minLength={6}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="w-full bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {changingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
