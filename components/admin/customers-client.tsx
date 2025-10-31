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

type Subscription = {
  id: string;
  customer_id: string;
  status: string;
};

type FilterType = 'all' | 'subscribers' | 'past_customers' | 'no_orders';

export function CustomersClient() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'spent' | 'orders' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchCustomers();
    fetchSubscriptions();
  }, []);

  async function fetchCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error);
    } else {
      setCustomers(data || []);
    }
    setLoading(false);
  }

  async function fetchSubscriptions() {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('id, customer_id, status');

    if (error) {
      console.error('Error fetching subscriptions:', error);
    } else {
      setSubscriptions(data || []);
    }
  }

  // Get customer's active subscription
  const getCustomerSubscription = (customerId: string) => {
    return subscriptions.find(
      (sub) => sub.customer_id === customerId && sub.status === 'active'
    );
  };

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      customer.email.toLowerCase().includes(searchLower) ||
      customer.first_name?.toLowerCase().includes(searchLower) ||
      customer.last_name?.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // Status filter
    if (filter === 'all') return true;

    const hasSubscription = !!getCustomerSubscription(customer.id);
    const hasOrders = customer.order_count > 0;

    if (filter === 'subscribers') return hasSubscription;
    if (filter === 'past_customers') return hasOrders && !hasSubscription;
    if (filter === 'no_orders') return !hasOrders;

    return true;
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        const nameA = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase();
        const nameB = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase();
        comparison = nameA.localeCompare(nameB);
        break;
      case 'email':
        comparison = a.email.localeCompare(b.email);
        break;
      case 'spent':
        comparison = a.total_spent - b.total_spent;
        break;
      case 'orders':
        comparison = a.order_count - b.order_count;
        break;
      case 'date':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Calculate stats
  const stats = {
    total: customers.length,
    subscribers: customers.filter((c) => !!getCustomerSubscription(c.id)).length,
    pastCustomers: customers.filter((c) => c.order_count > 0 && !getCustomerSubscription(c.id)).length,
    noOrders: customers.filter((c) => c.order_count === 0).length,
  };

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition hover:shadow-md ${
            filter === 'all' ? 'border-orange-600' : 'border-gray-200'
          }`}
        >
          <div className="text-2xl mb-2">👥</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">All Customers</div>
        </button>

        <button
          onClick={() => setFilter('subscribers')}
          className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition hover:shadow-md ${
            filter === 'subscribers' ? 'border-green-600' : 'border-gray-200'
          }`}
        >
          <div className="text-2xl mb-2">💚</div>
          <div className="text-3xl font-bold text-green-600">{stats.subscribers}</div>
          <div className="text-sm text-gray-600">Active Subscribers</div>
        </button>

        <button
          onClick={() => setFilter('past_customers')}
          className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition hover:shadow-md ${
            filter === 'past_customers' ? 'border-blue-600' : 'border-gray-200'
          }`}
        >
          <div className="text-2xl mb-2">🛍️</div>
          <div className="text-3xl font-bold text-blue-600">{stats.pastCustomers}</div>
          <div className="text-sm text-gray-600">Past Customers</div>
        </button>

        <button
          onClick={() => setFilter('no_orders')}
          className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition hover:shadow-md ${
            filter === 'no_orders' ? 'border-gray-600' : 'border-gray-200'
          }`}
        >
          <div className="text-2xl mb-2">👤</div>
          <div className="text-3xl font-bold text-gray-600">{stats.noOrders}</div>
          <div className="text-sm text-gray-600">No Orders Yet</div>
        </button>
      </div>

      {/* Search and Sort */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="date">Date Added</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="spent">Total Spent</option>
              <option value="orders">Order Count</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {sortedCustomers.length} of {customers.length} customers
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Customer
                </th>
                <th
                  onClick={() => handleSort('email')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th
                  onClick={() => handleSort('orders')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Orders
                </th>
                <th
                  onClick={() => handleSort('spent')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Total Spent
                </th>
                <th
                  onClick={() => handleSort('date')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Customer Since
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCustomers.map((customer) => {
                const hasSubscription = !!getCustomerSubscription(customer.id);
                return (
                  <tr key={customer.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-semibold text-sm">
                            {(customer.first_name?.[0] || customer.email[0]).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.first_name || customer.last_name
                              ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
                              : 'No name'}
                          </div>
                          {customer.phone && (
                            <div className="text-sm text-gray-500">{customer.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hasSubscription ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active Subscriber
                        </span>
                      ) : customer.order_count > 0 ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Past Customer
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          No Orders
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.order_count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${customer.total_spent.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="text-orange-600 hover:text-orange-900 transition"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedCustomers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'No customers match the selected filter'}
            </p>
          </div>
        )}
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            // TODO: Implement CSV export
            alert('CSV export coming soon!');
          }}
          className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
        >
          📥 Export to CSV
        </button>
      </div>
    </div>
  );
}
