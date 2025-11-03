'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Subscription } from '@/types/subscription';
import { CustomizeBoxModal } from '@/components/subscription/customize-box-modal';
import { supabase } from '@/lib/supabase/client';

interface Invoice {
  id: string;
  subscription_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  billing_date: string;
  created_at: string;
  transaction_id?: string;
  error_message?: string;
}

export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subscriptionId = params.id as string;

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [pauseReason, setPauseReason] = useState('');
  const [newFrequency, setNewFrequency] = useState('');
  const [newAddress, setNewAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
  });

  useEffect(() => {
    fetchSubscription();
    fetchInvoices();
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

  async function fetchInvoices() {
    try {
      setInvoicesLoading(true);
      const response = await fetch(`/api/subscriptions/${subscriptionId}/invoices`);

      if (!response.ok) {
        console.error('Failed to fetch invoices');
        return;
      }

      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (err: any) {
      console.error('Error fetching invoices:', err);
    } finally {
      setInvoicesLoading(false);
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

  async function handleSkipNext() {
    if (!subscription) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/subscriptions/${subscriptionId}/skip-next`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Customer requested skip' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to skip delivery');
      }

      await fetchSubscription();
      alert('Next delivery has been skipped!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleChangeFrequency() {
    if (!subscription || !newFrequency) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/subscriptions/${subscriptionId}/change-frequency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frequency: newFrequency }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to change frequency');
      }

      await fetchSubscription();
      setShowFrequencyModal(false);
      setNewFrequency('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUpdateAddress() {
    if (!subscription) return;

    if (!newAddress.line1 || !newAddress.city || !newAddress.state || !newAddress.postal_code) {
      alert('Please fill in all required address fields');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`/api/subscriptions/${subscriptionId}/update-address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping_address: {
            line1: newAddress.line1,
            line2: newAddress.line2,
            city: newAddress.city,
            state: newAddress.state,
            postal_code: newAddress.postal_code,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update address');
      }

      await fetchSubscription();
      setShowAddressModal(false);
      setNewAddress({ line1: '', line2: '', city: '', state: '', postal_code: '' });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSaveCustomization(newItems: any[], newAmount: number) {
    if (!subscription) return;

    // Get auth token for API request
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`/api/subscriptions/${subscriptionId}/update-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        items: newItems,
        amount: newAmount, // Note: Server will recalculate this for security
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update subscription');
    }

    // Refresh subscription data
    await fetchSubscription();
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

  function getInvoiceStatusBadge(status: string) {
    const styles: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.toUpperCase()}
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Box Contents</h2>
            {subscription.status === 'active' && (
              <button
                onClick={() => setShowCustomizeModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-md text-sm font-medium hover:from-green-700 hover:to-blue-700 transition-all shadow-sm"
              >
                Customize Box
              </button>
            )}
          </div>
          <ul className="divide-y divide-gray-200">
            {subscription.items && subscription.items.length > 0 ? (
              subscription.items.map((item, idx) => (
                <li key={idx} className="py-3 flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                </li>
              ))
            ) : (
              <li className="py-3 text-sm text-gray-500 italic">No items in subscription</li>
            )}
          </ul>
        </div>

        {/* Actions */}
        {subscription.status !== 'cancelled' && subscription.status !== 'expired' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Manage Subscription</h2>

            {/* Primary Actions */}
            <div className="space-y-3 mb-6">
              {subscription.status === 'active' && (
                <>
                  <button
                    onClick={handleSkipNext}
                    disabled={actionLoading}
                    className="w-full sm:w-auto px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 disabled:opacity-50"
                  >
                    Skip Next Delivery
                  </button>
                  <button
                    onClick={() => setShowPauseModal(true)}
                    disabled={actionLoading}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 ml-0 sm:ml-3"
                  >
                    Pause Subscription
                  </button>
                </>
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
            </div>

            {/* Subscription Settings */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Subscription Settings</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowFrequencyModal(true)}
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Change Delivery Frequency
                </button>
                <button
                  onClick={() => setShowAddressModal(true)}
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 ml-0 sm:ml-3"
                >
                  Update Shipping Address
                </button>
              </div>
            </div>

            {/* Cancel Action */}
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={actionLoading}
                className="w-full sm:w-auto px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        )}

        {/* Billing History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h2>
          {invoicesLoading ? (
            <div className="text-center py-4">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-green-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-500">Loading invoices...</p>
            </div>
          ) : invoices.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No billing history yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 text-sm text-gray-900">
                        {new Date(invoice.billing_date).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900">
                        ${invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-3 py-3 text-sm">
                        {getInvoiceStatusBadge(invoice.status)}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-500">
                        {invoice.transaction_id ? (
                          <span className="font-mono text-xs">{invoice.transaction_id.substring(0, 12)}...</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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

      {/* Change Frequency Modal */}
      {showFrequencyModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Delivery Frequency</h3>
            <p className="text-sm text-gray-600 mb-4">
              Current frequency: <strong>{formatFrequency(subscription.frequency)}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Frequency
              </label>
              <select
                value={newFrequency}
                onChange={(e) => setNewFrequency(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              >
                <option value="">Select frequency...</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Every 2 Weeks</option>
                <option value="monthly">Monthly</option>
                <option value="4-weeks">Every 4 Weeks</option>
                <option value="6-weeks">Every 6 Weeks</option>
                <option value="8-weeks">Every 8 Weeks</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowFrequencyModal(false);
                  setNewFrequency('');
                }}
                disabled={actionLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeFrequency}
                disabled={actionLoading || !newFrequency}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading ? 'Updating...' : 'Update Frequency'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Shipping Address</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will update the shipping address for all future deliveries.
            </p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={newAddress.line1}
                  onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  placeholder="123 Main St"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={newAddress.line2}
                  onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  placeholder="Apt 4B (optional)"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    maxLength={2}
                    placeholder="NC"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code *
                </label>
                <input
                  type="text"
                  value={newAddress.postal_code}
                  onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  maxLength={10}
                  placeholder="28801"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddressModal(false);
                  setNewAddress({ line1: '', line2: '', city: '', state: '', postal_code: '' });
                }}
                disabled={actionLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAddress}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading ? 'Updating...' : 'Update Address'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customize Box Modal */}
      <CustomizeBoxModal
        isOpen={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        currentItems={subscription.items || []}
        currentAmount={subscription.amount}
        subscriptionId={subscriptionId}
        onSave={handleSaveCustomization}
      />
    </div>
  );
}
