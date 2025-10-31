# 🚨 HOSTING PROVIDER - READ THIS FIRST 🚨

## CRITICAL INFORMATION - DO NOT IGNORE

### Hosting Provider

**CURRENT**: Netlify (for previews/staging)
**PRODUCTION**: GoDaddy (planned for live site)

### DO NOT SUGGEST:
- ❌ Vercel
- ❌ Vercel cron jobs
- ❌ vercel.json configuration
- ❌ Any Vercel-specific features

### CRON JOBS

**DO NOT USE**: Vercel cron jobs

**USE INSTEAD**: External cron service
- ✅ cron-job.org (recommended)
- ✅ EasyCron
- ✅ GitHub Actions
- ✅ Traditional server cron (if on GoDaddy with cPanel)

**DOCUMENTATION**: See `CRON-SETUP-NETLIFY.md`

### IF ASKED ABOUT HOSTING:

**CORRECT RESPONSE**:
"You're using Netlify for staging and GoDaddy for production. For cron jobs, use cron-job.org or similar external service."

**WRONG RESPONSE**:
"Deploy to Vercel" or "Use Vercel cron jobs"

---

## Summary

✅ Hosting: Netlify + GoDaddy
✅ Cron: External service (cron-job.org)
✅ Config file: netlify.toml (NOT vercel.json)

❌ DO NOT mention: Vercel
❌ DO NOT suggest: Vercel-specific features
❌ DO NOT create: vercel.json

**THIS IS FINAL. DO NOT SUGGEST VERCEL AGAIN.**

---

**Created**: January 30, 2025
**Last Updated**: January 30, 2025
**Hosting**: Netlify + GoDaddy (NOT Vercel)
