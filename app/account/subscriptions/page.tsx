'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Subscription } from '@/types/subscription';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      fetchSubscriptions();
    } else if (!authLoading && !user) {
      router.push('/auth/login?redirect=/account/subscriptions');
    }
  }, [user, authLoading]);

  async function fetchSubscriptions() {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/subscriptions?customer_id=${user.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }

      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-gray-100 text-gray-800',
      past_due: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-600',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  }

  function formatFrequency(frequency: string): string {
    const map: Record<string, string> = {
      weekly: 'Weekly',
      biweekly: 'Every 2 Weeks',
      monthly: 'Monthly',
      '4-weeks': 'Every 4 Weeks',
      '6-weeks': 'Every 6 Weeks',
      '8-weeks': 'Every 8 Weeks',
    };
    return map[frequency] || frequency;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading your subscriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchSubscriptions}
              className="mt-4 text-sm text-red-700 hover:text-red-900 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
          <p className="mt-2 text-gray-600">
            Manage your recurring deliveries and payment methods
          </p>
        </div>

        {/* Subscriptions List */}
        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No subscriptions yet</h3>
            <p className="mt-2 text-gray-500">
              Start a subscription to get fresh, nutritious meals delivered regularly
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {subscription.type.charAt(0).toUpperCase() + subscription.type.slice(1)} Subscription
                      </h3>
                      {getStatusBadge(subscription.status)}
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Frequency</p>
                        <p className="font-medium text-gray-900">{formatFrequency(subscription.frequency)}</p>
                      </div>

                      <div>
                        <p className="text-gray-500">Amount</p>
                        <p className="font-medium text-gray-900">${subscription.amount.toFixed(2)}</p>
                      </div>

                      {subscription.next_billing_date && (
                        <div>
                          <p className="text-gray-500">Next Billing</p>
                          <p className="font-medium text-gray-900">
                            {new Date(subscription.next_billing_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {subscription.last_billing_date && (
                        <div>
                          <p className="text-gray-500">Last Billing</p>
                          <p className="font-medium text-gray-900">
                            {new Date(subscription.last_billing_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Items:</p>
                      <ul className="space-y-1">
                        {subscription.items.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {item.quantity}x {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="ml-6">
                    <Link
                      href={`/account/subscriptions/${subscription.id}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Methods Link */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your saved payment methods
              </p>
            </div>
            <Link
              href="/account/payment-methods"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Manage Payment Methods
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
