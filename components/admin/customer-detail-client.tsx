'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

type Customer = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  total_spent: number;
  order_count: number;
  created_at: string;
  updated_at: string;
};

type Order = {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
};

type Subscription = {
  id: string;
  status: string;
  billing_frequency: string;
  next_billing_date: string | null;
  amount: number;
  created_at: string;
};

export function CustomerDetailClient({ customerId }: { customerId: string }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<Partial<Customer>>({});

  useEffect(() => {
    fetchCustomerData();
  }, [customerId]);

  async function fetchCustomerData() {
    // Fetch customer
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();

    if (customerError) {
      console.error('Error fetching customer:', customerError);
    } else {
      setCustomer(customerData);
      setEditedCustomer(customerData);
    }

    // Fetch orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('id, order_number, status, payment_status, total, created_at')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
    } else {
      setOrders(ordersData || []);
    }

    // Fetch subscriptions
    const { data: subscriptionsData, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('id, status, billing_frequency, next_billing_date, amount, created_at')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (subscriptionsError) {
      console.error('Error fetching subscriptions:', subscriptionsError);
    } else {
      setSubscriptions(subscriptionsData || []);
    }

    setLoading(false);
  }

  async function handleSaveCustomer() {
    const { error } = await supabase
      .from('customers')
      .update({
        first_name: editedCustomer.first_name,
        last_name: editedCustomer.last_name,
        phone: editedCustomer.phone,
        email: editedCustomer.email,
      })
      .eq('id', customerId);

    if (error) {
      console.error('Error updating customer:', error);
      alert('Failed to update customer');
    } else {
      setCustomer(editedCustomer as Customer);
      setEditing(false);
      alert('Customer updated successfully!');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-5xl mb-4">❌</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Customer not found</h3>
        <Link
          href="/admin/customers"
          className="text-orange-600 hover:text-orange-700"
        >
          ← Back to Customers
        </Link>
      </div>
    );
  }

  const activeSubscription = subscriptions.find((sub) => sub.status === 'active');

  return (
    <div className="space-y-6">
      {/* Customer Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition text-sm"
            >
              Edit Customer
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditedCustomer(customer);
                  setEditing(false);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustomer}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition text-sm"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 h-20 w-20 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-3xl">
                {(customer.first_name?.[0] || customer.email[0]).toUpperCase()}
              </span>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={editedCustomer.first_name || ''}
                    onChange={(e) =>
                      setEditedCustomer({ ...editedCustomer, first_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{customer.first_name || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={editedCustomer.last_name || ''}
                    onChange={(e) =>
                      setEditedCustomer({ ...editedCustomer, last_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{customer.last_name || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {editing ? (
                  <input
                    type="email"
                    value={editedCustomer.email || ''}
                    onChange={(e) =>
                      setEditedCustomer({ ...editedCustomer, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{customer.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                {editing ? (
                  <input
                    type="tel"
                    value={editedCustomer.phone || ''}
                    onChange={(e) =>
                      setEditedCustomer({ ...editedCustomer, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{customer.phone || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Since
                </label>
                <p className="text-gray-900">
                  {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                {activeSubscription ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active Subscriber
                  </span>
                ) : customer.order_count > 0 ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Past Customer
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    No Orders Yet
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Total Orders</div>
          <div className="text-3xl font-bold text-gray-900">{customer.order_count}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Total Spent</div>
          <div className="text-3xl font-bold text-green-600">
            ${customer.total_spent.toFixed(2)}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Active Subscriptions</div>
          <div className="text-3xl font-bold text-orange-600">
            {subscriptions.filter((s) => s.status === 'active').length}
          </div>
        </div>
      </div>

      {/* Subscriptions */}
      {subscriptions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Subscriptions</h2>
          </div>
          <div className="p-6 space-y-4">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        subscription.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : subscription.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {subscription.status}
                    </span>
                    <span className="text-sm text-gray-600">
                      {subscription.billing_frequency} billing
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Amount: <span className="font-semibold">${subscription.amount}</span>
                  </div>
                  {subscription.next_billing_date && (
                    <div className="text-sm text-gray-600">
                      Next billing:{' '}
                      {new Date(subscription.next_billing_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <Link
                  href={`/admin/subscriptions/${subscription.id}`}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  Manage →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
        </div>
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : order.payment_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-600">
            <div className="text-4xl mb-2">📦</div>
            <p>No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
