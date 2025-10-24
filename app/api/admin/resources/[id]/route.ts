import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';

/**
 * GET /api/admin/resources/[id]
 * Get a single resource by ID
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
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ resource: data });
  } catch (error) {
    console.error('Error fetching resource:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/resources/[id]
 * Update a resource
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
      resource_type,
      file_url,
      thumbnail_url,
      category,
      tags,
      is_free,
      price,
      is_published,
    } = body;

    const supabase = createServerClient();

    // Build update object with only provided fields
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (resource_type !== undefined) updates.resource_type = resource_type;
    if (file_url !== undefined) updates.file_url = file_url;
    if (thumbnail_url !== undefined) updates.thumbnail_url = thumbnail_url;
    if (category !== undefined) updates.category = category;
    if (tags !== undefined) updates.tags = tags;
    if (is_free !== undefined) updates.is_free = is_free;
    if (price !== undefined) updates.price = price;
    if (is_published !== undefined) updates.is_published = is_published;

    // Update resource
    const { data, error } = await supabase
      .from('resources')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ resource: data });
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/resources/[id]
 * Delete a resource
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

    // Get the resource first to check if it exists
    const { data: resource, error: fetchError } = await supabase
      .from('resources')
      .select('file_url, thumbnail_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    // Delete the resource
    const { error: deleteError } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    // TODO: Delete associated files from storage if needed

    return NextResponse.json(
      { message: 'Resource deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
