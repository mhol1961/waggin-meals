import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';

/**
 * GET /api/admin/events
 * Get all events (including unpublished)
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
      .from('events')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ events: data });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/events
 * Create a new event
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
      event_type,
      start_date,
      end_date,
      location,
      registration_url,
      max_attendees,
      current_attendees,
      price,
      image_url,
      is_published,
    } = body;

    // Validate required fields
    if (!title || !description || !start_date) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, and start_date' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Create event
    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        event_type,
        start_date,
        end_date,
        location,
        registration_url,
        max_attendees,
        current_attendees: current_attendees || 0,
        price,
        image_url,
        is_published: is_published || false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ event: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
