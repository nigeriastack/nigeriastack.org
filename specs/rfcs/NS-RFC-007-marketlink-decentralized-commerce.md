# **2\. NS-RFC-007: OpenMarket (`MarketLink`) Decentralized Commerce, Catalog & Haulage Protocol**

* **Status:** CANDIDATE STANDARD (Stage 3\)  
* **Working Group:** WG-04 (OpenMarket Commerce, Logistics, Trade & Agrarian Corridors)  
* **Namespace URI:** `urn:ngstack:marketlink:v2026`  
* **Statutory Anchor:** Federal Competition and Consumer Protection Act (FCCPA) 2018; FMCIDE Open Commerce Guidelines.  
* **Target Gap Mechanisms:** `MECH-03` (Semantic Gap), `MECH-04` (Transaction Gap), `MECH-07` (Commercial/Commission Gap)

## **2.1 Unbundling Buyer, Seller, and Logistics Networks**

To prevent 20–30% aggregator commissions from excluding Nigerian MSMEs, independent kitchens (`IND-23`), retail merchants (`IND-11`), and interstate haulage fleets (IND-09), MarketLink decouples commerce into three independent, interoperable participant roles over Confluence asynchronous pairs:

1. **Buyer-Finder Node (`BFN`):** Consumer or B2B procurement interface broadcasting `/discover` queries.  
2. **Merchant-Catalog Node (`MCN`):** Storefront, farm cooperative, or kitchen responding via `/on_discover`, `/quote`, `/on_quote`, `/order`, and `/on_order`.  
3. **Haulage & Fulfillment Node (`HFN`):** Courier or interstate truck operator (e.g., Shipbubble, Bob Go, Kobo360, or independent motor-park fleets) executing `/dispatch`, `/on_dispatch`, and `/proof_of_delivery` (`SureEvidence` geo-stamped s. 84 receipt).

## **2.2 Anti-Monopoly & Reputation Portability Invariants**

* No `MarketLink` registry or gateway MAY rank merchant catalog responses by paid sponsorship (`Gate NS-G1`).  
* Every completed order fulfillment emits a dual-signed `SureEvidence` completion receipt that the merchant or driver owns and can port across any participating network.
