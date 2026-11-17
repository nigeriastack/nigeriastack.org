import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import SwaggerParser from '@apidevtools/swagger-parser';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { tsImport } from 'tsx/esm/api';

const root = fileURLToPath(new URL('../../', import.meta.url));
const schemaDir = join(root, 'specs/schemas/json-schema-2020-12');
const templateDir = join(root, 'specs/clearam-templates');
const openapiDir = join(root, 'specs/openapi/v2026');
const schemaPrefix = 'https://nigeriastack.org/schemas/v2026/';
const dialect = 'https://json-schema.org/draft/2020-12/schema';
const httpMethods = new Set(['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']);

async function files(dir, suffix) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries.filter(entry => entry.isFile() && entry.name.endsWith(suffix))
    .map(entry => join(entry.parentPath, entry.name)).sort();
}
async function json(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (err) {
    throw new Error(`${relative(root, path)}: ${err.message}`, { cause: err });
  }
}

async function main() {
  // strictTypes/strictRequired impose additional AJV authoring rules beyond
  // draft 2020-12. Conditional fragments may inherit type and required fields.
  const ajv = new Ajv2020({ allErrors: true, strictTypes: false, strictRequired: false });
  addFormats(ajv);
  const schemas = await files(schemaDir, '.schema.json');
  const dataFiles = await files(join(root, 'content'), '.json');
  const contentSchemas = dataFiles.filter(path => path.endsWith('.schema.json'));
  const registered = new Map();
  for (const path of [...schemas, ...contentSchemas]) {
    const schema = await json(path);
    assert.equal(schema.$schema, dialect, path);
    assert.ok(schema.$id, `Missing schema ID in ${path}`);
    if (dirname(path) === schemaDir) assert.equal(schema.$id, schemaPrefix + relative(schemaDir, path));
    ajv.addSchema(schema);
    registered.set(schema.$id, path);
  }
  for (const id of registered.keys()) assert.ok(ajv.getSchema(id), id);

  const glossary = await readFile(join(root, 'docs/standards/SOVEREIGN_NAMING_AND_PROTOCOL_GLOSSARY.md'), 'utf8');
  for (const [id] of glossary.matchAll(/https:\/\/nigeriastack\.org\/schemas\/v2026\/[\w-]+\.schema\.json/g)) {
    assert.ok(registered.has(id), `Unresolved glossary schema ${id}`);
  }

  function validate(id, value, label) {
    const check = ajv.getSchema(id);
    assert.ok(check, `${label}: unresolved schema ${id}`);
    assert.ok(check(value), `${label}: ${ajv.errorsText(check.errors)}`);
  }

  let instances = 0;
  for (const path of dataFiles.filter(path => !contentSchemas.includes(path))) {
    const data = await json(path);
    if (!data.$schema) continue;
    validate(data.$schema, data, relative(root, path));
    instances++;
  }
  const catalogPath = join(templateDir, 'clearam-template-catalog.json');
  const catalog = await json(catalogPath);
  validate(catalog.$schema, catalog, relative(root, catalogPath));
  const templateIds = new Set();
  for (const item of catalog.templates) {
    assert.ok(!templateIds.has(item.templateId), `Duplicate template ${item.templateId}`);
    templateIds.add(item.templateId);
    assert.ok(item.prohibitedScopes.every(scope => !item.permittedFieldScopes.includes(scope)), `Conflicting scope in ${item.templateId}`);
    assert.deepEqual(await json(join(templateDir, item.templateId + '.json')), item, item.templateId);
  }
  assert.equal((await files(templateDir, '.json')).length, templateIds.size + 1, 'Orphaned template');

  const apiFiles = await files(openapiDir, '.openapi.yaml');
  assert.ok(apiFiles.length, 'No OpenAPI contracts found');
  let operations = 0;
  for (const path of apiFiles) {
    const doc = await SwaggerParser.validate(path, { resolve: { http: false } });
    assert.equal(doc.openapi, '3.1.1', path);
    const operationIds = new Set();
    for (const [route, item] of Object.entries(doc.paths)) {
      const placeholders = [...route.matchAll(/\{([^}]+)\}/g)].map(match => match[1]);
      for (const [method, op] of Object.entries(item)) {
        if (!httpMethods.has(method)) continue;
        assert.ok(op.operationId && !operationIds.has(op.operationId), `${route}: missing or repeated operationId`);
        operationIds.add(op.operationId);
        const parameters = new Map();
        for (const list of [item.parameters ?? [], op.parameters ?? []]) {
          const seen = new Set();
          for (const p of list) {
            const key = [p.in, p.name].join(':');
            assert.ok(!seen.has(key), `${route}: duplicate parameter ${key}`);
            seen.add(key);
            parameters.set(key, p);
          }
        }
        const pathParams = [...parameters.values()].filter(p => p.in === 'path');
        assert.deepEqual(pathParams.map(p => p.name).sort(), [...new Set(placeholders)].sort(), `${method} ${route}: path parameters`);
        assert.ok(pathParams.every(p => p.required === true), `${route}: optional path parameter`);
        operations++;
      }
    }
    // Compile embedded request, response and parameter schemas too. Parser
    // dereferences OpenAPI JSON pointers and local relative file references.
    function checkSchemas(value) {
      if (!value || typeof value !== 'object') return;
      for (const [key, child] of Object.entries(value)) {
        if (key === 'schema') {
          if (child.$id && registered.has(child.$id)) continue;
          ajv.compile(child);
        } else if (key !== 'example' && key !== 'examples') {
          checkSchemas(child);
        }
      }
    }
    checkSchemas(doc.paths);
  }

  const { signSureEvidenceCredential } = await tsImport('../../packages/joinbody-sure-evidence-crypto/src/index.ts', import.meta.url);
  const keys = await crypto.subtle.generateKey('Ed25519', false, ['sign', 'verify']);
  const { credential } = await signSureEvidenceCredential({
    credentialId: 's84_01JBM8K9P2Q4R6S8T0V2W4X6Y8',
    documentBytes: new TextEncoder().encode('Local contract fixture'),
    issuingAuthority: { jurisdictionSlug: 'example.invalid', divisionOrDepartment: 'Records',
      certifyingOfficerName: 'Fixture officer', certifyingOfficerRole: 'Registrar', fido2KeyId: 'fixture-key' },
    deviceRegularity: { hardwareFingerprintSha256: '0'.repeat(64), operatingConditionState: 'NORMAL_CONTINUOUS_OPERATION',
      monotonicSealCounter: 1, clockSyncSource: 'GPS_HARDWARE_RTC' },
    ed25519PrivateKeyPkcs8: keys.privateKey, issuedAtUtc: '2026-01-01T00:00:00Z',
  });
  validate(schemaPrefix + 'SureEvidenceSdkCredential.schema.json', credential, 'JoinBody signer output');
  console.log(`Verified ${registered.size} draft 2020-12 schemas, ${instances} content instances, ${templateIds.size} ClearAm templates, ${apiFiles.length} OpenAPI 3.1.1 documents, ${operations} operations and one freshly signed SDK credential.`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
