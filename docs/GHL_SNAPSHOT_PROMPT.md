# GoHighLevel Snapshot Creation Prompt for Waggin' Meals

## Business Overview
Create a comprehensive GoHighLevel snapshot for **Waggin' Meals Pet Nutrition Co.**, a premium dog nutrition e-commerce business run by Christie, a board-certified canine nutritionist.

**Business Model:**
- E-commerce: Fresh dog food, meal toppers, supplements, nutrition products
- Recurring subscriptions (primary revenue stream ~$3,000-5,000/month)
- High-ticket consultations ($395) - nutrition consultations for dogs with health issues
- Educational content marketing (blog, case studies, nutrition guides)
- Target customer: Dog owners seeking premium, science-backed nutrition solutions
- Average order value: $50-80
- Subscription frequencies: Weekly, bi-weekly, 4-weeks, 6-weeks, 8-weeks, monthly

---

## Technical Integration Details

### Website Integration
- **Website**: wagginmeals.com (Next.js application)
- **CRM Integration**: Via API webhooks and direct API calls
- **Location ID**: 55SQBqhAMXAUC2POlMYR
- **API Key**: Provided (already configured)

### Key Webhook Endpoints (Website → GHL)
The website will send these webhook events to GHL:

1. **Order Events:**
   - `order.created` - New order placed
   - `order.shipped` - Order shipped with tracking
   - `order.delivered` - Order delivered
   - `order.cancelled` - Order cancelled

2. **Subscription Events:**
   - `subscription.created` - New subscription started
   - `subscription.payment.success` - Successful billing
   - `subscription.payment.failed` - Payment failed
   - `subscription.paused` - Customer paused subscription
   - `subscription.resumed` - Customer resumed subscription
   - `subscription.cancelled` - Subscription cancelled

3. **Customer Events:**
   - `customer.created` - New account registration
   - `newsletter.subscribed` - Newsletter signup
   - `consultation.booked` - $395 consultation booked

4. **Cart Events:**
   - `cart.abandoned` - User left items in cart (triggered 1 hour after abandonment)
   - `cart.abandoned.reminder` - Follow-up reminder (24 hours)

### Contact Custom Fields Needed
Create these custom fields in GHL to store e-commerce data:

**Customer Profile:**
- `customer_id` (text) - Database ID
- `customer_since` (date) - Registration date
- `total_orders` (number) - Lifetime order count
- `total_spent` (number) - Lifetime value
- `last_order_date` (date)
- `average_order_value` (number)

**Subscription Data:**
- `subscription_status` (text) - active, paused, past_due, cancelled
- `subscription_frequency` (text) - weekly, bi-weekly, monthly, etc.
- `subscription_amount` (number) - Monthly/recurring amount
- `next_billing_date` (date)
- `subscription_start_date` (date)
- `failed_payment_count` (number)

**Dog Information (for personalization):**
- `dog_name` (text)
- `dog_breed` (text)
- `dog_age` (number)
- `dog_weight` (number)
- `health_conditions` (text) - Allergies, sensitivities, etc.

**Engagement Data:**
- `preferred_communication` (dropdown) - email, sms, phone
- `blog_subscriber` (boolean)
- `consultation_customer` (boolean)
- `referral_source` (text)

---

## Tags to Create

### Customer Lifecycle Tags
- `lead` - Not yet purchased
- `customer` - Made at least one purchase
- `subscriber` - Active subscription
- `past_due` - Payment failed
- `churned` - Cancelled subscription
- `vip` - High lifetime value ($500+)
- `consultation_client` - Purchased consultation

### Engagement Tags
- `newsletter_subscriber`
- `blog_reader`
- `case_study_viewer`
- `engaged` - Opens emails regularly
- `cold` - No engagement in 60+ days

### Product Interest Tags
- `fresh_food_buyer`
- `meal_topper_buyer`
- `supplement_buyer`
- `bulk_buyer` - Large quantities

### Behavioral Tags
- `cart_abandoner`
- `review_left`
- `referral_made`
- `payment_failed`
- `re_engaged` - Came back after churn

---

## Required Workflows

### 1. ABANDONED CART RECOVERY
**Trigger:** Webhook receives `cart.abandoned` event

**Workflow Steps:**
1. **Immediate (0 minutes):**
   - Add tag: `cart_abandoner`
   - Send EMAIL: "You left something behind! 🐾"
     - Subject: "Your dog's food is waiting for you"
     - Include: Cart items, images, prices
     - CTA: "Complete Your Order" button (link to cart)
     - Add urgency: "Items reserved for 24 hours"

2. **4 hours later:**
   - IF cart still not completed, send SMS (if phone number exists):
     - "Hi {first_name}, your {product_name} is still in your cart! Complete your order: {cart_link}"

3. **24 hours later:**
   - IF cart still not completed, send EMAIL: "Last chance + Special offer"
     - Subject: "We saved your cart + 10% OFF inside"
     - Include: 10% discount code (expires in 48 hours)
     - Highlight: Benefits of the products
     - Social proof: Customer testimonials

4. **3 days later:**
   - IF cart still not completed, send EMAIL: "Final reminder"
     - Subject: "Your 10% discount expires today"
     - Last chance messaging
     - Countdown timer

**Exit Conditions:**
- Cart completed (order.created webhook received)
- Cart expired (7 days)
- Customer starts new cart

---

### 2. NEW CUSTOMER WELCOME SERIES
**Trigger:** Webhook receives `order.created` event AND contact has tag `lead` (first purchase)

**Workflow Steps:**
1. **Immediate (order confirmation already sent by website):**
   - Change tag from `lead` to `customer`
   - Update custom fields: `total_orders`, `last_order_date`, `total_spent`

2. **Day 1 after delivery:**
   - Send EMAIL: "Welcome to the pack! 🐾"
     - Subject: "Welcome to Waggin' Meals, {first_name}!"
     - Introduce Christie & her credentials
     - Explain what makes WM different (science-backed, board-certified, fresh ingredients)
     - Link to blog & resources
     - Invite to join private Facebook group (if exists)

3. **Day 3 after delivery:**
   - Send EMAIL: "How's {dog_name} enjoying the food?"
     - Subject: "{dog_name}'s nutrition journey starts here"
     - Tips for transitioning to new food
     - Link to "feeding calculator" tool
     - Link to blog post: "What to expect when switching dog food"

4. **Day 7 after delivery:**
   - Send EMAIL: "Share your experience & get rewarded"
     - Subject: "Help other dog parents + earn rewards"
     - Request review (Google, Facebook, website)
     - Offer: $10 credit for review
     - Share on social media CTA

5. **Day 14 after delivery:**
   - Send EMAIL: "Did you know?" (Educational)
     - Subject: "The science behind {dog_name}'s new diet"
     - Educational content about ingredients
     - Link to case studies
     - Soft pitch for subscription if not already subscribed

6. **Day 21 (if no subscription yet):**
   - Send EMAIL: "Never run out of {product_name}"
     - Subject: "Save 15% + never forget to reorder"
     - Pitch subscription benefits
     - Show subscription options & frequencies
     - Highlight: Free shipping, flexibility, savings

**Exit Conditions:**
- Customer subscribes (move to subscription workflow)
- Customer makes second purchase (move to repeat customer workflow)

---

### 3. SUBSCRIPTION WELCOME & MANAGEMENT
**Trigger:** Webhook receives `subscription.created` event

**Workflow Steps:**
1. **Immediate:**
   - Add tag: `subscriber`
   - Remove tags: `lead`, `churned`
   - Update custom fields: `subscription_status`, `subscription_frequency`, `subscription_amount`, `next_billing_date`

2. **Same day:**
   - Send EMAIL: "Your subscription is active! 🎉"
     - Subject: "You're all set! Your first delivery ships soon"
     - Confirm subscription details (frequency, amount, next billing date)
     - Explain how to manage subscription (pause, skip, update)
     - Link to account portal
     - Show expected delivery calendar

3. **Day 7:**
   - Send EMAIL: "How's the subscription working for you?"
     - Check-in email
     - Tips for managing subscription
     - Reminder: Easy to pause/adjust anytime

4. **3 days before billing:**
   - Send EMAIL/SMS: "Upcoming billing reminder"
     - Subject: "Your next Waggin' Meals delivery ships in 3 days"
     - Confirm: "Your card ending in {last_4} will be charged ${amount} on {date}"
     - CTA: "Skip this delivery" | "Update subscription"

5. **Day of successful billing:**
   - Website sends `subscription.payment.success` webhook
   - GHL receives and sends EMAIL: "Payment received - Your order is being prepared"
     - Subject: "Payment successful! Your order is on the way"
     - Receipt details
     - Link to track order when shipped

---

### 4. FAILED PAYMENT RECOVERY
**Trigger:** Webhook receives `subscription.payment.failed` event

**Workflow Steps:**
1. **Immediate (same day as failure):**
   - Add tag: `payment_failed`
   - Change tag from `subscriber` to `past_due`
   - Increment `failed_payment_count`
   - Send EMAIL: "Action needed: Update your payment method"
     - Subject: "⚠️ Payment issue with your subscription"
     - Friendly, not accusatory tone
     - Clear explanation: "We tried to charge your card but it didn't go through"
     - CTA: "Update Payment Method" (link to account portal)
     - Assurance: "We'll retry in 3 days"

2. **Same day - 2 hours later:**
   - Send SMS (if phone exists):
     - "Hi {first_name}, we couldn't process your payment for Waggin' Meals. Update your card here: {link} - Christie"

3. **Day 3 (first retry):**
   - Website automatically retries payment
   - IF STILL FAILS, send EMAIL: "Second attempt failed"
     - Subject: "We tried again but still can't process payment"
     - More urgent tone
     - CTA: "Update Payment Now"
     - Show what they'll miss if subscription cancels

4. **Day 10 (second retry):**
   - Website automatically retries payment
   - IF STILL FAILS, send EMAIL: "Final attempt - Subscription at risk"
     - Subject: "Final notice: Update payment to keep your subscription"
     - Very urgent tone
     - Highlight: Benefits they'll lose
     - Offer: Call/chat if they need help

5. **Day 24 (final retry):**
   - Website automatically retries payment
   - IF STILL FAILS, website cancels subscription
   - Webhook sends `subscription.cancelled` event
   - Send EMAIL: "Subscription cancelled - We miss you already"
     - Subject: "We had to cancel your subscription 💔"
     - Empathetic tone
     - Easy reactivation link
     - Offer: Help if it was a mistake

**Exit Conditions:**
- Payment succeeds (move to subscription active workflow)
- Customer updates payment method manually
- Subscription cancelled after max retries

---

### 5. SUBSCRIPTION REACTIVATION (WIN-BACK)
**Trigger:** Contact has tag `churned` for 7+ days

**Workflow Steps:**
1. **Day 7 after cancellation:**
   - Send EMAIL: "We miss {dog_name}!"
     - Subject: "Come back? We saved your subscription details"
     - Emotional appeal
     - Ask: "Why did you cancel?" (link to survey)
     - Offer: 20% off first order back
     - One-click reactivation link

2. **Day 14:**
   - Send SMS:
     - "Hi {first_name}, {dog_name} deserves the best! Reactivate your subscription and get 20% off: {link}"

3. **Day 30:**
   - Send EMAIL: "Final offer: 30% off to come back"
     - Subject: "One last offer before we say goodbye"
     - Biggest discount
     - Share customer success stories
     - Testimonials from similar dogs

4. **Day 60:**
   - Add tag: `cold` (stop active win-back, move to quarterly newsletter only)

**Exit Conditions:**
- Subscription reactivated
- New purchase made
- 60 days pass with no re-engagement

---

### 6. REVIEW REQUEST & REPUTATION MANAGEMENT
**Trigger:** Webhook receives `order.delivered` event

**Workflow Steps:**
1. **Day 3 after delivery:**
   - Send EMAIL: "How's everything going?"
     - Subject: "Quick question about your recent order"
     - Friendly check-in
     - Ask: "How would you rate your experience?" (1-5 stars inline)
     - Branch based on rating:

**IF 5 stars selected:**
2a. **Immediately:**
   - Add tag: `review_left`
   - Send EMAIL: "Would you mind sharing that love?"
     - Subject: "We're so glad you're happy! Share on Google?"
     - Thank them
     - Request Google review: "Help other dog parents find us"
     - Request Facebook review
     - Offer incentive: $10 credit for review
     - Easy one-click review links

**IF 1-3 stars selected:**
2b. **Immediately:**
   - Add tag: `needs_support`
   - Send to internal notification (Christie/support team)
   - Send EMAIL: "We want to make this right"
     - Subject: "Can we fix this for you?"
     - Apologize
     - Request phone call or chat
     - Offer refund/replacement
     - Personal attention from Christie

**IF 4 stars selected:**
2c. **Day 7:**
   - Send EMAIL: "What can we improve?"
     - Ask for feedback
     - Show you care about improvement

---

### 7. REPEAT PURCHASE CAMPAIGN
**Trigger:** Contact has tag `customer` (not `subscriber`) AND `last_order_date` is 30+ days ago

**Workflow Steps:**
1. **30 days after last order:**
   - Send EMAIL: "Time to restock?"
     - Subject: "{dog_name} might be running low on {product_name}"
     - Show previous order
     - CTA: "Reorder with 1-click"
     - Upsell: "Or save 15% with a subscription"

2. **37 days after last order:**
   - Send SMS:
     - "Hi {first_name}, running low on dog food? Reorder your {product_name}: {link}"

3. **45 days after last order:**
   - Send EMAIL: "Special offer just for you"
     - Subject: "We miss you! Here's 15% off your next order"
     - Discount code
     - Showcase new products
     - Remind of benefits

**Exit Conditions:**
- New order placed
- Subscription started
- 60 days pass (move to cold list)

---

### 8. VIP CUSTOMER NURTURE
**Trigger:** Contact has `total_spent` >= $500 OR has tag `consultation_client`

**Workflow Steps:**
1. **When VIP status achieved:**
   - Add tag: `vip`
   - Send EMAIL: "Welcome to our VIP family"
     - Subject: "You're officially part of our inner circle"
     - Thank them for loyalty
     - Introduce VIP benefits: Early access, exclusive discounts, direct line to Christie
     - Invite to private VIP Facebook group

2. **Monthly (ongoing):**
   - Send EMAIL: "VIP exclusive: {special_offer/content}"
     - Exclusive content
     - First access to new products
     - Special discounts
     - Christie's personal tips

3. **Birthday (if known):**
   - Send EMAIL: "Happy birthday, {dog_name}!"
     - Fun, celebratory email
     - Gift: $25 credit
     - Dog birthday care tips

---

### 9. CONSULTATION FUNNEL
**Trigger:** Contact visits consultation page OR downloads nutrition guide

**Workflow Steps:**
1. **Immediate:**
   - Add tag: `consultation_interest`
   - Send EMAIL: "Is {dog_name} dealing with health issues?"
     - Subject: "Custom nutrition plans for dogs with special needs"
     - Explain consultation process
     - Christie's credentials & case studies
     - Testimonials from consultation clients
     - CTA: "Book your consultation"

2. **Day 3:**
   - Send EMAIL: "See how Christie helped {dog_name_from_case_study}"
     - Share detailed case study
     - Before/after results
     - Client testimonial
     - Limited spots available (urgency)

3. **Day 7:**
   - Send EMAIL: "Questions about consultations?"
     - FAQ format
     - Address common objections
     - Payment plans if available
     - CTA: "Schedule a free 15-min discovery call"

4. **Day 14:**
   - Send SMS:
     - "Hi {first_name}, still interested in a nutrition consultation for {dog_name}? Christie has limited spots this month: {booking_link}"

**Exit Conditions:**
- Consultation booked
- 30 days pass with no booking

---

### 10. EDUCATIONAL NURTURE (NEWSLETTER)
**Trigger:** Contact has tag `newsletter_subscriber`

**Workflow Steps:**
1. **Weekly (every Thursday 9am):**
   - Send EMAIL: "This Week in Dog Nutrition"
     - Subject: Varies based on content
     - Blog post summary + link
     - Nutrition tip of the week
     - Featured product
     - Case study or testimonial
     - CTA: Shop or read more

2. **Monthly (first Monday):**
   - Send EMAIL: "Christie's Monthly Nutrition Guide"
     - Deep-dive article on specific topic
     - Seasonal nutrition tips
     - New product announcements
     - Exclusive discount for subscribers

---

### 11. POST-PURCHASE CROSS-SELL
**Trigger:** Webhook receives `order.created` event

**Workflow Steps:**
1. **Day 5 after order:**
   - Analyze what they bought
   - Send EMAIL with personalized recommendations:

**IF bought fresh food:**
- Subject: "Boost {dog_name}'s meals with these add-ons"
- Recommend: Meal toppers, supplements
- Explain benefits

**IF bought meal toppers:**
- Subject: "Complete {dog_name}'s diet with fresh food"
- Recommend: Fresh food subscription
- Show meal examples

**IF bought supplements:**
- Subject: "Maximize {dog_name}'s health with these combos"
- Recommend: Related supplements or fresh food
- Stack benefits

---

### 12. SEASONAL CAMPAIGNS

#### Holiday Campaign (November-December)
**Trigger:** Manual start date OR date-based automation

**Workflow:**
1. **Black Friday/Cyber Monday:**
   - Email: "Biggest sale of the year"
   - 30% off sitewide
   - Bundle deals

2. **December:**
   - Email: "Holiday gift guide for dogs"
   - Gift bundles
   - Gift cards

#### New Year Campaign (January)
**Trigger:** January 1st

**Workflow:**
1. **January 2:**
   - Email: "New year, healthier pup"
   - Fresh start messaging
   - Nutrition reset program
   - Special pricing on subscriptions

#### Summer Campaign (June-August)
**Trigger:** June 1st

**Workflow:**
1. **Early June:**
   - Email: "Keep {dog_name} healthy this summer"
   - Summer nutrition tips
   - Hydration focus
   - Special summer recipes

---

## COMMUNICATION FEATURES TO CONFIGURE

### 1. MISSED CALL TEXT BACK
**Setup:**
- Phone number: Christie's business line (you'll provide)
- Auto-response SMS when call is missed:
  - "Hi! This is Christie from Waggin' Meals. I missed your call but I'll get back to you soon! 🐾 What can I help you with? Reply here or book a time to chat: [calendar_link]"
- Create conversation in GHL
- Notify Christie via email/app
- Follow-up workflow if no response in 24 hours

### 2. WEBSITE CHAT WIDGET
**Configuration:**
- Embed on all pages
- Greeting message: "Hi! 👋 Questions about nutrition for your pup? I'm here to help!"
- Business hours: [Your hours]
- After-hours message: "We're currently offline, but leave your question and we'll respond within 24 hours!"
- Route to: Christie or support team
- Auto-collect: Name, email, dog's name, question
- Integration: Create contact in GHL + add tag `chat_inquiry`

**Chat Bot Flow (optional):**
1. "What can I help you with today?"
   - Subscription questions → FAQ + link to account portal
   - Product questions → Show product catalog
   - Nutrition consultation → Book consultation
   - Order issue → Collect order # and create support ticket
   - Talk to human → Route to Christie/team

### 3. VOICE BOT (AI PHONE AGENT)
**Phone Number:** [Your business number]

**Voice Bot Script:**
"Hi! Thanks for calling Waggin' Meals. This is our AI assistant. I can help you with orders, subscriptions, and general questions. For nutrition consultations, I'll connect you with Christie.

What can I help you with today?"

**Options:**
1. "Check order status" → Ask for order number → Look up in system → Provide status
2. "Subscription management" → "Pause, cancel, or update?" → Collect info → Confirm action
3. "Product questions" → Answer common questions → Offer to email more info
4. "Book consultation" → Collect info → Send booking link via SMS
5. "Talk to a person" → Transfer to Christie or leave voicemail
6. "Other" → Collect message → Create task for follow-up

**Voicemail Handling:**
- If no answer or after-hours
- "You've reached Waggin' Meals. Please leave your name, number, and how we can help {dog_name}. We'll call you back within 24 hours!"
- Transcribe voicemail
- Send transcription to Christie via email/SMS
- Create task in GHL
- Auto-send SMS: "Thanks for your voicemail! We'll call you back soon."

---

## REPUTATION & REVIEW MANAGEMENT

### Review Request Sequence
(Already covered in Workflow #6 above)

### Review Monitoring
**Setup:**
- Connect Google My Business
- Connect Facebook page
- Auto-import reviews to GHL
- Alert Christie to negative reviews immediately

### Negative Review Response
**Trigger:** New review with rating 1-3 stars

**Workflow:**
1. **Immediate:**
   - Send internal alert to Christie
   - Create task: "Respond to negative review"
   - Suggested response template:
     - "Hi {customer_name}, I'm so sorry to hear about your experience. This isn't the standard we hold ourselves to. I'd love to make this right. Can you email me directly at christie@wagginmeals.com or call [phone]? - Christie"

2. **24 hours later (if not responded):**
   - Reminder to Christie
   - Escalate if needed

### Positive Review Response
**Trigger:** New review with rating 4-5 stars

**Workflow:**
1. **Auto-respond (immediate):**
   - "Thank you so much for your kind words! We're thrilled {dog_name} is loving the food. If you ever need nutrition advice, I'm just an email away! 🐾 - Christie"

2. **Follow-up:**
   - Send thank you email
   - Offer: $10 credit for next order
   - Request: Share on social media

---

## AUTOMATION PIPELINES

### Pipeline 1: LEAD TO CUSTOMER
**Stages:**
1. New Lead (website visitor, form fill)
2. Engaged (opened email, clicked link)
3. Cart Added (added to cart but didn't buy)
4. Cart Abandoned (left cart for 1+ hours)
5. Converted (first purchase made)

**Automation:**
- Auto-move between stages based on behavior
- Trigger different workflows at each stage

### Pipeline 2: CUSTOMER TO SUBSCRIBER
**Stages:**
1. One-Time Customer (made 1 purchase, no subscription)
2. Repeat Customer (2-3 purchases, no subscription)
3. Subscription Offered (in subscription pitch workflow)
4. Subscription Started (active subscriber)

**Automation:**
- Track conversion rate
- A/B test subscription pitch emails

### Pipeline 3: SUBSCRIPTION LIFECYCLE
**Stages:**
1. Active (paying, no issues)
2. At Risk (engagement dropping, skipping deliveries)
3. Past Due (payment failed)
4. Churned (cancelled)
5. Win-Back (in reactivation campaign)
6. Reactivated (came back)

**Automation:**
- Move based on subscription status webhooks
- Trigger retention workflows

### Pipeline 4: CONSULTATION FUNNEL
**Stages:**
1. Interested (visited page, downloaded guide)
2. Engaged (opened emails, clicked links)
3. Discovery Call Booked
4. Consultation Booked
5. Consultation Completed
6. Converted to Products

**Automation:**
- Track consultation booking rate
- Follow-up sequences

---

## FORMS TO CREATE

### 1. Newsletter Signup Form
**Fields:**
- Email (required)
- First Name (required)
- Dog's Name (optional)
- Interests (checkboxes): Fresh Food, Meal Toppers, Supplements, Nutrition Tips

**After Submit:**
- Add tag: `newsletter_subscriber`
- Send welcome email
- Add to weekly newsletter workflow

### 2. Nutrition Guide Download
**Fields:**
- Email (required)
- First Name (required)
- Dog's Name (required)
- Primary Health Concern (dropdown)

**After Submit:**
- Send PDF via email
- Add tag: `consultation_interest`
- Start consultation nurture workflow

### 3. Consultation Booking Form
**Fields:**
- Full Name (required)
- Email (required)
- Phone (required)
- Dog's Name (required)
- Dog's Age (required)
- Dog's Weight (required)
- Health Issues (text area, required)
- Preferred Consultation Time (calendar picker)

**After Submit:**
- Send booking confirmation
- Add tag: `consultation_booked`
- Create calendar event
- Send reminder emails (7 days, 3 days, 1 day before)

### 4. Product Recommendation Quiz
**Fields:**
- Dog's Name
- Dog's Size (Small, Medium, Large, Giant)
- Activity Level (Low, Moderate, High)
- Health Concerns (checkboxes)
- Current Diet (text)

**After Submit:**
- Show personalized product recommendations
- Send email with recommendations + discount
- Add appropriate tags based on answers

---

## INTERNAL NOTIFICATIONS

### Notification Rules
**Send to Christie when:**
1. High-value order ($200+)
2. Consultation booked
3. Negative review received
4. Payment failed 3 times (subscription at risk)
5. Customer requests cancellation
6. VIP customer makes purchase
7. Chat inquiry during business hours
8. Voicemail received
9. Email bounces or spam complaints

**Notification Methods:**
- GHL mobile app push notification
- SMS to Christie's phone
- Email alert

---

## REPORTING & ANALYTICS

### Dashboard Widgets to Include
1. **Revenue Metrics:**
   - Total revenue (this month)
   - Active subscriptions count
   - Average order value
   - Subscription MRR (Monthly Recurring Revenue)

2. **Customer Metrics:**
   - New customers (this month)
   - Customer lifetime value
   - Churn rate
   - Win-back conversions

3. **Marketing Metrics:**
   - Email open rates
   - Click-through rates
   - Abandoned cart recovery rate
   - Conversion rate by source

4. **Engagement Metrics:**
   - Active vs. cold contacts
   - Review count & average rating
   - Consultation bookings

5. **Workflow Performance:**
   - Abandoned cart emails sent & recovered
   - Failed payment recovery rate
   - Win-back campaign success rate

---

## A/B TESTING RECOMMENDATIONS

### Tests to Run
1. **Abandoned Cart Subject Lines:**
   - A: "You left something behind!"
   - B: "{dog_name}'s food is waiting"
   - C: "Complete your order & save"

2. **Subscription Pitch Timing:**
   - A: Day 14 after first purchase
   - B: Day 21 after first purchase
   - C: Day 7 after second purchase

3. **Review Request Timing:**
   - A: Day 3 after delivery
   - B: Day 7 after delivery

4. **Discount Offers:**
   - A: 10% off
   - B: 15% off
   - C: Free shipping

---

## CALENDAR & BOOKING

### Calendars to Create
1. **Nutrition Consultation Calendar:**
   - 60-minute slots
   - Buffer: 15 minutes between appointments
   - Availability: [Christie's hours]
   - Meeting type: Zoom or phone
   - Price: $395
   - Payment: Collect before booking (integrate payment)
   - Confirmation & reminder emails

2. **Discovery Call Calendar (Free 15-min):**
   - 15-minute slots
   - Purpose: Qualify consultation prospects
   - Free (no payment)
   - Auto-confirm

3. **Customer Support Calls:**
   - 30-minute slots
   - For existing customers with issues
   - Free

---

## EMAIL DELIVERABILITY SETUP

### Domain Configuration
**Domain:** wagginmeals.com

**Required DNS Records:**
- SPF record (GHL)
- DKIM record (GHL)
- DMARC record
- Custom tracking domain: track.wagginmeals.com

### Email Sending
- Warm up email domain gradually (start with 50 emails/day, increase slowly)
- Monitor bounce rate, spam complaints
- Keep list clean (remove bounced emails)

---

## SMS COMPLIANCE

### Setup
- Purchase dedicated phone number for SMS
- Set up SMS opt-in double confirmation
- Include opt-out instructions in every SMS: "Reply STOP to unsubscribe"
- Track opt-ins and opt-outs
- Comply with TCPA regulations

### SMS Use Cases (in priority order)
1. Abandoned cart follow-up (4 hours after)
2. Shipping notifications
3. Failed payment alerts
4. Missed call text back
5. Reorder reminders
6. Flash sales/limited offers

---

## SOCIAL MEDIA INTEGRATION

### Facebook
- Connect Facebook page
- Auto-post new blog articles
- Track Facebook reviews
- Facebook Messenger integration (chat widget)

### Instagram
- Connect Instagram business account
- Auto-DM reply for comments/DMs
- Link in bio → GHL landing page

---

## TRAINING & RESOURCES NEEDED

### For Christie/Team
- GHL University courses: Workflows, Pipelines, Automation
- Best practices for e-commerce CRM
- How to read reports & optimize campaigns

### Documentation to Create
- Standard operating procedures (SOPs)
- Email template library
- Response templates for common questions
- Escalation procedures

---

## ADVANCED FEATURES (PHASE 2)

### After Initial Setup is Working
1. **AI Appointment Booking Bot:**
   - Voice AI that books appointments via phone
   - Collects info and schedules without human

2. **Predictive Reorder:**
   - Based on order history, predict when customer needs to reorder
   - Send proactive reminder before they run out

3. **Dynamic Segmentation:**
   - Auto-segment based on behavior
   - Personalized campaigns per segment

4. **Referral Program:**
   - Automated referral tracking
   - Reward referrer & referee
   - Track ROI

5. **Loyalty Program:**
   - Points for purchases, reviews, referrals
   - Redeem for discounts or free products
   - VIP tiers

---

## SUCCESS METRICS

### Goals to Track
1. **Abandoned Cart Recovery Rate:** Target 15-20%
2. **Subscription Conversion Rate:** Target 25% of customers become subscribers
3. **Failed Payment Recovery Rate:** Target 50% recovered before cancellation
4. **Win-Back Rate:** Target 10-15% of churned customers return
5. **Review Rate:** Target 20% of customers leave reviews
6. **Email Open Rate:** Target 25-35%
7. **Email Click Rate:** Target 3-5%
8. **Customer Lifetime Value:** Increase by 30% year over year
9. **Churn Rate:** Keep below 5% monthly
10. **Consultation Booking Rate:** Target 5% of website visitors

---

## IMPLEMENTATION TIMELINE

### Phase 1: Foundation (Week 1-2)
- Set up custom fields & tags
- Create main workflows (abandoned cart, welcome series, subscription)
- Configure chat widget & missed call text back
- Set up forms
- Import existing contacts

### Phase 2: Engagement (Week 3-4)
- Set up newsletter campaigns
- Create review request workflow
- Configure voice bot
- Set up pipelines
- Build dashboards

### Phase 3: Optimization (Week 5-6)
- A/B testing
- Analyze performance
- Refine workflows
- Train team
- Document SOPs

### Phase 4: Advanced (Week 7+)
- Referral program
- Loyalty program
- Advanced segmentation
- Predictive analytics

---

## INTEGRATION CHECKLIST

### Technical Setup
- [ ] Connect API (Location ID + API Key)
- [ ] Configure webhook URLs (website → GHL)
- [ ] Set up custom fields
- [ ] Create all tags
- [ ] Import existing customer database
- [ ] Set up domain DNS records (SPF, DKIM, DMARC)
- [ ] Configure email from address (noreply@wagginmeals.com)
- [ ] Purchase SMS number
- [ ] Set up phone number for voice bot
- [ ] Embed chat widget on website
- [ ] Connect Google My Business
- [ ] Connect Facebook page
- [ ] Set up calendars
- [ ] Configure payment gateway (for consultations)

### Content Creation
- [ ] Write email templates for all workflows
- [ ] Create SMS message templates
- [ ] Write chat bot scripts
- [ ] Write voice bot scripts
- [ ] Design email templates (HTML)
- [ ] Create landing pages for offers
- [ ] Write FAQ content
- [ ] Create product recommendation quiz questions

### Workflows
- [ ] Build abandoned cart workflow
- [ ] Build welcome series
- [ ] Build subscription workflows
- [ ] Build failed payment recovery
- [ ] Build win-back campaigns
- [ ] Build review request workflow
- [ ] Build repeat purchase campaigns
- [ ] Build VIP nurture
- [ ] Build consultation funnel
- [ ] Build newsletter automation
- [ ] Build seasonal campaigns

### Testing
- [ ] Test all workflows end-to-end
- [ ] Test webhook triggers
- [ ] Test email deliverability
- [ ] Test SMS sending
- [ ] Test chat widget
- [ ] Test voice bot
- [ ] Test calendar booking
- [ ] Test abandoned cart recovery
- [ ] Test review requests

---

## SNAPSHOT MUST-HAVES SUMMARY

When creating the GHL snapshot, ensure it includes:

✅ **12 Pre-Built Workflows** (all listed above)
✅ **4 Pipelines** (Lead to Customer, Customer to Subscriber, Subscription Lifecycle, Consultation)
✅ **All Custom Fields** (customer, subscription, dog info, engagement)
✅ **All Tags** (lifecycle, engagement, behavioral)
✅ **4 Forms** (newsletter, guide download, consultation booking, quiz)
✅ **Email Templates** (all transactional and marketing emails)
✅ **SMS Templates** (cart abandonment, reminders, missed call)
✅ **Chat Widget Configuration** (greeting, offline message, routing)
✅ **Voice Bot Script & Setup** (menu options, responses)
✅ **Missed Call Text Back** (auto-response)
✅ **3 Calendars** (consultation, discovery, support)
✅ **Review Management Setup** (monitoring, auto-responses)
✅ **Dashboard Widgets** (revenue, customer, marketing, engagement metrics)
✅ **Notification Rules** (internal alerts for Christie)
✅ **Landing Pages** (for offers, discounts, lead magnets)
✅ **Domain Configuration Guide** (DNS setup instructions)

---

## FINAL NOTES FOR AI ASSISTANT

**Tone & Brand Voice:**
- Friendly, warm, approachable
- Science-backed but not overly technical
- Dog-lover language (use dog names, emojis 🐾)
- Christie is the authority figure (board-certified nutritionist)
- Premium but accessible
- Educational focus
- Customer success oriented

**Key Differentiators to Highlight:**
1. Board-certified canine nutritionist (Christie's credentials)
2. Science-backed, not trend-based
3. Fresh, high-quality ingredients
4. Personalized nutrition (consultations)
5. Educational resources
6. Community focus

**Customer Pain Points to Address:**
- Dogs with health issues (allergies, sensitivities, chronic conditions)
- Confusion about dog nutrition
- Convenience (subscription model)
- Quality concerns (what's really in dog food?)
- Vet recommendations not working

**Call-to-Actions (CTAs):**
- "Shop Now"
- "Subscribe & Save"
- "Book a Consultation"
- "Complete Your Order"
- "Update Payment Method"
- "Reorder Now"
- "Leave a Review"
- "Share Your Story"

---

This snapshot should be a complete, turnkey solution for running Waggin' Meals e-commerce marketing automation through GoHighLevel. Every workflow, email, SMS, and automation should be pre-built, tested, and ready to activate.
