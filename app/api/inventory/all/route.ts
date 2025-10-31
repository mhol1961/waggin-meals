/**
 * GET /api/inventory/all
 * Get all inventory statuses with filters (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllInventoryStatuses } from '@/lib/inventory';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminAuth = await verifyAdminAuth(request);
    if (!adminAuth.authenticated) {
      return adminAuth.response;
    }

    const searchParams = request.nextUrl.searchParams;
    const stockStatus = searchParams.get('stock_status') as 'unlimited' | 'in_stock' | 'low_stock' | 'out_of_stock' | null;
    const type = searchParams.get('type') as 'product' | 'variant' | null;
    const search = searchParams.get('search');

    const statuses = await getAllInventoryStatuses({
      stock_status: stockStatus || undefined,
      type: type || undefined,
      search: search || undefined,
    });

    return NextResponse.json({
      statuses,
      count: statuses.length,
    });
  } catch (error) {
    console.error('Error getting inventory statuses:', error);
    return NextResponse.json(
      { error: 'Failed to get inventory statuses' },
      { status: 500 }
    );
  }
}
