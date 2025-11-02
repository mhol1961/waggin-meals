# Paid Consultation System - Quick Start Guide

## 🎯 What We're Building

A complete **$395 consultation e-commerce flow** that connects:
- Questionnaire form (already exists)
- Payment processing (checkout integration)
- Database storage (customer + consultation data)
- Admin dashboard (Christie's workflow)
- Customer portal (view consultations & download materials)
- Email automation (GHL + transactional emails)

---

## 🚨 Current State vs Goal

### Currently
- ✅ Beautiful questionnaire UI exists at `/nutrition-services`
- ❌ **Questionnaire has no backend** (line 120: `// TODO: Send to database/email`)
- ❌ No payment integration
- ❌ No database storage
- ❌ No admin dashboard for paid consultations
- ❌ No customer portal to view consultations
- ❌ No email automation

### After Implementation
- ✅ User fills questionnaire → Redirects to checkout
- ✅ Payment processed → Consultation record created
- ✅ Christie sees consultation in admin dashboard
- ✅ Christie uploads meal plan → Customer gets notification
- ✅ Customer can view/download materials from account
- ✅ GHL automation handles all follow-up emails

---

## 🔄 Complete User Flow

```
1. Customer browses /nutrition-services
   ↓
2. Clicks "Schedule Now" for $395 consultation
   ↓
3. Fills out questionnaire (dog info, health history, goals)
   ↓
4. Submit → Saves questionnaire to database
   ↓
5. Redirects to /checkout with consultation product in cart
   ↓
6. Customer completes payment ($395)
   ↓
7. Order created + Consultation record linked
   ↓
8. GHL automation triggers:
   • Tag customer: "paid-consultation-$395"
   • Send confirmation email
   • Add to email workflow
   ↓
9. Christie gets admin email notification
   ↓
10. Christie reviews questionnaire in admin dashboard
    ↓
11. Christie schedules consultation (Zoom/FaceTime/In-Person)
    ↓
12. Customer receives calendar invite
    ↓
13. Consultation happens (up to 2 hours)
    ↓
14. Christie uploads deliverables:
    • Custom meal plan PDF
    • Supplement protocol
    • Recipes & resources
    ↓
15. Customer gets "Your meal plan is ready!" email
    ↓
16. Customer downloads materials from account portal
    ↓
17. GHL automation schedules follow-up emails:
    • Week 3: "How is [Dog Name] doing?"
    • 3 months: "Time for your follow-up consultation"
```

---

## 📊 Database Schema Summary

### New Table: `paid_consultations`
Stores complete consultation data including:
- Customer & contact info
- Dog details (breed, age, weight, health history)
- Current diet information
- Health concerns & goals
- Consultation scheduling (date, format, duration)
- File uploads (meal plans, recommendations)
- Status tracking (pending → paid → scheduled → completed → delivered)
- GHL integration fields

**Links to**:
- `orders` table (via `order_id`)
- `customers` table (via `customer_id`)

---

## 🎨 What Christie Will See

### Admin Dashboard: `/admin/paid-consultations`

**Filters**:
- [ ] Payment Pending (3)
- [ ] Paid - Awaiting Review (5)
- [ ] Scheduled (2)
- [ ] Completed (15)
- [ ] Delivered (120)

**Each Consultation Card Shows**:
```
┌─────────────────────────────────────────────────┐
│  Sarah Johnson | Max (Golden Retriever, 5yr)   │
│  sarah@email.com | (555) 123-4567              │
│  Status: [PAID] Order #12345  Nov 1, 2025     │
│                                                  │
│  Main Concerns: Allergies, weight management    │
│  Format: Zoom                                    │
│                                                  │
│  [📅 Schedule] [📝 View Details] [✉️ Email]     │
└─────────────────────────────────────────────────┘
```

### Consultation Detail Page

**Tabs**:
1. **Overview**: Customer info, dog details, payment status
2. **Questionnaire**: Full responses (beautifully formatted)
3. **Health History**: Allergies, medications, vet visits
4. **Schedule**: Date/time picker, send calendar invite
5. **Deliverables**: Upload meal plans & recommendations
6. **Notes**: Christie's consultation notes (rich text)
7. **Timeline**: Status history (paid → scheduled → completed)

**Actions**:
- Mark as Reviewed
- Schedule Consultation
- Upload Files
- Email Customer (pre-filled templates)
- View Order Details
- Add Admin Notes

---

## 📧 Email Automation

### Customer Emails (Automatic)
1. **Payment Confirmed** - "What happens next"
2. **Consultation Scheduled** - Calendar invite + join link
3. **2 Days Before** - Reminder + prep checklist
4. **Meal Plan Ready** - Download link
5. **Week 3** - "How is [Dog Name] doing?"
6. **3 Months** - Follow-up consultation reminder

### Christie Emails (Automatic)
1. **New Paid Consultation** - "Review questionnaire & schedule"
2. **2 Days Before Consultation** - Reminder with customer details
3. **Deliverable Due** - "Upload meal plan for [Customer]"

### GHL Workflows
- Tag-based automation in GoHighLevel
- SMS reminders (optional)
- Custom fields sync consultation status

---

## 🎯 Implementation Phases

### Phase 1: Core Functionality (Week 1)
**Goal**: Get questionnaire → payment → database working

- [ ] Create `paid_consultations` database table
- [ ] Build API: `/api/consultations/questionnaire`
- [ ] Update questionnaire form to save & redirect to checkout
- [ ] Add consultation product to database
- [ ] Link order completion to consultation record

**Result**: Customer can pay for consultation, data saves to database

---

### Phase 2: Admin Dashboard (Week 2)
**Goal**: Christie can view & manage consultations

- [ ] Build `/admin/paid-consultations` list page
- [ ] Build consultation detail page
- [ ] Add file upload functionality
- [ ] Add scheduling interface
- [ ] Add status updates

**Result**: Christie has complete admin workflow

---

### Phase 3: Customer Portal (Week 2)
**Goal**: Customers can access their consultations

- [ ] Build `/account/consultations` page
- [ ] Build consultation detail page
- [ ] Add download functionality
- [ ] Add "Add to Calendar" button

**Result**: Customers can view & download their materials

---

### Phase 4: Automation (Week 3)
**Goal**: Email & GHL automation working

- [ ] Create all email templates
- [ ] Wire up transactional emails
- [ ] Configure GHL custom fields
- [ ] Set up GHL workflows
- [ ] Test all automations

**Result**: Fully automated email sequences

---

## 📋 Immediate Next Steps

### Step 1: Create Database Migration
```bash
# Create migration file
supabase/migrations/YYYYMMDD_create_paid_consultations.sql
```

See full schema in: `docs/PAID-CONSULTATION-SYSTEM-PLAN.md`

### Step 2: Create Consultation Product
```sql
INSERT INTO products (
  title,
  handle,
  price,
  category,
  product_type,
  is_shippable
) VALUES (
  'Comprehensive Canine Nutrition Consultation',
  'nutrition-consultation-395',
  395.00,
  'consultation',
  'service',
  false
);
```

### Step 3: Update Questionnaire Form
**File**: `app/nutrition-services/page.tsx`

**Change**:
```typescript
// Old (line 118-124):
const handleSubmit = () => {
  if (validateForm()) {
    console.log('Form submitted:', formData);
    setShowSuccess(true);
    // TODO: Send to database/email
  }
};

// New:
const handleSubmit = async () => {
  if (validateForm()) {
    const response = await fetch('/api/consultations/questionnaire', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    const { consultationId, checkoutUrl } = await response.json();
    window.location.href = checkoutUrl; // Redirect to checkout
  }
};
```

---

## 💰 Revenue Impact

**Current**: $0/month from consultations (questionnaire doesn't work)

**After Implementation**:
- 10 consultations/month × $395 = **$3,950/month**
- 120 consultations/year × $395 = **$47,400/year**

Plus follow-up consultations, recurring customers, and upsells.

---

## 🎓 Training for Christie

### Admin Workflow (After Implementation)

**Daily Tasks**:
1. Check `/admin/paid-consultations` for new requests
2. Review questionnaires
3. Schedule consultations (send calendar invites)
4. After consultation, upload meal plan PDF
5. Monitor customer questions in email

**Tools You'll Have**:
- 📊 Dashboard with all consultations
- 📧 Pre-written email templates
- 📅 Calendar integration
- 📁 File upload system
- 📝 Rich text notes editor
- 🔔 Automated email notifications

**Average Time Per Consultation**:
- Review questionnaire: 15 minutes
- Consultation: 2 hours
- Create meal plan: 2-3 hours
- Upload & notify: 5 minutes
- **Total**: ~5 hours per consultation

---

## 📚 Documentation Links

**Full Implementation Plan**:
`docs/PAID-CONSULTATION-SYSTEM-PLAN.md`

**Database Schema**:
See "Database Schema" section in full plan

**API Endpoints**:
See "API Endpoints" section in full plan

**Email Templates**:
See "Email Automation" section in full plan

**GHL Integration**:
See "GoHighLevel Integration" section in full plan

---

## ❓ FAQ

### Q: Can customers fill out the questionnaire after payment?
**A**: Yes! If they just want to pay first, they can checkout with the consultation product, then fill out the questionnaire later via a link in the confirmation email.

### Q: What if a customer needs to update their questionnaire?
**A**: They can edit it from their account portal until Christie marks the consultation as "Reviewed".

### Q: How do travel fees work?
**A**: Create separate products for each travel fee tier. Customer adds to cart during checkout if selecting in-person consultation.

### Q: Can Christie have multiple follow-up consultations?
**A**: Yes! The system supports creating multiple consultation records linked to the same customer. Each follow-up can be scheduled, tracked, and have its own deliverables.

### Q: What if a customer requests a refund?
**A**: Admin can mark consultation as "Cancelled" and issue refund through Authorize.net. Customer keeps access to any materials already delivered.

---

**Ready to Start?** → Begin with Phase 1: Core Functionality

**Questions?** → See full plan: `docs/PAID-CONSULTATION-SYSTEM-PLAN.md`

**Status**: 📋 Planning Complete | 🚧 Implementation Pending
