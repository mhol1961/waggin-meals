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
}

interface OrderItem {
  id: string;
  product_name: string;
  variant_title: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  created_at: string;
  shipping_address: any;
  tracking_number?: string | null;
  notes?: string | null;
  order_items: OrderItem[];
}

interface Props {
  customer: Customer;
  orders: Order[];
}

export default function CustomerOrdersClient({ customer, orders }: Props) {
  const router = useRouter();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
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

  const toggleOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600';
      case 'shipped':
        return 'text-blue-600';
      case 'processing':
        return 'text-yellow-600';
      case 'pending':
        return 'text-gray-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order History
              </h1>
              <p className="text-gray-600 mt-1">
                View all your past orders
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
                className="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                Dashboard
              </Link>
              <Link
                href="/customer/orders"
                className="block px-4 py-3 rounded-lg bg-[#a5b5eb] text-white font-medium"
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
            </nav>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-2">
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-24 h-24 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Orders Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't placed any orders yet
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-3 bg-[#a5b5eb] text-white rounded-lg hover:bg-[#8a9fd9] transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    {/* Order Header */}
                    <button
                      onClick={() => toggleOrder(order.id)}
                      className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-6">
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">
                            Order #{order.order_number}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            {formatCurrency(order.total)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedOrderId === order.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Order Details (Expandable) */}
                    {expandedOrderId === order.id && (
                      <div className="border-t border-gray-200 px-6 py-4">
                        {/* Order Items */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
                          <div className="space-y-2">
                            {order.order_items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <div>
                                  <span className="text-gray-900">{item.product_name}</span>
                                  {item.variant_title && (
                                    <span className="text-gray-600"> - {item.variant_title}</span>
                                  )}
                                  <span className="text-gray-600"> × {item.quantity}</span>
                                </div>
                                <div className="text-gray-900 font-medium">
                                  {formatCurrency(item.total_price)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Totals */}
                        <div className="border-t border-gray-200 pt-4 mb-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping:</span>
                            <span className="text-gray-900">{formatCurrency(order.shipping_cost)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax:</span>
                            <span className="text-gray-900">{formatCurrency(order.tax)}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                            <span>Total:</span>
                            <span>{formatCurrency(order.total)}</span>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                          <div className="text-sm text-gray-700">
                            {order.shipping_address && (
                              <>
                                <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                                <p>{order.shipping_address.address_line1}</p>
                                {order.shipping_address.address_line2 && (
                                  <p>{order.shipping_address.address_line2}</p>
                                )}
                                <p>
                                  {order.shipping_address.city}, {order.shipping_address.state}{' '}
                                  {order.shipping_address.postal_code}
                                </p>
                                {order.shipping_address.phone && (
                                  <p className="mt-1">Phone: {order.shipping_address.phone}</p>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Tracking Info */}
                        {order.tracking_number && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">Tracking Information</h4>
                            <p className="text-sm text-blue-800">
                              Tracking #: <span className="font-mono">{order.tracking_number}</span>
                            </p>
                          </div>
                        )}

                        {/* Notes */}
                        {order.notes && (
                          <div className="mt-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                            <p className="text-sm text-gray-700">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
