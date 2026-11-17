#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { runAllItbScenarios } from "./index.js";
export * from "./index.js";

export async function main(args: string[]): Promise<number> {
  if (args[0] !== "certify") {
    console.error("Usage: conformance-cli certify [--bb BB-01,BB-02] [--out receipt.json]");
    return 2;
  }
  const options = new Map<string, string>();
  for (let i = 1; i < args.length; i += 2) {
    if (!["--bb", "--out"].includes(args[i]) || !args[i + 1] || args[i + 1].startsWith("--") || options.has(args[i])) {
      console.error("Invalid, duplicate, or missing option value."); return 2;
    }
    options.set(args[i], args[i + 1]);
  }
  const targets = options.get("--bb")?.split(",") ?? [];
  if (targets.some(target => !/^BB-(0[1-9]|1[0-2])$/.test(target))) {
    console.error("Building block labels must be BB-01 through BB-12."); return 2;
  }
  const receipt = await runAllItbScenarios(targets);
  if (options.has("--out")) writeFileSync(options.get("--out")!, JSON.stringify(receipt, null, 2), "utf8");
  for (const scenario of receipt.scenarios) console.log(`[${scenario.status}] ${scenario.scenarioId}: ${scenario.deterministicAssertion}`);
  console.log("Scope: local reference SDK checks; target labels do not establish deployed-system coverage.");
  console.log(`[ATTESTATION SHA-256] ${receipt.attestationSha256Digest}`);
  return receipt.allScenariosPassed ? 0 : 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).then(code => { process.exitCode = code; }).catch(error => { console.error(error); process.exitCode = 1; });
}
