/**
 * POST /api/inventory/bulk-update
 * Bulk update inventory from CSV (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { bulkUpdateInventory } from '@/lib/inventory';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminAuth = await verifyAdminAuth(request);
    if (!adminAuth.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'Invalid updates format. Expected array of {sku, quantity, notes?}' },
        { status: 400 }
      );
    }

    // Validate updates format
    for (const update of updates) {
      if (!update.sku || typeof update.quantity !== 'number') {
        return NextResponse.json(
          { error: 'Each update must have sku (string) and quantity (number)' },
          { status: 400 }
        );
      }
    }

    const result = await bulkUpdateInventory(updates, adminAuth.email || 'admin');

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error bulk updating inventory:', error);
    return NextResponse.json(
      { error: 'Failed to bulk update inventory' },
      { status: 500 }
    );
  }
}
