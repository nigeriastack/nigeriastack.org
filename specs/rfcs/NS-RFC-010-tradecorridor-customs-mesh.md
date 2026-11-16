# **1\. NS-RFC-010: TradeCorridor (`PassCargo`) Cross-Border Trade, Customs & Port Interoperability Framework**

* **Status:** CANDIDATE STANDARD (Stage 3\)  
* **Working Group:** WG-04 (OpenMarket Commerce, Logistics, Trade & Agrarian Corridors)  
* **Namespace URI:** `urn:ngstack:passcargo:v2026`  
* **Statutory Anchor:** Nigeria Customs Service (NCS) Act 2023; Nigerian Ports Authority (NPA) Act; SON Act; NAFDAC Act; ECOWAS Trade Liberalization Scheme (ETLS) Protocols.  
* **Target Gap Mechanisms:** `MECH-01` (Source-Access Gap), `MECH-03` (Semantic Gap), `MECH-04` (Transaction Gap)

## **1.1 Multi-Agency Single-Submission Event Chain**

To eliminate repetitive manual re-keying of cargo manifests across 7+ port and border agencies (`IND-10`), `PassCargo` specifies a cryptographically linked event chain over Confluence (cop\_ ULID) asynchronous pairs:

1. **`CargoManifestRegistered`:** Links the Single Goods Declaration (SGD) / NCS B'Odogwu reference with the master Bill of Lading (`BL`) SHA-256 digest.  
2. **`RegulatoryClearanceAttached`:** Appends issuer-signed `SureEvidence` (`s84_` ULID) credentials from SON (`SONCAP`), NAFDAC, Quarantine (`NAQS`), and NESREA without duplicating raw agency databases.  
3. **`TerminalExitAndWaybillToken`:** Generates an offline-verifiable 300-DPI Ed25519 QR token (`ngstack://verify/s84_{ulid}`) allowing port gates, FRSC highway patrols, and ECOWAS border posts (Seme-Krake, Illela, Jibiya, Mfum) to verify cargo clearance offline in **\< 50ms**.

---
