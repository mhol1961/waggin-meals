# Netlify Environment Variables

This document lists all environment variables that must be configured in your Netlify site settings for successful deployment.

## Required Environment Variables

### Site Configuration
```
NEXT_PUBLIC_SITE_URL=https://wagginmeals.com
```
**Required for build** - Used for metadata, Open Graph tags, and structured data.

### Supabase Database
```
NEXT_PUBLIC_SUPABASE_URL=https://lpevubhnsicbbpzeqmmv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```
**Required** - Database connection for blog posts, case studies, and admin panel.

### Email Configuration
```
RESEND_API_KEY=re_xxx
```
**Required** - Resend API key for sending emails via contact forms.

#### Legacy SMTP Configuration (Optional - if using SMTP instead of Resend)
```
SMTP_USER=wagginmeals@gmail.com
SMTP_PASS=<your-smtp-password>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```
**Optional** - Only needed if using SMTP email service instead of Resend.

### GoHighLevel CRM Integration
```
GHL_ENABLED=true
GHL_API_KEY=<your-ghl-api-key>
GHL_LOCATION_ID=<your-location-id>
```
**Optional** - For CRM integration. Set `GHL_ENABLED=false` to disable.

### Admin Panel Authentication
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<your-secure-password>
SESSION_SECRET=<your-secure-random-string>
```
**Required** - For admin panel access. Use strong, unique values in production.

### Analytics (Optional)
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
**Optional** - Google Analytics 4 tracking ID.

## How to Set Environment Variables on Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site Settings** → **Environment Variables**
3. Add each variable with its corresponding value
4. Click **Save**
5. Trigger a new deployment for changes to take effect

## Security Notes

- Never commit `.env.local` to Git (it's already in .gitignore)
- Use strong passwords for ADMIN_PASSWORD
- Rotate SESSION_SECRET regularly
- Keep SUPABASE_SERVICE_ROLE_KEY secret (never expose to client)
- SMTP credentials should use app-specific passwords, not your main email password

## Build Requirements

The following variables **MUST** be set for the build to succeed:
- `NEXT_PUBLIC_SITE_URL` (build will fail without this)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The following variables are needed for runtime functionality:
- `RESEND_API_KEY` - Contact forms will fail without this (but build will succeed)
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` - Admin panel won't be accessible
- `GHL_API_KEY` / `GHL_LOCATION_ID` - CRM integration won't work (if enabled)
