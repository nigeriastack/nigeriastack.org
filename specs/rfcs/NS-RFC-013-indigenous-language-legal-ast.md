# **4\. NS-RFC-013: `LawTree AST` (`StatuteProof`) Bi-Temporal Statutory Graph & 5-Locale Indigenous Legal Lexicon**

* **Status:** CANDIDATE STANDARD (Stage 3\)  
* **Working Group:** WG-02 (SureEvidence Cryptographic Trust, Legal ASTs & Admissibility)  
* **Namespace URI:** `urn:ngstack:lawtree:v2026`  
* **Statutory Anchor:** Laws of the Federation of Nigeria (LFN); Laws of the 36 States; 1999 Constitution s. 36(3)–(4); Evidence Act 2011 s. 106; OASIS LegalDocML (Akoma Ntoso 3.0).  
* **Target Gap Mechanisms:** `MECH-03` (Semantic Gap), `MECH-05` (Provenance Gap), `MECH-08` (Static-PDF Law Gap)

## **4.1 Deterministic Section URN Grammar & Bi-Temporal Versioning (`IND-21` & `IND-31`)**

1. Every Act of the National Assembly, State Law, Subsidiary Regulation (CBN/NDPC/SEC/NRS), and Court Practice Direction MUST be compiled into a bi-temporal `LawTree AST` node addressed by the canonical URN:  
   `urn:lex:ng:{jurisdiction}:act:{year}-{number}@{enacted_or_amended_date}#sec_{section_id}`  
2. Every AST node MUST carry both `valid_period` (statutory commencement to repeal/amendment date) and `sys_period` (gazette ingestion timestamp) plus a `SureEvidence` SHA-256 digest of the official Gazette PDF page and `[x0, y0, x1, y1]` normalized bounding box.

## **4.2 5-Locale Indigenous Legal & Civic Semantic Gate (`IND-27`)**

* Translations of statutory notices, court dispositions, `ClearAm` consent prompts, and 774-LGA service instructions across **`en-NG` (Nigerian English)**, **`ha-NG` (Hausa)**, **`yo-NG` (Yoruba)**, **`ig-NG` (Igbo)**, and **`pcm-NG` (Nigerian Pidgin)** MUST embed an explicit `reviewState` enum:  
  `"DRAFT_UNPUBLISHED"` \| `"LINGUISTIC_REVIEW_PASSED"` \| `"LEGAL_SEMANTIC_REVIEW_APPROVED"`.  
* **Hard Guardrail:** Any locale string with `reviewState != "LEGAL_SEMANTIC_REVIEW_APPROVED"` MUST NOT render as authoritative legal or consent guidance without a visible machine-translation disclaimer banner.

---
