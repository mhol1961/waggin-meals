import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processRefund } from '@/lib/authorize-net';
import type { RefundRequest } from '@/types/payment';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/payments/[id]/refund
 * Process a refund for a payment
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: paymentId } = await params;
    const body = await request.json();
    const { amount, reason } = body;

    const supabase = await createClient();

    // Get payment details
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Verify payment is refundable
    if (!['captured', 'settled'].includes(payment.status)) {
      return NextResponse.json(
        { error: `Cannot refund payment with status: ${payment.status}` },
        { status: 400 }
      );
    }

    // Calculate refund amount
    const refundAmount = amount || payment.amount;

    // Validate refund amount
    if (refundAmount <= 0 || refundAmount > payment.amount) {
      return NextResponse.json(
        { error: 'Invalid refund amount' },
        { status: 400 }
      );
    }

    // Check total refunds so far
    const { data: previousRefunds } = await supabase
      .from('transactions')
      .select('amount')
      .eq('payment_id', paymentId)
      .eq('transaction_type', 'refund')
      .in('status', ['captured', 'settled']);

    const totalRefunded = previousRefunds?.reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0) || 0;
    const remainingAmount = payment.amount - totalRefunded;

    if (refundAmount > remainingAmount) {
      return NextResponse.json(
        { error: `Cannot refund $${refundAmount}. Only $${remainingAmount.toFixed(2)} remaining.` },
        { status: 400 }
      );
    }

    // Build refund request
    const refundRequest: RefundRequest = {
      transactionId: payment.transaction_id!,
      amount: refundAmount,
      lastFourDigits: payment.last_four!,
      reason,
    };

    // Process refund through Authorize.net
    const refundResponse = await processRefund(refundRequest);

    if (!refundResponse.success) {
      console.error('Refund failed:', refundResponse.responseText);

      // Log failed refund attempt
      await supabase.from('transactions').insert({
        payment_id: paymentId,
        transaction_type: 'refund',
        amount: refundAmount,
        status: 'error',
        response_code: refundResponse.responseCode,
        response_text: refundResponse.responseText,
        error_message: refundResponse.errors?.[0]?.errorText,
        request_data: { amount: refundAmount, reason },
        response_data: refundResponse,
      });

      return NextResponse.json(
        {
          success: false,
          error: refundResponse.responseText || 'Refund failed',
          errors: refundResponse.errors,
        },
        { status: 402 }
      );
    }

    // Refund successful - create transaction log
    const { data: refundTransaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        payment_id: paymentId,
        transaction_type: 'refund',
        amount: refundAmount,
        status: 'captured',
        transaction_id: refundResponse.transactionId,
        response_code: refundResponse.responseCode,
        response_text: refundResponse.responseText,
        request_data: { amount: refundAmount, reason },
        response_data: refundResponse,
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Failed to log refund transaction:', transactionError);
    }

    // Update payment status
    const newTotalRefunded = totalRefunded + refundAmount;
    const isFullyRefunded = newTotalRefunded >= payment.amount;

    await supabase
      .from('payments')
      .update({
        status: isFullyRefunded ? 'refunded' : 'partially_refunded',
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    // Get order and update status if fully refunded
    if (isFullyRefunded) {
      await supabase
        .from('orders')
        .update({
          status: 'refunded',
          payment_status: 'refunded',
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.order_id);
    }

    return NextResponse.json(
      {
        success: true,
        refund: {
          id: refundTransaction?.id,
          transactionId: refundResponse.transactionId,
          amount: refundAmount,
          status: 'captured',
          remainingAmount: payment.amount - newTotalRefunded,
          fullyRefunded: isFullyRefunded,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing refund:', error);
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
 * GET /api/payments/[id]/refund
 * Get refund history for a payment
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: paymentId } = await params;

    const supabase = await createClient();

    // Get all refund transactions
    const { data: refunds, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('payment_id', paymentId)
      .eq('transaction_type', 'refund')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Calculate totals
    const totalRefunded = refunds?.reduce((sum, r) => {
      if (['captured', 'settled'].includes(r.status)) {
        return sum + parseFloat(r.amount.toString());
      }
      return sum;
    }, 0) || 0;

    return NextResponse.json({
      refunds: refunds || [],
      totalRefunded,
      count: refunds?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching refunds:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
