package nigeriastack.clearam.guard
import rego.v1

fixture := {
  "current_utc_timestamp": "2026-11-17T08:00:00Z",
  "clearam_envelope": {"temporalBoundsAndExpiry": {"validUntilUtc": "2026-11-17T09:00:00Z"}},
  "record": {"visibilityTier": "PUBLIC"},
  "payment_split": {"platformEscrowAmountKobo": 0, "stateIntermediaryEscrowKobo": 0},
  "caller": {"isAutonomousMcpAgent": false}, "operation": {"isStateMutating": false}
}

test_valid_read if { allow_request with input as fixture }
test_missing_input_denied if { not allow_request with input as {} }
test_unknown_visibility_denied if { not allow_request with input as object.union(fixture, {"record": {"visibilityTier": "UNKNOWN"}}) }
test_expiry_boundary_denied if { not allow_request with input as object.union(fixture, {"current_utc_timestamp": "2026-11-17T09:00:00Z"}) }
test_offset_time_compared_as_instants if { not allow_request with input as object.union(fixture, {"current_utc_timestamp": "2026-11-17T10:00:00+01:00"}) }
test_invalid_timestamp_denied if { not allow_request with input as object.union(fixture, {"current_utc_timestamp": "not-a-time"}) }
test_positive_escrow_denied if { not allow_request with input as object.union(fixture, {"payment_split": {"platformEscrowAmountKobo": 1, "stateIntermediaryEscrowKobo": 0}}) }
test_negative_escrow_denied if { not allow_request with input as object.union(fixture, {"payment_split": {"platformEscrowAmountKobo": -1, "stateIntermediaryEscrowKobo": 0}}) }
test_intermediary_denied if { not allow_request with input as object.union(fixture, {"payment_split": {"platformEscrowAmountKobo": 0, "stateIntermediaryEscrowKobo": 1}}) }
test_restricted_denied if { not allow_request with input as object.union(fixture, {"record": {"visibilityTier": "INTERNAL_RESTRICTED_NDPA"}}) }
test_agent_mutation_denied_even_with_header if {
  not allow_request with input as object.union(fixture, {"caller": {"isAutonomousMcpAgent": true}, "operation": {"isStateMutating": true}, "headers": {"humanCountersignatureEd25519": "unverified"}})
}
