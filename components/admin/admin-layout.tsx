import Link from 'next/link';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  username: string;
}

export default function AdminLayout({ children, title, username }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="hover:opacity-80 transition">
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Waggin Meals CMS
              </h1>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/admin/orders"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Orders
              </Link>
              <Link
                href="/admin/products"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Products
              </Link>
              <Link
                href="/admin/discounts"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Discounts
              </Link>
              <Link
                href="/admin/blog"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Blog
              </Link>
              <Link
                href="/admin/newsletter"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Newsletter
              </Link>
              <Link
                href="/admin/videos"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Videos
              </Link>
              <Link
                href="/admin/testimonials"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Testimonials
              </Link>
              <Link
                href="/admin/events"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Events
              </Link>
              <Link
                href="/admin/resources"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Resources
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {username}
            </span>
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
        <div className="mb-6">
          <h2 className="text-3xl font-serif font-bold text-gray-900">
            {title}
          </h2>
        </div>
        {children}
      </main>
    </div>
  );
}
