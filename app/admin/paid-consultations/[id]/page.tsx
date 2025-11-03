import { redirect, notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import PaidConsultationDetailClient from '@/components/admin/paid-consultation-detail-client';

export default async function PaidConsultationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createServerClient();
  const resolvedParams = await params;

  // Check admin authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Get consultation with all related data
  const { data: consultation, error } = await supabase
    .from('paid_consultations')
    .select(`
      *,
      customers (
        id,
        first_name,
        last_name,
        email,
        phone
      ),
      orders (
        id,
        order_number,
        total,
        payment_status,
        created_at
      )
    `)
    .eq('id', resolvedParams.id)
    .single();

  if (error || !consultation) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <PaidConsultationDetailClient consultation={consultation} />
      </div>
    </div>
  );
}
