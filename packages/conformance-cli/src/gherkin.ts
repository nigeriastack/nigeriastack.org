/** Strict parser for this repository's Scenario/Given/When/Then/And Gherkin subset. */
export interface FeatureStep { keyword: string; text: string; line: number }
export interface FeatureScenario { id: string; title: string; steps: FeatureStep[] }
export interface StepBinding { pattern: RegExp; execute: (...captures: string[]) => void | Promise<void> }
export function parseGherkin(source: string): FeatureScenario[] {
  const scenarios: FeatureScenario[] = [];
  let featureSeen = false;
  for (const [index, raw] of source.split(/\r?\n/).entries()) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    if (line.startsWith("Feature:") && !featureSeen && scenarios.length === 0) { featureSeen = true; continue; }
    const scenario = /^Scenario: (ITB-\d{2}) (.+)$/.exec(line);
    if (scenario) {
      if (!featureSeen || scenarios.some(s => s.id === scenario[1])) throw new Error(`Invalid scenario at line ${index + 1}`);
      scenarios.push({ id: scenario[1], title: scenario[2], steps: [] }); continue;
    }
    const step = /^(Given|When|Then|And) (.+)$/.exec(line);
    if (step && scenarios.length) { scenarios.at(-1)!.steps.push({ keyword: step[1], text: step[2], line: index + 1 }); continue; }
    if (featureSeen && !scenarios.length && /^(As |I |So )/.test(line)) continue;
    throw new Error(`Unsupported Gherkin at line ${index + 1}: ${line}`);
  }
  if (!featureSeen || !scenarios.length || scenarios.some(s => !s.steps.length || s.steps[0].keyword !== "Given" || !s.steps.some(step => step.keyword === "Then"))) throw new Error("Incomplete Gherkin feature");
  return scenarios;
}
export async function executeScenario(scenario: FeatureScenario, bindings: StepBinding[], onStep?: (completed: number) => void): Promise<number> {
  let executed = 0;
  for (const step of scenario.steps) {
    const matches = bindings.map(binding => ({ binding, match: binding.pattern.exec(step.text) })).filter(item => item.match);
    if (matches.length !== 1) throw new Error(`${scenario.id} line ${step.line}: ${matches.length ? "ambiguous" : "unbound"} step: ${step.text}`);
    try { await matches[0].binding.execute(...matches[0].match!.slice(1)); }
    catch (error) { throw new Error(`${scenario.id} line ${step.line}: ${error instanceof Error ? error.message : String(error)}`); }
    executed++;
    onStep?.(executed);
  }
  return executed;
}
