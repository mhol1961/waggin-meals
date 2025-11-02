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

    // Calculate Average Order Value
    const averageOrderValue = orders && orders.length > 0
      ? allTimeRevenue / orders.length
      : 0;

    // Calculate repeat customer rate
    const uniqueCustomers = new Set(orders?.map(o => o.customer_email));
    const ordersByCustomer = new Map();
    orders?.forEach(o => {
      const count = ordersByCustomer.get(o.customer_email) || 0;
      ordersByCustomer.set(o.customer_email, count + 1);
    });
    const repeatCustomers = Array.from(ordersByCustomer.values()).filter(count => count > 1).length;
    const repeatCustomerRate = uniqueCustomers.size > 0
      ? (repeatCustomers / uniqueCustomers.size) * 100
      : 0;

    // Calculate Customer Lifetime Value (simple average)
    const customerLifetimeValue = uniqueCustomers.size > 0
      ? allTimeRevenue / uniqueCustomers.size
      : 0;

    // Fetch products and calculate best sellers
    const { data: products } = await supabase
      .from('products')
      .select('id, title, handle');

    // Fetch order items to calculate best sellers
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id, quantity, price');

    // Calculate best sellers
    const productSales = new Map();
    orderItems?.forEach(item => {
      const existing = productSales.get(item.product_id) || { quantity: 0, revenue: 0 };
      productSales.set(item.product_id, {
        quantity: existing.quantity + (item.quantity || 0),
        revenue: existing.revenue + ((item.price || 0) * (item.quantity || 0)),
      });
    });

    const bestSellers = Array.from(productSales.entries())
      .map(([productId, stats]) => {
        const product = products?.find(p => p.id === productId);
        return {
          id: productId,
          title: product?.title || 'Unknown Product',
          handle: product?.handle || '',
          quantity: stats.quantity,
          revenue: stats.revenue,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Monthly recurring revenue from active subscriptions
    const monthlyRecurringRevenue = subscriptions
      ?.filter(s => s.status === 'active')
      .reduce((sum, s) => sum + (s.price || 0), 0) || 0;

    return NextResponse.json({
      revenue: {
        today: todayRevenue,
        week: weekRevenue,
        month: monthRevenue,
        year: yearRevenue,
        allTime: allTimeRevenue,
        monthTrend: parseFloat(monthTrend),
        averageOrderValue,
        monthlyRecurringRevenue,
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
        repeatCustomerRate,
        lifetimeValue: customerLifetimeValue,
      },
      newsletter: {
        total: newsletterSubs?.length || 0,
      },
      charts: {
        revenueChart: revenueChartData,
      },
      recentOrders,
      bestSellers,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
