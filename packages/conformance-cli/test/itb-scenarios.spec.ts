import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { parseGherkin, executeScenario } from "../src/gherkin.js";
import { runAllItbScenarios } from "../src/index.js";
import { main } from "../src/cli.js";
import { buildDailyTreasuryMerkleRoot, sha256NodeHex } from "../src/merkle-audit.js";
import * as transport from "@nigeriastack/confluence-transport";

const sample = { envelopeUlid: "test", lgaOrCourtCode: "TEST", statutoryAmountKobo: 50000, platformEscrowAmountKobo: 0, stateIntermediaryEscrowKobo: 0 };
describe("Executable local reference checks", () => {
  it("executes all five parsed Gherkin fixtures", async () => {
    const receipt = await runAllItbScenarios(["BB-02"]);
    expect(receipt.verificationScope).toBe("LOCAL_REFERENCE_SDK_ONLY");
    expect(receipt.scenarios.map(s => s.status)).toEqual(["PASS", "PASS", "PASS", "PASS", "PASS"]);
    expect(receipt.allScenariosPassed).toBe(true);
    expect(receipt.scenarios.every(s => s.limitations.length > 0)).toBe(true);
    const { attestationSha256Digest, ...unsigned } = receipt;
    expect(attestationSha256Digest).toBe(sha256NodeHex(JSON.stringify(unsigned)));
  });
  it("parses actual feature input and fails changed assertions or missing step bindings", async () => {
    const source = readFileSync(new URL("../../../tests/conformance-itb/features/ns_itb_full_conformance.feature", import.meta.url), "utf8");
    const parsed = parseGherkin(source);
    expect(parsed.map(s => s.steps.length)).toEqual([5, 5, 5, 4, 5]);
    const badCounter = await runAllItbScenarios([], source.replace('counter MUST equal 0', 'counter MUST equal 1'));
    expect(badCounter.scenarios[1].status).toBe("FAIL");
    const unbound = await runAllItbScenarios([], source.replace('counter MUST equal 0', 'counter MUST be untouched'));
    expect(unbound.scenarios[1].status).toBe("FAIL");
    expect(unbound.scenarios[1].deterministicAssertion).toContain("unbound step");
    await expect(executeScenario(parsed[0], [])).rejects.toThrow("unbound step");
    expect(() => parseGherkin(source + '\nScenario: ITB-01 duplicate\nGiven test\nThen test')).toThrow();
    expect(() => parseGherkin(source.replace('  Scenario: ITB-01', '  Scenario Outline: ITB-01'))).toThrow();
    await expect(runAllItbScenarios([], source.replace('ITB-05 GivePower', 'ITB-06 GivePower'))).rejects.toThrow("each of ITB-01");
  });
  it("records FAIL when an SDK violates a checked assertion", async () => {
    const spy = vi.spyOn(transport, "validateSafeRetryAttempt").mockReturnValue({ allowed: true, httpStatus: 202 });
    try {
      const receipt = await runAllItbScenarios([]);
      expect(receipt.scenarios[0].status).toBe("FAIL");
      expect(receipt.allScenariosPassed).toBe(false);
    } finally { spy.mockRestore(); }
  });
  it("returns zero for local reference success and rejects invalid commands/options", async () => {
    const out = vi.spyOn(console, "log").mockImplementation(() => {});
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(await main(["certify"])).toBe(0);
      expect(await main(["unknown"])).toBe(2);
      expect(await main(["certify", "--bb", "BB-99"])).toBe(2);
      expect(await main(["certify", "--out"])).toBe(2);
    } finally { out.mockRestore(); err.mockRestore(); }
  });
  it("rejects either nonzero escrow and invalid monetary amounts", () => {
    for (const field of ["platformEscrowAmountKobo", "stateIntermediaryEscrowKobo"]) {
      expect(() => buildDailyTreasuryMerkleRoot([{ ...sample, [field]: 1 }])).toThrow(/TREASURY_PASSTHROUGH_INVARIANCE_BREACH/);
    }
    for (const statutoryAmountKobo of [NaN, Infinity, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => buildDailyTreasuryMerkleRoot([{ ...sample, statutoryAmountKobo }])).toThrow(/INVALID_STATUTORY_AMOUNT_KOBO/);
    }
  });
});
