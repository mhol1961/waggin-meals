'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { User, Package, MapPin, Settings, LogOut } from 'lucide-react';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a5b5eb] mx-auto"></div>
          <p className="mt-4 text-[#666666]">Loading your account...</p>
        </div>
      </div>
    );
  }

  const accountLinks = [
    {
      title: 'Orders',
      description: 'View your order history and track shipments',
      href: '/account/orders',
      icon: Package,
    },
    {
      title: 'Profile',
      description: 'Update your personal information',
      href: '/account/profile',
      icon: User,
    },
    {
      title: 'Addresses',
      description: 'Manage your shipping addresses',
      href: '/account/addresses',
      icon: MapPin,
    },
    {
      title: 'Settings',
      description: 'Account settings and preferences',
      href: '/account/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e8f4fb]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1
              className="text-4xl font-normal text-[#3c3a47] mb-2"
              style={{ fontFamily: "'Abril Fatface', serif" }}
            >
              My Account
            </h1>
            <p
              className="text-[#666666]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Welcome back, {user?.user_metadata?.first_name || user?.email}!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#666666] hover:text-[#3c3a47] transition-colors"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Account Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {accountLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-[#a5b5eb]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a5b5eb] to-[#c5d4f7] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold text-[#3c3a47] mb-2 group-hover:text-[#a5b5eb] transition-colors"
                      style={{ fontFamily: "'Abril Fatface', serif" }}
                    >
                      {link.title}
                    </h3>
                    <p
                      className="text-[#666666] text-sm"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg">
          <h3
            className="text-xl font-bold text-[#3c3a47] mb-4"
            style={{ fontFamily: "'Abril Fatface', serif" }}
          >
            Quick Links
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              href="/shop"
              className="text-[#a5b5eb] hover:text-[#8a9fd9] transition-colors text-sm font-medium"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              → Shop Products
            </Link>
            <Link
              href="/nutrition-services"
              className="text-[#a5b5eb] hover:text-[#8a9fd9] transition-colors text-sm font-medium"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              → Nutrition Consultation
            </Link>
            <Link
              href="/contact"
              className="text-[#a5b5eb] hover:text-[#8a9fd9] transition-colors text-sm font-medium"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              → Contact Support
            </Link>
            <Link
              href="/"
              className="text-[#a5b5eb] hover:text-[#8a9fd9] transition-colors text-sm font-medium"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              → Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
