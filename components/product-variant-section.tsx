'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AddToCartButton from '@/components/add-to-cart-button';
import VariantSelector from '@/components/variant-selector';
import StockStatusBadge from '@/components/stock-status-badge';

interface ProductVariantSectionProps {
  product: any; // Product from database
  variants: any[]; // Variants from database
}

export default function ProductVariantSection({
  product,
  variants,
}: ProductVariantSectionProps) {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  // Auto-select first variant if available
  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [variants, selectedVariant]);

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayComparePrice = selectedVariant
    ? selectedVariant.compare_at_price
    : product.compare_at_price;

  const isInStock = selectedVariant
    ? selectedVariant.inventory_quantity > 0 || !selectedVariant.track_inventory
    : product.in_stock;

  return (
    <div>
      {/* Product Title */}
      <h1
        className="text-4xl font-normal text-[#3c3a47] mb-4"
        style={{ fontFamily: "'Abril Fatface', serif" }}
      >
        {product.title}
      </h1>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3">
          <span
            className="text-4xl font-bold text-[#8FAE8F]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            ${displayPrice.toFixed(2)}
          </span>
          {displayComparePrice && (
            <span
              className="text-xl text-[#999999] line-through"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              ${displayComparePrice.toFixed(2)}
            </span>
          )}
        </div>
        {product.weight && !selectedVariant && (
          <p
            className="text-[16px] text-[#666666] mt-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {product.weight}
          </p>
        )}
      </div>

      {/* Description */}
      <p
        className="text-[16px] leading-relaxed text-[#666666] mb-6"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {product.description}
      </p>

      {/* Variant Selector */}
      {variants.length > 0 && (
        <div className="mb-6">
          <VariantSelector
            productId={product.id}
            variants={variants.map(v => ({
              ...v,
              inStock: v.inventory_quantity > 0 || !v.track_inventory,
              stockQty: v.inventory_quantity,
            }))}
            onVariantChange={(variant) => setSelectedVariant(variant)}
          />
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {product.tags.map((tag: string) => (
            <span
              key={tag}
              className="bg-[#e8f4fb] text-[#0c5460] px-4 py-2 rounded-full text-sm font-semibold"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stock Status */}
      <div className="mb-8">
        {selectedVariant ? (
          <StockStatusBadge
            quantity={selectedVariant.inventory_quantity}
            lowStockThreshold={5}
            trackInventory={selectedVariant.track_inventory}
            allowBackorder={selectedVariant.inventory_policy === 'continue'}
            showQuantity={true}
            size="md"
          />
        ) : (
          <StockStatusBadge
            quantity={product.stock_quantity || 0}
            lowStockThreshold={5}
            trackInventory={true}
            allowBackorder={false}
            showQuantity={true}
            size="md"
          />
        )}
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3">
        {isInStock ? (
          <>
            <AddToCartButton
              product={{
                id: product.id,
                handle: product.handle,
                title: product.title,
                price: product.price,
                images: product.images,
                weight: product.weight,
              }}
              selectedVariant={
                selectedVariant
                  ? {
                      variant_id: selectedVariant.id,
                      variant_title: selectedVariant.title,
                      sku: selectedVariant.sku,
                      price: selectedVariant.price,
                    }
                  : null
              }
              disabled={variants.length > 0 && !selectedVariant}
              variant="primary"
              className="w-full px-8 py-4 rounded-lg text-lg"
            />
            <Link
              href="/nutrition-services"
              className="block w-full bg-white text-[#8FAE8F] border-2 border-[#8FAE8F] text-center px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#8FAE8F] hover:text-white transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Schedule Consultation
            </Link>
          </>
        ) : (
          <>
            <div
              className="w-full bg-gray-300 text-gray-600 text-center px-8 py-4 rounded-lg text-lg font-semibold cursor-not-allowed"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Out of Stock
            </div>
            <Link
              href="/contact"
              className="block w-full bg-[#8FAE8F] text-white text-center px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#6d8c6d] transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Contact for Availability
            </Link>
          </>
        )}
      </div>

      {/* Shipping Note */}
      <div className="bg-[#e8f4fb] rounded-lg p-4 mt-6">
        <p
          className="text-sm text-[#0c5460]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Free shipping on orders over $50. All orders ship fresh within 2-3
          business days.
        </p>
      </div>
    </div>
  );
}
