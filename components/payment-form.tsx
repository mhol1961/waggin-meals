'use client';

import { useState, useEffect, useRef } from 'react';
import { detectCardType, validateCardNumber, validateExpirationDate, validateCVV } from '@/lib/authorize-net';
import type { CardType, PaymentToken, BillingAddress } from '@/types/payment';

// Accept.js types
declare global {
  interface Window {
    Accept: {
      dispatchData: (secureData: any, responseHandler: (response: any) => void) => void;
    };
  }
}

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentToken: PaymentToken) => void;
  onError: (error: string) => void;
  billingAddress?: BillingAddress;
  loading?: boolean;
}

export default function PaymentForm({
  amount,
  onSuccess,
  onError,
  billingAddress,
  loading = false,
}: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expirationMonth, setExpirationMonth] = useState('');
  const [expirationYear, setExpirationYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState<CardType>('other');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptJsLoaded, setAcceptJsLoaded] = useState(false);

  const clientKey = process.env.NEXT_PUBLIC_AUTHORIZENET_PUBLIC_CLIENT_KEY || '';

  // Load Accept.js script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Accept) {
      const script = document.createElement('script');
      script.src = process.env.NEXT_PUBLIC_AUTHORIZENET_ENVIRONMENT === 'production'
        ? 'https://js.authorize.net/v1/Accept.js'
        : 'https://jstest.authorize.net/v1/Accept.js';
      script.async = true;
      script.onload = () => setAcceptJsLoaded(true);
      script.onerror = () => {
        onError('Failed to load payment processor. Please refresh the page.');
      };
      document.body.appendChild(script);
    } else if (window.Accept) {
      setAcceptJsLoaded(true);
    }
  }, [onError]);

  // Update card type as user types
  useEffect(() => {
    if (cardNumber.length >= 2) {
      const detected = detectCardType(cardNumber);
      setCardType(detected);
    }
  }, [cardNumber]);

  // Format card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');

    // Limit length based on card type
    const maxLength = cardType === 'amex' ? 15 : 16;
    value = value.substring(0, maxLength);

    // Add spaces every 4 digits
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);

    // Clear error when user starts typing
    if (errors.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: '' }));
    }
  };

  const handleExpirationMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExpirationMonth(e.target.value);
    if (errors.expiration) {
      setErrors(prev => ({ ...prev, expiration: '' }));
    }
  };

  const handleExpirationYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExpirationYear(e.target.value);
    if (errors.expiration) {
      setErrors(prev => ({ ...prev, expiration: '' }));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const maxLength = cardType === 'amex' ? 4 : 3;
    setCvv(value.substring(0, maxLength));

    if (errors.cvv) {
      setErrors(prev => ({ ...prev, cvv: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate card number
    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    if (!validateCardNumber(cleanedCardNumber)) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Validate expiration
    if (!expirationMonth || !expirationYear) {
      newErrors.expiration = 'Expiration date is required';
    } else if (!validateExpirationDate(expirationMonth, expirationYear)) {
      newErrors.expiration = 'Card has expired or invalid date';
    }

    // Validate CVV
    if (!cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!validateCVV(cvv, cardType)) {
      const expectedLength = cardType === 'amex' ? 4 : 3;
      newErrors.cvv = `CVV must be ${expectedLength} digits`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!acceptJsLoaded || !window.Accept) {
      onError('Payment processor not loaded. Please refresh the page.');
      return;
    }

    setIsProcessing(true);

    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    const fullYear = expirationYear.length === 2 ? `20${expirationYear}` : expirationYear;

    const secureData = {
      authData: {
        clientKey: clientKey,
        apiLoginID: process.env.NEXT_PUBLIC_AUTHORIZENET_API_LOGIN_ID || '',
      },
      cardData: {
        cardNumber: cleanedCardNumber,
        month: expirationMonth,
        year: fullYear,
        cardCode: cvv,
      },
    };

    // Call Accept.js to tokenize the card
    window.Accept.dispatchData(secureData, (response: any) => {
      setIsProcessing(false);

      if (response.messages.resultCode === 'Error') {
        const errorMessage = response.messages.message
          .map((msg: any) => msg.text)
          .join(', ');
        onError(errorMessage || 'Failed to process payment information');
        return;
      }

      // Success - return token to parent
      const paymentToken: PaymentToken = {
        opaqueData: {
          dataDescriptor: response.opaqueData.dataDescriptor,
          dataValue: response.opaqueData.dataValue,
        },
      };

      onSuccess(paymentToken);
    });
  };

  // Generate month options
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return { value: month, label: month };
  });

  // Generate year options (current year + 20 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => {
    const year = currentYear + i;
    return { value: year.toString(), label: year.toString() };
  });

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return '💳 Visa';
      case 'mastercard':
        return '💳 Mastercard';
      case 'amex':
        return '💳 Amex';
      case 'discover':
        return '💳 Discover';
      default:
        return '💳';
    }
  };

  const isFormDisabled = loading || isProcessing || !acceptJsLoaded;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Information
        </h3>

        {!acceptJsLoaded && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
            Loading secure payment processor...
          </div>
        )}

        {/* Card Number */}
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Card Number {cardType !== 'other' && <span className="text-gray-500">({getCardIcon()})</span>}
          </label>
          <input
            id="cardNumber"
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            disabled={isFormDisabled}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.cardNumber ? 'border-red-300' : 'border-gray-300'
            }`}
            autoComplete="cc-number"
            required
          />
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
          )}
        </div>

        {/* Expiration Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expirationMonth" className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              id="expirationMonth"
              value={expirationMonth}
              onChange={handleExpirationMonthChange}
              disabled={isFormDisabled}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.expiration ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option value="">MM</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="expirationYear" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              id="expirationYear"
              value={expirationYear}
              onChange={handleExpirationYearChange}
              disabled={isFormDisabled}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.expiration ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option value="">YYYY</option>
              {years.map(year => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>

          {errors.expiration && (
            <p className="col-span-2 text-sm text-red-600">{errors.expiration}</p>
          )}
        </div>

        {/* CVV */}
        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
            CVV {cardType === 'amex' ? '(4 digits)' : '(3 digits)'}
          </label>
          <input
            id="cvv"
            type="text"
            inputMode="numeric"
            value={cvv}
            onChange={handleCvvChange}
            placeholder={cardType === 'amex' ? '1234' : '123'}
            disabled={isFormDisabled}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.cvv ? 'border-red-300' : 'border-gray-300'
            }`}
            autoComplete="cc-csc"
            required
          />
          {errors.cvv && (
            <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {cardType === 'amex'
              ? '4-digit code on front of card'
              : '3-digit code on back of card'}
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <div className="text-xs text-gray-600">
              <p className="font-medium">Secure Payment</p>
              <p className="mt-1">Your payment information is encrypted and never stored on our servers. Processed securely by Authorize.net.</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isFormDisabled}
          className="w-full bg-[#a5b5eb] hover:bg-[#8fa3e3] text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Validating Card...' : 'Validate Payment Method'}
        </button>

      </div>

      {/* Accepted Cards */}
      <div className="text-center text-sm text-gray-500">
        We accept Visa, Mastercard, American Express, and Discover
      </div>
    </form>
  );
}
