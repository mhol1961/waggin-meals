'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, AlertTriangle, Download, Upload, Search, Filter } from 'lucide-react';

interface InventoryStatus {
  type: 'product' | 'variant';
  product_id: string;
  variant_id?: string | null;
  title: string;
  variant_title?: string | null;
  sku: string;
  inventory_quantity: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  allow_backorder: boolean;
  stock_status: 'unlimited' | 'in_stock' | 'low_stock' | 'out_of_stock';
  is_available: boolean;
}

interface LowStockItem {
  type: 'product' | 'variant';
  product_id: string;
  variant_id?: string | null;
  product_title: string;
  variant_title?: string | null;
  sku: string;
  current_quantity: number;
  low_stock_threshold: number;
  is_out_of_stock: boolean;
}

export default function InventoryManagementPage() {
  const [inventoryStatuses, setInventoryStatuses] = useState<InventoryStatus[]>([]);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryStatus | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentNotes, setAdjustmentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInventoryData();
    fetchLowStockItems();
  }, [filterStatus, searchTerm]);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filterStatus !== 'all') {
        params.append('stock_status', filterStatus);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/inventory/all?${params}`);
      const data = await response.json();

      if (data.statuses) {
        setInventoryStatuses(data.statuses);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockItems = async () => {
    try {
      const response = await fetch('/api/inventory/low-stock');
      const data = await response.json();

      if (data.items) {
        setLowStockItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching low stock items:', error);
    }
  };

  const handleAdjustInventory = (item: InventoryStatus) => {
    setSelectedItem(item);
    setAdjustmentQuantity(0);
    setAdjustmentNotes('');
    setShowAdjustModal(true);
  };

  const submitAdjustment = async () => {
    if (!selectedItem || adjustmentQuantity === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedItem.product_id,
          variantId: selectedItem.variant_id,
          quantityChange: adjustmentQuantity,
          transactionType: 'adjustment',
          reason: 'Manual adjustment',
          notes: adjustmentNotes || null,
        }),
      });

      if (response.ok) {
        alert('Inventory adjusted successfully');
        setShowAdjustModal(false);
        fetchInventoryData();
        fetchLowStockItems();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adjusting inventory:', error);
      alert('Failed to adjust inventory');
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportToCSV = () => {
    const csvHeader = 'SKU,Product,Variant,Current Quantity,Status,Track Inventory\n';
    const csvRows = inventoryStatuses.map(item => {
      const displayName = item.variant_title
        ? `${item.title} - ${item.variant_title}`
        : item.title;
      return `${item.sku},"${item.title}","${item.variant_title || 'N/A'}",${item.inventory_quantity},${item.stock_status},${item.track_inventory}`;
    }).join('\n');

    const csv = csvHeader + csvRows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      in_stock: { color: 'bg-green-100 text-green-800', text: 'In Stock' },
      low_stock: { color: 'bg-yellow-100 text-yellow-800', text: 'Low Stock' },
      out_of_stock: { color: 'bg-red-100 text-red-800', text: 'Out of Stock' },
      unlimited: { color: 'bg-blue-100 text-blue-800', text: 'Always Available' },
    };
    const badge = badges[status as keyof typeof badges] || badges.in_stock;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-gray-600 mt-1">Track and manage product inventory</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900">Low Stock Alert</h3>
                <p className="text-sm text-yellow-800 mt-1">
                  {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} need{lowStockItems.length === 1 ? 's' : ''} restocking
                </p>
                <div className="mt-3 space-y-2">
                  {lowStockItems.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="text-sm text-yellow-800">
                      <span className="font-medium">{item.product_title}</span>
                      {item.variant_title && ` - ${item.variant_title}`}
                      {' - '}
                      <span className={item.is_out_of_stock ? 'text-red-600 font-bold' : ''}>
                        {item.current_quantity} {item.is_out_of_stock ? '(OUT OF STOCK)' : 'remaining'}
                      </span>
                    </div>
                  ))}
                  {lowStockItems.length > 5 && (
                    <p className="text-sm text-yellow-700">...and {lowStockItems.length - 5} more</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by product name, variant, or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Items</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="unlimited">Always Available</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-pulse" />
              <p className="text-gray-600">Loading inventory...</p>
            </div>
          ) : inventoryStatuses.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No inventory items found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventoryStatuses.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{item.title}</div>
                          {item.variant_title && (
                            <div className="text-sm text-gray-500">{item.variant_title}</div>
                          )}
                          <div className="text-xs text-gray-400 mt-1">
                            {item.type === 'variant' ? 'Variant' : 'Product'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">
                            {item.track_inventory ? item.inventory_quantity : '∞'}
                          </div>
                          {item.track_inventory && (
                            <div className="text-xs text-gray-500">
                              Threshold: {item.low_stock_threshold}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(item.stock_status)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.track_inventory ? (
                          <span className="text-green-600">Tracked</span>
                        ) : (
                          <span className="text-gray-400">Not tracked</span>
                        )}
                        {item.allow_backorder && (
                          <div className="text-xs text-blue-600 mt-1">Backorder OK</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleAdjustInventory(item)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Adjust Inventory Modal */}
      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Adjust Inventory</h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Product</p>
              <p className="font-medium">{selectedItem.title}</p>
              {selectedItem.variant_title && (
                <p className="text-sm text-gray-500">{selectedItem.variant_title}</p>
              )}
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Current Quantity</p>
              <p className="text-2xl font-bold">{selectedItem.inventory_quantity}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adjustment Amount
              </label>
              <input
                type="number"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter positive or negative number"
              />
              <p className="text-xs text-gray-500 mt-1">
                Positive to add, negative to subtract
              </p>
              {adjustmentQuantity !== 0 && (
                <p className="text-sm mt-2">
                  New quantity will be: <span className="font-bold">
                    {selectedItem.inventory_quantity + adjustmentQuantity}
                  </span>
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={adjustmentNotes}
                onChange={(e) => setAdjustmentNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Reason for adjustment..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={submitAdjustment}
                disabled={adjustmentQuantity === 0 || isSubmitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adjusting...' : 'Adjust Inventory'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
