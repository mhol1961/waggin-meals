import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/add-to-cart-button';
import ProductImageGallery from '@/components/product-image-gallery';
import ProductVariantSection from '@/components/product-variant-section';
import { generateProductSchema } from '@/lib/metadata';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fetch product data server-side
async function getProduct(handle: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('handle', handle)
    .eq('is_published', true)
    .single();

  if (error || !data) return null;

  return data;
}

// Fetch variants server-side
async function getVariants(productId: string) {
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId)
    .eq('is_available', true);

  return data || [];
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return {
      title: 'Product Not Found | Waggin Meals',
    };
  }

  const images = product.images || [];
  const firstImage = images[0] || '/images/logo-waggin-meals.png';

  return {
    title: `${product.title} | Waggin Meals Pet Nutrition`,
    description: product.description || `Fresh dog food: ${product.title}. Expert-formulated nutrition by certified pet nutritionist Christie Naquin.`,
    keywords: `${product.title}, fresh dog food, dog nutrition, ${product.category || 'pet food'}, Waggin Meals`,
    openGraph: {
      title: `${product.title} - Fresh Dog Food`,
      description: product.description,
      type: 'website',
      url: `https://wagginmeals.com/products/${product.handle}`,
      images: [
        {
          url: firstImage,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: [firstImage],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  const variants = product.has_variants ? await getVariants(product.id) : [];
  const productSchema = generateProductSchema(product, variants);

  return (
    <>
      {/* Product Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <main className="bg-white min-h-screen">
        {/* Breadcrumb */}
        <section className="bg-[#f8f9fa] px-4 py-4 border-b border-[#e0e0e0]">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <Link href="/" className="text-[#8FAE8F] hover:text-[#6d8c6d]">Home</Link>
              <span className="mx-2 text-[#666666]">/</span>
              <Link href="/shop" className="text-[#8FAE8F] hover:text-[#6d8c6d]">Shop</Link>
              <span className="mx-2 text-[#666666]">/</span>
              <span className="text-[#666666]">{product.title}</span>
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Product Images - Client Component */}
              <ProductImageGallery
                images={product.images || []}
                title={product.title}
                inStock={product.in_stock}
                tags={product.tags || []}
              />

              {/* Product Info - Client Component for interactivity */}
              <ProductVariantSection
                product={product}
                variants={variants}
              />
            </div>
          </div>
        </section>

        {/* Detailed Information */}
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
                    {product.analysis.split(',').map((line: string, index: number) => (
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
                    <li>Monitor your dog&apos;s digestion</li>
                    <li>Use our feeding calculator for portion sizes</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/feeding-calculator"
                  className="inline-block bg-[#8FAE8F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6d8c6d] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Use Feeding Calculator →
                </Link>
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
      </main>
    </>
  );
}
