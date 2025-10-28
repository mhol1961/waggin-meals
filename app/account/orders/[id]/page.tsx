'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

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
  payment_method?: string;
  transaction_id?: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  discount_amount?: number;
  total: number;
  created_at: string;
  updated_at?: string;
  order_items: OrderItem[];

  // Shipping info
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_address?: string;
  shipping_address2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
  shipping_country?: string;
  shipping_phone?: string;
  tracking_number?: string;

  // Customer info
  customer_email?: string;
  customer_first_name?: string;
  customer_last_name?: string;

  notes?: string;
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, session } = useAuth();

  useEffect(() => {
    if (!session) {
      router.push('/auth/login?redirect=/account/orders');
      return;
    }

    fetchOrderDetail();
  }, [session, params.id]);

  async function fetchOrderDetail() {
    try {
      setLoading(true);
      const response = await fetch('/api/orders/my-orders');

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login?redirect=/account/orders');
          return;
        }
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      const foundOrder = data.orders?.find((o: Order) => o.id === params.id);

      if (!foundOrder) {
        setError('Order not found');
        return;
      }

      setOrder(foundOrder);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    const badges: { [key: string]: { bg: string; text: string; label: string } } = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Shipped' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
      payment_failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Payment Failed' },
    };

    const badge = badges[status] || badges.pending;

    return (
      <span
        className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${badge.bg} ${badge.text}`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {badge.label}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-4xl font-normal text-white mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Order Details
            </h1>
          </div>
        </section>
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#a5b5eb] border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </section>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-4xl font-normal text-white mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Order Not Found
            </h1>
          </div>
        </section>
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
            <Link
              href="/account/orders"
              className="inline-block bg-[#a5b5eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8a9fd9] transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Back to Orders
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-white hover:text-white/80 mb-4 transition-colors"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-normal text-white mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Order {order.order_number}
              </h1>
              <p className="text-white/90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              {getStatusBadge(order.status)}
            </div>
          </div>
        </div>
      </section>

      {/* Order Details */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {item.product_title || item.product_name}
                        </h3>
                        {item.variant_title && (
                          <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {item.variant_title}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Qty: {item.quantity}</span>
                          <span>×</span>
                          <span>${(item.price || item.unit_price || 0).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          ${(item.total || item.total_price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Shipping Address
                </h2>
                <div className="text-gray-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <p className="font-semibold">
                    {order.shipping_first_name} {order.shipping_last_name}
                  </p>
                  <p className="mt-2">{order.shipping_address}</p>
                  {order.shipping_address2 && <p>{order.shipping_address2}</p>}
                  <p>
                    {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
                  </p>
                  {order.shipping_country && <p>{order.shipping_country}</p>}
                  {order.shipping_phone && (
                    <p className="mt-2 text-gray-600">Phone: {order.shipping_phone}</p>
                  )}
                </div>
              </div>

              {/* Tracking Information */}
              {order.tracking_number && (
                <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-[#a5b5eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Tracking Number
                      </h3>
                      <p className="font-mono text-gray-900 mb-3">{order.tracking_number}</p>
                      <a
                        href={`https://www.google.com/search?q=${order.tracking_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#a5b5eb] hover:text-[#8a9fd9] font-medium transition-colors"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Track Your Package
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">${order.shipping_cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium text-gray-900">${order.tax.toFixed(2)}</span>
                  </div>
                  {order.discount_amount && order.discount_amount > 0 && (
                    <div className="flex justify-between text-sm text-green-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <span>Discount</span>
                      <span className="font-medium">-${order.discount_amount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-gray-300 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Total
                    </span>
                    <span className="text-2xl font-bold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Payment Information
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-medium ${
                        order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    {order.payment_method && (
                      <div className="flex justify-between">
                        <span>Method:</span>
                        <span className="font-medium capitalize">{order.payment_method.replace('_', ' ')}</span>
                      </div>
                    )}
                    {order.transaction_id && (
                      <div className="flex justify-between">
                        <span>Transaction:</span>
                        <span className="font-mono text-xs">{order.transaction_id.substring(0, 12)}...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Need Help?
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/contact"
                    className="block w-full bg-[#a5b5eb] text-white text-center px-4 py-3 rounded-lg font-medium hover:bg-[#8a9fd9] transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Contact Support
                  </Link>
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => {
                        // TODO: Implement reorder
                        console.log('Reorder:', order.id);
                      }}
                      className="block w-full bg-white text-[#a5b5eb] border-2 border-[#a5b5eb] text-center px-4 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Order Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
