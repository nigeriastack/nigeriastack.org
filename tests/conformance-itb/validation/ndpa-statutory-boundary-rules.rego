package nigeriastack.clearam.guard


import rego.v1


default allow_request := false


# 1. RED-CNT-02: Immediate rejection of expired ClearAm consent artifacts with zero payload introspection
deny_reason contains "HTTP_403_CLEARAM_ARTIFACT_EXPIRED" if {
    input.clearam_envelope.temporalBoundsAndExpiry.validUntilUtc < input.current_utc_timestamp
}


# 2. NDPA Gate 10: Block public or unconsented export of INTERNAL_RESTRICTED_NDPA records
deny_reason contains "HTTP_403_NDPA_RESTRICTED_QUARANTINE_LOCK" if {
    input.record.visibilityTier == "INTERNAL_RESTRICTED_NDPA"
}


# 3. NS-RFC-009 & NS-RFC-014 (SC/CV/343/2024): Block any private platform or SJLGA escrow of statutory revenue
deny_reason contains "HTTP_422_TREASURY_PASSTHROUGH_INVARIANCE_BREACH" if {
    input.payment_split.platformEscrowAmountKobo > 0
}


deny_reason contains "HTTP_422_SJLGA_INTERMEDIARY_ESCROW_PROHIBITED" if {
    input.payment_split.stateIntermediaryEscrowKobo > 0
}


# 4. NS-RFC-008 (NDPA s. 37): Block state-mutating MCP agent calls lacking a human Ed25519 countersignature
deny_reason contains "HTTP_403_NDPA_S37_HUMAN_COUNTERSIGNATURE_REQUIRED" if {
    input.caller.isAutonomousMcpAgent == true
    input.operation.isStateMutating == true
    not input.headers.humanCountersignatureEd25519
}


allow_request if {
    count(deny_reason) == 0
}
