/**
 * NIGERIASTACK.ORG — GATE NS-G1 STATIC NOMENCLATURE & ANTI-CAPTURE VERIFIER
 *
 * Scans all Markdown specifications, OpenAPI 3.1.1 YAML files, JSON Schemas,
 * and TypeScript/Python sources to block:
 *   1. Foreign DPI clone / `-NG` suffix mimicry (e.g., DEPA-NG, Beckn-NG, ONDC-NG)
 *   2. Sectionalized single-ethnic protocol names (e.g., Igbimo, OjaOpen, Orita, Ipinle)
 *   3. Vendor capture inside normative Layer 1-5 headings
 */


export interface NomenclatureViolation {
  readonly filePath: string;
  readonly lineNumber: number;
  readonly matchedToken: string;
  readonly ruleId:
    | 'NS-G1-NO-FOREIGN-CLONE'
    | 'NS-G1-NO-SECTIONAL-TERM'
    | 'NS-G1-NO-VENDOR-IN-LAYER-HEADING';
  readonly remediation: string;
}


const PROHIBITED_FOREIGN_CLONES: ReadonlyArray<{
  readonly pattern: RegExp;
  readonly replacement: string;
}> = [
  { pattern: /\bDEPA[-_]?NG\b|\bDepaConsent\b/gi, replacement: 'ClearanceMesh / ClearAm (urn:ngstack:clearam:v2026)' },
  { pattern: /\bBeckn[-_]?NG\b|\bONDC[-_]?NG\b/gi, replacement: 'OpenMarket / MarketLink (urn:ngstack:marketlink:v2026)' },
  { pattern: /\bDigiLocker[-_]?NG\b/gi, replacement: 'SureEvidence / SureProof (urn:ngstack:sure-evidence:v2026)' },
  { pattern: /\bACDP[-_]?NG\b/gi, replacement: 'Warrant & Mandate / GivePower (urn:ngstack:givepower:v2026)' },
  { pattern: /\bSGTraDex[-_]?NG\b/gi, replacement: 'TradeCorridor / PassCargo (urn:ngstack:passcargo:v2026)' },
  { pattern: /\bngstack[-_]?onix\b/gi, replacement: 'Unified Tooling SDKs / JoinBody (@nigeriastack/*)' },
  { pattern: /\bDiia\.Engine[-_]?NG\b/gi, replacement: 'Federated Local Registry Kernel / KioskBase (urn:ngstack:kioskbase:v2026)' },
  { pattern: /\bAPI[-_ ]?Setu[-_]?NG\b/gi, replacement: 'Confluence Gateway / Junction (urn:ngstack:confluence:v2026)' },
  { pattern: /\bAkomaNtoso[-_]?NG\b/gi, replacement: 'LawTree AST / StatuteProof (urn:ngstack:lawtree:v2026)' },
];


const PROHIBITED_SECTIONAL_TERMS: ReadonlyArray<{
  readonly pattern: RegExp;
  readonly replacement: string;
}> = [
  { pattern: /\bIgbim[ọo]\b/gi, replacement: 'ClearanceMesh / ClearAm' },
  { pattern: /\b[ÈE]r[íi]\s+Trust\b|\bEriTrust\b/gi, replacement: 'SureEvidence / SureProof' },
  { pattern: /\b[ỌO]jaOpen\b/gi, replacement: 'OpenMarket / MarketLink' },
  { pattern: /\bOr[íi]ta\s+(?:Interoperability|Gateway|Exchange|Bus)\b/gi, replacement: 'Confluence Gateway / Junction' },
  { pattern: /\b[ÀA][ṣs][ẹe]\s+Agent\b/gi, replacement: 'Warrant & Mandate / GivePower' },
  { pattern: /\b[ÌI]p[íi]nl[ẹe]\s+(?:Base|Registry|Kernel)\b/gi, replacement: 'Federated Local Registry Kernel / KioskBase' },
  { pattern: /\bK[ọo]r[íi]d[ọo]\b/gi, replacement: 'TradeCorridor / PassCargo' },
  { pattern: /\b[ÀA]k[óo]j[ọo]p[ọo]\b/gi, replacement: 'Unified Tooling SDKs / JoinBody' },
];


const VENDOR_IN_LAYER_HEADING_REGEX =
  /^#{1,4}\s+.*Layer\s+[1-5].*\b(MIDL|Metrosafe|MSS|courts\.com\.ng|openlaw\.org\.ng|justicelens\.ng|api\.net\.ng|McKolm|ResilienceAI)\b/i;

const ARCHIVED_ROUTE_INDEX = 'docs/review/subnational-municipal-v2.5/route-audit/corrected-route-index-CANDIDATE.json';
const ARCHIVED_SOURCE_HEADINGS = new Set([
  '"h1": "NS-RFC-005: LawTree AkomaNtoso-NG Bi-Temporal Statutory & Citation AST",',
  '"h1": "NS-RFC-008: GivePower Bounded Agent Delegation & Human Approval Protocol (ACDP-NG)",',
]);


export function auditFileContent(filePath: string, content: string): NomenclatureViolation[] {
  const violations: NomenclatureViolation[] = [];
  const lines = content.split(/\r?\n/);


  const isDeprecationGlossary = filePath.endsWith('SOVEREIGN_NAMING_AND_PROTOCOL_GLOSSARY.md');


  lines.forEach((line, index) => {
    const lineNumber = index + 1;


    if (VENDOR_IN_LAYER_HEADING_REGEX.test(line)) {
      violations.push({
        filePath,
        lineNumber,
        matchedToken: line.trim(),
        ruleId: 'NS-G1-NO-VENDOR-IN-LAYER-HEADING',
        remediation:
          'Purge private vendor/domain names from normative Layer 1–5 headings; list implementations only in the Accredited Reference Implementations Registry.',
      });
    }


    if (!isDeprecationGlossary && !(filePath === ARCHIVED_ROUTE_INDEX && ARCHIVED_SOURCE_HEADINGS.has(line.trim()))) {
      for (const rule of PROHIBITED_FOREIGN_CLONES) {
        const match = line.match(rule.pattern);
        if (match) {
          violations.push({
            filePath,
            lineNumber,
            matchedToken: match[0],
            ruleId: 'NS-G1-NO-FOREIGN-CLONE',
            remediation: `Replace foreign clone term "${match[0]}" with "${rule.replacement}".`,
          });
        }
      }
    }

    if (!isDeprecationGlossary) {
      for (const rule of PROHIBITED_SECTIONAL_TERMS) {
        const match = line.match(rule.pattern);
        if (match) {
          violations.push({
            filePath,
            lineNumber,
            matchedToken: match[0],
            ruleId: 'NS-G1-NO-SECTIONAL-TERM',
            remediation: `Replace sectional term "${match[0]}" with pan-Nigerian term "${rule.replacement}".`,
          });
        }
      }
    }
  });


  return violations;
}

import * as fs from 'node:fs';
import * as path from 'node:path';

function walkDir(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, out);
    } else if (/\.(md|yaml|yml|json|ts|tsx|py|html)$/i.test(entry.name) && entry.name !== 'verify-cleanroom-nomenclature.ts') {
      out.push(full);
    }
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('verify-cleanroom-nomenclature.ts')) {
  const rootDir = process.cwd();
  const files = walkDir(rootDir);
  const allViolations: NomenclatureViolation[] = [];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const v = auditFileContent(path.relative(rootDir, file), content);
    allViolations.push(...v);
  }
  if (allViolations.length > 0) {
    console.error(`[X GATE NS-G1 FAILED] ${allViolations.length} nomenclature violation(s) detected:`);
    for (const v of allViolations) {
      console.error(`  - ${v.filePath}:${v.lineNumber} [${v.ruleId}] Matched "${v.matchedToken}" -> ${v.remediation}`);
    }
    process.exit(1);
  }
  console.log(`[✓ GATE NS-G1 CERTIFIED PASS] Audited ${files.length} files: 0 foreign clones, 0 sectional terms, 0 vendor-in-layer-headings.`);
}
