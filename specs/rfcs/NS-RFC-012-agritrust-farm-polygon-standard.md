# **3\. NS-RFC-012: `AgriTrust` Smallholder Farm Geopolygon & Negotiable Warehouse Receipt Standard**

* **Status:** CANDIDATE STANDARD (Stage 3\)  
* **Working Group:** WG-04  
* **Namespace URI:** `urn:ngstack:agritrust:v2026`  
* **Statutory Anchor:** SEC Rules on Commodities Exchanges & Warehouse Receipts; FMARD National Farmer Registry; Land Use Act 1978 (Customary & Statutory Occupancy).  
* **Target Gap Mechanisms:** `MECH-02` (Rural Coverage Gap), `MECH-05` (Collateral Provenance Gap), `MECH-06` (Offline Continuity Gap)

## **3.1 Offline-Capturable GeoJSON Farm Polygons (`IND-15` & `IND-17`)**

1. Every smallholder farm boundary registered by an extension worker or cooperative MUST be encoded as a closed GeoJSON `Polygon` (WGS84 `EPSG:4326`) with minimum 4 vertex coordinates, captured offline via `KioskBase` (`kbd_` ULID) and linked to a salted hash of the farmer's `NIN` and `LandGuard` 3×3m grid code.  
2. **Anti-Overlap Cadastral Check:** Before issuing an input-financing or warehouse-receipt credential, the state/LGA node MUST verify zero polygon intersection against conflicting claims or active High Court / Customary Court *lis pendens* encumbrances.  
3. **Negotiable Electronic Warehouse Receipt (`e-WR`):** Certified commodities warehouses (e.g., AFEX, NCX, or state grain silos) seal Assay & Weight certificates with a `SureEvidence` (`s84_` ULID) hardware key to supply provenance for collateral review. A lender must separately establish the applicable conditions for lien creation, registration and perfection.

---
