import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { getAllTestimonials } from '@/lib/supabase/server';
import AdminLayout from '@/components/admin/admin-layout';
import TestimonialsListClient from '@/components/admin/testimonials-list-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TestimonialsListPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  const testimonials = await getAllTestimonials(false);

  return (
    <AdminLayout title="Testimonials" username={session.username}>
      <TestimonialsListClient initialTestimonials={testimonials || []} />
    </AdminLayout>
  );
}
