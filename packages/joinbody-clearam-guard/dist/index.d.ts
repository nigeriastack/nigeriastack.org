/**
 * @package @nigeriastack/clearam-guard
 * @license Apache-2.0 OR MIT
 * @normative NS-RFC-006 (ClearAm NDPA 2023 Consent Envelopes & <60s Revocation Gate)
 */
export type ApprovedPurposeCode = "FIN-MSME-CREDIT-UNDERWRITING" | "LAW-LITIGATION-CLEARANCE" | "HLTH-PATIENT-RECORD-TRANSFER" | "EDU-DEGREE-VERIFICATION" | "AGRI-FARM-INPUT-FINANCING" | "LGA-INDIGENE-AND-VITAL-ATTESTATION";
export interface ClearAmConsentEnvelope {
    consentId: string;
    dataPrincipal: {
        identifierType: "NIN" | "BVN" | "RC_NUMBER" | "TIN" | "SCN" | "NHIA_ID";
        saltedIdentityHashSha256: string;
    };
    lawfulBasisAndPurpose: {
        lawfulBasis: "EXPLICIT_DATA_SUBJECT_CONSENT" | "STATUTORY_PUBLIC_MANDATE" | "OPEN_COURT_PUBLIC_INTEREST" | "CONTRACTUAL_PERFORMANCE";
        purposeCode: ApprovedPurposeCode;
    };
    dataProvidersAndScopes: {
        providerCategory: string;
        permittedScopes: string[];
    };
    temporalBoundsAndExpiry: {
        issuedAtUtc: string;
        validUntilUtc: string;
        maxRetentionDays: number;
        maxQueryFrequency: number;
    };
}
export interface ClearAmValidationResult {
    allowed: boolean;
    httpStatus: 200 | 400 | 403;
    errorCode?: "CLEARAM_INVALID_ULID" | "CLEARAM_CLEARTEXT_PII_PROHIBITED" | "CLEARAM_ARTIFACT_EXPIRED" | "CLEARAM_ARTIFACT_REVOKED" | "CLEARAM_SCOPE_NOT_PERMITTED";
    zeroDatabaseQueriesExecuted: boolean;
}
export declare function validateClearAmEnvelope(params: {
    envelope: ClearAmConsentEnvelope;
    requiredScope: string;
    revokedConsentIds: ReadonlySet<string>;
    nowUtcIso?: string;
}): ClearAmValidationResult;
