'use client';

import { useState, useEffect } from 'react';
import {
  calculateShipping,
  formatShippingPrice,
  ShippingAddress,
  ShippingMethod,
  FREE_SHIPPING_THRESHOLD,
} from '@/types/shipping';

interface ShippingCalculatorProps {
  subtotal: number;
  totalWeight: number;
  onShippingMethodSelect?: (method: ShippingMethod) => void;
  initialAddress?: Partial<ShippingAddress>;
}

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

export function ShippingCalculator({
  subtotal,
  totalWeight,
  onShippingMethodSelect,
  initialAddress,
}: ShippingCalculatorProps) {
  const [address, setAddress] = useState<ShippingAddress>({
    street: initialAddress?.street || '',
    city: initialAddress?.city || '',
    state: initialAddress?.state || 'NC',
    zipCode: initialAddress?.zipCode || '',
    country: 'US',
  });

  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // Calculate shipping whenever address or cart changes
  const shippingCalc = calculateShipping(subtotal, totalWeight, address);

  useEffect(() => {
    // Auto-select cheapest method
    if (shippingCalc.availableMethods.length > 0 && !selectedMethod) {
      const cheapest = shippingCalc.availableMethods.reduce((prev, current) =>
        prev.price < current.price ? prev : current
      );
      setSelectedMethod(cheapest.id);
      if (onShippingMethodSelect) {
        onShippingMethodSelect(cheapest);
      }
    }
  }, [shippingCalc.availableMethods, selectedMethod, onShippingMethodSelect]);

  const handleMethodSelect = (method: ShippingMethod) => {
    setSelectedMethod(method.id);
    if (onShippingMethodSelect) {
      onShippingMethodSelect(method);
    }
  };

  return (
    <div className="space-y-4">
      {/* Free Shipping Progress Bar */}
      {!shippingCalc.qualifiesForFreeShipping && (
        <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-[#856404]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {shippingCalc.amountUntilFreeShipping > 0
                ? `Add $${shippingCalc.amountUntilFreeShipping.toFixed(2)} more for FREE SHIPPING!`
                : 'You qualify for FREE SHIPPING!'}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#8FAE8F] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {shippingCalc.qualifiesForFreeShipping && (
        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-semibold text-green-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Congratulations! You qualify for FREE SHIPPING! 🎉
            </p>
          </div>
        </div>
      )}

      {/* Shipping Methods */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Shipping Options
        </h3>

        {shippingCalc.availableMethods.map((method) => {
          const isSelected = selectedMethod === method.id;

          return (
            <button
              key={method.id}
              onClick={() => handleMethodSelect(method)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-[#8FAE8F] bg-[#e8f4fb]'
                  : 'border-gray-200 bg-white hover:border-[#8FAE8F]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-[#8FAE8F] bg-[#8FAE8F]' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-base font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {method.name}
                    </p>
                  </div>

                  <p className="text-sm text-[#666666] ml-7" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {method.description}
                  </p>

                  <p className="text-xs text-[#999999] ml-7 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Estimated delivery: {method.estimatedDays}
                  </p>
                </div>

                <div className="text-right ml-4">
                  <p className={`text-xl font-bold ${method.isFree ? 'text-green-600' : 'text-[#3c3a47]'}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {formatShippingPrice(method.price, method.isFree)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Calculate Shipping for Different Address */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="text-[#8FAE8F] hover:text-[#6d8c6d] font-semibold text-sm flex items-center gap-2"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <svg className={`w-4 h-4 transition-transform ${showCalculator ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Calculate shipping for a different address
        </button>

        {showCalculator && (
          <div className="mt-4 space-y-3 bg-[#f8f9fa] p-4 rounded-lg">
            <div>
              <label className="block text-sm font-semibold text-[#3c3a47] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                City
              </label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FAE8F] focus:border-transparent"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                placeholder="Enter city"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-[#3c3a47] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  State
                </label>
                <select
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FAE8F] focus:border-transparent"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {US_STATES.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3c3a47] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FAE8F] focus:border-transparent"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  placeholder="ZIP"
                  maxLength={5}
                />
              </div>
            </div>

            <p className="text-xs text-[#666666] mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Shipping costs will update automatically based on your location.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
