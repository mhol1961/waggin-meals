/**
 * GET /api/inventory/history
 * Get inventory transaction history (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getInventoryHistory, getAllTransactions, type TransactionType } from '@/lib/inventory';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminAuth = await verifyAdminAuth(request);
    if (!adminAuth.authenticated) {
      return adminAuth.response;
    }

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const variantId = searchParams.get('variantId');
    const transactionType = searchParams.get('transactionType') as TransactionType | null;
    const orderId = searchParams.get('orderId');
    const limit = parseInt(searchParams.get('limit') || '50');

    let transactions;

    if (productId) {
      // Get history for specific product/variant
      transactions = await getInventoryHistory(productId, variantId, limit);
    } else {
      // Get all transactions with filters
      transactions = await getAllTransactions({
        transaction_type: transactionType || undefined,
        order_id: orderId || undefined,
        limit,
      });
    }

    return NextResponse.json({
      transactions,
      count: transactions.length,
    });
  } catch (error) {
    console.error('Error getting inventory history:', error);
    return NextResponse.json(
      { error: 'Failed to get inventory history' },
      { status: 500 }
    );
  }
}
