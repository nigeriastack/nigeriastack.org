# **3\. NS-RFC-008: Warrant & Mandate (`GivePower`) Autonomous Agent Delegation & MCP Safety Protocol**

* **Status:** CANDIDATE STANDARD (Stage 3\)  
* **Working Group:** WG-06 (GivePower Agentic AI Delegation, MCP Sandboxing & Conformance)  
* **Namespace URI:** `urn:ngstack:givepower:v2026`  
* **Statutory Anchor:** NDPA 2023 Section 37 (Automated Decision-Making & Human Intervention); AAIF Model Context Protocol (MCP) JSON-RPC 2.0.  
* **Target Gap Mechanisms:** `MECH-04` (Transaction Gap), `MECH-05` (Trust Gap), `MECH-08` (Implementation Gap)

## **3.1 Three Mandatory Agentic Safety Guardrails**

Every MCP server or autonomous AI agent interacting with Nigerian public or enterprise systems under GivePower (gpw\_ ULID) MUST enforce:

1. **Guardrail 1 — Read-Only Default Sandboxing:** All registered MCP tools MUST declare `"defaultExecutionMode": "READ_ONLY_DEFAULT"`. Autonomous agents MAY query public statutes, verify `SureEvidence` QR digests, or check non-mutating operation statuses (`GET /v1/mcp/operations/{cop_ulid}`), but MUST NOT execute state-mutating calls by default.  
2. **Guardrail 2 — Cryptographic Human Countersignature (`NDPA s. 37`):** Any state-mutating agent action (initiating a funds transfer, lodging a court filing, modifying a registry record, or granting consent) MUST include a non-expired `humanCountersignatureEd25519` signed by the delegating human principal's FIDO2/WebAuthn key over the exact action parameters.  
3. **Guardrail 3 — Two-Phase HTTP 402 (`x402`) Micro-Settlement Escrow (`RED-CNT-03` Invariant):**  
   * Remember: `nigeriastack.org` never processes payments; it defines the verification contract for downstream relays.  
   * When an MCP tool call requires an HTTP 402 (`x402`) sub-cent micro-settlement, the payment token MUST remain in **two-phase cryptographic escrow** (`ESCROW_LOCKED`) and MAY release to the downstream tool provider ONLY after the caller receives a schema-valid JSON-RPC 2.0 `200 OK` response carrying a valid `SureEvidence` payload hash. If the downstream provider times out or returns a `5xx` error, the escrow token automatically reverts to the caller's budget wallet.
