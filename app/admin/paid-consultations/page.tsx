import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import PaidConsultationsClient from '@/components/admin/paid-consultations-client';

export const metadata = {
  title: 'Paid Consultations | Admin - Waggin Meals',
  description: 'Manage $395 comprehensive canine nutrition consultations',
};

export default async function PaidConsultationsPage() {
  const supabase = createServerClient();

  // Check admin authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Get all paid consultations with customer info
  const { data: consultations, error } = await supabase
    .from('paid_consultations')
    .select(`
      *,
      customers (
        id,
        first_name,
        last_name,
        email
      ),
      orders (
        id,
        order_number,
        total,
        created_at
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching paid consultations:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Paid Consultations</h1>
          <p className="mt-2 text-gray-600">
            Manage $395 comprehensive canine nutrition consultations
          </p>
        </div>

        <PaidConsultationsClient initialConsultations={consultations || []} />
      </div>
    </div>
  );
}
