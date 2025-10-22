# Waggin' Meals WordPress Site - Complete Homepage Analysis

**Date:** October 20, 2025
**Source URL:** https://www.wagginmeals.com
**WordPress Theme:** Divi v4.27.4 by Elegant Themes

---

## Table of Contents

1. [Downloaded Images & Assets](#downloaded-images--assets)
2. [Typography System](#typography-system)
3. [Color Palette](#color-palette)
4. [Layout Structure](#layout-structure)
5. [Section-by-Section Breakdown](#section-by-section-breakdown)
6. [CSS Specifications](#css-specifications)
7. [Responsive Breakpoints](#responsive-breakpoints)
8. [Exact Reconstruction Guide](#exact-reconstruction-guide)

---

## Downloaded Images & Assets

All images have been downloaded to `/mnt/c/waggin-meals/public/images/`

### Image Inventory

| Filename | Original Dimensions | Aspect Ratio | Purpose | Original URL |
|----------|-------------------|--------------|---------|--------------|
| `logo-waggin-meals.png` | 512 x 512 | 1:1 | Site logo (square) | https://wagginmeals.com/wp-content/uploads/2025/07/cropped-WagginMealsLogoNoName.png |
| `beef-sweet-potato-bowl.jpg` | 2560 x 1707 | ~3:2 | Hero product image | https://wagginmeals.com/wp-content/uploads/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg |
| `chicken-superfood-board.jpg` | 2560 x 1716 | ~3:2 | Product image | https://wagginmeals.com/wp-content/uploads/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg |
| `woman-with-white-dog.webp` | 1200 x 650 | ~1.85:1 | Canine nutrition services | https://wagginmeals.com/wp-content/uploads/2025/09/Canine-Nutrtion-Services.webp |
| `waggin-logos.png` | 1200 x 628 | ~1.91:1 | Logo variations/branding | https://wagginmeals.com/wp-content/uploads/2025/07/png-logos.png |

### Responsive Image Sizes (WordPress)

WordPress generates multiple sizes for each image:
- **Original/Full**: 2560px width
- **Large**: 1280px width
- **Medium**: 980px width
- **Small/Mobile**: 480px width

---

## Typography System

### Primary Font Families

1. **Headings (Display Font):**
   - Font: `'Abril Fatface', display`
   - Weight: Regular
   - Used for: Main hero headings

2. **Body & Navigation:**
   - Font: `'Poppins', Helvetica, Arial, Lucida, sans-serif`
   - Weights available: 100, 200, 300, 400 (regular), 500, 600, 700, 800, 900
   - Italic variants: All weights
   - Used for: Body text, navigation, subheadings, buttons

3. **Additional Fonts:**
   - `'Abhaya Libre'` - weights: regular, 500, 600, 700, 800
   - `'ABeeZee'` - weights: regular, italic

### Font Sizes - Desktop

| Element | Size | CSS Selector |
|---------|------|--------------|
| H1 (Hero) | 40px | `.et_pb_text_0 h1` |
| H2 (Section Heading) | 28px | `.et_pb_text_0 h2`, `.et_pb_heading_0` |
| H3 | 22px | `.et_pb_text_0 h3` |
| H4 (Blurb Headings) | 18px | `.et_pb_text_0 h4` |
| H5 | 16px | - |
| H6 | 13px | `.et_pb_text_0 h6` |
| Body Text | 15px | Default |
| Button Text | 21px | `body .et_pb_button` |

### Font Sizes - Tablet (max-width: 980px)

| Element | Size |
|---------|------|
| H1 | 32px |
| H2 | 26px |
| H3 | 22px |
| H4 | 18px |
| H5 | 16px |
| H6 | 14px |

### Font Sizes - Mobile (max-width: 767px)

| Element | Size |
|---------|------|
| H1 | 24px |
| H2 | 20px |
| H3 | 17px |
| H4 | 15px |
| H6 | 13px |
| Body/Blurbs | 14px |

---

## Color Palette

### Primary Brand Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Primary Purple** | `#a5b5eb` | rgb(165, 181, 235) | Primary brand color, links hover, accents, footer headings |
| **Teal/Aqua** | `#84cec7` | rgb(132, 206, 199) | Secondary links, accents |
| **Dark Text** | `#3c3a47` | rgb(60, 58, 71) | Primary text color for headings and body |
| **Black** | `#000000` | rgb(0, 0, 0) | Hero heading text |
| **White** | `#ffffff` | rgb(255, 255, 255) | Backgrounds, button text |

### Supporting Colors

| Hex Code | Usage |
|----------|-------|
| `#333333` | Dark gray for text/borders |
| `#666666` | Medium gray for secondary text |
| `#999999` | Light gray for subtle text |
| `#eee`, `#e2e2e2` | Very light gray for borders/backgrounds |
| `#f3f3f3`, `#f5f5f5` | Off-white backgrounds |

### Accent Colors (Various Elements)

| Hex Code | Likely Usage |
|----------|--------------|
| `#2ea3f2` | Blue accent |
| `#31c889` | Green accent |
| `#7e3bd0` | Purple accent |
| `#974df3` | Light purple accent |

### Transparency/Overlays

- `rgba(0, 0, 0, 0.03)` - Very subtle dark overlay
- `rgba(0, 0, 0, 0.05)` - Light dark overlay
- `rgba(0, 0, 0, 0.08)` - Medium dark overlay
- `rgba(0, 0, 0, 0.6)` - Strong dark overlay

---

## Layout Structure

### Site Framework

- **Theme:** Divi Builder by Elegant Themes
- **Layout Type:** Full-width sections with contained rows
- **Column System:** 12-column grid (Divi standard)
- **Gutter Width:** `et_pb_gutters3` class (specific pixel value in theme)
- **Container Max Width:** Typically 1080px (Divi default)

### Navigation Header

**Type:** Full-width menu (`et_pb_fullwidth_menu`)
- **Background:** Light (`et_pb_bg_layout_light`)
- **Logo Position:** Left-aligned with centered menu
- **Logo Dimensions:** 512 x 512px (displayed smaller)
- **Menu Style:** Left aligned (`et_pb_fullwidth_menu--style-left_aligned`)

---

## Section-by-Section Breakdown

### 1. Header / Navigation Section

**HTML Structure:**
```html
<div class="et_pb_section et_pb_fullwidth_section">
  <div class="et_pb_module et_pb_fullwidth_menu">
    <div class="et_pb_row">
      <div class="et_pb_menu__logo-wrap">
        <div class="et_pb_menu__logo">
          <img src="logo-waggin-meals.png" width="512" height="512" />
        </div>
      </div>
      <nav class="et_pb_menu__menu">
        <!-- Menu items -->
      </nav>
    </div>
  </div>
</div>
```

**Navigation Menu Items:**
1. Home → https://wagginmeals.com/
2. Let's Chat! → https://wagginmeals.com/about/
3. Nutrition Services → https://wagginmeals.com/nutritionservices/
4. Shop Waggin Meals → https://wagginmeals.myshopify.com/
5. Account Login → https://shopify.com/75736613077/account

**Styling:**
- Background: Light/White
- Font: Poppins
- Logo: Left side, circular
- Menu: Horizontal, center-aligned
- Mobile: Hamburger menu with dropdown fade animation

---

### 2. Hero Section - Main Heading

**Content:**

**Desktop Version:**
```
H1: Waggin Meals Pet Nutrition Co.

H5: Human-Grade & Gently Cooked Dog food > Small Batch Kitchen > Canine Nutrition Services

H5: Scientifically Formulated by an Integrative Animal Nutritionist

P: Free Shipping for Orders Over $165.00- we also offer local delivery & pick up
```

**Tablet Version (Longer):**
```
H1: Waggin Meals Pet Nutrition Co.

H4: Human-Grade, Small Batch Kitchen, Sustainably Sourced, Gently Cooked Dogfood-
Scientifically Formulated by an Integrative Animal Nutritionist. Hand-made fresh,
straight from our farm kitchen, located in Western, N.C.

P: We ship our hand crafted dog food across the U.S., we also offer local delivery,
pickup, and Canine Nutrition Clinics & Consultation Services. Free Shipping for
Orders of $165.00. We enjoy speaking to our customers, contact us directly.
```

**Mobile Version:**
```
H1: Waggin Meals Pet Nutrition Co.

H6: Canine Nutrition Services, Human-Grade & Gently Cooked Dogfood & Small Batch Kitchen

H6: Formulated by an Integrative Animal Nutritionist.

H6: Free Shipping for Orders of $165.00 +
```

**Styling:**
- Text alignment: Center
- H1 Color: `#000000` (Black)
- Font sizes: See typography section
- Padding-left: 40px (desktop), 120px (tablet/desktop for subheadings)
- Background: White/Light

**CSS Classes:**
- `.et_pb_text_0`
- `.et_pb_text_align_left` (but overridden with center in inline styles)
- `.et_pb_bg_layout_light`

---

### 3. Product Images Section (Two-Column)

**Layout:** 2-column row (`et_pb_column_1_2` × 2)

**Left Column:**
- **Image:** `beef-sweet-potato-bowl.jpg`
- **Alt Text:** (empty)
- **Title:** "Beef and Sweet Potato Bowl"
- **Dimensions:** 2560 x 1707
- **Class:** `.et_pb_image_0`

**Right Column:**
- **Image:** `chicken-superfood-board.jpg`
- **Alt Text:** (empty)
- **Title:** "Chicken Superfood Cake Board"
- **Dimensions:** 2560 x 1716
- **Class:** `.et_pb_image_1`

**Styling:**
- Images set to `width: auto` (responsive)
- No borders or special effects
- Clean, minimal presentation

---

### 4. Main Content Section - "Doggy Farm Kitchens"

**Heading:**
```
H2: Doggy Farm Kitchens weren't a thing ~ until now!
```

**Structure:** Single column with three blurbs (icon/text modules)

#### Blurb 1: Farm-Fresh & Sustainably Sourced

**Heading (H4):** Farm-Fresh & Sustainably Sourced

**Body Text:**
```
Highest-quality ingredients from our own farms and trusted partners—because
your pet deserves the best. Shop Now!
```
(Links to: https://wagginmeals.com/about/)

**Styling:**
- Icon position: Left
- Background layout: Light
- Text alignment: Left
- Font: Poppins, italic emphasis
- Link styling: Bold, italic

---

#### Blurb 2: Nutritionist-Formulated, Handcrafted

**Heading (H4):** Nutritionist-Formulated, Handcrafted
(Links to: https://wagginmeals.com/nutritionservices/)

**Body Text:**
```
Created by an Animal Nutritionist and prepared in our commercial farm kitchen
using advanced animal science. We also offer Canine Nutrition Clinics and
Consultations.
```
(Links to: https://wagginmeals.com/nutritionservices/)

**Styling:**
- Same as Blurb 1
- "Animal Nutritionist" in bold
- Call-to-action link in bold

---

#### Blurb 3: Whole-Body Wellness

**Heading (H4):** Whole-Body Wellness

**Body Text:**
```
Our meals support overall health, boost immunity, and help your dog thrive
from the inside out. Contact us directly with any questions you may have,
we will help you build your dogs bowl.
```
(Links to: https://wagginmeals.com/about/)

**Styling:**
- Same formatting as previous blurbs
- Call-to-action in bold

**Blurb CSS Classes:**
- `.et_pb_blurb`
- `.et_pb_text_align_left`
- `.et_pb_blurb_position_left`
- `.et_pb_bg_layout_light`

---

### 5. Canine Nutrition Services Section

**Image Section:**
- **Image:** `woman-with-white-dog.webp`
- **Alt Text:** "Asheville NC Canine Nutrition Services"
- **Title:** "Canine-Nutrtion-Services"
- **Dimensions:** 1200 x 650
- **Class:** `.et_pb_image_2`

**Styling:**
- Full-width or contained within column
- Responsive sizing

---

### 6. Owner Testimonial / Quote Section

**Type:** Testimonial module without portrait image

**Content:**
```
I do not try to compete with big box companies. What we offer is specialized
nutrition. We listen, and do not use computer generated responses to determine
what your special dog needs. Because every dog is different.

— Christie A. Willett, M.A., M.S., Canine Integrative Animal Nutritionist,
  Owner of Waggin Meals
```

**Styling:**
- Font size: 18px (italic)
- Text alignment: Center
- Background: Light/White
- No portrait image
- Author name: Bold, font-size: large
- Decorative quote icon (centered at top)

**CSS Classes:**
- `.et_pb_testimonial`
- `.et_pb_testimonial_0`
- `.et_pb_text_align_center`
- `.et_pb_bg_layout_light`
- `.et_pb_testimonial_no_image`
- `.et_pb_with_border`

---

### 7. Customer Testimonials Section

**Heading (H4):** Happy Customers & Waggin Tails

**Testimonials (4 total):**

#### Testimonial 1
**Text:**
```
"Our dog Maisy absolutely devours the fresh meals that Christie prepares.
And it's satisfying to know the food is prepared by a pet nutritionist.
Can't recommend her enough."
```
**Author:** Matt Wolfe + Maisy

---

#### Testimonial 2
**Text:**
```
"Our large pup loves their food and broth! Christie is so helpful, kind &
very knowledgeable about canine nutrition! You can tell she genuinely cares
about your dog's health and not just selling products. They also offer a
private dog park that you can rent hourly! We recently rented the park for
our pups birthday and had a blast."
```
**Author:** Elizabeth Joslin

---

#### Testimonial 3
**Text:**
```
"My dogs love this food!! I love the convenience and nutritional value this
company provides. I know both of my dogs are getting the best quality
ingredients. Both my girls look forward to meal times as they love the taste
of the food and jump for joy."
```
**Author:** Amber Munoz

---

#### Testimonial 4
**Text:**
```
"Top notch, prepared fresh on-site healthiest possible dog meals and treats!
Certified and experienced owners & staff who care about your pets and you!!
The new location is fantastic!!"
```
**Author:** Thom Slater

---

**Testimonial Styling:**
- Layout: Grid or slider (Divi carousel)
- Quote marks: Automatic via CSS
- Author: Bold, displayed below quote
- Portrait: Placeholder SVG (not actual customer photos)
- Background: Light
- Padding: 30px
- Border radius: 90px (for portraits if shown)

---

### 8. Footer Sections

**Section Heading:** "Our Promise"

**Additional Footer Headings:**
- "Important Info"
- "Quick Links"

**Footer Widget Styling:**
- H4 color: `#a5b5eb` (Primary purple)
- List items: Before pseudo-element with border color `#a5b5eb`
- Background: Likely darker than main content

---

## CSS Specifications

### Spacing System

**Padding Values (Common):**
- 0
- 15px
- 30px
- 40px
- 80px (`.et_pb_column_2` padding-top)
- 120px (Hero section subheadings padding-left on tablet/desktop)

**Margin Values (Common):**
- 0
- Auto (for centering)
- Negative margins for overlays and positioning

**Border Radius:**
- 31px (Testimonial quote icon)
- 90px (Testimonial portraits - circular)

---

### Button Styling

**Base Button:**
```css
.et_pb_button {
  font-family: 'Poppins', Helvetica, Arial, Lucida, sans-serif;
  font-size: 21px;
  padding: 0.3em 1em;
  border-radius: (varies - typically slight)
  background-color: (varies by context)
  color: (varies - typically white on dark, dark on light)
}
```

**Hover State:**
```css
.et_pb_button:hover {
  background-color: rgba(255, 255, 255, 0.2); /* Light layout */
  background-color: rgba(0, 0, 0, 0.05); /* Dark layout */
}
```

**Icon Positioning:**
- Icon size: 32px
- Icon opacity when visible: 1
- Icon spacing: 0.3em margin-left

---

### Section Backgrounds

**Light Background Sections:**
- Background color: `#ffffff` or `#f3f3f3`
- Text color: `#3c3a47` (dark)

**Accent Background:**
- Section 1 has class: `et_pb_with_background`
- May use subtle gradients or solid accent colors

---

## Responsive Breakpoints

### Divi Theme Breakpoints

1. **Desktop:** 981px and up
2. **Tablet:** 768px to 980px
3. **Mobile:** 767px and below
4. **Small Mobile:** 479px and below

### Responsive Behavior

**Images:**
- Responsive `srcset` with multiple sizes
- `sizes` attribute for optimal loading
- Width: auto on smaller screens

**Typography:**
- Font sizes scale down (see Typography section)
- Padding/margins reduce proportionally

**Layout:**
- 2-column layouts stack to single column on mobile
- Menu collapses to hamburger
- Center alignment for most content on mobile

**Testimonials:**
- Portrait displays: Float left on desktop, center block on mobile
- Portrait margin: 30px right on desktop, 0 auto 20px on mobile
- Portrait dimensions: 90px square, responsive to 100% width in small columns

---

## Exact Reconstruction Guide

### Step 1: Setup WordPress with Divi

1. Install WordPress
2. Install Divi Theme v4.27.4 or later
3. Activate Divi Theme

### Step 2: Configure Fonts

**Google Fonts to Load:**
```
Abril Fatface: regular
Poppins: 100, 100italic, 200, 200italic, 300, 300italic, regular, italic, 500, 500italic, 600, 600italic, 700, 700italic, 800, 800italic, 900, 900italic
Abhaya Libre: regular, 500, 600, 700, 800
ABeeZee: regular, italic
```

**Divi Customizer Settings:**
- Primary font: Poppins
- Header font: Abril Fatface
- Body font: Poppins

### Step 3: Configure Colors

**Divi Customizer → General Settings → Theme Colors:**

Set the following:
- Primary color: `#a5b5eb`
- Secondary color: `#84cec7`
- Link color: `#84cec7`
- Link hover: `#a5b5eb`
- Text color: `#3c3a47`

### Step 4: Upload Images

Upload all images from `/mnt/c/waggin-meals/public/images/` to WordPress Media Library:
- `logo-waggin-meals.png` → Set as site logo
- `beef-sweet-potato-bowl.jpg`
- `chicken-superfood-board.jpg`
- `woman-with-white-dog.webp`
- `waggin-logos.png`

### Step 5: Create Homepage

**Page Settings:**
- Page Template: Divi Builder (Full Width)
- Page Title: "Home"
- Permalink: `/` (set as static homepage in WordPress Settings → Reading)

---

### Step 6: Build Sections with Divi Builder

#### Section 1: Hero Text Section

**Add Section → Regular Section**
- Background: White/Default
- Padding: Default

**Add Row:**
- Column Structure: 1 Column (Full Width)
- Padding: Default

**Add Module → Text Module:**
- Content (use responsive editor for Desktop/Tablet/Mobile variants):

**Desktop:**
```html
<h1 style="text-align: center; padding-left: 40px;">
  <span style="color: #000000;">Waggin Meals Pet Nutrition Co.</span>
</h1>
<h5 style="text-align: center; padding-left: 120px;">
  <strong>Human-Grade &amp; Gently Cooked Dog food &gt; Small Batch Kitchen &gt;
  Canine Nutrition Services</strong>
</h5>
<h5 style="text-align: center; padding-left: 120px;">
  <strong>Scientifically Formulated</strong> by an Integrative Animal Nutritionist
</h5>
<p style="text-align: center; padding-left: 120px;">
  <strong><em>Free Shipping for Orders Over $165.00- we also offer local
  delivery &amp; pick up</em></strong>
</p>
```

**Tablet:** (Use Divi's responsive editing for tablet content)
**Mobile:** (Use Divi's responsive editing for mobile content)

**Design Settings:**
- H1 font size: 40px (desktop), 32px (tablet), 24px (mobile)
- H2 font size: 28px (desktop), 26px (tablet), 20px (mobile)
- H4 font size: 18px (all)
- H6 font size: 13px (all)

---

#### Section 2: Product Images (Two-Column)

**Add Section → Regular Section**
- Background: White or light gray

**Add Row:**
- Column Structure: 2 Columns (1/2 + 1/2)

**Left Column - Add Module → Image:**
- Upload/Select: `beef-sweet-potato-bowl.jpg`
- Alt Text: (leave empty or add descriptive text)
- Title: "Beef and Sweet Potato Bowl"
- Alignment: Center
- Width: Auto (responsive)

**Right Column - Add Module → Image:**
- Upload/Select: `chicken-superfood-board.jpg`
- Alt Text: (leave empty or add descriptive text)
- Title: "Chicken Superfood Cake Board"
- Alignment: Center
- Width: Auto (responsive)

---

#### Section 3: Main Content - Blurbs Section

**Add Section → Regular Section**
- Background: White/Default

**Add Row:**
- Column Structure: 1 Column (Full Width)

**Add Module → Heading:**
- Title: "Doggy Farm Kitchens weren't a thing ~ until now!"
- Heading Level: H2
- Font size: 28px
- Alignment: Center or Left

**Add Module → Blurb #1:**
- Title: "Farm-Fresh & Sustainably Sourced"
- Content:
```html
<p><strong><a href="https://wagginmeals.com/about/">
<em>Highest-quality ingredients from our own farms and trusted partners—because
your pet deserves the best. Shop Now!</em>
</a></strong></p>
```
- Icon: (Optional - add relevant icon)
- Icon Position: Left
- Text Alignment: Left
- Background Layout: Light

**Add Module → Blurb #2:**
- Title: "Nutritionist-Formulated, Handcrafted"
- Title Link: https://wagginmeals.com/nutritionservices/
- Content:
```html
<p><em>Created by an <strong>Animal Nutritionist</strong> and prepared in our
commercial farm kitchen using advanced animal science.
<a title="Nutrition Services" href="https://wagginmeals.com/nutritionservices/">
<strong>We also offer Canine Nutrition Clinics and Consultations.</strong>
</a></em></p>
```
- Icon Position: Left
- Text Alignment: Left

**Add Module → Blurb #3:**
- Title: "Whole-Body Wellness"
- Content:
```html
<p><em>Our meals support overall health, boost immunity, and help your dog thrive
from the inside out.
<a href="https://wagginmeals.com/about/" title="Contact Us">
<strong>Contact us directly with any questions you may have, we will help you
build your dogs bowl.</strong>
</a></em></p>
```
- Icon Position: Left
- Text Alignment: Left

---

#### Section 4: Canine Nutrition Services Image

**Add Section → Regular Section**

**Add Row:**
- Column Structure: 1 Column (Full Width)

**Add Module → Image:**
- Upload/Select: `woman-with-white-dog.webp`
- Alt Text: "Asheville NC Canine Nutrition Services"
- Title: "Canine-Nutrtion-Services"
- Dimensions: 1200 x 650
- Alignment: Center

---

#### Section 5: Owner Testimonial

**Add Section → Regular Section**

**Add Row:**
- Column Structure: 1 Column (Full Width)

**Add Module → Testimonial:**
- Author: "Christie A. Willett, M.A., M.S., Canine Integrative Animal Nutritionist, Owner of Waggin Meals"
- Job Title: (leave empty)
- Company: (leave empty)
- Portrait Image: None (uncheck "Use Portrait Image")
- Quote:
```html
<span style="font-size: 18px;"><i>I do not try to compete with big box companies.
What we offer is specialized nutrition. We listen, and do not use computer generated
responses to determine what your special dog needs. Because every dog is different.</i>
</span>
```
- Background Layout: Light
- Text Alignment: Center
- Quote Icon: Show (default)
- Quote Icon Color: Default

**Design Settings:**
- Font size: 18px (quote text)
- Author font size: large
- Author font weight: Bold

---

#### Section 6: Customer Testimonials

**Add Section → Regular Section**

**Add Row:**
- Column Structure: 1 Column (Full Width)

**Add Module → Heading:**
- Title: "Happy Customers & Waggin Tails"
- Heading Level: H4
- Alignment: Center

**Add Row:**
- Column Structure: 4 Columns (1/4 + 1/4 + 1/4 + 1/4)
- OR use Testimonial Slider for carousel effect

**Each Column - Add Module → Testimonial:**

**Testimonial 1:**
- Author: "Matt Wolfe + Maisy"
- Quote: "Our dog Maisy absolutely devours the fresh meals that Christie prepares. And it's satisfying to know the food is prepared by a pet nutritionist. Can't recommend her enough."
- Portrait: None

**Testimonial 2:**
- Author: "Elizabeth Joslin"
- Quote: "Our large pup loves their food and broth! Christie is so helpful, kind & very knowledgeable about canine nutrition! You can tell she genuinely cares about your dog's health and not just selling products. They also offer a private dog park that you can rent hourly! We recently rented the park for our pups birthday and had a blast."
- Portrait: None

**Testimonial 3:**
- Author: "Amber Munoz"
- Quote: "My dogs love this food!! I love the convenience and nutritional value this company provides. I know both of my dogs are getting the best quality ingredients. Both my girls look forward to meal times as they love the taste of the food and jump for joy."
- Portrait: None

**Testimonial 4:**
- Author: "Thom Slater"
- Quote: "Top notch, prepared fresh on-site healthiest possible dog meals and treats! Certified and experienced owners & staff who care about your pets and you!! The new location is fantastic!!"
- Portrait: None

**Design Settings (All Testimonials):**
- Text alignment: Center
- Background layout: Light
- Padding: 30px

---

### Step 7: Header & Navigation Setup

**Divi → Theme Customizer → Header & Navigation:**

1. **Upload Logo:**
   - Primary Logo: `logo-waggin-meals.png`
   - Logo max width: 512px (will auto-scale)

2. **Create Primary Menu:**
   - WordPress → Appearance → Menus
   - Create menu items:
     - Home → /
     - Let's Chat! → /about/
     - Nutrition Services → /nutritionservices/
     - Shop Waggin Meals → https://wagginmeals.myshopify.com/ (external)
     - Account Login → https://shopify.com/75736613077/account (external)
   - Assign to "Primary Menu" location

3. **Header Layout:**
   - Style: Centered Inline Logo (or Left Logo with Right Menu)
   - Background: White
   - Text color: Dark gray (#3c3a47)
   - Font: Poppins

4. **Mobile Menu:**
   - Style: Slide-in or Dropdown
   - Animation: Fade
   - Icon: Hamburger

---

### Step 8: Footer Setup

**Divi → Theme Customizer → Footer:**

1. **Create Footer Widgets:**
   - WordPress → Appearance → Widgets
   - Add widget areas for:
     - "Our Promise"
     - "Important Info"
     - "Quick Links"

2. **Footer Styling:**
   - Background: Darker than main content (light gray or accent color)
   - Text color: Dark gray
   - Widget H4 color: `#a5b5eb`
   - List item before border color: `#a5b5eb`

---

### Step 9: Custom CSS (if needed)

If certain design elements don't match exactly with Divi's built-in options, add custom CSS via:

**Divi → Theme Customizer → Additional CSS:**

```css
/* Hero heading specific styling */
.et_pb_text_0 h1 {
  font-size: 40px;
  color: #000000;
}

/* Blurb headings */
.et_pb_blurb h4 {
  font-size: 18px;
}

/* Testimonial quote text size */
.et_pb_testimonial_0 .et_pb_testimonial_content {
  font-size: 18px;
}

/* Button styling */
body .et_pb_button {
  font-size: 21px;
  background-color: #a5b5eb;
  color: #ffffff;
}

body .et_pb_button:hover {
  background-color: #84cec7;
}

/* Footer widget headings */
#main-footer .footer-widget h4 {
  color: #a5b5eb;
}

/* Responsive adjustments - Tablet */
@media (max-width: 980px) {
  .et_pb_text_0 h1 {
    font-size: 32px;
  }
  .et_pb_text_0 h2 {
    font-size: 26px;
  }
}

/* Responsive adjustments - Mobile */
@media (max-width: 767px) {
  .et_pb_text_0 h1 {
    font-size: 24px;
  }
  .et_pb_text_0 h2 {
    font-size: 20px;
  }
  .et_pb_text_0 h3 {
    font-size: 17px;
  }
  .et_pb_text_0 h4 {
    font-size: 15px;
  }
  .et_pb_blurb,
  .et_pb_testimonial_content {
    font-size: 14px;
  }
}
```

---

### Step 10: Page Settings & SEO

1. **Set Homepage:**
   - WordPress → Settings → Reading
   - "Your homepage displays" → A static page → Select "Home"

2. **SEO Settings (if using Yoast or similar):**
   - Page Title: "Waggin Meals Pet Nutrition Co. - Human-Grade Gently Cooked Dog Food"
   - Meta Description: "Scientifically formulated, human-grade dog food from our farm kitchen in Western NC. Created by an Animal Nutritionist. Free shipping over $165."

3. **Permalinks:**
   - WordPress → Settings → Permalinks
   - Structure: Post name (clean URLs)

---

## Additional Technical Notes

### WordPress Plugins Detected

- **Divi Builder** (page builder)
- **WooCommerce** (for shop integration - links to Shopify)

### External Integrations

- **Shopify Store:** https://wagginmeals.myshopify.com/
- All product sales handled via external Shopify
- Menu links to Shopify for shop and account login

### Performance Optimizations

- **Image Formats:** JPG for photos, PNG for logo, WebP for newer images
- **Lazy Loading:** Enabled (`loading="lazy"` attribute on images below fold)
- **Responsive Images:** `srcset` and `sizes` attributes for optimal loading
- **Priority Loading:** `fetchpriority="high"` on logo
- **Cache:** ET Cache system for CSS (`et-core-unified`, `et-divi-dynamic`)

### Browser Support

- Modern browsers with CSS3 support
- Mobile-first responsive design
- Touch-friendly navigation

---

## Testing Checklist

After reconstruction, verify:

- [ ] All images load correctly and are sharp
- [ ] Logo displays at correct size in header
- [ ] Navigation menu works on desktop and mobile
- [ ] Hero section text displays correctly on all screen sizes
- [ ] Responsive typography scales properly
- [ ] Colors match brand palette exactly
- [ ] Blurb sections have correct icons and alignment
- [ ] Testimonials display properly with or without slider
- [ ] Links all point to correct URLs (internal and Shopify external)
- [ ] Footer widgets display with correct styling
- [ ] Page loads quickly (optimize images if needed)
- [ ] Mobile hamburger menu functions correctly
- [ ] Text is readable on all backgrounds
- [ ] Hover states work on buttons and links

---

## Files & Resources

### Downloaded Images Location
`/mnt/c/waggin-meals/public/images/`

### This Documentation
`/mnt/c/waggin-meals/docs/WORDPRESS_SITE_ANALYSIS.md`

### Original Site
https://www.wagginmeals.com

### WordPress Theme
Divi by Elegant Themes - https://www.elegantthemes.com/gallery/divi/

---

## Maintenance Notes

### Updating Content

To update homepage content in the future:
1. Log into WordPress admin
2. Pages → Home → Edit with Divi Builder
3. Click on the module you want to edit
4. Make changes
5. Save

### Adding New Testimonials

1. Edit homepage with Divi Builder
2. Locate testimonial section
3. Clone existing testimonial module
4. Update with new quote and author
5. Adjust grid if needed (may need new row structure)

### Changing Colors

To change brand colors site-wide:
1. Divi → Theme Customizer → General Settings → Theme Colors
2. Update primary and secondary colors
3. May need to update custom CSS for specific elements

---

## Contact Information (as seen on site)

**Business:** Waggin Meals Pet Nutrition Co.
**Owner:** Christie A. Willett, M.A., M.S.
**Title:** Canine Integrative Animal Nutritionist
**Location:** Western North Carolina (Asheville area)
**Services:**
- Human-grade, gently cooked dog food
- Small batch farm kitchen
- Canine nutrition clinics & consultations
- Shipping across U.S.
- Local delivery & pickup
- Private dog park rental

**Links:**
- About/Contact: https://wagginmeals.com/about/
- Nutrition Services: https://wagginmeals.com/nutritionservices/
- Shop: https://wagginmeals.myshopify.com/
- Account: https://shopify.com/75736613077/account

---

**End of Document**

---

*This analysis was created on October 20, 2025, and represents the exact state of the Waggin' Meals homepage at that time. The site may have been updated since then.*
