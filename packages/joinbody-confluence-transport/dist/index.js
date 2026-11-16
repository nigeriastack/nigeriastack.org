/**
 * @package @nigeriastack/confluence-transport
 * @license Apache-2.0 OR MIT
 * @normative NS-RFC-002 (Confluence Signed Async Transport) & NS-RFC-003 (6-State Workflow Retry)
 */
const COP_ULID_REGEX = /^cop_[0-9A-HJKMNP-TV-Z]{26}$/;
export function handleNetworkTimeoutAfterTransmission(record) {
    if (!COP_ULID_REGEX.test(record.operationId)) {
        throw new Error("INVALID_CONFLUENCE_OPERATION_ULID");
    }
    // NS-RFC-003 Sec. 3.1: UNKNOWN_TIMEOUT MUST NEVER be coerced automatically to FAILED_TERMINAL
    return {
        ...record,
        state: "UNKNOWN_TIMEOUT",
        updatedAtUtc: new Date().toISOString(),
    };
}
export function validateSafeRetryAttempt(params) {
    const { existingOperation, retryIdempotencyKey } = params;
    if ((existingOperation.state === "UNKNOWN_TIMEOUT" || existingOperation.state === "ACCEPTED_PENDING") &&
        retryIdempotencyKey !== existingOperation.idempotencyKey) {
        return {
            allowed: false,
            httpStatus: 409,
            errorCode: "UNRESOLVED_OPERATION_LOCK",
        };
    }
    return { allowed: true, httpStatus: 202 };
}
