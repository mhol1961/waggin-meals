# Waggin Meals Website Modernization - Implementation Plan

**Project Duration:** 16 weeks (aggressive timeline)
**Budget:** $75,000 - $115,000
**Start Date:** TBD
**Target Launch:** Week 16
**Status:** Planning Phase

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Team Structure](#team-structure)
3. [Phase Breakdown](#phase-breakdown)
4. [Development Tracks](#development-tracks)
5. [Migration Strategy](#migration-strategy)
6. [Risk Mitigation](#risk-mitigation)
7. [Testing & QA Plan](#testing--qa-plan)
8. [Launch Readiness](#launch-readiness)
9. [Progress Tracking](#progress-tracking)

---

## Project Overview

### Objectives
- Consolidate dual-domain architecture (.com WordPress + .net Shopify) into single Next.js application
- Migrate 300+ active subscriptions without disruption
- Implement advanced subscription management (pause/skip/swap)
- Build pet profile system with personalized recommendations
- Deploy marketing automation and live chat
- Achieve 90+ PageSpeed score and excellent Core Web Vitals

### Tech Stack
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Shopify Plus/Advanced (headless via Storefront API)
- **Database:** Supabase (PostgreSQL)
- **Subscriptions:** ReCharge or Shopify Subscriptions
- **CRM:** GoHighLevel ($297/month)
- **Live Chat:** Gorgias or Intercom
- **Email:** Klaviyo or Resend
- **Hosting:** Vercel Pro
- **Payments:** Shopify Payments (Stripe integration)

### Critical Success Factors
1. Zero customer churn during migration
2. All advanced features operational by Week 16
3. Sub-2-second page load times
4. 95%+ payment migration success rate
5. Seamless single-domain experience

---

## Team Structure

### Recommended Team Allocation

**Core Development Team (5 people)**

1. **Technical Lead / Senior Full-Stack Developer** (40 hrs/week, Weeks 1-16)
   - Architecture decisions, code reviews, critical integrations
   - Design system extraction and documentation
   - Est. cost: $35,000 - $50,000

2. **Frontend Developer** (40 hrs/week, Weeks 1-14)
   - Next.js components, UI implementation matching existing site
   - Component development with shadcn/ui
   - Performance optimization
   - Est. cost: $22,000 - $32,000

3. **Backend Developer** (40 hrs/week, Weeks 2-15)
   - Shopify integration, Supabase, webhooks, API development
   - Est. cost: $20,000 - $30,000

4. **QA Engineer** (20 hrs/week, Weeks 8-16)
   - Test planning, automated testing, bug tracking
   - Est. cost: $8,000 - $12,000

5. **Project Manager** (15 hrs/week, Weeks 1-16)
   - Sprint planning, stakeholder communication, risk management
   - Est. cost: $7,000 - $10,000

**Total Estimated Cost:** $92,000 - $134,000

**Note:** We eliminated the UI/UX Designer role by building directly from the existing WordPress site. The Tech Lead and Frontend Dev extract design tokens and build components matching the current brand. This saves $10-15k while maintaining visual consistency.

### Parallel Work Streams

To hit the 16-week timeline, work must proceed in parallel across multiple tracks:

- **Track A:** Core e-commerce (Lead Dev + Frontend Dev)
- **Track B:** Subscription system (Backend Dev)
- **Track C:** Pet profiles & personalization (Frontend + Backend)
- **Track D:** Customer portal (Frontend Dev)
- **Track E:** Marketing automation (Backend Dev + Integration Specialist)
- **Track F:** Migration & testing (Lead Dev + QA)

---

## Phase Breakdown

### PHASE 1: Foundation & Design (Weeks 1-4)

#### Week 1: Discovery & Planning
**Owner:** Tech Lead + PM

- [ ] **Stakeholder Kickoff Meeting**
  - Define MVP vs nice-to-have features
  - Review existing WordPress site (www.wagginmeals.com)
  - Confirm budget allocation and timeline feasibility
  - Identify content and image assets to migrate

- [ ] **Technical Setup**
  - [ ] Provision Shopify Plus/Advanced account
  - [ ] Set up Vercel account and connect GitHub repo
  - [ ] Create Supabase project and configure database
  - [ ] Set up development/staging/production environments
  - [ ] Configure domain DNS records (prepare for migration)

- [ ] **Repository Initialization**
  - [ ] Create Next.js 14+ project with TypeScript
  - [ ] Install core dependencies (shadcn/ui, Shopify Hydrogen, etc.)
  - [ ] Set up ESLint, Prettier, Git hooks
  - [ ] Configure environment variables
  - [ ] Create project structure (/app, /components, /lib, /styles)

- [ ] **Design System Extraction (No Figma)**
  - [ ] Analyze 5 existing screenshots in `/waggin-meals/` folder
  - [ ] Visit live site and extract colors, fonts, spacing
  - [ ] Create DESIGN_SYSTEM.md documenting all styles
  - [ ] Identify all page layouts and components needed
  - [ ] List all images and content to migrate from WordPress

**Deliverables:**
- Project charter document
- Git repository with basic structure
- Environment configurations
- DESIGN_SYSTEM.md with complete style guide
- Content migration inventory

---

#### Week 2: Design System & Architecture (No Figma)
**Owner:** Tech Lead + Frontend Dev

- [ ] **Design System Documentation**
  - [ ] Extract design tokens from existing site (colors, typography, spacing)
  - [ ] Document component specifications from WordPress site
  - [ ] Create DESIGN_SYSTEM.md with all style specifications
  - [ ] Configure Tailwind CSS with custom theme matching existing site

- [ ] **Component Specifications from Existing Site**
  - [ ] Analyze homepage layout and sections
  - [ ] Document navigation structure and mobile menu
  - [ ] Catalog all button styles and CTAs
  - [ ] Document form input styles
  - [ ] Identify testimonial and card layouts

  **Reference:** Use 5 existing screenshots in `/waggin-meals/` folder:
  - `home_page_wagginmeals.png`
  - `lets_chat_wagginmeals_page.png`
  - `nutrition_services_wagginmeals_page.png`
  - `shop_redirect_to_shopify.png`
  - `shipping-delivery.png`

- [ ] **Technical Architecture**
  - [ ] Document API integration patterns
  - [ ] Design database schema in Supabase
  - [ ] Plan caching strategy (ISR, edge caching)
  - [ ] Define GraphQL query structure for Shopify

- [ ] **Shopify Configuration**
  - [ ] Enable Headless sales channel
  - [ ] Generate Storefront API access token
  - [ ] Configure product catalog structure
  - [ ] Set up selling plans for subscriptions

**Deliverables:**
- DESIGN_SYSTEM.md with complete style guide
- Tailwind config matching existing brand
- Technical architecture document
- Database schema diagram
- Shopify headless channel configured

**Note:** This approach skips Figma entirely. We build components directly in code using shadcn/ui, styled to match the existing WordPress site exactly.

---

#### Week 3: Core Components & Base Pages
**Owner:** Frontend Dev + Tech Lead

- [ ] **Build shadcn/ui Base Components**
  - [ ] Button variants (primary, secondary, outline, ghost)
  - [ ] Input, Textarea, Select form components
  - [ ] Card component with image/title/description variants
  - [ ] Dialog/Modal component
  - [ ] Sheet component (for cart sidebar)
  - [ ] Navigation menu with mobile hamburger

- [ ] **Homepage Sections (Code)**
  - [ ] Hero section with background image
  - [ ] Three-column feature section (Fresh, Nutritionist, Whole Food)
  - [ ] Founder story section (image + quote)
  - [ ] Four-column testimonials grid
  - [ ] Footer (3-column: Our Promise, Important Info, Quick Links)

- [ ] **Additional Core Pages**
  - [ ] "Let's Chat" / Farm Story page
  - [ ] Nutrition Services page with consultation steps
  - [ ] Contact page with form
  - [ ] Basic product listing template
  - [ ] Basic product detail template

- [ ] **Stakeholder Review**
  - [ ] Deploy staging site to Vercel
  - [ ] Walkthrough with Christie/Tres
  - [ ] Gather feedback on visual fidelity to original site
  - [ ] Make adjustments to match brand exactly

**Deliverables:**
- Homepage fully functional on staging
- 3-4 core pages built and styled
- shadcn/ui component library customized
- Stakeholder approval on visual direction

**Note:** Build pages iteratively in code, referring to screenshots. Deploy early and often to staging for quick feedback.

---

#### Week 4: Development Foundation
**Owner:** Tech Lead + Frontend Dev + Backend Dev

- [ ] **Core Infrastructure**
  - [ ] Implement Next.js App Router structure
  - [ ] Set up Tailwind CSS with custom theme
  - [ ] Install and configure shadcn/ui components
  - [ ] Create base layout with navigation and footer
  - [ ] Implement responsive navigation (mobile menu)

- [ ] **Shopify Integration Foundation**
  - [ ] Build Shopify GraphQL client (`/lib/shopify.ts`)
  - [ ] Create TypeScript types for products, variants, collections
  - [ ] Implement product fetching with ISR (1-hour revalidation)
  - [ ] Set up image optimization with Shopify CDN

- [ ] **Database Setup**
  - [ ] Create Supabase tables (customers, pets, subscriptions)
  - [ ] Set up Row Level Security (RLS) policies
  - [ ] Create database functions for calculations
  - [ ] Set up real-time subscriptions

- [ ] **Authentication Foundation**
  - [ ] Implement Shopify Customer Account API
  - [ ] Create login/register flows
  - [ ] Set up session management
  - [ ] Build protected route middleware

**Deliverables:**
- Functional Next.js application with navigation
- Shopify API integration working
- Database schema deployed
- Authentication system operational

**PHASE 1 MILESTONE:** Foundation complete, ready for feature development

---

### PHASE 2: Core Commerce (Weeks 5-8)

#### Week 5: Product Catalog & Cart
**Owner:** Frontend Dev + Backend Dev

- [ ] **Product Listing Page (PLP)**
  - [ ] Fetch products from Shopify with pagination
  - [ ] Display product grid with images, titles, prices
  - [ ] Implement filtering (protein type, dietary restrictions)
  - [ ] Add sorting (price, popularity, newest)
  - [ ] Show selling plans badge for subscription products

- [ ] **Product Detail Page (PDP)**
  - [ ] Dynamic routes: `/products/[handle]`
  - [ ] Display product images with gallery
  - [ ] Show product description, ingredients, nutrition facts
  - [ ] Variant selector (size, flavor)
  - [ ] Subscription vs one-time purchase toggle
  - [ ] Add to cart button with loading states

- [ ] **Shopping Cart Implementation**
  - [ ] Create CartContext with React Context API
  - [ ] Implement Shopify Cart API mutations
  - [ ] Build cart sidebar (shadcn Sheet component)
  - [ ] Show line items with images, prices, quantities
  - [ ] Quantity adjustment (+/- buttons)
  - [ ] Remove item functionality
  - [ ] Display subtotal and estimated shipping
  - [ ] Persist cart ID in localStorage

- [ ] **Cart State Management**
  - [ ] addToCart(merchandiseId, quantity, sellingPlanId)
  - [ ] updateQuantity(lineId, newQuantity)
  - [ ] removeFromCart(lineId)
  - [ ] getCheckoutUrl()
  - [ ] Optimistic UI updates with loading states

**Deliverables:**
- Working product catalog with 20+ products
- Functional shopping cart
- Add-to-cart flow tested end-to-end

---

#### Week 6: Checkout & Payment Flow
**Owner:** Backend Dev + Tech Lead

- [ ] **Checkout Integration**
  - [ ] Implement Shopify Checkout redirect
  - [ ] Pass cart ID to checkout URL
  - [ ] Configure checkout settings in Shopify admin
  - [ ] Customize checkout branding (logo, colors)
  - [ ] Test payment flows (credit card, Apple Pay, Google Pay)

- [ ] **Order Confirmation**
  - [ ] Build order confirmation page
  - [ ] Fetch order details via Storefront API
  - [ ] Display order number, items, shipping address
  - [ ] Show estimated delivery date
  - [ ] Send order confirmation email (Klaviyo/Resend)

- [ ] **Webhook Setup**
  - [ ] Register webhooks in Shopify admin:
    - orders/create
    - orders/paid
    - orders/fulfilled
    - orders/cancelled
  - [ ] Build webhook handler API route (`/api/webhooks/shopify`)
  - [ ] Verify HMAC signatures for security
  - [ ] Implement idempotency with webhook event IDs
  - [ ] Store webhook logs in Supabase

- [ ] **Email Automation Foundation**
  - [ ] Set up Klaviyo or Resend account
  - [ ] Design email templates (React Email):
    - Order confirmation
    - Shipping notification
    - Delivery confirmation
  - [ ] Implement email sending service
  - [ ] Test all email flows

**Deliverables:**
- Complete checkout flow
- Webhook infrastructure
- Order confirmation emails working

---

#### Week 7: Subscription System - Part 1
**Owner:** Backend Dev

- [ ] **ReCharge/Shopify Subscriptions Setup**
  - [ ] Choose subscription platform (ReCharge vs native)
  - [ ] Install and configure subscription app
  - [ ] Create selling plans in Shopify:
    - Weekly delivery
    - Bi-weekly delivery
    - Monthly delivery
    - Every 6 weeks
  - [ ] Set up subscription pricing rules (10% discount)

- [ ] **Subscription Product Display**
  - [ ] Modify PDP to show subscription options
  - [ ] Build frequency selector component
  - [ ] Display savings calculation ("Save 10% + free shipping")
  - [ ] Show next delivery date preview
  - [ ] Add subscription to cart with sellingPlanId

- [ ] **Subscription Creation Flow**
  - [ ] Pass subscription data through checkout
  - [ ] Create subscription contract after first payment
  - [ ] Store subscription metadata in Supabase
  - [ ] Link subscription to customer account

- [ ] **Subscription Webhooks**
  - [ ] subscriptions/create
  - [ ] subscriptions/update
  - [ ] subscriptions/delete
  - [ ] subscription_billing_attempts/failure
  - [ ] subscription_billing_attempts/success

**Deliverables:**
- Subscription products available for purchase
- First subscription successfully created
- Webhook handlers processing events

---

#### Week 8: Subscription System - Part 2
**Owner:** Frontend Dev + Backend Dev

- [ ] **Customer Portal Foundation**
  - [ ] Build `/account/subscriptions` page
  - [ ] Fetch active subscriptions from ReCharge API
  - [ ] Display subscription cards with:
    - Product image and name
    - Delivery frequency
    - Next delivery date (countdown)
    - Subscription status (active/paused/cancelled)
    - Total per delivery

- [ ] **Basic Subscription Actions**
  - [ ] Pause subscription (with confirmation dialog)
  - [ ] Resume subscription
  - [ ] Update delivery frequency (modal with options)
  - [ ] Cancel subscription (with exit survey)

- [ ] **Subscription API Routes**
  - [ ] `/api/subscriptions/[id]/pause` - POST
  - [ ] `/api/subscriptions/[id]/resume` - POST
  - [ ] `/api/subscriptions/[id]/frequency` - PATCH
  - [ ] `/api/subscriptions/[id]/cancel` - DELETE
  - [ ] `/api/subscriptions/[id]/skip-next` - POST

- [ ] **Email Notifications**
  - [ ] Subscription created (welcome to subscription)
  - [ ] Subscription paused (confirmation)
  - [ ] Subscription resumed
  - [ ] Upcoming delivery reminder (2 days before)
  - [ ] Subscription cancelled (exit survey)

**Deliverables:**
- Customer portal with subscription management
- Pause/resume/cancel functionality working
- Automated subscription emails

**PHASE 2 MILESTONE:** E-commerce and subscriptions fully operational

---

### PHASE 3: Advanced Features (Weeks 9-12)

#### Week 9: Pet Profile System - Part 1
**Owner:** Frontend Dev + Backend Dev

- [ ] **Database Schema for Pet Profiles**
  ```sql
  CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    name TEXT NOT NULL,
    species TEXT DEFAULT 'dog',
    breed TEXT,
    weight_lbs DECIMAL(5,2),
    birth_date DATE,
    activity_level TEXT CHECK (activity_level IN ('low', 'moderate', 'high', 'very_high')),
    body_condition TEXT CHECK (body_condition IN ('underweight', 'ideal', 'overweight')),
    dietary_restrictions TEXT[],
    protein_preferences TEXT[],
    health_conditions TEXT[],
    allergies TEXT[],
    special_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Pet Profile Creation Form**
  - [ ] Build `/pets/new` page
  - [ ] Form fields with React Hook Form + Zod validation:
    - Pet name (required)
    - Species (dog/cat)
    - Breed (autocomplete from breed database)
    - Weight in lbs (required)
    - Birth date or age
    - Activity level selector
    - Body condition selector
  - [ ] Multi-select for dietary restrictions:
    - Grain-free
    - Chicken-free
    - Beef-free
    - Low-fat
    - Kidney support
    - Senior formula
  - [ ] Multi-select for protein preferences:
    - Chicken
    - Turkey
    - Beef
    - Lamb
    - Fish
    - Pork
  - [ ] Health conditions and allergies (text input with tags)

- [ ] **Pet Profile Display**
  - [ ] Build `/pets` dashboard page
  - [ ] Display all customer's pets in card grid
  - [ ] Show pet photo (upload), name, breed, age, weight
  - [ ] Quick stats: daily calories, serving size
  - [ ] Edit and delete actions

- [ ] **Serving Size Calculator**
  - [ ] Implement RER calculation:
    ```
    RER = 70 × (weight_kg)^0.75
    ```
  - [ ] Calculate DER with activity multipliers:
    - Low: RER × 1.2
    - Moderate: RER × 1.4
    - High: RER × 1.6
    - Very High: RER × 1.8
  - [ ] Adjust for body condition (±10-15%)
  - [ ] Display serving size in cups per day
  - [ ] Calculate cost per day based on product price

**Deliverables:**
- Pet profile creation and management working
- Serving size calculator functional
- Database storing pet data

---

#### Week 10: Pet Profile System - Part 2
**Owner:** Frontend Dev + Backend Dev

- [ ] **Recommendation Engine**
  - [ ] Create `/lib/recommendations.ts` module
  - [ ] Algorithm to filter products by:
    - Protein preferences match
    - Excludes allergens and restrictions
    - Suitable for pet's age (puppy/adult/senior)
    - Appropriate calorie density
  - [ ] Rank products by match score (0-100)
  - [ ] Return top 5 recommended products

- [ ] **Personalized Product Display**
  - [ ] Show "Recommended for [Pet Name]" section on homepage
  - [ ] Display recommended products with match score badge
  - [ ] Filter product catalog by pet profile
  - [ ] "Perfect for [Pet Name]" badges on PDP

- [ ] **Build Your Bowl Configurator**
  - [ ] Multi-step form for custom meal plan:
    - Step 1: Select pet profile
    - Step 2: Choose primary protein
    - Step 3: Select add-ins (vegetables, supplements)
    - Step 4: Choose portion size
    - Step 5: Set delivery frequency
  - [ ] Calculate total nutrition profile
  - [ ] Display custom bowl summary
  - [ ] Add custom bowl to subscription

- [ ] **Pet Profile Integration with Subscriptions**
  - [ ] Link subscriptions to pet profiles
  - [ ] Show "Subscriptions for [Pet Name]" view
  - [ ] Auto-adjust serving sizes when pet weight changes
  - [ ] Suggest meal plan changes based on age transitions

**Deliverables:**
- Personalized product recommendations
- Build Your Bowl configurator
- Pet-linked subscriptions

---

#### Week 11: Customer Portal & Account Features
**Owner:** Frontend Dev

- [ ] **Customer Dashboard**
  - [ ] Build `/account` main dashboard
  - [ ] Overview cards:
    - Active subscriptions count
    - Next delivery date and items
    - Lifetime order value
    - Pets under care
  - [ ] Quick actions: Add pet, Manage subscriptions, Update payment

- [ ] **Order History**
  - [ ] Build `/account/orders` page
  - [ ] Fetch order history from Shopify
  - [ ] Display in timeline or table format:
    - Order number, date
    - Items with images
    - Total amount
    - Status (fulfilled, in transit, delivered)
    - Tracking number (link to carrier)
  - [ ] Order detail view modal
  - [ ] Reorder button (add all items to cart)

- [ ] **Subscription Management (Advanced)**
  - [ ] Skip upcoming delivery (with calendar picker)
  - [ ] Swap products within subscription
  - [ ] Add/remove products from subscription
  - [ ] Change quantity per delivery
  - [ ] Set delivery schedule (e.g., pause during vacation)
  - [ ] View subscription order history

- [ ] **Payment Method Management**
  - [ ] Display current payment method (last 4 digits)
  - [ ] Update payment method modal
  - [ ] Add secondary payment method
  - [ ] Set default payment method
  - [ ] Handle expiring card notifications

- [ ] **Account Settings**
  - [ ] Update profile: name, email, phone
  - [ ] Change password
  - [ ] Manage shipping addresses (add, edit, delete, set default)
  - [ ] Communication preferences (email, SMS opt-in/out)
  - [ ] Delete account (with confirmation)

**Deliverables:**
- Complete customer portal with all self-service features
- Order history and reorder functionality
- Payment method management

---

#### Week 12: Marketing Automation & Live Chat
**Owner:** Backend Dev + Integration Specialist

- [ ] **GoHighLevel Integration**
  - [ ] Set up GoHighLevel account
  - [ ] Create custom fields for pet data
  - [ ] Build Zapier/Make integration:
    - Trigger: New customer in Shopify
    - Action: Create contact in GHL
    - Map fields: name, email, phone, order data
  - [ ] Sync subscription data to GHL
  - [ ] Tag customers by subscription status, product preferences

- [ ] **Automated Email Workflows (GHL)**
  - [ ] Welcome Series (3-part):
    - Day 0: Welcome + what to expect
    - Day 3: Feeding tips + serving guide
    - Day 7: Check-in + nutrition consultation offer
  - [ ] Subscription Lifecycle:
    - Delivery reminder (2 days before ship)
    - Delivery confirmation (day of delivery)
    - Post-delivery survey (3 days after)
  - [ ] Engagement Campaigns:
    - Monthly newsletter with pet nutrition tips
    - New product announcements
    - Seasonal promotions
  - [ ] Re-engagement:
    - 30 days no activity → engagement email
    - 60 days no activity → discount offer
    - 90 days post-cancellation → win-back campaign

- [ ] **SMS Automation**
  - [ ] Set up SMS in GoHighLevel
  - [ ] Shipment notifications via SMS
  - [ ] Delivery confirmations
  - [ ] Payment failure alerts
  - [ ] Re-engagement SMS for lapsed subscribers

- [ ] **Churn Prevention**
  - [ ] Detect at-risk subscribers:
    - Multiple paused deliveries
    - Payment failures
    - Low engagement scores
  - [ ] Trigger retention campaigns:
    - Personalized outreach
    - Discount offers
    - Product swap suggestions
  - [ ] Exit surveys for cancellations
  - [ ] Win-back automation (90 days post-cancel)

- [ ] **Live Chat Integration**
  - [ ] Choose platform: Gorgias or Intercom
  - [ ] Install chat widget on all pages
  - [ ] Configure business hours (M-F 9am-6pm EST)
  - [ ] Set up canned responses for FAQs
  - [ ] Create chatbot for after-hours:
    - Order status lookups
    - Subscription management links
    - FAQ answers
  - [ ] Integrate with Shopify for order context
  - [ ] Train support team on pet nutrition basics

**Deliverables:**
- GoHighLevel syncing customer data
- Automated email and SMS workflows live
- Live chat operational during business hours
- Churn prevention system active

**PHASE 3 MILESTONE:** All advanced features operational

---

### PHASE 4: Migration & Launch (Weeks 13-16)

#### Week 13: Data Migration - Part 1
**Owner:** Tech Lead + Backend Dev

- [ ] **Migration Planning**
  - [ ] Audit existing systems:
    - WordPress customer data
    - Shopify customer accounts
    - Active subscriptions count
    - Order history scope
  - [ ] Create data mapping document
  - [ ] Identify data quality issues (duplicates, invalid emails)
  - [ ] Define success criteria (95%+ migration success rate)

- [ ] **Customer Data Export**
  - [ ] Export customers from Shopify:
    - Navigate to Customers → Export
    - Include: name, email, phone, addresses, tags, notes
  - [ ] Export order history (last 2 years)
  - [ ] Export subscription data from current platform
  - [ ] Clean and deduplicate data in CSV

- [ ] **Customer Import**
  - [ ] Use Shopify Bulk Operations API
  - [ ] Create custom metafields for extended data:
    - customer.pet_profiles (JSON)
    - customer.dietary_preferences
    - customer.communication_preferences
  - [ ] Import in batches of 100-500 customers
  - [ ] Monitor error rates and retry failed imports
  - [ ] Verify import success (spot-check 10%)

- [ ] **Password Reset Campaign**
  - [ ] Send bulk customer activation emails
  - [ ] Include link to set new password
  - [ ] Explain platform migration benefits
  - [ ] Offer $10 credit for completing migration
  - [ ] Track activation rates (target: 80%+ in 7 days)

**Deliverables:**
- All customers imported to new system
- 80%+ password reset completion
- Customer data verified

---

#### Week 14: Data Migration - Part 2 (Subscriptions)
**Owner:** Tech Lead + Backend Dev

- [ ] **Payment Method Migration**
  - [ ] Use CustomerPaymentMethodRemoteCreate mutation
  - [ ] Migrate Stripe payment methods to Shopify
  - [ ] Process in batches with rate limit handling
  - [ ] Store mapping of old→new payment method IDs
  - [ ] Test charge $0.01 to verify payment methods work
  - [ ] Monitor failure rates and notify customers

- [ ] **Subscription Migration Strategy**
  - [ ] Decision: Preserve billing dates vs consolidate
    - **Recommended:** Preserve individual billing dates
    - Maintains customer expectations
    - Avoids revenue timing issues
  - [ ] Export active subscriptions with:
    - Customer ID
    - Product/variant IDs
    - Delivery frequency
    - Next billing date
    - Billing amount
    - Shipping address

- [ ] **Subscription Contract Creation**
  - [ ] For each subscription:
    - Create subscription contract in ReCharge/Shopify
    - Set billingPolicy.interval and intervalCount
    - Set nextBillingDate to match existing
    - Associate with migrated payment method
    - Link to customer account
  - [ ] Process in batches of 50 subscriptions
  - [ ] Store mapping of old→new subscription IDs
  - [ ] Mark as "migrated" (don't charge yet)

- [ ] **Parallel Run Setup**
  - [ ] Keep old subscription system active
  - [ ] Run both systems in parallel for 2 billing cycles
  - [ ] Process test charges in new system (don't fulfill)
  - [ ] Compare results with old system daily
  - [ ] Monitor payment success rates

**Deliverables:**
- All payment methods migrated (95%+ success rate)
- All subscription contracts created in new system
- Parallel run active with monitoring

---

#### Week 15: Testing, Optimization & Parallel Run
**Owner:** QA Engineer + Frontend Dev + Tech Lead

- [ ] **Comprehensive QA Testing**
  - [ ] Functional testing:
    - [ ] Product browsing and filtering
    - [ ] Add to cart and checkout (one-time)
    - [ ] Subscription purchase flow
    - [ ] Pet profile creation and editing
    - [ ] Subscription management (pause/skip/swap/cancel)
    - [ ] Payment method updates
    - [ ] Order history and reorder
  - [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
  - [ ] Mobile device testing (iOS Safari, Android Chrome)
  - [ ] Tablet testing (iPad, Android tablets)

- [ ] **Performance Optimization**
  - [ ] Run Lighthouse audits:
    - Target: 90+ Performance score mobile
    - Target: 95+ Performance score desktop
    - 100 Accessibility score
    - 100 Best Practices score
    - 100 SEO score
  - [ ] Optimize images (convert to WebP/AVIF)
  - [ ] Implement lazy loading for below-fold content
  - [ ] Minimize JavaScript bundle size
  - [ ] Enable edge caching for product data
  - [ ] Implement React Server Components where applicable

- [ ] **SEO Implementation**
  - [ ] Add meta tags to all pages
  - [ ] Implement structured data:
    - Organization schema (homepage)
    - Product schema (PDP)
    - BreadcrumbList schema (all pages)
    - AggregateRating schema (products with reviews)
  - [ ] Create XML sitemap (dynamic from products)
  - [ ] Optimize robots.txt (allow all, reference sitemap)
  - [ ] Set up 301 redirects from old URLs
  - [ ] Configure canonical URLs
  - [ ] Verify Open Graph tags for social sharing

- [ ] **Accessibility Audit**
  - [ ] WCAG 2.1 AA compliance:
    - Keyboard navigation for all interactive elements
    - ARIA labels for screen readers
    - Color contrast ratios (4.5:1 minimum)
    - Focus indicators visible
    - Skip navigation links
    - Alt text for all images
  - [ ] Test with screen readers (VoiceOver, NVDA)

- [ ] **Subscription Parallel Run Validation**
  - [ ] Monitor first billing cycle in new system
  - [ ] Compare payment success rates: old vs new
  - [ ] Verify fulfillment data accuracy
  - [ ] Check for edge cases (failed payments, skipped deliveries)
  - [ ] Target: 95%+ payment success rate
  - [ ] If success rate >95%, proceed to cutover
  - [ ] If <95%, investigate issues and delay launch 1 week

**Deliverables:**
- All QA tests passed
- PageSpeed scores 90+
- SEO fully implemented
- Parallel run validated

---

#### Week 16: Final Migration & Launch
**Owner:** Tech Lead + PM + Full Team

**Monday-Tuesday: Final Pre-Launch Checks**
- [ ] Final smoke tests on production environment
- [ ] Verify all integrations working:
  - [ ] Shopify API
  - [ ] ReCharge subscriptions
  - [ ] Supabase database
  - [ ] GoHighLevel sync
  - [ ] Live chat widget
  - [ ] Email service (Klaviyo/Resend)
- [ ] Load testing (simulate 1000 concurrent users)
- [ ] Verify SSL certificate and domain configuration
- [ ] Set up error monitoring (Sentry or similar)
- [ ] Configure analytics (GA4, Mixpanel)

**Wednesday: Soft Launch (10% Traffic)**
- [ ] Update DNS to point 10% traffic to new site
- [ ] Monitor error rates and performance
- [ ] Test real customer transactions
- [ ] Verify subscription billing working
- [ ] Check live chat response times
- [ ] Fix critical issues immediately

**Thursday: Ramp to 50% Traffic**
- [ ] Increase traffic to 50% if no critical issues
- [ ] Continue monitoring dashboards
- [ ] Process subscription renewals through new system
- [ ] Deactivate subscriptions in old system
- [ ] Send customer announcement email (50% of list)

**Friday: Full Launch (100% Traffic)**
- [ ] Switch DNS to point all traffic to new site
- [ ] Implement 301 redirects from old domain:
  - waaginmeals.net/* → waaginmeals.com/*
  - Preserve query parameters
  - Map old product URLs to new
- [ ] Send launch announcement to all customers:
  - Explain new features (subscription portal, pet profiles)
  - Offer launch promotion (e.g., "$20 off next order")
  - Link to video tour of new site
  - Customer support contact info
- [ ] Monitor closely for 24-48 hours:
  - Error rates
  - Conversion rates
  - Payment success rates
  - Support ticket volume
- [ ] Deploy on-call rotation for weekend coverage

**Post-Launch (Days 1-7)**
- [ ] Daily monitoring and triage
- [ ] Fix bugs as they arise (priority based on severity)
- [ ] Gather customer feedback
- [ ] Track key metrics:
  - Conversion rate (target: 4-5%)
  - Cart abandonment rate
  - Payment success rate (target: 95%+)
  - Page load times
  - Customer satisfaction (CSAT surveys)
- [ ] Adjust and optimize based on real usage patterns
- [ ] Plan for Phase 2 features (if any deferred)

**Deliverables:**
- New site live at 100% traffic
- All customers migrated successfully
- Old site decommissioned
- Launch announcement sent
- Monitoring and support active

**PHASE 4 MILESTONE:** Launch complete! 🚀

---

## Development Tracks

To achieve the aggressive 16-week timeline, work must proceed in parallel across six tracks:

### Track A: Core E-Commerce Foundation
**Owner:** Tech Lead + Frontend Dev
**Duration:** Weeks 1-8

1. Next.js project setup and architecture
2. Shopify Storefront API integration
3. Product catalog (listing + detail pages)
4. Shopping cart and checkout flow
5. Order confirmation and email

**Dependencies:** None (critical path)

---

### Track B: Subscription System
**Owner:** Backend Dev
**Duration:** Weeks 7-14

1. ReCharge/Shopify Subscriptions setup
2. Selling plans configuration
3. Subscription purchase flow
4. Webhook handlers for subscription events
5. Basic subscription management (pause/resume/cancel)
6. Advanced features (skip, swap, frequency changes)

**Dependencies:** Track A (checkout must work first)

---

### Track C: Pet Profiles & Personalization
**Owner:** Frontend Dev + Backend Dev
**Duration:** Weeks 9-12

1. Pet profile database schema
2. Pet profile creation form with validation
3. Serving size calculator (RER/DER formulas)
4. Recommendation engine algorithm
5. Build Your Bowl configurator
6. Integration with subscription system

**Dependencies:** Track A (customer accounts), Track B (link pets to subscriptions)

---

### Track D: Customer Portal
**Owner:** Frontend Dev
**Duration:** Weeks 8-11

1. Customer dashboard layout
2. Order history display
3. Subscription management UI
4. Payment method management
5. Account settings and profile updates

**Dependencies:** Track A (authentication), Track B (subscription data)

---

### Track E: Marketing Automation & Live Chat
**Owner:** Backend Dev + Integration Specialist
**Duration:** Weeks 12-14

1. GoHighLevel account setup and integration
2. Zapier/Make workflows for data sync
3. Email automation workflows (welcome, engagement, churn)
4. SMS automation setup
5. Live chat widget installation (Gorgias/Intercom)
6. Chatbot configuration for after-hours

**Dependencies:** Track A (customer data), Track B (subscription events)

---

### Track F: Migration & Testing
**Owner:** Tech Lead + QA Engineer
**Duration:** Weeks 13-16

1. Data migration planning and customer export
2. Customer and payment method import
3. Subscription migration with parallel run
4. Comprehensive QA testing (functional, cross-browser, mobile)
5. Performance optimization (PageSpeed 90+)
6. SEO implementation and accessibility audit
7. Soft launch, monitoring, full launch

**Dependencies:** All tracks must be feature-complete

---

## Migration Strategy

Migrating 300+ active subscriptions without disruption requires a careful, phased approach.

### Phase 1: Customer Data Migration (Week 13)

**Step 1: Export from existing systems**
- Export all customers from Shopify (CSV)
- Export order history (last 24 months)
- Export subscription data from current platform

**Step 2: Data cleaning**
- Deduplicate customer records (match on email)
- Validate email addresses (remove bounced/invalid)
- Standardize phone numbers and addresses
- Tag customers by segments (active subscriber, lapsed, one-time)

**Step 3: Import to new Shopify**
- Use Bulk Operations API for customer import
- Create custom metafields for pet profiles and preferences
- Import in batches of 100-500 customers
- Verify import success with spot checks

**Step 4: Password reset campaign**
- Send bulk activation emails with password reset links
- Explain migration benefits (new features, better portal)
- Offer $10 credit as incentive to complete setup
- Track activation rates (target: 80%+ within 7 days)
- Follow-up reminders at Day 3 and Day 6

**Success Criteria:**
- 95%+ customers imported successfully
- 80%+ password reset completion in 7 days
- <5% customer support tickets about migration

---

### Phase 2: Payment Method Migration (Week 14, Days 1-3)

**Step 1: Token migration**
- Use CustomerPaymentMethodRemoteCreate mutation
- Migrate Stripe payment tokens to Shopify
- No raw credit card data handled (PCI compliance maintained)
- Process in batches with exponential backoff for rate limits

**Step 2: Validation**
- Test each payment method with $0.01 authorization
- Refund test charges immediately
- Mark successful migrations in database
- Flag failed migrations for manual resolution

**Step 3: Customer communication**
- Email customers with failed migrations
- Provide link to update payment method
- Offer phone support for complex cases

**Success Criteria:**
- 95%+ payment methods migrated successfully
- <5% customers require manual payment update
- Zero unauthorized charges

---

### Phase 3: Subscription Migration (Week 14, Days 4-7)

**Step 1: Subscription contract creation**
- Export all active subscriptions with billing dates
- Create subscription contracts in ReCharge/Shopify
- Match delivery frequency, pricing, next billing date
- Associate with migrated customer and payment method
- Mark as "migrated" status (don't charge yet)

**Step 2: Parallel run setup**
- Keep old subscription system active
- Run both systems in parallel for 2 billing cycles
- Process test charges in new system (don't fulfill orders)
- Compare results daily (success rates, error types)

**Step 3: Validation testing**
- Manually test 10-20 subscriptions end-to-end
- Verify billing dates match expectations
- Test subscription management (pause/skip/cancel)
- Confirm email notifications trigger correctly

**Success Criteria:**
- All 300+ subscriptions created in new system
- Parallel run shows 95%+ payment success rate
- Zero duplicate charges to customers

---

### Phase 4: Cutover (Week 15, Days 1-3)

**Step 1: Monitor parallel run**
- Process first billing cycle through new system
- Track payment success rate (target: 95%+)
- Compare with old system performance
- Investigate any failures (expired cards, insufficient funds, etc.)

**Step 2: Go/No-Go decision (Day 3)**
- If new system payment success rate ≥ 95%: Proceed with cutover
- If <95%: Investigate root causes, fix issues, delay 3-7 days

**Step 3: Deactivate old subscriptions**
- Cancel all subscriptions in old system
- Verify no pending charges
- Archive old subscription data for records

**Step 4: Enable new subscriptions**
- Change status from "migrated" to "active"
- Allow billing to process through new system
- Monitor first 24 hours closely

**Success Criteria:**
- New system payment success rate ≥95%
- Zero duplicate charges
- <2% increase in support tickets

---

### Rollback Plan (If Issues Arise)

If critical issues emerge during cutover:

**Immediate actions:**
1. Pause all billing in new system
2. Reactivate subscriptions in old system
3. Process missed charges through old system
4. Communicate with affected customers

**Investigation:**
1. Identify root cause of failures
2. Fix technical issues
3. Test fixes thoroughly
4. Plan retry timeline (3-7 days)

**Retry criteria:**
- Root cause identified and fixed
- Test environment shows 98%+ success rate
- Stakeholder approval to retry

---

## Risk Mitigation

### Top 10 Risks & Mitigation Strategies

#### Risk 1: Aggressive 16-week timeline causes quality issues
**Likelihood:** High | **Impact:** High

**Mitigation:**
- Parallel development tracks to compress timeline without cutting corners
- Weekly stakeholder checkpoints to catch issues early
- Automated testing from Week 8 onward
- Built-in contingency: Week 15 buffer for fixing critical bugs
- Feature flags to disable problematic features without delaying launch

**Contingency Plan:**
- Identify MVP features vs nice-to-have by Week 6
- If behind schedule, defer pet profile system to post-launch Phase 2
- Extend timeline by 2-4 weeks if necessary (communicate early)

---

#### Risk 2: Customer churn during migration
**Likelihood:** Medium | **Impact:** High

**Mitigation:**
- Over-communicate migration benefits (email, SMS, in-app)
- Offer $10 credit incentive for completing password reset
- Parallel run for 2 billing cycles to catch issues before cutover
- 95%+ payment success rate requirement before cutover
- Dedicated support team during migration week

**Contingency Plan:**
- If churn >5%: Pause migration, investigate root causes
- Personalized outreach to churned customers with win-back offer
- Extend parallel run to 3-4 billing cycles if needed

---

#### Risk 3: Payment migration fails at high rate
**Likelihood:** Medium | **Impact:** High

**Mitigation:**
- Use CustomerPaymentMethodRemoteCreate (no raw card data)
- Test charge validation ($0.01 authorization)
- Batch processing with error handling and retry logic
- Proactive communication for failed migrations
- Phone support available for manual payment updates

**Contingency Plan:**
- If failure rate >10%: Pause migration, investigate technical issues
- Partner with Stripe and Shopify support for resolution
- Manual payment collection via secure link as last resort

---

#### Risk 4: Subscription billing duplicates customers
**Likelihood:** Low | **Impact:** Critical

**Mitigation:**
- Parallel run with new system marked "test mode" (no fulfillment)
- Idempotency keys for all billing operations
- Daily reconciliation of charges between old and new systems
- Alert monitoring for duplicate subscription IDs
- Immediate refund process for any duplicates detected

**Contingency Plan:**
- Automatic refund for duplicate charges within 24 hours
- Customer apology email with $25 credit
- Investigation and fix within 48 hours

---

#### Risk 5: Shopify API rate limits cause issues
**Likelihood:** Medium | **Impact:** Medium

**Mitigation:**
- Implement exponential backoff for all API calls
- Use Bulk Operations API for large data imports (250+ records)
- Cache product data with ISR (1-hour revalidation)
- Monitor API usage in Shopify admin
- Upgrade to Shopify Plus if needed (higher rate limits)

**Contingency Plan:**
- Reduce API call frequency during high-traffic periods
- Implement request queuing with Bull/BullMQ
- Scale horizontally with multiple Vercel instances

---

#### Risk 6: Design changes late in development
**Likelihood:** Medium | **Impact:** Medium

**Mitigation:**
- Complete all design work by Week 3
- Get stakeholder sign-off on Figma mockups before development
- Limit design changes after Week 6 to critical issues only
- Use design system (shadcn/ui) for consistency and rapid changes
- Allocate 10% of development time for design refinements

**Contingency Plan:**
- Defer non-critical design changes to post-launch Phase 2
- If major redesign needed: Extend timeline by 2 weeks
- Prioritize mobile design (70% of traffic expected)

---

#### Risk 7: Third-party integrations fail (GoHighLevel, ReCharge, etc.)
**Likelihood:** Medium | **Impact:** Medium

**Mitigation:**
- Test integrations in sandbox/staging environments first
- Have alternative tools identified (e.g., Klaviyo instead of GHL)
- Build abstraction layers to swap integrations if needed
- Monitor webhook delivery rates daily
- Partner support contacts for escalation

**Contingency Plan:**
- If GoHighLevel fails: Fall back to Klaviyo for email automation
- If ReCharge fails: Use native Shopify Subscriptions
- If live chat fails: Use email support until resolved

---

#### Risk 8: Performance issues under load
**Likelihood:** Low | **Impact:** High

**Mitigation:**
- Load testing in Week 15 (simulate 1000 concurrent users)
- Edge caching for product data (Vercel CDN)
- Image optimization with Next.js Image component
- React Server Components to reduce JavaScript bundle size
- Monitor Core Web Vitals daily (LCP, FID, CLS)

**Contingency Plan:**
- If PageSpeed <80: Delay launch 1 week for optimization
- Implement aggressive caching (stale-while-revalidate)
- Upgrade Vercel plan for more edge functions

---

#### Risk 9: SEO ranking drops after domain consolidation
**Likelihood:** Medium | **Impact:** Medium

**Mitigation:**
- Implement 301 redirects from .net to .com (preserve link equity)
- Submit new sitemap to Google Search Console
- Maintain URL structure where possible (/products/[handle])
- Add structured data (Product, Organization schemas)
- Monitor Google Search Console for crawl errors

**Contingency Plan:**
- If traffic drops >20%: Audit redirects and fix broken links
- Increase paid ads to compensate for organic traffic loss
- Consult SEO specialist for recovery plan
- Timeline: SEO recovery typically takes 3-6 months

---

#### Risk 10: Team member unavailability (illness, leaving, etc.)
**Likelihood:** Medium | **Impact:** Medium

**Mitigation:**
- Document all code and architecture decisions
- Use TypeScript for maintainability
- Daily standups to share knowledge
- Pair programming for critical features
- Cross-train team members on multiple areas

**Contingency Plan:**
- Identify backup developers for each role
- Scope reduction if team capacity drops >25%
- Contract additional developers on 1-2 week notice

---

## Testing & QA Plan

### Testing Strategy

#### Unit Testing
**Owner:** All Developers
**Timeline:** Weeks 4-16 (ongoing)

- [ ] Set up Jest + React Testing Library
- [ ] Write unit tests for:
  - Utility functions (serving size calculator, RER/DER formulas)
  - React components (forms, calculators, subscription UI)
  - API routes (webhooks, subscription management)
- [ ] Target: 70%+ code coverage
- [ ] Run tests in CI/CD pipeline (GitHub Actions)

---

#### Integration Testing
**Owner:** Backend Dev + Tech Lead
**Timeline:** Weeks 8-15

- [ ] Test Shopify API integrations:
  - Product fetching with caching
  - Cart creation and mutations
  - Checkout redirect flow
  - Webhook processing
- [ ] Test Supabase database operations:
  - Pet profile CRUD
  - Customer data sync
  - Subscription metadata storage
- [ ] Test third-party integrations:
  - ReCharge subscription management
  - GoHighLevel data sync via Zapier
  - Email sending (Klaviyo/Resend)
  - Live chat widget (Gorgias/Intercom)

---

#### Functional Testing
**Owner:** QA Engineer
**Timeline:** Weeks 8-16

**Test Cases (120+ scenarios):**

**E-Commerce Flows:**
- [ ] Browse product catalog (filter, sort, search)
- [ ] View product details (images, description, variants)
- [ ] Add one-time product to cart
- [ ] Add subscription product to cart with frequency selection
- [ ] Modify cart quantities
- [ ] Remove items from cart
- [ ] Apply discount codes
- [ ] Proceed to checkout
- [ ] Complete payment with credit card
- [ ] Complete payment with Apple Pay / Google Pay
- [ ] Receive order confirmation email
- [ ] View order in order history

**Subscription Flows:**
- [ ] Purchase subscription product
- [ ] Receive subscription welcome email
- [ ] View subscription in customer portal
- [ ] Pause subscription
- [ ] Resume subscription
- [ ] Skip next delivery
- [ ] Change delivery frequency
- [ ] Swap product within subscription
- [ ] Update payment method
- [ ] Cancel subscription
- [ ] Receive cancellation confirmation

**Pet Profile Flows:**
- [ ] Create pet profile with all required fields
- [ ] Calculate serving size based on weight and activity
- [ ] View recommended products for pet
- [ ] Edit pet profile
- [ ] Delete pet profile
- [ ] Link subscription to pet profile
- [ ] Use Build Your Bowl configurator

**Account Management:**
- [ ] Register new account
- [ ] Log in to existing account
- [ ] Reset forgotten password
- [ ] Update profile information
- [ ] Add new shipping address
- [ ] Update default shipping address
- [ ] Delete shipping address
- [ ] Add new payment method
- [ ] Update existing payment method
- [ ] View order history
- [ ] Reorder previous order
- [ ] Update communication preferences
- [ ] Delete account

---

#### Cross-Browser Testing
**Owner:** QA Engineer
**Timeline:** Week 15

Test on:
- [ ] Chrome (latest, Windows & Mac)
- [ ] Safari (latest, macOS & iOS)
- [ ] Firefox (latest, Windows & Mac)
- [ ] Edge (latest, Windows)
- [ ] Samsung Internet (Android)

**Verify:**
- All core flows work identically
- UI renders correctly (no layout breaks)
- Forms submit successfully
- Payments process correctly

---

#### Mobile Device Testing
**Owner:** QA Engineer
**Timeline:** Week 15

Test on:
- [ ] iPhone 13/14/15 (iOS Safari)
- [ ] iPhone SE (smaller screen)
- [ ] iPad (tablet experience)
- [ ] Samsung Galaxy S22/S23 (Android Chrome)
- [ ] Google Pixel 7 (Android Chrome)

**Verify:**
- Touch targets ≥44x44px
- Forms usable on mobile keyboards
- Navigation menu works (hamburger menu)
- Images load properly
- Checkout flow completes on mobile

---

#### Performance Testing
**Owner:** Frontend Dev
**Timeline:** Week 15

- [ ] Run Google Lighthouse audits on key pages:
  - Homepage
  - Product listing page
  - Product detail page
  - Checkout
  - Customer dashboard
- [ ] Target scores:
  - Performance: 90+ (mobile), 95+ (desktop)
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 100
- [ ] Measure Core Web Vitals:
  - LCP (Largest Contentful Paint): <2.5s
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1
- [ ] Load testing:
  - Use K6 or Artillery
  - Simulate 1000 concurrent users
  - Verify no errors under load
  - Response times <500ms for 95th percentile

---

#### Accessibility Testing
**Owner:** QA Engineer + Frontend Dev
**Timeline:** Week 15

- [ ] WCAG 2.1 AA compliance audit
- [ ] Test with screen readers:
  - VoiceOver (macOS/iOS)
  - NVDA (Windows)
- [ ] Keyboard navigation:
  - All interactive elements reachable via Tab
  - No keyboard traps
  - Visible focus indicators
- [ ] Color contrast:
  - Text: 4.5:1 minimum
  - UI components: 3:1 minimum
- [ ] Alt text for all images
- [ ] Form labels and error messages
- [ ] Skip navigation links

---

#### Security Testing
**Owner:** Tech Lead
**Timeline:** Week 15

- [ ] Verify HTTPS everywhere
- [ ] Check for exposed API keys (environment variables secured)
- [ ] Test authentication flows (no bypasses)
- [ ] Verify webhook HMAC signature validation
- [ ] Check for XSS vulnerabilities (sanitize user inputs)
- [ ] Test CSRF protection on forms
- [ ] Verify payment data never stored locally
- [ ] Check Supabase RLS policies (customers can't access others' data)
- [ ] Scan dependencies for vulnerabilities (npm audit)

---

#### User Acceptance Testing (UAT)
**Owner:** PM + Christie/Tres
**Timeline:** Week 15

- [ ] Internal team walkthrough of entire site
- [ ] Stakeholder testing (Christie, Tres, key team members)
- [ ] Beta testing with 10-20 trusted customers
- [ ] Gather feedback via survey
- [ ] Prioritize bugs/issues (critical, high, medium, low)
- [ ] Fix critical and high-priority issues before launch
- [ ] Defer medium/low to post-launch backlog

---

## Launch Readiness

### Go/No-Go Checklist (Week 16, Day 1)

Review this checklist with full team and stakeholders. All items must be ✅ to proceed with launch.

#### Technical Readiness

- [ ] All core features functional in production:
  - [ ] Product catalog browsing
  - [ ] Shopping cart and checkout
  - [ ] One-time purchases working
  - [ ] Subscription purchases working
  - [ ] Customer account registration and login
  - [ ] Subscription management portal (pause/skip/cancel)
  - [ ] Pet profile creation and management
  - [ ] Order history display
  - [ ] Payment method management
- [ ] Performance meets targets:
  - [ ] PageSpeed score 90+ mobile, 95+ desktop
  - [ ] Core Web Vitals in "Good" range
  - [ ] Load testing passed (1000 concurrent users)
- [ ] Security verified:
  - [ ] HTTPS enabled with valid SSL certificate
  - [ ] No API keys exposed in frontend code
  - [ ] Webhook HMAC validation working
  - [ ] Supabase RLS policies enforced
- [ ] Integrations operational:
  - [ ] Shopify API connected and stable
  - [ ] ReCharge subscriptions working
  - [ ] Supabase database accessible
  - [ ] GoHighLevel syncing data
  - [ ] Live chat widget functional
  - [ ] Email service sending correctly
- [ ] Error monitoring set up:
  - [ ] Sentry or similar error tracking configured
  - [ ] Alerts for critical errors to on-call team
  - [ ] Dashboard for real-time monitoring

---

#### Migration Readiness

- [ ] Customer data migrated:
  - [ ] 95%+ customers imported successfully
  - [ ] 80%+ password resets completed
  - [ ] Customer data spot-checked and verified
- [ ] Payment methods migrated:
  - [ ] 95%+ payment methods migrated successfully
  - [ ] Test charges validated payment methods
  - [ ] Failed migrations communicated to customers
- [ ] Subscriptions migrated:
  - [ ] All 300+ subscription contracts created
  - [ ] Parallel run shows ≥95% payment success rate
  - [ ] Billing dates match customer expectations
  - [ ] No duplicate charges detected
- [ ] Rollback plan documented:
  - [ ] Steps to revert to old system if needed
  - [ ] Team knows who to contact and when
  - [ ] Old system kept operational for 7 days post-launch

---

#### Content & SEO Readiness

- [ ] All pages published and reviewed:
  - [ ] Homepage
  - [ ] Product pages (all products)
  - [ ] Collections/categories
  - [ ] Our Story / About page
  - [ ] Nutrition Services page
  - [ ] Contact page
  - [ ] FAQs page
  - [ ] Privacy Policy and Terms of Service
- [ ] SEO implementation complete:
  - [ ] Meta titles and descriptions on all pages
  - [ ] Structured data (Product, Organization schemas)
  - [ ] XML sitemap generated and submitted
  - [ ] robots.txt configured correctly
  - [ ] 301 redirects from old URLs tested
  - [ ] Canonical URLs set
  - [ ] Open Graph tags for social sharing
- [ ] Analytics configured:
  - [ ] Google Analytics 4 tracking code installed
  - [ ] E-commerce tracking enabled
  - [ ] Conversion goals set up
  - [ ] Mixpanel or similar product analytics (optional)

---

#### Operational Readiness

- [ ] Customer support prepared:
  - [ ] Support team trained on new platform
  - [ ] Live chat staffed during business hours
  - [ ] After-hours chatbot configured
  - [ ] FAQ documentation updated
  - [ ] Support ticket system ready (Gorgias/Zendesk)
- [ ] Marketing assets ready:
  - [ ] Launch announcement email drafted
  - [ ] Social media posts scheduled
  - [ ] Promotional offer decided ($20 off, free shipping, etc.)
  - [ ] Video walkthrough of new features created
- [ ] Communication plan:
  - [ ] Email sequence for launch week:
    - Day 0: "Exciting news! New website launching"
    - Day 1: "We're live! Explore new features"
    - Day 3: "Limited-time launch offer"
    - Day 7: "Thank you + feedback survey"
  - [ ] SMS notifications (for subscribers who opted in)
  - [ ] Social media content calendar
- [ ] On-call rotation:
  - [ ] Tech lead on-call for Week 16-17
  - [ ] Backup developer identified
  - [ ] Contact numbers and escalation path documented
  - [ ] Incident response playbook ready

---

#### Stakeholder Sign-Off

- [ ] Christie (Founder) approves design and features
- [ ] Tres (Co-Founder) approves operations and support readiness
- [ ] Tech Lead approves technical implementation
- [ ] PM approves timeline and deliverables
- [ ] Marketing Lead approves launch communications

---

### Launch Timeline (Week 16)

**Monday-Tuesday:** Pre-launch checks and final QA
**Wednesday:** Soft launch (10% traffic) + monitoring
**Thursday:** Ramp to 50% traffic + customer announcement (50% of list)
**Friday:** Full launch (100% traffic) + announcement to all customers
**Weekend:** On-call monitoring and triage
**Week 17:** Post-launch bug fixes and optimization

---

## Progress Tracking

### Overall Project Status

**Current Phase:** [Update as project progresses]
**Overall Progress:** [ ] 0% → [ ] 100%
**On Track?** ✅ Yes | ⚠️ At Risk | ❌ Behind Schedule
**Next Milestone:** [Date and deliverable]
**Blockers:** [List any current blockers]

---

### Weekly Checklist

Track completion of major milestones week by week.

#### Week 1: Discovery & Planning
- [ ] Stakeholder kickoff meeting completed
- [ ] Technical setup (Shopify, Vercel, Supabase) complete
- [ ] Repository initialized with project structure
- [ ] Design discovery and competitive analysis done

#### Week 2: Core Design & Architecture
- [ ] Figma design system created
- [ ] 5 core page mockups completed
- [ ] Technical architecture documented
- [ ] Shopify headless channel configured

#### Week 3: Advanced Page Designs
- [ ] All 15+ page mockups completed
- [ ] Component specifications delivered
- [ ] Stakeholder design approval received

#### Week 4: Development Foundation
- [ ] Next.js app with navigation and footer deployed
- [ ] Shopify GraphQL client working
- [ ] Supabase database schema deployed
- [ ] Authentication system operational

#### Week 5: Product Catalog & Cart
- [ ] Product listing page functional
- [ ] Product detail pages rendering
- [ ] Shopping cart working
- [ ] Add-to-cart flow tested

#### Week 6: Checkout & Payment Flow
- [ ] Shopify checkout integration complete
- [ ] Webhook infrastructure built
- [ ] Order confirmation emails sending
- [ ] Payment flows tested

#### Week 7: Subscription System - Part 1
- [ ] ReCharge/Shopify Subscriptions configured
- [ ] Subscription products available for purchase
- [ ] First subscription successfully created
- [ ] Subscription webhooks processing

#### Week 8: Subscription System - Part 2
- [ ] Customer portal with subscription list built
- [ ] Pause/resume/cancel functionality working
- [ ] Subscription management API routes complete
- [ ] Subscription emails sending

#### Week 9: Pet Profile System - Part 1
- [ ] Pet profile database schema deployed
- [ ] Pet profile creation form functional
- [ ] Serving size calculator working
- [ ] Pet profile dashboard displaying

#### Week 10: Pet Profile System - Part 2
- [ ] Recommendation engine algorithm complete
- [ ] Personalized product recommendations showing
- [ ] Build Your Bowl configurator functional
- [ ] Pet-linked subscriptions working

#### Week 11: Customer Portal & Account Features
- [ ] Customer dashboard complete
- [ ] Order history displaying
- [ ] Subscription management (skip/swap) working
- [ ] Payment method management functional

#### Week 12: Marketing Automation & Live Chat
- [ ] GoHighLevel syncing customer data
- [ ] Automated email workflows live
- [ ] SMS automation operational
- [ ] Live chat widget installed and staffed

#### Week 13: Data Migration - Part 1
- [ ] Customer data exported and cleaned
- [ ] Customers imported to new system
- [ ] Password reset campaign sent
- [ ] 80%+ password resets completed

#### Week 14: Data Migration - Part 2
- [ ] Payment methods migrated (95%+ success)
- [ ] Subscription contracts created
- [ ] Parallel run active and monitored
- [ ] Migration success validated

#### Week 15: Testing, Optimization & Parallel Run
- [ ] Comprehensive QA testing completed
- [ ] PageSpeed scores 90+ achieved
- [ ] SEO and accessibility audits passed
- [ ] Parallel run validated (95%+ success)

#### Week 16: Final Migration & Launch
- [ ] Pre-launch checks completed
- [ ] Soft launch (10% traffic) successful
- [ ] Ramped to 100% traffic
- [ ] Launch announcement sent
- [ ] Post-launch monitoring active

---

### Feature-Level Progress

Track completion of individual features and sub-features.

#### Core E-Commerce (Track A)
- [ ] Next.js project setup
- [ ] Shopify API integration
- [ ] Product catalog
  - [ ] Product listing page
  - [ ] Product detail page
  - [ ] Product filtering and sorting
- [ ] Shopping cart
  - [ ] Cart context and state management
  - [ ] Add to cart functionality
  - [ ] Cart sidebar UI
  - [ ] Quantity adjustments
- [ ] Checkout flow
  - [ ] Shopify checkout redirect
  - [ ] Order confirmation page
  - [ ] Order confirmation emails

#### Subscription System (Track B)
- [ ] ReCharge/Shopify Subscriptions setup
- [ ] Selling plans configuration
- [ ] Subscription product display
- [ ] Subscription purchase flow
- [ ] Webhook handlers
- [ ] Customer portal - subscriptions list
- [ ] Basic actions (pause/resume/cancel)
- [ ] Advanced actions (skip/swap/frequency)
- [ ] Subscription emails

#### Pet Profiles (Track C)
- [ ] Database schema
- [ ] Pet profile creation form
- [ ] Pet profile dashboard
- [ ] Serving size calculator
- [ ] Recommendation engine
- [ ] Build Your Bowl configurator
- [ ] Pet-linked subscriptions

#### Customer Portal (Track D)
- [ ] Customer dashboard
- [ ] Order history
- [ ] Subscription management UI
- [ ] Payment method management
- [ ] Account settings
- [ ] Shipping address management

#### Marketing Automation (Track E)
- [ ] GoHighLevel integration
- [ ] Zapier/Make workflows
- [ ] Email automation (welcome, engagement)
- [ ] SMS automation
- [ ] Churn prevention workflows
- [ ] Live chat integration

#### Migration & Testing (Track F)
- [ ] Customer data migration
- [ ] Payment method migration
- [ ] Subscription migration
- [ ] QA testing (functional, cross-browser, mobile)
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Launch

---

### Risk Dashboard

Monitor active risks weekly and update mitigation status.

| Risk | Likelihood | Impact | Mitigation Status | Owner |
|------|-----------|--------|------------------|-------|
| Timeline slippage | High | High | ⚠️ Monitoring | PM |
| Customer churn during migration | Medium | High | 🟢 Plan in place | Tech Lead |
| Payment migration failures | Medium | High | 🟢 Plan in place | Backend Dev |
| Duplicate billing | Low | Critical | 🟢 Safeguards implemented | Tech Lead |
| API rate limits | Medium | Medium | 🟢 Monitoring | Backend Dev |
| Late design changes | Medium | Medium | ⚠️ Needs stakeholder commitment | Designer |
| Integration failures | Medium | Medium | 🟢 Backups identified | Backend Dev |
| Performance issues | Low | High | 🟢 Load testing planned | Frontend Dev |
| SEO ranking drops | Medium | Medium | 🟢 Redirects planned | Tech Lead |
| Team unavailability | Medium | Medium | ⚠️ Backup plan needed | PM |

---

### Key Metrics to Track Post-Launch

After launch, monitor these metrics daily for the first 2 weeks, then weekly:

#### Business Metrics
- **Conversion rate:** Target 4-5% (up from 2.5%)
- **Average order value:** Target $175 (up from $150)
- **Monthly recurring revenue:** Track growth week over week
- **Customer churn rate:** Target <5% monthly (down from 8%)
- **Payment success rate:** Target 95%+

#### Technical Metrics
- **Page load time (LCP):** Target <2.5s
- **Error rate:** Target <0.1% of requests
- **Uptime:** Target 99.9%
- **API response time:** Target <500ms (p95)

#### Customer Satisfaction
- **CSAT score:** Target 4.5/5.0
- **Support ticket volume:** Monitor for spikes
- **Feature adoption:** Track usage of pet profiles, subscription portal

---

## Next Steps

### Immediate Actions (This Week)

1. **Schedule kickoff meeting** with all stakeholders (Christie, Tres, PM, Tech Lead)
2. **Finalize team hiring** if developers not yet onboarded
3. **Provision accounts** (Shopify, Vercel, Supabase, GoHighLevel)
4. **Create GitHub repository** and grant access to team
5. **Review and approve this implementation plan** with any necessary adjustments

### Before Week 1 Starts

- [ ] All team members onboarded and have access to tools
- [ ] Communication channels set up (Slack, project management tool)
- [ ] Weekly meeting schedule established
- [ ] Budget approved and allocated
- [ ] Contracts signed with vendors (ReCharge, GoHighLevel, etc.)

---

## Document Maintenance

**This is a living document.** Update weekly with:
- Progress on weekly milestones
- Changes to timeline or scope
- New risks identified
- Decisions made by stakeholders
- Lessons learned

**Last Updated:** [Date]
**Updated By:** [Name]
**Next Review:** [Date]

---

## Appendix

### Key Contacts

**Stakeholders:**
- Christie Willett (Founder): [email]
- Tres (Co-Founder): [email]

**Development Team:**
- Tech Lead: [name, email]
- Frontend Developer: [name, email]
- Backend Developer: [name, email]
- UI/UX Designer: [name, email]
- QA Engineer: [name, email]
- Project Manager: [name, email]

**Vendor Support:**
- Shopify Support: [support contact]
- ReCharge Support: [support contact]
- Vercel Support: [support contact]
- Supabase Support: [support contact]

### Useful Resources

**Documentation:**
- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)
- [Next.js 14 App Router Docs](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Supabase Docs](https://supabase.com/docs)
- [ReCharge API Docs](https://developer.rechargepayments.com/)

**Design Assets:**
- Figma project: [link]
- Brand guidelines: [link]
- Photo library: [link]

**Project Management:**
- GitHub repository: [link]
- Project board: [link]
- Weekly meeting notes: [link]
- Decision log: [link]

---

**End of Implementation Plan**

This plan is designed to guide Waggin Meals through a successful website modernization in 16 weeks. Success requires dedicated team effort, clear communication, and willingness to adapt as challenges arise. With this roadmap, Waggin Meals will launch a world-class pet food subscription platform that delights customers and drives sustainable growth. 🚀🐕
