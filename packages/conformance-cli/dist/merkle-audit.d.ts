/**
 * @package @nigeriastack/conformance-cli
 * @module merkle-audit
 * @normative NS-RFC-005 Sec. 5.2 & NS-RFC-009 Sec. 4.1 (03 Audit Public Merkle Transparency Log)
 */
export interface MerkleAuditReceipt {
    logDateUtc: string;
    leafCount: number;
    merkleRootSha256: string;
    totalStatutoryKoboSettledDirect: number;
    totalPlatformEscrowKobo: 0;
    totalStateIntermediaryEscrowKobo: 0;
}
export declare function sha256NodeHex(data: string): string;
export declare function computeMerkleRootSha256(leafHashesHex: string[]): string;
export declare function buildDailyTreasuryMerkleRoot(receipts: Array<{
    envelopeUlid: string;
    lgaOrCourtCode: string;
    statutoryAmountKobo: number;
    platformEscrowAmountKobo: number;
    stateIntermediaryEscrowKobo: number;
}>, logDateUtc?: string): MerkleAuditReceipt;
