-- File: apps/web/migrations/0001_ngstack_d1_fts5_schema.sql
-- Governing Card: NS-KB-20C / NS-KB-21
-- Target Runtime: Cloudflare D1 (SQLite 3.45+ with FTS5 & Strict Tables)

PRAGMA foreign_keys = ON;

-- 1. Normative RFC Registry (NS-RFC-001 to NS-RFC-014)
CREATE TABLE IF NOT EXISTS normative_rfcs (
  rfc_id TEXT PRIMARY KEY CHECK (rfc_id GLOB 'NS-RFC-[0-9][0-9][0-9]'),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  working_group TEXT NOT NULL CHECK (working_group IN ('WG-01', 'WG-02', 'WG-03', 'WG-04', 'WG-05', 'WG-06')),
  status TEXT NOT NULL CHECK (status IN ('RATIFIED_NORMATIVE', 'DRAFT_STANDARD', 'PUBLIC_CONSULTATION')),
  hourglass_layer TEXT NOT NULL,
  statutory_anchors_json TEXT NOT NULL,
  summary_civic TEXT NOT NULL,
  full_markdown_body TEXT NOT NULL,
  openapi_contract_path TEXT,
  json_schema_uri TEXT,
  sha256_digest TEXT NOT NULL,
  updated_at_utc TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
) STRICT;

-- 2. Master 32-Industry Capability & 8-Mechanism Gap Ledger (IND-01 to IND-32)
CREATE TABLE IF NOT EXISTS industry_capability_ledger (
  industry_id TEXT PRIMARY KEY CHECK (industry_id GLOB 'IND-[0-9][0-9]'),
  macro_sector TEXT NOT NULL,
  industry_name TEXT NOT NULL,
  civic_bottleneck_summary TEXT NOT NULL,
  primary_gap_mechanisms_json TEXT NOT NULL,
  building_blocks_json TEXT NOT NULL,
  protocols_json TEXT NOT NULL,
  evidence_confidence TEXT NOT NULL CHECK (evidence_confidence IN ('VERIFIED', 'CORROBORATED', 'INFERRED', 'UNRESOLVED')),
  documented_incumbents_json TEXT NOT NULL,
  statutory_regulators_json TEXT NOT NULL
) STRICT;

-- 3. 36 States + FCT Sub-National Readiness Matrix (37 Jurisdictions x 8 Dimensions = 296 Cells)
CREATE TABLE IF NOT EXISTS subnational_state_atlas (
  state_code TEXT PRIMARY KEY CHECK (length(state_code) = 2),
  state_name TEXT NOT NULL UNIQUE,
  capital_city TEXT NOT NULL,
  geopolitical_zone TEXT NOT NULL CHECK (geopolitical_zone IN ('North-Central', 'North-East', 'North-West', 'South-East', 'South-South', 'South-West')),
  lga_count INTEGER NOT NULL CHECK (lga_count >= 6 AND lga_count <= 44),
  judiciary_status TEXT NOT NULL CHECK (judiciary_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  land_registry_status TEXT NOT NULL CHECK (land_registry_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  irs_treasury_status TEXT NOT NULL CHECK (irs_treasury_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  health_shia_status TEXT NOT NULL CHECK (health_shia_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  crvs_lga_status TEXT NOT NULL CHECK (crvs_lga_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  open_contracting_status TEXT NOT NULL CHECK (open_contracting_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  agri_extension_status TEXT NOT NULL CHECK (agri_extension_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  fiber_row_hosting_status TEXT NOT NULL CHECK (fiber_row_hosting_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  primary_evidence_links_json TEXT NOT NULL,
  last_verified_utc TEXT NOT NULL
) STRICT;

-- 4. 774 Constitutional LGAs & 6 FCT Area Councils Registry (SC/CV/343/2024 Direct Treasury Pass-Through)
CREATE TABLE IF NOT EXISTS constitutional_lga_774_registry (
  lga_code TEXT PRIMARY KEY,
  state_code TEXT NOT NULL REFERENCES subnational_state_atlas(state_code),
  lga_name TEXT NOT NULL,
  constitutional_schedule_ref TEXT NOT NULL DEFAULT '1999 CFRN First Schedule Part I/II & Fourth Schedule',
  sc_cv_343_2024_direct_treasury_status TEXT NOT NULL CHECK (sc_cv_343_2024_direct_treasury_status IN ('DIRECT_TSA_CRF_ACTIVE', 'TRANSITION_ENROLLED', 'PAPER_CASH_BOUND', 'NOT_ASSESSED')),
  kioskbase_offline_node_status TEXT NOT NULL CHECK (kioskbase_offline_node_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  active_lga_modules_json TEXT NOT NULL
) STRICT;

-- 5. 14 Standardized Municipal Service Modules (LGA-01 to LGA-14)
CREATE TABLE IF NOT EXISTS lga_service_modules_14 (
  module_id TEXT PRIMARY KEY CHECK (module_id GLOB 'LGA-[0-9][0-9]'),
  route_slug TEXT NOT NULL UNIQUE,
  civic_service_name TEXT NOT NULL,
  protocol_tag TEXT NOT NULL,
  fourth_schedule_function TEXT NOT NULL,
  target_persona_clusters_json TEXT NOT NULL,
  failure_mechanisms_resolved_json TEXT NOT NULL,
  kioskbase_offline_capable INTEGER NOT NULL CHECK (kioskbase_offline_capable IN (0, 1)),
  splitdirect_zero_escrow_enforced INTEGER NOT NULL CHECK (splitdirect_zero_escrow_enforced = 1),
  json_schema_pointer TEXT NOT NULL
) STRICT;

-- 6. Daily Cryptographic Merkle Audit Log (Test 03: Audit & Zero-Escrow Verification)
CREATE TABLE IF NOT EXISTS daily_merkle_audit_roots (
  epoch_date TEXT PRIMARY KEY,
  merkle_root_sha256 TEXT NOT NULL,
  specification_commit_sha TEXT NOT NULL,
  verified_zero_escrow_invariant INTEGER NOT NULL CHECK (verified_zero_escrow_invariant = 1),
  ed25519_witness_signatures_json TEXT NOT NULL,
  published_at_utc TEXT NOT NULL
) STRICT;

-- 7. Unified FTS5 Full-Text Search Virtual Table (Sub-15ms Edge Querying)
CREATE VIRTUAL TABLE IF NOT EXISTS ngstack_global_search_fts USING fts5(
  entity_type,
  entity_id,
  canonical_url,
  title_civic,
  body_searchable,
  statutory_tags,
  tokenize = 'porter unicode61 remove_diacritics 2'
);
