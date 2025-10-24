'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    shippingNotes: '',
  });

  const subtotal = totalPrice;
  const shipping = subtotal > 50 ? 0 : 12.99;
  const tax = subtotal * 0.08; // 8% tax placeholder
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // STEP 1: Process payment via Authorize.net (PRIMARY)
      // TODO: Add real Authorize.net payment processing here
      // For now, we'll assume payment succeeded and create the order

      const paymentMethod = 'authorize_net';
      const paymentId = `AUTH-${Date.now()}`; // Placeholder - will be real Authorize.net transaction ID

      // STEP 2: Create order in database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerInfo: formData,
          items: items,
          paymentMethod: paymentMethod,
          paymentId: paymentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // STEP 3: Clear cart and show success
      clearCart();
      alert(`Order placed successfully!\n\nOrder Number: ${data.order.orderNumber}\nTotal: $${data.order.total.toFixed(2)}\n\nYou will receive a confirmation email shortly.`);
      router.push('/');
    } catch (error) {
      console.error('Order error:', error);
      setIsProcessing(false);

      // If order creation failed, alert user
      alert(`Order failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease contact support or try again.`);
    }
  };

  if (items.length === 0) {
    return (
      <main className="bg-white min-h-screen">
        <section className="px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-4xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Your Cart is Empty
            </h1>
            <p className="text-[16px] text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Add some products to your cart before checking out.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#a5b5eb] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8a9fd9] transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-normal text-white mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Checkout
          </h1>
          <p className="text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Complete your order
          </p>
        </div>
      </section>

      {/* Payment Processor Notice */}
      <section className="bg-[#e8f4fb] border-b-2 border-[#0c5460] px-4 py-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-[#0c5460] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div>
              <p className="text-sm text-[#0c5460] font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Secure Payment Processing
              </p>
              <p className="text-sm text-[#0c5460]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Primary: <strong>Authorize.net</strong> • Backup: <strong>QuickBooks</strong> • Integration Status: Pending API credentials. Complete the form below and we'll contact you to finalize payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Form */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Customer Information */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                        placeholder="you@example.com"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                        placeholder="(555) 123-4567"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Delivery Notes (Optional)
                      </label>
                      <textarea
                        value={formData.shippingNotes}
                        onChange={(e) => setFormData({ ...formData, shippingNotes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                        placeholder="Special instructions for delivery..."
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                  <h2 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Order Summary
                  </h2>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative h-16 w-16 flex-shrink-0 bg-[#f8f9fa] rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-[#3c3a47] truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {item.title}
                          </h3>
                          <p className="text-xs text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-bold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
                    <div className="flex justify-between text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <span className="text-[#666666]">Subtotal</span>
                      <span className="font-medium text-[#3c3a47]">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <span className="text-[#666666]">Shipping</span>
                      <span className="font-medium text-[#3c3a47]">
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <span className="text-[#666666]">Tax (estimated)</span>
                      <span className="font-medium text-[#3c3a47]">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t-2 border-gray-300 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Total
                      </span>
                      <span className="text-2xl font-bold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-[#a5b5eb] text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>

                  <p className="text-xs text-[#999999] text-center mt-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Free shipping on orders over $50
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
