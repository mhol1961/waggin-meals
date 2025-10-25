import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import Link from 'next/link';
import {
  getAllBlogPosts,
  getAllVideos,
  getAllTestimonials,
  getAllEvents,
  getAllResources,
  getAllProducts,
} from '@/lib/supabase/server';

export default async function AdminDashboard() {
  // Check authentication
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Fetch content statistics
  const [blogPosts, videos, testimonials, events, resources, products] =
    await Promise.all([
      getAllBlogPosts(false), // Get all, not just published
      getAllVideos(false),
      getAllTestimonials(false),
      getAllEvents(false),
      getAllResources(false),
      getAllProducts(false),
    ]);

  const stats = [
    {
      name: 'Blog Posts',
      total: blogPosts.length,
      published: blogPosts.filter((p) => p.is_published).length,
      icon: '📝',
      href: '/admin/blog',
    },
    {
      name: 'Videos',
      total: videos.length,
      published: videos.filter((v) => v.is_published).length,
      icon: '🎥',
      href: '/admin/videos',
    },
    {
      name: 'Testimonials',
      total: testimonials.length,
      published: testimonials.filter((t) => t.is_published).length,
      icon: '⭐',
      href: '/admin/testimonials',
    },
    {
      name: 'Events',
      total: events.length,
      published: events.filter((e) => e.is_published).length,
      icon: '📅',
      href: '/admin/events',
    },
    {
      name: 'Resources',
      total: resources.length,
      published: resources.filter((r) => r.is_published).length,
      icon: '📄',
      href: '/admin/resources',
    },
    {
      name: 'Products',
      total: products.length,
      published: products.filter((p) => p.is_published).length,
      icon: '🛍️',
      href: '/admin/products',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              Waggin Meals CMS
            </h1>
            <p className="text-sm text-gray-600">
              Welcome back, {session.username}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition"
              target="_blank"
            >
              View Site
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Dashboard
          </h2>
          <p className="text-gray-600">
            Manage all your website content in one place
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{stat.icon}</div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {stat.total}
                  </div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition">
                {stat.name}
              </h3>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Published:</span>
                <span className="font-semibold text-green-600">
                  {stat.published}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600">Drafts:</span>
                <span className="font-semibold text-gray-600">
                  {stat.total - stat.published}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition group"
            >
              <div className="text-2xl">✍️</div>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-orange-600">
                  New Blog Post
                </div>
                <div className="text-sm text-gray-600">
                  Write a new article
                </div>
              </div>
            </Link>

            <Link
              href="/admin/videos/new"
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition group"
            >
              <div className="text-2xl">🎬</div>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                  Add Video
                </div>
                <div className="text-sm text-gray-600">
                  Upload a new video
                </div>
              </div>
            </Link>

            <Link
              href="/admin/testimonials/new"
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition group"
            >
              <div className="text-2xl">💬</div>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-green-600">
                  Add Testimonial
                </div>
                <div className="text-sm text-gray-600">
                  Share success story
                </div>
              </div>
            </Link>

            <Link
              href="/admin/events/new"
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition group"
            >
              <div className="text-2xl">🎪</div>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-purple-600">
                  Create Event
                </div>
                <div className="text-sm text-gray-600">
                  Schedule workshop
                </div>
              </div>
            </Link>

            <Link
              href="/admin/resources/new"
              className="flex items-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition group"
            >
              <div className="text-2xl">📚</div>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-yellow-600">
                  Upload Resource
                </div>
                <div className="text-sm text-gray-600">
                  Add PDF guide
                </div>
              </div>
            </Link>

            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 p-4 bg-pink-50 hover:bg-pink-100 rounded-lg transition group"
            >
              <div className="text-2xl">🛒</div>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-pink-600">
                  Add Product
                </div>
                <div className="text-sm text-gray-600">
                  List for sale
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Need Help?
          </h3>
          <p className="text-gray-700 mb-4">
            Check out the documentation or contact support for assistance with the CMS.
          </p>
          <div className="flex gap-4">
            <a
              href="/supabase/README.md"
              className="text-sm bg-white hover:bg-gray-50 px-4 py-2 rounded-lg transition font-medium"
              target="_blank"
            >
              View Documentation
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
