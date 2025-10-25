'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/format-utils';

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
}

interface Subscription {
  id: string;
  status: string;
  frequency: string;
  items: any;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total: number;
  next_billing_date: string;
  payment_last_four: string | null;
  payment_card_type: string | null;
}

interface CustomerPortalClientProps {
  subscription: Subscription;
  customer: Customer;
}

export default function CustomerPortalClient({ subscription, customer }: CustomerPortalClientProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const items = typeof subscription.items === 'string'
    ? JSON.parse(subscription.items)
    : subscription.items;

  const frequencyDisplay = {
    'weekly': 'Weekly',
    'biweekly': 'Every 2 Weeks',
    'monthly': 'Monthly'
  }[subscription.frequency] || subscription.frequency;

  const handleUpdatePayment = () => {
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUpdating(true);

    const formData = new FormData(event.currentTarget);

    try {
      // Call API to tokenize payment with Authorize.net
      const response = await fetch('/api/subscriptions/update-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription_id: subscription.id,
          card_number: formData.get('card_number'),
          exp_month: formData.get('exp_month'),
          exp_year: formData.get('exp_year'),
          cvv: formData.get('cvv'),
          billing_zip: formData.get('billing_zip'),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment update failed');
      }

      setPaymentSuccess(true);
      setShowPaymentForm(false);

      // Refresh page data
      router.refresh();
    } catch (error) {
      console.error('Payment update error:', error);
      alert(error instanceof Error ? error.message : 'Failed to update payment method. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {paymentSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800 font-medium">
              Payment method updated successfully! Your subscription is now active.
            </p>
          </div>
        </div>
      )}

      {/* Current Subscription */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Subscription</h2>

        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Status</span>
            <span className={`font-medium ${
              subscription.status === 'active' ? 'text-green-600' :
              subscription.status === 'pending_payment' ? 'text-yellow-600' :
              'text-gray-600'
            }`}>
              {subscription.status === 'pending_payment' ? 'Pending Payment Update' :
               subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Frequency</span>
            <span className="font-medium text-gray-900">{frequencyDisplay}</span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Next Billing Date</span>
            <span className="font-medium text-gray-900">
              {new Date(subscription.next_billing_date).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Amount</span>
            <span className="font-medium text-gray-900">{formatCurrency(subscription.total)}</span>
          </div>

          {subscription.payment_last_four && (
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-900">
                {subscription.payment_card_type} ending in {subscription.payment_last_four}
              </span>
            </div>
          )}
        </div>

        {/* Products */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Your Products</h3>
          <ul className="space-y-2">
            {items.map((item: any, index: number) => (
              <li key={index} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.product_name || item.title} {item.quantity > 1 && `(${item.quantity})`}
                </span>
                <span className="text-gray-600">
                  {formatCurrency((item.price || item.unit_price) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Payment Update Section */}
      {!showPaymentForm ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>

          {subscription.status === 'pending_payment' ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                <strong>Action Required:</strong> Please add a payment method to activate your subscription.
              </p>
            </div>
          ) : null}

          <button
            onClick={handleUpdatePayment}
            className="w-full px-6 py-3 bg-[#a5b5eb] text-white rounded-lg hover:bg-[#8a9fd9] transition-colors font-medium"
          >
            {subscription.payment_last_four ? 'Update Payment Method' : 'Add Payment Method'}
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            🔒 Secure payment processing via Authorize.net
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Payment Information</h2>

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                name="card_number"
                required
                maxLength={16}
                pattern="[0-9]{13,16}"
                placeholder="4111111111111111"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month *
                </label>
                <input
                  type="text"
                  name="exp_month"
                  required
                  maxLength={2}
                  pattern="[0-9]{2}"
                  placeholder="12"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  type="text"
                  name="exp_year"
                  required
                  maxLength={4}
                  pattern="[0-9]{4}"
                  placeholder="2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  name="cvv"
                  required
                  maxLength={4}
                  pattern="[0-9]{3,4}"
                  placeholder="123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing ZIP Code *
              </label>
              <input
                type="text"
                name="billing_zip"
                required
                maxLength={10}
                placeholder="28403"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 px-6 py-3 bg-[#a5b5eb] text-white rounded-lg hover:bg-[#8a9fd9] transition-colors font-medium disabled:opacity-50"
              >
                {isUpdating ? 'Processing...' : 'Update Payment Method'}
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                disabled={isUpdating}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              🔒 Your payment information is encrypted and securely processed by Authorize.net.
              We never store your full card number.
            </p>
          </form>
        </div>
      )}

      {/* Contact Support */}
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
        <p className="text-gray-600 text-sm mb-4">
          Questions about your subscription or having trouble updating your payment?
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
