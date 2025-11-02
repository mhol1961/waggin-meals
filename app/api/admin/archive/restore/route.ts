import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAdminSession } from '@/lib/admin-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Table name mapping
const CONTENT_TYPE_TABLES: Record<string, string> = {
  blog_post: 'blog_posts',
  product: 'products',
  video: 'videos',
  testimonial: 'testimonials',
  case_study: 'case_studies',
  event: 'events'
};

// POST - Restore archived content
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { archive_id } = body;

    if (!archive_id) {
      return NextResponse.json({ error: 'archive_id is required' }, { status: 400 });
    }

    // Fetch the archived content
    const { data: archivedItem, error: fetchError } = await supabase
      .from('archived_content')
      .select('*')
      .eq('id', archive_id)
      .single();

    if (fetchError || !archivedItem) {
      console.error('Error fetching archived content:', fetchError);
      return NextResponse.json({ error: 'Archived content not found' }, { status: 404 });
    }

    const tableName = CONTENT_TYPE_TABLES[archivedItem.content_type];

    if (!tableName) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    // Unarchive the content in the original table
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ archived: false })
      .eq('id', archivedItem.content_id);

    if (updateError) {
      console.error('Error restoring content:', updateError);
      return NextResponse.json({ error: 'Failed to restore content' }, { status: 500 });
    }

    // Optionally, remove from archive table (or keep for history)
    // For now, we'll keep it but you could delete it:
    // await supabase.from('archived_content').delete().eq('id', archive_id);

    return NextResponse.json({
      message: 'Content restored successfully',
      content_type: archivedItem.content_type,
      content_id: archivedItem.content_id
    }, { status: 200 });
  } catch (error) {
    console.error('Error in restore POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
