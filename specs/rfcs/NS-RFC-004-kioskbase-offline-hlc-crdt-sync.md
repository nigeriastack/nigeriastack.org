# **4\. NS-RFC-004: KioskBase Offline-First SQLite WASM & Hybrid Logical Clock (HLC) CRDT Sync**

* **Status:** CANDIDATE STANDARD (Stage 3\)  
* **Working Group:** WG-05 (Sub-National Registries, Health, Education & Smart Grids)  
* **Namespace URI:** `urn:ngstack:kioskbase:v2026`  
* **Target Gap Mechanisms:** `MECH-02` (Sub-National Coverage Gap), `MECH-06` (Offline Continuity Gap)

## **4.1 Client Footprint & Local Storage Invariants**

1. **Payload Budget:** Any `KioskBase`\-compliant Progressive Web App (used across 36 State Judiciaries, Magistracies, Deeds Registries, Rural PHCs, and 774 LGA `MarketCollect` kiosks) MUST ship an initial shell \< 35 KB gzipped with zero external webfont blocking when `Save-Data: on` is present.  
2. **Encrypted Local SQLite WASM:** Client nodes SHALL persist records locally in Origin-Private File System (OPFS) SQLite WASM tables with a `crdt_hlc_oplog` delta table (`kbd_` ULID).

## **4.2 Hybrid Logical Clock (HLC) Format & 300-Second Drift Rule (`RED-CNT-04`)**

* Every offline mutation MUST generate a monotonic HLC timestamp: `<physical_epoch_ms_48bit>:<logical_counter_16bit>:<node_fido2_fingerprint_16char>`.  
* **Hardware Clock Drift Disclosure (`RED-CNT-04`):** If an unpowered registry device's hardware real-time clock drifts by \> 300 seconds against cellular NTP or GPS time upon reconnection, the delta envelope MUST be tagged `clockSyncStatus: "DEGRADED_LOCAL_HLC"`. Such records MAY sync to staging queues but MUST NOT receive a final enrolled judicial or cadastral time-priority seal until NTP/GPS resynchronization is attested.  
* **Kernel Privacy Quarantine (`NDPA Gate 10`):** Local and cloud databases MUST enforce PostgreSQL 17 `FORCE ROW LEVEL SECURITY` (and client SQLite triggers) locking matrimonial (`HD/`, `WD/`), juvenile, adoption, and clinical HIV/mental-health records inside `visibility_tier = 'INTERNAL_RESTRICTED_NDPA'`. Unsealed drafts and restricted records MUST NEVER enter public sync outboxes.
