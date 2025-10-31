import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import SettingsClient from '@/components/admin/settings-client';

export default async function AdminSettingsPage() {
  // Check authentication
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  const supabase = createClient();

  // Fetch current settings
  const { data: settings, error } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching settings:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              Site Settings
            </h1>
            <p className="text-sm text-gray-600">
              Configure your e-commerce settings
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SettingsClient initialSettings={settings || null} />
      </main>
    </div>
  );
}
