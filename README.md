# Nigeria Stack (nigeriastack.org) — Production TanStack Start + Hono Edge Portal
# License: CC0-1.0 Universal (Public Domain Commons)
# Institutional Demarcation: Independent Open Specification Commons; Not Govt Portal; Not Payment Switch


# 1. Verify Clean-Room Pan-Nigerian Nomenclature & W3C DTCG Zero-Literal Tokens
npx tsx scripts/ci/verify-cleanroom-nomenclature.ts && bash scripts/ci/validate-tokens.sh


# 2. Run Self-Service Interoperability Test Bed (ITB-01 to ITB-05) & Mint SHA-256 Receipt
npx @nigeriastack/conformance-cli certify --bb BB-02,BB-05,BB-06 --out ./conformance-receipt.json


# 3. Start Local <35 KB Offline-First Portal & WASM Verifier
npm --workspace=apps/web run dev
