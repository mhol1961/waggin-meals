# Condition Pages - Quick Start Guide

## ⚡ 2-Minute Setup

### Step 1: Apply Migration (Copy & Paste)

1. **Open Supabase SQL Editor**:
   - Go to: https://supabase.com/dashboard/project/lpevubhnsicbbpzeqmmv/sql/new

2. **Copy the migration file**:
   ```bash
   cat supabase/migrations/20251105_create_seo_content_system.sql
   ```

3. **Paste into SQL Editor** and click "Run"

4. **Verify** - Run this query:
   ```sql
   SELECT COUNT(*) FROM condition_pages;
   ```
   Should return `0` (empty table, ready to use)

---

### Step 2: Test It Works

```bash
# Create sample page
node scripts/create-test-page.js
```

Should output:
```
✅ Test page created successfully!
📊 Page Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ID:            [UUID]
Condition:     Pancreatitis
Slug:          fresh-food-for-dogs-with-pancreatitis
Status:        published
SEO Score:     85/100
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 3: View Your Page

**Admin**: https://wagginmeals.com/admin/conditions

**Public**: https://wagginmeals.com/conditions/fresh-food-for-dogs-with-pancreatitis

---

## ✅ That's It!

You now have:
- ✅ 3 database tables created
- ✅ Sample page with 4 sections + 5 FAQs
- ✅ SEO score of 85/100
- ✅ Schema markup for Google
- ✅ Full admin interface working

---

## 🎯 Next: Create Your First Real Page

1. Go to: `/admin/conditions/new`
2. Choose condition: **"Allergies"**
3. Follow the 5-step wizard
4. Publish!

---

## 📚 Full Documentation

See `docs/CONDITION-PAGES-DEPLOYMENT-GUIDE.md` for complete testing checklist and troubleshooting.

---

**Build Status**: ✅ 175 pages compiled, 0 errors, ready to deploy!
