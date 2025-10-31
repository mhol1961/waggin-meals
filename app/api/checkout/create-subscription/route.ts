import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  chargeStoredPaymentMethod,
  createCustomerProfileWithPayment,
  isConfigured as isAuthorizeNetConfigured
} from '@/lib/authorizenet-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

interface OpaqueData {
  dataDescriptor: string;
  dataValue: string;
}

/**
 * POST /api/checkout/create-subscription
 * Create a recurring subscription with Accept.js tokenization (PCI-compliant)
 *
 * Expected request body:
 * {
 *   customer_id?: string,
 *   email: string,
 *   shipping_address: ShippingAddress,
 *   payment_token: OpaqueData (Accept.js opaque data),
 *   billing_address: ShippingAddress,
 *   product_id: string,
 *   variant_id?: string,
 *   quantity: number,
 *   price: number,
 *   frequency: 'weekly' | 'bi-weekly' | 'monthly',
 *   title: string,
 *   variant_title?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_id,
      email,
      shipping_address,
      payment_token, // Accept.js opaque data
      payment_method_id, // ID of existing payment method (optional)
      billing_address,
      product_id,
      variant_id,
      quantity,
      price,
      frequency,
      title,
      variant_title,
    } = body;

    // Validate required fields
    if (!email || !shipping_address || !product_id || !quantity || !price || !frequency) {
      return NextResponse.json(
        { error: 'Missing required fields: email, shipping_address, product_id, quantity, price, frequency' },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!payment_method_id && !payment_token) {
      return NextResponse.json(
        { error: 'Payment method required. Provide either payment_method_id or payment_token.' },
        { status: 400 }
      );
    }

    // If using new payment token, validate format
    if (payment_token && (!payment_token.dataDescriptor || !payment_token.dataValue)) {
      return NextResponse.json(
        { error: 'Invalid payment token format. Must include dataDescriptor and dataValue from Accept.js.' },
        { status: 400 }
      );
    }

    // Use billing address or fall back to shipping address
    const finalBillingAddress = billing_address || shipping_address;

    // Check if Authorize.net is configured
    if (!isAuthorizeNetConfigured()) {
      return NextResponse.json(
        { error: 'Payment processor not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Get or create customer
    let customerId = customer_id;
    let customer;

    if (customer_id) {
      // Get existing customer
      const { data: existingCustomer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customer_id)
        .single();

      if (customerError) {
        console.error('[Subscription] Error fetching customer:', customerError);
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }

      customer = existingCustomer;
    } else {
      // Check if customer exists by email
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .single();

      if (existingCustomer) {
        customer = existingCustomer;
        customerId = existingCustomer.id;
      } else {
        // Create new customer
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert([
            {
              email: email,
              first_name: shipping_address.first_name,
              last_name: shipping_address.last_name,
            },
          ])
          .select()
          .single();

        if (createError) {
          console.error('[Subscription] Error creating customer:', createError);
          return NextResponse.json(
            { error: 'Failed to create customer' },
            { status: 500 }
          );
        }

        customer = newCustomer;
        customerId = newCustomer.id;
      }
    }

    console.log(`[Subscription] Creating subscription for customer ${customerId}`);

    // Determine payment method ID
    let paymentMethodId: string;

    if (payment_method_id) {
      // Using existing payment method
      console.log(`[Subscription] Using existing payment method: ${payment_method_id}`);
      paymentMethodId = payment_method_id;
    } else {
      // Create Authorize.net CIM profile with payment using Accept.js token (PCI-compliant)
      console.log(`[Subscription] Creating new payment method with Accept.js token`);

      const authResponse = await createCustomerProfileWithPayment({
        customerId: customerId,
        email: email,
        opaqueData: {
          dataDescriptor: payment_token!.dataDescriptor,
          dataValue: payment_token!.dataValue,
        },
        billingAddress: {
          firstName: finalBillingAddress.first_name,
          lastName: finalBillingAddress.last_name,
          address: finalBillingAddress.address,
          city: finalBillingAddress.city,
          state: finalBillingAddress.state,
          zip: finalBillingAddress.zip,
          country: finalBillingAddress.country || 'US',
        },
      });

      if (!authResponse.success || !authResponse.profileId || !authResponse.paymentProfileId) {
        console.error('[Subscription] Failed to create Authorize.net profile:', authResponse.error);
        return NextResponse.json(
          { error: authResponse.error || 'Failed to create payment profile' },
          { status: 402 }
        );
      }

      console.log(`[Subscription] Authorize.net profile created: ${authResponse.profileId}, Payment: ${authResponse.paymentProfileId}`);

      // Save payment method to database
      const { data: paymentMethod, error: pmError } = await supabase
        .from('payment_methods')
        .insert([
          {
            customer_id: customerId,
            authorize_net_profile_id: authResponse.profileId,
            authorize_net_payment_profile_id: authResponse.paymentProfileId,
            card_type: 'Card', // We don't have card type from Accept.js
            last_four: '****', // We don't have last 4 from Accept.js
            billing_address: finalBillingAddress,
            is_default: true,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (pmError) {
        console.error('[Subscription] Error saving payment method:', pmError);
        return NextResponse.json(
          { error: 'Failed to save payment method' },
          { status: 500 }
        );
      }

      paymentMethodId = paymentMethod.id;
      console.log(`[Subscription] Payment method saved: ${paymentMethodId}`);
    }

    // Calculate billing dates
    const today = new Date();
    const nextBillingDate = calculateNextBillingDate(today, frequency);

    // Create subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert([
        {
          customer_id: customerId,
          product_id: product_id,
          variant_id: variant_id,
          payment_method_id: paymentMethodId,
          status: 'active',
          frequency: frequency,
          quantity: quantity,
          price: price,
          next_billing_date: nextBillingDate.toISOString().split('T')[0],

          // Customer info
          customer_email: email,
          customer_first_name: shipping_address.first_name,
          customer_last_name: shipping_address.last_name,

          // Shipping address
          shipping_first_name: shipping_address.first_name,
          shipping_last_name: shipping_address.last_name,
          shipping_address: shipping_address.address,
          shipping_address2: shipping_address.address2,
          shipping_city: shipping_address.city,
          shipping_state: shipping_address.state,
          shipping_zip: shipping_address.zip,
          shipping_country: shipping_address.country,
          shipping_phone: shipping_address.phone,

          // Product info
          product_title: title,
          variant_title: variant_title,
        },
      ])
      .select()
      .single();

    if (subError) {
      console.error('[Subscription] Error creating subscription:', subError);
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      );
    }

    console.log(`[Subscription] Subscription created: ${subscription.id}`);

    // Create subscription history entry
    await supabase.from('subscription_history').insert([
      {
        subscription_id: subscription.id,
        action: 'created',
        actor_type: 'customer',
        notes: `Subscription created with ${frequency} billing`,
      },
    ]);

    // Process initial payment
    try {
      const invoiceNumber = `SUB-${subscription.id.substring(0, 8)}`;
      console.log(`[Subscription] Charging initial payment for invoice ${invoiceNumber}`);

      // Get payment method details for charging
      const { data: paymentMethodData, error: pmFetchError } = await supabase
        .from('payment_methods')
        .select('authorize_net_profile_id, authorize_net_payment_profile_id')
        .eq('id', paymentMethodId)
        .single();

      if (pmFetchError || !paymentMethodData) {
        throw new Error('Payment method not found');
      }

      if (!paymentMethodData.authorize_net_profile_id || !paymentMethodData.authorize_net_payment_profile_id) {
        throw new Error('Payment method missing Authorize.net profile IDs');
      }

      const chargeResponse = await chargeStoredPaymentMethod({
        amount: price * quantity,
        customerProfileId: paymentMethodData.authorize_net_profile_id,
        customerPaymentProfileId: paymentMethodData.authorize_net_payment_profile_id,
        invoiceNumber: invoiceNumber,
        description: `Subscription - ${title}${variant_title ? ' - ' + variant_title : ''}`,
        customerId: customerId,
        customerEmail: email,
      });

      if (!chargeResponse.success || !chargeResponse.transactionId) {
        throw new Error(chargeResponse.error || 'Payment failed');
      }

      console.log(`[Subscription] Initial payment successful: ${chargeResponse.transactionId}`);

      // Create initial invoice
      await supabase.from('subscription_invoices').insert([
        {
          subscription_id: subscription.id,
          amount: price * quantity,
          status: 'paid',
          billing_date: today.toISOString().split('T')[0],
          transaction_id: chargeResponse.transactionId,
        },
      ]);

      // Send subscription confirmation email
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'subscription_created',
            to: email,
            data: {
              subscription_id: subscription.id,
              customer_name: `${shipping_address.first_name} ${shipping_address.last_name}`,
              product_title: title,
              variant_title: variant_title,
              quantity: quantity,
              price: price,
              frequency: frequency,
              next_billing_date: nextBillingDate.toLocaleDateString(),
            },
          }),
        });
      } catch (emailError) {
        console.error('[Subscription] Error sending subscription email:', emailError);
        // Don't fail the subscription for email errors
      }

      // Add to GoHighLevel with subscription tag
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/ghl/add-contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            firstName: shipping_address.first_name,
            lastName: shipping_address.last_name,
            phone: shipping_address.phone,
            tags: ['customer', 'subscriber', `subscription-${frequency}`],
            customFields: {
              subscription_id: subscription.id,
              subscription_product: title,
              subscription_frequency: frequency,
            },
          }),
        });
      } catch (ghlError) {
        console.error('[Subscription] Error adding to GHL:', ghlError);
        // Don't fail the subscription for GHL errors
      }

      return NextResponse.json({
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          frequency: frequency,
          next_billing_date: nextBillingDate.toISOString().split('T')[0],
          amount: price * quantity,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process initial payment';
      console.error('[Subscription] Error processing initial payment:', error);

      // Update subscription to payment_failed status
      await supabase
        .from('subscriptions')
        .update({ status: 'payment_failed' })
        .eq('id', subscription.id);

      return NextResponse.json(
        { error: errorMessage },
        { status: 402 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('[Subscription] Error in POST /api/checkout/create-subscription:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Calculate next billing date based on frequency
 */
function calculateNextBillingDate(startDate: Date, frequency: string): Date {
  const next = new Date(startDate);

  switch (frequency) {
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'bi-weekly':
      next.setDate(next.getDate() + 14);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    default:
      next.setMonth(next.getMonth() + 1); // Default to monthly
  }

  return next;
}
