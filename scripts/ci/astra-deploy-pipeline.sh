#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
pnpm install --frozen-lockfile
pnpm run ci:verify-all-gates
CI=true pnpm exec wrangler d1 migrations apply nigeriastack-commons-d1-prod --local --config apps/web/wrangler.toml
node scripts/generate-d1-seed.mjs
CI=true pnpm exec wrangler d1 execute nigeriastack-commons-d1-prod --local --config apps/web/wrangler.toml --file=scripts/seed-d1-from-canonical-json.sql
# Preparation stops here. Production binding is an explicit placeholder;
# this configuration includes custom-domain routes and must not trigger DNS cutover.
echo 'Local preparation complete. Production resource validation and DNS cutover review remain required.'
