import { buildDailyTreasuryMerkleRoot } from "./merkle-audit.js";
export * from "./merkle-audit.js";
export * from "./givepower.js";
export * from "./gherkin.js";
export interface ItbScenarioResult {
    scenarioId: "ITB-01" | "ITB-02" | "ITB-03" | "ITB-04" | "ITB-05";
    title: string;
    governingRfc: string;
    status: "PASS" | "FAIL" | "NOT_RUN";
    deterministicAssertion: string;
    elapsedMs: number;
    executedSteps: number;
    limitations: string[];
}
export interface ConformanceAttestationReceipt {
    attestationId: string;
    specVersion: "2026.6.5";
    license: "CC0-1.0";
    verificationScope: "LOCAL_REFERENCE_SDK_ONLY";
    targetBuildingBlocks: string[];
    executedAtUtc: string;
    featureSha256Digest: string;
    allScenariosPassed: boolean;
    scenarios: ItbScenarioResult[];
    treasuryMerkleAuditSample: ReturnType<typeof buildDailyTreasuryMerkleRoot>;
    attestationSha256Digest: string;
}
export declare function runAllItbScenarios(targetBuildingBlocks: string[], featureSource?: string): Promise<ConformanceAttestationReceipt>;
