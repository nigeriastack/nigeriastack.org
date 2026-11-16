import { describe, it, expect } from "vitest";
import { handleNetworkTimeoutAfterTransmission, validateSafeRetryAttempt } from "../src/index.js";

describe("@nigeriastack/confluence-transport (NS-RFC-002 & NS-RFC-003 / ITB-01)", () => {
  it("transitions post-transmission timeout to UNKNOWN_TIMEOUT and blocks new-reference retry with HTTP 409", () => {
    const timedOut = handleNetworkTimeoutAfterTransmission({
      operationId: "cop_01JBM8K9P2Q4R6S8T0V2W4X700",
      idempotencyKey: "IDEMP-NG-99412",
      state: "INITIATED",
      updatedAtUtc: "2026-11-16T00:00:00Z",
    });
    expect(timedOut.state).toBe("UNKNOWN_TIMEOUT");

    const unsafeRetry = validateSafeRetryAttempt({
      existingOperation: timedOut,
      retryIdempotencyKey: "IDEMP-NG-99413",
    });
    expect(unsafeRetry.allowed).toBe(false);
    expect(unsafeRetry.httpStatus).toBe(409);
    expect(unsafeRetry.errorCode).toBe("UNRESOLVED_OPERATION_LOCK");
  });
});
