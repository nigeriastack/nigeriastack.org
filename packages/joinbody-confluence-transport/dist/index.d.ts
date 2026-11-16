/**
 * @package @nigeriastack/confluence-transport
 * @license Apache-2.0 OR MIT
 * @normative NS-RFC-002 (Confluence Signed Async Transport) & NS-RFC-003 (6-State Workflow Retry)
 */
export type OperationLifecycleState = "INITIATED" | "ACCEPTED_PENDING" | "UNKNOWN_TIMEOUT" | "RESOLVED_SUCCESS" | "RESOLVED_REVERSED" | "FAILED_TERMINAL";
export interface ConfluenceOperationRecord {
    operationId: string;
    idempotencyKey: string;
    state: OperationLifecycleState;
    updatedAtUtc: string;
}
export declare function handleNetworkTimeoutAfterTransmission(record: ConfluenceOperationRecord): ConfluenceOperationRecord;
export declare function validateSafeRetryAttempt(params: {
    existingOperation: ConfluenceOperationRecord;
    retryIdempotencyKey: string;
}): {
    allowed: boolean;
    httpStatus: 202 | 409;
    errorCode?: "UNRESOLVED_OPERATION_LOCK";
};
