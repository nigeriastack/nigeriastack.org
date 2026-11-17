import {gzipSync} from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import handler from '../dist/server/server.js';
const pages=['/','/sectors','/protocols','/rfcs','/conformance','/atlas/states','/atlas/lga-774','/governance','/atlas/states/AB','/atlas/lga-774/AB/AB-LGA-01','/rfcs/NS-RFC-014'];
const reports=[];
for(const route of pages){const response=await handler.fetch(new Request('http://localhost'+route));if(response.status!==200)throw Error(`SSR ${route}: ${response.status}`);const html=await response.text();const refs=[...html.matchAll(/(?:src|href)="([^"?#]+\.(?:css|js))"/g)].map(m=>m[1]);const assets=[...new Set(refs)];let bytes=gzipSync(html).length;for(const file of assets){const local=path.join(process.cwd(),'dist/client',file);if(!fs.existsSync(local))throw Error(`Missing critical asset: ${file}`);bytes+=gzipSync(fs.readFileSync(local)).length;}if(bytes>35840)throw Error(`Critical transfer budget ${route}: ${bytes}>35840`);if(/<script[^>]+(?:assets\/index-|type="module")/.test(html))throw Error(`Lite route loaded hydration bundle: ${route}`);reports.push({route,status:response.status,criticalGzipBytes:bytes,assets});}
fs.mkdirSync('dist/reports',{recursive:true});fs.writeFileSync('dist/reports/critical-transfer.json',JSON.stringify({budget:35840,method:'sum of gzip HTML plus all linked CSS and script assets; verifier imported only after user action',pages:reports},null,2));console.log('Critical transfer budget:',reports.map(r=>`${r.route}=${r.criticalGzipBytes}`).join(', '));
