#!/usr/bin/env bash
# NBH Engineering — production smoke test for the lead pipeline.
#
# Usage:
#   SITE_URL=https://nbh-engineering.com ./scripts/smoke-test.sh
#
# What it does:
#   1. GET /api/health                       → expect 200, both services "ok"
#   2. POST /api/contact with a test lead    → expect 200
#   3. (optional) Query Notion for the row   → set NOTION_API_KEY + NOTION_LEADS_DATABASE_ID
#
# Resend logs must be inspected manually at https://resend.com/emails

set -euo pipefail

SITE_URL="${SITE_URL:-http://localhost:3000}"
TEST_NAME="SMOKE-$(date +%s)"
TEST_PHONE="+972500000000"
TEST_EMAIL="${SMOKE_EMAIL:-smoke@example.invalid}"

red()    { printf "\033[31m%s\033[0m\n" "$*"; }
green()  { printf "\033[32m%s\033[0m\n" "$*"; }
yellow() { printf "\033[33m%s\033[0m\n" "$*"; }

echo "=== NBH smoke test → $SITE_URL ==="

# --- 1. Health check ---
echo
echo "[1/3] GET /api/health"
HEALTH_BODY=$(curl -fsS "$SITE_URL/api/health" || true)
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/api/health")

echo "$HEALTH_BODY"
if [ "$HEALTH_STATUS" != "200" ]; then
  red "  ✘ health endpoint returned $HEALTH_STATUS"
  exit 1
fi
green "  ✓ /api/health returned 200"

# --- 2. Submit a test lead ---
echo
echo "[2/3] POST /api/contact (name: $TEST_NAME)"
CONTACT_RESPONSE=$(curl -fsS -X POST "$SITE_URL/api/contact" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$TEST_NAME\",
    \"company\": \"smoke-test\",
    \"phone\": \"$TEST_PHONE\",
    \"email\": \"$TEST_EMAIL\",
    \"challenge\": \"Automated smoke test — please ignore.\"
  }")

echo "$CONTACT_RESPONSE"
echo "$CONTACT_RESPONSE" | grep -q '"ok":true' || {
  red "  ✘ /api/contact did not return ok:true"
  exit 1
}
green "  ✓ /api/contact accepted the lead"

# --- 3. (optional) Verify Notion row ---
echo
echo "[3/3] Notion verification"
if [ -z "${NOTION_API_KEY:-}" ] || [ -z "${NOTION_LEADS_DATABASE_ID:-}" ]; then
  yellow "  ⊝ skipped — set NOTION_API_KEY and NOTION_LEADS_DATABASE_ID to verify"
else
  sleep 2
  NOTION_QUERY=$(curl -fsS -X POST \
    "https://api.notion.com/v1/databases/$NOTION_LEADS_DATABASE_ID/query" \
    -H "Authorization: Bearer $NOTION_API_KEY" \
    -H "Notion-Version: 2022-06-28" \
    -H "Content-Type: application/json" \
    -d "{
      \"filter\": {
        \"property\": \"Name\",
        \"title\": { \"equals\": \"$TEST_NAME\" }
      },
      \"page_size\": 1
    }")

  if echo "$NOTION_QUERY" | grep -q "\"$TEST_NAME\""; then
    green "  ✓ Notion row created for $TEST_NAME"
  else
    red "  ✘ Notion row not found — check NOTION_LEADS_DATABASE_ID and column names"
    echo "$NOTION_QUERY"
    exit 1
  fi
fi

echo
green "=== smoke test passed ==="
echo "Now check Resend dashboard for two emails: https://resend.com/emails"
