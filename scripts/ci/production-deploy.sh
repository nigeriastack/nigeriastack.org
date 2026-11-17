#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
node scripts/ci/verify-release-readiness.mjs
# No live domain mutation is performed by this preparation command.
echo 'Release evidence is ready for operator review. Apply the separately authorized Cloudflare deployment and DNS cutover procedure.'
