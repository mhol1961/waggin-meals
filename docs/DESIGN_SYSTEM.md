# Waggin Meals Design System

**Extracted from existing WordPress site at www.wagginmeals.com**

This document codifies the visual design from the current site to maintain brand consistency during the Next.js rebuild.

---

## Color Palette

### Primary Colors
```css
--primary-blue: #2ea3f2;        /* Bright blue - links, accents, CTAs */
--primary-dark: #32373c;        /* Dark gray - buttons, footer */
--primary-white: #ffffff;       /* Backgrounds, cards */
```

### Text Colors
```css
--text-heading: #333333;        /* Headings */
--text-body: #666666;           /* Body text */
--text-muted: #999999;          /* Secondary text */
```

### Backgrounds & Borders
```css
--bg-light-blue: #e8f4fb;      /* Light blue backgrounds (sections) */
--bg-light-gray: #f5f5f5;      /* Alternate section backgrounds */
--bg-green-accent: #4CAF50;    /* Green accent (fresh/natural theme) */

--border-light: #e2e2e2;       /* Light borders */
--border-medium: #dddddd;      /* Medium borders */
--border-dark: #bbbbbb;        /* Darker borders */
```

### Accent Colors (from photos)
```css
--accent-lavender: #9b7fc5;    /* From farm lavender photos */
--accent-sage: #a8c5a8;        /* Natural/organic feel */
```

---

## Typography

### Font Family
```css
--font-family: 'Open Sans', Arial, sans-serif;
```

### Font Sizes
```css
--text-xs: 12px;
--text-sm: 14px;    /* Body text */
--text-base: 16px;
--text-lg: 18px;    /* H4 */
--text-xl: 22px;    /* H3 */
--text-2xl: 26px;   /* H2 */
--text-3xl: 30px;   /* H1 */
--text-4xl: 36px;   /* Hero headlines */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;  /* Body text default */
--font-semibold: 600;
--font-bold: 700;    /* Headings */
```

### Line Heights
```css
--leading-tight: 1.2;
--leading-normal: 1.5;
--leading-relaxed: 1.7;  /* Body text */
--leading-loose: 2;
```

---

## Spacing Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

---

## Components

### Buttons

**Primary Button (Dark)**
```css
background: #32373c;
color: #ffffff;
padding: 0.3em 1em;
border-radius: 3px;
font-size: 14px;
font-weight: 500;
border: none;
```

**Primary Button Hover**
```css
background: transparent;
color: #32373c;
border: 2px solid #32373c;
padding: 0.3em 2em 0.3em 0.7em;
```

**Secondary Button (Blue)**
```css
background: #2ea3f2;
color: #ffffff;
padding: 12px 24px;
border-radius: 3px;
font-size: 14px;
font-weight: 500;
```

**Button Sizes**
- Small: `padding: 8px 16px; font-size: 12px;`
- Medium: `padding: 12px 24px; font-size: 14px;` (default)
- Large: `padding: 16px 32px; font-size: 16px;`

---

### Navigation

**Header**
```css
background: #ffffff;
height: 80px;
position: sticky;
top: 0;
z-index: 1000;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
```

**Logo**
- Position: Left-aligned
- Max height: 60px
- Link to homepage

**Menu Items**
```css
font-size: 14px;
font-weight: 500;
color: #333333;
padding: 0 20px;
text-transform: uppercase;
letter-spacing: 0.5px;
```

**Menu Item Hover**
```css
color: #2ea3f2;
```

**Mobile Menu**
- Breakpoint: 980px
- Hamburger icon (3 bars)
- Slide-in drawer from right
- Full-height overlay

---

### Cards & Sections

**Feature Card**
```css
background: #ffffff;
padding: 32px;
border-radius: 8px;
box-shadow: 0 2px 8px rgba(0,0,0,0.08);
```

**Section Container**
```css
max-width: 1200px;
margin: 0 auto;
padding: 80px 20px;
```

**Alternating Section Backgrounds**
- White: `#ffffff`
- Light gray: `#f5f5f5`
- Light blue: `#e8f4fb`

---

### Images

**Hero Image**
- Full-width
- Height: 500-600px
- Object-fit: cover
- Optional overlay for text readability

**Product Images**
- Aspect ratio: 1:1 (square)
- Border radius: 8px
- Hover effect: subtle scale (1.05)

**Testimonial Photos**
- Circular (border-radius: 50%)
- Size: 80px x 80px
- Border: 3px solid #2ea3f2

**Gallery Images**
- Grid layout (3-4 columns)
- Gap: 16px
- Hover effect: opacity 0.9

---

### Forms

**Input Fields**
```css
border: 1px solid #dddddd;
border-radius: 3px;
padding: 12px 16px;
font-size: 14px;
font-family: 'Open Sans', sans-serif;
color: #666666;
background: #ffffff;
```

**Input Focus**
```css
border-color: #2ea3f2;
outline: none;
box-shadow: 0 0 0 3px rgba(46, 163, 242, 0.1);
```

**Textarea**
```css
/* Same as input */
min-height: 120px;
resize: vertical;
```

**Labels**
```css
font-size: 14px;
font-weight: 500;
color: #333333;
margin-bottom: 8px;
display: block;
```

**Error States**
```css
border-color: #e74c3c;
```

---

### Testimonials

**Testimonial Card**
```css
background: #ffffff;
padding: 32px;
border-radius: 8px;
box-shadow: 0 2px 8px rgba(0,0,0,0.08);
position: relative;
```

**Quote Icon**
- Font size: 48px
- Color: #2ea3f2
- Opacity: 0.2
- Position: absolute top-left

**Customer Name**
```css
font-size: 14px;
font-weight: 700;
color: #333333;
margin-top: 16px;
```

---

### Icons

**Style**: Line icons (outline style)
**Size**: 24px standard, 32px for features
**Color**: #2ea3f2 (blue accent)

**Common Icons Needed**:
- Checkmark (verified/features)
- Heart (testimonials)
- Paw print (pet-related)
- Leaf (organic/natural)
- Truck (shipping)
- Shield (FDA/AAFCO approved)
- User (account)
- Shopping bag (cart)

---

## Layout Patterns

### Homepage Structure

1. **Hero Section**
   - Full-width image or background
   - Centered headline + subheadline
   - CTA button
   - Height: 500-600px

2. **Feature Section (3-column)**
   - Icon/image at top
   - Headline
   - Description text
   - Optional CTA link
   - Padding: 80px vertical

3. **Founder Story Section**
   - 2-column layout (image left, text right)
   - Image: 50% width
   - Quote formatting with large quotation marks
   - Background: light color (#e8f4fb or #f5f5f5)

4. **Testimonials Section**
   - 4-column grid
   - Quote cards with customer names
   - Section title: "Happy Customers & Waggin Tails"
   - Background: white

5. **Footer**
   - 3-column layout
   - Our Promise | Important Info | Quick Links
   - Background: light gray
   - Copyright at bottom

---

### Product Page Structure

1. **Product Gallery + Details**
   - Left: Image gallery (60%)
   - Right: Product info (40%)
   - Sticky product info on scroll

2. **Product Info**
   - Title (H1)
   - Price
   - Subscription toggle
   - Frequency selector
   - Add to cart button (prominent)
   - Trust badges (FDA, AAFCO)

3. **Product Tabs**
   - Description
   - Ingredients
   - Nutrition Facts
   - Feeding Guide

---

### Subscription Portal Structure

1. **Dashboard Cards**
   - Grid layout (2 columns)
   - Card per subscription
   - Product image + details
   - Action buttons below

2. **Subscription Card**
   - Product name + image
   - Next delivery date (countdown)
   - Frequency
   - Status badge
   - Actions: Pause | Skip | Manage

---

## Responsive Breakpoints

```css
/* Mobile first approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktops */
--breakpoint-xl: 1280px;  /* Large desktops */
--breakpoint-2xl: 1536px; /* Extra large */
```

**Navigation breakpoint**: 980px (mobile menu below this)

---

## Animations

**Transitions**
```css
transition: all 0.3s ease;
```

**Hover Effects**
- Buttons: Background color change + slight scale
- Images: Subtle zoom (scale 1.05)
- Links: Color change to #2ea3f2
- Cards: Slight lift (translateY -4px) + shadow increase

**Page Load**
- Fade-in for sections
- Stagger delay for cards (0.1s increments)

---

## Accessibility

- All interactive elements: min 44x44px tap targets
- Color contrast: WCAG AA compliant (4.5:1 for text)
- Focus indicators: 3px outline in primary blue
- Alt text for all images
- ARIA labels for icon-only buttons
- Semantic HTML (nav, main, article, aside, footer)

---

## Usage with Tailwind CSS

Map these values to Tailwind config:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#2ea3f2',
          dark: '#32373c',
        },
        text: {
          heading: '#333333',
          body: '#666666',
          muted: '#999999',
        },
        bg: {
          'light-blue': '#e8f4fb',
          'light-gray': '#f5f5f5',
        }
      },
      fontFamily: {
        sans: ['Open Sans', 'Arial', 'sans-serif'],
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '22px',
        '2xl': '26px',
        '3xl': '30px',
        '4xl': '36px',
      },
      // ... etc
    }
  }
}
```

---

## Component Priority for Development

**Week 1-2**: Foundation
1. ✅ Design tokens defined (this file)
2. ✅ Tailwind config with custom theme
3. Navigation header + mobile menu
4. Footer
5. Button components (primary, secondary, sizes)

**Week 3-4**: Core Pages
1. Homepage layout
2. Hero section component
3. Feature cards component
4. Testimonial component
5. Product card component

**Week 5-6**: Product & Commerce
1. Product listing page
2. Product detail page
3. Shopping cart sidebar
4. Checkout flow

**Week 7-8**: Advanced Features
1. Subscription selector
2. Pet profile forms
3. Customer portal
4. Account management

---

**This design system ensures visual consistency while rebuilding the site in Next.js without needing Figma mockups.**
