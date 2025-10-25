import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Authorize.net API configuration
const AUTHORIZENET_API_LOGIN_ID = process.env.AUTHORIZENET_API_LOGIN_ID;
const AUTHORIZENET_TRANSACTION_KEY = process.env.AUTHORIZENET_TRANSACTION_KEY;
const AUTHORIZENET_ENVIRONMENT = process.env.AUTHORIZENET_ENVIRONMENT || 'sandbox';

const AUTHORIZENET_URL = AUTHORIZENET_ENVIRONMENT === 'production'
  ? 'https://api.authorize.net/xml/v1/request.api'
  : 'https://apitest.authorize.net/xml/v1/request.api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      subscription_id,
      card_number,
      exp_month,
      exp_year,
      cvv,
      billing_zip,
    } = body;

    if (!subscription_id || !card_number || !exp_month || !exp_year || !cvv) {
      return NextResponse.json(
        { error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    // Get subscription and customer
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*, customer:customers(*)')
      .eq('id', subscription_id)
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    const customer = subscription.customer;

    // Create or update customer profile in Authorize.net CIM
    const authNetRequest = {
      createCustomerProfileRequest: {
        merchantAuthentication: {
          name: AUTHORIZENET_API_LOGIN_ID,
          transactionKey: AUTHORIZENET_TRANSACTION_KEY,
        },
        profile: {
          merchantCustomerId: subscription_id,
          email: customer.email,
          paymentProfiles: {
            billTo: {
              firstName: customer.first_name,
              lastName: customer.last_name,
              zip: billing_zip,
            },
            payment: {
              creditCard: {
                cardNumber: card_number,
                expirationDate: `${exp_year}-${exp_month.padStart(2, '0')}`,
                cardCode: cvv,
              },
            },
          },
        },
        validationMode: AUTHORIZENET_ENVIRONMENT === 'production' ? 'liveMode' : 'testMode',
      },
    };

    // Call Authorize.net API
    const authNetResponse = await fetch(AUTHORIZENET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authNetRequest),
    });

    const authNetData = await authNetResponse.json();

    // Check for errors
    if (authNetData.messages?.resultCode !== 'Ok') {
      const errorMessage = authNetData.messages?.message?.[0]?.text || 'Payment processing failed';
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const customerProfileId = authNetData.customerProfileId;
    const paymentProfileId = authNetData.customerPaymentProfileIdList?.[0];

    if (!customerProfileId || !paymentProfileId) {
      return NextResponse.json(
        { error: 'Failed to create payment profile' },
        { status: 500 }
      );
    }

    // Get last 4 digits and card type
    const lastFour = card_number.slice(-4);
    const cardType = getCardType(card_number);

    // Update subscription in database
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        payment_profile_id: paymentProfileId,
        payment_customer_profile_id: customerProfileId,
        payment_last_four: lastFour,
        payment_card_type: cardType,
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscription_id);

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      );
    }

    // Send webhook to GHL
    if (process.env.GHL_WEBHOOK_PAYMENT_UPDATED) {
      try {
        await fetch(process.env.GHL_WEBHOOK_PAYMENT_UPDATED, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'subscription.payment_updated',
            email: customer.email,
            first_name: customer.first_name,
            last_name: customer.last_name,
            payment_profile_id: paymentProfileId,
            payment_last_four: lastFour,
            payment_card_type: cardType,
            subscription_status: 'active',
            updated_at: new Date().toISOString(),
          }),
        });
      } catch (webhookError) {
        console.error('Failed to send GHL webhook:', webhookError);
        // Don't fail the request if webhook fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment method updated successfully',
      last_four: lastFour,
      card_type: cardType,
    });
  } catch (error) {
    console.error('Payment update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to determine card type
function getCardType(cardNumber: string): string {
  const number = cardNumber.replace(/\s/g, '');

  if (/^4/.test(number)) return 'Visa';
  if (/^5[1-5]/.test(number)) return 'Mastercard';
  if (/^3[47]/.test(number)) return 'American Express';
  if (/^6(?:011|5)/.test(number)) return 'Discover';

  return 'Unknown';
}
