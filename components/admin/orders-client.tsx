'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getOrderStatusBadge, getPaymentStatusBadge } from '@/lib/order-utils';

type DateRange = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom' | 'all';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  created_at: string;
  total: number;
  status: string;
  payment_status: string;
  order_type?: string;
}

interface OrdersClientProps {
  initialOrders: Order[];
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Calculate date ranges
  const getDateRangeFilter = (range: DateRange): { start: Date | null; end: Date | null } => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (range) {
      case 'today':
        return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return { start: weekStart, end: now };
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: monthStart, end: now };
      case 'quarter':
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
        const quarterStart = new Date(now.getFullYear(), quarterMonth, 1);
        return { start: quarterStart, end: now };
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        return { start: yearStart, end: now };
      case 'custom':
        if (customStartDate && customEndDate) {
          return {
            start: new Date(customStartDate),
            end: new Date(new Date(customEndDate).getTime() + 24 * 60 * 60 * 1000)
          };
        }
        return { start: null, end: null };
      default:
        return { start: null, end: null };
    }
  };

  // Filter orders based on date range and status
  useEffect(() => {
    let filtered = [...orders];

    // Apply date filter
    if (dateRange !== 'all') {
      const { start, end } = getDateRangeFilter(dateRange);
      if (start && end) {
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate >= start && orderDate < end;
        });
      }
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, dateRange, statusFilter, customStartDate, customEndDate]);

  // Calculate statistics
  const stats = {
    total: filteredOrders.length,
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    processing: filteredOrders.filter(o => o.status === 'processing').length,
    shipped: filteredOrders.filter(o => o.status === 'shipped').length,
    outForDelivery: filteredOrders.filter(o => o.status === 'out_for_delivery').length,
    delivered: filteredOrders.filter(o => o.status === 'delivered').length,
    canceled: filteredOrders.filter(o => o.status === 'canceled').length,
    totalRevenue: filteredOrders.reduce((sum, o) => sum + Number(o.total), 0),
    averageOrderValue: filteredOrders.length > 0
      ? filteredOrders.reduce((sum, o) => sum + Number(o.total), 0) / filteredOrders.length
      : 0,
  };

  return (
    <div>
      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FAE8F] focus:border-transparent"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Order Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FAE8F] focus:border-transparent"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Custom Date Range - Start */}
          {dateRange === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FAE8F] focus:border-transparent"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FAE8F] focus:border-transparent"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Total Orders
              </p>
              <p className="text-3xl font-bold text-blue-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {stats.total}
              </p>
            </div>
            <div className="bg-blue-200 p-3 rounded-lg">
              <svg className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-green-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-200 p-3 rounded-lg">
              <svg className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-[#F8F5F0] rounded-xl shadow-sm border border-[#8FAE8F]/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#5E8C8C] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Avg Order Value
              </p>
              <p className="text-3xl font-bold text-[#5E8C8C]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ${stats.averageOrderValue.toFixed(2)}
              </p>
            </div>
            <div className="bg-[#8FAE8F]/20 p-3 rounded-lg">
              <svg className="h-8 w-8 text-[#6d8c6d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-xl shadow-sm border border-orange-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Pending
              </p>
              <p className="text-3xl font-bold text-orange-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {stats.pending}
              </p>
            </div>
            <div className="bg-orange-200 p-3 rounded-lg">
              <svg className="h-8 w-8 text-orange-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {stats.pending}
          </div>
          <div className="text-xs text-gray-600 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {stats.processing}
          </div>
          <div className="text-xs text-gray-600 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Processing</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-[#5E8C8C]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {stats.shipped}
          </div>
          <div className="text-xs text-gray-600 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Shipped</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-[#5E8C8C]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {stats.outForDelivery}
          </div>
          <div className="text-xs text-gray-600 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Out for Delivery</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {stats.delivered}
          </div>
          <div className="text-xs text-gray-600 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Delivered</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {stats.canceled}
          </div>
          <div className="text-xs text-gray-600 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Canceled</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {filteredOrders.filter(o => o.status === 'refunded').length}
          </div>
          <div className="text-xs text-gray-600 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Refunded</div>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            No orders found
          </h3>
          <p className="text-gray-600 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {dateRange !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters to see more results'
              : 'Orders will appear here once customers start purchasing'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const statusBadge = getOrderStatusBadge(order.status);
                const paymentBadge = getPaymentStatusBadge(order.payment_status);
                const orderDate = new Date(order.created_at).toLocaleDateString();

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {order.order_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>{order.customer_name}</div>
                      <div className="text-sm text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>{order.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {orderDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        ${Number(order.total).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentBadge.color}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {paymentBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.order_type && order.order_type !== 'standard' ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#8FAE8F]/10 text-[#5E8C8C]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {order.order_type === 'local_delivery' ? 'Local Delivery' : 'Pickup'}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Standard</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-[#8FAE8F] hover:text-[#6d8c6d] transition-colors font-medium"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
