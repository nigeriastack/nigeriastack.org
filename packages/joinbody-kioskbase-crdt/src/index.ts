/**
 * @package @nigeriastack/kioskbase-crdt
 * @license Apache-2.0 OR MIT
 * @normative NS-RFC-004 (KioskBase Offline SQLite WASM & HLC-CRDT Sync Kernel)
 */

export type VisibilityTier = "PUBLIC_OPEN_COMMONS" | "INSTITUTIONAL_CONSENTED" | "INTERNAL_RESTRICTED_NDPA";
export type ClockSyncStatus = "NTP_GPS_VERIFIED" | "DEGRADED_LOCAL_HLC";

export interface KioskBaseCrdtDelta<T = Record<string, unknown>> {
  deltaId: string;
  recordId: string;
  jurisdictionCode: string;
  hlcTimestamp: string;
  deviceClockEpochMs: number;
  visibilityTier: VisibilityTier;
  caseOrRecordCategory: string;
  payload: T;
}

const RESTRICTED_MATRIMONIAL_OR_MINOR_REGEX = /^(HD\/|WD\/|JUV\/|ADOPT\/|MINOR_)/i;
const MAX_CLOCK_DRIFT_MS = 300_000;

export function evaluateClockSyncAndQuarantine(params: {
  delta: KioskBaseCrdtDelta;
  referenceNtpOrGpsEpochMs: number;
}): {
  clockSyncStatus: ClockSyncStatus;
  driftSeconds: number;
  allowPublicOutboxSync: boolean;
  quarantineReason?: "NDPA_S30_RESTRICTED_RECORD_QUARANTINE" | "CLOCK_DRIFT_STAGING_HOLD";
} {
  const driftMs = Math.abs(params.delta.deviceClockEpochMs - params.referenceNtpOrGpsEpochMs);
  const driftSeconds = Math.round(driftMs / 1000);
  const clockSyncStatus: ClockSyncStatus =
    driftMs > MAX_CLOCK_DRIFT_MS ? "DEGRADED_LOCAL_HLC" : "NTP_GPS_VERIFIED";

  if (
    params.delta.visibilityTier === "INTERNAL_RESTRICTED_NDPA" ||
    RESTRICTED_MATRIMONIAL_OR_MINOR_REGEX.test(params.delta.caseOrRecordCategory)
  ) {
    return {
      clockSyncStatus,
      driftSeconds,
      allowPublicOutboxSync: false,
      quarantineReason: "NDPA_S30_RESTRICTED_RECORD_QUARANTINE",
    };
  }

  return {
    clockSyncStatus,
    driftSeconds,
    allowPublicOutboxSync: clockSyncStatus === "NTP_GPS_VERIFIED",
    quarantineReason: clockSyncStatus === "DEGRADED_LOCAL_HLC" ? "CLOCK_DRIFT_STAGING_HOLD" : undefined,
  };
}
