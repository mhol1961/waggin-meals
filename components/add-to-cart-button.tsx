'use client';

import { useCart } from '@/contexts/cart-context';
import { useState } from 'react';

interface AddToCartButtonProps {
  product: {
    id: string;
    handle: string;
    title: string;
    price: number;
    images: string[];
    weight?: string;
  };
  selectedVariant?: {
    variant_id: string;
    variant_title: string;
    sku: string;
    price: number;
  } | null;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function AddToCartButton({ product, selectedVariant, disabled = false, variant = 'primary', className = '' }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);

    // Build cart item with variant support
    const cartItem: any = {
      id: product.id,
      handle: product.handle,
      title: product.title,
      price: selectedVariant ? selectedVariant.price : product.price,
      image: product.images[0],
      weight: product.weight,
    };

    // Add variant fields if variant is selected
    if (selectedVariant) {
      cartItem.variant_id = selectedVariant.variant_id;
      cartItem.variant_title = selectedVariant.variant_title;
      cartItem.sku = selectedVariant.sku;
    }

    addItem(cartItem);

    // Reset animation after a brief delay
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const baseClasses = "font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = variant === 'primary'
    ? "bg-[#a5b5eb] text-white hover:bg-[#8a9fd9] shadow-lg"
    : "bg-white text-[#a5b5eb] border-2 border-[#a5b5eb] hover:bg-[#a5b5eb] hover:text-white";

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {isAdding ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Adding...
        </span>
      ) : (
        <>
          <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to Cart
        </>
      )}
    </button>
  );
}
