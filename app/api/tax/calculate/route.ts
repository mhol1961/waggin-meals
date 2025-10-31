/**
 * Tax Calculation API Endpoint
 * POST /api/tax/calculate
 *
 * Calculates sales tax for a given order based on items and shipping address
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateTax, getTaxBreakdown } from '@/lib/tax-calculator';
import type { ShippingAddress, CartItem } from '@/lib/tax-calculator';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

interface CalculateTaxRequest {
  amount?: number; // Simple calculation: just amount
  items?: CartItem[]; // Itemized calculation
  shippingAddress: ShippingAddress;
  includeBreakdown?: boolean; // Return detailed breakdown
}

export async function POST(request: NextRequest) {
  try {
    const body: CalculateTaxRequest = await request.json();

    // Validate required fields
    if (!body.shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    if (!body.shippingAddress.state) {
      return NextResponse.json(
        { error: 'State is required in shipping address' },
        { status: 400 }
      );
    }

    // Check if tax collection is enabled globally
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: settings } = await supabase
      .from('site_settings')
      .select('tax_collection_enabled')
      .single();

    if (!settings?.tax_collection_enabled) {
      return NextResponse.json({
        success: true,
        tax_amount: 0,
        tax_rate: 0,
        tax_rate_percentage: '0.00%',
        message: 'Tax collection is currently disabled',
      });
    }

    // Calculate tax based on request type
    if (body.items && body.items.length > 0) {
      // Itemized calculation
      const breakdown = await getTaxBreakdown(body.items, body.shippingAddress);

      if (!breakdown) {
        return NextResponse.json(
          { error: 'Failed to calculate tax breakdown' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        tax_amount: breakdown.tax_amount,
        tax_rate: breakdown.tax_rate,
        tax_rate_percentage: breakdown.tax_rate_percentage,
        breakdown: body.includeBreakdown ? breakdown : undefined,
      });
    } else if (body.amount !== undefined) {
      // Simple amount-based calculation
      const result = await calculateTax(body.amount, body.shippingAddress);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Tax calculation failed' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        tax_amount: result.tax_amount,
        tax_rate: result.tax_rate,
        tax_rate_percentage: result.tax_rate_percentage,
      });
    } else {
      return NextResponse.json(
        { error: 'Either amount or items must be provided' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Tax calculation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
