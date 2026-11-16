/**
 * @package @nigeriastack/conformance-cli
 * @module merkle-audit
 * @normative NS-RFC-005 Sec. 5.2 & NS-RFC-009 Sec. 4.1 (03 Audit Public Merkle Transparency Log)
 */
import { createHash } from "node:crypto";
export function sha256NodeHex(data) {
    return createHash("sha256").update(data, "utf8").digest("hex");
}
export function computeMerkleRootSha256(leafHashesHex) {
    if (leafHashesHex.length === 0) {
        return sha256NodeHex("NIGERIASTACK_EMPTY_MERKLE_TREE_V2026");
    }
    let currentLevel = [...leafHashesHex];
    while (currentLevel.length > 1) {
        const nextLevel = [];
        for (let i = 0; i < currentLevel.length; i += 2) {
            const left = currentLevel[i];
            const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
            nextLevel.push(sha256NodeHex(`01:${left}:${right}`));
        }
        currentLevel = nextLevel;
    }
    return currentLevel[0];
}
export function buildDailyTreasuryMerkleRoot(receipts, logDateUtc = new Date().toISOString().slice(0, 10)) {
    let totalStatutoryKoboSettledDirect = 0;
    const leafHashes = [];
    for (const r of receipts) {
        if (r.platformEscrowAmountKobo !== 0 || r.stateIntermediaryEscrowKobo !== 0) {
            throw new Error(`TREASURY_PASSTHROUGH_INVARIANCE_BREACH on ${r.envelopeUlid}: non-zero escrow detected.`);
        }
        totalStatutoryKoboSettledDirect += r.statutoryAmountKobo;
        leafHashes.push(sha256NodeHex(`${r.envelopeUlid}|${r.lgaOrCourtCode}|${r.statutoryAmountKobo}|0|0`));
    }
    return {
        logDateUtc,
        leafCount: receipts.length,
        merkleRootSha256: computeMerkleRootSha256(leafHashes),
        totalStatutoryKoboSettledDirect,
        totalPlatformEscrowKobo: 0,
        totalStateIntermediaryEscrowKobo: 0,
    };
}
