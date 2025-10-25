import Image from 'next/image';
import Link from 'next/link';

// Sample blog posts - these will be replaced with actual content management
const featuredPost = {
  title: "5 Signs Your Dog Needs a Custom Meal Plan (And How to Get One)",
  excerpt: "Is your dog constantly scratching, experiencing digestive issues, or lacking energy? These could be signs that their current diet isn't meeting their unique nutritional needs. Learn the warning signs and how a customized meal plan can transform your dog's health.",
  image: "/images/woman-with-white-dog.webp",
  category: "Nutrition Basics",
  date: "January 15, 2025",
  readTime: "8 min read",
  slug: "signs-your-dog-needs-custom-meal-plan",
};

const blogPosts = [
  {
    title: "Kibble vs Fresh Food: What Vets Don't Tell You",
    excerpt: "Discover the truth about commercial kibble and why fresh food might be the better choice for your dog's long-term health.",
    category: "Nutrition Basics",
    date: "January 10, 2025",
    readTime: "6 min read",
    slug: "kibble-vs-fresh-food",
  },
  {
    title: "How to Transition Your Picky Eater to Fresh Food",
    excerpt: "Step-by-step strategies to help even the most stubborn dogs embrace a healthier diet without stress or hunger strikes.",
    category: "Feeding Tips",
    date: "January 5, 2025",
    readTime: "5 min read",
    slug: "transition-picky-eater-fresh-food",
  },
  {
    title: "The Truth About Dog Food Labels: A Pet Nutritionist's Guide",
    excerpt: "Learn to decode marketing jargon and ingredient lists to make informed decisions about what you're really feeding your dog.",
    category: "Ingredient Insights",
    date: "December 28, 2024",
    readTime: "7 min read",
    slug: "truth-about-dog-food-labels",
  },
  {
    title: "Seasonal Nutrition: What to Feed Your Dog in Winter",
    excerpt: "Adjust your dog's diet for colder months to maintain energy, support immune function, and keep their coat healthy.",
    category: "Seasonal Tips",
    date: "December 20, 2024",
    readTime: "4 min read",
    slug: "seasonal-nutrition-winter",
  },
  {
    title: "Real Client Story: How Fresh Food Healed Bella's Digestive Issues",
    excerpt: "Meet Bella, a 6-year-old Golden Retriever who suffered from chronic diarrhea for years—until we created her custom meal plan.",
    category: "Success Stories",
    date: "December 15, 2024",
    readTime: "6 min read",
    slug: "bella-digestive-issues-success-story",
  },
  {
    title: "Top 10 Superfoods for Dogs (And How to Add Them to Meals)",
    excerpt: "Boost your dog's nutrition with these nutrient-dense whole foods that support everything from joint health to brain function.",
    category: "Ingredient Insights",
    date: "December 10, 2024",
    readTime: "5 min read",
    slug: "top-10-superfoods-for-dogs",
  },
];

const categories = [
  "All Posts",
  "Nutrition Basics",
  "Feeding Tips",
  "Ingredient Insights",
  "Success Stories",
  "Seasonal Tips",
  "Health Conditions",
];

export default function BlogPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Pet Nutrition Insights
          </h1>
          <p className="text-lg text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Expert advice, practical tips, and science-backed guidance for feeding your dog better
          </p>
          <p className="text-sm text-white opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
            By Christie, Certified Pet Nutritionist
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "All Posts"
                    ? "bg-[#a5b5eb] text-white"
                    : "bg-gray-100 text-[#666666] hover:bg-gray-200"
                }`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#a5b5eb] text-white px-4 py-1 rounded-full text-xs font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold text-[#a5b5eb] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {featuredPost.category}
                  </span>
                  <span className="text-xs text-[#999999]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {featuredPost.date} · {featuredPost.readTime}
                  </span>
                </div>
                <h2 className="text-3xl font-normal text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  {featuredPost.title}
                </h2>
                <p className="text-[15px] text-[#666666] mb-6 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {featuredPost.excerpt}
                </p>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-block bg-[#a5b5eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8a9fd9] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Read Full Article →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Latest Articles
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="bg-[#f8f9fa] rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-[#a5b5eb] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {post.category}
                    </span>
                    <span className="text-xs text-[#999999]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 hover:text-[#a5b5eb] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-[14px] text-[#666666] mb-4 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#999999]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {post.date}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-semibold text-[#a5b5eb] hover:text-[#8a9fd9] transition-colors"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button
              className="bg-white border-2 border-[#a5b5eb] text-[#a5b5eb] px-8 py-3 rounded-lg font-semibold hover:bg-[#a5b5eb] hover:text-white transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gradient-to-br from-[#f8f9fa] to-[#e8f4fb] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Never Miss a Post
          </h2>
          <p className="text-[16px] text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Get weekly nutrition tips, recipes, and exclusive insights delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#a5b5eb]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
            <button
              className="bg-[#a5b5eb] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#8a9fd9] transition-colors whitespace-nowrap"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Subscribe
            </button>
          </div>
          <p className="text-xs text-[#999999] mt-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Ready for Personalized Guidance?
          </h2>
          <p className="text-[16px] text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Reading articles is a great start, but nothing beats a custom meal plan designed specifically for your dog's unique needs.
          </p>
          <Link
            href="/nutrition-services"
            className="inline-block bg-[#a5b5eb] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Book Your Consultation - $395
          </Link>
        </div>
      </section>

      {/* Development Note */}
      <section className="bg-[#d1ecf1] px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start">
            <svg className="h-8 w-8 text-[#0c5460] mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-[#0c5460] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Blog Content Management
              </h3>
              <p className="text-[14px] text-[#0c5460]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                This blog page structure is ready for content. You can either:
              </p>
              <ul className="list-disc list-inside mt-2 text-[13px] text-[#0c5460] space-y-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li>Add blog posts as individual MDX files in <code className="bg-[#0c5460] bg-opacity-10 px-2 py-1 rounded">/app/blog/[slug]/page.tsx</code></li>
                <li>Integrate a headless CMS (Sanity, Contentful, or Strapi)</li>
                <li>Use a Markdown-based solution like Contentlayer</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
