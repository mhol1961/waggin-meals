'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { getCollectionBySlug, getProductsForCollection } from '@/data/collections';
import { allProducts } from '@/data/products';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name' | 'newest';
type ViewMode = 'grid' | 'list';

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug as string;
  const collection = getCollectionBySlug(slug);

  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

  if (!collection) {
    return (
      <main className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-normal text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Collection Not Found
          </h1>
          <Link href="/collections" className="text-[#a5b5eb] hover:text-[#8a9fd9]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            ← Back to Collections
          </Link>
        </div>
      </main>
    );
  }

  const collectionProducts = getProductsForCollection(collection, allProducts);

  // Sort and filter products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...collectionProducts];

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
        // Assuming products array is ordered by newest first
        break;
      case 'featured':
      default:
        // Keep original order (featured first)
        break;
    }

    return filtered;
  }, [collectionProducts, sortBy, priceRange]);

  return (
    <main className="bg-white min-h-screen">
      {/* Collection Hero */}
      <section className="relative bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="mb-4">
                <Link href="/collections" className="text-white hover:text-gray-100 text-sm flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Collections
                </Link>
              </div>
              <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                {collection.title}
              </h1>
              <p className="text-lg text-white leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {collection.description}
              </p>
            </div>

            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={collection.image}
                alt={collection.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Filter Bar */}
          <div className="bg-[#f8f9fa] rounded-lg p-6 mb-8 flex flex-wrap gap-4 items-center justify-between">
            {/* Sort By */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-[#e0e0e0] rounded-lg bg-white text-[#3c3a47] focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#a5b5eb] text-white' : 'bg-white text-[#666666] hover:bg-gray-100'}`}
                aria-label="Grid view"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#a5b5eb] text-white' : 'bg-white text-[#666666] hover:bg-gray-100'}`}
                aria-label="List view"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Results Count */}
            <div className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Showing {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-[#e0e0e0] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                No products found in this collection yet
              </p>
              <p className="text-sm text-[#999999] mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Check back soon or browse our other collections
              </p>
              <Link
                href="/collections"
                className="inline-block bg-[#a5b5eb] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#8a9fd9] transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Browse All Collections
              </Link>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
              {filteredAndSortedProducts.map((product) => (
                viewMode === 'grid' ? (
                  <ProductCardGrid key={product.id} product={product} />
                ) : (
                  <ProductCardList key={product.id} product={product} />
                )
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#f8f9fa] to-[#e8f4fb] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Need Personalized Recommendations?
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Schedule a FREE nutrition consultation with Christie to find the perfect meals for your dog's unique needs
          </p>
          <Link
            href="/nutrition-services"
            className="inline-block bg-[#a5b5eb] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Book Free Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}

// Product Card - Grid View
function ProductCardGrid({ product }: { product: any }) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.tags?.includes('new') && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
            New
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-[#3c3a47] mb-2 group-hover:text-[#a5b5eb] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {product.title}
        </h3>
        <p className="text-sm text-[#666666] leading-relaxed mb-4 line-clamp-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center text-[#a5b5eb] font-semibold text-sm group-hover:text-[#8a9fd9]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            View Product
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Product Card - List View
function ProductCardList({ product }: { product: any }) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex flex-col sm:flex-row gap-6 bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all p-6"
    >
      <div className="relative w-full sm:w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-[#3c3a47] mb-3 group-hover:text-[#a5b5eb] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {product.title}
          </h3>
          <p className="text-[15px] text-[#666666] leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center text-[#a5b5eb] font-semibold group-hover:text-[#8a9fd9]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            View Details
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
