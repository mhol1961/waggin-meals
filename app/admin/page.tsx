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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
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
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const orderStatusData = [
    { name: 'Processing', value: stats.orders.byStatus.processing, color: '#f59e0b' },
    { name: 'Shipped', value: stats.orders.byStatus.shipped, color: '#3b82f6' },
    { name: 'Out for Delivery', value: stats.orders.byStatus.out_for_delivery, color: '#8b5cf6' },
    { name: 'Delivered', value: stats.orders.byStatus.delivered, color: '#10b981' },
    { name: 'Canceled', value: stats.orders.byStatus.canceled, color: '#ef4444' },
  ];

  const subscriptionData = [
    { name: 'Active', value: stats.subscriptions.active, color: '#10b981' },
    { name: 'Paused', value: stats.subscriptions.paused, color: '#f59e0b' },
    { name: 'Canceled', value: stats.subscriptions.canceled, color: '#ef4444' },
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
        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
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

          <Link
            href="/admin/orders"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
              <span className="text-2xl">📦</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.orders.total}
            </div>
            <div className="text-sm text-purple-600 group-hover:text-purple-700">
              View all orders →
            </div>
          </Link>

          <Link
            href="/admin/subscriptions"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Active Subscriptions</h3>
              <span className="text-2xl">🔄</span>
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
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Customers</h3>
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.customers.total}
            </div>
            <div className="text-sm text-green-600">
              {stats.customers.newThisMonth} new this month
            </div>
          </Link>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Trend (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.charts.revenueChart}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
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
              {orderStatusData.map((status) => (
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

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Today's Revenue</h4>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.revenue.today)}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">This Week</h4>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.revenue.week)}
            </div>
          </div>

          <Link
            href="/admin/newsletter"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group"
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
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
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
                        className="text-purple-600 hover:text-purple-700 font-medium"
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
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tax & Accounting Reports
          </h3>
          <p className="text-gray-700 mb-4">
            Generate comprehensive financial reports for your CPA or tax preparation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-purple-600">
                {formatCurrency(stats.revenue.year)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Year to Date</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-purple-600">
                {formatCurrency(stats.revenue.allTime)}
              </div>
              <div className="text-sm text-gray-600 mt-1">All Time</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-purple-600">
                {stats.orders.total}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Orders</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-purple-600">
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
