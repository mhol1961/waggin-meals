import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { getAdminSession } from '@/lib/admin-auth';
import AdminLayout from '@/components/admin/admin-layout';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getNewsletterSubscribers() {
  const { data: subscribers } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false });

  return subscribers || [];
}

export default async function NewsletterPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const subscribers = await getNewsletterSubscribers();

  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.status === 'active').length,
    unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
    thisWeek: subscribers.filter(s => {
      const subscribedDate = new Date(s.subscribed_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return subscribedDate > weekAgo && s.status === 'active';
    }).length,
  };

  return (
    <AdminLayout title="Newsletter Subscribers">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Total Subscribers
              </p>
              <p className="text-3xl font-bold text-[#3c3a47] mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {stats.total}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Active
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {stats.active}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                This Week
              </p>
              <p className="text-3xl font-bold text-[#a5b5eb] mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {stats.thisWeek}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <svg className="h-8 w-8 text-[#a5b5eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Unsubscribed
              </p>
              <p className="text-3xl font-bold text-gray-500 mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {stats.unsubscribed}
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          All Subscribers
        </h2>
        <button
          onClick={() => {
            const csv = [
              ['Email', 'First Name', 'Status', 'Source', 'Subscribed Date'].join(','),
              ...subscribers.map(s => [
                s.email,
                s.first_name || '',
                s.status,
                s.source,
                new Date(s.subscribed_at).toLocaleDateString()
              ].join(','))
            ].join('\n');

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
          }}
          className="bg-[#a5b5eb] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#8a9fd9] transition-colors"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Export to CSV
        </button>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  First Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Subscribed Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    No subscribers yet. Newsletter signups will appear here.
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {subscriber.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {subscriber.first_name || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subscriber.status === 'active' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Unsubscribed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {subscriber.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {new Date(subscriber.subscribed_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
