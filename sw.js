const C="belior-v1";
const CORE=["./","index.html","manifest.webmanifest","img/hero-gala.jpg","img/music-arrival.jpg","img/private-hall.jpg","img/maison-box.jpg","img/monogram-full-gold.jpg","img/wordmark-main-ivory.png","img/wordmark-everyday-ink.png","img/symbol-ink.png","icons/icon-192.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET"||r.headers.has("range"))return;
 e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok&&new URL(r.url).origin===location.origin){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;}).catch(()=>caches.match("index.html"))));});
