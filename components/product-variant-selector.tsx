'use client';

import { useState } from 'react';
import { ProductVariant, calculateSavings, calculateSavingsPercentage } from '@/types/product';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  onVariantChange: (variant: ProductVariant) => void;
}

export function ProductVariantSelector({ variants, onVariantChange }: ProductVariantSelectorProps) {
  // Find default variant or use first variant
  const defaultVariant = variants.find(v => v.isDefault) || variants[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    onVariantChange(variant);
  };

  if (!variants || variants.length === 0) {
    return null;
  }

  // If only one variant, show simplified view
  if (variants.length === 1) {
    const variant = variants[0];
    const savings = calculateSavings(variant);

    return (
      <div className="bg-[#f8f9fa] rounded-lg p-4 border-2 border-[#8FAE8F]">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {variant.title}
            </p>
            <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {variant.servings} cups • {variant.weight}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#8FAE8F]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              ${variant.price.toFixed(2)}
            </p>
            {savings > 0 && (
              <p className="text-sm text-[#999999] line-through" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ${variant.compareAtPrice?.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Multiple variants - show selector
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Choose Size:
        </label>

        <div className="grid grid-cols-1 gap-3">
          {variants.map((variant) => {
            const isSelected = selectedVariant.id === variant.id;
            const savings = calculateSavings(variant);
            const savingsPercent = calculateSavingsPercentage(variant);
            const isOutOfStock = !variant.inStock;

            return (
              <button
                key={variant.id}
                onClick={() => !isOutOfStock && handleVariantChange(variant)}
                disabled={isOutOfStock}
                className={`relative w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-[#8FAE8F] bg-[#e8f4fb]'
                    : isOutOfStock
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    : 'border-gray-200 hover:border-[#8FAE8F] bg-white'
                }`}
              >
                {/* Out of Stock Badge */}
                {isOutOfStock && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Out of Stock
                  </div>
                )}

                {/* Best Value Badge */}
                {variant.isDefault && !isOutOfStock && (
                  <div className="absolute top-2 right-2 bg-[#ffc107] text-[#856404] text-xs px-2 py-1 rounded-full font-semibold">
                    Best Value
                  </div>
                )}

                <div className="flex justify-between items-start pr-20">
                  {/* Variant Info */}
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
                      <p className="text-lg font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {variant.title}
                      </p>
                    </div>

                    <p className="text-sm text-[#666666] ml-7" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {variant.servings} cups • {variant.weight}
                    </p>

                    {variant.inStock && variant.stockQty < 10 && (
                      <p className="text-xs text-orange-600 ml-7 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Only {variant.stockQty} left in stock!
                      </p>
                    )}
                  </div>

                  {/* Price Info */}
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${isSelected ? 'text-[#8FAE8F]' : 'text-[#3c3a47]'}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                      ${variant.price.toFixed(2)}
                    </p>
                    {savings > 0 && (
                      <div className="flex flex-col items-end">
                        <p className="text-sm text-[#999999] line-through" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          ${variant.compareAtPrice?.toFixed(2)}
                        </p>
                        <p className="text-xs text-green-600 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Save {savingsPercent}%
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-[#666666] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      ${(variant.price / variant.servings).toFixed(2)}/cup
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Variant Summary */}
      <div className="bg-[#e8f4fb] rounded-lg p-4 border-l-4 border-[#8FAE8F]">
        <p className="text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Selected: {selectedVariant.title}
        </p>
        <div className="flex justify-between items-center text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <span>{selectedVariant.servings} cups ({selectedVariant.weight})</span>
          <span className="font-semibold text-[#8FAE8F]">${selectedVariant.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
