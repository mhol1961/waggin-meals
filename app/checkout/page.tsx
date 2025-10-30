'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PaymentForm from '@/components/payment-form';
import type { PaymentToken, BillingAddress } from '@/types/payment';

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

interface PaymentMethod {
  id: string;
  card_type?: string;
  last_four: string;
  expiration_month?: number;
  expiration_year?: number;
  is_default: boolean;
}

interface SubscriptionFrequency {
  [cart_key: string]: string; // cart_key -> frequency (weekly, bi-weekly, monthly)
}

type CheckoutStep = 'shipping' | 'payment' | 'review';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
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

  // Payment info
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(''); // 'new' or payment method id
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [paymentToken, setPaymentToken] = useState<PaymentToken | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Subscription frequencies for each subscription item
  const [subscriptionFrequencies, setSubscriptionFrequencies] = useState<SubscriptionFrequency>({});

  // Separate items into one-time and subscription
  const oneTimeItems = items.filter(item => !item.bundleDetails?.isSubscription);
  const subscriptionItems = items.filter(item => item.bundleDetails?.isSubscription);

  // Tax calculation state
  const [calculatedTax, setCalculatedTax] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [taxCalculating, setTaxCalculating] = useState(false);

  // Calculate totals
  const subtotal = totalPrice;
  const shipping = subtotal > 50 ? 0 : 12.99;
  const tax = calculatedTax; // Use calculated tax from API
  const total = subtotal + shipping + tax;

  // Load saved payment methods for authenticated users
  useEffect(() => {
    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  // Initialize subscription frequencies
  useEffect(() => {
    const initialFrequencies: SubscriptionFrequency = {};
    subscriptionItems.forEach(item => {
      initialFrequencies[item.cart_key] = item.bundleDetails?.frequency || 'monthly';
    });
    setSubscriptionFrequencies(initialFrequencies);
  }, [subscriptionItems.length]);

  // Calculate tax when shipping address changes
  useEffect(() => {
    async function updateTax() {
      // Only calculate tax if we have state and ZIP
      if (shippingAddress.state && shippingAddress.zip && subtotal > 0) {
        setTaxCalculating(true);
        try {
          const response = await fetch('/api/tax/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: subtotal,
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
            console.error('Failed to calculate tax');
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
        // Reset tax if address is incomplete
        setCalculatedTax(0);
        setTaxRate(0);
      }
    }

    updateTax();
  }, [shippingAddress.state, shippingAddress.zip, subtotal]);

  async function fetchPaymentMethods() {
    if (!user) return;

    setLoadingPaymentMethods(true);
    try {
      const response = await fetch('/api/payment-methods');
      if (response.ok) {
        const data = await response.json();
        setSavedPaymentMethods(data.payment_methods || []);

        // Auto-select default payment method
        const defaultMethod = data.payment_methods?.find((pm: PaymentMethod) => pm.is_default);
        if (defaultMethod) {
          setSelectedPaymentMethod(defaultMethod.id);
        }
      }
    } catch (err) {
      console.error('Error fetching payment methods:', err);
    } finally {
      setLoadingPaymentMethods(false);
    }
  }

  function validateShipping(): boolean {
    const required = ['first_name', 'last_name', 'address', 'city', 'state', 'zip', 'phone'];
    const missing = required.filter(field => !shippingAddress[field as keyof ShippingAddress]);

    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(', ')}`);
      return false;
    }

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  }

  function validatePayment(): boolean {
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return false;
    }

    if (selectedPaymentMethod === 'new') {
      // For new cards, payment token will be generated when clicking "Review Order"
      // Validation happens in the PaymentForm component
      if (!paymentToken) {
        setError('Please complete your payment information');
        return false;
      }
    }

    return true;
  }

  function handlePaymentSuccess(token: PaymentToken) {
    setPaymentToken(token);
    setPaymentError(null);
    // Automatically move to review step after successful tokenization
    setCurrentStep('review');
  }

  function handlePaymentError(error: string) {
    setPaymentError(error);
    setPaymentToken(null);
  }

  function handleNextStep() {
    setError(null);

    if (currentStep === 'shipping') {
      if (validateShipping()) {
        setCurrentStep('payment');
      }
    } else if (currentStep === 'payment') {
      // For saved payment methods, proceed directly to review
      if (selectedPaymentMethod !== 'new') {
        setCurrentStep('review');
      }
      // For new cards, the PaymentForm component handles the transition to review
      // via handlePaymentSuccess callback after tokenization
    }
  }

  function handlePrevStep() {
    setError(null);

    if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    }
  }

  async function handlePlaceOrder() {
    setIsProcessing(true);
    setError(null);

    try {
      let orderId: string | null = null;

      // Step 1: Create order with 'pending_payment' status
      if (oneTimeItems.length > 0) {
        const orderResponse = await fetch('/api/checkout/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_id: user?.id,
            email: email,
            shipping_address: shippingAddress,
            items: oneTimeItems.map(item => ({
              product_id: item.id,
              variant_id: item.variant_id,
              quantity: item.quantity,
              price: item.price,
              title: item.title,
              variant_title: item.variant_title,
            })),
            subtotal: oneTimeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            shipping: shipping,
            tax: tax,
            total: oneTimeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + shipping + tax,
            status: 'pending_payment', // Important: Don't complete order until payment succeeds
          }),
        });

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json();
          throw new Error(errorData.error || 'Failed to create order');
        }

        const orderData = await orderResponse.json();
        orderId = orderData.order.id;
      }

      // Step 2: Process payment through Authorize.net
      if (orderId && paymentToken) {
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
              address: shippingAddress.address,
              city: shippingAddress.city,
              state: shippingAddress.state,
              zip: shippingAddress.zip,
              country: shippingAddress.country,
            },
            shippingAddress: {
              firstName: shippingAddress.first_name,
              lastName: shippingAddress.last_name,
              address: shippingAddress.address,
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
          throw new Error(paymentError.error || 'Payment declined. Please check your card details and try again.');
        }

        const paymentData = await paymentResponse.json();
        if (!paymentData.success) {
          throw new Error(paymentData.error || 'Payment failed');
        }
      }

      // Step 3: Process subscriptions if there are subscription items
      if (subscriptionItems.length > 0) {
        for (const item of subscriptionItems) {
          const subscriptionResponse = await fetch('/api/checkout/create-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customer_id: user?.id,
              email: email,
              shipping_address: shippingAddress,
              payment_method_id: selectedPaymentMethod === 'new' ? null : selectedPaymentMethod,
              payment_token: selectedPaymentMethod === 'new' ? paymentToken : null,
              product_id: item.id,
              variant_id: item.variant_id,
              quantity: item.quantity,
              price: item.price,
              frequency: subscriptionFrequencies[item.cart_key] || 'monthly',
              title: item.title,
              variant_title: item.variant_title,
            }),
          });

          if (!subscriptionResponse.ok) {
            const errorData = await subscriptionResponse.json();
            throw new Error(errorData.error || 'Failed to create subscription');
          }
        }
      }

      // Success! Clear cart and redirect to confirmation
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

      {/* Progress Indicator */}
      <section className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-center gap-4">
            {/* Shipping */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === 'shipping' ? 'bg-[#a5b5eb] text-white' :
                currentStep === 'payment' || currentStep === 'review' ? 'bg-green-500 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {currentStep === 'payment' || currentStep === 'review' ? '✓' : '1'}
              </div>
              <span className={`text-sm font-medium ${
                currentStep === 'shipping' ? 'text-[#a5b5eb]' : 'text-gray-700'
              }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                Shipping
              </span>
            </div>

            <div className="w-12 h-0.5 bg-gray-300"></div>

            {/* Payment */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === 'payment' ? 'bg-[#a5b5eb] text-white' :
                currentStep === 'review' ? 'bg-green-500 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {currentStep === 'review' ? '✓' : '2'}
              </div>
              <span className={`text-sm font-medium ${
                currentStep === 'payment' ? 'text-[#a5b5eb]' : 'text-gray-700'
              }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                Payment
              </span>
            </div>

            <div className="w-12 h-0.5 bg-gray-300"></div>

            {/* Review */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === 'review' ? 'bg-[#a5b5eb] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <span className={`text-sm font-medium ${
                currentStep === 'review' ? 'text-[#a5b5eb]' : 'text-gray-700'
              }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                Review
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <section className="bg-red-50 border-b border-red-200 px-4 py-4">
          <div className="mx-auto max-w-6xl">
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

      {/* Checkout Form */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Step */}
              {currentStep === 'shipping' && (
                <>
                  {/* Contact Information */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                      Contact Information
                    </h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!!user}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent disabled:bg-gray-100"
                        placeholder="you@example.com"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                      {user && (
                        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Using email from your account
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                      Shipping Address
                    </h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            First Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={shippingAddress.first_name}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, first_name: e.target.value })}
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
                            value={shippingAddress.last_name}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, last_name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Street Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.address}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Apartment, suite, etc. (optional)
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.address2 || ''}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, address2: e.target.value })}
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
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
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
                            value={shippingAddress.state}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            required
                            value={shippingAddress.zip}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Phone *
                          </label>
                          <input
                            type="tel"
                            required
                            value={shippingAddress.phone}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            placeholder="(555) 123-4567"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNextStep}
                      className="bg-[#a5b5eb] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#8a9fd9] transition-colors"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Continue to Payment
                    </button>
                  </div>
                </>
              )}

              {/* Payment Step */}
              {currentStep === 'payment' && (
                <>
                  {/* Payment Method Selection */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                      Payment Method
                    </h2>

                    {loadingPaymentMethods ? (
                      <div className="text-center py-8">
                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#a5b5eb] border-r-transparent"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading payment methods...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Saved Payment Methods */}
                        {savedPaymentMethods.map((method) => (
                          <label
                            key={method.id}
                            className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              selectedPaymentMethod === method.id
                                ? 'border-[#a5b5eb] bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment_method"
                              value={method.id}
                              checked={selectedPaymentMethod === method.id}
                              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                              className="w-4 h-4 text-[#a5b5eb]"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                  {method.card_type} •••• {method.last_four}
                                </span>
                                {method.is_default && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Default</span>
                                )}
                              </div>
                              {method.expiration_month && method.expiration_year && (
                                <p className="text-sm text-gray-500">
                                  Expires {method.expiration_month}/{method.expiration_year}
                                </p>
                              )}
                            </div>
                          </label>
                        ))}

                        {/* New Card Option */}
                        <label
                          className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            selectedPaymentMethod === 'new'
                              ? 'border-[#a5b5eb] bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment_method"
                            value="new"
                            checked={selectedPaymentMethod === 'new'}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-[#a5b5eb]"
                          />
                          <span className="font-medium text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Use a new card
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Payment Form - PCI Compliant */}
                  {selectedPaymentMethod === 'new' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <PaymentForm
                        amount={total}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        billingAddress={{
                          firstName: shippingAddress.first_name,
                          lastName: shippingAddress.last_name,
                          address: shippingAddress.address,
                          city: shippingAddress.city,
                          state: shippingAddress.state,
                          zip: shippingAddress.zip,
                          country: shippingAddress.country,
                        }}
                        loading={isProcessing}
                      />
                      {paymentError && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                          <p className="text-sm text-red-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {paymentError}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Subscription Frequencies */}
                  {subscriptionItems.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Subscription Delivery Frequency
                      </h3>
                      <div className="space-y-4">
                        {subscriptionItems.map((item) => (
                          <div key={item.cart_key} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                {item.title}
                              </p>
                              {item.variant_title && (
                                <p className="text-sm text-gray-500">{item.variant_title}</p>
                              )}
                            </div>
                            <select
                              value={subscriptionFrequencies[item.cart_key] || 'monthly'}
                              onChange={(e) => setSubscriptionFrequencies({
                                ...subscriptionFrequencies,
                                [item.cart_key]: e.target.value
                              })}
                              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              <option value="weekly">Weekly</option>
                              <option value="bi-weekly">Bi-weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons - Only show "Review Order" for saved payment methods */}
                  {/* For new cards, the PaymentForm component has its own "Pay $XX.XX" button */}
                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevStep}
                      className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Back to Shipping
                    </button>
                    {selectedPaymentMethod !== 'new' && (
                      <button
                        onClick={handleNextStep}
                        className="bg-[#a5b5eb] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#8a9fd9] transition-colors"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Review Order
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Review Step */}
              {currentStep === 'review' && (
                <>
                  {/* Review Sections */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                        Review Your Order
                      </h2>
                    </div>

                    {/* Shipping Info */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Shipping Address
                        </h3>
                        <button
                          onClick={() => setCurrentStep('shipping')}
                          className="text-sm text-[#a5b5eb] hover:underline"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Edit
                        </button>
                      </div>
                      <div className="text-sm text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <p>{shippingAddress.first_name} {shippingAddress.last_name}</p>
                        <p>{shippingAddress.address}</p>
                        {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
                        <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
                        <p>{shippingAddress.phone}</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Payment Method
                        </h3>
                        <button
                          onClick={() => setCurrentStep('payment')}
                          className="text-sm text-[#a5b5eb] hover:underline"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Edit
                        </button>
                      </div>
                      <div className="text-sm text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {selectedPaymentMethod === 'new' ? (
                          <div>
                            <p className="font-medium text-green-700">✓ Payment information verified</p>
                            <p className="text-xs text-gray-500 mt-1">Your card will be charged ${total.toFixed(2)} when you place your order</p>
                          </div>
                        ) : (
                          <p>
                            {savedPaymentMethods.find(pm => pm.id === selectedPaymentMethod)?.card_type} ••••{' '}
                            {savedPaymentMethods.find(pm => pm.id === selectedPaymentMethod)?.last_four}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Order Items
                      </h3>
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div key={item.cart_key} className="flex gap-4">
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
                              <h4 className="font-medium text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                {item.title}
                              </h4>
                              {item.variant_title && (
                                <p className="text-sm text-gray-500">{item.variant_title}</p>
                              )}
                              {item.bundleDetails?.isSubscription && (
                                <p className="text-sm text-[#a5b5eb] font-medium">
                                  Subscription - {subscriptionFrequencies[item.cart_key] || 'monthly'}
                                </p>
                              )}
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevStep}
                      className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Back to Payment
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="bg-[#a5b5eb] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#8a9fd9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.cart_key} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 bg-[#f8f9fa] rounded-lg overflow-hidden">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-[#3c3a47] truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {item.title}
                        </h3>
                        {item.variant_title && (
                          <p className="text-xs text-gray-500">{item.variant_title}</p>
                        )}
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
                    <span className="text-[#666666]">
                      Tax {taxRate > 0 ? `(${(taxRate * 100).toFixed(2)}%)` : '(estimated)'}
                      {taxCalculating && (
                        <span className="ml-2 text-xs text-gray-400">Calculating...</span>
                      )}
                    </span>
                    <span className="font-medium text-[#3c3a47]">${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t-2 border-gray-300 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Total
                    </span>
                    <span className="text-2xl font-bold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#999999] text-center mt-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Free shipping on orders over $50
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
