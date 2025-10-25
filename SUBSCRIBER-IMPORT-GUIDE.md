# Subscriber Import & Migration Guide

## 🎯 Overview
This guide walks you through importing your 100 existing subscribers into GoHighLevel and launching the re-authorization campaign.

---

## Step 1: Prepare Your Subscriber Data

### What You Need:
Use the `SUBSCRIBER-IMPORT-TEMPLATE.csv` as your guide. You need:

**Required Fields:**
- ✅ **Email** - Must be unique and valid
- ✅ **First Name** - For personalization
- ✅ **Last Name** - Full name
- ✅ **Subscription Frequency** - "Weekly", "Bi-Weekly", or "Monthly"
- ✅ **Subscription Products** - What they get (e.g., "Beef Bowl (2), Chicken Board (1)")
- ✅ **Subscription Price** - Monthly amount (e.g., 89.97)
- ✅ **Next Billing Date** - When they should be billed next (YYYY-MM-DD format)

**Optional But Recommended:**
- Phone - For SMS reminders
- Dog Name - For personalization in emails
- Dog Breed - For targeted marketing later
- Dog Age - "Puppy (0-1)", "Adult (1-7)", or "Senior (7+)"
- Notes - Any special instructions

**Critical Tags to Add:**
- `Active Subscriber` - Mark them as subscribers
- `Needs Re-Authorization` - This triggers the re-auth workflow

**Subscription Status:**
- Set all to: `Pending Payment` (until they update payment)

### Example Entry:
```csv
email: jane@example.com
first_name: Jane
last_name: Smith
phone: 555-123-4567
dog_name: Max
subscription_frequency: Monthly
subscription_products: Beef & Sweet Potato Bowl (2), Joint Support (1)
subscription_price: 89.97
next_billing_date: 2024-02-15
tags: Active Subscriber, Needs Re-Authorization
subscription_status: Pending Payment
```

---

## Step 2: Generate Secure Tokens

Before importing, I need to generate unique secure tokens for each subscriber. These tokens are used for the customer portal links.

**I'll create a tool for you:**
1. You give me your subscriber list (CSV or spreadsheet)
2. I run a script that generates a secure token for each email
3. You get back the CSV with a new column: `secure_portal_token`
4. You import that CSV into GHL

**Token Example:**
```
secure_portal_token: a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6
Portal URL: https://wagginmeals.com/account/a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6
```

---

## Step 3: Import into GoHighLevel

### Option A: CSV Import (Recommended for 100 subscribers)
1. Log into GoHighLevel
2. Go to **Contacts** → **Import**
3. Upload your CSV file
4. Map the columns:
   - Email → Email
   - First Name → First Name
   - Last Name → Last Name
   - Phone → Phone
   - Dog Name → Dog Name (custom field)
   - Subscription Frequency → Subscription Frequency (custom field)
   - Subscription Products → Subscription Products (custom field)
   - Subscription Price → Subscription Price (custom field)
   - Next Billing Date → Next Billing Date (custom field)
   - Subscription Status → Subscription Status (custom field)
   - Secure Portal Token → Secure Portal Token (custom field)
   - Tags → Tags
5. Review preview
6. Click **Import**
7. Wait for confirmation (should take 1-2 minutes for 100 contacts)

### Option B: Manual Entry (If you have < 10 subscribers)
1. Go to Contacts → Add Contact
2. Fill in all fields
3. Add custom fields manually
4. Add tags manually
5. Repeat for each subscriber

---

## Step 4: Verify Import

After import, check:
- ✅ All 100 contacts imported successfully
- ✅ Tags are applied correctly (`Active Subscriber`, `Needs Re-Authorization`)
- ✅ Custom fields populated (Subscription Frequency, Products, Price, etc.)
- ✅ Secure Portal Tokens are unique for each contact
- ✅ No duplicate emails

**Quick Test:**
1. Pick 3 random subscribers
2. Check their contact records
3. Verify all fields are correct
4. Copy their portal link and test (don't update payment yet)

---

## Step 5: Prepare Campaign Email

Before launching, customize the re-authorization email in GHL:

### Email Customization Checklist:
- [ ] Update "from" name (Christie or Waggin' Meals Team)
- [ ] Add your support phone number
- [ ] Set correct deadline date (14 days from launch)
- [ ] Test merge fields work: {First Name}, {Dog Name}, etc.
- [ ] Test portal link works: {Secure Portal Token}
- [ ] Add your logo/branding
- [ ] Preview on mobile and desktop
- [ ] Send test email to yourself

### Key Messaging Points:
1. **Subject Line:** Clear action required, not scary
   - ✅ "Quick Action Needed: Update Payment for Max's Subscription"
   - ❌ "URGENT: Your Account Will Be Cancelled"

2. **Opening:** Warm, friendly, explain why
   - "We've upgraded our system to serve you better..."

3. **What They Need to Do:** Crystal clear
   - Big button: "Update Payment Method (2 Minutes)"
   - Link directly to their secure portal

4. **Reassurance:** Security and ease
   - "Quick, secure, and PCI-compliant"
   - "Takes less than 2 minutes"
   - "Your subscription details stay the same"

5. **Support:** Make it easy to get help
   - Reply to this email
   - Call XXX-XXX-XXXX
   - Links to FAQ

---

## Step 6: Launch the Campaign

### Pre-Launch Checklist:
- [ ] GHL snapshot imported with all workflows
- [ ] All 100 subscribers imported and verified
- [ ] Secure portal tokens generated and working
- [ ] Customer portal is live and tested
- [ ] Payment processing tested with test cards
- [ ] Email templates finalized and tested
- [ ] Support ready for questions
- [ ] FAQ page published on website
- [ ] You've done a dry run with 1-2 test subscribers

### Launch Process:
1. **Pick a Good Day:** Tuesday or Wednesday morning (best open rates)
2. **Final Review:** Check one more time everything is ready
3. **Start Small:** Tag 10 subscribers first as test batch
4. **Monitor Closely:** Watch for 1-2 hours
   - Check if emails are sending
   - Watch for bounce backs
   - Monitor support requests
   - Check if portal links work
5. **If All Good:** Tag remaining 90 subscribers
6. **Monitor All Day:** Be available for questions

### What to Watch:
- **Email metrics** (in GHL):
  - Open rate (target: 40%+)
  - Click rate (target: 20%+)
  - Bounce rate (target: < 2%)

- **Portal activity** (in our system):
  - How many are clicking through?
  - How many are completing payment?
  - Any error patterns?

- **Support volume:**
  - What questions are coming in?
  - Any confusion points?
  - Any technical issues?

---

## Step 7: Monitor & Follow Up

### Daily Monitoring (Days 1-14):
Check these metrics every morning:

**Day 1:**
- Emails sent: 100
- Emails opened: ? (target 40+)
- Portal visits: ? (target 20+)
- Payments updated: ? (target 10+)

**Day 5 (Reminder sent):**
- Completion rate: ? (target 40%+)
- Support tickets: ?
- Any blockers identified?

**Day 10 (Urgent reminder):**
- Completion rate: ? (target 70%+)
- Who hasn't responded? (30 subscribers)
- Time for personal outreach?

**Day 14 (Final deadline):**
- Completion rate: ? (target 90%+)
- Who needs personal call? (10 subscribers)
- Prepare for Day 15 pauses

### Success Benchmarks:
- **Day 3:** 25% completion
- **Day 7:** 50% completion
- **Day 10:** 75% completion
- **Day 14:** 90%+ completion ← **Goal**

### If Behind Pace:
1. Check email deliverability (spam folder?)
2. Review support tickets for common issues
3. Personalize follow-up for non-responders
4. Consider extending deadline
5. Add phone call outreach for high-value subscribers

---

## Step 8: Handle Non-Responders

After Day 14, you'll have ~10 subscribers who haven't updated payment:

### Triage Process:
1. **High Value** ($100+/month):
   - Personal phone call
   - Offer to help them update over phone
   - Offer incentive (free shipping, discount)

2. **Active Engagers** (opened emails but didn't complete):
   - Personal email from you
   - Ask if they need help
   - Offer phone call

3. **Non-Engagers** (didn't open emails):
   - Try different email
   - Try SMS if you have phone
   - Check if email is still valid

4. **Decided to Cancel**:
   - Respect their decision
   - Ask for feedback
   - Leave door open for future

### Day 15 Actions:
- GHL automatically adds tag: `Subscription Paused`
- Status changes to: "Paused"
- They receive "Subscription Paused" email
- Portal link still works - they can reactivate anytime

---

## Step 9: First Billing Cycle (Critical!)

After re-authorization, the first automatic billing cycle is CRITICAL.

### Pre-Billing Checklist:
- [ ] Verify all payment tokens are stored correctly
- [ ] Test billing automation with 1 test subscriber
- [ ] Verify order creation works
- [ ] Verify email notifications work
- [ ] Check GHL webhook integration
- [ ] Have support ready for any issues

### The Day Before Billing:
1. Review which subscriptions bill tomorrow
2. Verify their payment profiles are active
3. Send courtesy reminder email (optional but nice):
   - "Heads up: Your subscription bills tomorrow"
   - "You'll receive {products} on {date}"
   - "Total: ${amount}"

### Billing Day (Cron runs at 2 AM):
1. Wake up early and check logs
2. Monitor successful charges
3. Watch for failed payments
4. Respond quickly to any failures
5. Verify orders created correctly
6. Check confirmation emails sent

### Success Metrics (First Cycle):
- Target: 95%+ successful billing
- If < 90%: Investigate issues immediately
- Common issues:
  - Expired cards
  - Insufficient funds
  - Changed card numbers
  - Bank declined

---

## Troubleshooting Common Issues

### Issue: Subscriber can't access portal
**Solutions:**
- Verify token in GHL matches database
- Check if link was copied correctly
- Try generating new token
- Check if token expired (90 days)

### Issue: Payment not processing
**Solutions:**
- Verify Authorize.net credentials are production (not sandbox)
- Check if card number entered correctly
- Try different card
- Check Authorize.net dashboard for error details

### Issue: GHL not updating after payment
**Solutions:**
- Check webhook URL is correct
- Verify webhook is active in workflow
- Check our server logs for webhook call
- Test webhook manually in GHL

### Issue: Low completion rate
**Solutions:**
- Check email deliverability (spam?)
- Review email subject line (too scary?)
- Simplify portal process
- Add video tutorial
- Personal outreach earlier

### Issue: High support volume
**Solutions:**
- Create FAQ with common questions
- Add live chat to portal
- Record video walkthrough
- Extend deadline to reduce pressure

---

## Post-Migration Checklist

After 30 days:

- [ ] 90%+ subscribers re-authorized
- [ ] First billing cycle completed successfully
- [ ] Orders created and shipped correctly
- [ ] GHL workflows functioning properly
- [ ] Failed payment process working
- [ ] Admin dashboard helpful for management
- [ ] Support volume back to normal
- [ ] Subscriber feedback collected
- [ ] System optimizations identified
- [ ] Document lessons learned

---

## Success = Recurring Revenue Secured! 🎉

Once complete, you'll have:
- ✅ 90+ active subscribers with secure payment tokens
- ✅ Automated recurring billing
- ✅ Email automation for all subscriber communication
- ✅ Failed payment handling
- ✅ Admin dashboard for easy management
- ✅ Scalable system for growth

**This is your revenue foundation for the business!**

---

## Questions? Need Help?

During migration, I'm here to help:
- Technical issues with portal
- Payment processing problems
- GHL integration issues
- Custom modifications
- Emergency support

Just reach out anytime! 🐾
