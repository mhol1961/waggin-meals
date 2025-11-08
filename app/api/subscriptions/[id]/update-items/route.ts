import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as GHL from '@/lib/ghl-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/subscriptions/[id]/update-items
 * Update the items and amount for a subscription
 * REQUIRES AUTHENTICATION - user must own the subscription
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { items } = body;

    // =============================================
    // STEP 1: Authenticate the user
    // =============================================
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - no auth token provided' },
        { status: 401 }
      );
    }

    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid token' },
        { status: 401 }
      );
    }

    // =============================================
    // STEP 2: Validate input
    // =============================================
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.product_id || !item.quantity || typeof item.quantity !== 'number') {
        return NextResponse.json(
          { error: 'Each item must have product_id and quantity' },
          { status: 400 }
        );
      }
      if (item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Item quantities must be positive' },
          { status: 400 }
        );
      }
    }

    // =============================================
    // STEP 3: Get subscription and verify ownership
    // =============================================
    const { data: currentSub, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*, customers!inner(*)')
      .eq('id', id)
      .single();

    if (fetchError || !currentSub) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // SECURITY CHECK: Verify user owns this subscription
    if (currentSub.customers.email !== user.email) {
      console.warn(`🚨 Unauthorized subscription update attempt: User ${user.email} tried to update subscription ${id} owned by ${currentSub.customers.email}`);
      return NextResponse.json(
        { error: 'Forbidden - you do not own this subscription' },
        { status: 403 }
      );
    }

    // =============================================
    // STEP 4: Calculate price SERVER-SIDE (don't trust client)
    // =============================================
    const productIds = items.map(item => item.product_id);

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, price')
      .in('id', productIds);

    if (productsError || !products) {
      return NextResponse.json(
        { error: 'Failed to fetch product prices' },
        { status: 500 }
      );
    }

    // Create price lookup map
    const priceMap = new Map(products.map(p => [p.id, { price: p.price, title: p.title }]));

    // Calculate total and build validated items array
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const productInfo = priceMap.get(item.product_id);
      if (!productInfo) {
        return NextResponse.json(
          { error: `Product not found: ${item.product_id}` },
          { status: 400 }
        );
      }

      const itemTotal = productInfo.price * item.quantity;
      calculatedTotal += itemTotal;

      validatedItems.push({
        product_id: item.product_id,
        name: productInfo.title,
        quantity: item.quantity,
        price: productInfo.price,
      });
    }

    console.log('💰 Server-side price calculation:', {
      subscriptionId: id,
      itemCount: validatedItems.length,
      calculatedTotal: calculatedTotal.toFixed(2),
    });

    // =============================================
    // STEP 5: Update subscription with VALIDATED items and CALCULATED amount
    // =============================================
    const { data: subscription, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        items: validatedItems,
        amount: calculatedTotal,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return NextResponse.json(
        { error: 'Failed to update subscription', details: updateError.message },
        { status: 500 }
      );
    }

    console.log('✅ Subscription items updated:', {
      subscriptionId: id,
      itemCount: validatedItems.length,
      newAmount: calculatedTotal.toFixed(2),
      customerEmail: user.email,
    });

    // =============================================
    // SYNC TO GHL (Tag Accumulation)
    // =============================================
    if (currentSub.customers) {
      try {
        const customer = currentSub.customers;

        // Add tag to indicate subscription was customized
        const tags = ['subscription-customized'];

        const ghlResult: GHL.GHLSyncResult = await GHL.syncContactToGHL({
          email: customer.email,
          firstName: customer.first_name,
          lastName: customer.last_name,
          phone: customer.phone,
          tags,
          customFields: {
            subscription_id: subscription.id,
            subscription_amount: calculatedTotal.toString(),
            subscription_item_count: validatedItems.length.toString(),
          },
        });

        // Log GHL sync result
        if (ghlResult.success && ghlResult.contactId) {
          await supabase
            .from('subscriptions')
            .update({
              ghl_contact_id: ghlResult.contactId,
              ghl_tags: [...(currentSub.ghl_tags || []), ...tags], // Accumulate tags
              ghl_last_sync_at: new Date().toISOString(),
              ghl_sync_error: null,
            })
            .eq('id', id);

          console.log('✅ Synced subscription customization to GHL');
        } else {
          console.error('❌ Error syncing to GHL:', ghlResult.error);
          // Don't fail the request if GHL sync fails
        }
      } catch (ghlError) {
        console.error('❌ Error syncing to GHL:', ghlError);
        // Don't fail the request if GHL sync fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription updated successfully',
      subscription: {
        id: subscription.id,
        items: subscription.items,
        amount: subscription.amount,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating subscription items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
