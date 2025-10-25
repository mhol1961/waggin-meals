'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);
    setFirstName(user.user_metadata?.first_name || '');
    setLastName(user.user_metadata?.last_name || '');
    setPhone(user.user_metadata?.phone || '');
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        },
      });

      if (error) throw error;

      setMessage('Profile updated successfully!');
    } catch (error: any) {
      setMessage('Error updating profile: ' + error.message);
    } finally {
      setSaving(false);
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
          Profile Settings
        </h1>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <form onSubmit={handleSave} className="space-y-6">
            {message && (
              <div className={`rounded-lg p-4 ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                <p className="text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {message}
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
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
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              <p className="text-xs text-[#666666] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Contact support to change your email
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
