import { describe, it, expect } from "vitest";
import { signSureEvidenceCredential, verifySureEvidenceOffline } from "../src/index.js";

describe("@nigeriastack/sure-evidence-crypto (NS-RFC-005)", () => {
  it("signs and verifies a Section 84 credential in < 50ms and rejects 1-byte tamper (ITB-03)", async () => {
    const keyPair = (await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"])) as CryptoKeyPair;
    const docBytes = new TextEncoder().encode("CTC-JUDGMENT-LA-2026-001");
    const { credential } = await signSureEvidenceCredential({
      credentialId: "s84_01JBM8K9P2Q4R6S8T0V2W4X6Y8",
      documentBytes: docBytes,
      issuingAuthority: {
        jurisdictionSlug: "highcourt.lagosstate.gov.ng",
        divisionOrDepartment: "Commercial Division",
        certifyingOfficerName: "A. B. Registrar",
        certifyingOfficerRole: "Chief Registrar",
        fido2KeyId: "did:web:highcourt.lagosstate.gov.ng#key-01",
      },
      deviceRegularity: {
        hardwareFingerprintSha256: "a".repeat(64),
        operatingConditionState: "NORMAL_CONTINUOUS_OPERATION",
        monotonicSealCounter: 42,
        clockSyncSource: "GPS_HARDWARE_RTC",
      },
      ed25519PrivateKeyPkcs8: keyPair.privateKey,
    });

    const okRes = await verifySureEvidenceOffline({
      credential,
      documentBytes: docBytes,
      issuerPublicKeySpki: keyPair.publicKey,
    });
    expect(okRes.verified).toBe(true);
    expect(okRes.code).toBe("S84_VERIFIED_AUTHENTIC");
    expect(okRes.elapsedMs).toBeLessThan(50);

    const tampered = new Uint8Array(docBytes);
    tampered[0] ^= 0xff;
    const failRes = await verifySureEvidenceOffline({
      credential,
      documentBytes: tampered,
      issuerPublicKeySpki: keyPair.publicKey,
    });
    expect(failRes.verified).toBe(false);
    expect(failRes.code).toBe("S84_PAYLOAD_DIGEST_MISMATCH");
  });
});
