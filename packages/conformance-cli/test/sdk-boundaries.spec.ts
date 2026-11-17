import { describe, it, expect } from "vitest";
import { executeClearAmQuery, type ClearAmConsentEnvelope } from "@nigeriastack/clearam-guard";
import { evaluateClockSyncAndQuarantine } from "@nigeriastack/kioskbase-crdt";
import { planDirectTreasuryRouting, type LgaGovernanceServiceEnvelope } from "@nigeriastack/lga-kiosk-kit";
import { decodeBase64Url, encodeBase64Url, verifySureEvidenceOffline } from "@nigeriastack/sure-evidence-crypto";
import { ephemeralKeys, sealFixture, FIXTURE_NOW as NOW } from "../src/itb-fixtures.js";

describe("reference SDK boundaries exercised by ITB fixtures", () => {
  it("never invokes the provider callback for expired, revoked or unscoped consent", async () => {
    const envelope: ClearAmConsentEnvelope = { consentId: "clm_01JBM8K9P2Q4R6S8T0V2W4X6Z9", dataPrincipal: { identifierType: "BVN", saltedIdentityHashSha256: "b".repeat(64) }, lawfulBasisAndPurpose: { lawfulBasis: "EXPLICIT_DATA_SUBJECT_CONSENT", purposeCode: "FIN-MSME-CREDIT-UNDERWRITING" }, dataProvidersAndScopes: { providerCategory: "TEST", permittedScopes: ["SUMMARY"] }, temporalBoundsAndExpiry: { issuedAtUtc: new Date(NOW - 1_000).toISOString(), validUntilUtc: new Date(NOW).toISOString(), maxRetentionDays: 30, maxQueryFrequency: 1 } };
    let queryCounter = 0;
    const query = async () => { queryCounter++; return "fixture"; };
    const params = { envelope, requiredScope: "SUMMARY", revokedConsentIds: new Set<string>(), nowUtcIso: new Date(NOW).toISOString() };
    expect((await executeClearAmQuery(params, query)).validation.errorCode).toBe("CLEARAM_ARTIFACT_EXPIRED");
    envelope.temporalBoundsAndExpiry.validUntilUtc = new Date(NOW + 1).toISOString();
    expect((await executeClearAmQuery({ ...params, requiredScope: "OTHER" }, query)).validation.allowed).toBe(false);
    expect((await executeClearAmQuery({ ...params, revokedConsentIds: new Set([envelope.consentId]) }, query)).validation.allowed).toBe(false);
    expect((await executeClearAmQuery({ ...params, nowUtcIso: "invalid" }, query)).validation.allowed).toBe(false);
    expect(queryCounter).toBe(0);
    expect((await executeClearAmQuery(params, query)).result).toBe("fixture");
    expect(queryCounter).toBe(1);
  });
  it("blocks sealing beyond 300 seconds in either direction, invalid clocks and restricted records", () => {
    const delta = { deltaId: "test", recordId: "test", jurisdictionCode: "TEST", hlcTimestamp: "test", deviceClockEpochMs: NOW, visibilityTier: "PUBLIC_OPEN_COMMONS" as const, caseOrRecordCategory: "TEST", payload: {} };
    for (const drift of [-300_001, -300_000, 0, 300_000, 300_001, NaN, Infinity]) {
      const result = evaluateClockSyncAndQuarantine({ delta: { ...delta, deviceClockEpochMs: NOW + drift }, referenceNtpOrGpsEpochMs: NOW });
      expect(result.allowFinalEnrolledSealing).toBe(Number.isFinite(drift) && Math.abs(drift) <= 300_000);
    }
    expect(evaluateClockSyncAndQuarantine({ delta: { ...delta, caseOrRecordCategory: "MINOR_TEST" }, referenceNtpOrGpsEpochMs: NOW }).allowFinalEnrolledSealing).toBe(false);
  });
  it("conserves the statutory principal in each accepted plan and requires a trusted account", () => {
    const envelope: LgaGovernanceServiceEnvelope = { envelopeUlid: "test", lgaCode: "LA-LGA-01", moduleId: "LGA-10", kioskBaseDeltaId: "test", clockSyncStatus: "NTP_GPS_VERIFIED", splitDirectTreasuryProof: { statutoryAmountKobo: 1, directLgaTreasuryAccountRef: "CBN-LGA-TEST", platformEscrowAmountKobo: 0, stateIntermediaryEscrowKobo: 0 } };
    const accounts = new Map([[envelope.lgaCode, "CBN-LGA-TEST"]]);
    for (const amount of [1, 2, 100, 50_000, Number.MAX_SAFE_INTEGER]) {
      const plan = planDirectTreasuryRouting({ ...envelope, splitDirectTreasuryProof: { ...envelope.splitDirectTreasuryProof, statutoryAmountKobo: amount } }, accounts);
      expect(plan.valid).toBe(true);
      if (plan.valid) expect(plan.transfers.reduce((sum, transfer) => sum + transfer.amountKobo, 0)).toBe(amount);
    }
    for (const amount of [-1, 0, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) expect(planDirectTreasuryRouting({ ...envelope, splitDirectTreasuryProof: { ...envelope.splitDirectTreasuryProof, statutoryAmountKobo: amount } }, accounts).valid).toBe(false);
    expect(planDirectTreasuryRouting(envelope, new Map()).valid).toBe(false);
    expect(planDirectTreasuryRouting(envelope, new Map([[envelope.lgaCode, "CBN-LGA-OTHER"]])).valid).toBe(false);
  });
  it("uses portable canonical base64url and rejects malformed/unsupported evidence signatures", async () => {
    const bytes = Uint8Array.from({ length: 256 }, (_, index) => index);
    expect(decodeBase64Url(encodeBase64Url(bytes))).toEqual(bytes);
    expect(() => decodeBase64Url("ab==")).toThrow();
    const keys = await ephemeralKeys(), credential = await sealFixture(bytes, keys);
    for (const seal of [{ ...credential.cryptographicSeal, signatureAlgorithm: "ECDSA_P256_FIDO2" as const }, { ...credential.cryptographicSeal, signatureBase64Url: "invalid=" }]) {
      expect((await verifySureEvidenceOffline({ credential: { ...credential, cryptographicSeal: seal }, documentBytes: bytes, issuerPublicKeySpki: keys.publicKey })).verified).toBe(false);
    }
  });
});
