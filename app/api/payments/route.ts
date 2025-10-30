import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processPayment } from '@/lib/authorize-net';
import type { TransactionRequest, PaymentToken } from '@/types/payment';

/**
 * POST /api/payments
 * Process a payment transaction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      amount,
      paymentToken,
      customerId,
      customerEmail,
      billingAddress,
      shippingAddress,
      taxAmount,
      shippingAmount,
    } = body;

    // Validate required fields
    if (!orderId || !amount || !paymentToken) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, amount, paymentToken' },
        { status: 400 }
      );
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Validate payment token structure
    if (!paymentToken.opaqueData?.dataDescriptor || !paymentToken.opaqueData?.dataValue) {
      return NextResponse.json(
        { error: 'Invalid payment token format' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify order exists and is not already paid
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, status, total')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order already has a successful payment
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id, status')
      .eq('order_id', orderId)
      .in('status', ['captured', 'settled'])
      .single();

    if (existingPayment) {
      return NextResponse.json(
        { error: 'Order has already been paid' },
        { status: 400 }
      );
    }

    // Build transaction request
    const transactionRequest: TransactionRequest = {
      amount,
      paymentToken: paymentToken as PaymentToken,
      orderId: order.order_number,
      invoiceNumber: order.order_number,
      description: `Waggin Meals Order #${order.order_number}`,
      customerId,
      customerEmail,
      billingAddress,
      shippingAddress,
      taxAmount,
      shippingAmount,
    };

    // Process payment through Authorize.net
    const paymentResponse = await processPayment(transactionRequest);

    if (!paymentResponse.success) {
      // Payment failed - log the failure but don't create payment record yet
      console.error('Payment failed:', paymentResponse.responseText);

      // Log the failed transaction
      if (paymentResponse.transactionId) {
        await supabase.from('transactions').insert({
          payment_id: null, // No payment record yet
          transaction_type: 'decline',
          amount,
          status: 'declined',
          transaction_id: paymentResponse.transactionId,
          response_code: paymentResponse.responseCode,
          response_text: paymentResponse.responseText,
          error_message: paymentResponse.errors?.[0]?.errorText,
          request_data: { orderId, amount },
          response_data: paymentResponse,
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: paymentResponse.responseText || 'Payment declined',
          errors: paymentResponse.errors,
        },
        { status: 402 } // Payment Required
      );
    }

    // Payment successful - create payment record
    const lastFour = paymentResponse.accountNumber?.slice(-4) || '';

    const { data: payment, error: paymentInsertError } = await supabase
      .from('payments')
      .insert({
        order_id: orderId,
        customer_id: customerId || null,
        amount,
        currency: 'USD',
        status: 'captured',
        transaction_id: paymentResponse.transactionId,
        auth_code: paymentResponse.authCode,
        payment_method: 'credit_card',
        last_four: lastFour,
        response_code: paymentResponse.responseCode,
        response_text: paymentResponse.responseText,
        avs_result: paymentResponse.avsResultCode,
        cvv_result: paymentResponse.cvvResultCode,
      })
      .select()
      .single();

    if (paymentInsertError) {
      console.error('Failed to create payment record:', paymentInsertError);
      // Payment was successful but failed to record - this is critical
      return NextResponse.json(
        {
          success: true,
          warning: 'Payment successful but failed to save record',
          payment: {
            transactionId: paymentResponse.transactionId,
            amount,
            status: 'captured',
          },
        },
        { status: 201 }
      );
    }

    // Create transaction log
    await supabase.from('transactions').insert({
      payment_id: payment.id,
      transaction_type: 'capture',
      amount,
      status: 'captured',
      transaction_id: paymentResponse.transactionId,
      auth_code: paymentResponse.authCode,
      response_code: paymentResponse.responseCode,
      response_text: paymentResponse.responseText,
      request_data: { orderId, amount },
      response_data: paymentResponse,
    });

    // Update order status to paid
    await supabase
      .from('orders')
      .update({
        status: 'processing',
        payment_status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    return NextResponse.json(
      {
        success: true,
        payment: {
          id: payment.id,
          transactionId: paymentResponse.transactionId,
          amount: payment.amount,
          status: payment.status,
          lastFour: payment.last_four,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payments?orderId=xxx
 * Get payment information for an order
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      payments: payments || [],
      count: payments?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
