import { describe, it, expect } from "vitest";
import { evaluateClockSyncAndQuarantine } from "../src/index.js";

describe("@nigeriastack/kioskbase-crdt (NS-RFC-004 / ITB-03)", () => {
  it("flags >300s hardware clock drift as DEGRADED_LOCAL_HLC and quarantines matrimonial dockets", () => {
    const res = evaluateClockSyncAndQuarantine({
      delta: {
        deltaId: "kbd_01JBM8K9P2Q4R6S8T0V2W4X722",
        recordId: "REC-01",
        jurisdictionCode: "KE-LGA-06",
        hlcTimestamp: "1763251200000:0001:0123456789abcdef",
        deviceClockEpochMs: 1763251200000 + 420_000,
        visibilityTier: "PUBLIC_OPEN_COMMONS",
        caseOrRecordCategory: "CIVIL_COMMERCIAL",
        payload: {},
      },
      referenceNtpOrGpsEpochMs: 1763251200000,
    });
    expect(res.clockSyncStatus).toBe("DEGRADED_LOCAL_HLC");
    expect(res.allowPublicOutboxSync).toBe(false);
    expect(res.quarantineReason).toBe("CLOCK_DRIFT_STAGING_HOLD");
  });
});
