'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export const dynamic = 'force-dynamic';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const subscriptionId = searchParams.get('subscription');

  useEffect(() => {
    // Track conversion in analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: orderNumber || subscriptionId,
        value: searchParams.get('amount') || 0,
        currency: 'USD',
      });
    }
  }, [orderNumber, subscriptionId]);

  return (
    <main className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-16">
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
            Order Confirmed!
          </h1>
          <p
            className="text-xl text-white mb-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Thank you for your order
          </p>
          {orderNumber && (
            <p
              className="text-lg text-white/90"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Order Number: <span className="font-semibold">{orderNumber}</span>
            </p>
          )}
        </div>
      </section>

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
                  <div className="w-10 h-10 bg-[#a5b5eb] text-white rounded-full flex items-center justify-center font-semibold">
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
                  <div className="w-10 h-10 bg-[#a5b5eb] text-white rounded-full flex items-center justify-center font-semibold">
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
                  <div className="w-10 h-10 bg-[#a5b5eb] text-white rounded-full flex items-center justify-center font-semibold">
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
                    <div className="w-10 h-10 bg-[#a5b5eb] text-white rounded-full flex items-center justify-center font-semibold">
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
                      className="text-[#a5b5eb] hover:underline font-medium"
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
                className="inline-flex items-center justify-center bg-[#a5b5eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8a9fd9] transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Contact Support
              </Link>
              <a
                href="mailto:support@wagginmeals.com"
                className="inline-flex items-center justify-center bg-white text-[#a5b5eb] border-2 border-[#a5b5eb] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
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
              className="inline-block bg-[#a5b5eb] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#8a9fd9] transition-colors text-center"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Continue Shopping
            </Link>
            <Link
              href="/account/orders"
              className="inline-block bg-white text-[#a5b5eb] border-2 border-[#a5b5eb] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors text-center"
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
