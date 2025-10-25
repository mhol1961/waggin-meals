'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/format-utils';

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  total_orders: number;
  total_spent: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
}

interface Subscription {
  id: string;
  status: string;
  frequency: string;
  total: number;
  next_billing_date: string;
  secure_token: string | null;
}

interface Address {
  id: string;
  address_line1: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
}

interface Props {
  customer: Customer;
  recentOrders: Order[];
  subscription: Subscription | null;
  addresses: Address[];
}

export default function CustomerAccountClient({ customer, recentOrders, subscription, addresses }: Props) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const defaultAddress = addresses.find(a => a.is_default) || addresses[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Account
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {customer.first_name || customer.email}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? 'Logging out...' : 'Log Out'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm p-4 space-y-2">
              <Link
                href="/customer/account"
                className="block px-4 py-3 rounded-lg bg-[#a5b5eb] text-white font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/customer/orders"
                className="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                Order History
              </Link>
              <Link
                href="/customer/addresses"
                className="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                Addresses
              </Link>
              <Link
                href="/customer/profile"
                className="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                Profile Settings
              </Link>
              {subscription && (
                <Link
                  href={subscription.secure_token ? `/account/${subscription.secure_token}` : '/customer/account'}
                  className="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  Subscription
                </Link>
              )}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-gray-600 text-sm mb-1">Total Orders</div>
                <div className="text-3xl font-bold text-gray-900">
                  {customer.total_orders}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-gray-600 text-sm mb-1">Total Spent</div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(customer.total_spent)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-gray-600 text-sm mb-1">Account Status</div>
                <div className="text-xl font-bold text-green-600">
                  Active
                </div>
              </div>
            </div>

            {/* Subscription Card */}
            {subscription && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Subscription</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      subscription.status === 'active' ? 'text-green-600' :
                      subscription.status === 'pending_payment' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {subscription.status === 'pending_payment' ? 'Pending Payment' :
                       subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium text-gray-900">{subscription.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(subscription.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Billing:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(subscription.next_billing_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {subscription.secure_token && (
                  <Link
                    href={`/account/${subscription.secure_token}`}
                    className="mt-4 block w-full text-center px-4 py-2 bg-[#a5b5eb] text-white rounded-lg hover:bg-[#8a9fd9] transition-colors"
                  >
                    Manage Subscription
                  </Link>
                )}
              </div>
            )}

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <Link
                  href="/customer/orders"
                  className="text-sm text-[#a5b5eb] hover:underline"
                >
                  View All
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No orders yet</p>
                  <Link
                    href="/shop"
                    className="mt-4 inline-block text-[#a5b5eb] hover:underline"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          Order #{order.order_number}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(order.total)}
                        </div>
                        <div className={`text-sm mt-1 ${
                          order.status === 'delivered' ? 'text-green-600' :
                          order.status === 'shipped' ? 'text-blue-600' :
                          order.status === 'processing' ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Default Address */}
            {defaultAddress && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Default Address</h2>
                  <Link
                    href="/customer/addresses"
                    className="text-sm text-[#a5b5eb] hover:underline"
                  >
                    Manage Addresses
                  </Link>
                </div>
                <div className="text-gray-700">
                  <p>{defaultAddress.address_line1}</p>
                  <p>{defaultAddress.city}, {defaultAddress.state} {defaultAddress.zip_code}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
