'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface InventoryAdjustment {
  id: string;
  variant_id: string;
  quantity_change: number;
  quantity_before: number;
  quantity_after: number;
  reason: string;
  notes: string | null;
  order_id: string | null;
  adjusted_by: string;
  created_at: string;
  variant_title: string;
  variant_sku: string;
  product_title: string;
  product_handle: string;
}

export default function AdminInventoryAdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reasonFilter, setReasonFilter] = useState<string>('all');

  useEffect(() => {
    fetchAdjustments();
  }, [reasonFilter]);

  async function fetchAdjustments() {
    try {
      setLoading(true);
      const url = reasonFilter === 'all'
        ? '/api/admin/inventory/adjustments'
        : `/api/admin/inventory/adjustments?reason=${reasonFilter}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch adjustments');
      const data = await response.json();
      setAdjustments(data.adjustments || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getReasonBadge(reason: string): string {
    const colors: Record<string, string> = {
      sale: 'bg-green-100 text-green-800',
      restock: 'bg-blue-100 text-blue-800',
      return: 'bg-yellow-100 text-yellow-800',
      damage: 'bg-red-100 text-red-800',
      adjustment: 'bg-[#8FAE8F]/10 text-[#5E8C8C]',
      subscription: 'bg-[#5E8C8C]/10 text-[#5E8C8C]',
    };
    return colors[reason] || 'bg-gray-100 text-gray-800';
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading adjustments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalAdjustments = adjustments.length;
  const totalIncreases = adjustments.filter(a => a.quantity_change > 0).reduce((sum, a) => sum + a.quantity_change, 0);
  const totalDecreases = Math.abs(adjustments.filter(a => a.quantity_change < 0).reduce((sum, a) => sum + a.quantity_change, 0));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Adjustments</h1>
              <p className="mt-2 text-gray-600">
                Complete audit trail of all inventory changes
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Filter by reason:</label>
                <select
                  value={reasonFilter}
                  onChange={(e) => setReasonFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Reasons</option>
                  <option value="sale">Sales</option>
                  <option value="restock">Restocks</option>
                  <option value="return">Returns</option>
                  <option value="damage">Damage</option>
                  <option value="adjustment">Manual Adjustments</option>
                  <option value="subscription">Subscriptions</option>
                </select>
              </div>
              <Link
                href="/admin/inventory/low-stock"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                ← Low Stock Alerts
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Total Adjustments</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{totalAdjustments}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Total Units Added</p>
            <p className="mt-2 text-3xl font-bold text-green-600">+{totalIncreases}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Total Units Removed</p>
            <p className="mt-2 text-3xl font-bold text-red-600">-{totalDecreases}</p>
          </div>
        </div>

        {/* Adjustments Table */}
        {adjustments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">No Adjustments Found</h3>
            <p className="mt-2 text-gray-500">
              {reasonFilter === 'all'
                ? 'No inventory adjustments have been made yet'
                : `No adjustments found for reason: ${reasonFilter}`
              }
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product / Variant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Before → After
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adjustments.map((adjustment) => (
                  <tr key={adjustment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(adjustment.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {adjustment.product_title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {adjustment.variant_title} • {adjustment.variant_sku}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReasonBadge(adjustment.reason)}`}>
                        {adjustment.reason.charAt(0).toUpperCase() + adjustment.reason.slice(1)}
                      </span>
                      {adjustment.notes && (
                        <div className="mt-1 text-xs text-gray-500 max-w-xs truncate">
                          {adjustment.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        adjustment.quantity_change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {adjustment.quantity_change > 0 ? '+' : ''}{adjustment.quantity_change}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {adjustment.quantity_before} → {adjustment.quantity_after}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {adjustment.adjusted_by === 'system' ? (
                        <span className="italic">System</span>
                      ) : (
                        adjustment.adjusted_by
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">📊 About Inventory Adjustments</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong>Sale:</strong> Automatic decreases when orders are placed</li>
            <li>• <strong>Restock:</strong> Increases when new inventory arrives</li>
            <li>• <strong>Return:</strong> Increases from customer returns</li>
            <li>• <strong>Damage:</strong> Decreases from damaged/defective items</li>
            <li>• <strong>Adjustment:</strong> Manual corrections to inventory counts</li>
            <li>• <strong>Subscription:</strong> Automatic decreases from subscription orders</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
