'use client';

import { useCart } from '@/contexts/cart-context';
import { useCartInventoryCheck } from '@/hooks/use-cart-inventory-check';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalPrice, isOpen, closeCart } = useCart();
  const { isValid, issues, isChecking } = useCartInventoryCheck();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
      />

      {/* Cart Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2
            className="text-2xl font-semibold text-[#3c3a47]"
            style={{ fontFamily: "'Abril Fatface', serif" }}
          >
            Shopping Cart
          </h2>
          <button
            onClick={closeCart}
            className="text-[#666666] hover:text-[#3c3a47] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3
                className="text-xl font-semibold text-[#3c3a47] mb-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Your cart is empty
              </h3>
              <p
                className="text-[#666666] mb-6"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Add some products to get started
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="bg-[#a5b5eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8a9fd9] transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.cart_key}
                  className="flex gap-4 bg-[#f8f9fa] rounded-lg p-4"
                >
                  {/* Product Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-sm font-semibold text-[#3c3a47] mb-1 truncate"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {item.title}
                    </h3>
                    {item.variant_title && (
                      <p
                        className="text-xs text-[#666666] mb-1"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {item.variant_title}
                      </p>
                    )}
                    {item.weight && (
                      <p
                        className="text-xs text-[#666666] mb-2"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {item.weight}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.cart_key, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded text-[#666666] hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span
                          className="text-sm font-medium text-[#3c3a47] min-w-[20px] text-center"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cart_key, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded text-[#666666] hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span
                        className="text-sm font-bold text-[#a5b5eb]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.cart_key)}
                    className="text-[#999999] hover:text-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4">
            {/* Inventory Issues Warning */}
            {issues.length > 0 && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 text-sm mb-2">
                      {issues.length} item{issues.length !== 1 ? 's' : ''} unavailable
                    </h4>
                    <ul className="space-y-1 text-xs text-red-800">
                      {issues.map((issue) => (
                        <li key={issue.cart_key}>
                          <strong>{issue.title}</strong>
                          {issue.variant_title && ` (${issue.variant_title})`}
                          {' - '}
                          {issue.available > 0
                            ? `Only ${issue.available} available (requested ${issue.requested})`
                            : 'Out of stock'}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-red-700 mt-2">
                      Please remove or reduce quantities to proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <span
                className="text-lg font-semibold text-[#3c3a47]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Subtotal
              </span>
              <span
                className="text-2xl font-bold text-[#a5b5eb]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            {isValid ? (
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full bg-[#a5b5eb] text-white text-center px-6 py-4 rounded-lg text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Proceed to Checkout
              </Link>
            ) : (
              <button
                disabled
                className="block w-full bg-gray-300 text-gray-500 text-center px-6 py-4 rounded-lg text-lg font-semibold cursor-not-allowed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Cannot Checkout - Items Unavailable
              </button>
            )}
            <button
              onClick={closeCart}
              className="block w-full mt-3 bg-white text-[#a5b5eb] border-2 border-[#a5b5eb] text-center px-6 py-3 rounded-lg font-semibold hover:bg-[#a5b5eb] hover:text-white transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Continue Shopping
            </button>
            <p
              className="text-xs text-[#999999] text-center mt-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Shipping calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}
