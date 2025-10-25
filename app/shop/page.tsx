import Image from 'next/image';
import { ComplianceBanner } from '@/components/compliance-banner';
import Link from 'next/link';
import { collections } from '@/data/products';
import AddToCartButton from '@/components/add-to-cart-button';

export default function ShopPage() {

  return (
    <main className="bg-white min-h-screen">
      <ComplianceBanner />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Shop Waggin Meals
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Premium nutrition for dogs who deserve the best
          </p>
        </div>
      </section>

      {/* Coming Soon Notice - Phase 2 */}
      <section className="bg-[#fff3cd] border-b-4 border-[#ffc107] px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-center">
            <svg className="h-8 w-8 text-[#856404] mr-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div>
              <h3 className="text-xl font-semibold text-[#856404]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                E-Commerce Coming Soon
              </h3>
              <p className="text-[14px] text-[#856404]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Online ordering will be available in Phase 2. For now, browse our products and contact us to order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Collections */}
      {collections.map((collection) => (
        <section key={collection.id} className="bg-white px-4 py-16 border-b-2 border-[#e0e0e0]">
          <div className="mx-auto max-w-7xl">
            {/* Collection Header */}
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-normal text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                {collection.name}
              </h2>
              <p className="text-[16px] text-[#666666] max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {collection.description}
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {collection.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className="bg-white border-2 border-[#e0e0e0] rounded-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  {/* Product Image */}
                  <div className="relative h-56 bg-[#f8f9fa] overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!product.inStock && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Out of Stock
                      </div>
                    )}
                    {product.tags.includes('bestseller') && (
                      <div className="absolute top-2 left-2 bg-[#ffc107] text-[#856404] px-3 py-1 rounded-full text-xs font-semibold">
                        Best Seller
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#3c3a47] mb-2 line-clamp-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {product.title}
                    </h3>

                    {product.weight && (
                      <p className="text-sm text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {product.weight}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-2xl font-bold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          ${product.price.toFixed(2)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-[#999999] line-through ml-2">
                            ${product.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-[13px] text-[#666666] mb-4 line-clamp-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {product.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-[#e8f4fb] text-[#0c5460] px-2 py-1 rounded"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Add to Cart Button */}
                    {product.inStock ? (
                      <AddToCartButton
                        product={{
                          id: product.id,
                          handle: product.handle,
                          title: product.title,
                          price: product.price,
                          images: product.images,
                          weight: product.weight,
                        }}
                        variant="primary"
                        className="w-full px-4 py-2 rounded-lg"
                      />
                    ) : (
                      <div className="block w-full bg-gray-300 text-gray-600 text-center px-4 py-2 rounded-lg font-semibold cursor-not-allowed"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Out of Stock
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Featured Products Placeholder - Phase 2 */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            How Shopping Will Work
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Browse Products
              </h3>
              <p className="text-[13px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Explore our selection of fresh meals, toppers, and supplements
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Customize Order
              </h3>
              <p className="text-[13px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Select quantities and delivery frequency that works for you
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Secure Checkout
              </h3>
              <p className="text-[13px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Safe payment processing with multiple payment options
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Fresh Delivery
              </h3>
              <p className="text-[13px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Receive fresh products delivered right to your door
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Waggin Meals */}
      <section className="bg-white px-4 py-16">
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

      {/* Temporary Contact CTA */}
      <section className="bg-gradient-to-br from-[#f8f9fa] to-[#e8f4fb] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Ready to Order?
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            While our online shop is under construction, you can still place orders by contacting us directly.
            We'll work with you to create the perfect nutrition plan for your dog.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-[#a5b5eb] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Contact Us to Order
            </Link>
            <Link
              href="/nutrition-services"
              className="bg-white text-[#a5b5eb] border-2 border-[#a5b5eb] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#a5b5eb] hover:text-white transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Phase 2 Development Note */}
      <section className="bg-[#d1ecf1] px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start">
            <svg className="h-8 w-8 text-[#0c5460] mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-[#0c5460] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Phase 2: E-Commerce Development
              </h3>
              <p className="text-[14px] text-[#0c5460]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                This shop page structure is ready for Phase 2 expansion. Future development will include:
              </p>
              <ul className="list-disc list-inside mt-2 text-[13px] text-[#0c5460] space-y-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li>Individual product pages with detailed descriptions and pricing</li>
                <li>Shopping cart functionality</li>
                <li>Secure payment processing integration (QuickBooks)</li>
                <li>Customer account system for order history and subscriptions</li>
                <li>Inventory management</li>
                <li>Shipping calculator and delivery scheduling</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
