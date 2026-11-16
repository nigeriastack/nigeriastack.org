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
export declare function evaluateClockSyncAndQuarantine(params: {
    delta: KioskBaseCrdtDelta;
    referenceNtpOrGpsEpochMs: number;
}): {
    clockSyncStatus: ClockSyncStatus;
    driftSeconds: number;
    allowPublicOutboxSync: boolean;
    quarantineReason?: "NDPA_S30_RESTRICTED_RECORD_QUARANTINE" | "CLOCK_DRIFT_STAGING_HOLD";
};
