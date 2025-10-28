'use client';

import { useState, useEffect } from 'react';
import type { ProductVariant, VariantOption, SelectedVariantOptions } from '@/types/product-variant';

interface VariantSelectorProps {
  productId: string;
  variants: ProductVariant[];
  onVariantChange: (variant: ProductVariant | null) => void;
  defaultVariantId?: string;
}

export default function VariantSelector({
  productId,
  variants,
  onVariantChange,
  defaultVariantId,
}: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedVariantOptions>({});
  const [availableOptions, setAvailableOptions] = useState<VariantOption[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // Extract unique options from variants
  useEffect(() => {
    if (!variants || variants.length === 0) return;

    const optionsMap: { [key: string]: Set<string> } = {};

    variants.forEach((variant) => {
      if (variant.option1_name && variant.option1_value) {
        if (!optionsMap[variant.option1_name]) {
          optionsMap[variant.option1_name] = new Set();
        }
        optionsMap[variant.option1_name].add(variant.option1_value);
      }

      if (variant.option2_name && variant.option2_value) {
        if (!optionsMap[variant.option2_name]) {
          optionsMap[variant.option2_name] = new Set();
        }
        optionsMap[variant.option2_name].add(variant.option2_value);
      }

      if (variant.option3_name && variant.option3_value) {
        if (!optionsMap[variant.option3_name]) {
          optionsMap[variant.option3_name] = new Set();
        }
        optionsMap[variant.option3_name].add(variant.option3_value);
      }
    });

    const options: VariantOption[] = Object.entries(optionsMap).map(([name, values]) => ({
      name,
      values: Array.from(values).sort(),
    }));

    setAvailableOptions(options);

    // Set default variant if provided
    if (defaultVariantId) {
      const defaultVar = variants.find((v) => v.id === defaultVariantId);
      if (defaultVar) {
        const initialOptions: SelectedVariantOptions = {};
        if (defaultVar.option1_name) initialOptions[defaultVar.option1_name] = defaultVar.option1_value!;
        if (defaultVar.option2_name) initialOptions[defaultVar.option2_name] = defaultVar.option2_value!;
        if (defaultVar.option3_name) initialOptions[defaultVar.option3_name] = defaultVar.option3_value!;
        setSelectedOptions(initialOptions);
      }
    } else if (options.length > 0 && variants.length > 0) {
      // Auto-select first available variant
      const firstVariant = variants[0];
      const initialOptions: SelectedVariantOptions = {};
      if (firstVariant.option1_name) initialOptions[firstVariant.option1_name] = firstVariant.option1_value!;
      if (firstVariant.option2_name) initialOptions[firstVariant.option2_name] = firstVariant.option2_value!;
      if (firstVariant.option3_name) initialOptions[firstVariant.option3_name] = firstVariant.option3_value!;
      setSelectedOptions(initialOptions);
    }
  }, [variants, defaultVariantId]);

  // Find matching variant when options change
  useEffect(() => {
    const matchedVariant = variants.find((variant) => {
      const option1Match = !variant.option1_name || selectedOptions[variant.option1_name] === variant.option1_value;
      const option2Match = !variant.option2_name || selectedOptions[variant.option2_name] === variant.option2_value;
      const option3Match = !variant.option3_name || selectedOptions[variant.option3_name] === variant.option3_value;
      return option1Match && option2Match && option3Match;
    });

    setSelectedVariant(matchedVariant || null);
    onVariantChange(matchedVariant || null);
  }, [selectedOptions, variants, onVariantChange]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  // Check if a specific option value is available given current selections
  const isOptionValueAvailable = (optionName: string, value: string): boolean => {
    const testOptions = { ...selectedOptions, [optionName]: value };

    return variants.some((variant) => {
      const option1Match = !variant.option1_name || testOptions[variant.option1_name] === variant.option1_value;
      const option2Match = !variant.option2_name || testOptions[variant.option2_name] === variant.option2_value;
      const option3Match = !variant.option3_name || testOptions[variant.option3_name] === variant.option3_value;
      return option1Match && option2Match && option3Match && variant.is_available;
    });
  };

  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {availableOptions.map((option) => (
        <div key={option.name}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {option.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const isAvailable = isOptionValueAvailable(option.name, value);

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleOptionChange(option.name, value)}
                  disabled={!isAvailable}
                  className={`
                    px-4 py-2 border rounded-md text-sm font-medium transition-all
                    ${isSelected
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : isAvailable
                      ? 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed line-through'
                    }
                  `}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Selected Variant Info */}
      {selectedVariant && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Selected:</p>
              <p className="font-medium text-gray-900">{selectedVariant.title}</p>
              <p className="text-xs text-gray-500 mt-1">SKU: {selectedVariant.sku}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">${selectedVariant.price.toFixed(2)}</p>
              {selectedVariant.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price && (
                <p className="text-sm text-gray-500 line-through">
                  ${selectedVariant.compare_at_price.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Stock Status */}
          {selectedVariant.track_inventory && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              {selectedVariant.inventory_quantity > 10 ? (
                <p className="text-sm text-green-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  In Stock
                </p>
              ) : selectedVariant.inventory_quantity > 0 ? (
                <p className="text-sm text-yellow-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Only {selectedVariant.inventory_quantity} left!
                </p>
              ) : (
                <p className="text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Out of Stock
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* No variant selected warning */}
      {!selectedVariant && availableOptions.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Please select all options to continue
          </p>
        </div>
      )}
    </div>
  );
}
