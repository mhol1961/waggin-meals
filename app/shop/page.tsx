import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/add-to-cart-button';
import { generateMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = generateMetadata({
  title: 'Shop Fresh Dog Food & Nutrition Products',
  description: 'Browse premium fresh dog food, meal toppers, and supplements. All products formulated by board-certified canine nutritionist Christie Naquin.',
  keywords: ['buy fresh dog food', 'premium dog food online', 'dog meal toppers', 'canine supplements', 'healthy dog products'],
  url: '/shop',
});

export default async function ShopPage() {
  const supabase = await createClient();

  // Fetch all published products from Supabase
  const { data: productsData, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
  }

  // Transform snake_case database columns to camelCase for TypeScript types
  const products = productsData?.map(p => ({
    ...p,
    inStock: p.in_stock,
    compareAtPrice: p.compare_at_price,
  }));

  // Define category display information
  const categoryInfo: Record<string, { name: string; description: string; order: number }> = {
    chicken: { name: 'Chicken Meals', description: 'Fresh chicken meals perfect for dogs with sensitive stomachs', order: 1 },
    beef: { name: 'Beef Meals', description: 'Rich beef protein for active dogs', order: 2 },
    turkey: { name: 'Turkey Meals', description: 'Lean turkey protein with superfoods', order: 3 },
    salmon: { name: 'Salmon & Fish', description: 'Rich in Omega-3s for skin and coat health', order: 4 },
    lamb: { name: 'Lamb Products', description: 'Novel protein for sensitive dogs', order: 5 },
    treats: { name: 'Dog Treats', description: 'Healthy, delicious treats for training and rewards', order: 6 },
    broth: { name: 'Bone Broth', description: 'Nutrient-rich broths for hydration and joint health', order: 7 },
    stew: { name: 'Stews & Toppers', description: 'Meal toppers and hearty stews', order: 8 },
    mixed: { name: 'Mixed Proteins', description: 'Variety protein meals', order: 9 },
    pork: { name: 'Pork Products', description: 'Premium pork-based meals', order: 10 },
    test: { name: 'Test Products', description: 'Products for checkout testing', order: 99 },
  };

  // Group products by category dynamically
  type ProductType = NonNullable<typeof products>[number];
  type Collection = {
    id: string;
    name: string;
    description: string;
    order: number;
    products: ProductType[];
  };

  const collections: Collection[] = products ?
    (Object.entries(
      products.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
      }, {} as Record<string, ProductType[]>)
    ) as [string, ProductType[]][])
    .map(([category, categoryProducts]): Collection => ({
      id: category,
      name: categoryInfo[category]?.name || category.charAt(0).toUpperCase() + category.slice(1),
      description: categoryInfo[category]?.description || `Premium ${category} products`,
      order: categoryInfo[category]?.order || 50,
      products: categoryProducts,
    }))
    .sort((a, b) => a.order - b.order)
    : [];

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#8FAE8F] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Shop Waggin Meals
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Premium nutrition for dogs who deserve the best
          </p>
        </div>
      </section>

      {/* Bundles Promotion Banner */}
      <section className="bg-[#2f4b38] px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-block bg-[#ffc107] text-[#2f4b38] px-3 py-1 rounded-full text-sm font-bold mb-3">
                SAVE UP TO $19
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Premium Nutrition Bundles
              </h2>
              <p className="text-lg text-white/90 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Save big with our curated bundles. Customize your selection or choose a pre-configured package.
              </p>
              <ul className="text-white/80 text-sm space-y-1 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li>✓ Free Shipping Included</li>
                <li>✓ Flexible Delivery Options</li>
                <li>✓ Subscribe & Save an Extra 3%</li>
              </ul>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/bundles"
                className="inline-block bg-white text-[#2f4b38] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#f5f1ea] transition-colors shadow-lg"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                View Bundles →
              </Link>
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
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Out of Stock
                      </div>
                    )}
                    {product.tags && product.tags.includes('bestseller') && (
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
                        <span className="text-2xl font-bold text-[#8FAE8F]" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs bg-[#e8f4fb] text-[#0c5460] px-2 py-1 rounded"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

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
              <div className="w-16 h-16 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
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
              <div className="w-16 h-16 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
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
              <div className="w-16 h-16 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
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
              <div className="w-16 h-16 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
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
              <div className="w-20 h-20 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
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
              <div className="w-20 h-20 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
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
              <div className="w-20 h-20 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
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
      <section className="bg-[#f8f9fa] px-4 py-16">
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
              className="bg-[#8FAE8F] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#6d8c6d] transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Contact Us to Order
            </Link>
            <Link
              href="/nutrition-services"
              className="bg-white text-[#8FAE8F] border-2 border-[#8FAE8F] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8FAE8F] hover:text-white transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
