import assert from "node:assert/strict";
import { handleNetworkTimeoutAfterTransmission, validateSafeRetryAttempt } from "@nigeriastack/confluence-transport";
import { executeClearAmQuery, type ClearAmConsentEnvelope } from "@nigeriastack/clearam-guard";
import { signSureEvidenceCredential, verifySureEvidenceOffline } from "@nigeriastack/sure-evidence-crypto";
import { evaluateClockSyncAndQuarantine } from "@nigeriastack/kioskbase-crdt";
import { planDirectTreasuryRouting, type LgaGovernanceServiceEnvelope } from "@nigeriastack/lga-kiosk-kit";
import { GivePowerReferenceGateway, ReferenceEscrowLedger, signHumanMandate, type AgentAction } from "./givepower.js";
import type { StepBinding } from "./gherkin.js";

export const FIXTURE_NOW = Date.parse("2026-11-17T00:00:00Z");
export async function ephemeralKeys(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey("Ed25519", false, ["sign", "verify"]) as CryptoKeyPair;
}
export async function sealFixture(bytes: Uint8Array, keys: CryptoKeyPair, credentialId = "s84_01JBM8K9P2Q4R6S8T0V2W4X6Y8", keyId = "test-ephemeral-key") {
  return (await signSureEvidenceCredential({ credentialId, documentBytes: bytes,
    issuingAuthority: { jurisdictionSlug: "test.invalid", divisionOrDepartment: "Test", certifyingOfficerName: "Test Fixture", certifyingOfficerRole: "Test Fixture", fido2KeyId: keyId },
    deviceRegularity: { hardwareFingerprintSha256: "a".repeat(64), operatingConditionState: "NORMAL_CONTINUOUS_OPERATION", monotonicSealCounter: 1, clockSyncSource: "GPS_HARDWARE_RTC" },
    ed25519PrivateKeyPkcs8: keys.privateKey, issuedAtUtc: new Date(FIXTURE_NOW).toISOString(),
  })).credential;
}
const bind = (pattern: RegExp, execute: StepBinding["execute"]): StepBinding => ({ pattern, execute });
export function createItbFixture(id: string): { bindings: StepBinding[]; limitations: string[]; rfc: string } {
  if (id === "ITB-01") {
    let operation: Parameters<typeof handleNetworkTimeoutAfterTransmission>[0];
    let retry: ReturnType<typeof validateSafeRetryAttempt>;
    return { rfc: "NS-RFC-003", limitations: ["Local state machine; no upstream network or payment execution."], bindings: [
      bind(/^an initiated payment or registry operation "([^"]+)" with idempotency key "([^"]+)"$/, (operationId, idempotencyKey) => { operation = { operationId, idempotencyKey, state: "INITIATED", updatedAtUtc: new Date(FIXTURE_NOW).toISOString() }; }),
      bind(/^the upstream provider connection drops after request transmission without returning an HTTP response$/, () => { operation = handleNetworkTimeoutAfterTransmission(operation); }),
      bind(/^the local operation state machine MUST transition to "([^"]+)" and MUST NOT transition to "([^"]+)"$/, (expected, prohibited) => { assert.equal(operation.state, expected); assert.notEqual(operation.state, prohibited); }),
      bind(/^when the client attempts a retry using a new reference "([^"]+)" while "([^"]+)" is in "([^"]+)"$/, (reference, opId, state) => { assert.equal(operation.operationId, opId); assert.equal(operation.state, state); retry = validateSafeRetryAttempt({ existingOperation: operation, retryIdempotencyKey: reference }); }),
      bind(/^the adapter MUST reject the duplicate execution with HTTP (\d+) "([^"]+)"$/, (status, code) => { assert.deepEqual(retry, { allowed: false, httpStatus: Number(status), errorCode: code }); assert.equal(validateSafeRetryAttempt({ existingOperation: operation, retryIdempotencyKey: operation.idempotencyKey }).allowed, true); }),
    ] };
  }
  if (id === "ITB-02") {
    let envelope: ClearAmConsentEnvelope;
    let queryCounter = 0;
    let result: Awaited<ReturnType<typeof executeClearAmQuery>>;
    return { rfc: "NS-RFC-006", limitations: ["Local perimeter/query callback only; consent signatures and distributed revocation are not verified."], bindings: [
      bind(/^a signed ClearAm consent envelope "([^"]+)" with purposeCode "([^"]+)"$/, (consentId, purpose) => { envelope = { consentId, dataPrincipal: { identifierType: "BVN", saltedIdentityHashSha256: "b".repeat(64) }, lawfulBasisAndPurpose: { lawfulBasis: "EXPLICIT_DATA_SUBJECT_CONSENT", purposeCode: purpose as ClearAmConsentEnvelope["lawfulBasisAndPurpose"]["purposeCode"] }, dataProvidersAndScopes: { providerCategory: "TEST_FIXTURE", permittedScopes: ["SUMMARY"] }, temporalBoundsAndExpiry: { issuedAtUtc: "2026-11-01T00:00:00Z", validUntilUtc: "", maxRetentionDays: 30, maxQueryFrequency: 5 } }; }),
      bind(/^the envelope validUntilUtc is "([^"]+)" which is earlier than the current system UTC clock$/, expiry => { envelope.temporalBoundsAndExpiry.validUntilUtc = expiry; assert.ok(Date.parse(expiry) < FIXTURE_NOW); }),
      bind(/^an autonomous agent or bank FIU invokes the data provider endpoint with "([^"]+)"$/, async consentId => { assert.equal(envelope.consentId, consentId); result = await executeClearAmQuery({ envelope, requiredScope: "SUMMARY", revokedConsentIds: new Set(), nowUtcIso: new Date(FIXTURE_NOW).toISOString() }, async () => { queryCounter++; return "sensitive fixture"; }); }),
      bind(/^the gateway MUST abort at the perimeter with HTTP (\d+) "([^"]+)"$/, (status, code) => { assert.equal(result.validation.allowed, false); assert.equal(result.validation.httpStatus, Number(status)); assert.equal(result.validation.errorCode, code); assert.equal(result.result, undefined); }),
      bind(/^the downstream database query counter MUST equal (\d+)$/, count => { assert.equal(queryCounter, Number(count)); }),
    ] };
  }
  if (id === "ITB-03") {
    let keys: CryptoKeyPair, credential: Awaited<ReturnType<typeof sealFixture>>;
    const bytes = new TextEncoder().encode("%PDF-1.7 LOCAL_REFERENCE_FIXTURE");
    let tampered: Uint8Array, clock: ReturnType<typeof evaluateClockSyncAndQuarantine>;
    return { rfc: "NS-RFC-004 & NS-RFC-005", limitations: ["Ephemeral fixture key; no registrar identity, physical FIDO2 device, PDF parser, QR scanner, or enrolled sealing service verified."], bindings: [
      bind(/^a Registrar-sealed SureEvidence credential "([^"]+)" signed with FIDO2 Ed25519 key "([^"]+)"$/, async (credentialId, keyId) => { keys = await ephemeralKeys(); credential = await sealFixture(bytes, keys, credentialId, keyId); assert.equal((await verifySureEvidenceOffline({ credential, documentBytes: bytes, issuerPublicKeySpki: keys.publicKey })).verified, true); }),
      bind(/^(\d+) byte of the underlying Certified True Copy or LGA IndigeneProof PDF is modified in transit$/, count => { assert.equal(Number(count), 1); tampered = bytes.slice(); tampered[0] ^= 1; }),
      bind(/^offline QR verification MUST fail with "([^"]+)"$/, async code => { const result = await verifySureEvidenceOffline({ credential, documentBytes: tampered, issuerPublicKeySpki: keys.publicKey }); assert.equal(result.verified, false); assert.equal(result.code, code); }),
      bind(/^when an offline KioskBase node submits a delta "([^"]+)" with hardware clock drift of (\d+) seconds$/, (deltaId, seconds) => { clock = evaluateClockSyncAndQuarantine({ delta: { deltaId, recordId: "test-record", jurisdictionCode: "TEST", hlcTimestamp: "test", deviceClockEpochMs: FIXTURE_NOW + Number(seconds) * 1000, visibilityTier: "PUBLIC_OPEN_COMMONS", caseOrRecordCategory: "TEST", payload: {} }, referenceNtpOrGpsEpochMs: FIXTURE_NOW }); }),
      bind(/^the sync coordinator MUST flag the record "([^"]+)" and block final enrolled sealing until NTP\/GPS resynchronization$/, status => { assert.equal(clock.clockSyncStatus, status); assert.equal(clock.allowPublicOutboxSync, false); assert.equal(clock.allowFinalEnrolledSealing, false); const synced = evaluateClockSyncAndQuarantine({ delta: { deltaId: "test", recordId: "test", jurisdictionCode: "TEST", hlcTimestamp: "test", deviceClockEpochMs: FIXTURE_NOW, visibilityTier: "PUBLIC_OPEN_COMMONS", caseOrRecordCategory: "TEST", payload: {} }, referenceNtpOrGpsEpochMs: FIXTURE_NOW }); assert.equal(synced.allowFinalEnrolledSealing, true); }),
    ] };
  }
  if (id === "ITB-04") {
    let envelope: LgaGovernanceServiceEnvelope;
    let rejections: ReturnType<typeof planDirectTreasuryRouting>[];
    const accounts = new Map<string, string>();
    return { rfc: "NS-RFC-009 & NS-RFC-014", limitations: ["Local routing plan against a fixture account registry; no external account ownership or settlement verified."], bindings: [
      bind(/^a state court filing or 774-LGA MarketCollect payment payload for LGA "([^"]+)"$/, lgaCode => { const account = "CBN-LGA-TEST"; accounts.set(lgaCode, account); envelope = { envelopeUlid: "cop_01JBM8K9P2Q4R6S8T0V2W4X700", lgaCode, moduleId: "LGA-10", kioskBaseDeltaId: "test-delta", clockSyncStatus: "NTP_GPS_VERIFIED", splitDirectTreasuryProof: { statutoryAmountKobo: 50000, directLgaTreasuryAccountRef: account, platformEscrowAmountKobo: 0, stateIntermediaryEscrowKobo: 0 } }; }),
      bind(/^the payment split array specifies platformEscrowAmountKobo greater than (\d+) or stateIntermediaryEscrowKobo greater than (\d+)$/, (platform, state) => { assert.equal(Number(platform), 0); assert.equal(Number(state), 0); rejections = (["platformEscrowAmountKobo", "stateIntermediaryEscrowKobo"] as const).map(field => planDirectTreasuryRouting({ ...envelope, splitDirectTreasuryProof: { ...envelope.splitDirectTreasuryProof, [field]: 1 } }, accounts)); }),
      bind(/^the SplitDirect validator MUST reject the transaction with HTTP (\d+) "([^"]+)"$/, (status, code) => { for (const rejection of rejections) assert.deepEqual(rejection, { valid: false, httpStatus: Number(status), errorCode: code }); }),
      bind(/^(\d+)% of the statutory principal sum MUST route directly to the verified Judiciary CRF or Direct LGA Treasury Account$/, percent => { assert.equal(Number(percent), 100); const plan = planDirectTreasuryRouting(envelope, accounts); assert.ok(plan.valid); assert.deepEqual(plan.transfers, [{ accountRef: accounts.get(envelope.lgaCode), amountKobo: envelope.splitDirectTreasuryProof.statutoryAmountKobo }]); assert.equal(planDirectTreasuryRouting(envelope, new Map()).valid, false); }),
    ] };
  }
  if (id === "ITB-05") {
    let gateway: GivePowerReferenceGateway, result: Awaited<ReturnType<GivePowerReferenceGateway["authorize"]>>, keys: CryptoKeyPair;
    const action: AgentAction = { agentId: "fixture-agent", audience: "fixture-gateway", tool: "registry.update", parameters: { record: "test", value: "new" } };
    const ledger = new ReferenceEscrowLedger({ caller: 100, provider: 0 });
    return { rfc: "NS-RFC-008", limitations: ["Local reference envelope profile and in-memory replay/ledger only; ephemeral keys do not verify human presence, WebAuthn ceremony, real wallets, deployed relays, or payment settlement."], bindings: [
      bind(/^an autonomous MCP client connected with defaultExecutionMode "([^"]+)"$/, async mode => { assert.equal(mode, "READ_ONLY_DEFAULT"); keys = await ephemeralKeys(); gateway = new GivePowerReferenceGateway([{ name: action.tool, mutatesState: true, defaultExecutionMode: "READ_ONLY_DEFAULT" }], [{ principalId: "fixture-human", keyId: "fixture-key", publicKey: keys.publicKey, agentId: action.agentId, audience: action.audience, capabilities: [action.tool] }]); }),
      bind(/^the agent invokes a state-mutating tool without a valid "([^"]+)" header$/, async header => { assert.equal(header, "humanCountersignatureEd25519"); result = await gateway.authorize(action, undefined, FIXTURE_NOW); }),
      bind(/^the MCP gateway MUST reject the call with HTTP (\d+) "([^"]+)"$/, (status, code) => { assert.deepEqual(result, { allowed: false, httpStatus: Number(status), errorCode: code }); }),
      bind(/^when a valid x402 micro-settlement challenge is locked in "([^"]+)" but the downstream provider returns HTTP (\d+)$/, async (state, status) => { const header = await signHumanMandate({ ...action, principalId: "fixture-human", keyId: "fixture-key", nonce: "fixture_nonce_0001", issuedAtUtc: new Date(FIXTURE_NOW).toISOString(), expiresAtUtc: new Date(FIXTURE_NOW + 60_000).toISOString() }, keys.privateKey); assert.equal((await gateway.authorize(action, header, FIXTURE_NOW)).allowed, true); assert.equal(ledger.lock({ challengeId: "fixture-challenge", callerWallet: "caller", providerWallet: "provider", amountKobo: 1, requestId: "rpc-1", expiresAtMs: FIXTURE_NOW + 60_000 }, FIXTURE_NOW).state, state); assert.equal(ledger.balance("caller"), 99); await ledger.deliver("fixture-challenge", { httpStatus: Number(status) }, keys.publicKey, FIXTURE_NOW); }),
      bind(/^the escrow verifier MUST automatically revert the micro-settlement to the caller wallet with zero provider payout$/, () => { assert.equal(ledger.entry("fixture-challenge").state, "REVERTED_TO_CALLER"); assert.equal(ledger.balance("caller"), 100); assert.equal(ledger.balance("provider"), 0); ledger.revert("fixture-challenge"); assert.equal(ledger.balance("caller"), 100); }),
    ] };
  }
  throw new Error(`No executable fixture for ${id}`);
}
