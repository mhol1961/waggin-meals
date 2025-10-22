# Contact Form Setup Guide

The Waggin Meals website now has a fully functional contact form that sends emails to `wagginmeals@gmail.com`.

## Features

- **Email Notifications**: Submissions are sent directly to wagginmeals@gmail.com
- **Auto-Reply**: Customers receive an automatic thank-you email with helpful links
- **Form Validation**: Client-side and server-side validation
- **Loading States**: Visual feedback during submission
- **Success/Error Messages**: Clear feedback to users
- **Responsive Design**: Works perfectly on all devices

## Setup Instructions

### 1. Create Gmail App Password

To enable email sending, you need to create an app-specific password for Gmail:

1. Go to [Google Account App Passwords](https://myaccount.google.com/apppasswords)
2. Sign in with the wagginmeals@gmail.com account
3. Create a new app password:
   - App: Choose "Mail" or "Other (Custom name)"
   - Name it something like "Waggin Meals Website"
4. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

### 2. Create .env.local File

Create a file named `.env.local` in the root directory of your project:

```bash
# Email Configuration for Contact Form
SMTP_USER=wagginmeals@gmail.com
SMTP_PASS=your-app-specific-password-here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

**Important**:
- Use the app-specific password (not your regular Gmail password)
- Remove spaces from the password
- Never commit this file to version control (it's already in .gitignore)

### 3. Test the Contact Form

1. Start the development server: `npm run dev`
2. Navigate to `/contact` page
3. Fill out and submit the form
4. Check wagginmeals@gmail.com inbox for the submission
5. Check the email address you entered for the auto-reply

### 4. Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add the environment variables in your hosting platform's dashboard
2. Set the same variables:
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_HOST`
   - `SMTP_PORT`

## How It Works

1. **User submits form** → Form data sent to `/api/contact` endpoint
2. **API validates data** → Checks required fields and email format
3. **Two emails are sent**:
   - **To Waggin Meals**: Contains customer's name, email, and message
   - **To Customer**: Auto-reply thanking them and providing helpful links
4. **Success message** → User sees confirmation on the page

## Troubleshooting

### Email not sending?

1. **Check .env.local exists** in the root directory
2. **Verify app password** is correct (no spaces)
3. **Check console logs** for error messages
4. **Test Gmail login** with the app password using a mail client

### Form submits but no email?

- The API will log submissions to console even if email fails
- Check the server console for the submission details
- Ensure SMTP credentials are set correctly

### "Failed to send message" error?

1. Check your internet connection
2. Verify Gmail SMTP isn't blocked by firewall
3. Ensure the app password is still valid
4. Try generating a new app password

## File Structure

```
/app
  /api
    /contact
      route.ts          # API endpoint for form submission
  /contact
    page.tsx           # Contact form page component

.env.local.example     # Example environment variables
.env.local            # Your actual credentials (DO NOT COMMIT)
```

## Email Templates

### Notification Email (to Waggin Meals)
- **Subject**: "New Contact Form Submission from [Name]"
- **Contains**: Name, email, and full message
- **Format**: Styled HTML with brand colors

### Auto-Reply Email (to Customer)
- **Subject**: "Thank you for contacting Waggin Meals!"
- **Contains**: Thank you message, estimated response time, helpful links
- **Format**: Branded HTML template matching website design

## Security Notes

- Form includes CSRF protection via Next.js
- Email validation on both client and server
- Input sanitization prevents XSS attacks
- SMTP credentials stored securely in environment variables
- Rate limiting recommended for production (not yet implemented)

## Future Enhancements

Consider adding:
- [ ] Rate limiting to prevent spam
- [ ] reCAPTCHA for bot protection
- [ ] Email queue system for high volume
- [ ] Admin dashboard to view submissions
- [ ] Integration with CRM (if needed)
- [ ] Email templates management system

## Support

If you encounter any issues:
1. Check this documentation
2. Review the console logs
3. Test SMTP credentials manually
4. Contact your developer for assistance

---

**Last Updated**: January 2025
**Contact Form Version**: 1.0
