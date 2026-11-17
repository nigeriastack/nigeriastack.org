/** Local RFC-008 reference profile; not a WebAuthn ceremony, payment rail, or production gateway. */
import { encodeBase64Url, decodeBase64Url, canonicalizeJson, verifySureEvidenceOffline, type SureEvidenceCredential } from "@nigeriastack/sure-evidence-crypto";

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
export interface AgentAction { agentId: string; audience: string; tool: string; parameters: Json }
export interface HumanMandate extends AgentAction {
  principalId: string; keyId: string; nonce: string; issuedAtUtc: string; expiresAtUtc: string;
}
export interface Countersignature { mandate: HumanMandate; signatureBase64Url: string }
export interface RegisteredTool { name: string; mutatesState: boolean; defaultExecutionMode: "READ_ONLY_DEFAULT" }
export interface PrincipalGrant {
  principalId: string; keyId: string; publicKey: CryptoKey; agentId: string; audience: string;
  capabilities: readonly string[];
}
export type Authorization = { allowed: true; httpStatus: 200 | 202 } | { allowed: false; httpStatus: 403; errorCode: string };
const REQUIRED = "NDPA_S37_HUMAN_COUNTERSIGNATURE_REQUIRED";

// This profile rejects non-JSON values instead of silently signing an altered serialization.
function validateJson(value: unknown, ancestors = new Set<object>()): void {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number" && Number.isFinite(value)) return;
  if (typeof value !== "object" || ancestors.has(value)) throw new Error("GIVEPOWER_INVALID_JSON");
  if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) throw new Error("GIVEPOWER_INVALID_JSON");
  if (Object.getOwnPropertySymbols(value).length) throw new Error("GIVEPOWER_INVALID_JSON");
  ancestors.add(value);
  for (const item of Array.isArray(value) ? value : Object.values(value)) validateJson(item, ancestors);
  ancestors.delete(value);
}
function encodeMandate(mandate: HumanMandate): Uint8Array {
  validateJson(mandate);
  return new TextEncoder().encode("urn:ngstack:givepower:v2026:local-reference:1\n" + canonicalizeJson(mandate));
}
export async function signHumanMandate(mandate: HumanMandate, privateKey: CryptoKey): Promise<Countersignature> {
  const signature = await crypto.subtle.sign("Ed25519", privateKey, encodeMandate(mandate) as BufferSource);
  return { mandate: structuredClone(mandate), signatureBase64Url: encodeBase64Url(new Uint8Array(signature)) };
}

/** Single-process replay store: applications must supply durable, atomic distributed storage before deployment. */
export class GivePowerReferenceGateway {
  private readonly tools = new Map<string, RegisteredTool>();
  private readonly grants = new Map<string, PrincipalGrant>();
  private readonly consumed = new Set<string>();
  constructor(tools: readonly RegisteredTool[], grants: readonly PrincipalGrant[], private readonly maxLifetimeMs = 300_000) {
    if (!Number.isSafeInteger(maxLifetimeMs) || maxLifetimeMs <= 0) throw new Error("GIVEPOWER_INVALID_LIFETIME");
    for (const tool of tools) {
      if (tool.defaultExecutionMode !== "READ_ONLY_DEFAULT" || this.tools.has(tool.name)) throw new Error("GIVEPOWER_INVALID_TOOL_REGISTRATION");
      this.tools.set(tool.name, { ...tool });
    }
    for (const grant of grants) {
      const key = JSON.stringify([grant.principalId, grant.keyId]);
      if (this.grants.has(key) || grant.publicKey.algorithm.name !== "Ed25519") throw new Error("GIVEPOWER_INVALID_PRINCIPAL_GRANT");
      this.grants.set(key, { ...grant, capabilities: [...grant.capabilities] });
    }
  }
  revoke(principalId: string, keyId: string): void { this.grants.delete(JSON.stringify([principalId, keyId])); }
  async authorize(action: AgentAction, header?: Countersignature, nowMs = Date.now()): Promise<Authorization> {
    const deny = (errorCode = REQUIRED): Authorization => ({ allowed: false, httpStatus: 403, errorCode });
    try {
      action = structuredClone(action);
      header = header ? structuredClone(header) : undefined;
      validateJson(action);
      const tool = this.tools.get(action.tool);
      if (!tool) return deny("GIVEPOWER_TOOL_NOT_REGISTERED");
      if (!tool.mutatesState) return { allowed: true, httpStatus: 200 };
      if (!header) return deny();
      const { mandate: m, signatureBase64Url: sig } = header;
      const grant = this.grants.get(JSON.stringify([m.principalId, m.keyId]));
      if (![m.issuedAtUtc, m.expiresAtUtc].every(value => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value))) return deny();
      const start = Date.parse(m.issuedAtUtc), end = Date.parse(m.expiresAtUtc);
      if (!grant || !Number.isFinite(nowMs) || !Number.isFinite(start) || !Number.isFinite(end) || start > nowMs || end <= nowMs || end <= start || end - start > this.maxLifetimeMs || !/^[A-Za-z0-9_-]{16,128}$/.test(m.nonce)) return deny();
      if (grant.agentId !== action.agentId || grant.audience !== action.audience || !grant.capabilities.includes(action.tool)) return deny("GIVEPOWER_CAPABILITY_DENIED");
      if (canonicalizeJson({ agentId: m.agentId, audience: m.audience, tool: m.tool, parameters: m.parameters }) !== canonicalizeJson(action)) return deny();
      if (!/^[A-Za-z0-9_-]{86}$/.test(sig) || encodeBase64Url(decodeBase64Url(sig)) !== sig) return deny();
      if (!await crypto.subtle.verify("Ed25519", grant.publicKey, decodeBase64Url(sig) as BufferSource, encodeMandate(m) as BufferSource)) return deny();
      const nonceKey = JSON.stringify([m.principalId, m.keyId, m.nonce]);
      // No await between replay lookup and consumption: simultaneous verification cannot authorize twice.
      if (this.consumed.has(nonceKey)) return deny("GIVEPOWER_REPLAY_REJECTED");
      if (!this.grants.has(JSON.stringify([m.principalId, m.keyId]))) return deny();
      this.consumed.add(nonceKey);
      return { allowed: true, httpStatus: 202 };
    } catch { return deny(); }
  }
}

export type EscrowState = "ESCROW_LOCKED" | "REVERTED_TO_CALLER" | "RELEASED_TO_PROVIDER";
export interface EscrowChallenge {
  challengeId: string; callerWallet: string; providerWallet: string; amountKobo: number;
  requestId: string | number; expiresAtMs: number;
}
export interface EscrowEntry extends EscrowChallenge { state: EscrowState }
export interface ToolDelivery {
  httpStatus: number;
  response: { jsonrpc: "2.0"; id: string | number; result: Json; error?: never };
  credential: SureEvidenceCredential;
  responseBytes: Uint8Array;
}
/** Deterministic integer-kobo ledger. No money or token is processed. */
export class ReferenceEscrowLedger {
  private readonly wallets = new Map<string, number>();
  private readonly entries = new Map<string, EscrowEntry>();
  constructor(initialBalances: Readonly<Record<string, number>>) {
    let total = 0;
    for (const [wallet, amount] of Object.entries(initialBalances)) {
      if (!wallet || !Number.isSafeInteger(amount) || amount < 0 || !Number.isSafeInteger(total += amount)) throw new Error("ESCROW_INVALID_BALANCE");
      this.wallets.set(wallet, amount);
    }
  }
  balance(wallet: string): number { return this.wallets.get(wallet) ?? 0; }
  entry(id: string): EscrowEntry { const e = this.entries.get(id); if (!e) throw new Error("ESCROW_UNKNOWN_CHALLENGE"); return { ...e }; }
  lock(challenge: EscrowChallenge, nowMs: number): EscrowEntry {
    if (!challenge.challengeId || this.entries.has(challenge.challengeId) || !challenge.callerWallet || !challenge.providerWallet || challenge.callerWallet === challenge.providerWallet || !Number.isSafeInteger(challenge.amountKobo) || challenge.amountKobo <= 0 || !Number.isSafeInteger(nowMs) || !Number.isSafeInteger(challenge.expiresAtMs) || challenge.expiresAtMs <= nowMs || !["string", "number"].includes(typeof challenge.requestId) || (typeof challenge.requestId === "number" && !Number.isSafeInteger(challenge.requestId))) throw new Error("ESCROW_INVALID_CHALLENGE");
    if (this.balance(challenge.callerWallet) < challenge.amountKobo) throw new Error("ESCROW_INSUFFICIENT_BUDGET");
    this.wallets.set(challenge.callerWallet, this.balance(challenge.callerWallet) - challenge.amountKobo);
    this.entries.set(challenge.challengeId, { ...challenge, state: "ESCROW_LOCKED" });
    return this.entry(challenge.challengeId);
  }
  private finish(id: string, release: boolean): EscrowEntry {
    const entry = this.entry(id);
    if (entry.state !== "ESCROW_LOCKED") return entry;
    const wallet = release ? entry.providerWallet : entry.callerWallet;
    const amount = this.balance(wallet) + entry.amountKobo;
    if (!Number.isSafeInteger(amount)) throw new Error("ESCROW_BALANCE_OVERFLOW");
    this.wallets.set(wallet, amount);
    this.entries.set(id, { ...entry, state: release ? "RELEASED_TO_PROVIDER" : "REVERTED_TO_CALLER" });
    return this.entry(id);
  }
  revert(id: string): EscrowEntry { return this.finish(id, false); }
  expire(id: string, nowMs: number): EscrowEntry {
    const entry = this.entry(id);
    if (!Number.isFinite(nowMs)) throw new Error("ESCROW_INVALID_CLOCK");
    return nowMs >= entry.expiresAtMs ? this.revert(id) : entry;
  }
  async deliver(id: string, delivery: ToolDelivery | { httpStatus: number }, trustedIssuerKey: CryptoKey, nowMs: number): Promise<EscrowEntry> {
    const entry = this.entry(id);
    if (entry.state !== "ESCROW_LOCKED") return entry;
    let valid = false;
    try {
      delivery = structuredClone(delivery);
      if (Number.isFinite(nowMs) && nowMs < entry.expiresAtMs && delivery.httpStatus === 200 && "response" in delivery) {
        const response = delivery.response;
        validateJson(response);
        valid = response.jsonrpc === "2.0" && response.id === entry.requestId && Object.hasOwn(response, "result") && !Object.hasOwn(response, "error") &&
          Object.keys(response).every(key => ["jsonrpc", "id", "result"].includes(key)) &&
          canonicalizeJson(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(delivery.responseBytes))) === canonicalizeJson(response) &&
          (await verifySureEvidenceOffline({ credential: delivery.credential, documentBytes: delivery.responseBytes, issuerPublicKeySpki: trustedIssuerKey })).verified;
      }
    } catch { valid = false; }
    return this.finish(id, valid);
  }
}
