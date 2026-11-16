/**
 * @package @nigeriastack/sure-evidence-crypto
 * @license Apache-2.0 OR MIT
 * @normative NS-RFC-005 (SureEvidence Section 84 Credentials & Offline QR Verifier)
 */

export interface IssuingAuthorityBlock {
  jurisdictionSlug: string;
  divisionOrDepartment: string;
  certifyingOfficerName: string;
  certifyingOfficerRole: string;
  fido2KeyId: string;
}

export interface DeviceRegularityAttestation {
  hardwareFingerprintSha256: string;
  operatingConditionState: "NORMAL_CONTINUOUS_OPERATION" | "RECOVERED_OFFLINE_SYNC";
  monotonicSealCounter: number;
  clockSyncSource: "GPS_HARDWARE_RTC" | "CELLULAR_NTP_VERIFIED";
  statutoryDeclarationText: string;
}

export interface CryptographicSealBlock {
  payloadSha256Digest: string;
  signatureAlgorithm: "Ed25519" | "ECDSA_P256_FIDO2";
  signatureBase64Url: string;
  issuedAtUtc: string;
}

export interface SureEvidenceCredential {
  "@context": ["https://www.w3.org/ns/credentials/v2", "https://nigeriastack.org/contexts/sure-evidence/v2026"];
  credentialId: string;
  type: ["VerifiableCredential", "SureEvidenceSection84Credential"];
  issuingAuthority: IssuingAuthorityBlock;
  deviceRegularityAttestation: DeviceRegularityAttestation;
  cryptographicSeal: CryptographicSealBlock;
}

const S84_ULID_REGEX = /^s84_[0-9A-HJKMNP-TV-Z]{26}$/;
const HEX64_REGEX = /^[a-f0-9]{64}$/;

export function canonicalizeJson(input: unknown): string {
  if (input === null || typeof input !== "object") {
    return JSON.stringify(input);
  }
  if (Array.isArray(input)) {
    return `[${input.map(canonicalizeJson).join(",")}]`;
  }
  const sortedKeys = Object.keys(input as Record<string, unknown>).sort();
  const entries = sortedKeys.map(
    (k) => `${JSON.stringify(k)}:${canonicalizeJson((input as Record<string, unknown>)[k])}`
  );
  return `{${entries.join(",")}}`;
}

export async function sha256Hex(payloadBytes: Uint8Array): Promise<string> {
  const digestBuffer = await crypto.subtle.digest("SHA-256", payloadBytes as BufferSource);
  return Array.from(new Uint8Array(digestBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function buildSection84Declaration(
  officerName: string,
  officerRole: string,
  jurisdictionSlug: string,
  hardwareFingerprintSha256: string
): string {
  return (
    `Pursuant to Section 84(2) and Section 84(4) of the Evidence Act 2011 (Laws of the Federation of Nigeria), ` +
    `I, ${officerName} (${officerRole} at ${jurisdictionSlug}), certify that the computer terminal ` +
    `[SHA-256 Fingerprint: ${hardwareFingerprintSha256}] was operating properly at all material times ` +
    `when this electronic record was produced and sealed.`
  );
}

export async function signSureEvidenceCredential(params: {
  credentialId: string;
  documentBytes: Uint8Array;
  issuingAuthority: IssuingAuthorityBlock;
  deviceRegularity: Omit<DeviceRegularityAttestation, "statutoryDeclarationText">;
  ed25519PrivateKeyPkcs8: CryptoKey;
  issuedAtUtc?: string;
}): Promise<{ credential: SureEvidenceCredential; qrUri: string }> {
  if (!S84_ULID_REGEX.test(params.credentialId)) {
    throw new Error(`S84_INVALID_ULID: ${params.credentialId} must match ^s84_[0-9A-HJKMNP-TV-Z]{26}$`);
  }
  if (!HEX64_REGEX.test(params.deviceRegularity.hardwareFingerprintSha256)) {
    throw new Error("S84_INVALID_HARDWARE_FINGERPRINT_SHA256");
  }
  const payloadSha256Digest = await sha256Hex(params.documentBytes);
  const issuedAtUtc = params.issuedAtUtc ?? new Date().toISOString();
  const statutoryDeclarationText = buildSection84Declaration(
    params.issuingAuthority.certifyingOfficerName,
    params.issuingAuthority.certifyingOfficerRole,
    params.issuingAuthority.jurisdictionSlug,
    params.deviceRegularity.hardwareFingerprintSha256
  );

  const deviceRegularityAttestation: DeviceRegularityAttestation = {
    ...params.deviceRegularity,
    statutoryDeclarationText,
  };

  const signingPayload = canonicalizeJson({
    credentialId: params.credentialId,
    issuingAuthority: params.issuingAuthority,
    deviceRegularityAttestation,
    payloadSha256Digest,
    issuedAtUtc,
  });

  const signatureBuffer = await crypto.subtle.sign(
    { name: "Ed25519" },
    params.ed25519PrivateKeyPkcs8,
    new TextEncoder().encode(signingPayload)
  );
  const signatureBase64Url = Buffer.from(signatureBuffer).toString("base64url");

  const credential: SureEvidenceCredential = {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://nigeriastack.org/contexts/sure-evidence/v2026",
    ],
    credentialId: params.credentialId,
    type: ["VerifiableCredential", "SureEvidenceSection84Credential"],
    issuingAuthority: params.issuingAuthority,
    deviceRegularityAttestation,
    cryptographicSeal: {
      payloadSha256Digest,
      signatureAlgorithm: "Ed25519",
      signatureBase64Url,
      issuedAtUtc,
    },
  };

  const qrUri =
    `ngstack://verify/${params.credentialId}` +
    `?digest=${payloadSha256Digest}` +
    `&key=${encodeURIComponent(params.issuingAuthority.fido2KeyId)}` +
    `&sig=${signatureBase64Url}`;

  return { credential, qrUri };
}

export async function verifySureEvidenceOffline(params: {
  credential: SureEvidenceCredential;
  documentBytes: Uint8Array;
  issuerPublicKeySpki: CryptoKey;
}): Promise<{
  verified: boolean;
  code: "S84_VERIFIED_AUTHENTIC" | "S84_PAYLOAD_DIGEST_MISMATCH" | "S84_INVALID_ED25519_SIGNATURE";
  elapsedMs: number;
}> {
  const start = performance.now();
  const actualDigest = await sha256Hex(params.documentBytes);
  if (actualDigest !== params.credential.cryptographicSeal.payloadSha256Digest) {
    return {
      verified: false,
      code: "S84_PAYLOAD_DIGEST_MISMATCH",
      elapsedMs: Number((performance.now() - start).toFixed(2)),
    };
  }

  const signingPayload = canonicalizeJson({
    credentialId: params.credential.credentialId,
    issuingAuthority: params.credential.issuingAuthority,
    deviceRegularityAttestation: params.credential.deviceRegularityAttestation,
    payloadSha256Digest: params.credential.cryptographicSeal.payloadSha256Digest,
    issuedAtUtc: params.credential.cryptographicSeal.issuedAtUtc,
  });

  const sigBytes = new Uint8Array(Buffer.from(params.credential.cryptographicSeal.signatureBase64Url, "base64url"));

  const isValid = await crypto.subtle.verify(
    { name: "Ed25519" },
    params.issuerPublicKeySpki,
    sigBytes,
    new TextEncoder().encode(signingPayload)
  );

  return {
    verified: isValid,
    code: isValid ? "S84_VERIFIED_AUTHENTIC" : "S84_INVALID_ED25519_SIGNATURE",
    elapsedMs: Number((performance.now() - start).toFixed(2)),
  };
}
