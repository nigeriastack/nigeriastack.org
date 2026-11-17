import {build} from 'vite';
import fs from 'node:fs';
import path from 'node:path';
const app=process.cwd(),root=path.resolve(app,'../..');
await build({configFile:false,publicDir:false,build:{target:'es2022',emptyOutDir:false,outDir:'dist/client',lib:{entry:path.join(app,'src/browser-verifier.ts'),formats:['es'],fileName:()=> 'verifier.js'},minify:true,rollupOptions:{output:{inlineDynamicImports:true}}}});
const output=path.join(app,'dist/client/sources');fs.mkdirSync(output,{recursive:true});
const sourceFiles=['content/taxonomy/master-32-industry-matrix.json','content/atlas/subnational-36states-fct-atlas.json','content/atlas/lga-774-constitutional-registry.json','content/atlas/lga-14-service-modules-spec.json','content/atlas/evidence-sources.json','content/canonical/audited-faq-nigeriastack-15.json','docs/content/authority-and-precedence.md','docs/governance/NIGERIA_STACK_INSTITUTIONAL_CHARTER.md','docs/playbooks/IMPLEMENTATION_GUIDANCE_ARCHITECTURE.md'];
for(const dir of ['content/canonical/reviewed-v2.1','specs/rfcs','specs/openapi/v2026','specs/schemas/json-schema-2020-12'])for(const f of fs.readdirSync(path.join(root,dir)))sourceFiles.push(`${dir}/${f}`);
for(const file of sourceFiles)fs.copyFileSync(path.join(root,file),path.join(output,path.basename(file)));
fs.writeFileSync(path.join(output,'rfc-register.json'),JSON.stringify(sourceFiles.filter(f=>f.startsWith('specs/rfcs/')).map(f=>({id:path.basename(f).match(/NS-RFC-\d+/)[0],source:`/sources/${path.basename(f)}`})),null,2));
// Local rendering is reviewable; no public deployment URLs have passed release evidence.
fs.writeFileSync(path.join(app,'dist/client/sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
// Budget validation renders actual production routes and counts critical CSS/JS.
await import('./verify-budget.mjs');

await import('./verify-http-inventory.mjs');
