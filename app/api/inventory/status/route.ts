/**
 * GET /api/inventory/status
 * Check inventory availability for products/variants
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkAvailability, checkCartAvailability } from '@/lib/inventory';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const variantId = searchParams.get('variantId');
    const quantity = parseInt(searchParams.get('quantity') || '1');

    // Check if it's a cart availability check
    const cartItems = searchParams.get('cartItems');
    if (cartItems) {
      try {
        const items = JSON.parse(cartItems);
        const results = await checkCartAvailability(items);
        return NextResponse.json({ results });
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid cart items format' },
          { status: 400 }
        );
      }
    }

    // Single product availability check
    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

    const availability = await checkAvailability(productId, variantId, quantity);

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error checking inventory status:', error);
    return NextResponse.json(
      { error: 'Failed to check inventory status' },
      { status: 500 }
    );
  }
}
