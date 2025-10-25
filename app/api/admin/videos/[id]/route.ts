import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';

/**
 * GET /api/admin/videos/[id]
 * Get a single video by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params in Next.js 15
    const { id } = await params;

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Video not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ video: data });
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/videos/[id]
 * Update a video
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params in Next.js 15
    const { id } = await params;

    const body = await request.json();
    const {
      title,
      description,
      video_url,
      thumbnail_url,
      duration,
      category,
      tags,
      transcript,
      is_published,
    } = body;

    const supabase = createServerClient();

    // Build update object with only provided fields
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (video_url !== undefined) updates.video_url = video_url;
    if (thumbnail_url !== undefined) updates.thumbnail_url = thumbnail_url;
    if (duration !== undefined) updates.duration = duration;
    if (category !== undefined) updates.category = category;
    if (tags !== undefined) updates.tags = tags;
    if (transcript !== undefined) updates.transcript = transcript;
    if (is_published !== undefined) updates.is_published = is_published;

    // Update video
    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Video not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ video: data });
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/videos/[id]
 * Delete a video
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params in Next.js 15
    const { id } = await params;

    const supabase = createServerClient();

    // Get the video first to check if it exists
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('thumbnail_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Video not found' },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    // Delete the video
    const { error: deleteError } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    // TODO: Delete associated thumbnail from storage if needed

    return NextResponse.json(
      { message: 'Video deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}
