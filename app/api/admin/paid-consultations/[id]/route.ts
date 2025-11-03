import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * PATCH /api/admin/paid-consultations/[id]
 * Update a paid consultation (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const resolvedParams = await params;

    // Check admin authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      status,
      scheduled_date,
      scheduled_duration,
      consultation_notes,
      admin_notes,
      meal_plan_url,
      recommendations_url,
    } = body;

    // Build update object (only include provided fields)
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (status) updates.status = status;
    if (scheduled_date !== undefined) updates.scheduled_date = scheduled_date;
    if (scheduled_duration) updates.scheduled_duration = scheduled_duration;
    if (consultation_notes !== undefined) updates.consultation_notes = consultation_notes;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;
    if (meal_plan_url) updates.meal_plan_url = meal_plan_url;
    if (recommendations_url) updates.recommendations_url = recommendations_url;

    // Set completed_at when status changes to completed
    if (status === 'completed' && !updates.completed_at) {
      updates.completed_at = new Date().toISOString();
    }

    // Update consultation
    const { data: consultation, error } = await supabase
      .from('paid_consultations')
      .update(updates)
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating consultation:', error);
      return NextResponse.json(
        { error: 'Failed to update consultation', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      consultation,
    }, { status: 200 });

  } catch (error) {
    console.error('Error in PATCH /api/admin/paid-consultations/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
