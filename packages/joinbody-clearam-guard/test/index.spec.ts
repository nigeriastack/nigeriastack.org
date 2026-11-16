import { describe, it, expect } from "vitest";
import { validateClearAmEnvelope } from "../src/index.js";

describe("@nigeriastack/clearam-guard (NS-RFC-006 / ITB-02)", () => {
  it("immediately rejects expired consent with HTTP 403 CLEARAM_ARTIFACT_EXPIRED and 0 DB queries", () => {
    const res = validateClearAmEnvelope({
      envelope: {
        consentId: "clm_01JBM8K9P2Q4R6S8T0V2W4X6Z9",
        dataPrincipal: {
          identifierType: "BVN",
          saltedIdentityHashSha256: "b".repeat(64),
        },
        lawfulBasisAndPurpose: {
          lawfulBasis: "EXPLICIT_DATA_SUBJECT_CONSENT",
          purposeCode: "FIN-MSME-CREDIT-UNDERWRITING",
        },
        dataProvidersAndScopes: {
          providerCategory: "CBN_OPEN_BANKING_FIP",
          permittedScopes: ["CASHFLOW_SUMMARY_90D"],
        },
        temporalBoundsAndExpiry: {
          issuedAtUtc: "2026-11-01T00:00:00Z",
          validUntilUtc: "2026-11-10T00:00:00Z",
          maxRetentionDays: 30,
          maxQueryFrequency: 5,
        },
      },
      requiredScope: "CASHFLOW_SUMMARY_90D",
      revokedConsentIds: new Set(),
      nowUtcIso: "2026-11-16T00:00:00Z",
    });
    expect(res.allowed).toBe(false);
    expect(res.httpStatus).toBe(403);
    expect(res.errorCode).toBe("CLEARAM_ARTIFACT_EXPIRED");
    expect(res.zeroDatabaseQueriesExecuted).toBe(true);
  });
});
