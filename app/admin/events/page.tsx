import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { getAllEvents } from '@/lib/supabase/server';
import AdminLayout from '@/components/admin/admin-layout';
import EventsListClient from '@/components/admin/events-list-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EventsListPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  const events = await getAllEvents(false);

  return (
    <AdminLayout title="Events" username={session.username}>
      <EventsListClient initialEvents={events || []} />
    </AdminLayout>
  );
}
