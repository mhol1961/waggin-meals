import { redirect, notFound } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { createServerClient } from '@/lib/supabase/server';
import AdminLayout from '@/components/admin/admin-layout';
import EventForm from '@/components/admin/event-form';
import Link from 'next/link';

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Await params in Next.js 15
  const { id } = await params;

  const supabase = createServerClient();
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !event) {
    notFound();
  }

  return (
    <AdminLayout title={`Edit: ${event.title}`} username={session.username}>
      <div className="mb-6">
        <Link
          href="/admin/events"
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Events
        </Link>
      </div>

      <EventForm event={event} isEdit />
    </AdminLayout>
  );
}
