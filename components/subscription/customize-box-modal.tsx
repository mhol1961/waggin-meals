'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface Product {
  id: string;
  title: string;
  handle: string;
  price: number;
  images: string[];
  inventory_quantity: number;
}

interface SubscriptionItem {
  name: string;
  product_id?: string;
  quantity: number;
  price: number;
}

interface CustomizeBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentItems: SubscriptionItem[];
  currentAmount: number;
  subscriptionId: string;
  onSave: (newItems: SubscriptionItem[], newAmount: number) => Promise<void>;
}

export function CustomizeBoxModal({
  isOpen,
  onClose,
  currentItems,
  currentAmount,
  subscriptionId,
  onSave,
}: CustomizeBoxModalProps) {
  const [items, setItems] = useState<SubscriptionItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showProductList, setShowProductList] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setItems([...currentItems]);
      loadProducts();
    }
  }, [isOpen, currentItems]);

  async function loadProducts() {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('id, title, handle, price, images, inventory_quantity')
        .eq('published', true)
        .order('title');

      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateTotal(): number {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  function updateQuantity(index: number, newQuantity: number) {
    if (newQuantity < 1) {
      removeItem(index);
      return;
    }

    const newItems = [...items];
    newItems[index].quantity = newQuantity;
    setItems(newItems);
  }

  function removeItem(index: number) {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  }

  function addProduct(product: Product) {
    // Check if product already exists
    const existingIndex = items.findIndex(item =>
      item.product_id === product.id || item.name === product.title
    );

    if (existingIndex >= 0) {
      // Increase quantity if already in cart
      updateQuantity(existingIndex, items[existingIndex].quantity + 1);
    } else {
      // Add new item
      const newItem: SubscriptionItem = {
        name: product.title,
        product_id: product.id,
        quantity: 1,
        price: product.price,
      };
      setItems([...items, newItem]);
    }

    setShowProductList(false);
    setSearchQuery('');
  }

  async function handleSave() {
    if (items.length === 0) {
      alert('Please add at least one product to your subscription');
      return;
    }

    try {
      setSaving(true);
      const newTotal = calculateTotal();
      await onSave(items, newTotal);
      onClose();
    } catch (error) {
      console.error('Error saving subscription:', error);
      alert('Failed to update subscription. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalChange = calculateTotal() - currentAmount;
  const newTotal = calculateTotal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Customize Your Box</h3>
              <p className="text-sm text-green-100 mt-1">
                Add, remove, or adjust quantities of products
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Current Items */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Items</h4>
            {items.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No items in your subscription</p>
                <p className="text-sm text-gray-400 mt-1">Add products below to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">${item.price.toFixed(2)} each</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          −
                        </button>
                        <span className="px-4 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      {/* Subtotal */}
                      <div className="text-gray-900 font-medium min-w-[4rem] text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 transition-colors p-1"
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Products Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-900">Add Products</h4>
              <button
                onClick={() => setShowProductList(!showProductList)}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
              >
                {showProductList ? 'Hide Products' : '+ Browse Products'}
              </button>
            </div>

            {showProductList && (
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                {/* Search */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Product List */}
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-green-600 border-r-transparent"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading products...</p>
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md border border-gray-100 cursor-pointer transition-colors"
                        onClick={() => addProduct(product)}
                      >
                        <div className="flex items-center gap-3">
                          {product.images && product.images[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{product.title}</div>
                            <div className="text-sm text-gray-500">${product.price.toFixed(2)}</div>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors">
                          Add
                        </button>
                      </div>
                    ))}
                    {filteredProducts.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No products found</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current Total:</span>
                <span className="text-gray-900">${currentAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">New Total:</span>
                <span className="font-bold text-gray-900">${newTotal.toFixed(2)}</span>
              </div>
              {totalChange !== 0 && (
                <div className="flex justify-between text-sm pt-2 border-t border-blue-200">
                  <span className="text-gray-600">Change:</span>
                  <span className={`font-semibold ${totalChange > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {totalChange > 0 ? '+' : ''}${totalChange.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || items.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
