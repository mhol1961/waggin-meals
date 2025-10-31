/**
 * POST /api/inventory/adjust
 * Manually adjust inventory (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { adjustInventory, type TransactionType } from '@/lib/inventory';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminAuth = await verifyAdminAuth(request);
    if (!adminAuth.authenticated) {
      return adminAuth.response;
    }

    const body = await request.json();
    const {
      productId,
      variantId,
      quantityChange,
      transactionType,
      reason,
      notes,
    } = body;

    // Validate required fields
    if (!productId || quantityChange === undefined || !transactionType) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, quantityChange, transactionType' },
        { status: 400 }
      );
    }

    // Validate transaction type
    const validTypes: TransactionType[] = ['sale', 'restock', 'return', 'adjustment', 'damage', 'subscription'];
    if (!validTypes.includes(transactionType)) {
      return NextResponse.json(
        { error: `Invalid transaction type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Adjust inventory
    const result = await adjustInventory(
      productId,
      variantId || null,
      quantityChange,
      transactionType,
      reason || null,
      notes || null,
      null,
      null,
      adminAuth.session.username || 'admin'
    );

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to adjust inventory';
    console.error('Error adjusting inventory:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
