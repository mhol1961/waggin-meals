'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';

interface Subscription {
  id: string;
  type: string;
  frequency: string;
  amount: number;
  next_billing_date: string;
  status: string;
  items: any[];
}

export function NextBoxPreview() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    loadActiveSubscriptions();
  }, [user, loading]);

  async function loadActiveSubscriptions() {
    if (!user?.id) return;

    try {
      setDataLoading(true);

      // Load active subscriptions via API (has auth check)
      const response = await fetch('/api/subscriptions/my-subscriptions');
      if (!response.ok) {
        console.error('Failed to load subscriptions:', response.status);
        return;
      }

      const result = await response.json();
      // API returns { subscriptions: [...] }
      const allSubscriptions = result.subscriptions || [];

      const activeSubscriptions = allSubscriptions
        .filter((sub: Subscription) => sub.status === 'active')
        .sort((a: Subscription, b: Subscription) =>
          new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime()
        );

      setSubscriptions(activeSubscriptions);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setDataLoading(false);
    }
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

  function getDaysUntilDelivery(nextBillingDate: string): number {
    const now = new Date();
    const billingDate = new Date(nextBillingDate);
    const diffTime = billingDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-green-600 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Active Subscriptions</h3>
            <p className="text-sm text-gray-600 mb-3">
              Start a subscription to get fresh, nutritious meals delivered regularly
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const nextSubscription = subscriptions[0];
  const daysUntil = getDaysUntilDelivery(nextSubscription.next_billing_date);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Next Box</h3>
        <Link
          href={`/account/subscriptions/${nextSubscription.id}`}
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Manage →
        </Link>
      </div>

      {/* Countdown */}
      <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Ships in</div>
            <div className="text-3xl font-bold text-gray-900">
              {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Delivery date</div>
            <div className="text-lg font-semibold text-gray-900">
              {new Date(nextSubscription.next_billing_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Box Contents */}
      <div className="space-y-2 mb-4">
        <div className="text-sm font-medium text-gray-700">Box Contents:</div>
        {nextSubscription.items && nextSubscription.items.length > 0 ? (
          <ul className="space-y-2">
            {nextSubscription.items.map((item: any, idx: number) => (
              <li key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-900">{item.name}</span>
                </div>
                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">
            {formatFrequency(nextSubscription.frequency)} - ${nextSubscription.amount.toFixed(2)}
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <Link
          href={`/account/subscriptions/${nextSubscription.id}`}
          className="flex-1 px-3 py-2 text-center border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Customize Box
        </Link>
        <Link
          href={`/account/subscriptions/${nextSubscription.id}`}
          className="flex-1 px-3 py-2 text-center border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-50"
        >
          Skip Delivery
        </Link>
      </div>

      {/* Additional Subscriptions */}
      {subscriptions.length > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            + {subscriptions.length - 1} more subscription{subscriptions.length - 1 !== 1 ? 's' : ''}
            <Link href="/account/subscriptions" className="ml-2 text-green-600 hover:text-green-700 font-medium">
              View all →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
