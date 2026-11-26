/* PanchTatva service worker — offline app shell. Bump VER on every app update to force refresh. */
const VER='pt-v1',CORE=VER+'-core',RT=VER+'-rt';
const PRE=['https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js','https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js','https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js'];
const LOCAL=['./','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CORE).then(async c=>{await Promise.all(LOCAL.map(u=>c.add(u).catch(()=>{})));await Promise.all(PRE.map(u=>c.add(new Request(u,{mode:'no-cors'})).catch(()=>{})))}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>!x.startsWith(VER)).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const OK=u=>u.origin==location.origin||/(^|\.)gstatic\.com$|^cdnjs\.cloudflare\.com$|^fonts\.googleapis\.com$|^res\.cloudinary\.com$/.test(u.hostname);
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!='GET')return;const u=new URL(r.url);if(!OK(u)||/firestore\.googleapis|identitytoolkit|securetoken|\/v1_1\//.test(u.href))return;
if(r.mode=='navigate'){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CORE).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./'))));return}
e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res&&(res.ok||res.type=='opaque')){const cp=res.clone();caches.open(u.origin==location.origin||PRE.includes(r.url)?CORE:RT).then(c=>c.put(r,cp))}return res}).catch(()=>hit);return hit||net}))});
