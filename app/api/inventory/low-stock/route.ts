/**
 * GET /api/inventory/low-stock
 * Get all low stock products and variants (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLowStockProducts } from '@/lib/inventory';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminAuth = await verifyAdminAuth(request);
    if (!adminAuth.authenticated) {
      return adminAuth.response;
    }

    const lowStockItems = await getLowStockProducts();

    return NextResponse.json({
      items: lowStockItems,
      count: lowStockItems.length,
    });
  } catch (error) {
    console.error('Error getting low stock items:', error);
    return NextResponse.json(
      { error: 'Failed to get low stock items' },
      { status: 500 }
    );
  }
}
