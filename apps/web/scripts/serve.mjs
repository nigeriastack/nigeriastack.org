import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import handler from '../dist/server/server.js';
const root=path.resolve('dist/client');
const types={'.xml':'application/xml','.css':'text/css','.js':'text/javascript','.json':'application/json','.html':'text/html','.txt':'text/plain','.md':'text/markdown','.yaml':'application/yaml'};
const port=Number(process.env.PORT||3000);
http.createServer(async(req,res)=>{try{const url=new URL(req.url,`http://localhost:${port}`);const filename=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(filename.startsWith(root+path.sep)){try{const data=await fs.readFile(filename);res.writeHead(200,{'content-type':types[path.extname(filename)]||'application/octet-stream'});res.end(data);return;}catch{}}
const response=await handler.fetch(new Request(url,{method:req.method,headers:req.headers}));res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(error){res.writeHead(500,{'content-type':'text/plain'});res.end('Page unavailable');console.error(error);}}).listen(port,'0.0.0.0',()=>console.log(`Production SSR on http://localhost:${port}`));
