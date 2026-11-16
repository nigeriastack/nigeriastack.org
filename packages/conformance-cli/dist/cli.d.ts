#!/usr/bin/env node
/**
 * @package @nigeriastack/conformance-cli
 * @license Apache-2.0 OR MIT
 * @description Self-Service Interoperability Test Bed (ITB) & Chaos Runner (ITB-01 to ITB-05)
 */
import { buildDailyTreasuryMerkleRoot } from "./merkle-audit.js";
export * from "./merkle-audit.js";
export interface ItbScenarioResult {
    scenarioId: "ITB-01" | "ITB-02" | "ITB-03" | "ITB-04" | "ITB-05";
    title: string;
    governingRfc: string;
    status: "PASS" | "FAIL";
    deterministicAssertion: string;
    elapsedMs: number;
}
export interface ConformanceAttestationReceipt {
    attestationId: string;
    specVersion: "2026.6.5";
    license: "CC0-1.0";
    targetBuildingBlocks: string[];
    executedAtUtc: string;
    allScenariosPassed: boolean;
    scenarios: ItbScenarioResult[];
    treasuryMerkleAuditSample: ReturnType<typeof buildDailyTreasuryMerkleRoot>;
    attestationSha256Digest: string;
}
export declare function runAllItbScenarios(targetBuildingBlocks: string[]): ConformanceAttestationReceipt;
