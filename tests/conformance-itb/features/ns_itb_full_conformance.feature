Feature: Nigeria Stack Whole-of-Economy Interoperability Test Bed (ITB) Conformance Suite
  As a Nigerian Ministry, State Judiciary, 774-LGA Council, Commercial Bank, or Technical Service Provider
  I must pass all deterministic protocol, privacy, evidentiary, offline-continuity, and fiscal-invariance assertions
  So that my system can interoperate across the Nigeria Stack without surrendering statutory authority or evidentiary integrity


  Scenario: ITB-01 Confluence Asynchronous Timeout Preserves UNKNOWN_TIMEOUT and Blocks Double-Debit Retry (NS-RFC-003)
    Given an initiated payment or registry operation "cop_01JBM8K9P2Q4R6S8T0V2W4X700" with idempotency key "IDEMP-NG-99412"
    When the upstream provider connection drops after request transmission without returning an HTTP response
    Then the local operation state machine MUST transition to "UNKNOWN_TIMEOUT" and MUST NOT transition to "FAILED_TERMINAL"
    And when the client attempts a retry using a new reference "IDEMP-NG-99413" while "cop_01JBM8K9P2Q4R6S8T0V2W4X700" is in "UNKNOWN_TIMEOUT"
    Then the adapter MUST reject the duplicate execution with HTTP 409 "UNRESOLVED_OPERATION_LOCK"


  Scenario: ITB-02 ClearAm Expired Consent Artifact Triggers Immediate HTTP 403 Without Payload Introspection (NS-RFC-006 / RED-CNT-02)
    Given a signed ClearAm consent envelope "clm_01JBM8K9P2Q4R6S8T0V2W4X6Z9" with purposeCode "FIN-MSME-CREDIT-UNDERWRITING"
    And the envelope validUntilUtc is "2026-11-10T00:00:00Z" which is earlier than the current system UTC clock
    When an autonomous agent or bank FIU invokes the data provider endpoint with "clm_01JBM8K9P2Q4R6S8T0V2W4X6Z9"
    Then the gateway MUST abort at the perimeter with HTTP 403 "CLEARAM_ARTIFACT_EXPIRED"
    And the downstream database query counter MUST equal 0


  Scenario: ITB-03 SureEvidence Section 84 Credential Rejects Single-Byte Payload Tampering and Clock Drift > 300s (NS-RFC-004 & NS-RFC-005)
    Given a Registrar-sealed SureEvidence credential "s84_01JBM8K9P2Q4R6S8T0V2W4X6Y8" signed with FIDO2 Ed25519 key "urn:ngstack:pki:lagos-hc:key01"
    When 1 byte of the underlying Certified True Copy or LGA IndigeneProof PDF is modified in transit
    Then offline QR verification MUST fail with "S84_PAYLOAD_DIGEST_MISMATCH"
    And when an offline KioskBase node submits a delta "kbd_01JBM8K9P2Q4R6S8T0V2W4X722" with hardware clock drift of 420 seconds
    Then the sync coordinator MUST flag the record "DEGRADED_LOCAL_HLC" and block final enrolled sealing until NTP/GPS resynchronization


  Scenario: ITB-04 SplitDirect Enforces Zero Platform or SJLGA Escrow for Courts and 774 LGAs (NS-RFC-009 & NS-RFC-014)
    Given a state court filing or 774-LGA MarketCollect payment payload for LGA "LA-LGA-01"
    When the payment split array specifies platformEscrowAmountKobo greater than 0 or stateIntermediaryEscrowKobo greater than 0
    Then the SplitDirect validator MUST reject the transaction with HTTP 422 "TREASURY_PASSTHROUGH_INVARIANCE_BREACH"
    And 100% of the statutory principal sum MUST route directly to the verified Judiciary CRF or Direct LGA Treasury Account


  Scenario: ITB-05 GivePower Agent Sandbox Blocks Un-Countersigned Mutation and Protects x402 Two-Phase Escrow (NS-RFC-008 / RED-CNT-03)
    Given an autonomous MCP client connected with defaultExecutionMode "READ_ONLY_DEFAULT"
    When the agent invokes a state-mutating tool without a valid "humanCountersignatureEd25519" header
    Then the MCP gateway MUST reject the call with HTTP 403 "NDPA_S37_HUMAN_COUNTERSIGNATURE_REQUIRED"
    And when a valid x402 micro-settlement challenge is locked in "ESCROW_LOCKED" but the downstream provider returns HTTP 503
    Then the escrow verifier MUST automatically revert the micro-settlement to the caller wallet with zero provider payout
