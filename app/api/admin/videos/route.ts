import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';

/**
 * GET /api/admin/videos
 * Get all videos (including unpublished)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ videos: data });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/videos
 * Create a new video
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Validate required fields
    if (!title || !video_url) {
      return NextResponse.json(
        { error: 'Missing required fields: title and video_url' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Create video
    const { data, error } = await supabase
      .from('videos')
      .insert({
        title,
        description,
        video_url,
        thumbnail_url,
        duration,
        category,
        tags: tags || [],
        transcript,
        is_published: is_published || false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ video: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}
