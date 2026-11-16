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
export declare function canonicalizeJson(input: unknown): string;
export declare function sha256Hex(payloadBytes: Uint8Array): Promise<string>;
export declare function buildSection84Declaration(officerName: string, officerRole: string, jurisdictionSlug: string, hardwareFingerprintSha256: string): string;
export declare function signSureEvidenceCredential(params: {
    credentialId: string;
    documentBytes: Uint8Array;
    issuingAuthority: IssuingAuthorityBlock;
    deviceRegularity: Omit<DeviceRegularityAttestation, "statutoryDeclarationText">;
    ed25519PrivateKeyPkcs8: CryptoKey;
    issuedAtUtc?: string;
}): Promise<{
    credential: SureEvidenceCredential;
    qrUri: string;
}>;
export declare function verifySureEvidenceOffline(params: {
    credential: SureEvidenceCredential;
    documentBytes: Uint8Array;
    issuerPublicKeySpki: CryptoKey;
}): Promise<{
    verified: boolean;
    code: "S84_VERIFIED_AUTHENTIC" | "S84_PAYLOAD_DIGEST_MISMATCH" | "S84_INVALID_ED25519_SIGNATURE";
    elapsedMs: number;
}>;
