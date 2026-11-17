# **2\. NS-RFC-002: Confluence Gateway Signed Asynchronous Transport Protocol (`Junction`)**

* **Status:** CANDIDATE STANDARD (Stage 3\)  
* **Working Group:** WG-01  
* **Namespace URI:** `urn:ngstack:confluence:v2026`  
* **Target Gap Mechanisms:** `MECH-03` (Semantic Gap), `MECH-04` (Transaction Gap)

## **2.1 Asynchronous Request / Callback Pairing**

Because Nigerian inter-agency, banking, customs, and registry workflows frequently span seconds to hours across intermittent links, synchronous blocking HTTP calls MUST NOT be required for state-mutating operations. Every Confluence operation SHALL implement paired endpoints:

* **Request Action:** `POST /v1/{domain}/{action}` \-\> Returns immediate `HTTP 202 Accepted` with a deterministic `Confluence` Operation ID (`cop_` \+ 26-char ULID).  
* **Asynchronous Callback:** `POST /v1/{domain}/on_{action}` \-\> Delivered to the caller's registered webhook URI with an Ed25519 cryptographic signature.

## **2.2 Mandatory Cryptographic HTTP Headers**

Every request and `/on_*` webhook callback MUST carry the following HTTP headers:

* `X-NgStack-Operation-Id`: `cop_[0-9A-HJKMNP-TV-Z]{26}`  
* `X-NgStack-Idempotency-Key`: Client-generated reference locked to the operation lifecycle.  
* `X-NgStack-Timestamp-Utc`: ISO-8601 UTC timestamp (receivers MUST reject payloads with \> 300s skew unless flagged `DEGRADED_LOCAL_HLC` under `NS-RFC-004`).  
* `X-NgStack-Signature-Ed25519`: Base64URL-encoded Ed25519 signature over `CanonicalJSON(unsigned headers + body)`.  
* `X-NgStack-Key-Id`: URI resolving the sender's pinned public key (`urn:ngstack:pki:{participant_slug}:{key_ulid}` or decentralized `did:web` \[`https://{domain}/.well-known/ngstack-keys.json#{key_ulid}`\]).

The signature input excludes the signature header itself. Interoperable signing also requires an agreed canonicalization profile, signed field set and key resolution policy. This draft leaves the transport signing profile open pending published test vectors.
