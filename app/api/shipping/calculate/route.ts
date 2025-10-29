import { NextRequest, NextResponse } from 'next/server';
import {
  ShippingAddress,
  parseWeight,
  FREE_SHIPPING_THRESHOLD,
} from '@/types/shipping';
import { getShippingRates, isShippoConfigured } from '@/lib/shipping-carrier-service';

/**
 * POST /api/shipping/calculate
 * Calculate shipping costs for a given cart and destination
 *
 * Uses Shippo for real-time rates if configured, otherwise falls back to zone-based rates
 *
 * Request body:
 * {
 *   subtotal: number,
 *   items: Array<{ weight?: string, quantity: number }>,
 *   address: { street, city, state, zipCode, country }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subtotal, items, address } = body;

    // Validate required fields
    if (typeof subtotal !== 'number') {
      return NextResponse.json(
        { error: 'Subtotal is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      );
    }

    if (!address || !address.state) {
      return NextResponse.json(
        { error: 'Shipping address with state is required' },
        { status: 400 }
      );
    }

    // Calculate total weight from items
    let totalWeight = 0;
    for (const item of items) {
      const quantity = item.quantity || 1;
      if (item.weight) {
        const itemWeight = parseWeight(item.weight);
        totalWeight += itemWeight * quantity;
      } else {
        // Default to 1 lb if no weight specified
        totalWeight += 1 * quantity;
      }
    }

    // Ensure minimum weight of 1 lb
    if (totalWeight < 1) {
      totalWeight = 1;
    }

    // Construct shipping address
    const shippingAddress: ShippingAddress = {
      street: address.street || '',
      city: address.city || '',
      state: address.state,
      zipCode: address.zipCode || address.zip || '',
      country: address.country || 'US',
    };

    // Get shipping rates (will use Shippo if configured, otherwise zone-based)
    const { methods, provider, freeShippingQualified } = await getShippingRates(
      subtotal,
      totalWeight,
      shippingAddress
    );

    return NextResponse.json({
      success: true,
      calculation: {
        subtotal,
        weight: totalWeight,
        address: shippingAddress,
        availableMethods: methods,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountUntilFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
        qualifiesForFreeShipping: freeShippingQualified,
        provider, // 'shippo' or 'zone-based'
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in POST /api/shipping/calculate:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET /api/shipping/zones
 * Get all available shipping zones and rates
 */
export async function GET() {
  try {
    const { SHIPPING_ZONES, FREE_SHIPPING_THRESHOLD, LOCAL_DELIVERY_CITIES } = await import('@/types/shipping');

    return NextResponse.json({
      zones: SHIPPING_ZONES,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      localDeliveryCities: LOCAL_DELIVERY_CITIES,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in GET /api/shipping/zones:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
