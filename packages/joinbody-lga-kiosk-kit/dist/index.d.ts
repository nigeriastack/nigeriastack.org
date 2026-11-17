/**
 * @package @nigeriastack/lga-kiosk-kit
 * @license Apache-2.0 OR MIT
 * @normative NS-RFC-014 (774-LGA Municipal Governance Stack) & NS-RFC-009 (SplitDirect)
 */
export type LgaModuleId = "LGA-01" | "LGA-02" | "LGA-03" | "LGA-04" | "LGA-05" | "LGA-06" | "LGA-07" | "LGA-08" | "LGA-09" | "LGA-10" | "LGA-11" | "LGA-12" | "LGA-13" | "LGA-14";
export interface SplitDirectLgaTreasuryProof {
    statutoryAmountKobo: number;
    directLgaTreasuryAccountRef: string;
    platformEscrowAmountKobo: number;
    stateIntermediaryEscrowKobo: number;
}
export interface LgaGovernanceServiceEnvelope {
    envelopeUlid: string;
    lgaCode: string;
    moduleId: LgaModuleId;
    kioskBaseDeltaId: string;
    clockSyncStatus: "NTP_GPS_VERIFIED" | "DEGRADED_LOCAL_HLC";
    splitDirectTreasuryProof: SplitDirectLgaTreasuryProof;
    sureEvidenceSealId?: string;
}
export declare function validateLgaTreasuryInvariance(envelope: LgaGovernanceServiceEnvelope): {
    valid: boolean;
    httpStatus: 200 | 422;
    errorCode?: "INVALID_CONSTITUTIONAL_LGA_CODE" | "TREASURY_PASSTHROUGH_INVARIANCE_BREACH";
};
/** Illustrative menu only; the legacy function name does not identify an allocated shortcode. */
export declare function renderUssd347Menu(locale?: "en-NG" | "ha-NG" | "yo-NG" | "ig-NG" | "pcm-NG"): string;
/** Local routing plan using a caller-supplied trusted account registry; no transfer is executed. */
export declare function planDirectTreasuryRouting(envelope: LgaGovernanceServiceEnvelope, verifiedTreasuryAccounts: ReadonlyMap<string, string>): {
    valid: false;
    httpStatus: 422;
    errorCode: string;
} | {
    valid: true;
    httpStatus: 200;
    transfers: {
        accountRef: string;
        amountKobo: number;
    }[];
};
