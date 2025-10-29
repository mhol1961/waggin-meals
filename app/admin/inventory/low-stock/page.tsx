'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface LowStockVariant {
  id: string;
  title: string;
  sku: string;
  inventory_quantity: number;
  price: number;
  product: {
    title: string;
    handle: string;
    category: string;
  };
}

export default function AdminLowStockPage() {
  const [variants, setVariants] = useState<LowStockVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(10);

  useEffect(() => {
    fetchLowStock();
  }, [threshold]);

  async function fetchLowStock() {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/inventory/low-stock?threshold=${threshold}`);
      if (!response.ok) throw new Error('Failed to fetch low stock variants');
      const data = await response.json();
      setVariants(data.variants || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getStockStatusColor(quantity: number): string {
    if (quantity === 0) return 'bg-red-100 text-red-800';
    if (quantity < 5) return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading low stock items...</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Low Stock Alerts</h1>
              <p className="mt-2 text-gray-600">
                Product variants running low on inventory
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Threshold:</label>
                <select
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="5">5 units</option>
                  <option value="10">10 units</option>
                  <option value="20">20 units</option>
                  <option value="50">50 units</option>
                </select>
              </div>
              <Link
                href="/admin/inventory/adjustments"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                View Adjustments →
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Total Low Stock Items</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{variants.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Out of Stock</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {variants.filter(v => v.inventory_quantity === 0).length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Critical (&lt; 5 units)</p>
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {variants.filter(v => v.inventory_quantity > 0 && v.inventory_quantity < 5).length}
            </p>
          </div>
        </div>

        {/* Low Stock Table */}
        {variants.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">All Stock Levels Good!</h3>
            <p className="mt-2 text-gray-500">
              No variants are below the {threshold} unit threshold
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {variants.map((variant) => (
                  <tr key={variant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {variant.product.title}
                        </div>
                        <div className="text-sm text-gray-500">{variant.product.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {variant.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {variant.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockStatusColor(variant.inventory_quantity)}`}>
                        {variant.inventory_quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${variant.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Link
                        href={`/admin/products/${variant.product.handle}/variants/${variant.id}`}
                        className="text-green-600 hover:text-green-900 font-medium"
                      >
                        Edit Variant
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Quick Tips */}
        {variants.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Inventory Management Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Set up automatic reorder points for frequently sold items</li>
              <li>• Review sales velocity to predict when to restock</li>
              <li>• Consider marking out-of-stock items as unavailable until restocked</li>
              <li>• Use the adjustments history to track restocking patterns</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
