# **3\. NS-RFC-003: Deterministic Workflow State Machine & Safe Same-Reference Retry**

* **Status:** CANDIDATE STANDARD (Stage 3\)  
* **Working Group:** WG-01  
* **Target Gap Mechanisms:** `MECH-03` (Semantic Gap), `MECH-04` (Transaction Gap), `MECH-06` (Operational Continuity)

## **3.1 The 6 Canonical Operation States**

To eliminate double-debiting on payment transfers (`IND-01`), duplicate tax filings (`IND-05`), and ambiguous registry submissions (`IND-21`), every Confluence adapter MUST implement this exact 6-state finite state machine:

1. `INITIATED`: Request validated against schema; `cop_` ULID assigned; persisted to local durable log.  
2. `ACCEPTED_PENDING`: Upstream provider acknowledged receipt (`HTTP 202`), final business outcome pending.  
3. `UNKNOWN_TIMEOUT`: Network timeout, HTTP 502/504, or lost connection occurred *after* payload transmission. **Normative Rule:** An `UNKNOWN_TIMEOUT` state MUST NEVER be coerced automatically to `FAILED_TERMINAL`.  
4. `RESOLVED_SUCCESS`: Verified terminal success accompanied by a retained `SureEvidence` receipt digest.  
5. `RESOLVED_REVERSED`: Upstream operation initially succeeded or pended but was subsequently reversed/refunded; linked to reversal evidence.  
6. `FAILED_TERMINAL`: Upstream provider explicitly rejected the request prior to execution, or reconciliation proved zero execution occurred.

## **3.2 Safe Same-Reference Retry Invariant**

* While an operation is in `ACCEPTED_PENDING` or `UNKNOWN_TIMEOUT`, a retry MUST reuse the original `customer_reference` and `X-NgStack-Idempotency-Key`.  
* Generating a new provider reference or failing over to a second provider while the first operation remains in `UNKNOWN_TIMEOUT` is STRICTLY PROHIBITED (`HTTP 409 UNRESOLVED_OPERATION_LOCK`).
