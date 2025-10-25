# Production Deployment Checklist

## Before Going Live

### Critical Security (MUST DO)

- [ ] **Set Strong SESSION_SECRET**
  ```bash
  openssl rand -base64 32
  # Add to .env.local
  ```

- [ ] **Set Strong Admin Password**
  ```bash
  # Use a password manager to generate 20+ character password
  # Update ADMIN_PASSWORD in .env.local
  ```

- [ ] **Verify Supabase RLS Policies**
  - Test that anonymous users can only read published content
  - Verify service role key is only used server-side
  - Check storage bucket policies

- [ ] **Enable HTTPS Only**
  ```javascript
  // In lib/admin-auth.ts:79, ensure secure: true in production
  secure: process.env.NODE_ENV === 'production',
  ```

- [ ] **Test All Auth Flows**
  - [ ] Login with correct credentials
  - [ ] Login with wrong credentials (should fail)
  - [ ] Access /admin without login (should redirect)
  - [ ] Access /api/admin without auth (should 401)
  - [ ] Upload image without auth (should 401)
  - [ ] Session expires after 24 hours

### Database Setup (MUST DO)

- [ ] **Create Supabase Project**
  - Go to https://supabase.com/dashboard
  - Create new project (or use existing)

- [ ] **Run Schema**
  ```sql
  -- Go to SQL Editor in Supabase
  -- Copy and paste entire supabase/schema.sql
  -- Click "Run"
  -- Verify all 6 tables created
  ```

- [ ] **Create Storage Buckets**
  - [ ] blog-images (Public)
  - [ ] video-thumbnails (Public)
  - [ ] testimonial-images (Public)
  - [ ] event-images (Public)
  - [ ] product-images (Public)
  - [ ] resource-thumbnails (Public)

  Follow: `supabase/STORAGE-SETUP.md`

- [ ] **Test Database Connection**
  ```bash
  npm run dev
  # Try to login and create a test blog post
  ```

### Environment Variables (MUST DO)

Create `.env.local` with:

```bash
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Admin Auth (REQUIRED)
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_very_secure_password_here
SESSION_SECRET=your_random_32char_secret_here

# Email (if using contact form)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

- [ ] Verify no placeholder values remain
- [ ] Ensure .env.local is in .gitignore
- [ ] Never commit .env.local to git

### Performance & Optimization (RECOMMENDED)

- [ ] **Enable Image Optimization**
  ```javascript
  // next.config.js
  images: {
    domains: ['yourproject.supabase.co'],
    formats: ['image/webp'],
  }
  ```

- [ ] **Set up CDN** (Optional but recommended)
  - Use Vercel's built-in CDN
  - Or configure Cloudflare

- [ ] **Database Indexes**
  - Schema already includes indexes
  - Monitor slow queries in Supabase

- [ ] **Enable Caching**
  ```typescript
  // For frequently accessed content
  export const revalidate = 3600; // 1 hour
  ```

### Testing (RECOMMENDED)

- [ ] **Test All CRUD Operations**
  - [ ] Create blog post
  - [ ] Edit blog post
  - [ ] Delete blog post
  - [ ] Publish/unpublish
  - [ ] Upload images
  - [ ] Same for all 6 content types

- [ ] **Test Public Site**
  - [ ] Verify published content appears
  - [ ] Verify drafts don't appear
  - [ ] Test SEO metadata
  - [ ] Check mobile responsiveness

- [ ] **Load Testing**
  - Test with multiple images uploaded
  - Test with 100+ blog posts
  - Check page load times

### Monitoring & Logging (RECOMMENDED)

- [ ] **Set up Error Tracking**
  - Sentry, LogRocket, or similar
  - Track admin errors separately

- [ ] **Monitor Supabase Usage**
  - Check database size
  - Check storage usage
  - Check bandwidth usage
  - Set up usage alerts

- [ ] **Backup Strategy**
  - Supabase has automatic backups
  - Consider additional backups for peace of mind
  - Test restore process

### Content Migration (IF APPLICABLE)

- [ ] **Import Existing Content**
  - Write migration scripts if needed
  - Test on staging first
  - Verify all fields map correctly

- [ ] **Migrate Images**
  - Upload to Supabase storage
  - Update URLs in content
  - Set up redirects for old URLs

### SEO & Analytics (RECOMMENDED)

- [ ] **Set up Google Analytics**
  - Add tracking code
  - Set up admin page exclusions

- [ ] **Set up Google Search Console**
  - Submit sitemap
  - Verify ownership

- [ ] **Generate Sitemap**
  - Automatically generate from content
  - Update on content changes

### Legal & Compliance (MUST DO IF APPLICABLE)

- [ ] **Privacy Policy**
  - Disclose cookie usage
  - Explain data collection
  - Admin session cookies

- [ ] **Terms of Service**
  - If selling products
  - If collecting user data

- [ ] **GDPR Compliance** (if EU visitors)
  - Cookie consent banner
  - Data deletion requests
  - Privacy policy

### Deployment Platform Setup

#### Vercel (Recommended)

- [ ] Connect GitHub repository
- [ ] Add environment variables in Vercel dashboard
- [ ] Set production branch
- [ ] Enable automatic deployments
- [ ] Set up preview deployments
- [ ] Configure custom domain

#### Other Platforms

- [ ] Configure build command: `npm run build`
- [ ] Configure start command: `npm start`
- [ ] Set Node version: 18+
- [ ] Add environment variables
- [ ] Configure custom domain

### Post-Deployment

- [ ] **Test Live Site**
  - [ ] Admin login works
  - [ ] Content CRUD works
  - [ ] Images upload successfully
  - [ ] Public site displays correctly
  - [ ] Forms submit correctly

- [ ] **Monitor First 24 Hours**
  - Check error logs
  - Monitor performance
  - Watch for security issues

- [ ] **Set up Alerts**
  - Uptime monitoring
  - Error rate alerts
  - Storage usage alerts

### Ongoing Maintenance

- [ ] **Regular Backups**
  - Weekly database exports
  - Monthly full backups

- [ ] **Security Updates**
  - npm audit weekly
  - Update dependencies monthly
  - Monitor Supabase announcements

- [ ] **Content Review**
  - Archive old content
  - Update outdated information
  - Optimize images

## Recommended Future Enhancements

### Short Term (1-3 months)

- [ ] Implement bcrypt password hashing
- [ ] Add rate limiting on login
- [ ] Implement view/download tracking
- [ ] Add search functionality to admin lists
- [ ] Create multi-image upload component
- [ ] Add content scheduling

### Medium Term (3-6 months)

- [ ] User roles (admin vs editor)
- [ ] Content approval workflow
- [ ] Revision history
- [ ] Audit logging
- [ ] 2FA for admin
- [ ] Admin activity dashboard

### Long Term (6+ months)

- [ ] Multiple admin users
- [ ] Commenting system
- [ ] Newsletter integration
- [ ] Advanced analytics
- [ ] AI content suggestions
- [ ] Mobile app for content management

## Support & Troubleshooting

### Common Issues

**Can't Login**
- Check ADMIN_USERNAME and ADMIN_PASSWORD in .env.local
- Verify SESSION_SECRET is set
- Clear browser cookies

**Images Won't Upload**
- Verify storage buckets are created and public
- Check SUPABASE_SERVICE_ROLE_KEY
- Ensure file size under 5MB

**Content Not Saving**
- Check Supabase connection
- Verify API keys are correct
- Check browser console for errors

**Build Errors**
- Run `npm install` to ensure dependencies are installed
- Check for TypeScript errors
- Verify all environment variables are set

### Getting Help

1. Check documentation:
   - `ADMIN-CMS-SETUP.md`
   - `SECURITY-FIXES.md`
   - `supabase/README.md`

2. Check Supabase logs:
   - Go to Supabase Dashboard
   - Check Database logs
   - Check Storage logs

3. Check application logs:
   - Vercel deployment logs
   - Browser console
   - Server logs

## Sign-off

Before going live, verify:

- [ ] All critical security items completed
- [ ] Database and storage set up
- [ ] Environment variables configured
- [ ] All tests passing
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Team trained on admin panel

**Deployment Date**: _____________

**Deployed By**: _____________

**Verified By**: _____________
