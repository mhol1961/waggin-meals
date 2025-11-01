'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PaymentForm from '@/components/payment-form';
import type { PaymentToken } from '@/types/payment';

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'USPS Priority Mail',
    price: 0,
    estimatedDays: '5-7 business days'
  },
  {
    id: 'expedited',
    name: 'Expedited Shipping',
    description: 'USPS Priority Mail Express',
    price: 12.99,
    estimatedDays: '2-3 business days'
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'FedEx Overnight',
    price: 29.99,
    estimatedDays: '1 business day'
  },
  {
    id: 'pickup',
    name: 'Local Pickup',
    description: 'Pickup in Asheville, NC',
    price: 0,
    estimatedDays: 'Available within 24 hours'
  }
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shipping info
  const [email, setEmail] = useState(user?.email || '');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    first_name: '',
    last_name: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
  });

  // Shipping method
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('standard');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'new' | 'saved'>('new');
  const [paymentToken, setPaymentToken] = useState<PaymentToken | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Tax calculation
  const [calculatedTax, setCalculatedTax] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [taxCalculating, setTaxCalculating] = useState(false);

  // Calculate totals
  const subtotal = totalPrice;
  const selectedShipping = SHIPPING_METHODS.find(m => m.id === selectedShippingMethod);
  const shipping = selectedShipping?.price || 0;
  const tax = calculatedTax;
  const total = subtotal + shipping + tax;

  // Calculate tax when address or shipping changes
  useEffect(() => {
    async function updateTax() {
      if (shippingAddress.state && shippingAddress.zip && subtotal > 0) {
        setTaxCalculating(true);
        try {
          const response = await fetch('/api/tax/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: subtotal + shipping,
              shippingAddress: {
                address: shippingAddress.address,
                address2: shippingAddress.address2,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zip: shippingAddress.zip,
                country: shippingAddress.country,
              },
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setCalculatedTax(data.tax_amount || 0);
            setTaxRate(data.tax_rate || 0);
          } else {
            setCalculatedTax(0);
            setTaxRate(0);
          }
        } catch (error) {
          console.error('Tax calculation error:', error);
          setCalculatedTax(0);
          setTaxRate(0);
        } finally {
          setTaxCalculating(false);
        }
      } else {
        setCalculatedTax(0);
        setTaxRate(0);
      }
    }

    updateTax();
  }, [shippingAddress.state, shippingAddress.zip, subtotal, shipping]);

  function handlePaymentSuccess(token: PaymentToken) {
    setPaymentToken(token);
    setPaymentError(null);
  }

  function handlePaymentError(error: string) {
    setPaymentError(error);
    setPaymentToken(null);
  }

  async function handleCompleteOrder() {
    setError(null);

    // Validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    const required = ['first_name', 'last_name', 'address', 'city', 'state', 'zip', 'phone'];
    const missing = required.filter(field => !shippingAddress[field as keyof ShippingAddress]);
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(', ')}`);
      return;
    }

    if (paymentMethod === 'new' && !paymentToken) {
      setError('Please complete your payment information');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderResponse = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: user?.id,
          email: email,
          shipping_address: shippingAddress,
          shipping_method: selectedShippingMethod,
          items: items.map(item => ({
            product_id: item.id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price: item.price,
            title: item.title,
            variant_title: item.variant_title,
          })),
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total,
          status: 'pending_payment',
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        const fullError = errorData.details
          ? `${errorData.error}: ${errorData.details}`
          : errorData.error || 'Failed to create order';
        console.error('Order creation failed:', errorData);
        throw new Error(fullError);
      }

      const orderData = await orderResponse.json();
      const orderId = orderData.order.id;

      // Process payment
      if (paymentToken) {
        const paymentResponse = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderId,
            amount: total,
            paymentToken: paymentToken,
            customerId: user?.id,
            customerEmail: email,
            billingAddress: {
              firstName: shippingAddress.first_name,
              lastName: shippingAddress.last_name,
              address1: shippingAddress.address,
              address2: shippingAddress.address2,
              city: shippingAddress.city,
              state: shippingAddress.state,
              zip: shippingAddress.zip,
              country: shippingAddress.country,
            },
            shippingAddress: {
              firstName: shippingAddress.first_name,
              lastName: shippingAddress.last_name,
              address1: shippingAddress.address,
              address2: shippingAddress.address2,
              city: shippingAddress.city,
              state: shippingAddress.state,
              zip: shippingAddress.zip,
              country: shippingAddress.country,
            },
            taxAmount: tax,
            shippingAmount: shipping,
          }),
        });

        if (!paymentResponse.ok) {
          const paymentError = await paymentResponse.json();
          console.error('Payment API error:', paymentError);
          const errorMsg = paymentError.error || 'Payment declined. Please check your card details.';
          const errorDetails = paymentError.errors ? ` (${JSON.stringify(paymentError.errors)})` : '';
          throw new Error(errorMsg + errorDetails);
        }

        const paymentData = await paymentResponse.json();
        if (!paymentData.success) {
          throw new Error(paymentData.error || 'Payment failed');
        }
      }

      // Success! Clear cart and redirect
      clearCart();
      router.push(`/checkout/confirmation?orderId=${orderId}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to process order. Please try again.');
      setIsProcessing(false);
    }
  }

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
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-normal text-white" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Checkout
          </h1>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <section className="bg-red-50 border-b border-red-200 px-4 py-4">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <p className="text-sm text-red-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {error}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Single-Page Checkout */}
      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Main Checkout Form - 3 columns */}
            <div className="lg:col-span-3 space-y-6">
              {/* Cart Items */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Your Items
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.cart_key} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="relative h-20 w-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {item.title}
                        </h3>
                        {item.variant_title && (
                          <p className="text-sm text-gray-500">{item.variant_title}</p>
                        )}
                        <p className="text-sm font-bold text-[#a5b5eb]">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.cart_key, Math.max(1, item.quantity - 1))}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 border-x border-gray-300">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cart_key, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.cart_key)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact & Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Shipping Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.first_name}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, first_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.last_name}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, last_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apartment, suite (optional)</label>
                    <input
                      type="text"
                      value={shippingAddress.address2 || ''}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address2: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.zip}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Shipping Method
                </h2>
                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedShippingMethod === method.id
                          ? 'border-[#a5b5eb] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping_method"
                          value={method.id}
                          checked={selectedShippingMethod === method.id}
                          onChange={(e) => setSelectedShippingMethod(e.target.value)}
                          className="w-4 h-4 text-[#a5b5eb]"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.description}</div>
                          <div className="text-xs text-gray-400">{method.estimatedDays}</div>
                        </div>
                      </div>
                      <div className="font-bold text-gray-900">
                        {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Payment
                </h2>

                <PaymentForm
                  amount={total}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  billingAddress={{
                    firstName: shippingAddress.first_name,
                    lastName: shippingAddress.last_name,
                    address1: shippingAddress.address,
                    address2: shippingAddress.address2,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    zip: shippingAddress.zip,
                    country: shippingAddress.country,
                  }}
                  loading={isProcessing}
                />

                {paymentError && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-800">{paymentError}</p>
                  </div>
                )}
              </div>

              {/* Complete Order Button */}
              <button
                onClick={handleCompleteOrder}
                disabled={isProcessing || !paymentToken}
                className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {isProcessing ? 'Processing...' : `Complete Order - $${total.toFixed(2)}`}
              </button>
            </div>

            {/* Order Summary Sidebar - 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Order Summary
                </h2>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Tax {taxRate > 0 ? `(${(taxRate * 100).toFixed(2)}%)` : ''}
                      {taxCalculating && (
                        <span className="ml-2 text-xs text-gray-400">Calculating...</span>
                      )}
                    </span>
                    <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t-2 border-gray-300 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-[#a5b5eb]">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <div className="text-xs text-gray-600">
                      <p className="font-medium">Secure Checkout</p>
                      <p className="mt-1">Your payment is encrypted and secure</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
