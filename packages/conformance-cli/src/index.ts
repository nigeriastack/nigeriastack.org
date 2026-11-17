/** Executable repository Gherkin fixtures; not deployed-system accreditation. */
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { sha256NodeHex, buildDailyTreasuryMerkleRoot } from "./merkle-audit.js";
import { parseGherkin, executeScenario } from "./gherkin.js";
import { createItbFixture } from "./itb-fixtures.js";
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

export async function runAllItbScenarios(targetBuildingBlocks: string[], featureSource?: string): Promise<ConformanceAttestationReceipt> {
  const source = featureSource ?? readFileSync(new URL("../../../tests/conformance-itb/features/ns_itb_full_conformance.feature", import.meta.url), "utf8");
  const feature = parseGherkin(source);
  if (feature.length !== 5 || ["ITB-01", "ITB-02", "ITB-03", "ITB-04", "ITB-05"].some(id => !feature.some(s => s.id === id))) throw new Error("ITB feature must contain each of ITB-01 through ITB-05 exactly once");
  const scenarios: ItbScenarioResult[] = [];
  for (const scenario of feature) {
    const start = performance.now();
    const fixture = createItbFixture(scenario.id);
    let status: ItbScenarioResult["status"] = "PASS", executedSteps = 0;
    let deterministicAssertion = "";
    try {
      executedSteps = await executeScenario(scenario, fixture.bindings, completed => { executedSteps = completed; });
      deterministicAssertion = `${executedSteps} Gherkin steps executed against local SDK fixtures.`;
    } catch (error) {
      status = "FAIL"; deterministicAssertion = error instanceof Error ? error.message : String(error);
    }
    scenarios.push({ scenarioId: scenario.id as ItbScenarioResult["scenarioId"], title: scenario.title, governingRfc: fixture.rfc,
      status, deterministicAssertion, executedSteps, limitations: fixture.limitations, elapsedMs: performance.now() - start });
  }
  const unsignedReceipt = {
    attestationId: `att_${randomUUID()}`, specVersion: "2026.6.5" as const, license: "CC0-1.0" as const,
    verificationScope: "LOCAL_REFERENCE_SDK_ONLY" as const, targetBuildingBlocks, executedAtUtc: new Date().toISOString(),
    featureSha256Digest: sha256NodeHex(source),
    allScenariosPassed: scenarios.every(s => s.status === "PASS"), scenarios,
    treasuryMerkleAuditSample: buildDailyTreasuryMerkleRoot([{ envelopeUlid: "cop_01JBM8K9P2Q4R6S8T0V2W4X700", lgaOrCourtCode: "LA-LGA-01", statutoryAmountKobo: 50000, platformEscrowAmountKobo: 0, stateIntermediaryEscrowKobo: 0 }]),
  };
  return { ...unsignedReceipt, attestationSha256Digest: sha256NodeHex(JSON.stringify(unsignedReceipt)) };
}
