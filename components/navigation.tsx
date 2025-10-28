'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';

// Navigation structure with dropdowns - Updated
const navItems = [
  { label: 'Home', href: '/' },
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
      { label: 'Feeding Calculator', href: '/feeding-calculator' },
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
  { label: 'Contact', href: '/contact' },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { totalItems, openCart } = useCart();

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (label: string) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    // Add a delay before closing to allow mouse movement to dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 400); // 400ms delay for longer dropdowns
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Waggin Meals */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="/images/logo-waggin-meals.png"
              alt="Waggin Meals Pet Nutrition Co."
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:gap-5 lg:items-center lg:justify-center lg:flex-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                {item.dropdown ? (
                  <>
                    <button
                      className="flex items-center text-sm font-medium uppercase tracking-wide text-text-heading transition-colors hover:text-primary-blue py-2"
                    >
                      {item.label}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    {activeDropdown === item.label && (
                      <div
                        className="absolute left-0 top-full pt-1 w-64"
                        onMouseEnter={() => handleMouseEnter(item.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-text-heading hover:bg-bg-light-gray transition-colors"
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm font-medium uppercase tracking-wide text-text-heading transition-colors hover:text-primary-blue"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Cart Icon */}
          <button
            onClick={openCart}
            className="relative ml-4 rounded-md p-2 text-text-heading hover:bg-gray-100 transition-colors"
            aria-label="Shopping cart"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-blue text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden rounded-md p-2 text-text-heading hover:bg-gray-100 ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border-light">
          <nav className="flex flex-col space-y-1 px-4 py-4 max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <>
                    <div className="px-4 py-2 text-sm font-semibold text-primary-blue">
                      {item.label}
                    </div>
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.href}
                        href={dropdownItem.href}
                        className="block pl-8 pr-4 py-2 text-sm text-text-heading hover:bg-bg-light-gray transition-colors rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block rounded-md px-4 py-3 text-sm font-medium uppercase tracking-wide text-text-heading hover:bg-bg-light-gray transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
