'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Subscription, SubscriptionInvoice } from '@/types/subscription';

interface SubscriptionHistory {
  id: string;
  action: string;
  old_status?: string;
  new_status?: string;
  actor_type: string;
  actor_id?: string;
  notes?: string;
  created_at: string;
}

interface DetailedSubscription extends Subscription {
  customer?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
  };
  payment_method?: {
    id: string;
    card_type?: string;
    last_four: string;
    expiration_month: number;
    expiration_year: number;
  };
}

export default function AdminSubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subscriptionId = params.id as string;

  const [subscription, setSubscription] = useState<DetailedSubscription | null>(null);
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>([]);
  const [history, setHistory] = useState<SubscriptionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptionDetails();
  }, [subscriptionId]);

  async function fetchSubscriptionDetails() {
    try {
      setLoading(true);

      // Fetch subscription with customer and payment method (admin endpoint)
      const subResponse = await fetch(`/api/admin/subscriptions/${subscriptionId}`);
      if (!subResponse.ok) throw new Error('Failed to fetch subscription');
      const subData = await subResponse.json();
      setSubscription(subData.subscription);

      // Fetch invoices
      const invoicesResponse = await fetch(`/api/admin/subscriptions/${subscriptionId}/invoices`);
      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json();
        setInvoices(invoicesData.invoices || []);
      }

      // Fetch history
      const historyResponse = await fetch(`/api/admin/subscriptions/${subscriptionId}/history`);
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setHistory(historyData.history || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePause() {
    if (!subscription || !confirm('Pause this subscription?')) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/subscriptions/${subscriptionId}/pause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Admin action' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to pause subscription');
      }

      await fetchSubscriptionDetails();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleResume() {
    if (!subscription || !confirm('Resume this subscription?')) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/subscriptions/${subscriptionId}/resume`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to resume subscription');
      }

      await fetchSubscriptionDetails();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    if (!subscription || !confirm('CANCEL this subscription? This cannot be undone.')) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/subscriptions/${subscriptionId}?reason=Admin cancellation`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      router.push('/admin/subscriptions');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleManualBilling() {
    if (!subscription || !confirm('Manually process billing for this subscription NOW?')) return;

    try {
      setActionLoading(true);

      // Call the cron endpoint for this specific subscription
      const response = await fetch('/api/admin/subscriptions/manual-billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription_id: subscriptionId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to process billing');
      }

      alert('Billing processed successfully');
      await fetchSubscriptionDetails();
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

  function getInvoiceStatusBadge(status: string) {
    const styles: Record<string, string> = {
      pending: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.toUpperCase()}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || 'Subscription not found'}</p>
            <Link
              href="/admin/subscriptions"
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/subscriptions"
            className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all subscriptions
          </Link>
          <div className="flex items-center justify-between mt-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Subscription Details</h1>
              <p className="mt-1 text-sm text-gray-500">ID: {subscription.id}</p>
            </div>
            {getStatusBadge(subscription.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">
                    {subscription.customer?.first_name} {subscription.customer?.last_name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{subscription.customer?.email}</dd>
                </div>
                {subscription.customer?.phone && (
                  <div>
                    <dt className="text-sm text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{subscription.customer.phone}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-gray-500">Customer ID</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{subscription.customer_id.substring(0, 12)}...</dd>
                </div>
              </dl>
            </div>

            {/* Subscription Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{subscription.type}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Frequency</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{subscription.frequency}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Amount</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">${subscription.amount.toFixed(2)}</dd>
                </div>
                {subscription.discount_percentage > 0 && (
                  <div>
                    <dt className="text-sm text-gray-500">Discount</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{subscription.discount_percentage}%</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-gray-500">Next Billing</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">
                    {subscription.next_billing_date
                      ? new Date(subscription.next_billing_date).toLocaleDateString()
                      : '-'
                    }
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Last Billing</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">
                    {subscription.last_billing_date
                      ? new Date(subscription.last_billing_date).toLocaleDateString()
                      : 'Never'
                    }
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">
                    {new Date(subscription.created_at).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
              <ul className="divide-y divide-gray-200">
                {subscription.items.map((item, idx) => (
                  <li key={idx} className="py-3 flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.product_id ? `Product ID: ${item.product_id}` : item.bundle_id ? `Bundle ID: ${item.bundle_id}` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Invoices */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h2>
              {invoices.length === 0 ? (
                <p className="text-sm text-gray-500">No invoices yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Attempts</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="px-3 py-2 text-sm text-gray-900">{invoice.invoice_number}</td>
                          <td className="px-3 py-2">{getInvoiceStatusBadge(invoice.status)}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">${invoice.total.toFixed(2)}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{invoice.attempt_count}</td>
                          <td className="px-3 py-2 text-sm text-gray-500">
                            {new Date(invoice.billing_date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity History</h2>
              {history.length === 0 ? (
                <p className="text-sm text-gray-500">No activity recorded</p>
              ) : (
                <div className="space-y-3">
                  {history.map((entry) => (
                    <div key={entry.id} className="border-l-2 border-gray-200 pl-4">
                      <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                      {entry.notes && <p className="text-sm text-gray-600">{entry.notes}</p>}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(entry.created_at).toLocaleString()} - {entry.actor_type}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
              {subscription.payment_method ? (
                <div>
                  <p className="text-sm text-gray-900">
                    {subscription.payment_method.card_type || 'Card'} •••• {subscription.payment_method.last_four}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires {subscription.payment_method.expiration_month}/{subscription.payment_method.expiration_year}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No payment method</p>
              )}
            </div>

            {/* Admin Actions */}
            {subscription.status !== 'cancelled' && subscription.status !== 'expired' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h2>
                <div className="space-y-3">
                  {subscription.status === 'active' && (
                    <button
                      onClick={handlePause}
                      disabled={actionLoading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Pause Subscription
                    </button>
                  )}

                  {subscription.status === 'paused' && (
                    <button
                      onClick={handleResume}
                      disabled={actionLoading}
                      className="w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      Resume Subscription
                    </button>
                  )}

                  <button
                    onClick={handleManualBilling}
                    disabled={actionLoading || subscription.status !== 'active'}
                    className="w-full px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 disabled:opacity-50"
                  >
                    Process Billing Now
                  </button>

                  <button
                    onClick={handleCancel}
                    disabled={actionLoading}
                    className="w-full px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
