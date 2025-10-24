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

  if (error) {
    console.error('Error fetching discount codes:', error);
  }

  return (
    <AdminLayout title="Discount Codes" username={session.username}>
      <DiscountCodesClient initialDiscounts={discounts || []} />
    </AdminLayout>
  );
}
