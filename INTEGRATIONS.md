# NBH Engineering Solutions — Integrations & API Setup

> כל ה-API Keys והגדרות שצריך לחבר לפני העלאה לפרודקשן.

---

## Architecture Overview

```
Contact Form (Frontend)
        │
        ▼
POST /api/contact  (Next.js API Route)
        │
   ┌────┴─────────────────────────────────┐
   │                                      │
   ▼                                      ▼
N8N Webhook                        WAHA (WhatsApp)
   │                                      │
   ├── Email (SMTP/Resend)          Nevet's phone 📱
   ├── CRM (HubSpot/Notion)
   ├── Slack/Teams notification
   └── Calendar booking link
```

---

## 1. N8N — Workflow Automation

N8N הוא ה-orchestrator המרכזי. כל ליד שנכנס עובר דרכו.

### Webhook Setup
| Field | Value |
|-------|-------|
| **Method** | POST |
| **Path** | `/webhook/nbh-contact` |
| **Authentication** | Header `x-webhook-secret` |

### ENV Variables
```env
N8N_WEBHOOK_URL=https://n8n.your-domain.com/webhook/nbh-contact
N8N_WEBHOOK_SECRET=your_secret
```

### Recommended N8N Workflow
```
[Webhook Trigger]
       │
  [Validate payload]
       │
  ┌────┴──────────────────────────┐
  │          │            │       │
[Email]   [CRM]      [WhatsApp] [Slack]
```

### Deployment on Coolify
1. New Resource → Docker Compose → paste `n8nio/n8n` image
2. Add env: `N8N_BASIC_AUTH_ACTIVE=true`, `N8N_BASIC_AUTH_USER`, `N8N_BASIC_AUTH_PASSWORD`
3. Set domain → enable HTTPS
4. Import the workflow JSON from `/n8n-workflows/` folder (TBD)

---

## 2. Email

### Option A — Resend (מומלץ)
1. הרשמה ב-[resend.com](https://resend.com)
2. אמת דומיין (`nbh-engineering.com`) → Add DNS records
3. צור API Key

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=nevet@nbh-engineering.com
EMAIL_TO=nevet@nbh-engineering.com
```

### Option B — SMTP (Gmail / Zoho)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password   # Google → App Passwords
```

> **Gmail:** צור App Password ב-[myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

### Email Templates (הוסף ב-N8N)
- **לליד:** אישור קבלה + קישור לתיאום פגישה (Calendly)
- **לנבט:** ליד חדש עם כל הפרטים

---

## 3. WhatsApp — WAHA + Coolify

### מה זה WAHA?
WhatsApp HTTP API עצמאי (Self-hosted). פועל ב-Docker.

### Deploy על Coolify
1. New Resource → Docker Image → `devlikeapro/waha`
2. Ports: `3000:3000`
3. Volumes: `/tmp/waha` → `/tmp/waha`
4. Environment:
```env
WHATSAPP_DEFAULT_ENGINE=WEBJS
WHATSAPP_HOOK_URL=https://n8n.your-domain.com/webhook/waha-events
```
5. Set domain: `waha.your-domain.com` → HTTPS

### Connect WhatsApp Account
```bash
# 1. Start session
curl -X POST https://waha.your-domain.com/api/sessions/start \
  -H "Content-Type: application/json" \
  -d '{"name": "default"}'

# 2. Get QR code
curl https://waha.your-domain.com/api/screenshot?session=default
# → Open URL in browser, scan QR with WhatsApp

# 3. Check status
curl https://waha.your-domain.com/api/sessions/default
```

### ENV Variables
```env
WAHA_BASE_URL=https://waha.your-domain.com
WAHA_API_KEY=your_api_key        # set in WAHA dashboard
WAHA_SESSION=default
WAHA_TO_NUMBER=972500000000      # מספר נבט (ללא +)
```

### Message Flow
```
Lead submits form
      │
POST /api/contact
      │
sendWhatsApp() → WAHA API → WhatsApp message to Nevet
```

---

## 4. Netlify — Hosting & Deploy

### Setup
1. Push repo to GitHub
2. New site → Import from GitHub → `NBH-Design`
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** 20

### Environment Variables (Netlify UI)
Site Settings → Environment Variables → הוסף את כל המשתנים מ-`.env.example`

### Deploy Hook
```env
NETLIFY_DEPLOY_HOOK=https://api.netlify.com/build_hooks/YOUR_HOOK_ID
```
- שמור ב-N8N כ-HTTP request node לטריגור re-deploy אוטומטי

### Plugin Required
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## 5. Cloudinary — Media Management

### Setup
1. הרשמה ב-[cloudinary.com](https://cloudinary.com)
2. Dashboard → Settings → Upload → Add Upload Preset
   - Name: `nbh_portfolio`
   - Signing: **Unsigned** (לעלאות מהאתר)
   - Folder: `nbh-projects`

### ENV Variables
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nbh_portfolio
```

### שימוש מרכזי
- תמונות מקרי בוחן (Case Studies)
- תמונות פרויקטים מהאדמין פאנל
- אוטומטית: resize + WebP + lazy load דרך `next/image`

```tsx
// Example usage in components
import Image from "next/image";
<Image
  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/nbh-projects/project-name.jpg`}
  alt="Project"
  width={800}
  height={600}
/>
```

---

## 6. CRM

### Option A — HubSpot (מומלץ לB2B)
1. הרשמה ב-[hubspot.com](https://hubspot.com) (Free CRM)
2. Settings → Integrations → API Key → Create
3. צור Pipeline: "הנדסה" עם שלבים: `ליד חדש → אפיון → הצעת מחיר → סגירה`

```env
HUBSPOT_API_KEY=pat-eu1-xxxxxxxxxxxx
HUBSPOT_PORTAL_ID=12345678
```

**N8N HubSpot Node:** פעולות אוטומטיות:
- Create Contact
- Create Deal → Pipeline
- Add Note (תוכן האתגר)

### Option B — Notion (קל יותר לתחילה)
1. Create workspace → New Database → "לידים"
2. עמודות: Name, Company, Phone, Status, Challenge, Date, Source
3. Settings → Integrations → Create Integration

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
NOTION_LEADS_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> הדאטאבייס ID נמצא ב-URL של הדף בנוטיון: `notion.so/workspace/DATABASE_ID?v=...`

---

## 7. Admin Panel

### Architecture
```
/admin/*          — Protected routes (NextAuth)
/admin/leads      — רשימת לידים (מ-Notion/HubSpot API)
/admin/projects   — ניהול מקרי בוחן
/admin/media      — Cloudinary gallery
```

### Authentication — NextAuth.js
```bash
npm install next-auth
```

```env
NEXTAUTH_URL=https://nbh-engineering.com
NEXTAUTH_SECRET=run: openssl rand -base64 32
ADMIN_EMAIL=admin@nbh-engineering.com
ADMIN_PASSWORD_HASH=run: node -e "require('bcrypt').hash('your_pass',12,console.log)"
```

**Protected route example:**
```ts
// src/middleware.ts
export { default } from "next-auth/middleware";
export const config = { matcher: ["/admin/:path*"] };
```

### Quick Setup (Credentials Provider)
```ts
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const { handlers, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize({ email, password }) {
        if (email !== process.env.ADMIN_EMAIL) return null;
        const match = await bcrypt.compare(
          password as string,
          process.env.ADMIN_PASSWORD_HASH!
        );
        return match ? { id: "1", email: email as string } : null;
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
});
```

---

## Deployment Checklist

### Before Going Live
- [ ] `.env.local` מלא בכל הערכים האמיתיים
- [ ] WAHA session מחוברת (QR scanned)
- [ ] N8N webhook active + tested
- [ ] Cloudinary upload preset created
- [ ] CRM pipeline configured
- [ ] Resend / SMTP domain verified
- [ ] Netlify environment variables set
- [ ] NextAuth secret generated (32+ chars)
- [ ] Test full lead flow end-to-end
- [ ] Rate limiting active (Upstash Redis recommended for prod)

### Test the API locally
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ישראל ישראלי",
    "company": "חברת טסט",
    "phone": "050-000-0000",
    "challenge": "צריך פתרון IoT לחקלאות"
  }'
```

Expected response: `{ "ok": true }`

---

## Cost Estimate (Monthly)

| Service | Plan | Cost |
|---------|------|------|
| Netlify | Starter | Free |
| Cloudinary | Free | Free |
| N8N (Coolify) | Self-hosted | ~$5/mo VPS |
| WAHA (Coolify) | Self-hosted | Same VPS |
| HubSpot CRM | Free | Free |
| Notion | Free | Free |
| Resend | Free (3k emails/mo) | Free |
| **Total** | | **~$5/mo** |
