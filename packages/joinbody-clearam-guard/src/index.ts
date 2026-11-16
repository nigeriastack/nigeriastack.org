/**
 * @package @nigeriastack/clearam-guard
 * @license Apache-2.0 OR MIT
 * @normative NS-RFC-006 (ClearAm NDPA 2023 Consent Envelopes & <60s Revocation Gate)
 */

export type ApprovedPurposeCode =
  | "FIN-MSME-CREDIT-UNDERWRITING"
  | "LAW-LITIGATION-CLEARANCE"
  | "HLTH-PATIENT-RECORD-TRANSFER"
  | "EDU-DEGREE-VERIFICATION"
  | "AGRI-FARM-INPUT-FINANCING"
  | "LGA-INDIGENE-AND-VITAL-ATTESTATION";

export interface ClearAmConsentEnvelope {
  consentId: string;
  dataPrincipal: {
    identifierType: "NIN" | "BVN" | "RC_NUMBER" | "TIN" | "SCN" | "NHIA_ID";
    saltedIdentityHashSha256: string;
  };
  lawfulBasisAndPurpose: {
    lawfulBasis:
      | "EXPLICIT_DATA_SUBJECT_CONSENT"
      | "STATUTORY_PUBLIC_MANDATE"
      | "OPEN_COURT_PUBLIC_INTEREST"
      | "CONTRACTUAL_PERFORMANCE";
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
  errorCode?:
    | "CLEARAM_INVALID_ULID"
    | "CLEARAM_CLEARTEXT_PII_PROHIBITED"
    | "CLEARAM_ARTIFACT_EXPIRED"
    | "CLEARAM_ARTIFACT_REVOKED"
    | "CLEARAM_SCOPE_NOT_PERMITTED";
  zeroDatabaseQueriesExecuted: boolean;
}

const CLM_ULID_REGEX = /^clm_[0-9A-HJKMNP-TV-Z]{26}$/;
const SHA256_HEX_REGEX = /^[a-f0-9]{64}$/;

export function validateClearAmEnvelope(params: {
  envelope: ClearAmConsentEnvelope;
  requiredScope: string;
  revokedConsentIds: ReadonlySet<string>;
  nowUtcIso?: string;
}): ClearAmValidationResult {
  const { envelope, requiredScope, revokedConsentIds } = params;
  if (!CLM_ULID_REGEX.test(envelope.consentId)) {
    return {
      allowed: false,
      httpStatus: 400,
      errorCode: "CLEARAM_INVALID_ULID",
      zeroDatabaseQueriesExecuted: true,
    };
  }
  if (!SHA256_HEX_REGEX.test(envelope.dataPrincipal.saltedIdentityHashSha256)) {
    return {
      allowed: false,
      httpStatus: 400,
      errorCode: "CLEARAM_CLEARTEXT_PII_PROHIBITED",
      zeroDatabaseQueriesExecuted: true,
    };
  }
  if (revokedConsentIds.has(envelope.consentId)) {
    return {
      allowed: false,
      httpStatus: 403,
      errorCode: "CLEARAM_ARTIFACT_REVOKED",
      zeroDatabaseQueriesExecuted: true,
    };
  }
  const nowMs = Date.parse(params.nowUtcIso ?? new Date().toISOString());
  const expiryMs = Date.parse(envelope.temporalBoundsAndExpiry.validUntilUtc);
  if (Number.isNaN(expiryMs) || expiryMs < nowMs) {
    return {
      allowed: false,
      httpStatus: 403,
      errorCode: "CLEARAM_ARTIFACT_EXPIRED",
      zeroDatabaseQueriesExecuted: true,
    };
  }
  if (!envelope.dataProvidersAndScopes.permittedScopes.includes(requiredScope)) {
    return {
      allowed: false,
      httpStatus: 403,
      errorCode: "CLEARAM_SCOPE_NOT_PERMITTED",
      zeroDatabaseQueriesExecuted: true,
    };
  }
  return {
    allowed: true,
    httpStatus: 200,
    zeroDatabaseQueriesExecuted: false,
  };
}
