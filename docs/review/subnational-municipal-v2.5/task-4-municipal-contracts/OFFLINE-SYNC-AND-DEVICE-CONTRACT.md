# KioskBase — Offline, Sync and Device Contracts

## Runtime architecture
### 35,000-byte initial-shell budget
#### Performance implementation
- MUST measure **the complete initial HTML/CSS/JS + service worker transfer payload** with gzip and ensure `< 35,000 bytes` (a stricter interpretation of `<35 KB` than the v2.4 document’s 35,840-byte ceiling).
- SQLite WASM, locale packs, GIS bundles and clinical data are **deferred, cached integrity-checked downloads** and must be reported separately; do not claim all required offline capability fits in a 35 KB total install.
- On a first install with zero connectivity, an uncached PWA cannot run; kiosk deployments SHOULD pre-provision signed offline assets. Report explicit cold-start and warm-offline metrics separately.
- Required responsive checks: 320, 390, 768, 1440 CSS pixels, browser zoom to 400%, text expansion >= 35%, WCAG 2.2 AA keyboard, focus, text reflow and low-vision checks. All must be measured by real browsers before claiming PASS.

## Protected storage and convergence
### SQLite WASM and OPFS
#### Isolation
- Initial capture uses encrypted device data and delegated per-tenant keys. OPFS where supported; provide IndexedDB fallback with explicit reduced guarantees.
- `tenant_key` = independently approved authority and jurisdiction identity; all row keys and sync logs include it. The client database is never a national master registry.
- Protect at rest using a well-scoped crypto design; never claim SQLite WASM alone encrypts storage.
- Public permitted aggregate search may use Cloudflare D1 FTS5 in the reference deployment, **not** private CRVS/health/court raw records. Production adopters can choose any conformant database.
- Remote sync exports record-key, independent issuer, policy version, jurisdiction, privacy partition, evidence hash, actor role, HLC metadata, and optimistic conflict marker.

## Hybrid logical clock
### Event ordering and drift
#### Stage rather than fabricate chronology
- Each mutation includes 48-bit-compatible physical epoch millis, 16-bit logical counter, immutable node ID and measured drift. HLC is for **causal ordering hints**, not proof of a legal registration time.
- Device drift greater than 300 seconds forces `DEGRADED_LOCAL_HLC` and staging until trusted-time review.
- For counter conflicts, distinct non-sensitive observation fields can merge as CRDT deltas. **Never LWW-merge statutory payments, court orders, land titles, grant revocations, licence approvals, or medical decisions**: use a guarded state machine with the authoritative issuer.
- Recover from power failure by replaying outbox idempotently, preserving `UNKNOWN_TIMEOUT` and refusing a fresh payment operation for the unresolved reference.
- Device clock reset must not retroactively alter signed proofs; retain device attestations, server received time, and trust quality.

## Offline verifier
### SureEvidence trust status
#### Verification semantics
- QR payload carries compact issuer key reference, digest and signed status. Verifier reports **signature validity**, **issuer trusted/unknown**, **revocation cache age**, **document digest comparison** and **network freshness** separately.
- Offline verification cannot guarantee current non-revocation; stale/absent status causes `UNKNOWN_FRESHNESS`, not `VALID_CURRENT`.
- 300 DPI relates to printing; benchmark `<50ms` only for a specified device and cold/warm settings; not a general guarantee.
- WebAuthn/FIDO2 is not inherently an Ed25519 key guarantee. The independently accepted signature algorithm must be supported and attested by the key issuer.

## Illustrative D1 reference database
### Public indexes only
#### D1 migration example (reference deployment, not a legal registry)
```sql
CREATE TABLE public_service_index (
  authority_ref TEXT NOT NULL,
  case_ref TEXT NOT NULL,
  council_code TEXT NOT NULL,
  module_id TEXT NOT NULL,
  public_summary TEXT NOT NULL,
  public_status TEXT NOT NULL,
  evidence_age_utc TEXT,
  PRIMARY KEY(authority_ref, case_ref)
);
CREATE VIRTUAL TABLE public_service_fts USING fts5(
  authority_ref UNINDEXED, case_ref UNINDEXED, public_summary,
  tokenize='unicode61'
);
-- This index MUST NOT receive health, juvenile, confidential court, NIN/BVN, or family records.
```
