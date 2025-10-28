'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ProductVariant, UpdateVariantRequest } from '@/types/product-variant';

export default function AdminEditVariantPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const variantId = params.variantId as string;

  const [variant, setVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVariant();
  }, [variantId]);

  async function fetchVariant() {
    try {
      setLoading(true);
      const response = await fetch(`/api/variants/${variantId}`);
      if (!response.ok) throw new Error('Failed to fetch variant');
      const data = await response.json();
      setVariant(data.variant);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updates: UpdateVariantRequest = {
      title: formData.get('title') as string,
      sku: formData.get('sku') as string,
      price: parseFloat(formData.get('price') as string),
      compare_at_price: formData.get('compare_at_price') ? parseFloat(formData.get('compare_at_price') as string) : null,
      inventory_quantity: parseInt(formData.get('inventory_quantity') as string),
      weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : null,
      option1_name: (formData.get('option1_name') as string) || null,
      option1_value: (formData.get('option1_value') as string) || null,
      option2_name: (formData.get('option2_name') as string) || null,
      option2_value: (formData.get('option2_value') as string) || null,
      option3_name: (formData.get('option3_name') as string) || null,
      option3_value: (formData.get('option3_value') as string) || null,
      track_inventory: formData.get('track_inventory') === 'on',
      is_available: formData.get('is_available') === 'on',
      barcode: (formData.get('barcode') as string) || null,
      notes: (formData.get('notes') as string) || null,
    };

    try {
      setSaving(true);
      const response = await fetch(`/api/variants/${variantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update variant');
      }

      alert('Variant updated successfully');
      router.push(`/admin/products/${productId}/variants`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading variant...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !variant) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || 'Variant not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/admin/products/${productId}/variants`}
            className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to variants
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Edit Variant</h1>
          <p className="mt-2 text-gray-600">Update variant details and inventory</p>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={variant.title}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    defaultValue={variant.sku}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    defaultValue={variant.price}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compare at Price
                  </label>
                  <input
                    type="number"
                    name="compare_at_price"
                    step="0.01"
                    defaultValue={variant.compare_at_price || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    step="0.1"
                    defaultValue={variant.weight || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode
                  </label>
                  <input
                    type="text"
                    name="barcode"
                    defaultValue={variant.barcode || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Variant Options */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Variant Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Option 1 Name
                  </label>
                  <input
                    type="text"
                    name="option1_name"
                    defaultValue={variant.option1_name || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., Size"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Option 1 Value
                  </label>
                  <input
                    type="text"
                    name="option1_value"
                    defaultValue={variant.option1_value || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., 5lb"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Option 2 Name
                  </label>
                  <input
                    type="text"
                    name="option2_name"
                    defaultValue={variant.option2_name || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., Flavor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Option 2 Value
                  </label>
                  <input
                    type="text"
                    name="option2_value"
                    defaultValue={variant.option2_value || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., Beef"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Option 3 Name
                  </label>
                  <input
                    type="text"
                    name="option3_name"
                    defaultValue={variant.option3_name || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., Color"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Option 3 Value
                  </label>
                  <input
                    type="text"
                    name="option3_value"
                    defaultValue={variant.option3_value || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., Blue"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inventory Quantity
                  </label>
                  <input
                    type="number"
                    name="inventory_quantity"
                    defaultValue={variant.inventory_quantity}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Current stock level. Use inventory adjustment form for audit trail.
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="track_inventory"
                      defaultChecked={variant.track_inventory}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Track inventory</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_available"
                      defaultChecked={variant.is_available}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Available for purchase</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Internal Notes
              </label>
              <textarea
                name="notes"
                defaultValue={variant.notes || ''}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Internal notes (not visible to customers)"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Link
                href={`/admin/products/${productId}/variants`}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
