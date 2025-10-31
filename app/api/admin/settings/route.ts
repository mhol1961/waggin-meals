import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/admin-auth';

/**
 * PATCH /api/admin/settings
 * Update site settings (admin only)
 */
export async function PATCH(request: NextRequest) {
  try {
    // Verify admin authentication
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tax_collection_enabled } = body;

    // Validate input
    if (typeof tax_collection_enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'tax_collection_enabled must be a boolean' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get current settings
    const { data: currentSettings } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (!currentSettings) {
      return NextResponse.json(
        { error: 'Site settings not found' },
        { status: 404 }
      );
    }

    // Update settings
    const { data: updatedSettings, error: updateError } = await supabase
      .from('site_settings')
      .update({
        tax_collection_enabled,
        updated_at: new Date().toISOString(),
        updated_by: session.username,
      })
      .eq('id', currentSettings.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating settings:', updateError);
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 }
      );
    }

    console.log(`[Admin] Tax collection ${tax_collection_enabled ? 'enabled' : 'disabled'} by ${session.username}`);

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
    });
  } catch (error) {
    console.error('Error in PATCH /api/admin/settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/settings
 * Get current site settings (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createClient();

    const { data: settings, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
