import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { getAdminSession } from '@/lib/admin-auth';
import AdminLayout from '@/components/admin/admin-layout';
import DiscountCodesClient from '@/components/admin/discount-codes-client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function DiscountsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Fetch all discount codes
  const { data: discounts, error } = await supabase
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false });

  // Check if table doesn't exist (error code 42P01)
  const tableDoesNotExist = error && (
    error.message?.includes('does not exist') ||
    error.message?.includes('relation') ||
    error.code === '42P01' ||
    error.code === 'PGRST204'
  );

  if (error && !tableDoesNotExist) {
    console.error('Error fetching discount codes:', error);
  }

  return (
    <AdminLayout title="Discount Codes" username={session.username}>
      {tableDoesNotExist ? (
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Database Table Not Found
                </h3>
                <p className="text-yellow-700 mb-4">
                  The <code className="bg-yellow-100 px-2 py-1 rounded">discount_codes</code> table needs to be created in your Supabase database.
                </p>

                <div className="bg-white border border-yellow-200 rounded-md p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Quick Setup Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Go to your <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Dashboard</a></li>
                    <li>Navigate to the <strong>SQL Editor</strong></li>
                    <li>Copy the SQL from: <code className="bg-gray-100 px-2 py-1 rounded text-sm">supabase/migrations/20251102_create_discount_codes.sql</code></li>
                    <li>Paste and run the SQL in the editor</li>
                    <li>Refresh this page</li>
                  </ol>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Migration file location:</strong>
                  </p>
                  <code className="block bg-gray-800 text-green-400 p-2 rounded text-xs font-mono">
                    /mnt/c/waggin-meals/supabase/migrations/20251102_create_discount_codes.sql
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <DiscountCodesClient initialDiscounts={discounts || []} />
      )}
    </AdminLayout>
  );
}
