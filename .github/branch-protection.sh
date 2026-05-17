#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  setup-branch-protection.sh
#
#  Run this ONCE after pushing to GitHub to lock the `main` branch.
#  Requires: GitHub CLI (gh) installed & authenticated (`gh auth login`).
#
#  Usage:
#    chmod +x .github/branch-protection.sh
#    GITHUB_REPO=kfischi/Proto-Model-Design ./branch-protection.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO="${GITHUB_REPO:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"

echo "🔐  Setting branch protection on: $REPO → main"

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/$REPO/branches/main/protection" \
  --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Lint · Build · Type Check"
    ]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_linear_history": false,
  "required_conversation_resolution": true
}
JSON

echo "✅  Branch protection applied:"
echo "     ✓ Requires CI to pass before merge"
echo "     ✓ Requires 1 PR review"
echo "     ✓ No force-push to main"
echo "     ✓ No direct delete of main"

echo ""
echo "🔐  Setting branch protection on: $REPO → staging"

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/$REPO/branches/staging/protection" \
  --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Lint · Build · Type Check"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON

echo "✅  Staging branch protection applied"
