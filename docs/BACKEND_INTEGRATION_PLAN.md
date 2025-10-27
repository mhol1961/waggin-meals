# Backend Integration Plan - Quiz & Calculator

**Created**: October 27, 2025
**Purpose**: Document integration requirements for Quiz, Calculator, and Questionnaire systems

---

## Overview

The new luxury-expert-homepage variation includes a Quick Assessment quiz and Feeding Calculator that need backend integration with:
- **Supabase** (primary database storage)
- **GoHighLevel (GHL)** (CRM & marketing automation)

---

## Features to Integrate

### 1. Quick Assessment Quiz (5 Questions)

**Purpose**: Capture initial pet health concerns and qualify leads

**Questions**:
1. Primary concern (digestive, skin, weight, energy, allergies, other)
2. Current diet (kibble, wet, mix, raw, home-cooked, unsure)
3. Vet diagnosis status (diagnosed, tests no answers, no diagnosis, N/A)
4. Previous solutions tried (changed food, medications, supplements, special diet, nothing, multiple)
5. Urgency level (very urgent, moderately urgent, looking to improve, exploring)

**Data to Capture**:
```typescript
interface QuizResponse {
  id: string; // UUID
  email?: string; // Optional - collected at end
  dog_name?: string; // Optional
  primary_concern: string;
  current_diet: string;
  vet_diagnosis: string;
  tried_solutions: string;
  urgency: string;
  submitted_at: timestamp;
  ip_address?: string;
  user_agent?: string;
}
```

**Supabase Table**: `quiz_responses`

**GHL Integration**:
- Create/update contact in GHL
- Tag based on urgency: `urgent`, `moderate`, `exploring`
- Tag based on concern: `digestive`, `skin`, `weight`, etc.
- Add to nurture sequence based on urgency level

---

### 2. Feeding Calculator

**Purpose**: Provide basic calorie estimates and capture interest in custom meal plans

**Inputs**:
- Dog's weight (lbs)
- Dog's age (years)
- Activity level (low, moderate, high)

**Calculation Formula**:
```
RER = 70 * (weight_in_kg)^0.75
Daily Calories = RER * activity_multiplier

Activity Multipliers:
- Low: 1.2
- Moderate: 1.6
- High: 2.0

Age Adjustments:
- Puppies (<1 year): × 1.5
- Seniors (>7 years): × 0.9
```

**Data to Capture**:
```typescript
interface CalculatorResult {
  id: string; // UUID
  email?: string; // Optional - collected if user wants meal plan
  dog_name?: string;
  weight_lbs: number;
  age_years: number;
  activity_level: 'low' | 'moderate' | 'high';
  calculated_calories: number;
  interested_in_meal_plan: boolean;
  submitted_at: timestamp;
  ip_address?: string;
  user_agent?: string;
}
```

**Supabase Table**: `calculator_results`

**GHL Integration**:
- If user provides email → create/update contact
- Tag: `calculator-user`
- Tag based on interest: `meal-plan-interested` or `just-browsing`
- Add to nurture sequence if interested in meal plan

---

### 3. Detailed Consultation Questionnaire

**Purpose**: Collect comprehensive information for $395 consultation bookings

**Categories**:

#### A. Basic Information
- Dog's name
- Breed
- Age
- Weight
- Gender (neutered/spayed status)

#### B. Health History
- Current health concerns (multi-select)
- Diagnosed conditions
- Current medications/supplements
- Previous treatments tried
- Veterinarian contact info

#### C. Diet History
- Current food brand & type
- Feeding frequency
- Portion sizes
- Treats & snacks
- Known allergies/sensitivities

#### D. Symptoms & Concerns
- Digestive issues (Y/N + details)
- Skin/coat issues (Y/N + details)
- Energy levels
- Behavioral changes
- Appetite changes
- Recent weight changes

#### E. Goals
- Primary goal for consultation
- Timeline expectations
- Budget for custom meals

**Data Structure**:
```typescript
interface ConsultationQuestionnaire {
  id: string; // UUID

  // Basic Info
  dog_name: string;
  breed: string;
  age_years: number;
  weight_lbs: number;
  gender: string;
  spayed_neutered: boolean;

  // Contact Info
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  preferred_contact: 'email' | 'phone';

  // Health History
  health_concerns: string[]; // Array of concerns
  diagnosed_conditions: string;
  current_medications: string;
  previous_treatments: string;
  vet_name?: string;
  vet_phone?: string;

  // Diet History
  current_food_brand: string;
  current_food_type: string;
  feeding_frequency: string;
  portion_size: string;
  treats_snacks: string;
  known_allergies: string;

  // Symptoms
  digestive_issues: boolean;
  digestive_details?: string;
  skin_coat_issues: boolean;
  skin_coat_details?: string;
  energy_level: 'very_low' | 'low' | 'normal' | 'high' | 'very_high';
  behavioral_changes: string;
  appetite_changes: string;
  weight_changes: string;

  // Goals
  primary_goal: string;
  timeline: string;
  meal_budget: string;

  // Meta
  submitted_at: timestamp;
  consultation_booked: boolean;
  consultation_date?: timestamp;
}
```

**Supabase Table**: `consultation_questionnaires`

**GHL Integration**:
- Create contact with ALL captured data
- Tags: `consultation-interested`, `$395-package`
- Tag based on urgency/health concerns
- Assign to "Consultation Pipeline" in GHL
- Trigger workflow:
  1. Send confirmation email
  2. Send link to book consultation call
  3. Add to Christie's calendar for review
  4. Follow-up sequence if not booked within 48 hours

---

## Implementation Steps

### Phase 1: Database Setup (Supabase)

1. **Create Tables**:
```sql
-- Quiz Responses
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  dog_name TEXT,
  primary_concern TEXT NOT NULL,
  current_diet TEXT NOT NULL,
  vet_diagnosis TEXT NOT NULL,
  tried_solutions TEXT NOT NULL,
  urgency TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Calculator Results
CREATE TABLE calculator_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  dog_name TEXT,
  weight_lbs NUMERIC NOT NULL,
  age_years NUMERIC NOT NULL,
  activity_level TEXT NOT NULL,
  calculated_calories INTEGER NOT NULL,
  interested_in_meal_plan BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Consultation Questionnaires
CREATE TABLE consultation_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Basic Info
  dog_name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age_years NUMERIC NOT NULL,
  weight_lbs NUMERIC NOT NULL,
  gender TEXT NOT NULL,
  spayed_neutered BOOLEAN,

  -- Contact Info
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  owner_phone TEXT,
  preferred_contact TEXT,

  -- Health History
  health_concerns TEXT[],
  diagnosed_conditions TEXT,
  current_medications TEXT,
  previous_treatments TEXT,
  vet_name TEXT,
  vet_phone TEXT,

  -- Diet History
  current_food_brand TEXT,
  current_food_type TEXT,
  feeding_frequency TEXT,
  portion_size TEXT,
  treats_snacks TEXT,
  known_allergies TEXT,

  -- Symptoms
  digestive_issues BOOLEAN,
  digestive_details TEXT,
  skin_coat_issues BOOLEAN,
  skin_coat_details TEXT,
  energy_level TEXT,
  behavioral_changes TEXT,
  appetite_changes TEXT,
  weight_changes TEXT,

  -- Goals
  primary_goal TEXT,
  timeline TEXT,
  meal_budget TEXT,

  -- Meta
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  consultation_booked BOOLEAN DEFAULT FALSE,
  consultation_date TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_quiz_responses_submitted ON quiz_responses(submitted_at DESC);
CREATE INDEX idx_calculator_results_submitted ON calculator_results(submitted_at DESC);
CREATE INDEX idx_consultation_questionnaires_submitted ON consultation_questionnaires(submitted_at DESC);
CREATE INDEX idx_consultation_questionnaires_booked ON consultation_questionnaires(consultation_booked);
```

2. **Enable Row Level Security (RLS)**:
```sql
-- Allow anonymous inserts (for form submissions)
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_questionnaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON quiz_responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON calculator_results
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON consultation_questionnaires
  FOR INSERT WITH CHECK (true);

-- Only authenticated admins can read
CREATE POLICY "Admins can read all" ON quiz_responses
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read all" ON calculator_results
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read all" ON consultation_questionnaires
  FOR SELECT USING (auth.role() = 'authenticated');
```

---

### Phase 2: API Routes (Next.js)

Create API routes for form submissions:

1. **`/api/quiz/submit`** - Handle quiz submissions
2. **`/api/calculator/submit`** - Handle calculator results
3. **`/api/consultation/submit`** - Handle consultation questionnaire

Each route should:
- Validate input data
- Save to Supabase
- Send to GHL (async)
- Return success/error response

---

### Phase 3: GHL Integration

**GHL Webhook Configuration**:
- Get GHL API key from Christie's account
- Configure webhook endpoints
- Set up custom fields in GHL for captured data

**GHL Custom Fields Needed**:
- `dog_name`
- `dog_breed`
- `dog_age`
- `dog_weight`
- `primary_concern`
- `urgency_level`
- `calculated_calories`
- `interested_in_meal_plan`
- (+ all consultation questionnaire fields)

**GHL Workflows to Create**:
1. **Quiz Submission Flow**
   - Tag based on concern
   - Send welcome email
   - Add to nurture sequence

2. **Calculator User Flow**
   - If interested → immediate consultation CTA email
   - If not interested → add to general nurture

3. **Consultation Booking Flow**
   - Confirmation email
   - Calendar booking link
   - Christie notification
   - 48-hour follow-up if not booked

---

### Phase 4: Frontend Forms

Update forms to:
1. Validate inputs
2. Show loading states
3. Handle errors gracefully
4. Submit to API routes
5. Show success messages
6. Optional: Progressive disclosure (collect email at end for results)

---

## Email Templates Needed

### 1. Quiz Completion Email
**Subject**: "Thanks for taking our quick assessment, [Name]!"

**Body**:
- Thank you message
- Brief summary of their answers
- CTA: "Book a Free Consultation"
- CTA: "Try Our Feeding Calculator"

### 2. Calculator Results Email
**Subject**: "Your dog's personalized feeding guide is ready!"

**Body**:
- Their calculated calories
- Basic feeding guidelines
- CTA: "Get a Custom Meal Plan" ($395 consultation)
- Link to shop

### 3. Consultation Confirmation Email
**Subject**: "Your consultation questionnaire has been received!"

**Body**:
- Confirmation message
- What happens next
- Calendar booking link
- Contact info for questions

---

## Priority Order

1. **Immediate** (Week 1):
   - Create Supabase tables
   - Build API routes
   - Update luxury-expert-homepage forms to submit data

2. **High** (Week 2):
   - GHL API integration
   - Email templates
   - Automated tagging workflows

3. **Medium** (Week 3):
   - Admin dashboard to view submissions
   - Export functionality
   - Analytics/reporting

4. **Future Enhancements**:
   - Email validation (prevent duplicates)
   - Multi-step form with progress saving
   - PDF generation of results
   - Integration with Christie's calendar (Calendly/Acuity)

---

## Notes for Christie

1. **GHL Setup Required**:
   - Provide GHL API key
   - Create custom fields in GHL
   - Grant access to create workflows

2. **Email System**:
   - Which email service for transactional emails? (Resend, SendGrid, or GHL only?)
   - Approval needed on email templates

3. **Calendar Integration**:
   - What system do you use for booking? (Calendly, Acuity, GHL Calendar?)
   - Need API access or embed links

4. **Legal/Compliance**:
   - Add privacy policy for data collection
   - GDPR compliance if selling internationally
   - Terms of service for calculator (disclaimer that it's estimates only)

---

## Testing Checklist

Before launch:
- [ ] Test all form validations
- [ ] Test Supabase submissions
- [ ] Test GHL contact creation
- [ ] Test GHL tagging
- [ ] Test email deliverability
- [ ] Test on mobile devices
- [ ] Test with various dog weights/ages
- [ ] Test error handling (network failures)
- [ ] Test duplicate email submissions
- [ ] Load testing (100+ concurrent users)

---

**Last Updated**: October 27, 2025
