# Cron Job Setup for Netlify/GoDaddy Hosting

Since Netlify and GoDaddy don't have built-in cron job support like Vercel, you'll need to use an external service to trigger the recurring billing endpoint.

---

## Billing Endpoint Details

**URL**: `https://wagginmeals.com/api/cron/process-subscription-billing`
**Method**: POST
**Header**: `Authorization: Bearer {CRON_SECRET}`
**Schedule**: Daily at 2:00 AM (server time)

---

## Option 1: cron-job.org (Recommended - Free & Reliable)

### Setup Steps:

1. **Sign up** at https://cron-job.org (free account)

2. **Create New Cron Job**:
   - Title: "Waggin Meals Subscription Billing"
   - URL: `https://wagginmeals.com/api/cron/process-subscription-billing`
   - Schedule: `0 2 * * *` (every day at 2 AM)
   - Request Method: POST
   - Headers: Add `Authorization: Bearer {CRON_SECRET}`

3. **Add CRON_SECRET to Environment Variables**:
   ```bash
   # Netlify Dashboard → Site settings → Environment variables
   CRON_SECRET=your-random-secret-here-abc123xyz
   ```

4. **Test the Job**:
   - Click "Run Job" in cron-job.org dashboard
   - Check Netlify function logs for execution
   - Verify email sent if subscriptions processed

### Benefits:
- ✅ Free forever
- ✅ Reliable uptime (99.9%)
- ✅ Email notifications on failures
- ✅ Execution history and logs
- ✅ Easy to pause/resume

---

## Option 2: EasyCron (Free Tier Available)

### Setup Steps:

1. **Sign up** at https://www.easycron.com (free tier: 1 job)

2. **Create Cron Job**:
   - Cron Expression: `0 2 * * *`
   - URL to call: `https://wagginmeals.com/api/cron/process-subscription-billing`
   - Method: POST
   - Add HTTP Header: `Authorization: Bearer {CRON_SECRET}`

3. **Configure Notifications**:
   - Email on failure
   - Webhook on success (optional)

---

## Option 3: GitHub Actions (Free, Requires GitHub Repo)

### Setup Steps:

1. **Create Workflow File**: `.github/workflows/subscription-billing.yml`

```yaml
name: Subscription Billing Cron

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  process-billing:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Billing
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://wagginmeals.com/api/cron/process-subscription-billing
```

2. **Add Secret to GitHub**:
   - Go to repository → Settings → Secrets
   - Add `CRON_SECRET` with your secret value

3. **Test**:
   - Go to Actions tab
   - Click "Subscription Billing Cron"
   - Click "Run workflow"

### Benefits:
- ✅ Free
- ✅ Integrated with your code repo
- ✅ Can trigger manually
- ✅ View execution logs in GitHub

---

## Option 4: Traditional Server Cron (If You Have Server Access)

If hosting on GoDaddy with cPanel or server access:

### Setup Steps:

1. **Access cPanel** → Cron Jobs

2. **Add New Cron Job**:
   ```bash
   0 2 * * * curl -X POST -H "Authorization: Bearer YOUR_SECRET" https://wagginmeals.com/api/cron/process-subscription-billing
   ```

3. **Set CRON_SECRET** in environment variables

---

## Environment Variables Required

Add these to **Netlify Dashboard** → Site settings → Build & deploy → Environment variables:

```bash
# Existing (already configured)
AUTHORIZENET_API_LOGIN_ID=55hS9Bfqr
AUTHORIZENET_TRANSACTION_KEY=8we8Bq54v9GN9Tfk
AUTHORIZENET_PUBLIC_CLIENT_KEY=9N3S4AcmvnUVdB96UB4r8LPzFmAqn8dAY7wxTSaMcBaB82KF79qjAmqw849h8zM3
AUTHORIZENET_ENVIRONMENT=production

# Add these NEW ones:
CRON_SECRET=generate-random-secret-abc123xyz456  # ⚠️ IMPORTANT
RESEND_API_KEY=re_xxxxx  # Get from resend.com
```

---

## Generating CRON_SECRET

Use any of these methods:

### Method 1: Online Generator
Visit: https://randomkeygen.com/
Copy "Fort Knox Password" (256-bit WPA Key)

### Method 2: Command Line
```bash
openssl rand -base64 32
```

### Method 3: Node.js
```javascript
require('crypto').randomBytes(32).toString('base64')
```

**Example secret**: `K8mF9xP2vN7bQ3wR5tY8uE1zA6cD4gH9jL0sM2nB5vX7=`

---

## Testing the Setup

### Manual Test (After Setup):

1. **Trigger cron manually**:
   ```bash
   curl -X POST \
     -H "Authorization: Bearer YOUR_CRON_SECRET" \
     https://wagginmeals.com/api/cron/process-subscription-billing
   ```

2. **Expected Response**:
   ```json
   {
     "success": true,
     "results": {
       "total": 0,
       "successful": 0,
       "failed": 0,
       "errors": []
     }
   }
   ```

3. **Check Netlify Function Logs**:
   - Netlify Dashboard → Functions → View logs
   - Should see: `[Billing Cron] Starting subscription billing process...`

### Create Test Subscription for Testing:

1. Create a subscription with `next_billing_date = today`
2. Trigger cron manually
3. Verify:
   - Subscription charged
   - Invoice created
   - `next_billing_date` updated to next month
   - Email sent

---

## Monitoring & Alerts

### Recommended Monitoring:

1. **Failed Payment Alerts**:
   - Set up email notifications in cron service
   - Monitor Netlify function logs daily
   - Check Authorize.net declined transactions report

2. **Success Verification**:
   - Daily check of `subscription_invoices` table
   - Verify all `next_billing_date <= today` subscriptions processed
   - Check email delivery logs in Resend dashboard

3. **Database Query for Monitoring**:
   ```sql
   -- Check today's billing activity
   SELECT
     COUNT(*) as total_billed,
     SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as successful,
     SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
     SUM(amount) as total_revenue
   FROM subscription_invoices
   WHERE billing_date = CURRENT_DATE;
   ```

---

## Troubleshooting

### Cron not running:
- ✅ Verify cron service is active
- ✅ Check `CRON_SECRET` matches in both places
- ✅ Check URL is correct (include https://)
- ✅ Check Netlify function logs for errors

### Payments failing:
- ✅ Verify Authorize.net credentials are correct
- ✅ Check payment method has valid CIM profile IDs
- ✅ Test with small amount first ($1)
- ✅ Check Authorize.net transaction logs

### Emails not sending:
- ✅ Verify `RESEND_API_KEY` is set
- ✅ Check Resend dashboard for errors
- ✅ Verify `EMAIL_FROM` domain is verified in Resend

---

## Recommended Setup: cron-job.org

**Why**: Free, reliable, easy setup, email notifications

**Setup Time**: 5 minutes

**Steps**:
1. Sign up at cron-job.org
2. Create cron job (URL + headers + schedule)
3. Add `CRON_SECRET` to Netlify environment variables
4. Test with manual trigger
5. Enable email notifications

**Done!** Your subscriptions will automatically bill daily at 2 AM.

---

**Updated**: January 30, 2025
**Hosting**: Netlify/GoDaddy
**Cron Recommendation**: cron-job.org (free & reliable)
