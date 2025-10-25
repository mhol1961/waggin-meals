'use client';

import Link from 'next/link';
import { FileText, BookOpen, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e8f4fb]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-5xl font-normal text-[#3c3a47] mb-4"
            style={{ fontFamily: "'Abril Fatface', serif" }}
          >
            Admin Dashboard
          </h1>
          <p
            className="text-lg text-[#666666]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Manage your content and case studies
          </p>
        </div>

        {/* Admin Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Blog Management */}
          <Link
            href="/admin/blog/new"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-[#a5b5eb]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#a5b5eb] to-[#c5d4f7] flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <ArrowRight className="w-6 h-6 text-[#a5b5eb] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h2
              className="text-2xl font-bold text-[#3c3a47] mb-2"
              style={{ fontFamily: "'Abril Fatface', serif" }}
            >
              Blog Posts
            </h2>
            <p
              className="text-[#666666] leading-relaxed"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Create and manage blog posts for pet nutrition insights and educational content.
            </p>
          </Link>

          {/* Case Studies Management */}
          <Link
            href="/admin/case-studies/new"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-[#a5b5eb]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#a5b5eb] to-[#c5d4f7] flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <ArrowRight className="w-6 h-6 text-[#a5b5eb] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h2
              className="text-2xl font-bold text-[#3c3a47] mb-2"
              style={{ fontFamily: "'Abril Fatface', serif" }}
            >
              Case Studies
            </h2>
            <p
              className="text-[#666666] leading-relaxed"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Document success stories and transformations from your nutrition consulting work.
            </p>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <h3
            className="text-xl font-bold text-[#3c3a47] mb-4"
            style={{ fontFamily: "'Abril Fatface', serif" }}
          >
            Quick Links
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              href="/blog"
              className="text-[#a5b5eb] hover:text-[#8a9fd9] transition-colors text-sm font-medium"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              → View Published Blog Posts
            </Link>
            <Link
              href="/case-studies"
              className="text-[#a5b5eb] hover:text-[#8a9fd9] transition-colors text-sm font-medium"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              → View Published Case Studies
            </Link>
            <Link
              href="/"
              className="text-[#a5b5eb] hover:text-[#8a9fd9] transition-colors text-sm font-medium"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              → Back to Website
            </Link>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-[#d1ecf1] border-l-4 border-[#0c5460] rounded-lg p-6">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-[#0c5460] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div>
              <h4
                className="text-sm font-semibold text-[#0c5460] mb-1"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Content Management System
              </h4>
              <p
                className="text-sm text-[#0c5460]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                All content is stored in Supabase. Blog posts and case studies support rich text formatting with images and links.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
