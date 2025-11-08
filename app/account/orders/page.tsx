'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';

interface OrderItem {
  id: string;
  product_title: string;
  product_name?: string;
  variant_title?: string;
  quantity: number;
  price: number;
  unit_price?: number;
  total: number;
  total_price?: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  order_items: OrderItem[];
  shipping_address?: any;
  tracking_number?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;

    // Redirect if not authenticated
    if (!user) {
      router.push('/auth/login?redirect=/account/orders');
      return;
    }

    fetchOrders();
  }, [user, loading]);

  async function fetchOrders() {
    try {
      setOrdersLoading(true);
      const response = await fetch('/api/orders/my-orders');

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login?redirect=/account/orders');
          return;
        }
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    const badges: { [key: string]: { bg: string; text: string; label: string } } = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' },
      shipped: { bg: 'bg-[#8FAE8F]/10', text: 'text-[#5E8C8C]', label: 'Shipped' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
      payment_failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Payment Failed' },
    };

    const badge = badges[status] || badges.pending;

    return (
      <span
        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${badge.bg} ${badge.text}`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {badge.label}
      </span>
    );
  }

  function getPaymentStatusBadge(status: string) {
    const badges: { [key: string]: { bg: string; text: string; label: string } } = {
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Refunded' },
    };

    const badge = badges[status] || badges.pending;

    return (
      <span
        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${badge.bg} ${badge.text}`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {badge.label}
      </span>
    );
  }

  if (loading || ordersLoading) {
    return (
      <div className="min-h-screen bg-white">
        <section className="bg-[#8FAE8F] px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-4xl font-normal text-white mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Order History
            </h1>
          </div>
        </section>
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8FAE8F] border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-[#8FAE8F] px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-white hover:text-white/80 mb-4 transition-colors"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Account
          </Link>
          <h1 className="text-4xl font-normal text-white mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Order History
          </h1>
          <p className="text-white/90" style={{ fontFamily: "'Poppins', sans-serif" }}>
            View and track all your orders
          </p>
        </div>
      </section>

      {/* Orders List */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Order Number
                          </p>
                          <p className="text-lg font-bold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {order.order_number}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Order Date
                          </p>
                          <p className="text-sm font-medium text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Total
                          </p>
                          <p className="text-lg font-bold text-[#8FAE8F]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(order.status)}
                        {getPaymentStatusBadge(order.payment_status)}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {item.product_title || item.product_name}
                            </p>
                            {item.variant_title && (
                              <p className="text-sm text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                {item.variant_title}
                              </p>
                            )}
                            <p className="text-sm text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              ${((item.total || item.total_price || 0)).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              ${((item.price || item.unit_price || 0)).toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tracking Info */}
                    {order.tracking_number && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm">
                          <svg className="w-5 h-5 text-[#8FAE8F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <span className="text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Tracking: <span className="font-mono font-medium">{order.tracking_number}</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Actions */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="inline-flex items-center justify-center px-6 py-2 bg-[#8FAE8F] text-white rounded-lg font-medium hover:bg-[#6d8c6d] transition-colors"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        View Details
                      </Link>
                      {order.status === 'delivered' && (
                        <button
                          onClick={() => {
                            // TODO: Implement reorder functionality
                            console.log('Reorder:', order.id);
                          }}
                          className="inline-flex items-center justify-center px-6 py-2 bg-white text-[#8FAE8F] border-2 border-[#8FAE8F] rounded-lg font-medium hover:bg-blue-50 transition-colors"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Order Again
                        </button>
                      )}
                      {order.tracking_number && (
                        <a
                          href={`https://www.google.com/search?q=${order.tracking_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Track Package
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3
                className="text-2xl font-semibold text-[#3c3a47] mb-3"
                style={{ fontFamily: "'Abril Fatface', serif" }}
              >
                No Orders Yet
              </h3>
              <p
                className="text-gray-600 mb-8 max-w-md mx-auto"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <Link
                href="/shop"
                className="inline-block bg-[#8FAE8F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#6d8c6d] transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Shop Now
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
