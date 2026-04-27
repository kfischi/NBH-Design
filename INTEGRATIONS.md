# NBH Engineering Solutions — Integrations & API Setup

> כל ה-API Keys והגדרות שצריך לחבר לפני העלאה לפרודקשן.

---

## What's working today (Phase 1)

| Channel | Status | Where |
|---|---|---|
| ✅ Notion lead creation | **Live** | `src/lib/notion-client.ts` |
| ✅ Resend confirmation email (to lead) | **Live** | `src/lib/email-client.ts` |
| ✅ Resend notification email (to Nevet, with Notion link) | **Live** | `src/lib/email-client.ts` |
| ✅ Health check | **Live** | `GET /api/health` |
| ⏳ WhatsApp (WAHA) | **Phase 2 — deferred** | Code wired, infra not deployed |
| ⏳ n8n orchestration | **Phase 2 — deferred** | Code wired, no live instance |
| ❌ HubSpot | **Removed** | Replaced by Notion |

Required env vars in Netlify for Phase 1 to work:
- `NOTION_API_KEY`, `NOTION_LEADS_DATABASE_ID`
- `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`

Smoke test the live site:
```bash
SITE_URL=https://nbh-engineering.com ./scripts/smoke-test.sh
```

---

## Architecture Overview (Phase 1 — what runs today)

```
Contact Form / Chatbot (Frontend)
        │
        ▼
POST /api/contact  or  POST /api/chat/submit
        │
        ├──▶ Notion (canonical lead)            ✅ live
        ├──▶ Resend → email to Nevet            ✅ live
        ├──▶ Resend → confirmation to lead      ✅ live (if email captured)
        ├──▶ n8n webhook                        ⏳ skipped if not configured
        └──▶ WAHA WhatsApp                      ⏳ skipped if not configured
```

Every channel is logged with a shared `requestId` (UUID per request) so failures
can be traced in Netlify logs:
```
{"requestId":"...","channel":"notion","status":"ok","pageId":"..."}
```

---

## 1. N8N — Workflow Automation — ⏳ DEFERRED to Phase 2

> n8n אינו פעיל כרגע. ה-API routes עדיין קוראות ל-`N8N_WEBHOOK_URL` — אם המשתנה
> אינו מוגדר הן פשוט מדלגות. אין צורך לפרוס n8n לצורך פעולת האתר ב-Phase 1.

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

## 3. WhatsApp — WAHA + Coolify — ⏳ DEFERRED to Phase 2

> WAHA אינו פרוס כרגע. ה-API routes קוראות אליו רק אם `WAHA_BASE_URL` ו-
> `WAHA_TO_NUMBER` מוגדרים — אחרת מדלגות. ב-Phase 1 ההתראה לנבט מגיעה במייל
> דרך Resend.

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

## 6. CRM — Notion (canonical, the only CRM)

> HubSpot was removed. Notion is the single source of truth for leads.

### Setup
1. Create workspace → New Database → "Leads"
2. Add these columns (names are case-sensitive):

| Column | Type | Required? | Notes |
|---|---|---|---|
| Name | Title | ✅ | Lead's full name |
| Company | Rich text | optional | |
| Phone | Phone | ✅ | E.164 or local format |
| Challenge | Rich text | ✅ | Free-text problem description |
| Status | Select | ✅ | Default option: `ליד חדש` |
| Source | Select | ✅ | Options: `אתר`, `צ'אטבוט AI` |
| Date | Date | ✅ | ISO timestamp |
| AI Score | Number | optional | Lead-quality score 0–100 |
| AI Summary | Rich text | optional | Generated summary from chatbot |

3. Settings → Integrations → Create Integration → copy the secret
4. Open the database → top-right `...` → Connect → select your integration

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
NOTION_LEADS_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> The database ID is in the URL: `notion.so/workspace/DATABASE_ID?v=...`

### Verifying
```bash
curl https://nbh-engineering.com/api/health | jq
# → { notion: "ok", resend: "ok" }
```

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
| Notion | Free | Free |
| Resend | Free (3k emails/mo) | Free |
| **Total** | | **~$5/mo** |
