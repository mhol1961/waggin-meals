# What You Need to Provide - Checklist

## 1. Authorize.net Credentials

Christie needs to provide these from her Authorize.net account:

- [ ] **API Login ID** (looks like: `5KP3u95bQpv`)
- [ ] **Transaction Key** (looks like: `346HZ32z3fP4hT`)
- [ ] **Environment**: Tell me if using `production` or `sandbox` (for testing)
- [ ] **Confirm CIM is enabled** (Customer Information Manager - needed for tokenization)

**Where to find these**:
1. Log in to Authorize.net
2. Go to Account → Settings → API Credentials & Keys
3. Generate new Transaction Key if needed

---

## 2. GoHighLevel Setup

### Step A: Generate GHL Snapshot (Use AI Assistant)

Give your AI assistant this file:
```
/mnt/c/waggin-meals/GHL-SNAPSHOT-SPECIFICATION.md
```

Tell the AI:
> "Please generate a complete GoHighLevel snapshot based on this specification. I need the snapshot file that I can import into my GHL account."

The AI should give you a snapshot file (JSON format) that you can import.

### Step B: Import Snapshot to GHL

1. Log in to GoHighLevel
2. Go to Settings → Import/Export
3. Click "Import Snapshot"
4. Upload the snapshot file
5. Wait for import to complete

### Step C: Get Webhook URLs (AFTER import)

After the snapshot is imported, you need to get 2 webhook URLs:

**Webhook 1: Payment Updated**
- [ ] Go to Workflows → Find "Subscription Payment Updated" workflow
- [ ] Click on the workflow trigger
- [ ] Copy the webhook URL
- [ ] It will look like: `https://services.leadconnectorhq.com/hooks/abc123xyz`

**Webhook 2: Payment Failed**
- [ ] Go to Workflows → Find "Subscription Payment Failed" workflow
- [ ] Click on the workflow trigger
- [ ] Copy the webhook URL
- [ ] It will look like: `https://services.leadconnectorhq.com/hooks/def456uvw`

Provide me both URLs.

---

## 3. Domain & Hosting

- [ ] **Domain**: wagginmeals.com (already have this?)
- [ ] **Verify domain is pointing to Vercel** (or we can set this up)
- [ ] **SSL Certificate**: Auto-handled by Vercel

---

## 4. Email Sending (Resend)

For order confirmations and shipping notifications:

- [ ] **Resend API Key** (if Christie has Resend account)
- [ ] **From Email**: `orders@wagginmeals.com` or `info@wagginmeals.com`

**OR** we can set up a new Resend account (free tier is fine for now):
- Go to resend.com
- Sign up
- Get API key
- Verify domain

---

## 5. Supabase (Already Set Up)

- [x] Supabase project created
- [ ] **Confirm Supabase URL and keys** (you should already have these in `.env.local`)
- [ ] Just verify they're correct

---

## 6. Optional: Logo & Branding Assets

If Christie wants to update any branding:
- [ ] Logo files (PNG, SVG)
- [ ] Brand colors
- [ ] Product images (high quality)

---

## Summary - What I Need From You

### Immediately:
Nothing! I can continue building.

### When You Get It:
1. **Authorize.net credentials** (3 items)
2. **GHL webhook URLs** (2 URLs - get after snapshot imported)
3. **Resend API key** (1 item)

### How to Provide:
Just paste them here in the chat when you get them, in this format:

```
AUTHORIZE.NET:
- API Login ID: abc123
- Transaction Key: xyz789
- Environment: production

GHL WEBHOOKS:
- Payment Updated: https://services.leadconnectorhq.com/hooks/abc123
- Payment Failed: https://services.leadconnectorhq.com/hooks/def456

RESEND:
- API Key: re_abc123xyz
- From Email: orders@wagginmeals.com
```

---

## What Happens Next

1. **You gather the above info** (can take a few days, no rush)
2. **I continue building** the remaining features
3. **When you provide the credentials**, I'll plug them into `.env.local`
4. **We test everything** in sandbox/staging
5. **We run the migration scripts** to import customers
6. **We go live!**

---

## Timeline Estimate

- **While you gather info**: I build remaining features (1-2 days)
- **You provide credentials**: 5 minutes to plug in
- **Testing**: 1-2 hours
- **Migration**: 1 hour to run scripts
- **Launch**: Ready to go!

**You can gather info at your pace - I'll keep building!**
