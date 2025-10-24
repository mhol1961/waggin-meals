import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';

/**
 * GET /api/admin/testimonials/[id]
 * Get a single testimonial by ID
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
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Testimonial not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ testimonial: data });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/testimonials/[id]
 * Update a testimonial
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
      dog_name,
      owner_name,
      location,
      category,
      problem,
      result,
      quote,
      service,
      rating,
      image_url,
      is_featured,
      is_published,
    } = body;

    const supabase = createServerClient();

    // Build update object with only provided fields
    const updates: any = {};
    if (dog_name !== undefined) updates.dog_name = dog_name;
    if (owner_name !== undefined) updates.owner_name = owner_name;
    if (location !== undefined) updates.location = location;
    if (category !== undefined) updates.category = category;
    if (problem !== undefined) updates.problem = problem;
    if (result !== undefined) updates.result = result;
    if (quote !== undefined) updates.quote = quote;
    if (service !== undefined) updates.service = service;
    if (rating !== undefined) updates.rating = rating;
    if (image_url !== undefined) updates.image_url = image_url;
    if (is_featured !== undefined) updates.is_featured = is_featured;
    if (is_published !== undefined) updates.is_published = is_published;

    // Update testimonial
    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Testimonial not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ testimonial: data });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/testimonials/[id]
 * Delete a testimonial
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

    // Get the testimonial first to check if it exists
    const { data: testimonial, error: fetchError } = await supabase
      .from('testimonials')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Testimonial not found' },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    // Delete the testimonial
    const { error: deleteError } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    // TODO: Delete associated image from storage if needed

    return NextResponse.json(
      { message: 'Testimonial deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}
