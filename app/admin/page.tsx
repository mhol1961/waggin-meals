'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import Recharts components with no SSR
const AreaChart = dynamic(
  () => import('recharts').then((mod) => mod.AreaChart),
  { ssr: false }
);
const Area = dynamic(
  () => import('recharts').then((mod) => mod.Area),
  { ssr: false }
);
const PieChart = dynamic(
  () => import('recharts').then((mod) => mod.PieChart),
  { ssr: false }
);
const Pie = dynamic(
  () => import('recharts').then((mod) => mod.Pie),
  { ssr: false }
);
const Cell = dynamic(
  () => import('recharts').then((mod) => mod.Cell),
  { ssr: false }
);
const BarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  { ssr: false }
);
const Bar = dynamic(
  () => import('recharts').then((mod) => mod.Bar),
  { ssr: false }
);
const XAxis = dynamic(
  () => import('recharts').then((mod) => mod.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import('recharts').then((mod) => mod.YAxis),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import('recharts').then((mod) => mod.CartesianGrid),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip),
  { ssr: false }
);
const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);

interface DashboardStats {
  revenue: {
    today: number;
    week: number;
    month: number;
    year: number;
    allTime: number;
    monthTrend: number;
    averageOrderValue: number;
    monthlyRecurringRevenue: number;
  };
  orders: {
    total: number;
    byStatus: {
      processing: number;
      shipped: number;
      out_for_delivery: number;
      delivered: number;
      canceled: number;
    };
  };
  subscriptions: {
    active: number;
    paused: number;
    canceled: number;
    newThisMonth: number;
    total: number;
  };
  customers: {
    total: number;
    newThisMonth: number;
    repeatCustomerRate: number;
    lifetimeValue: number;
  };
  newsletter: {
    total: number;
  };
  charts: {
    revenueChart: Array<{ date: string; revenue: number }>;
  };
  recentOrders: Array<{
    id: string;
    order_number: string;
    customer_email: string;
    total: number;
    status: string;
    fulfillment_status: string;
    created_at: string;
  }>;
  bestSellers: Array<{
    id: string;
    title: string;
    handle: string;
    quantity: number;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/dashboard/stats');
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8FAE8F] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Failed to load dashboard'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#8FAE8F]/600 text-white rounded-lg hover:bg-[#8FAE8F]/700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare data for charts with brand colors
  const allOrderStatusData = [
    { name: 'Processing', value: stats.orders.byStatus.processing, color: '#f59e0b' },
    { name: 'Shipped', value: stats.orders.byStatus.shipped, color: '#6366f1' },
    { name: 'Out for Delivery', value: stats.orders.byStatus.out_for_delivery, color: '#5E8C8C' },
    { name: 'Delivered', value: stats.orders.byStatus.delivered, color: '#10b981' },
    { name: 'Canceled', value: stats.orders.byStatus.canceled, color: '#ef4444' },
  ];

  // Filter out zero values for chart display
  const orderStatusData = allOrderStatusData.filter(item => item.value > 0);
  const hasOrderData = orderStatusData.length > 0;

  const subscriptionData = [
    { name: 'Active', value: stats.subscriptions.active, color: '#10b981' },
    { name: 'Paused', value: stats.subscriptions.paused, color: '#f59e0b' },
    { name: 'Canceled', value: stats.subscriptions.canceled, color: '#94a3b8' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              Financial Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Comprehensive business analytics
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/blog"
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              CMS
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition"
              target="_blank"
            >
              View Site
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Monthly Revenue */}
          <div className="bg-[#8FAE8F] rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Monthly Revenue</h3>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatCurrency(stats.revenue.month)}
            </div>
            <div className="flex items-center text-sm">
              {stats.revenue.monthTrend >= 0 ? (
                <span className="text-green-200">↑ {stats.revenue.monthTrend}%</span>
              ) : (
                <span className="text-red-200">↓ {Math.abs(stats.revenue.monthTrend)}%</span>
              )}
              <span className="opacity-75 ml-1">vs last month</span>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-blue-500 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Average Order Value</h3>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatCurrency(stats.revenue.averageOrderValue)}
            </div>
            <div className="text-sm opacity-75">
              Per order average
            </div>
          </div>

          {/* Customer Lifetime Value */}
          <div className="bg-green-500 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Customer LTV</h3>
              <span className="text-2xl">💎</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatCurrency(stats.customers.lifetimeValue)}
            </div>
            <div className="text-sm opacity-75">
              Lifetime value per customer
            </div>
          </div>

          {/* Monthly Recurring Revenue */}
          <div className="bg-[#5E8C8C] rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Monthly Recurring</h3>
              <span className="text-2xl">🔄</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatCurrency(stats.revenue.monthlyRecurringRevenue)}
            </div>
            <div className="text-sm opacity-75">
              From {stats.subscriptions.active} active subscriptions
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            href="/admin/orders"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-[#8FAE8F]/40 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
              <span className="text-2xl">📦</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.orders.total}
            </div>
            <div className="text-sm text-[#5E8C8C] group-hover:text-[#6d8c6d]">
              View all orders →
            </div>
          </Link>

          <Link
            href="/admin/subscriptions"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-green-300 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Active Subscriptions</h3>
              <span className="text-2xl">✅</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.subscriptions.active}
            </div>
            <div className="text-sm text-green-600">
              {stats.subscriptions.newThisMonth} new this month
            </div>
          </Link>

          <Link
            href="/admin/customers"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Customers</h3>
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.customers.total}
            </div>
            <div className="text-sm text-blue-600">
              {stats.customers.newThisMonth} new this month
            </div>
          </Link>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-orange-300 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Repeat Customer Rate</h3>
              <span className="text-2xl">🔁</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.customers.repeatCustomerRate.toFixed(1)}%
            </div>
            <div className="text-sm text-orange-600">
              Customer retention metric
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue Trend (Last 30 Days)
              </h3>
              <p className="text-sm text-gray-600 mt-1">Daily revenue tracking</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total (30 days)</div>
              <div className="text-lg font-bold text-[#5E8C8C]">
                {formatCurrency(stats.charts.revenueChart.reduce((sum, day) => sum + day.revenue, 0))}
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.charts.revenueChart}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5E8C8C" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#c4b5fd" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                tickFormatter={(value) => `$${value}`}
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#5E8C8C"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Order Status Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Status Breakdown
            </h3>
            {hasOrderData ? (
              <>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {allOrderStatusData.map((status) => (
                    <Link
                      key={status.name}
                      href={`/admin/orders?status=${status.name.toLowerCase().replace(' ', '_')}`}
                      className="flex items-center gap-2 text-sm hover:bg-gray-50 p-2 rounded transition"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      ></div>
                      <span className="text-gray-700">{status.name}:</span>
                      <span className="font-semibold">{status.value}</span>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="text-lg font-medium text-gray-900 mb-1">No Orders Yet</h4>
                <p className="text-sm text-gray-500">Orders will appear here once customers start purchasing.</p>
              </div>
            )}
          </div>

          {/* Subscription Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Subscription Status
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={subscriptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {subscriptionData.map((status) => (
                <Link
                  key={status.name}
                  href={`/admin/subscriptions?status=${status.name.toLowerCase()}`}
                  className="flex flex-col items-center gap-1 text-sm hover:bg-gray-50 p-2 rounded transition"
                >
                  <div
                    className="w-full h-2 rounded-full"
                    style={{ backgroundColor: status.color }}
                  ></div>
                  <span className="text-gray-700">{status.name}</span>
                  <span className="font-bold text-lg">{status.value}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Best Selling Products</h3>
              <p className="text-sm text-gray-600">Top 10 products by revenue</p>
            </div>
            <Link
              href="/admin/products"
              className="text-sm text-[#5E8C8C] hover:text-[#6d8c6d] font-medium"
            >
              View all products →
            </Link>
          </div>

          {stats.bestSellers && stats.bestSellers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Units Sold
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.bestSellers.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-100 text-gray-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/products/${product.handle}`}
                          target="_blank"
                          className="text-gray-900 hover:text-[#5E8C8C] font-medium transition-colors"
                        >
                          {product.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-gray-700">
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(product.revenue)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h4 className="text-lg font-medium text-gray-900 mb-1">No Sales Data Yet</h4>
              <p className="text-sm text-gray-500">Best sellers will appear here once orders are placed.</p>
            </div>
          )}
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Today's Revenue</h4>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.revenue.today)}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <h4 className="text-sm font-medium text-gray-600 mb-2">This Week</h4>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.revenue.week)}
            </div>
          </div>

          <Link
            href="/admin/newsletter"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-[#8FAE8F]/40 transition-all duration-200 group"
          >
            <h4 className="text-sm font-medium text-gray-600 mb-2">Newsletter Subscribers</h4>
            <div className="text-2xl font-bold text-gray-900">
              {stats.newsletter.total}
            </div>
          </Link>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-sm text-[#5E8C8C] hover:text-[#6d8c6d] font-medium"
            >
              View all →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-[#5E8C8C] hover:text-[#6d8c6d] font-medium"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {order.customer_email}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.fulfillment_status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.fulfillment_status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.fulfillment_status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.fulfillment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tax Documents Section */}
        <div className="mt-8 bg-[#8FAE8F]/10 rounded-xl p-6 border border-[#8FAE8F]/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tax & Accounting Reports
          </h3>
          <p className="text-gray-700 mb-4">
            Generate comprehensive financial reports for your CPA or tax preparation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-[#5E8C8C]">
                {formatCurrency(stats.revenue.year)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Year to Date</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-[#5E8C8C]">
                {formatCurrency(stats.revenue.allTime)}
              </div>
              <div className="text-sm text-gray-600 mt-1">All Time</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-[#5E8C8C]">
                {stats.orders.total}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Orders</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-[#5E8C8C]">
                {stats.subscriptions.total}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Subscriptions</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
