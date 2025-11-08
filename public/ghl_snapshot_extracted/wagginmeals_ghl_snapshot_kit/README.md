# WagginMeals – GoHighLevel Snapshot Kit (Authorize.net + Next.js + Supabase)

This kit contains **copy‑paste ready** assets to build your WagginMeals snapshot inside your GoHighLevel Agency.
Because GHL snapshots must be created **inside your agency account**, this kit gives you:
- CSVs for **Custom Fields** and **Tags**
- JSON for **Pipelines** and **Workflow Router**
- Markdown templates for **25+ Emails** and **4 SMS** messages
- Forms/Surveys & Calendars build-sheets (field lists and settings)
- Webhook payload examples to test your Next.js → GHL integration
- Embed snippets for **Forms/Surveys/Calendars** and **Webchat/AI** (place in your Next.js pages)

> **Security**: No secrets are included. Keep API keys only in your Next.js env and GHL location settings.

## How to Use
1) In **Agency View → Settings → Account Snapshots → Create New**, then add assets below into the WagginMeals **location**.
2) **Custom Fields**: Create per `custom_fields.csv` (Settings → Custom Fields).
3) **Tags**: Create per `tags.csv` (Automation → Tags).
4) **Pipelines**: Recreate stages per `pipelines.json`.
5) **Workflows**: Use `workflows_router.json` as a blueprint; then add the included sequences and triggers.
6) **Emails/SMS**: Paste templates from `/emails` and `/sms` into GHL (Marketing → Emails / Automation → SMS).
7) **Forms/Surveys/Calendars**: Build per the spec in `/forms_surveys_calendars/*.md` and then use the **embed** snippets in `/embeds`.
8) **Webhooks**: Use `/webhooks/examples.json` to post events from your Next.js to your single GHL "Event Router" workflow.

You can **freely modify anything** in the sub‑account after applying your snapshot.
