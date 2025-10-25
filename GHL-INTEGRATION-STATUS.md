# GoHighLevel (GHL) CRM Integration - Setup & Status

**Last Updated**: January 25, 2025
**Status**: ⚙️ CONFIGURED BUT NOT ACTIVELY INTEGRATED
**CRM Platform**: GoHighLevel

---

## Overview

GoHighLevel CRM integration is **configured and ready** but **not currently sending data**. The environment variables are set up in Netlify, and the integration can be enabled with minimal code changes when needed.

## Current Status

### ✅ Configured

- Environment variables set in Netlify
- `GHL_ENABLED` flag for easy on/off toggle
- `GHL_API_KEY` and `GHL_LOCATION_ID` configured
- Helper functions ready for implementation

### ❌ Not Yet Integrated

- Contact form submissions NOT sent to GHL
- Free consultation form NOT sent to GHL
- No active API calls to GHL endpoints
- No contact syncing

---

## Environment Variables

Set in `.env.local` and Netlify:

```bash
# GoHighLevel CRM Integration
GHL_ENABLED=false                          # Set to 'true' to enable
GHL_API_KEY=your-ghl-api-key-here          # From GHL dashboard
GHL_LOCATION_ID=your-location-id-here      # Your GHL location ID
```

### How to Get GHL Credentials

1. **API Key**:
   - Log in to GoHighLevel
   - Settings → Integrations → API
   - Generate new API key
   - Copy and save securely

2. **Location ID**:
   - Settings → Business Profile
   - Copy the Location ID
   - Or find in URL when logged in to GHL

---

## Integration Architecture

### Contact Creation Flow (When Enabled)

```
User submits form
      ↓
Next.js API route receives data
      ↓
Check if GHL_ENABLED === 'true'
      ↓ (if enabled)
Send contact to GHL API
      ↓
Create/update contact in GHL
      ↓
Add to appropriate pipeline/workflow
```

---

## Implementation Code (Ready to Use)

### Helper Function (`/lib/ghl-client.ts` - to be created)

```typescript
// lib/ghl-client.ts

interface GHLContact {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  source?: string;
}

export async function createGHLContact(contact: GHLContact) {
  const ghlEnabled = process.env.GHL_ENABLED === 'true';

  if (!ghlEnabled) {
    console.log('GHL integration disabled, skipping contact sync');
    return null;
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    console.error('GHL_API_KEY or GHL_LOCATION_ID not configured');
    return null;
  }

  try {
    const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId,
        firstName: contact.firstName,
        lastName: contact.lastName || '',
        email: contact.email,
        phone: contact.phone || '',
        tags: contact.tags || [],
        customField: contact.customFields || {},
        source: contact.source || 'Website',
      }),
    });

    if (!response.ok) {
      throw new Error(`GHL API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Contact created in GHL:', data.contact.id);
    return data.contact;
  } catch (error) {
    console.error('Failed to create GHL contact:', error);
    return null;
  }
}
```

---

## Integration Points

### 1. Contact Form (`/app/api/contact/route.ts`)

**Current**: Only sends email
**When GHL enabled**: Also creates contact in GHL

```typescript
import { createGHLContact } from '@/lib/ghl-client';

export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();

  // Send email (existing)
  await sendEmail({ ... });

  // Send to GHL (when enabled)
  await createGHLContact({
    firstName: name.split(' ')[0],
    lastName: name.split(' ').slice(1).join(' '),
    email,
    tags: ['Website Contact Form'],
    source: 'Contact Form',
    customFields: {
      'Initial Message': message,
    },
  });

  return NextResponse.json({ success: true });
}
```

---

### 2. Free Consultation Form (`/app/api/contact-expert/route.ts`)

**Current**: Only sends email
**When GHL enabled**: Creates contact with detailed pet information

```typescript
import { createGHLContact } from '@/lib/ghl-client';

export async function POST(request: NextRequest) {
  const formData = await request.json();

  // Send email (existing)
  await sendEmail({ ... });

  // Send to GHL with rich data (when enabled)
  await createGHLContact({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    tags: ['Free Consultation Request', 'High Intent Lead'],
    source: 'Free Consultation Form',
    customFields: {
      'Pet Name': formData.petName,
      'Pet Breed': formData.petBreed,
      'Pet Age': formData.petAge,
      'Health Issues': formData.healthIssues,
      'Current Diet': formData.currentDiet,
      'Goals': formData.goals,
      'Budget': formData.budget,
    },
  });

  return NextResponse.json({ success: true });
}
```

---

### 3. Newsletter Signup (Future)

```typescript
await createGHLContact({
  firstName: email.split('@')[0], // Use email username if no name
  email,
  tags: ['Newsletter Subscriber'],
  source: 'Blog Newsletter',
});
```

---

### 4. Customer Account Creation (Future)

When customer creates account, sync to GHL:

```typescript
await createGHLContact({
  firstName: user.user_metadata.first_name,
  lastName: user.user_metadata.last_name,
  email: user.email,
  phone: user.user_metadata.phone,
  tags: ['Customer Account Created'],
  source: 'Website Registration',
});
```

---

### 5. Order Placement (Future)

When customer places order, update GHL contact:

```typescript
await createGHLContact({
  email: customer.email,
  tags: ['Customer', 'Made Purchase'],
  customFields: {
    'First Order Date': new Date().toISOString(),
    'First Order Total': orderTotal,
  },
});
```

---

## GHL Features to Leverage

### Pipelines

Create pipelines in GHL for:
- **Leads**: Contact form → Consultation scheduled → Customer
- **Consultations**: Requested → Scheduled → Completed → Follow-up
- **Customers**: New → Active → Subscription → Loyal

### Workflows/Automations

Set up automated workflows:
1. **Contact Form Submission**:
   - Send thank you email
   - Assign to Christie
   - Create follow-up task (24 hours)

2. **Free Consultation Request**:
   - Send confirmation email
   - Send Christie notification
   - Schedule reminder (1 day before)

3. **New Customer**:
   - Welcome email sequence
   - Educational content drip campaign
   - Onboarding checklist

4. **Abandoned Cart** (future):
   - Send reminder email (1 hour)
   - Offer discount (24 hours)
   - Final reminder (3 days)

### Custom Fields

Recommended custom fields in GHL:

- **Pet Information**:
  - Pet Name
  - Pet Breed
  - Pet Age
  - Pet Weight
  - Health Issues

- **Customer Data**:
  - Customer Since
  - Total Orders
  - Lifetime Value
  - Subscription Status
  - Preferred Products

- **Lead Data**:
  - Lead Source
  - Initial Message
  - Consultation Date
  - Budget Range
  - Goals

---

## How to Enable GHL Integration

### Step 1: Verify Credentials

1. Log in to GoHighLevel
2. Copy your API key
3. Copy your Location ID

### Step 2: Update Environment Variables

In Netlify:
```bash
GHL_ENABLED=true
GHL_API_KEY=your-actual-api-key
GHL_LOCATION_ID=your-actual-location-id
```

### Step 3: Create Helper File

Create `/lib/ghl-client.ts` with the helper function above

### Step 4: Update API Routes

Add GHL integration to:
- `/app/api/contact/route.ts`
- `/app/api/contact-expert/route.ts`

### Step 5: Test

1. Submit contact form
2. Check GHL dashboard for new contact
3. Verify tags and custom fields
4. Test workflow triggers

---

## Testing GHL Integration

### Local Testing

```bash
# .env.local
GHL_ENABLED=true
GHL_API_KEY=test-key
GHL_LOCATION_ID=test-location
```

Submit forms and check:
- Console logs show GHL API calls
- Contacts appear in GHL dashboard
- Custom fields populated correctly
- Tags applied

### Production Testing

1. Enable in Netlify
2. Deploy
3. Submit test contact form with unique email
4. Check GHL for contact creation
5. Verify workflows trigger
6. Test with different forms

---

## Email vs GHL Integration

### Why Both?

**Email (SMTP)**:
- Immediate notification to Christie
- Works even if GHL is down
- Simple backup system
- No API limits

**GoHighLevel**:
- Centralized contact management
- Automated workflows
- Pipeline tracking
- Historical data
- Marketing automation
- SMS capabilities
- Appointment scheduling

**Best Practice**: Keep both integrations
- Email ensures nothing is missed
- GHL provides long-term CRM value

---

## Error Handling

### Graceful Degradation

```typescript
try {
  await createGHLContact(contactData);
} catch (error) {
  console.error('GHL integration failed:', error);
  // Continue with email - don't fail the form submission
}
```

**Key Principle**: GHL failures should NOT break form submissions

### Monitoring

Log GHL integration failures:
```typescript
if (!ghlResponse) {
  console.warn('GHL contact creation failed but email sent successfully');
  // Consider logging to error tracking service (Sentry, etc.)
}
```

---

## Rate Limits

### GHL API Limits

- **Free Plan**: 60 requests/minute
- **Paid Plans**: Higher limits

### Optimization

If hitting limits:
1. **Batch Operations**: Queue contacts and batch create
2. **Webhooks**: Use GHL webhooks instead of polling
3. **Caching**: Cache contact lookups
4. **Upgrade Plan**: Contact GHL for higher limits

---

## Security

### API Key Protection

- ✅ Stored in environment variables (server-side only)
- ✅ Never exposed to client-side code
- ✅ Not committed to repository
- ⚠️ Rotate periodically (every 90 days recommended)

### Data Privacy

- Ensure GDPR/CCPA compliance
- Get user consent for marketing communications
- Provide unsubscribe options
- Honor data deletion requests

---

## Future Enhancements

### Phase 1: Basic Integration (When Enabled)

- [x] Environment variables configured
- [ ] Create `lib/ghl-client.ts`
- [ ] Integrate contact form
- [ ] Integrate consultation form
- [ ] Test and verify

### Phase 2: Advanced Features

- [ ] Sync customer accounts
- [ ] Order data integration
- [ ] Subscription status sync
- [ ] Abandoned cart tracking

### Phase 3: Marketing Automation

- [ ] Newsletter integration
- [ ] Drip campaigns
- [ ] SMS notifications
- [ ] Appointment reminders

### Phase 4: Analytics

- [ ] Track lead sources
- [ ] Conversion tracking
- [ ] ROI reporting
- [ ] Pipeline analytics

---

## Troubleshooting

### "GHL_API_KEY not found"

- Check environment variables in Netlify
- Verify variable names match exactly
- Redeploy after adding variables

### "Contact not appearing in GHL"

- Check `GHL_ENABLED=true`
- Verify API key is valid
- Check GHL dashboard for correct location
- Review console logs for errors

### "API rate limit exceeded"

- Reduce request frequency
- Implement request queuing
- Upgrade GHL plan
- Use webhooks instead of polling

### "Workflow not triggering"

- Check GHL workflow configuration
- Verify tags match trigger conditions
- Test workflow manually in GHL
- Check workflow is active/published

---

## Related Documentation

- `CONTACT_FORM_SETUP.md` - Contact form email integration
- `FREE-CONSULTATION-FORM-COMPLETE.md` - Consultation form setup
- `NETLIFY_ENV_VARS.md` - Environment variable configuration
- `PROJECT-STATUS-COMPLETE.md` - Overall project status

---

## Support Resources

- **GHL Documentation**: https://highlevel.stoplight.io/
- **GHL Support**: support@gohighlevel.com
- **GHL Community**: Facebook group for users

---

**Status**: Ready to enable when needed. Set `GHL_ENABLED=true` to activate.
