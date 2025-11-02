import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAdminSession } from '@/lib/admin-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Valid content types
const VALID_CONTENT_TYPES = [
  'blog_post',
  'product',
  'video',
  'testimonial',
  'case_study',
  'event'
];

// Table name mapping
const CONTENT_TYPE_TABLES: Record<string, string> = {
  blog_post: 'blog_posts',
  product: 'products',
  video: 'videos',
  testimonial: 'testimonials',
  case_study: 'case_studies',
  event: 'events'
};

// GET - List all archived content
export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('content_type');

    let query = supabase
      .from('archived_content')
      .select('*')
      .order('archived_at', { ascending: false });

    if (contentType && VALID_CONTENT_TYPES.includes(contentType)) {
      query = query.eq('content_type', contentType);
    }

    const { data: archivedItems, error } = await query;

    if (error) {
      console.error('Error fetching archived content:', error);
      return NextResponse.json({ error: 'Failed to fetch archived content' }, { status: 500 });
    }

    return NextResponse.json({ archivedItems }, { status: 200 });
  } catch (error) {
    console.error('Error in archive GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Archive content
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content_type, content_id, reason } = body;

    // Validate content type
    if (!VALID_CONTENT_TYPES.includes(content_type)) {
      return NextResponse.json(
        { error: `Invalid content type. Must be one of: ${VALID_CONTENT_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    if (!content_id) {
      return NextResponse.json({ error: 'content_id is required' }, { status: 400 });
    }

    const tableName = CONTENT_TYPE_TABLES[content_type];

    // Fetch the current content data
    const { data: contentData, error: fetchError } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', content_id)
      .single();

    if (fetchError || !contentData) {
      console.error('Error fetching content to archive:', fetchError);
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Check if already archived
    if (contentData.archived) {
      return NextResponse.json({ error: 'Content is already archived' }, { status: 400 });
    }

    // Create archive snapshot
    const { data: archivedContent, error: archiveError } = await supabase
      .from('archived_content')
      .insert({
        content_type,
        content_id,
        content_data: contentData,
        archived_by: session.username,
        reason: reason || null
      })
      .select()
      .single();

    if (archiveError) {
      console.error('Error creating archive:', archiveError);
      return NextResponse.json({ error: 'Failed to create archive' }, { status: 500 });
    }

    // Mark content as archived in original table
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ archived: true })
      .eq('id', content_id);

    if (updateError) {
      console.error('Error marking content as archived:', updateError);
      // Rollback: delete the archive entry
      await supabase
        .from('archived_content')
        .delete()
        .eq('id', archivedContent.id);
      return NextResponse.json({ error: 'Failed to archive content' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Content archived successfully',
      archivedContent
    }, { status: 200 });
  } catch (error) {
    console.error('Error in archive POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove from archive (permanently delete)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const archiveId = searchParams.get('id');

    if (!archiveId) {
      return NextResponse.json({ error: 'archive id is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('archived_content')
      .delete()
      .eq('id', archiveId);

    if (error) {
      console.error('Error deleting archived content:', error);
      return NextResponse.json({ error: 'Failed to delete archived content' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Archived content permanently deleted'
    }, { status: 200 });
  } catch (error) {
    console.error('Error in archive DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
