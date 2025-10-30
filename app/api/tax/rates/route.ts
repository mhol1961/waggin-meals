/**
 * Tax Rates CRUD API Endpoint
 * GET /api/tax/rates - List all tax rates
 * POST /api/tax/rates - Create a new tax rate (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllTaxRates, createTaxRate } from '@/lib/tax-calculator';
import { verifyAdminAuth } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/tax/rates
 * List all tax rates with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stateCode = searchParams.get('state_code') || undefined;
    const isActive = searchParams.get('is_active');

    const filters: { state_code?: string; is_active?: boolean } = {};

    if (stateCode) {
      filters.state_code = stateCode;
    }

    if (isActive !== null) {
      filters.is_active = isActive === 'true';
    }

    const taxRates = await getAllTaxRates(filters);

    return NextResponse.json({
      success: true,
      tax_rates: taxRates,
      count: taxRates.length,
    });
  } catch (error) {
    console.error('Error fetching tax rates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tax rates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tax/rates
 * Create a new tax rate (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.state_code || !body.state_name || body.tax_rate === undefined) {
      return NextResponse.json(
        { error: 'state_code, state_name, and tax_rate are required' },
        { status: 400 }
      );
    }

    // Validate tax rate range
    if (body.tax_rate < 0 || body.tax_rate > 1) {
      return NextResponse.json(
        { error: 'tax_rate must be between 0 and 1 (e.g., 0.0725 for 7.25%)' },
        { status: 400 }
      );
    }

    const result = await createTaxRate({
      state_code: body.state_code,
      state_name: body.state_name,
      county: body.county,
      zip_code: body.zip_code,
      tax_rate: body.tax_rate,
      notes: body.notes,
      is_active: body.is_active !== undefined ? body.is_active : true,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create tax rate' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tax_rate: result.data,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating tax rate:', error);
    return NextResponse.json(
      { error: 'Failed to create tax rate' },
      { status: 500 }
    );
  }
}
