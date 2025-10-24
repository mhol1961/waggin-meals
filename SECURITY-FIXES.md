# Security Fixes Applied

## Critical Security Issues Addressed

### 1. ✅ FIXED: Middleware Protection for Admin Routes

**Issue**: No middleware protecting `/admin` or `/api/admin` routes
**Risk**: Unauthorized access to admin panel and APIs

**Fix**: Created `middleware.ts` that:
- Protects all `/admin/*` routes except `/admin/login`
- Protects all `/api/admin/*` routes except `/api/admin/login`
- Redirects unauthenticated users to login page
- Returns 401 for API requests without auth

**File**: `middleware.ts`

### 2. ✅ FIXED: Image Upload Authentication

**Issue**: `/api/admin/upload-image` had NO authentication check
**Risk**: Anyone could upload files to your Supabase storage

**Fix**: Added authentication check at the start of the handler
```typescript
const authenticated = await isAdminAuthenticated();
if (!authenticated) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**File**: `app/api/admin/upload-image/route.ts:16`

### 3. ✅ FIXED: SESSION_SECRET Required

**Issue**: Fallback to hardcoded `'default-secret-change-me'`
**Risk**: Predictable JWT signing key compromises all sessions

**Fix**: Now throws error if SESSION_SECRET is not set:
```typescript
if (!sessionSecret) {
  throw new Error('SESSION_SECRET is not configured...');
}
```

**Files**:
- `lib/admin-auth.ts:40` (createSessionToken)
- `lib/admin-auth.ts:64` (verifySessionToken)

### 4. ⚠️ DOCUMENTED: Plain Text Password Comparison

**Issue**: Passwords compared in plain text without hashing
**Risk**: If .env.local is compromised, passwords are exposed

**Current State**: Added warning comments but still uses plain text
**Production TODO**: Implement bcrypt password hashing

```typescript
// SECURITY WARNING: This is plain text comparison
// For production, use bcrypt.compare() with hashed passwords
return username === adminUsername && password === adminPassword;
```

**File**: `lib/admin-auth.ts:31`

**Recommended Production Fix**:
```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

Then update:
```typescript
import bcrypt from 'bcryptjs';

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminUsername || !adminPasswordHash) {
    return false;
  }

  if (username !== adminUsername) {
    return false;
  }

  return await bcrypt.compare(password, adminPasswordHash);
}
```

Generate hash:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

## Functional Fixes Applied

### 5. ✅ FIXED: Character Count in Rich Text Editor

**Issue**: Character count always showed 0
**Fix**:
- Installed `@tiptap/extension-character-count`
- Added CharacterCount to extensions array
- Fixed reference to `editor.storage.characterCount.characters()`

**Files**:
- `components/admin/rich-text-editor.tsx:7` (import)
- `components/admin/rich-text-editor.tsx:38` (extension)
- `components/admin/rich-text-editor.tsx:289` (display)

### 6. ✅ FIXED: Unpublish Functionality

**Issue**: Once published, no way to revert to draft
**Fix**: Added conditional button that shows "Unpublish" when content is published

**File**: `components/admin/blog-form.tsx:211`

Now shows:
- If published: "Unpublish" button
- If draft: "Save Draft" + "Publish" buttons

## Known Limitations (Not Blocking But Should Be Addressed)

### 7. ⚠️ View/Download Tracking Not Implemented

**Issue**: Columns exist but nothing increments them
**Affected**:
- `videos.view_count` - Never incremented
- `resources.download_count` - Never incremented

**Recommended Fix**: Add increment endpoints or use RLS functions:

```sql
-- Example: Increment view count
CREATE OR REPLACE FUNCTION increment_video_views(video_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE videos SET view_count = view_count + 1 WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 8. ⚠️ No Search/Filter on List Pages

**Issue**: All list pages lack search functionality
**Impact**: Hard to find content as it grows

**Recommended Fix**: Add search input to list pages:
```typescript
const [searchTerm, setSearchTerm] = useState('');
const filtered = posts.filter(p =>
  p.title.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### 9. ⚠️ Product Images = Textarea

**Issue**: Multiple images handled via newline-delimited URLs in textarea
**Impact**: Not user-friendly, no preview

**Recommended Fix**: Create multi-image upload component with:
- Drag-and-drop multiple files
- Preview grid with delete buttons
- Reorder capability

### 10. ⚠️ No Rate Limiting on Login

**Issue**: No brute-force protection on admin login
**Risk**: Attacker can try unlimited password combinations

**Recommended Fix**: Add rate limiting middleware or use Upstash Rate Limit:
```bash
npm install @upstash/ratelimit @upstash/redis
```

## Security Checklist for Production

- [x] Middleware protecting admin routes
- [x] Image upload authentication
- [x] SESSION_SECRET required (no fallback)
- [ ] **TODO**: Implement bcrypt password hashing
- [ ] **TODO**: Add rate limiting on login
- [ ] **TODO**: Set up CSP headers
- [ ] **TODO**: Enable HTTPS only in production
- [ ] **TODO**: Add audit logging for admin actions
- [ ] **TODO**: Implement admin password reset flow
- [ ] **TODO**: Add 2FA option for admin accounts

## Environment Variables Required

```bash
# Must be set (app will error if missing)
SESSION_SECRET=...        # Use: openssl rand -base64 32
ADMIN_USERNAME=...
ADMIN_PASSWORD=...        # TODO: Use ADMIN_PASSWORD_HASH with bcrypt

# Supabase (required for CMS)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Testing Security

1. **Test Middleware**:
   ```bash
   # Should redirect to login
   curl http://localhost:3000/admin

   # Should return 401
   curl http://localhost:3000/api/admin/blog
   ```

2. **Test Image Upload Auth**:
   ```bash
   # Should return 401
   curl -X POST http://localhost:3000/api/admin/upload-image \
     -F "file=@test.jpg" \
     -F "bucket=blog-images"
   ```

3. **Test Session Secret**:
   ```bash
   # Remove SESSION_SECRET from .env.local and try to login
   # Should see error about SESSION_SECRET not configured
   ```

## Additional Hardening Recommendations

1. **Content Security Policy (CSP)**:
   ```typescript
   // middleware.ts
   response.headers.set(
     'Content-Security-Policy',
     "default-src 'self'; img-src 'self' https://*.supabase.co data:; ..."
   );
   ```

2. **HTTP Security Headers**:
   ```typescript
   // next.config.js
   headers: async () => [
     {
       source: '/:path*',
       headers: [
         { key: 'X-Frame-Options', value: 'DENY' },
         { key: 'X-Content-Type-Options', value: 'nosniff' },
         { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
       ],
     },
   ]
   ```

3. **Admin Activity Logging**:
   - Create `audit_logs` table
   - Log all create/update/delete operations
   - Include IP address, timestamp, action type

4. **Session Management**:
   - Add "logout all sessions" functionality
   - Track active sessions in database
   - Allow admin to see/revoke sessions

5. **File Upload Security**:
   - Scan uploaded files for malware
   - Validate image dimensions
   - Strip EXIF data from images
   - Limit upload frequency per IP

## Summary

✅ **Immediately Exploitable Issues**: FIXED
- Middleware now protects admin routes
- Image upload requires authentication
- SESSION_SECRET is required

⚠️ **Should Fix Before Production**:
- Implement bcrypt password hashing
- Add rate limiting on login
- Implement view/download tracking
- Add search/filter functionality

📝 **Nice to Have**:
- Multi-image upload UI
- Audit logging
- 2FA support
- Admin activity dashboard
