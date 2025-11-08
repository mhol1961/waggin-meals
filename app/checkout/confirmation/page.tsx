'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

export const dynamic = 'force-dynamic';

interface Payment {
  id: string;
  amount: number;
  status: string;
  transaction_id: string;
  last_four: string;
  card_type?: string;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const subscriptionId = searchParams.get('subscription');

  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch payment details
        const paymentResponse = await fetch(`/api/payments?orderId=${orderId}`);
        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json();
          if (paymentData.payments && paymentData.payments.length > 0) {
            setPayment(paymentData.payments[0]);
          }
        }

        // For now, create a mock order object from the payment
        // In production, you'd fetch the actual order from /api/orders
        if (payment) {
          setOrder({
            id: orderId,
            order_number: orderId.slice(0, 8).toUpperCase(),
            total: payment.amount,
            status: 'processing',
            created_at: payment.created_at,
          });
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    // Track conversion in analytics
    if (typeof window !== 'undefined' && (window as any).gtag && payment) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: payment.transaction_id,
        value: payment.amount,
        currency: 'USD',
      });
    }
  }, [payment]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8FAE8F] border-r-transparent"></div>
          <p className="mt-4 text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-green-500 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1
            className="text-5xl font-normal text-white mb-4"
            style={{ fontFamily: "'Abril Fatface', serif" }}
          >
            {payment ? 'Payment Successful!' : 'Order Confirmed!'}
          </h1>
          <p
            className="text-xl text-white mb-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Thank you for your order
          </p>
          {order?.order_number && (
            <p
              className="text-lg text-white/90"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Order Number: <span className="font-semibold">{order.order_number}</span>
            </p>
          )}
        </div>
      </section>

      {/* Payment Confirmation */}
      {payment && (
        <section className="px-4 py-8 bg-green-50 border-b border-green-100">
          <div className="mx-auto max-w-3xl">
            <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Payment Confirmed
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>Amount Charged</p>
                  <p className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    ${payment.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>Payment Method</p>
                  <p className="font-medium text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {payment.card_type || 'Card'} •••• {payment.last_four}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>Transaction ID</p>
                  <p className="font-mono text-xs text-gray-600">{payment.transaction_id}</p>
                </div>
                <div>
                  <p className="text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>Status</p>
                  <p className="font-medium text-green-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    ✓ {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Confirmation Details */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2
              className="text-2xl font-semibold text-[#3c3a47] mb-6"
              style={{ fontFamily: "'Abril Fatface', serif" }}
            >
              What Happens Next?
            </h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-[#8FAE8F] text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold text-[#3c3a47] mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Order Confirmation Email
                  </h3>
                  <p
                    className="text-gray-600"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    You'll receive an email confirmation shortly with your order details and
                    receipt.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-[#8FAE8F] text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold text-[#3c3a47] mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {subscriptionId ? 'Subscription Activated' : 'Order Processing'}
                  </h3>
                  <p
                    className="text-gray-600"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {subscriptionId
                      ? 'Your subscription is now active and will automatically renew on your next billing date.'
                      : "We'll start preparing your order for shipment right away."}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-[#8FAE8F] text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold text-[#3c3a47] mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Shipping Notification
                  </h3>
                  <p
                    className="text-gray-600"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Once your order ships, you'll receive a tracking number to monitor your
                    delivery.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              {subscriptionId && (
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-[#8FAE8F] text-white rounded-full flex items-center justify-center font-semibold">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-lg font-semibold text-[#3c3a47] mb-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Manage Your Subscription
                    </h3>
                    <p
                      className="text-gray-600 mb-3"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      You can pause, modify, or cancel your subscription anytime from your
                      account.
                    </p>
                    <Link
                      href="/account/subscriptions"
                      className="text-[#8FAE8F] hover:underline font-medium"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      View Your Subscriptions →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
            <h3
              className="text-lg font-semibold text-[#3c3a47] mb-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Need Help?
            </h3>
            <p
              className="text-gray-600 mb-4"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Our team is here to help if you have any questions about your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-[#8FAE8F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6d8c6d] transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Contact Support
              </Link>
              <a
                href="mailto:support@wagginmeals.com"
                className="inline-flex items-center justify-center bg-white text-[#8FAE8F] border-2 border-[#8FAE8F] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                support@wagginmeals.com
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-block bg-[#8FAE8F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#6d8c6d] transition-colors text-center"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Continue Shopping
            </Link>
            <Link
              href="/account/orders"
              className="inline-block bg-white text-[#8FAE8F] border-2 border-[#8FAE8F] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors text-center"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              View Order History
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-12 text-center">
            <p
              className="text-sm text-gray-500 mb-4"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Join thousands of happy pet parents who trust Waggin' Meals
            </p>
            <div className="flex justify-center items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span
                className="ml-2 text-gray-600 font-medium"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                4.9/5 from 500+ reviews
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
