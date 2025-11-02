"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { bundles, Bundle, BundleItem } from '@/data/bundles';
import { useCart } from '@/contexts/cart-context';
import { Package, Check, Star, Gift, Calendar, Truck, ChevronDown, ChevronUp, X, ZoomIn, Sparkles, TrendingDown, Clock, Award, Heart } from 'lucide-react';

interface CustomSelection {
  bundleId: string;
  selectedItems: Record<string, string[]>;
  frequency: string;
}

// Bundle image preview component
const sampleProductImages = [
  '/images/chicken-superfood-board.jpg',
  '/images/beef-sweet-potato-bowl.jpg',
  '/images/logo-waggin-meals.png',
];

export default function BundlesPage() {
  const { addItem } = useCart();
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [customizing, setCustomizing] = useState(false);
  const [customSelection, setCustomSelection] = useState<CustomSelection>({
    bundleId: '',
    selectedItems: {},
    frequency: 'one-time',
  });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [savingsCounter, setSavingsCounter] = useState(0);

  // Animated savings counter
  useEffect(() => {
    const targetSavings = 19;
    const interval = setInterval(() => {
      setSavingsCounter(prev => {
        if (prev < targetSavings) {
          return prev + 1;
        }
        return targetSavings;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleCustomizeBundle = (bundle: Bundle) => {
    setSelectedBundle(bundle.id);
    setCustomizing(true);
    setCustomSelection({
      bundleId: bundle.id,
      selectedItems: {},
      frequency: 'one-time',
    });
  };

  const handleItemSelection = (category: string, item: string, maxQuantity: number) => {
    setCustomSelection(prev => {
      const currentItems = prev.selectedItems[category] || [];
      const newItems = currentItems.includes(item)
        ? currentItems.filter(i => i !== item)
        : currentItems.length < maxQuantity
        ? [...currentItems, item]
        : currentItems;

      return {
        ...prev,
        selectedItems: {
          ...prev.selectedItems,
          [category]: newItems,
        },
      };
    });
  };

  const isSelectionComplete = (bundle: Bundle): boolean => {
    return bundle.includedItems.every(item => {
      if (!item.options) return true;
      const selected = customSelection.selectedItems[item.category] || [];
      return selected.length === item.quantity;
    });
  };

  const handleAddToCart = () => {
    if (!currentBundle || !isSelectionComplete(currentBundle)) return;

    const isSubscription = customSelection.frequency !== 'one-time';
    const finalPrice = isSubscription ? currentBundle.basePrice * 0.97 : currentBundle.basePrice;

    const cartKey = `bundle-${currentBundle.id}-${Date.now()}`;
    addItem({
      id: `bundle-${currentBundle.id}`,
      cart_key: cartKey,
      handle: currentBundle.slug,
      title: `${currentBundle.name}${isSubscription ? ' (Subscription)' : ''}`,
      price: finalPrice,
      image: currentBundle.imageUrl,
      isBundle: true,
      bundleDetails: {
        selectedItems: customSelection.selectedItems,
        frequency: customSelection.frequency,
        isSubscription,
      },
    });

    setCustomizing(false);
    setCustomSelection({
      bundleId: '',
      selectedItems: {},
      frequency: 'one-time',
    });
  };

  const currentBundle = bundles.find(b => b.id === selectedBundle);

  return (
    <main className="bg-[#d8c6ff] min-h-screen">
      {/* Announcement Banner */}
      <div className="bg-[#5E3B76] text-white text-center text-sm py-3 px-4 relative overflow-hidden">
        <div className="relative flex items-center justify-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <Clock className="w-4 h-4 animate-pulse" />
          <span className="font-semibold">Limited Time: Subscribe & Save 3% + FREE Shipping on Orders Over $165</span>
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
      </div>

      {/* HERO SECTION - COMPACT & STRIKING */}
      <section className="relative px-4 py-12 overflow-hidden">
        {/* Subtle background gradients */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute -top-40 -left-24 w-96 h-96 bg-[#9657EE]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-[#5E3B76]/10 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl relative z-10 grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column: Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-[#ead9ff] rounded-full px-4 py-2 mb-4 shadow-sm">
              <Award className="w-4 h-4 text-[#9657EE]" />
              <span className="text-xs font-semibold text-[#5E3B76] uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Christie-Formulated
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-normal text-[#2b1d3b] mb-4 leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Premium Nutrition <span className="text-[#9657EE]">Bundles</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-[#6e5c8f] mb-6 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Fresh, chef-crafted meals your pup will devour. <strong>Save up to ${savingsCounter}</strong> with our curated bundles.
            </p>

            {/* Quick Benefits */}
            <div className="space-y-2 mb-6">
              {['Subscribe & Save 3% Extra', 'FREE Shipping Over $165', 'Pause, Skip, or Cancel Anytime'].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-[#5E3B76]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <Check className="w-5 h-5 text-[#9657EE] flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-6">
              <a
                href="#bundles"
                className="bg-[#5E3B76] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-[#452a6d] transition-all hover:shadow-xl inline-flex items-center gap-2 text-sm"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Browse Bundles
                <ChevronDown className="w-4 h-4" />
              </a>
              <Link
                href="/contact-expert"
                className="border-2 border-[#5E3B76] text-[#5E3B76] px-6 py-3 rounded-full font-semibold hover:bg-[#5E3B76] hover:text-white transition-colors text-sm"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Need Help?
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4 border-t border-[#ead9ff]">
              <div>
                <p className="text-3xl text-[#5E3B76] font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  520+
                </p>
                <p className="text-xs uppercase tracking-wide text-[#8a7ba8]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Happy Dogs
                </p>
              </div>
              <div>
                <p className="text-3xl text-[#5E3B76] font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  ${savingsCounter}
                </p>
                <p className="text-xs uppercase tracking-wide text-[#8a7ba8]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Avg. Savings
                </p>
              </div>
              <div>
                <p className="text-3xl text-[#5E3B76] font-bold flex items-center gap-1" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  4.9 <Star className="w-5 h-5 fill-[#f6a723] text-[#f6a723]" />
                </p>
                <p className="text-xs uppercase tracking-wide text-[#8a7ba8]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Rating
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Savings Card */}
            <div className="col-span-2 bg-gradient-to-br from-[#9657EE] to-[#C26AF0] rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-3 rounded-lg">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    You Save
                  </p>
                  <p className="text-4xl font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    ${savingsCounter}
                  </p>
                </div>
              </div>
              <p className="text-sm opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                vs buying individually
              </p>
            </div>

            {/* Benefit Card 1 */}
            <div className="bg-white border-2 border-[#ead9ff] rounded-xl p-4 hover:shadow-lg transition-shadow">
              <div className="bg-[#d8c6ff] p-3 rounded-lg w-fit mb-2">
                <Truck className="w-5 h-5 text-[#5E3B76]" />
              </div>
              <p className="text-sm font-semibold text-[#5E3B76] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Free Shipping
              </p>
              <p className="text-xs text-[#8a7ba8]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                On orders $165+
              </p>
            </div>

            {/* Benefit Card 2 */}
            <div className="bg-white border-2 border-[#ead9ff] rounded-xl p-4 hover:shadow-lg transition-shadow">
              <div className="bg-[#d8c6ff] p-3 rounded-lg w-fit mb-2">
                <Calendar className="w-5 h-5 text-[#5E3B76]" />
              </div>
              <p className="text-sm font-semibold text-[#5E3B76] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Flexible
              </p>
              <p className="text-xs text-[#8a7ba8]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bundles Grid */}
      <section id="bundles" className="bg-[#f5f0ff] px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-normal text-[#5E3B76] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Choose Your Bundle
            </h2>
            <p className="text-lg text-[#8a7ba8]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Select a pre-configured bundle or customize to match your dog's preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bundles.map((bundle) => (
              <div
                key={bundle.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-lg border-2 transition-all duration-300 ${
                  bundle.isBestValue
                    ? 'border-[#9657EE] shadow-xl transform scale-105'
                    : 'border-[#ead9ff] hover:border-[#C26AF0] hover:shadow-xl'
                }`}
              >
                {/* Badge */}
                {bundle.badgeText && (
                  <div className={`text-center py-2 text-white text-sm font-bold ${
                    bundle.isBestValue ? 'bg-[#9657EE]' : bundle.isFeatured ? 'bg-[#5E3B76]' : 'bg-[#8a7ba8]'
                  }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {bundle.badgeText}
                  </div>
                )}

                {/* Image Gallery */}
                <div className="relative h-48 bg-gradient-to-br from-[#ead9ff] to-[#ead9ff] p-4">
                  <div className="grid grid-cols-3 gap-2 h-full">
                    {sampleProductImages.slice(0, 3).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setLightboxImage(img)}
                        className="relative group overflow-hidden rounded-lg border-2 border-[#ead9ff] hover:border-[#5E3B76] transition-all bg-white"
                      >
                        <Image
                          src={img}
                          alt={`Bundle product ${idx + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-[#5E3B76]">
                    Click to enlarge
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-[#5E3B76] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    {bundle.name}
                  </h3>

                  <p className="text-sm text-[#C26AF0] font-semibold mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {bundle.tagline}
                  </p>

                  <p className="text-sm text-[#8a7ba8] mb-4 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {bundle.description}
                  </p>

                  {/* Pricing */}
                  <div className="mb-4 pb-4 border-b border-[#ead9ff]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-[#5E3B76]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        ${bundle.basePrice.toFixed(2)}
                      </span>
                      {bundle.savingsAmount > 0 && (
                        <span className="text-sm text-[#C26AF0] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Save ${bundle.savingsAmount.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8a7ba8] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {bundle.shipping}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {bundle.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#8a7ba8]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <Check className="w-4 h-4 text-[#5E3B76] flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {bundle.customizable ? (
                      <>
                        <button
                          onClick={() => handleCustomizeBundle(bundle)}
                          className="w-full bg-[#5E3B76] text-white py-3 rounded-lg font-semibold hover:bg-[#7B4FA1] transition-colors"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Customize & Order
                        </button>
                        <Link
                          href={`/shop?bundle=${bundle.slug}`}
                          className="block w-full bg-white text-[#5E3B76] border-2 border-[#5E3B76] py-3 rounded-lg font-semibold hover:bg-[#5E3B76] hover:text-white transition-colors text-center"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Quick Add to Cart
                        </Link>
                      </>
                    ) : (
                      <Link
                        href={`/shop?bundle=${bundle.slug}`}
                        className="block w-full bg-[#C26AF0] text-white py-3 rounded-lg font-semibold hover:bg-[#9657EE] transition-colors text-center"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Subscribe Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customization Modal */}
      {customizing && currentBundle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-[#5E3B76] text-white px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Customize {currentBundle.name}
                </h2>
                <button
                  onClick={() => setCustomizing(false)}
                  className="text-white hover:text-[#ead9ff] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Purchase Type */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#5E3B76] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Choose Purchase Type
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setCustomSelection(prev => ({ ...prev, frequency: 'one-time' }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      customSelection.frequency === 'one-time'
                        ? 'border-[#5E3B76] bg-[#5E3B76]/5'
                        : 'border-[#ead9ff] hover:border-[#5E3B76]'
                    }`}
                  >
                    <div className="font-semibold text-[#5E3B76]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      One-Time Purchase
                    </div>
                    <div className="text-sm text-[#8a7ba8]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      ${currentBundle.basePrice.toFixed(2)}
                    </div>
                  </button>
                  <button
                    onClick={() => setCustomSelection(prev => ({ ...prev, frequency: 'monthly' }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      customSelection.frequency !== 'one-time'
                        ? 'border-[#5E3B76] bg-[#5E3B76]/5'
                        : 'border-[#ead9ff] hover:border-[#5E3B76]'
                    }`}
                  >
                    <div className="font-semibold text-[#5E3B76] flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Subscribe & Save
                      <span className="bg-[#C26AF0] text-white text-xs px-2 py-0.5 rounded">3%</span>
                    </div>
                    <div className="text-sm text-[#8a7ba8]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      ${(currentBundle.basePrice * 0.97).toFixed(2)}/delivery
                    </div>
                  </button>
                </div>

                {/* Subscription Frequency */}
                {customSelection.frequency !== 'one-time' && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-[#5E3B76] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Delivery Frequency
                    </label>
                    <select
                      value={customSelection.frequency}
                      onChange={(e) => setCustomSelection(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-[#ead9ff] rounded-lg focus:border-[#5E3B76] focus:outline-none"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {currentBundle.subscriptionOptions.filter(opt => opt !== 'one-time').map(option => (
                        <option key={option} value={option}>
                          {option === 'weekly' && 'Every Week'}
                          {option === 'biweekly' && 'Every 2 Weeks'}
                          {option === 'monthly' && 'Every Month'}
                          {option === '4-weeks' && 'Every 4 Weeks'}
                          {option === '6-weeks' && 'Every 6 Weeks'}
                          {option === '8-weeks' && 'Every 8 Weeks'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Product Selection */}
              {currentBundle.includedItems.map((item, idx) => (
                <div key={idx} className="mb-8 pb-8 border-b border-[#ead9ff] last:border-0">
                  <h3 className="text-lg font-semibold text-[#5E3B76] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {item.description}
                    <span className="text-sm text-[#8a7ba8] ml-2">
                      (Select {item.quantity})
                    </span>
                  </h3>

                  {item.options ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {item.options.map((option) => {
                        const selected = (customSelection.selectedItems[item.category] || []).includes(option);
                        return (
                          <button
                            key={option}
                            onClick={() => handleItemSelection(item.category, option, item.quantity)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              selected
                                ? 'border-[#5E3B76] bg-[#5E3B76]/5'
                                : 'border-[#ead9ff] hover:border-[#5E3B76]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[#5E3B76]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                {option}
                              </span>
                              {selected && <Check className="w-5 h-5 text-[#5E3B76]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-[#ead9ff] p-4 rounded-lg">
                      <p className="text-[#8a7ba8]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {item.description} included automatically
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Add to Cart Button */}
              <div className="sticky bottom-0 bg-white pt-6 border-t border-[#ead9ff]">
                <button
                  onClick={handleAddToCart}
                  disabled={!isSelectionComplete(currentBundle)}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                    isSelectionComplete(currentBundle)
                      ? 'bg-[#5E3B76] text-white hover:bg-[#7B4FA1]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {isSelectionComplete(currentBundle)
                    ? customSelection.frequency === 'one-time'
                      ? `Add to Cart - $${currentBundle.basePrice.toFixed(2)}`
                      : `Subscribe - $${(currentBundle.basePrice * 0.97).toFixed(2)}`
                    : 'Please complete your selections'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why Bundle Section */}
      <section className="bg-[#ead9ff] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-normal text-[#5E3B76] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Why Choose Bundles?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-[#ead9ff]">
              <div className="bg-[#5E3B76] w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#5E3B76] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Save Money
              </h3>
              <p className="text-[#8a7ba8] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Save up to $19 compared to buying items individually. Plus get an extra 3% off with subscription!
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-[#ead9ff]">
              <div className="bg-[#C26AF0] w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#5E3B76] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Convenience
              </h3>
              <p className="text-[#8a7ba8] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Everything your dog needs in one package. Set up auto-delivery and never run out of fresh food.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-[#ead9ff]">
              <div className="bg-[#5E3B76] w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#5E3B76] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Variety
              </h3>
              <p className="text-[#8a7ba8] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Mix and match proteins and toppers to keep mealtime exciting for your pup!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-normal text-[#5E3B76] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Bundle FAQs
          </h2>

          <div className="space-y-4">
            {[
              {
                question: 'Can I customize what goes in my bundle?',
                answer: 'Yes! Most bundles are fully customizable. You can choose which meals, toppers, and proteins you want. The Waggin Meals Club Box is the only pre-curated bundle.',
              },
              {
                question: 'How does Subscribe & Save work?',
                answer: 'Choose your preferred delivery frequency (weekly, biweekly, monthly, or every 4/6/8 weeks) and save 3% on every order. You can pause, skip, or cancel anytime with no commitment.',
              },
              {
                question: 'Is shipping included?',
                answer: 'Yes! Shipping is included in all bundle prices. Orders over $165 qualify for free shipping. Add $1 per beef meal to your bundle price.',
              },
              {
                question: 'Can I change my bundle selections?',
                answer: 'Absolutely! For subscriptions, you can modify your selections before each delivery. Just log into your account or contact us.',
              },
              {
                question: 'What if my dog doesn\'t like something?',
                answer: 'We offer a satisfaction guarantee. If your dog doesn\'t love their meals, reach out and we\'ll make it right with a replacement or refund.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="border border-[#ead9ff] rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-[#ead9ff] hover:bg-[#ead9ff]/30 transition-colors"
                >
                  <span className="font-semibold text-[#5E3B76] text-left" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {faq.question}
                  </span>
                  {expandedFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-[#5E3B76] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#5E3B76] flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 py-4 bg-white">
                    <p className="text-[#8a7ba8] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#5E3B76] via-[#7B4FA1] to-[#5E3B76] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Not Sure Which Bundle Is Right?
          </h2>
          <p className="text-xl text-white/90 mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Get a free consultation with our certified nutritionist to find the perfect bundle for your dog
          </p>

          <Link
            href="/contact-expert"
            className="inline-block bg-white text-[#5E3B76] px-8 py-4 rounded-lg font-semibold hover:bg-[#ead9ff] transition-colors shadow-lg"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Book Free Consultation
          </Link>
        </div>
      </section>

      {/* Image Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image
              src={lightboxImage}
              alt="Enlarged product view"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </main>
  );
}
