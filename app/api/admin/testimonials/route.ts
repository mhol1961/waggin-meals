import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';

/**
 * GET /api/admin/testimonials
 * Get all testimonials (including unpublished)
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
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ testimonials: data });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/testimonials
 * Create a new testimonial
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

    // Validate required fields
    if (!dog_name || !owner_name || !category || !problem || !result || !quote) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Create testimonial
    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        dog_name,
        owner_name,
        location,
        category,
        problem,
        result,
        quote,
        service,
        rating: rating || 5,
        image_url,
        is_featured: is_featured || false,
        is_published: is_published || false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ testimonial: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}
