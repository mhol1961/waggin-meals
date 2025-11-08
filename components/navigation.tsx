"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, User, ShoppingBag, LogOut, Package, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Pet Nutrition Services',
    dropdown: [
      { label: 'Nutrition Consultation ($395)', href: '/nutrition-services' },
      { label: 'Food Sensitivity Testing', href: '/food-sensitivities' },
      { label: 'Supplementation Guide', href: '/supplementation' },
    ]
  },
  {
    label: 'Resources',
    dropdown: [
      { label: 'Fresh Food Feeding Guide', href: '/guides/fresh-food-guide' },
      { label: 'Free PDF Guides', href: '/resources' },
      { label: 'Feeding Made Simple', href: '/feeding-made-simple' },
      { label: 'Recommended Products', href: '/recommended-products' },
      { label: 'Pet Nutrition Insights', href: '/blog' },
      { label: 'Events Calendar', href: '/events' },
    ]
  },
  {
    label: 'Nutrition Topics',
    dropdown: [
      { label: 'Puppies', href: '/puppies' },
      { label: 'Weight Management', href: '/weight-management' },
      { label: 'Kidney Health', href: '/kidney-health' },
      { label: 'Digestive Health', href: '/digestive-health' },
    ]
  },
  {
    label: 'Shop',
    dropdown: [
      { label: 'Shop All Products', href: '/shop' },
      { label: 'Bundles & Save', href: '/bundles' },
      { label: 'Collections', href: '/collections' },
    ]
  },
  {
    label: 'Success Stories',
    dropdown: [
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Testimonials', href: '/testimonials' },
    ]
  },
];

export function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, signOut } = useAuth();
  const { totalItems, openCart } = useCart();

  return (
    <>
      {/* Compact Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#F8F5F0] px-4 py-3">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo-waggin-meals.png"
                alt="Waggin Meals"
                width={72}
                height={72}
                className="rounded-full border border-[#F8F5F0] shadow-md"
              />
              <div className="min-w-[280px]">
                <p className="text-[8.4px] uppercase tracking-[0.25em] text-[#C97B63]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Waggin Meals
                </p>
                <p className="text-[13.5px] leading-tight text-[#8FAE8F] whitespace-nowrap" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Healthy Gut = Clean Butt
                </p>
                <p className="text-[7.2px] text-[#333333] mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Christie Willett, M.A., M.S. - Integrative Animal Nutrition
                </p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.dropdown ? (
                    <>
                      <button
                        className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#6d8c6d] px-3 py-2 hover:text-[#5E8C8C] transition-colors"
                      >
                        {item.label}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {activeDropdown === item.label && item.dropdown && (
                        <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-[#F8F5F0] py-2 z-50">
                          {item.dropdown?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-[#6d8c6d] hover:bg-[#F8F5F0] transition-colors"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-xs font-semibold uppercase tracking-wide text-[#6d8c6d] px-3 py-2 hover:text-[#5E8C8C] transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              {/* User Account Menu */}
              <div
                className="relative"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                {user ? (
                  <>
                    <button className="flex items-center gap-2 text-[#6d8c6d] px-3 py-2 hover:text-[#5E8C8C] transition-colors">
                      <User className="w-4 h-4" />
                      <span className="text-xs font-semibold">Account</span>
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-[#F8F5F0] py-2 z-50">
                        <div className="px-4 py-2 border-b border-[#F8F5F0]">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-semibold text-[#6d8c6d] truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/account"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#6d8c6d] hover:bg-[#F8F5F0] transition-colors"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          <User className="w-4 h-4" />
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#6d8c6d] hover:bg-[#F8F5F0] transition-colors"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          <Package className="w-4 h-4" />
                          Orders
                        </Link>
                        <Link
                          href="/account/subscriptions"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#6d8c6d] hover:bg-[#F8F5F0] transition-colors"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          <Package className="w-4 h-4" />
                          Subscriptions
                        </Link>
                        <Link
                          href="/account/settings"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#6d8c6d] hover:bg-[#F8F5F0] transition-colors"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <div className="border-t border-[#F8F5F0] mt-2 pt-2">
                          <button
                            onClick={() => signOut()}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 text-[#6d8c6d] px-3 py-2 hover:text-[#5E8C8C] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-xs font-semibold">Sign In</span>
                  </Link>
                )}
              </div>

              {/* Cart Icon */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-2 text-[#6d8c6d] px-3 py-2 hover:text-[#5E8C8C] transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <Link
                href="/contact"
                className="bg-[#5E8C8C] text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#5E8C8C] transition-colors ml-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Contact
              </Link>
            </div>

            {/* Mobile Icons */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Mobile Cart Icon */}
              <button
                onClick={openCart}
                className="relative p-2 text-[#8FAE8F] hover:bg-[#F8F5F0] rounded-md"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#8FAE8F] hover:bg-[#F8F5F0] rounded-md"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pb-3 border-t border-[#F8F5F0] pt-3">
              {/* Mobile User Menu */}
              <div className="mb-3 pb-3 border-b border-[#F8F5F0]">
                {user ? (
                  <>
                    <div className="px-3 py-2 mb-2">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-[#6d8c6d] truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#6d8c6d] hover:bg-[#F8F5F0] rounded-md"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-[#6d8c6d] hover:bg-[#F8F5F0] rounded-md"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Package className="w-4 h-4" />
                      Orders
                    </Link>
                    <Link
                      href="/account/subscriptions"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-[#6d8c6d] hover:bg-[#F8F5F0] rounded-md"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Package className="w-4 h-4" />
                      Subscriptions
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md mt-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#6d8c6d] hover:bg-[#F8F5F0] rounded-md"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
              </div>

              {navItems.map((item) => (
                <div key={item.label}>
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                        className="w-full flex items-center justify-between text-sm font-semibold text-[#6d8c6d] px-3 py-2 hover:bg-[#F8F5F0] rounded-md"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {item.label}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {activeDropdown === item.label && item.dropdown && (
                        <div className="pl-3 space-y-1 mt-1">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#F8F5F0] rounded-md"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block text-sm font-semibold text-[#6d8c6d] px-3 py-2 hover:bg-[#F8F5F0] rounded-md"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/contact"
                className="block text-center bg-[#5E8C8C] text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-[#5E8C8C] transition-colors mt-3 mx-3"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
