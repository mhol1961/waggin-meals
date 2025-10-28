import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as GHL from '@/lib/ghl-service';
import type { CreateSubscriptionRequest, Subscription } from '@/types/subscription';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/subscriptions
 * Get subscriptions for a customer
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id');
    const status = searchParams.get('status');

    if (!customerId) {
      return NextResponse.json(
        { error: 'customer_id is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('subscriptions')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ subscriptions: data });
  } catch (error) {
    console.error('Error in GET /api/subscriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/subscriptions
 * Create a new subscription
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateSubscriptionRequest = await request.json();

    const {
      customer_id,
      type,
      frequency,
      items,
      payment_method_id,
      discount_percentage = 0,
      start_date,
    } = body;

    // Validate required fields
    if (!customer_id || !type || !frequency || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate amount from items
    const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discounted_amount = amount * (1 - discount_percentage / 100);

    // Calculate next billing date based on frequency
    const nextBillingDate = start_date
      ? new Date(start_date)
      : calculateNextBillingDate(new Date(), frequency);

    // Create subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert([
        {
          customer_id,
          type,
          frequency,
          interval_count: 1,
          next_billing_date: nextBillingDate.toISOString().split('T')[0],
          amount: discounted_amount,
          discount_percentage,
          items,
          payment_method_id,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      );
    }

    // Log history
    await supabase.from('subscription_history').insert([
      {
        subscription_id: subscription.id,
        action: 'created',
        new_status: 'active',
        actor_type: 'customer',
        actor_id: customer_id,
      },
    ]);

    // Send notification to GoHighLevel
    const { data: customer } = await supabase
      .from('customers')
      .select('email, first_name, last_name, phone')
      .eq('id', customer_id)
      .single();

    if (customer) {
      await GHL.notifySubscriptionCreated({
        customer_email: customer.email,
        customer_first_name: customer.first_name,
        customer_last_name: customer.last_name,
        customer_phone: customer.phone,
        subscription_id: subscription.id,
        frequency: subscription.frequency,
        next_billing_date: nextBillingDate.toISOString().split('T')[0],
        amount: subscription.amount,
        items: subscription.items,
      });
    }

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/subscriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Calculate next billing date based on frequency
 */
function calculateNextBillingDate(from: Date, frequency: string): Date {
  const next = new Date(from);

  switch (frequency) {
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'biweekly':
      next.setDate(next.getDate() + 14);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case '4-weeks':
      next.setDate(next.getDate() + 28);
      break;
    case '6-weeks':
      next.setDate(next.getDate() + 42);
      break;
    case '8-weeks':
      next.setDate(next.getDate() + 56);
      break;
    default:
      next.setMonth(next.getMonth() + 1);
  }

  return next;
}
