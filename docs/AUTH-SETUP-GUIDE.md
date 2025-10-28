# Authentication Setup Guide

**Quick Start Guide for Setting Up Authentication**

---

## Step 1: Run Database Migration ⚠️ REQUIRED

Open Supabase SQL Editor and run the migration:

**File:** `supabase/migrations/20250129_create_auth_tables.sql`

This creates:
- `user_roles` table (stores customer/admin roles)
- `user_profiles` table (stores extended user info)
- Automatic triggers to create profile + assign role on signup
- RLS policies for security
- Helper functions

```sql
-- Copy and paste the entire contents of:
-- supabase/migrations/20250129_create_auth_tables.sql
-- into Supabase SQL Editor and run it
```

---

## Step 2: Create Your First Admin User

### Option A: Sign Up First, Then Promote to Admin (RECOMMENDED)

1. **Sign up as a normal user:**
   - Visit `http://localhost:3000/auth/signup`
   - Create your account with email/password
   - You'll be automatically assigned 'customer' role

2. **Get your User ID:**
   - In Supabase Dashboard → Authentication → Users
   - Find your user and copy the `id` (UUID)
   - Example: `550e8400-e29b-41d4-a716-446655440000`

3. **Promote to admin in Supabase SQL Editor:**
   ```sql
   -- Replace 'YOUR-USER-ID-HERE' with your actual user ID
   UPDATE user_roles
   SET role = 'admin'
   WHERE user_id = 'YOUR-USER-ID-HERE';

   -- Verify it worked:
   SELECT * FROM user_roles WHERE role = 'admin';
   ```

4. **Refresh your browser** - You should now see admin access!

### Option B: Manual SQL Creation (Advanced)

If you want to create an admin user directly via SQL:

```sql
-- 1. Get a user ID from an existing signup, or create via Supabase Dashboard
-- 2. Update their role:
UPDATE user_roles SET role = 'admin' WHERE user_id = 'user-id-here';
```

---

## Step 3: Verify Admin Access

1. **Login** at `/auth/login` with your admin account
2. **Visit** `/admin` - you should now have access!
3. **Check Account Dashboard** at `/account` - you'll see an "Admin Dashboard" card

---

## Step 4: Configure Supabase Email Settings (Optional)

For password reset emails to work:

1. **Supabase Dashboard** → Authentication → Email Templates
2. **Configure "Reset Password" template** (or use default)
3. **Set Site URL** in Authentication → URL Configuration:
   - Site URL: `http://localhost:3000` (development)
   - Site URL: `https://yourdomain.com` (production)
4. **Add Redirect URLs:**
   - Add: `http://localhost:3000/auth/reset-password`
   - Add: `https://yourdomain.com/auth/reset-password` (production)

---

## Quick Reference: Admin Role Management

### Check Who is Admin

```sql
SELECT
  ur.user_id,
  ur.role,
  u.email,
  ur.created_at
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE ur.role = 'admin';
```

### Make User an Admin

```sql
UPDATE user_roles
SET role = 'admin'
WHERE user_id = 'user-id-here';
```

### Remove Admin Access (Make Customer)

```sql
UPDATE user_roles
SET role = 'customer'
WHERE user_id = 'user-id-here';
```

### Find User ID by Email

```sql
SELECT id, email FROM auth.users WHERE email = 'user@example.com';
```

---

## Testing Your Setup

### Test Regular User Flow:
1. ✅ Sign up at `/auth/signup`
2. ✅ Login at `/auth/login`
3. ✅ Access `/account` (should work)
4. ✅ Try `/admin` (should redirect to home)
5. ✅ Logout

### Test Admin User Flow:
1. ✅ Promote user to admin (see above)
2. ✅ Login at `/auth/login`
3. ✅ Access `/account` (should work + see admin card)
4. ✅ Access `/admin` (should work!)
5. ✅ Try admin routes like `/admin/products`

### Test Password Reset:
1. ✅ Visit `/auth/forgot-password`
2. ✅ Enter email
3. ✅ Check email for reset link
4. ✅ Click link → goes to `/auth/reset-password`
5. ✅ Set new password

---

## Common Issues

### "Can't access /admin even after making user admin"
**Solution:**
1. Verify role in database: `SELECT * FROM user_roles WHERE user_id = 'your-id';`
2. Clear browser cookies and login again
3. Check Supabase logs for auth errors

### "Password reset email not received"
**Solution:**
1. Check Supabase Dashboard → Authentication → Logs
2. Verify email templates are configured
3. Check spam folder
4. Verify Site URL and Redirect URLs are set correctly

### "User profile not created on signup"
**Solution:**
1. Check if trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
2. Verify trigger function exists: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`
3. Re-run migration if needed

---

## Environment Variables

Ensure these are set in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Future: Admin UI for User Management

**Coming Soon:** Admin panel for managing user roles without SQL

For now, use SQL commands above to manage admin roles. A UI will be added in future updates to:
- View all users
- Promote/demote admins
- View user activity
- Manage user profiles

---

## Need Help?

- **Documentation:** See `docs/AUTHENTICATION-SYSTEM.md` for full technical details
- **Supabase Docs:** https://supabase.com/docs/guides/auth
- **Next.js Middleware:** https://nextjs.org/docs/app/building-your-application/routing/middleware

---

## Summary Checklist

- [ ] Run database migration in Supabase SQL Editor
- [ ] Sign up for an account at `/auth/signup`
- [ ] Get your user ID from Supabase Dashboard
- [ ] Promote yourself to admin via SQL
- [ ] Verify admin access at `/admin`
- [ ] Configure email settings (optional)
- [ ] Test password reset flow (optional)

**That's it! Your authentication system is ready to use.**
