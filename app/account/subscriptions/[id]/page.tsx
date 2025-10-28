'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Subscription } from '@/types/subscription';

export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subscriptionId = params.id as string;

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [pauseReason, setPauseReason] = useState('');

  useEffect(() => {
    fetchSubscription();
  }, [subscriptionId]);

  async function fetchSubscription() {
    try {
      setLoading(true);
      const response = await fetch(`/api/subscriptions/${subscriptionId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }

      const data = await response.json();
      setSubscription(data.subscription);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePause() {
    if (!subscription) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/subscriptions/${subscriptionId}/pause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: pauseReason || undefined }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to pause subscription');
      }

      await fetchSubscription();
      setShowPauseModal(false);
      setPauseReason('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleResume() {
    if (!subscription) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/subscriptions/${subscriptionId}/resume`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to resume subscription');
      }

      await fetchSubscription();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    if (!subscription) return;

    try {
      setActionLoading(true);

      // Build URL with query parameter for reason
      const url = new URL(`/api/subscriptions/${subscriptionId}`, window.location.origin);
      if (cancelReason) {
        url.searchParams.set('reason', cancelReason);
      }

      const response = await fetch(url.toString(), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      router.push('/account/subscriptions');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading subscription...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || 'Subscription not found'}</p>
            <Link
              href="/account/subscriptions"
              className="mt-4 inline-block text-sm text-red-700 hover:text-red-900 underline"
            >
              Back to subscriptions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account/subscriptions"
            className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to subscriptions
          </Link>
          <div className="flex items-center justify-between mt-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {subscription.type.charAt(0).toUpperCase() + subscription.type.slice(1)} Subscription
              </h1>
              <p className="mt-1 text-sm text-gray-500">ID: {subscription.id.substring(0, 8)}</p>
            </div>
            {getStatusBadge(subscription.status)}
          </div>
        </div>

        {/* Subscription Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Frequency</dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">{formatFrequency(subscription.frequency)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Amount</dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">${subscription.amount.toFixed(2)}</dd>
            </div>
            {subscription.next_billing_date && (
              <div>
                <dt className="text-sm text-gray-500">Next Billing Date</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {new Date(subscription.next_billing_date).toLocaleDateString()}
                </dd>
              </div>
            )}
            {subscription.last_billing_date && (
              <div>
                <dt className="text-sm text-gray-500">Last Billing Date</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {new Date(subscription.last_billing_date).toLocaleDateString()}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm text-gray-500">Created</dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {new Date(subscription.created_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>

        {/* Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
          <ul className="divide-y divide-gray-200">
            {subscription.items.map((item, idx) => (
              <li key={idx} className="py-3 flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        {subscription.status !== 'cancelled' && subscription.status !== 'expired' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Manage Subscription</h2>
            <div className="space-y-3">
              {subscription.status === 'active' && (
                <button
                  onClick={() => setShowPauseModal(true)}
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Pause Subscription
                </button>
              )}

              {subscription.status === 'paused' && (
                <button
                  onClick={handleResume}
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Resuming...' : 'Resume Subscription'}
                </button>
              )}

              <button
                onClick={() => setShowCancelModal(true)}
                disabled={actionLoading}
                className="w-full sm:w-auto px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 ml-0 sm:ml-3"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
              <p className="mt-1 text-sm text-gray-500">
                {subscription.payment_method_id ? 'Payment method on file' : 'No payment method'}
              </p>
            </div>
            <Link
              href="/account/payment-methods"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Update Payment
            </Link>
          </div>
        </div>
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pause Subscription</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your subscription will be paused and you won&apos;t be charged until you resume it.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (optional)
              </label>
              <textarea
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                placeholder="Let us know why you're pausing..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPauseModal(false);
                  setPauseReason('');
                }}
                disabled={actionLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePause}
                disabled={actionLoading}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 disabled:opacity-50"
              >
                {actionLoading ? 'Pausing...' : 'Pause Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Subscription</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel? This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                placeholder="Help us improve - why are you canceling?"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                disabled={actionLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? 'Canceling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
