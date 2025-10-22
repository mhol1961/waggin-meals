# Code-First Development Guide (Without Figma)

**Building Waggin Meals Next.js site by replicating the existing WordPress design**

This guide explains how to build the new Next.js site without Figma mockups, using the existing WordPress site as the single source of truth for design.

---

## Philosophy

Instead of designing in Figma then coding, we:
1. **Reference** the existing live site (www.wagginmeals.com) and screenshots
2. **Extract** design tokens (colors, fonts, spacing) into DESIGN_SYSTEM.md
3. **Build** components directly with shadcn/ui and Tailwind CSS
4. **Match** the visual design pixel-by-pixel to maintain brand consistency
5. **Enhance** with modern features (subscriptions, pet profiles) while keeping the look/feel

---

## Reference Materials

### Primary References
1. **Live WordPress Site:** https://www.wagginmeals.com
   - Browse every page
   - Use browser DevTools to inspect elements
   - Take screenshots as needed

2. **Existing Screenshots (in `/waggin-meals/` folder):**
   - `home_page_wagginmeals.png` - Homepage layout and sections
   - `lets_chat_wagginmeals_page.png` - Farm story and team
   - `nutrition_services_wagginmeals_page.png` - Consultation services
   - `shop_redirect_to_shopify.png` - Shop page (Shopify redirect)
   - `shipping-delivery.png` - Shopify admin (reference only)

3. **Design System Document:** `DESIGN_SYSTEM.md`
   - All colors, fonts, spacing values
   - Component specifications
   - Layout patterns

---

## Development Workflow

### Step 1: Inspect the Existing Page

**Using Browser DevTools:**

```bash
# Visit the page you're building
open https://www.wagginmeals.com

# Right-click any element → Inspect
# In DevTools:
# - Check Colors: Look for background-color, color properties
# - Check Spacing: Look for padding, margin values
# - Check Typography: Look for font-family, font-size, font-weight
# - Check Layout: Look for display (flex, grid), gap, etc.
```

**Key things to extract:**
- Section background colors
- Text colors and sizes
- Button styles (padding, border-radius, colors)
- Image dimensions and aspect ratios
- Grid/flex layouts (columns, gaps)
- Hover effects and transitions

---

### Step 2: Take Screenshots for Reference

**If you need a new screenshot:**

```bash
# Install Playwright browsers (one-time setup)
npx playwright install

# Or use browser screenshot tools
# Or use browser extensions like "Full Page Screen Capture"
```

**Best Practice:**
- Take full-page screenshots (not just viewport)
- Screenshot each unique page template
- Screenshot key components (navigation, footer, forms)
- Save in `/waggin-meals/screenshots/` with descriptive names

---

### Step 3: Build Component with shadcn/ui

**Example: Building the Hero Section**

1. **Analyze the existing hero:**
   - Background: Full-width image
   - Text: Centered headline + subheadline
   - Button: CTA button in brand style
   - Height: ~500-600px

2. **Create the component:**

```tsx
// /components/hero-section.tsx
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}

export function HeroSection({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage,
}: HeroSectionProps) {
  return (
    <section className="relative h-[500px] md:h-[600px] w-full">
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt=""
        fill
        className="object-cover"
        priority
      />

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="max-w-4xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {title}
          </h1>
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            {subtitle}
          </p>
          <Button asChild size="lg">
            <a href={ctaLink}>{ctaText}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
```

3. **Match styles from DESIGN_SYSTEM.md:**
   - Text sizes: Use Tailwind classes that match design tokens
   - Colors: Use custom Tailwind colors from config
   - Spacing: Use space scale from design system
   - Button: Customize shadcn Button component to match brand

---

### Step 4: Customize shadcn/ui Components

shadcn/ui provides unstyled components. You customize them to match your brand.

**Example: Customizing Button Component**

```tsx
// /components/ui/button.tsx (after running `npx shadcn-ui@latest add button`)

// Update the buttonVariants to match Waggin Meals brand:

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[3px] text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#32373c] text-white hover:bg-transparent hover:text-[#32373c] hover:border-2 hover:border-[#32373c]",
        primary: "bg-[#2ea3f2] text-white hover:bg-[#2089c9]",
        outline: "border-2 border-[#32373c] bg-transparent text-[#32373c] hover:bg-[#32373c] hover:text-white",
        ghost: "hover:bg-gray-100",
      },
      size: {
        default: "px-4 py-2",
        sm: "px-3 py-1.5 text-xs",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

**Now your buttons match the brand:**
```tsx
<Button variant="default">Shop Now</Button>  {/* Dark gray button */}
<Button variant="primary">Get Started</Button>  {/* Blue button */}
```

---

### Step 5: Build Layouts Matching Screenshots

**Example: Three-Column Feature Section (from homepage)**

Looking at `home_page_wagginmeals.png`, there are 3 features:
1. Fresh & Sustainably Sourced
2. Nutritionist Formulated, Handcrafted
3. Whole Food

**Build it:**

```tsx
// /components/features-section.tsx
import { CheckCircle, Leaf, Heart } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: "Fresh & Sustainably Sourced",
    description: "Locally sourced ingredients from our farm partners in the Blue Ridge Mountains.",
  },
  {
    icon: Heart,
    title: "Nutritionist Formulated, Handcrafted",
    description: "Created by an Animal Nutritionist (Master's degrees) and prepared in our certified kitchen.",
  },
  {
    icon: CheckCircle,
    title: "Whole Food Ingredients",
    description: "Our meals support overall health, boost immunity, and help your dog thrive from the inside out.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center">
                <div className="mb-4 flex justify-center">
                  <Icon className="h-12 w-12 text-[#2ea3f2]" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#333333]">
                  {feature.title}
                </h3>
                <p className="text-[#666666] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

---

### Step 6: Side-by-Side Comparison

**Deploy Early and Compare:**

1. **Deploy to Vercel staging** after building each section
2. **Open two browser windows:**
   - Left: Original WordPress site
   - Right: Your new Next.js site
3. **Compare pixel-by-pixel:**
   - Colors match?
   - Font sizes match?
   - Spacing matches?
   - Hover effects match?
4. **Adjust as needed**

**Use browser tools to overlay:**
```css
/* Temporarily add to your site for comparison */
.debug-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  opacity: 0.5;
  background: url('screenshot.png') no-repeat;
  background-size: contain;
  pointer-events: none;
  z-index: 9999;
}
```

---

## Common Patterns

### Pattern 1: Image + Text Section

**From screenshots: Founder story section**

```tsx
export function FounderStory() {
  return (
    <section className="py-20 bg-[#e8f4fb]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/images/christie-with-dog.jpg"
              alt="Christie Willett, Founder"
              fill
              className="object-cover"
            />
          </div>

          {/* Text Content */}
          <div>
            <blockquote className="relative mb-6">
              <span className="absolute -top-4 -left-4 text-6xl text-[#2ea3f2] opacity-20">
                "
              </span>
              <p className="text-lg text-[#666666] leading-relaxed italic">
                I do not try to compete with big box companies. What we offer is
                specialized nutrition, bite sizes, and do not mass produce. We
                actually care about your special dog needs.
              </p>
            </blockquote>
            <p className="font-bold text-[#333333]">
              — Christie A. Willett, M.A., M.S., Canine Integrative Animal Nutritionist,
              Owner of Waggin Meals
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

### Pattern 2: Testimonial Grid

**From screenshots: 4-column testimonials**

```tsx
const testimonials = [
  {
    quote: "Our dog Misty loves Waggin Meals!",
    author: "Mark Smith - Missy",
  },
  {
    quote: "Our large pup loves these food pouches.",
    author: "Elizabeth James",
  },
  // ... more testimonials
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-[#333333]">
          Happy Customers & Waggin Tails
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative rounded-lg bg-white p-6 shadow-md"
            >
              <div className="mb-4 text-4xl text-[#2ea3f2] opacity-20">"</div>
              <p className="mb-4 text-sm text-[#666666] leading-relaxed">
                {testimonial.quote}
              </p>
              <p className="text-xs font-bold text-[#333333]">
                {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### Pattern 3: Contact Form

**From screenshots: Contact page form**

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Handle form submission
    const formData = new FormData(e.currentTarget);
    // ... submit logic

    setIsSubmitting(false);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-[#333333]">
          Get in touch with us!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-[#333333]">
                Name
              </label>
              <Input
                id="name"
                name="name"
                required
                className="border-[#dddddd]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#333333]">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="border-[#dddddd]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-[#333333]">
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              required
              rows={5}
              className="border-[#dddddd]"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'SENDING...' : 'SUBMIT'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
```

---

## Tips for Pixel-Perfect Matching

### 1. Use Exact Color Values

**Don't:**
```tsx
<div className="bg-blue-500"> {/* Generic Tailwind blue */}
```

**Do:**
```tsx
<div className="bg-[#2ea3f2]"> {/* Exact brand blue */}
```

Or better yet, define in Tailwind config:
```js
// tailwind.config.js
colors: {
  'brand-blue': '#2ea3f2',
}

// Then use:
<div className="bg-brand-blue">
```

---

### 2. Match Font Weights Exactly

The existing site uses **500 weight** for body text (not the default 400).

**Tailwind config:**
```js
// tailwind.config.js
extend: {
  fontWeight: {
    'body': 500,
  }
}
```

**Usage:**
```tsx
<p className="font-body text-[#666666]">Body text</p>
```

---

### 3. Match Spacing Precisely

Don't guess at padding/margins. Extract exact values from DevTools.

**Example from DevTools:**
```css
/* Existing site */
padding: 80px 20px;
```

**Your component:**
```tsx
<section className="py-20 px-5"> {/* 80px = 20 * 4px, 20px = 5 * 4px */}
```

---

### 4. Match Border Radius

The existing site uses subtle rounded corners (**3px** for buttons, **8px** for cards).

**Tailwind config:**
```js
borderRadius: {
  'btn': '3px',
  'card': '8px',
}
```

---

### 5. Match Hover Effects

The existing site has specific hover effects. Replicate them exactly.

**Example: Button hover**
```css
/* Existing button hover */
.button:hover {
  background: transparent;
  color: #32373c;
  border: 2px solid #32373c;
  padding: 0.3em 2em 0.3em 0.7em; /* Extended right padding */
}
```

**In Tailwind:**
```tsx
<button className="px-4 py-2 bg-[#32373c] text-white border-2 border-transparent hover:bg-transparent hover:text-[#32373c] hover:border-[#32373c] hover:px-8 transition-all">
  Shop Now
</button>
```

---

## Content Migration

### Images

1. **Download images from WordPress:**
   - Right-click images → Save As
   - Or use browser DevTools → Network tab → Filter Images
   - Or use WordPress export tools

2. **Organize in Next.js:**
   ```
   /public/images/
     ├── hero/
     │   └── homepage-hero.jpg
     ├── products/
     │   ├── chicken-meal.jpg
     │   └── turkey-meal.jpg
     ├── team/
     │   ├── christie.jpg
     │   └── tres.jpg
     └── farm/
         └── lavender-field.jpg
   ```

3. **Optimize with Next.js Image:**
   ```tsx
   import Image from 'next/image';

   <Image
     src="/images/hero/homepage-hero.jpg"
     alt="Fresh dog food in bowl"
     width={1200}
     height={600}
     priority
     className="object-cover"
   />
   ```

---

### Text Content

1. **Copy text from WordPress pages**
2. **Store in JSON or markdown:**

```json
// /content/homepage.json
{
  "hero": {
    "title": "Waggin Meals Pet Nutrition Co.",
    "subtitle": "High-Grade & Freshly Cooked Dog Food - Small Batch Kitchen - Canine Nutritionist",
    "cta": "Shop Waggin Meals"
  },
  "features": [
    {
      "title": "Fresh & Sustainably Sourced",
      "description": "Free Shipping for orders over $100.00..."
    },
    // ...
  ]
}
```

3. **Or use Markdown for long-form content:**
```md
<!-- /content/our-story.md -->
# From our Farm Shop In Western North Carolina to Your Waggin Bowl!

Christie Willett, Founder of Waggin Meals and An Animal Nutritionist...
```

---

## Responsive Design

The existing site is mobile-responsive. Match the breakpoints.

**Mobile Navigation:**
- Desktop: Horizontal menu (visible above 980px)
- Mobile: Hamburger menu (below 980px)

**Grid Layouts:**
```tsx
{/* 1 column mobile, 3 columns desktop */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

{/* 1 column mobile, 2 columns tablet, 4 columns desktop */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
```

**Font Sizes:**
```tsx
{/* Smaller on mobile, larger on desktop */}
<h1 className="text-3xl md:text-4xl lg:text-5xl">

{/* Responsive padding */}
<section className="py-12 md:py-16 lg:py-20">
```

---

## Deployment & Testing

### Deploy Frequently

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys on every push (if connected)
# Or manually deploy:
vercel --prod
```

### Preview Links

Share Vercel preview links with Christie/Tres for feedback:
```
https://waggin-meals-abc123.vercel.app
```

### Testing Checklist

- [ ] Visit on mobile device (iPhone, Android)
- [ ] Test on tablet (iPad)
- [ ] Test on desktop (large screen)
- [ ] Check all links work
- [ ] Check images load properly
- [ ] Verify colors match exactly
- [ ] Test forms submit correctly
- [ ] Check navigation menu (hamburger on mobile)

---

## When to Enhance Beyond Original

While matching the original design, enhance in these areas:

### 1. Performance
- Lazy load images below fold
- Use Next.js Image optimization
- Implement ISR for product pages
- Add loading skeletons

### 2. Animations (Subtle)
- Fade-in on scroll (Framer Motion or CSS)
- Smooth transitions between pages
- Micro-interactions on hover

### 3. Accessibility
- Add proper ARIA labels
- Ensure keyboard navigation
- Improve color contrast if needed
- Add skip navigation links

### 4. Modern Features
- Add product quick view
- Implement search
- Add filter/sort controls
- Build subscription management portal

**Principle:** Match the look, enhance the functionality.

---

## Summary

**Your workflow:**
1. **Look** at WordPress site + screenshots
2. **Extract** design tokens into DESIGN_SYSTEM.md
3. **Build** with Next.js + shadcn/ui + Tailwind
4. **Match** pixel-by-pixel
5. **Deploy** to staging
6. **Compare** side-by-side
7. **Adjust** as needed
8. **Get approval** from Christie/Tres
9. **Repeat** for next section/page

**No Figma needed** – the existing site IS your design file.

---

## Questions?

If unsure about a design detail:
1. Inspect the live site with DevTools
2. Check screenshots for reference
3. Ask Christie/Tres for clarification
4. When in doubt, match the existing site exactly

**Remember:** The goal is to replicate the WordPress site's look while modernizing the technology underneath. The customer should feel "this is Waggin Meals" but faster and with better features.
