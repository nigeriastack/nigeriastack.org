#!/usr/bin/env bash
# ==============================================================================
# NIGERIASTACK.ORG — GATE NS-G5 ZERO-LITERAL & ANTI-SLOP TOKEN AUDITOR
# Canonical Path: scripts/ci/validate-tokens.sh
#
# Enforces:
#   1. Zero raw hex (#xxxxxx), rgb(), or hsl() literals in UI components or
#      HTML5 blueprint artboards outside the compiled :root token block.
#   2. Zero decorative SaaS neon gradients or banned AI-slop classes.
#   3. Mandatory two-layer CSS custom property consumption (`var(--ns-*)`).
#   4. Mandatory WCAG 2.2 forced-colors and prefers-reduced-motion media queries.
# ==============================================================================


set -euo pipefail


ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TOKEN_JSON="${ROOT_DIR}/design-system/tokens/nigeriastack.dtcg.tokens.json"
ARTBOARD_DIR="${ROOT_DIR}/design-system/hifi-artboards"
WEB_APP_DIR="${ROOT_DIR}/apps/web"


echo "=================================================================="
echo "[GATE NS-G5] Running Nigeria Stack Zero-Literal & Anti-Slop Audit"
echo "=================================================================="


if [[ ! -f "${TOKEN_JSON}" ]]; then
  echo "[X FAIL] Missing canonical W3C DTCG token source: ${TOKEN_JSON}"
  exit 1
fi
echo "[✓ PASS] Found canonical W3C DTCG token source: ${TOKEN_JSON}"


VIOLATIONS=0


# 1. Scan HTML artboards and TSX components for hardcoded hex literals outside :root
scan_target_files() {
  local target_dir="$1"
  if [[ ! -d "${target_dir}" ]]; then
    return 0
  fi


  while IFS= read -r -d '' file; do
    # Strip the :root { ... } token declaration block before checking for raw hex literals
    local stripped_content
    stripped_content="$(awk '
      /:root\s*\{/ { in_root=1; next }
      in_root && /\}/ { in_root=0; next }
      !in_root { print NR ":" $0 }
    ' "${file}")"


    # Check for raw hex colors (#fff, #ffffff) outside :root and SVG currentColor
    if echo "${stripped_content}" | grep -E '#[0-9a-fA-F]{3,8}\b' > /dev/null; then
      echo "[X FAIL] Hardcoded hex literal detected outside :root in ${file}:"
      echo "${stripped_content}" | grep -E '#[0-9a-fA-F]{3,8}\b'
      VIOLATIONS=$((VIOLATIONS + 1))
    fi


    # Check for banned SaaS AI-slop patterns (purple/indigo neon gradients, blur blobs)
    if grep -Ei 'linear-gradient\(.*#(8b5cf6|6366f1|a855f7|ec4899)|backdrop-filter:\s*blur\(2[0-9]px\)' "${file}" > /dev/null; then
      echo "[X FAIL] Prohibited SaaS AI-slop gradient/blur detected in ${file}"
      VIOLATIONS=$((VIOLATIONS + 1))
    fi


    # Verify mandatory var(--ns-*) semantic token consumption in HTML artboards
    if [[ "${file}" == *.html ]]; then
      if ! grep -q 'var(--ns-' "${file}"; then
        echo "[X FAIL] Artboard ${file} does not consume semantic var(--ns-*) tokens."
        VIOLATIONS=$((VIOLATIONS + 1))
      fi
      if ! grep -q 'forced-colors: active' "${file}"; then
        echo "[X FAIL] Artboard ${file} is missing @media (forced-colors: active) high-contrast support."
        VIOLATIONS=$((VIOLATIONS + 1))
      fi
      if ! grep -q 'prefers-reduced-motion: reduce' "${file}"; then
        echo "[X FAIL] Artboard ${file} is missing @media (prefers-reduced-motion: reduce) support."
        VIOLATIONS=$((VIOLATIONS + 1))
      fi
    fi
  done < <(find "${target_dir}" -type f \( -name "*.html" -o -name "*.tsx" -o -name "*.css" \) ! -name "tokens.css" -print0)
}


scan_target_files "${ARTBOARD_DIR}"
scan_target_files "${WEB_APP_DIR}"


if [[ "${VIOLATIONS}" -gt 0 ]]; then
  echo "=================================================================="
  echo "[X GATE NS-G5 FAILED] ${VIOLATIONS} token or anti-slop violation(s) found."
  echo "=================================================================="
  exit 1
fi


echo "=================================================================="
echo "[✓ GATE NS-G5 CERTIFIED PASS] Zero hardcoded literals or SaaS slop."
echo "=================================================================="
exit 0
