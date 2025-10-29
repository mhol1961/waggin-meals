'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';

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
  estimatedDays: string;
  price: number;
  isFree: boolean;
}

interface PaymentMethod {
  id: string;
  card_type?: string;
  last_four: string;
  expiration_month?: number;
  expiration_year?: number;
  is_default: boolean;
}

type CheckoutStep = 'contact' | 'shipping' | 'payment';

export default function NewCheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('contact');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Contact info
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [smsVerified, setSmsVerified] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);

  // Shipping info
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

  // Shipping calculation
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);

  // Payment info
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);

  // New card info
  const [newCard, setNewCard] = useState({
    card_number: '',
    expiration_month: '',
    expiration_year: '',
    cvv: '',
    card_type: '',
    billing_same_as_shipping: true,
    billing_address: {
      first_name: '',
      last_name: '',
      address: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: 'US',
    },
  });

  // Calculate totals
  const subtotal = totalPrice;
  const tax = subtotal * 0.08; // 8% placeholder
  const total = subtotal + shippingCost + tax;

  // Debounced shipping calculation
  const calculateShippingRates = useCallback(
    debounce(async (address: ShippingAddress) => {
      if (!address.state || !address.zip) return;

      setLoadingShipping(true);
      try {
        const response = await fetch('/api/shipping/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subtotal,
            items: items.map(item => ({
              weight: item.weight,
              quantity: item.quantity,
            })),
            address: {
              street: address.address,
              city: address.city,
              state: address.state,
              zipCode: address.zip,
              country: address.country,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setShippingMethods(data.calculation.availableMethods);

          // Auto-select cheapest method (excluding pickup)
          const shippingOptions = data.calculation.availableMethods.filter(
            (m: ShippingMethod) => m.id !== 'local-pickup'
          );
          if (shippingOptions.length > 0) {
            const cheapest = shippingOptions.reduce((prev: ShippingMethod, curr: ShippingMethod) =>
              prev.price < curr.price ? prev : curr
            );
            setSelectedShippingMethod(cheapest.id);
            setShippingCost(cheapest.price);
          }
        }
      } catch (err) {
        console.error('Error calculating shipping:', err);
      } finally {
        setLoadingShipping(false);
      }
    }, 800),
    [subtotal, items]
  );

  // Update shipping when address changes
  useEffect(() => {
    if (shippingAddress.state && shippingAddress.zip) {
      calculateShippingRates(shippingAddress);
    }
  }, [shippingAddress.state, shippingAddress.zip, calculateShippingRates]);

  // Update shipping cost when method changes
  useEffect(() => {
    const selected = shippingMethods.find(m => m.id === selectedShippingMethod);
    if (selected) {
      setShippingCost(selected.price);
    }
  }, [selectedShippingMethod, shippingMethods]);

  // Load saved payment methods
  useEffect(() => {
    if (user && currentStep === 'payment') {
      fetchPaymentMethods();
    }
  }, [user, currentStep]);

  async function fetchPaymentMethods() {
    if (!user) return;

    setLoadingPaymentMethods(true);
    try {
      const response = await fetch('/api/payment-methods');
      if (response.ok) {
        const data = await response.json();
        setSavedPaymentMethods(data.payment_methods || []);

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

  async function handleSendSMS() {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setSendingSms(true);
    setError(null);

    try {
      // TODO: Implement SMS sending via Twilio
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSmsSent(true);
      setError(null);
    } catch (err) {
      setError('Failed to send SMS. Please try again.');
    } finally {
      setSendingSms(false);
    }
  }

  async function handleVerifySMS() {
    if (smsCode.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // TODO: Implement SMS verification
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 500));
      setSmsVerified(true);
      setError(null);
    } catch (err) {
      setError('Invalid verification code');
    } finally {
      setIsProcessing(false);
    }
  }

  function validateContact(): boolean {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }

    // For now, skip SMS verification in development
    // if (!smsVerified) {
    //   setError('Please verify your phone number');
    //   return false;
    // }

    return true;
  }

  function validateShipping(): boolean {
    const required = ['first_name', 'last_name', 'address', 'city', 'state', 'zip'];
    const missing = required.filter(field => !shippingAddress[field as keyof ShippingAddress]);

    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(', ').replace(/_/g, ' ')}`);
      return false;
    }

    if (!selectedShippingMethod) {
      setError('Please select a shipping method');
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
      const requiredCardFields = ['card_number', 'expiration_month', 'expiration_year', 'cvv'];
      const missing = requiredCardFields.filter(field => !newCard[field as keyof typeof newCard]);

      if (missing.length > 0) {
        setError('Please fill in all card information');
        return false;
      }

      const cardNumber = newCard.card_number.replace(/\s/g, '');
      if (cardNumber.length < 13 || cardNumber.length > 19) {
        setError('Invalid card number');
        return false;
      }
    }

    return true;
  }

  function handleNextStep() {
    setError(null);

    if (currentStep === 'contact') {
      if (validateContact()) {
        // Copy phone to shipping address
        setShippingAddress({ ...shippingAddress, phone });
        setCurrentStep('shipping');
      }
    } else if (currentStep === 'shipping') {
      if (validateShipping()) {
        setCurrentStep('payment');
      }
    }
  }

  function handlePrevStep() {
    setError(null);

    if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else if (currentStep === 'shipping') {
      setCurrentStep('contact');
    }
  }

  async function handlePlaceOrder() {
    if (!validatePayment()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const orderResponse = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: user?.id,
          email,
          shipping_address: shippingAddress,
          payment_method_id: selectedPaymentMethod === 'new' ? null : selectedPaymentMethod,
          new_card: selectedPaymentMethod === 'new' ? {
            ...newCard,
            billing_address: newCard.billing_same_as_shipping ? shippingAddress : newCard.billing_address,
          } : null,
          items: items.map(item => ({
            product_id: item.id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price: item.price,
            title: item.title,
            variant_title: item.variant_title,
          })),
          subtotal,
          shipping: shippingCost,
          tax,
          total,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      clearCart();
      router.push('/checkout/confirmation');
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
      {/* Clean white header */}
      <section className="bg-white border-b border-gray-200 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-normal text-[#3c3a47] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Secure Checkout
          </h1>
          <p className="text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Complete your order in just 3 easy steps
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="bg-gray-50 border-b border-gray-200 px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-center gap-4">
            {/* Step 1: Contact */}
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === 'contact' ? 'bg-[#a5b5eb] text-white ring-4 ring-blue-100' :
                currentStep === 'shipping' || currentStep === 'payment' ? 'bg-green-500 text-white' :
                'bg-white border-2 border-gray-300 text-gray-500'
              }`}>
                {currentStep === 'shipping' || currentStep === 'payment' ? '✓' : '1'}
              </div>
              <span className={`text-sm font-medium hidden sm:inline ${
                currentStep === 'contact' ? 'text-[#a5b5eb]' : 'text-gray-700'
              }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                Contact
              </span>
            </div>

            <div className="w-16 h-0.5 bg-gray-300"></div>

            {/* Step 2: Shipping */}
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === 'shipping' ? 'bg-[#a5b5eb] text-white ring-4 ring-blue-100' :
                currentStep === 'payment' ? 'bg-green-500 text-white' :
                'bg-white border-2 border-gray-300 text-gray-500'
              }`}>
                {currentStep === 'payment' ? '✓' : '2'}
              </div>
              <span className={`text-sm font-medium hidden sm:inline ${
                currentStep === 'shipping' ? 'text-[#a5b5eb]' : 'text-gray-700'
              }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                Shipping
              </span>
            </div>

            <div className="w-16 h-0.5 bg-gray-300"></div>

            {/* Step 3: Payment */}
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === 'payment' ? 'bg-[#a5b5eb] text-white ring-4 ring-blue-100' :
                'bg-white border-2 border-gray-300 text-gray-500'
              }`}>
                3
              </div>
              <span className={`text-sm font-medium hidden sm:inline ${
                currentStep === 'payment' ? 'text-[#a5b5eb]' : 'text-gray-700'
              }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                Payment
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
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {error}
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="px-4 py-12 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {/* Step 1: Contact Information */}
              {currentStep === 'contact' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Contact Information
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!!user}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent disabled:bg-gray-100 text-base"
                        placeholder="you@example.com"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                      {user && (
                        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Using email from your account
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent text-base"
                        placeholder="(555) 123-4567"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                      <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        We'll send order updates via SMS
                      </p>
                    </div>

                    {/* SMS Verification (Optional - can be enabled later) */}
                    {false && (
                      <div className="border-t pt-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Verify Your Phone Number
                        </h3>

                        {!smsSent ? (
                          <button
                            onClick={handleSendSMS}
                            disabled={sendingSms || !phone}
                            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {sendingSms ? 'Sending...' : 'Send Verification Code'}
                          </button>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                Enter 6-Digit Code
                              </label>
                              <input
                                type="text"
                                value={smsCode}
                                onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent text-center text-2xl tracking-widest"
                                placeholder="000000"
                                maxLength={6}
                              />
                            </div>
                            <button
                              onClick={handleVerifySMS}
                              disabled={isProcessing || smsCode.length !== 6}
                              className="w-full bg-[#a5b5eb] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#8a9fd9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              {isProcessing ? 'Verifying...' : 'Verify Code'}
                            </button>
                            <button
                              onClick={handleSendSMS}
                              disabled={sendingSms}
                              className="w-full text-sm text-[#a5b5eb] hover:underline"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              Resend Code
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleNextStep}
                      className="bg-[#a5b5eb] text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-sm"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Continue to Shipping →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Address - Will continue in next part */}
              {currentStep === 'shipping' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                      Shipping Address
                    </h2>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                          <input
                            type="text"
                            required
                            value={shippingAddress.first_name}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, first_name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                          <input
                            type="text"
                            required
                            value={shippingAddress.last_name}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, last_name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.address}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Apartment, suite, etc. (optional)</label>
                        <input
                          type="text"
                          value={shippingAddress.address2 || ''}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, address2: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                          <input
                            type="text"
                            required
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                          <input
                            type="text"
                            required
                            value={shippingAddress.state}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value.toUpperCase() })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent uppercase"
                            maxLength={2}
                            placeholder="NC"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.zip}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                          placeholder="28801"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Real-time Shipping Preview */}
                  {shippingMethods.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                      <h3 className="text-xl font-semibold text-[#3c3a47] mb-4">Shipping Method</h3>

                      {loadingShipping ? (
                        <div className="text-center py-8">
                          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#a5b5eb] border-r-transparent"></div>
                          <p className="mt-3 text-sm text-gray-500">Calculating shipping rates...</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {shippingMethods.map((method) => (
                            <label
                              key={method.id}
                              className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all ${
                                selectedShippingMethod === method.id
                                  ? 'border-[#a5b5eb] bg-blue-50 shadow-sm'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <input
                                  type="radio"
                                  name="shipping_method"
                                  value={method.id}
                                  checked={selectedShippingMethod === method.id}
                                  onChange={(e) => setSelectedShippingMethod(e.target.value)}
                                  className="w-5 h-5 text-[#a5b5eb]"
                                />
                                <div>
                                  <div className="font-semibold text-gray-900">{method.name}</div>
                                  <div className="text-sm text-gray-500">{method.description}</div>
                                  <div className="text-xs text-gray-400 mt-1">{method.estimatedDays}</div>
                                </div>
                              </div>
                              <div className="text-xl font-bold text-[#a5b5eb]">
                                {method.isFree || method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevStep}
                      className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="bg-[#a5b5eb] text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-sm"
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment - Placeholder */}
              {currentStep === 'payment' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-semibold text-[#3c3a47] mb-6">Payment Method</h2>
                  <p className="text-gray-600 mb-8">Payment form will go here...</p>

                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevStep}
                      className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="bg-green-500 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-green-600 transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-[#3c3a47] mb-6">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.cart_key} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
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
                        <h3 className="text-sm font-medium text-gray-900 truncate">{item.title}</h3>
                        {item.variant_title && <p className="text-xs text-gray-500">{item.variant_title}</p>}
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-[#a5b5eb]">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">
                      {loadingShipping ? (
                        <span className="text-gray-400">Calculating...</span>
                      ) : shippingCost === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (estimated)</span>
                    <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t-2 border-gray-300 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-[#a5b5eb]">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {subtotal < 165 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-800 font-medium mb-2">
                      Add ${(165 - subtotal).toFixed(2)} more for FREE shipping!
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((subtotal / 165) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                    <span>Encrypted Payment</span>
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
