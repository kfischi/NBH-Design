# GitHub Secrets & Variables Setup

הוסף את כל הסודות האלה ב:
**GitHub → Repository → Settings → Secrets and variables → Actions**

---

## Repository Secrets (סודות — מוצפנים)

| Secret Name | Where to get it |
|-------------|-----------------|
| `NETLIFY_SITE_ID` | Netlify → Site → Site configuration → Site ID |
| `NETLIFY_AUTH_TOKEN` | Netlify → User Settings → Applications → New access token |
| `N8N_WEBHOOK_URL` | N8N → Workflows → Webhook node URL |
| `N8N_WEBHOOK_SECRET` | אתה קובע — שמור את אותו ערך גם ב-N8N |
| `RESEND_API_KEY` | resend.com → API Keys |
| `WAHA_BASE_URL` | הדומיין של WAHA על Coolify |
| `WAHA_API_KEY` | WAHA Dashboard → Settings |
| `WAHA_TO_NUMBER` | מספר הטלפון עם קוד מדינה (ללא +): `972501234567` |
| `HUBSPOT_API_KEY` | HubSpot → Settings → Integrations → API key |
| `NOTION_API_KEY` | notion.so → Settings → Connections → New integration |
| `NOTION_LEADS_DATABASE_ID` | מה-URL של דאטאבייס הנוטיון |
| `NEXTAUTH_SECRET` | רץ: `openssl rand -base64 32` |

---

## Repository Variables (פומבי — לא מוצפן)

| Variable Name | Value |
|---------------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://proto-model.com` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | שם הענן ב-Cloudinary |

---

## איך להוסיף Secret ב-CLI (מהיר יותר)

```bash
# Install GitHub CLI: https://cli.github.com
gh auth login

# Add secrets one by one
gh secret set NETLIFY_SITE_ID
gh secret set NETLIFY_AUTH_TOKEN
gh secret set N8N_WEBHOOK_URL
# ... etc

# Or from .env.local file
gh secret set --env-file .env.local
```

---

## Flow Diagram

```
Developer
    │
    ├── push to `staging` ──→ CI: lint+build → Deploy Preview URL
    │                                           ↓
    │                                    Comment on commit
    │
    └── PR to `main`
              │
         PR Checks (CI must pass)
         + 1 reviewer approval
              │
         Merge → push to `main`
              │
         CI: lint+build → Deploy to Production 🚀
              │
         (if fail) → WhatsApp notification to Nevet 📱
```
