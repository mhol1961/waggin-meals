/**
 * Tax Rate Single Item API Endpoint
 * GET /api/tax/rates/[id] - Get a specific tax rate
 * PUT /api/tax/rates/[id] - Update a specific tax rate (admin only)
 * DELETE /api/tax/rates/[id] - Delete a specific tax rate (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getTaxRateById,
  updateTaxRate,
  deleteTaxRate,
} from '@/lib/tax-calculator';
import { verifyAdminAuth } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/tax/rates/[id]
 * Get a specific tax rate by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taxRate = await getTaxRateById(id);

    if (!taxRate) {
      return NextResponse.json(
        { error: 'Tax rate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      tax_rate: taxRate,
    });
  } catch (error) {
    console.error('Error fetching tax rate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tax rate' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/tax/rates/[id]
 * Update a specific tax rate (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Validate tax rate if provided
    if (body.tax_rate !== undefined && (body.tax_rate < 0 || body.tax_rate > 1)) {
      return NextResponse.json(
        { error: 'tax_rate must be between 0 and 1 (e.g., 0.0725 for 7.25%)' },
        { status: 400 }
      );
    }

    const { id } = await params;
    const result = await updateTaxRate(id, body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to update tax rate' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tax_rate: result.data,
    });
  } catch (error) {
    console.error('Error updating tax rate:', error);
    return NextResponse.json(
      { error: 'Failed to update tax rate' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tax/rates/[id]
 * Delete a specific tax rate (admin only)
 * Default: Soft delete (set is_active to false)
 * Query param ?hard=true for hard delete
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hard') === 'true';

    const { id } = await params;
    const result = await deleteTaxRate(id, hardDelete);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to delete tax rate' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: hardDelete
        ? 'Tax rate permanently deleted'
        : 'Tax rate deactivated',
    });
  } catch (error) {
    console.error('Error deleting tax rate:', error);
    return NextResponse.json(
      { error: 'Failed to delete tax rate' },
      { status: 500 }
    );
  }
}
