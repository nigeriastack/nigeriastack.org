/**
 * @package @nigeriastack/clearam-guard
 * @license Apache-2.0 OR MIT
 * @normative NS-RFC-006 (ClearAm NDPA 2023 Consent Envelopes & <60s Revocation Gate)
 */
const CLM_ULID_REGEX = /^clm_[0-9A-HJKMNP-TV-Z]{26}$/;
const SHA256_HEX_REGEX = /^[a-f0-9]{64}$/;
export function validateClearAmEnvelope(params) {
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
    if (!Number.isFinite(nowMs) || !Number.isFinite(expiryMs) || expiryMs <= nowMs) {
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
/** Run the provider query only after the perimeter gate accepts the envelope. */
export async function executeClearAmQuery(params, query) {
    const validation = validateClearAmEnvelope(params);
    return validation.allowed ? { validation, result: await query() } : { validation };
}
