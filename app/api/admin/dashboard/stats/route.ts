import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  // Check authentication
  const adminAuth = await checkAdminAuth();
  if (!adminAuth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Fetch orders with financial data
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch subscriptions
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('*');

    // Fetch customers
    const { data: customers } = await supabase
      .from('customers')
      .select('id, email, created_at');

    // Fetch newsletter subscribers
    const { data: newsletterSubs } = await supabase
      .from('newsletter_subscribers')
      .select('id, created_at');

    // Calculate revenue metrics
    const allTimeRevenue = orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
    const todayRevenue = orders?.filter(o => new Date(o.created_at) >= today).reduce((sum, o) => sum + (o.total || 0), 0) || 0;
    const weekRevenue = orders?.filter(o => new Date(o.created_at) >= weekAgo).reduce((sum, o) => sum + (o.total || 0), 0) || 0;
    const monthRevenue = orders?.filter(o => new Date(o.created_at) >= monthStart).reduce((sum, o) => sum + (o.total || 0), 0) || 0;
    const yearRevenue = orders?.filter(o => new Date(o.created_at) >= yearStart).reduce((sum, o) => sum + (o.total || 0), 0) || 0;

    // Calculate previous periods for trends
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthRevenue = orders?.filter(o => {
      const date = new Date(o.created_at);
      return date >= lastMonthStart && date <= lastMonthEnd;
    }).reduce((sum, o) => sum + (o.total || 0), 0) || 0;

    const monthTrend = lastMonthRevenue > 0
      ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : '0';

    // Order status breakdown
    const ordersByStatus = {
      processing: orders?.filter(o => o.fulfillment_status === 'processing').length || 0,
      shipped: orders?.filter(o => o.fulfillment_status === 'shipped').length || 0,
      out_for_delivery: orders?.filter(o => o.fulfillment_status === 'out_for_delivery').length || 0,
      delivered: orders?.filter(o => o.fulfillment_status === 'delivered').length || 0,
      canceled: orders?.filter(o => o.status === 'canceled' || o.status === 'refunded').length || 0,
    };

    // Subscription metrics
    const activeSubscriptions = subscriptions?.filter(s => s.status === 'active').length || 0;
    const pausedSubscriptions = subscriptions?.filter(s => s.status === 'paused').length || 0;
    const canceledSubscriptions = subscriptions?.filter(s => s.status === 'canceled').length || 0;
    const newSubscriptionsThisMonth = subscriptions?.filter(s =>
      new Date(s.created_at) >= monthStart
    ).length || 0;

    // Customer metrics
    const totalCustomers = customers?.length || 0;
    const newCustomersThisMonth = customers?.filter(c =>
      new Date(c.created_at) >= monthStart
    ).length || 0;

    // Revenue chart data (last 30 days)
    const revenueChartData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const dayRevenue = orders?.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate >= dayStart && orderDate < dayEnd;
      }).reduce((sum, o) => sum + (o.total || 0), 0) || 0;

      revenueChartData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayRevenue,
      });
    }

    // Recent orders (last 10)
    const recentOrders = orders?.slice(0, 10).map(o => ({
      id: o.id,
      order_number: o.order_number,
      customer_email: o.customer_email,
      total: o.total,
      status: o.status,
      fulfillment_status: o.fulfillment_status,
      created_at: o.created_at,
    })) || [];

    return NextResponse.json({
      revenue: {
        today: todayRevenue,
        week: weekRevenue,
        month: monthRevenue,
        year: yearRevenue,
        allTime: allTimeRevenue,
        monthTrend: parseFloat(monthTrend),
      },
      orders: {
        total: orders?.length || 0,
        byStatus: ordersByStatus,
      },
      subscriptions: {
        active: activeSubscriptions,
        paused: pausedSubscriptions,
        canceled: canceledSubscriptions,
        newThisMonth: newSubscriptionsThisMonth,
        total: subscriptions?.length || 0,
      },
      customers: {
        total: totalCustomers,
        newThisMonth: newCustomersThisMonth,
      },
      newsletter: {
        total: newsletterSubs?.length || 0,
      },
      charts: {
        revenueChart: revenueChartData,
      },
      recentOrders,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
