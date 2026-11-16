import { describe, it, expect } from "vitest";
import { runAllItbScenarios } from "../src/cli.js";
import { buildDailyTreasuryMerkleRoot } from "../src/merkle-audit.js";

describe("Nigeria Stack Interoperability Test Bed (ITB-01 to ITB-05)", () => {
  it("passes all 5 normative Gherkin BDD scenarios and emits a 64-char SHA-256 receipt", () => {
    const receipt = runAllItbScenarios(["BB-02", "BB-04", "BB-05", "BB-06", "BB-12"]);
    expect(receipt.allScenariosPassed).toBe(true);
    expect(receipt.scenarios).toHaveLength(5);
    expect(receipt.attestationSha256Digest).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rejects any 774-LGA or Court revenue split with non-zero platform or SJLGA escrow (ITB-04)", () => {
    expect(() =>
      buildDailyTreasuryMerkleRoot([
        {
          envelopeUlid: "cop_01JBM8K9P2Q4R6S8T0V2W4X999",
          lgaOrCourtCode: "LA-LGA-11",
          statutoryAmountKobo: 50000,
          platformEscrowAmountKobo: 500,
          stateIntermediaryEscrowKobo: 0,
        },
      ])
    ).toThrow(/TREASURY_PASSTHROUGH_INVARIANCE_BREACH/);
  });
});
