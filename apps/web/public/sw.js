const CACHE='ngstack-public-v2026.11.17';
const CORE=['/','/enhance.js','/offline.html'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==location.origin||url.pathname.startsWith('/api/')||url.pathname.startsWith('/v1/')||url.pathname.startsWith('/.well-known/'))return;
 event.respondWith(fetch(request).then(response=>{if(response.ok&&(request.mode==='navigate'||/\.(css|js)$/.test(url.pathname))){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;}).catch(async()=>await caches.match(request)||(request.mode==='navigate'?await caches.match('/offline.html'):Response.error())));
});
