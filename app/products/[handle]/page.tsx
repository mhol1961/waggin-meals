'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProductByHandle, getProductsByCollection } from '@/data/products';
import { ProductVariantSelector } from '@/components/product-variant-selector';
import { ProductVariant } from '@/types/product';

export default function ProductPage() {
  const params = useParams();
  const handle = params.handle as string;
  const product = getProductByHandle(handle);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.hasVariants && product?.variants
      ? (product.variants.find(v => v.isDefault) || product.variants[0])
      : null
  );

  if (!product) {
    return (
      <main className="bg-white min-h-screen">
        <section className="px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Product Not Found
            </h1>
            <p className="text-[16px] text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#a5b5eb] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8a9fd9] transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Back to Shop
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Get related products from the same collection
  const relatedProducts = getProductsByCollection(product.collection)
    .filter(p => p.handle !== product.handle && p.inStock)
    .slice(0, 3);

  return (
    <main className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <section className="bg-[#f8f9fa] px-4 py-4 border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <Link href="/" className="text-[#a5b5eb] hover:text-[#8a9fd9]">Home</Link>
            <span className="mx-2 text-[#666666]">/</span>
            <Link href="/shop" className="text-[#a5b5eb] hover:text-[#8a9fd9]">Shop</Link>
            <span className="mx-2 text-[#666666]">/</span>
            <span className="text-[#666666]">{product.title}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square bg-[#f8f9fa] rounded-lg overflow-hidden mb-4">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                {!product.inStock && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Out of Stock
                  </div>
                )}
                {product.tags.includes('bestseller') && (
                  <div className="absolute top-4 left-4 bg-[#ffc107] text-[#856404] px-4 py-2 rounded-full text-sm font-semibold">
                    Best Seller
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square bg-[#f8f9fa] rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-[#a5b5eb]' : 'border-[#e0e0e0] hover:border-[#a5b5eb]'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-normal text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                {product.title}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    ${(selectedVariant?.price || product.price).toFixed(2)}
                  </span>
                  {(selectedVariant?.compareAtPrice || product.compareAtPrice) && (
                    <span className="text-xl text-[#999999] line-through" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      ${(selectedVariant?.compareAtPrice || product.compareAtPrice)?.toFixed(2)}
                    </span>
                  )}
                </div>
                {!product.hasVariants && product.weight && (
                  <p className="text-[16px] text-[#666666] mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {product.weight}
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="text-[16px] leading-relaxed text-[#666666] mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {product.description}
              </p>

              {/* Product Variants Selector */}
              {product.hasVariants && product.variants && product.variants.length > 0 && (
                <div className="mb-8">
                  <ProductVariantSelector
                    variants={product.variants}
                    onVariantChange={(variant) => setSelectedVariant(variant)}
                  />
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#e8f4fb] text-[#0c5460] px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stock Status */}
              <div className="mb-8">
                {product.inStock ? (
                  <div className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      In Stock
                      {product.stockQty && product.stockQty < 50 && ` - Only ${product.stockQty} left!`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Out of Stock</span>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Link
                  href="/contact"
                  className="block w-full bg-[#a5b5eb] text-white text-center px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Contact to Order
                </Link>
                <Link
                  href="/nutrition-services"
                  className="block w-full bg-white text-[#a5b5eb] border-2 border-[#a5b5eb] text-center px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#a5b5eb] hover:text-white transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Schedule Consultation
                </Link>
              </div>

              {/* Phase 2 Note */}
              <div className="bg-[#fff3cd] rounded-lg p-4 mt-6">
                <p className="text-sm text-[#856404]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Online ordering coming soon! For now, please contact us to place your order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information Tabs */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients */}
            {product.ingredients && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Ingredients
                </h2>
                <p className="text-[15px] leading-relaxed text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {product.ingredients}
                </p>
              </div>
            )}

            {/* Nutritional Analysis */}
            {product.analysis && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Guaranteed Analysis
                </h2>
                <div className="space-y-2">
                  {product.analysis.split(',').map((line, index) => (
                    <p key={index} className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {line.trim()}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Feeding Guidelines */}
          <div className="bg-white rounded-lg p-6 shadow-md mt-8">
            <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Feeding Guidelines
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Storage Instructions
                </h3>
                <ul className="list-disc list-inside space-y-2 text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <li>Refrigerate immediately upon receipt</li>
                  <li>Use within 4-5 days of opening</li>
                  <li>Can be frozen for up to 3 months</li>
                  <li>Thaw in refrigerator, never at room temperature</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Transitioning Tips
                </h3>
                <ul className="list-disc list-inside space-y-2 text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <li>Start with 25% new food, 75% old food</li>
                  <li>Gradually increase over 7-10 days</li>
                  <li>Monitor your dog's digestion</li>
                  <li>Use our feeding calculator for portion sizes</li>
                </ul>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/feeding-calculator"
                className="inline-block bg-[#a5b5eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8a9fd9] transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Use Feeding Calculator →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-white px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
              You May Also Like
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.handle}`}
                  className="bg-white border-2 border-[#e0e0e0] rounded-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative h-56 bg-[#f8f9fa] overflow-hidden">
                    <Image
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#3c3a47] mb-2 line-clamp-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {relatedProduct.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        ${relatedProduct.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Waggin Meals */}
      <section className="bg-gradient-to-br from-[#f8f9fa] to-[#e8f4fb] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Why Choose Waggin Meals
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                ✓
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Expert-Formulated
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Every recipe designed by Christie, a certified pet nutritionist with years of experience
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                🌱
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Whole Food Ingredients
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Human-grade, fresh ingredients with no artificial preservatives or fillers
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                💙
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Made with Love
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Small-batch production ensures quality and freshness in every order
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
