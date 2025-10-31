/**
 * Site Settings API Endpoint
 * GET /api/settings/site - Get current site settings
 * PUT /api/settings/site - Update site settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET - Retrieve current site settings
 */
export async function GET() {
  try {
    const { data: settings, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned (expected for first time)
      console.error('Error fetching site settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch site settings' },
        { status: 500 }
      );
    }

    // If no settings exist, return defaults
    if (!settings) {
      return NextResponse.json({
        success: true,
        settings: {
          tax_collection_enabled: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Site settings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update site settings
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    if (typeof body.tax_collection_enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'tax_collection_enabled must be a boolean' },
        { status: 400 }
      );
    }

    // Check if settings record exists
    const { data: existingSettings } = await supabase
      .from('site_settings')
      .select('id')
      .single();

    let result;

    if (existingSettings) {
      // Update existing record
      result = await supabase
        .from('site_settings')
        .update({
          tax_collection_enabled: body.tax_collection_enabled,
          updated_at: new Date().toISOString(),
          updated_by: 'admin', // TODO: Replace with actual user ID from auth
        })
        .eq('id', existingSettings.id)
        .select()
        .single();
    } else {
      // Insert new record (should only happen once)
      result = await supabase
        .from('site_settings')
        .insert({
          tax_collection_enabled: body.tax_collection_enabled,
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error updating site settings:', result.error);
      return NextResponse.json(
        { error: 'Failed to update site settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: result.data,
      message: `Tax collection ${body.tax_collection_enabled ? 'enabled' : 'disabled'} successfully`,
    });
  } catch (error) {
    console.error('Site settings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
