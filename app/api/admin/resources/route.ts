import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';

/**
 * GET /api/admin/resources
 * Get all resources (including unpublished)
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
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ resources: data });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/resources
 * Create a new resource
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
      resource_type,
      file_url,
      thumbnail_url,
      category,
      tags,
      is_free,
      price,
      is_published,
    } = body;

    // Validate required fields
    if (!title || !resource_type || !file_url) {
      return NextResponse.json(
        { error: 'Missing required fields: title, resource_type, and file_url' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Create resource
    const { data, error } = await supabase
      .from('resources')
      .insert({
        title,
        description,
        resource_type,
        file_url,
        thumbnail_url,
        category,
        tags: tags || [],
        is_free: is_free !== undefined ? is_free : true,
        price,
        is_published: is_published || false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ resource: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
