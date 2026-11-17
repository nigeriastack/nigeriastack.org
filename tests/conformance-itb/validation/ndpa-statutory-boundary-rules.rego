package nigeriastack.clearam.guard
import rego.v1

default allow_request := false

# Structural validation only. Signature validity and legal authority require
# separate verified checks and are not implied by this policy result.
valid_shape if {
  is_object(input)
  is_string(input.current_utc_timestamp)
  is_string(input.clearam_envelope.temporalBoundsAndExpiry.validUntilUtc)
  is_string(input.record.visibilityTier)
  is_number(input.payment_split.platformEscrowAmountKobo)
  is_number(input.payment_split.stateIntermediaryEscrowKobo)
  is_boolean(input.caller.isAutonomousMcpAgent)
  is_boolean(input.operation.isStateMutating)
}

deny_reason contains "INVALID_OR_INCOMPLETE_INPUT" if { not valid_shape }

deny_reason contains "HTTP_403_CLEARAM_ARTIFACT_EXPIRED" if {
  time.parse_rfc3339_ns(input.clearam_envelope.temporalBoundsAndExpiry.validUntilUtc) <= time.parse_rfc3339_ns(input.current_utc_timestamp)
}

deny_reason contains "HTTP_403_NDPA_RESTRICTED_QUARANTINE_LOCK" if {
  input.record.visibilityTier == "INTERNAL_RESTRICTED_NDPA"
}

deny_reason contains "HTTP_422_TREASURY_PASSTHROUGH_INVARIANCE_BREACH" if {
  input.payment_split.platformEscrowAmountKobo != 0
}

deny_reason contains "HTTP_422_SJLGA_INTERMEDIARY_ESCROW_PROHIBITED" if {
  input.payment_split.stateIntermediaryEscrowKobo != 0
}

# Until verified signature input is defined, deny autonomous state mutations.
deny_reason contains "HUMAN_SIGNATURE_VERIFICATION_NOT_IMPLEMENTED" if {
  input.caller.isAutonomousMcpAgent
  input.operation.isStateMutating
}

allow_request if {
  valid_shape
  time.parse_rfc3339_ns(input.clearam_envelope.temporalBoundsAndExpiry.validUntilUtc) > time.parse_rfc3339_ns(input.current_utc_timestamp)
  input.record.visibilityTier == "PUBLIC"
  count(deny_reason) == 0
}
