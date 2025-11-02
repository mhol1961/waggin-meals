import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { ConsultationsClient } from '@/components/admin/consultations-client';
import Link from 'next/link';

export default async function ConsultationsAdminPage() {
  // Check authentication
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin"
                className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Free Consultation Requests
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                View and manage free consultation requests from contact-expert form
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-sm text-gray-600 hover:text-gray-900 transition"
              >
                Dashboard
              </Link>
              <form action="/api/admin/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ConsultationsClient />
      </main>
    </div>
  );
}
