# Paid Consultation System - Implementation Plan

## Overview
Complete system for **$395 Comprehensive Canine Nutrition Consultation** - from questionnaire submission through payment, fulfillment, and customer account integration.

**Current State**: Questionnaire form exists but has no backend (line 120-122: `// TODO: Send to database/email`)

**Goal**: Full e-commerce consultation service with payment processing, customer tracking, and Christie's admin workflow.

---

## 🔄 Complete User Journey

### Phase 1: Discovery & Questionnaire
1. User browses to `/nutrition-services`
2. Clicks "Schedule Now →" for $395 consultation
3. **Questionnaire modal opens** (existing form)
4. User fills out detailed questionnaire:
   - Contact info
   - Dog details (breed, age, weight, gender)
   - Current diet information
   - Health concerns & medications
   - Goals & preferred format (Zoom/FaceTime/In-Person)

### Phase 2: Payment
5. Submit questionnaire → **Redirect to checkout with consultation product**
6. Questionnaire data stored temporarily (localStorage or database)
7. User completes payment ($395 + optional travel fees)
8. Order created with `product_type: 'consultation'`

### Phase 3: Post-Payment Automation
9. **GHL triggers**:
   - Tag customer: `paid-consultation-$395`
   - Email sequence: Confirmation + questionnaire link (if not filled)
   - Reminder emails if questionnaire incomplete after 48 hours
10. **System actions**:
   - Link questionnaire data to order
   - Create consultation record in database
   - Send confirmation email to customer
   - Notify Christie via admin email

### Phase 4: Fulfillment
11. **Christie's workflow**:
   - View consultation in admin dashboard
   - Review questionnaire responses
   - Mark status: `pending` → `reviewed` → `scheduled` → `completed`
   - Upload consultation deliverables (meal plan PDF, recommendations)
12. **Customer notifications**:
   - Consultation scheduled (with calendar invite)
   - Consultation completed (with access to materials)

### Phase 5: Customer Access
13. **Customer account**:
   - View consultation history
   - Download meal plans & recommendations
   - See follow-up consultation dates
   - Request additional support

---

## 📊 Database Schema

### New Tables

#### `paid_consultations`
```sql
CREATE TABLE paid_consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Order & Customer Links
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,

  -- Contact Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  state TEXT,

  -- Dog Information (JSONB for multiple dogs)
  dogs JSONB NOT NULL,
  -- Example structure:
  -- [
  --   {
  --     "name": "Max",
  --     "breed": "Golden Retriever",
  --     "age": "5 years",
  --     "weight": "60 lbs",
  --     "gender": "male",
  --     "spayedNeutered": "yes"
  --   }
  -- ]

  -- Diet Information (JSONB)
  current_diet JSONB NOT NULL,
  -- {
  --   "currentFood": "Blue Buffalo Chicken",
  --   "durationOnDiet": "6 months",
  --   "portionSize": "2 cups",
  --   "feedingFrequency": "twice daily"
  -- }

  -- Health Information (JSONB)
  health_info JSONB,
  -- {
  --   "allergies": "chicken, wheat",
  --   "sensitivities": "dairy",
  --   "chronicConditions": "arthritis",
  --   "medications": "Carprofen 50mg twice daily",
  --   "recentVetVisits": "Annual checkup last month"
  -- }

  -- Goals & Preferences
  goals TEXT NOT NULL,
  preferred_format TEXT, -- zoom, facetime, in-person
  special_requests TEXT,

  -- Consultation Status
  status TEXT DEFAULT 'questionnaire_pending',
  -- States: questionnaire_pending, payment_pending, paid, reviewed, scheduled, completed, delivered

  -- Scheduling
  scheduled_date TIMESTAMP WITH TIME ZONE,
  scheduled_duration INTEGER, -- minutes
  consultation_notes TEXT, -- Christie's notes during consultation

  -- Deliverables
  meal_plan_url TEXT, -- PDF stored in Supabase Storage
  recommendations_url TEXT, -- Additional documents
  follow_up_dates TIMESTAMP WITH TIME ZONE[], -- Array of follow-up dates

  -- GHL Integration
  ghl_contact_id TEXT,
  ghl_synced_at TIMESTAMP WITH TIME ZONE,
  ghl_tags TEXT[], -- Array of tags applied

  -- Admin Tracking
  assigned_to TEXT, -- Christie or staff member
  admin_notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  questionnaire_completed_at TIMESTAMP WITH TIME ZONE,
  payment_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_paid_consultations_order ON paid_consultations(order_id);
CREATE INDEX idx_paid_consultations_customer ON paid_consultations(customer_id);
CREATE INDEX idx_paid_consultations_email ON paid_consultations(email);
CREATE INDEX idx_paid_consultations_status ON paid_consultations(status);
CREATE INDEX idx_paid_consultations_scheduled ON paid_consultations(scheduled_date);
CREATE INDEX idx_paid_consultations_ghl ON paid_consultations(ghl_contact_id);
```

#### Updates to `orders` table
```sql
-- Add consultation-specific fields
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS is_consultation BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consultation_id UUID REFERENCES paid_consultations(id);
```

#### Updates to `products` table
```sql
-- Create consultation product
INSERT INTO products (
  title,
  handle,
  description,
  price,
  category,
  tags,
  product_type,
  is_shippable,
  is_published
) VALUES (
  'Comprehensive Canine Nutrition Consultation',
  'nutrition-consultation-395',
  'Up to 2 hours with certified nutritionist. Includes custom meal plan, supplement protocol, and 2 follow-up sessions.',
  395.00,
  'consultation',
  ARRAY['consultation', 'service', 'nutrition'],
  'service',
  false, -- Not shippable
  true
);
```

---

## 🔌 API Endpoints

### 1. Save Questionnaire (Pre-Payment)
**POST** `/api/consultations/questionnaire`

```typescript
// Request body
{
  consultationType: 'comprehensive',
  ownerName: string,
  email: string,
  phone: string,
  city: string,
  state: string,
  dogName: string,
  breed: string,
  age: string,
  weight: string,
  gender: 'male' | 'female',
  spayedNeutered: 'yes' | 'no',
  currentFood: string,
  durationOnDiet: string,
  portionSize: string,
  feedingFrequency: string,
  allergies: string,
  sensitivities: string,
  chronicConditions: string,
  medications: string,
  recentVetVisits: string,
  goals: string,
  preferredFormat: 'zoom' | 'facetime' | 'in-person',
  specialRequests: string
}

// Response
{
  consultationId: string, // UUID
  checkoutUrl: string, // Redirect to checkout with consultation product
  message: 'Questionnaire saved. Please complete payment to finalize.'
}
```

**Actions**:
1. Create `paid_consultations` record with `status: 'payment_pending'`
2. Check if customer exists by email
3. Link to customer if exists
4. Generate checkout session with consultation product
5. Store consultation ID in session for post-payment linking

### 2. Complete Consultation After Payment
**POST** `/api/consultations/complete-payment`

```typescript
// Request body (called by checkout success webhook)
{
  orderId: string,
  consultationId: string,
  customerId: string
}

// Actions:
// 1. Update consultation: status = 'paid', payment_completed_at = now
// 2. Link order to consultation
// 3. Send confirmation emails (customer + Christie)
// 4. Trigger GHL automation
// 5. Create follow-up consultation records (3-month milestone)
```

### 3. Update Consultation Status (Admin)
**PATCH** `/api/admin/consultations/:id`

```typescript
// Request body
{
  status: 'reviewed' | 'scheduled' | 'completed' | 'delivered',
  scheduled_date?: timestamp,
  meal_plan_url?: string,
  recommendations_url?: string,
  consultation_notes?: string,
  admin_notes?: string
}
```

### 4. Upload Deliverables (Admin)
**POST** `/api/admin/consultations/:id/upload`

```typescript
// Multipart form data
{
  file: File, // PDF or ZIP
  type: 'meal_plan' | 'recommendations' | 'other'
}

// Actions:
// 1. Upload to Supabase Storage: /consultations/:id/:type/:filename
// 2. Update consultation record with file URL
// 3. Notify customer via email
```

---

## 🎨 UI Components

### Customer-Facing

#### 1. Questionnaire Modal (Existing - Update)
**File**: `app/nutrition-services/page.tsx`

**Changes**:
- Remove `showSuccess` state
- On submit: Call `/api/consultations/questionnaire`
- Redirect to checkout with consultation product

#### 2. Checkout Integration
**File**: `app/checkout/page.tsx`

**Changes**:
- Detect consultation product in cart
- Show special messaging: "Complete payment to finalize your consultation booking"
- After payment success, trigger consultation completion

#### 3. Customer Dashboard - Consultations Tab
**New File**: `app/account/consultations/page.tsx`

**Features**:
- List all consultations (past & upcoming)
- Show status badges
- Download meal plans & recommendations
- View consultation notes
- Request follow-up sessions

#### 4. Consultation Detail Page
**New File**: `app/account/consultations/[id]/page.tsx`

**Features**:
- Full consultation details
- Dog information
- Diet history
- Health concerns
- Scheduled date (if set)
- Download deliverables
- Add to calendar button
- Message Christie button

### Admin-Facing

#### 5. Admin Consultations Dashboard
**New File**: `app/admin/paid-consultations/page.tsx`

**Features**:
- Filter by status: `payment_pending`, `paid`, `reviewed`, `scheduled`, `completed`, `delivered`
- Sort by: date, customer name, scheduled date
- Quick actions: Mark reviewed, Schedule, Upload deliverables
- Search by customer name/email

#### 6. Admin Consultation Detail
**New File**: `app/admin/paid-consultations/[id]/page.tsx`

**Features**:
- Full questionnaire responses (formatted beautifully)
- Customer & order information
- Status timeline (payment → reviewed → scheduled → completed → delivered)
- File upload for deliverables
- Rich text editor for consultation notes
- Schedule consultation (date/time picker)
- Email customer button (pre-filled templates)
- Link to customer account
- Link to order details

---

## 📧 Email Automation

### Customer Emails

#### 1. Questionnaire Confirmation (If filled before payment)
**Trigger**: After questionnaire submission, before payment
**Template**: `consultation_questionnaire_saved`

```
Subject: Complete Your $395 Consultation Payment

Hi [First Name],

Thank you for filling out your consultation questionnaire!

To finalize your booking, please complete payment:
👉 [Complete Payment Button → /checkout?consultation=[id]]

Your consultation includes:
✓ Up to 2 hours with Christie
✓ Custom meal plan & recipe formulation
✓ Supplement protocol
✓ 2 follow-up sessions (3-month evaluation)
✓ Ongoing email/phone support

Questions? Reply to this email.

Christie & The Waggin Meals Team
```

#### 2. Payment Confirmation
**Trigger**: After successful payment
**Template**: `consultation_payment_confirmed`

```
Subject: Consultation Payment Confirmed - What Happens Next

Hi [First Name],

Your $395 consultation has been confirmed! 🎉

What happens next:
1️⃣ Christie will review your questionnaire within 24-48 hours
2️⃣ We'll reach out to schedule your consultation
3️⃣ You'll receive a calendar invite with Zoom/FaceTime link
4️⃣ After the consultation, you'll get your custom meal plan

[View Consultation Dashboard → /account/consultations]

Excited to help [Dog Name] thrive!

Christie & The Waggin Meals Team
```

#### 3. Consultation Scheduled
**Trigger**: When Christie schedules consultation
**Template**: `consultation_scheduled`

```
Subject: Your Consultation is Scheduled with Christie

Hi [First Name],

Great news! Your consultation is scheduled for:

📅 [Date & Time]
⏰ Duration: Up to 2 hours
📍 Format: [Zoom/FaceTime/In-Person]

[Add to Calendar Button]
[Join Meeting Link]

What to prepare:
• Have recent photos of [Dog Name] ready
• Any vet records or lab results
• List of current supplements/medications
• Questions you want to discuss

See you soon!

Christie & The Waggin Meals Team
```

#### 4. Meal Plan Delivered
**Trigger**: When Christie uploads deliverables
**Template**: `consultation_delivered`

```
Subject: Your Custom Meal Plan is Ready!

Hi [First Name],

Your personalized nutrition plan for [Dog Name] is ready! 🐾

Download your materials:
📄 Custom Meal Plan & Recipes
📋 Supplement Protocol
📚 Educational Resources

[Download All Files Button → /account/consultations/[id]]

Implementation tips:
• Start transition slowly (7-10 days)
• Monitor [Dog Name]'s response
• Reach out with any questions

Your first follow-up is scheduled for [3-month date].

To your pup's health!

Christie
```

### Christie Admin Emails

#### 5. New Paid Consultation Alert
**Trigger**: After payment completion
**Template**: `admin_new_paid_consultation`

```
Subject: New $395 Consultation - [Customer Name] ([Dog Name])

🎯 NEW PAID CONSULTATION

Customer: [First Name] [Last Name]
Email: [Email]
Phone: [Phone]
Dog: [Dog Name] | [Breed] | [Age] | [Weight]

Main Concerns:
[Goals excerpt...]

Payment: $395.00 ✅
Order #[Order ID]

[View Full Questionnaire → /admin/paid-consultations/[id]]
[Schedule Consultation Button]

---
Waggin Meals Admin System
```

---

## 🔄 GoHighLevel Integration

### Triggers & Workflows

#### 1. Post-Payment Sync
**When**: Order completed with consultation product

**Actions**:
```javascript
{
  locationId: process.env.GHL_LOCATION_ID,
  firstName: customer.first_name,
  lastName: customer.last_name,
  email: customer.email,
  phone: customer.phone,
  tags: [
    'paid-consultation-$395',
    'customer',
    'active-client'
  ],
  customField: {
    [GHL_FIELD_CONSULTATION_ID]: consultation.id,
    [GHL_FIELD_ORDER_ID]: order.id,
    [GHL_FIELD_DOG_NAME]: consultation.dogs[0].name,
    [GHL_FIELD_CONSULTATION_STATUS]: consultation.status,
    [GHL_FIELD_SCHEDULED_DATE]: consultation.scheduled_date
  }
}
```

#### 2. GHL Workflow: New Consultation
**Trigger**: Contact tagged with `paid-consultation-$395`

**Workflow Steps**:
1. **Day 0** (immediate): Payment confirmation email
2. **Day 1**: "Christie is reviewing your questionnaire" check-in
3. **Day 3** (if not scheduled): "We'll schedule your consultation soon" reminder
4. **Day 7** (if not scheduled): Urgent follow-up
5. **2 days before consultation**: Reminder email with prep checklist
6. **1 day after consultation**: "How was your consultation?" feedback request
7. **Week 3**: "How is [Dog Name] doing on the new plan?" check-in
8. **3 months**: "Time for your follow-up consultation!" reminder

#### 3. GHL Workflow: Consultation Reminder (48 hours before)
**Trigger**: Consultation scheduled_date - 48 hours

**Actions**:
- Send SMS reminder
- Send email with join link
- Update custom field: `reminder_sent = true`

---

## 🎨 Admin Dashboard Views

### Paid Consultations Dashboard

#### Filters & Metrics
```
┌─────────────────────────────────────────────────────────────┐
│  Paid Consultations                                         │
├─────────────────────────────────────────────────────────────┤
│  [All] [Payment Pending] [Paid] [Scheduled] [Completed]    │
│                                                              │
│  Metrics:                                                    │
│  • Pending Review: 3                                        │
│  • Scheduled (Next 7 Days): 2                               │
│  • Awaiting Deliverables: 1                                 │
│  • Total This Month: $3,950 (10 consultations)             │
└─────────────────────────────────────────────────────────────┘
```

#### Consultation Cards
```
┌─────────────────────────────────────────────────────────────┐
│  Sarah Johnson | Max (Golden Retriever, 5yr, 60lbs)        │
│  sarah@email.com | (555) 123-4567                          │
├─────────────────────────────────────────────────────────────┤
│  Status: [PAID]  Order #12345  Paid: Nov 1, 2025          │
│                                                              │
│  Main Concerns: Allergies, weight management                │
│  Format: Zoom                                                │
│                                                              │
│  [📅 Schedule] [📝 View Details] [✉️ Email Customer]        │
└─────────────────────────────────────────────────────────────┘
```

### Consultation Detail View

#### Information Sections
1. **Customer Info**: Name, contact, location
2. **Order Details**: Order ID, payment status, date
3. **Dog Information**: Name, breed, age, weight, health history
4. **Diet History**: Current food, duration, portion sizes
5. **Health Concerns**: Allergies, conditions, medications
6. **Goals**: Customer's objectives
7. **Consultation Details**: Scheduled date, format, duration
8. **Deliverables**: Upload section + download links
9. **Status Timeline**: Visual timeline of status changes
10. **Admin Notes**: Rich text editor for Christie's notes

---

## ✅ Implementation Checklist

### Phase 1: Database & Schema
- [ ] Create `paid_consultations` table migration
- [ ] Add consultation fields to `orders` table
- [ ] Create consultation product in database
- [ ] Add travel fee products (optional upsells)
- [ ] Test all foreign key relationships

### Phase 2: API Endpoints
- [ ] `/api/consultations/questionnaire` - Save pre-payment
- [ ] `/api/consultations/complete-payment` - Post-payment webhook
- [ ] `/api/admin/consultations/:id` - Admin updates
- [ ] `/api/admin/consultations/:id/upload` - File uploads
- [ ] `/api/consultations/:id/customer` - Customer view

### Phase 3: Customer UI
- [ ] Update questionnaire modal to save & redirect
- [ ] Add consultation product to cart flow
- [ ] Create customer consultations dashboard
- [ ] Create consultation detail page
- [ ] Add download functionality for deliverables
- [ ] Add "Add to Calendar" functionality

### Phase 4: Admin UI
- [ ] Create admin consultations dashboard
- [ ] Create consultation detail/edit page
- [ ] Add file upload component
- [ ] Add scheduling interface (date/time picker)
- [ ] Add email templates component
- [ ] Add status update workflow

### Phase 5: Email Automation
- [ ] Create all email templates
- [ ] Wire up transactional emails
- [ ] Test all email triggers
- [ ] Add email preview functionality

### Phase 6: GHL Integration
- [ ] Configure custom fields in GHL
- [ ] Create contact sync on payment
- [ ] Set up GHL workflow automation
- [ ] Test tag triggers
- [ ] Add SMS reminders (optional)

### Phase 7: Storage & Files
- [ ] Set up Supabase Storage bucket: `/consultations`
- [ ] Configure file upload security rules
- [ ] Add PDF generation for meal plans (optional)
- [ ] Test file downloads

### Phase 8: Testing
- [ ] End-to-end test: Questionnaire → Payment → Fulfillment
- [ ] Test all email triggers
- [ ] Test GHL automation
- [ ] Test customer account access
- [ ] Test admin workflow
- [ ] Test file uploads/downloads

### Phase 9: Documentation
- [ ] User guide for customers
- [ ] Admin workflow documentation for Christie
- [ ] Email template customization guide
- [ ] Troubleshooting guide

---

## 🚀 Deployment Considerations

### Environment Variables (Add to Netlify)
```bash
# Supabase Storage
SUPABASE_STORAGE_BUCKET_CONSULTATIONS=consultations

# Email Templates
ADMIN_EMAIL=christie@wagginmeals.com
ADMIN_CONSULTATION_EMAIL=consultations@wagginmeals.com
```

### Supabase Storage Setup
```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('consultations', 'consultations', false);

-- Set up storage policies (admin only can upload)
CREATE POLICY "Admin upload consultation files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'consultations' AND auth.role() = 'service_role');

-- Customers can download their own files
CREATE POLICY "Customers download their consultation files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'consultations' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM paid_consultations
    WHERE customer_id = auth.uid()
  )
);
```

---

## 📊 Success Metrics

### Key Performance Indicators
- **Conversion Rate**: Questionnaires filled → Payments completed
- **Time to Schedule**: Days from payment to scheduled consultation
- **Time to Deliver**: Days from consultation to deliverables uploaded
- **Customer Satisfaction**: Post-consultation survey rating
- **Follow-Up Rate**: % of customers who book follow-up consultations

### Admin Efficiency Metrics
- **Average consultation prep time**: Time spent reviewing questionnaire
- **Deliverable turnaround time**: Days to upload meal plan after consultation
- **Email response time**: Average time to respond to customer questions

---

## 🎯 Future Enhancements

### Phase 2 Features
- [ ] **Recurring Follow-Ups**: Auto-schedule 3-month, 6-month follow-ups
- [ ] **Consultation Packages**: Bundle 3 consultations at discount
- [ ] **Group Consultations**: Support for multiple customers in one session
- [ ] **Video Recordings**: Store Zoom recordings for customer access
- [ ] **Meal Plan Templates**: Pre-built templates Christie can customize
- [ ] **AI-Assisted Meal Plans**: Auto-generate draft based on questionnaire
- [ ] **Mobile App**: Native mobile experience for customers

### Integration Ideas
- **Calendar Integration**: Sync with Google Calendar, Calendly
- **Stripe Payment Plans**: Allow payment plans for consultations
- **Typeform Integration**: Use Typeform for questionnaire (better UX)
- **Loom/Video**: Pre-consultation video messages from Christie
- **SMS Reminders**: Via Twilio for consultation reminders

---

**Status**: 📋 **Implementation Plan Complete**
**Next Step**: Begin Phase 1 - Database & Schema
**Estimated Timeline**: 2-3 weeks for MVP
**Priority**: High - Core business revenue driver
