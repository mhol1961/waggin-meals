import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  chargeStoredPaymentMethod,
  createCustomerProfile,
  createPaymentProfile,
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

interface NewCard {
  card_number: string;
  expiration_month: string;
  expiration_year: string;
  cvv: string;
  card_type?: string;
  billing_address: ShippingAddress;
}

/**
 * POST /api/checkout/create-subscription
 * Create a recurring subscription with payment method tokenization
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_id,
      email,
      shipping_address,
      payment_method_id,
      new_card,
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
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!payment_method_id && !new_card) {
      return NextResponse.json(
        { error: 'Payment method required for subscriptions' },
        { status: 400 }
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
        console.error('Error fetching customer:', customerError);
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
          console.error('Error creating customer:', createError);
          return NextResponse.json(
            { error: 'Failed to create customer' },
            { status: 500 }
          );
        }

        customer = newCustomer;
        customerId = newCustomer.id;
      }
    }

    // Handle payment method
    let finalPaymentMethodId = payment_method_id;

    if (new_card && !payment_method_id) {
      // Check if Authorize.net is configured
      if (!isAuthorizeNetConfigured()) {
        return NextResponse.json(
          { error: 'Payment processing not configured. Subscriptions require Authorize.net.' },
          { status: 503 }
        );
      }

      // Step 1: Get or create Authorize.net customer profile
      let authorizeNetProfileId = customer.authorize_net_profile_id;

      if (!authorizeNetProfileId) {
        const profileResponse = await createCustomerProfile({
          customerId: customerId,
          email: email,
          description: `${shipping_address.first_name} ${shipping_address.last_name}`,
        });

        if (!profileResponse.success || !profileResponse.profileId) {
          return NextResponse.json(
            { error: profileResponse.error || 'Failed to create customer profile' },
            { status: 500 }
          );
        }

        authorizeNetProfileId = profileResponse.profileId;

        // Save profile ID to customer record
        await supabase
          .from('customers')
          .update({ authorize_net_profile_id: authorizeNetProfileId })
          .eq('id', customerId);
      }

      // Step 2: Create payment profile (save card to Authorize.net CIM)
      const expirationDate = `${new_card.expiration_year}-${new_card.expiration_month.padStart(2, '0')}`;

      const paymentProfileResponse = await createPaymentProfile({
        customerProfileId: authorizeNetProfileId,
        cardNumber: new_card.card_number,
        expirationDate: expirationDate,
        cvv: new_card.cvv,
        billingAddress: {
          firstName: new_card.billing_address.first_name,
          lastName: new_card.billing_address.last_name,
          address: new_card.billing_address.address,
          city: new_card.billing_address.city,
          state: new_card.billing_address.state,
          zip: new_card.billing_address.zip,
          country: new_card.billing_address.country || 'US',
        },
      });

      if (!paymentProfileResponse.success || !paymentProfileResponse.paymentProfileId) {
        return NextResponse.json(
          { error: paymentProfileResponse.error || 'Failed to save payment method' },
          { status: 500 }
        );
      }

      const authorizeNetPaymentProfileId = paymentProfileResponse.paymentProfileId;

      // Step 3: Save payment method to database
      const last4 = new_card.card_number.slice(-4);
      const { data: paymentMethod, error: pmError } = await supabase
        .from('payment_methods')
        .insert([
          {
            customer_id: customerId,
            type: new_card.card_type || 'card',
            last4: last4,
            brand: new_card.card_type || detectCardType(new_card.card_number),
            exp_month: parseInt(new_card.expiration_month),
            exp_year: parseInt(new_card.expiration_year),
            is_default: true, // Make first card default
            authorize_net_profile_id: authorizeNetProfileId,
            authorize_net_payment_profile_id: authorizeNetPaymentProfileId,
          },
        ])
        .select()
        .single();

      if (pmError) {
        console.error('Error creating payment method:', pmError);
        return NextResponse.json(
          { error: 'Failed to save payment method' },
          { status: 500 }
        );
      }

      finalPaymentMethodId = paymentMethod.id;
    }

    if (!finalPaymentMethodId) {
      return NextResponse.json(
        { error: 'Payment method required' },
        { status: 400 }
      );
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
          payment_method_id: finalPaymentMethodId,
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
      console.error('Error creating subscription:', subError);
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      );
    }

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
      let transactionId: string | null = null;

      // Fetch the payment method to get Authorize.net IDs
      const { data: paymentMethod, error: pmError } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('id', finalPaymentMethodId)
        .single();

      if (pmError || !paymentMethod) {
        throw new Error('Payment method not found');
      }

      if (!paymentMethod.authorize_net_profile_id || !paymentMethod.authorize_net_payment_profile_id) {
        throw new Error('Payment method not configured for Authorize.net');
      }

      // Charge the payment method via Authorize.net
      const invoiceNumber = `SUB-${subscription.id.substring(0, 8)}`;
      const authResponse = await chargeStoredPaymentMethod({
        amount: price * quantity,
        customerProfileId: paymentMethod.authorize_net_profile_id,
        customerPaymentProfileId: paymentMethod.authorize_net_payment_profile_id,
        invoiceNumber: invoiceNumber,
        description: `Subscription - ${title}${variant_title ? ' - ' + variant_title : ''}`,
        customerId: customerId,
        customerEmail: email,
      });

      if (!authResponse.success || !authResponse.transactionId) {
        throw new Error(authResponse.error || 'Payment failed');
      }

      transactionId = authResponse.transactionId;

      // Create initial invoice
      await supabase.from('subscription_invoices').insert([
        {
          subscription_id: subscription.id,
          amount: price * quantity,
          status: 'paid',
          billing_date: today.toISOString().split('T')[0],
          transaction_id: transactionId,
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
        console.error('Error sending subscription email:', emailError);
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
        console.error('Error adding to GHL:', ghlError);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process initial payment';
      console.error('Error processing initial payment:', error);

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
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in POST /api/checkout/create-subscription:', error);
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

/**
 * Detect card type from card number
 */
function detectCardType(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');

  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
  if (/^3[47]/.test(cleaned)) return 'American Express';
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover';

  return 'Unknown';
}
