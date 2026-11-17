import { describe, it, expect } from "vitest";
import { canonicalizeJson } from "@nigeriastack/sure-evidence-crypto";
import { GivePowerReferenceGateway, ReferenceEscrowLedger, signHumanMandate, type AgentAction, type HumanMandate, type ToolDelivery } from "../src/givepower.js";
import { ephemeralKeys, sealFixture, FIXTURE_NOW as NOW } from "../src/itb-fixtures.js";

const action: AgentAction = { agentId: "agent-1", audience: "local-gateway", tool: "registry.update", parameters: { amount: 1, record: "test" } };
const mandate = (overrides: Partial<HumanMandate> = {}): HumanMandate => ({ ...action, principalId: "human-1", keyId: "key-1", nonce: "nonce_00000000001", issuedAtUtc: new Date(NOW).toISOString(), expiresAtUtc: new Date(NOW + 60_000).toISOString(), ...overrides });
async function setup(capabilities = [action.tool]) {
  const keys = await ephemeralKeys();
  const gateway = new GivePowerReferenceGateway([
    { name: action.tool, mutatesState: true, defaultExecutionMode: "READ_ONLY_DEFAULT" },
    { name: "status", mutatesState: false, defaultExecutionMode: "READ_ONLY_DEFAULT" },
  ], [{ principalId: "human-1", keyId: "key-1", publicKey: keys.publicKey, agentId: action.agentId, audience: action.audience, capabilities }]);
  return { keys, gateway };
}
const challenge = (id = "challenge", amountKobo = 1) => ({ challengeId: id, callerWallet: "caller", providerWallet: "provider", amountKobo, requestId: "rpc-1", expiresAtMs: NOW + 60_000 });
async function delivery(keys: CryptoKeyPair): Promise<ToolDelivery> {
  const response = { jsonrpc: "2.0" as const, id: "rpc-1", result: { value: "fixture" } };
  const responseBytes = new TextEncoder().encode(canonicalizeJson(response));
  return { httpStatus: 200, response, responseBytes, credential: await sealFixture(responseBytes, keys) };
}

describe("GivePower exact human mandate authorization", () => {
  it("allows registered read-only queries without a signature and blocks unknown tools/mutations", async () => {
    const { gateway } = await setup();
    expect(await gateway.authorize({ ...action, tool: "status" })).toEqual({ allowed: true, httpStatus: 200 });
    expect((await gateway.authorize(action)).allowed).toBe(false);
    expect((await gateway.authorize({ ...action, tool: "unknown" })).allowed).toBe(false);
  });
  it("verifies signatures, exact action binding, trusted key, capability, agent and audience", async () => {
    const { keys, gateway } = await setup();
    const header = await signHumanMandate(mandate(), keys.privateKey);
    for (const changed of [{ ...action, parameters: { amount: 2, record: "test" } }, { ...action, agentId: "other" }, { ...action, audience: "other" }]) expect((await gateway.authorize(changed, header, NOW)).allowed).toBe(false);
    const impostor = await ephemeralKeys();
    expect((await gateway.authorize(action, await signHumanMandate(mandate(), impostor.privateKey), NOW)).allowed).toBe(false);
    const denied = await setup([]);
    expect((await denied.gateway.authorize(action, await signHumanMandate(mandate(), denied.keys.privateKey), NOW)).allowed).toBe(false);
    expect((await gateway.authorize(action, header, NOW)).allowed).toBe(true);
    expect(await gateway.authorize(action, header, NOW)).toMatchObject({ allowed: false, errorCode: "GIVEPOWER_REPLAY_REJECTED" });
  });
  it("rejects expiration boundaries, invalid clocks, future issuance and excessive lifetime", async () => {
    const { keys, gateway } = await setup();
    const invalid = [
      mandate({ expiresAtUtc: new Date(NOW).toISOString() }),
      mandate({ issuedAtUtc: new Date(NOW + 1).toISOString() }),
      mandate({ issuedAtUtc: "invalid" }), mandate({ issuedAtUtc: "2026-11-17T00:00:00" }), mandate({ expiresAtUtc: "invalid" }),
      mandate({ expiresAtUtc: new Date(NOW + 300_001).toISOString() }),
      mandate({ nonce: "short" }), mandate({ keyId: "unknown" }),
    ];
    for (const value of invalid) expect((await gateway.authorize(action, await signHumanMandate(value, keys.privateKey), NOW)).allowed).toBe(false);
    expect((await gateway.authorize(action, await signHumanMandate(mandate(), keys.privateKey), NaN)).allowed).toBe(false);
  });
  it("atomically consumes a nonce during simultaneous verification and honors revocation", async () => {
    const { keys, gateway } = await setup();
    const signed = await signHumanMandate(mandate(), keys.privateKey);
    const results = await Promise.all(Array.from({ length: 24 }, () => gateway.authorize(action, signed, NOW)));
    expect(results.filter(result => result.allowed)).toHaveLength(1);
    const revoked = await signHumanMandate(mandate({ nonce: "nonce_00000000002" }), keys.privateKey);
    gateway.revoke("human-1", "key-1");
    expect((await gateway.authorize(action, revoked, NOW)).allowed).toBe(false);
  });
  it("rejects invalid JSON rather than signing lossy parameters", async () => {
    const { keys } = await setup();
    for (const parameters of [NaN, Infinity, undefined, { field: undefined }, new Date()]) {
      await expect(signHumanMandate(mandate({ parameters: parameters as never }), keys.privateKey)).rejects.toThrow("GIVEPOWER_INVALID_JSON");
    }
  });
});

describe("x402 two-phase reference ledger", () => {
  it("locks, verifies signed exact JSON-RPC delivery, then releases once", async () => {
    const keys = await ephemeralKeys(), ledger = new ReferenceEscrowLedger({ caller: 100, provider: 0 });
    ledger.lock(challenge(), NOW);
    expect(ledger.balance("caller")).toBe(99); expect(ledger.balance("provider")).toBe(0);
    const response = await delivery(keys);
    expect((await ledger.deliver("challenge", response, keys.publicKey, NOW)).state).toBe("RELEASED_TO_PROVIDER");
    expect(ledger.balance("provider")).toBe(1);
    ledger.revert("challenge");
    await ledger.deliver("challenge", response, keys.publicKey, NOW);
    expect(ledger.balance("provider")).toBe(1); expect(ledger.balance("caller")).toBe(99);
  });
  it("accepts schema-valid JSON whitespace while verifying the exact delivered bytes", async () => {
    const keys = await ephemeralKeys(), ledger = new ReferenceEscrowLedger({ caller: 100, provider: 0 });
    ledger.lock(challenge(), NOW);
    const response = await delivery(keys);
    response.responseBytes = new TextEncoder().encode(JSON.stringify(response.response, null, 2));
    response.credential = await sealFixture(response.responseBytes, keys);
    expect((await ledger.deliver("challenge", response, keys.publicKey, NOW)).state).toBe("RELEASED_TO_PROVIDER");
  });
  it("refunds timeout/5xx/invalid responses with no provider payout", async () => {
    const keys = await ephemeralKeys(), other = await ephemeralKeys();
    const valid = await delivery(keys);
    const invalid: (ToolDelivery | { httpStatus: number })[] = [
      { httpStatus: 503 }, { httpStatus: 504 }, { httpStatus: 0 }, { httpStatus: 202 },
      { ...valid, response: { ...valid.response, id: "wrong" } },
      { ...valid, response: { ...valid.response, jsonrpc: "1.0" as "2.0" } },
      { ...valid, response: { ...valid.response, error: { code: 1 } } as never },
      { ...valid, response: { jsonrpc: "2.0", id: "rpc-1" } as never },
      { ...valid, responseBytes: new TextEncoder().encode("tamper") },
      { ...valid, credential: { ...valid.credential, cryptographicSeal: { ...valid.credential.cryptographicSeal, signatureBase64Url: "x".repeat(86) } } },
    ];
    for (const response of invalid) {
      const ledger = new ReferenceEscrowLedger({ caller: 100, provider: 0 }); ledger.lock(challenge(), NOW);
      expect((await ledger.deliver("challenge", response, keys.publicKey, NOW)).state).toBe("REVERTED_TO_CALLER");
      expect(ledger.balance("caller")).toBe(100); expect(ledger.balance("provider")).toBe(0);
    }
    for (const [key, now] of [[other.publicKey, NOW], [keys.publicKey, NOW + 60_000], [keys.publicKey, NaN]] as const) {
      const ledger = new ReferenceEscrowLedger({ caller: 100, provider: 0 }); ledger.lock(challenge(), NOW);
      expect((await ledger.deliver("challenge", valid, key, now)).state).toBe("REVERTED_TO_CALLER");
    }
  });
  it("expires a pending challenge at the deadline; a refund wins over concurrent proof verification", async () => {
    const keys = await ephemeralKeys(), ledger = new ReferenceEscrowLedger({ caller: 10, provider: 0 });
    ledger.lock(challenge(), NOW);
    expect(ledger.expire("challenge", NOW + 59_999).state).toBe("ESCROW_LOCKED");
    const pending = ledger.deliver("challenge", await delivery(keys), keys.publicKey, NOW);
    expect(ledger.expire("challenge", NOW + 60_000).state).toBe("REVERTED_TO_CALLER");
    expect((await pending).state).toBe("REVERTED_TO_CALLER");
    expect(ledger.balance("caller")).toBe(10); expect(ledger.balance("provider")).toBe(0);
  });
  it("conserves balances across many lock/refund transitions and rejects invalid amounts/reuse", () => {
    const ledger = new ReferenceEscrowLedger({ caller: 10_000, provider: 0 });
    for (let amount = 1; amount <= 100; amount++) {
      const id = `challenge-${amount}`;
      ledger.lock(challenge(id, amount), NOW);
      expect(ledger.balance("caller") + ledger.balance("provider") + amount).toBe(10_000);
      expect(() => ledger.lock(challenge(id, amount), NOW)).toThrow();
      ledger.revert(id); ledger.revert(id);
      expect(ledger.balance("caller") + ledger.balance("provider")).toBe(10_000);
    }
    for (const amount of [0, -1, 0.1, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) expect(() => ledger.lock(challenge("invalid", amount), NOW)).toThrow();
    expect(() => ledger.lock(challenge("overdraft", 10_001), NOW)).toThrow();
    expect(() => new ReferenceEscrowLedger({ caller: Number.MAX_SAFE_INTEGER, provider: 1 })).toThrow();
  });
});
