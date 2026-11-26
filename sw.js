/* PanchTatva service worker — offline app shell. App files: network-first (latest when online, cache when offline).
   Bump VER whenever you change/upload new files so old cache is cleared. */
const VER='pt-v3',CORE=VER+'-core',RT=VER+'-rt';
const CDN=['https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js','https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js','https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js'];
const LOCAL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','assets/logo.webp','assets/favicon.webp','css/style.css','css/extras.css',
'js/01-core.js','js/02-i18n-theme.js','js/03-views.js','js/04-cart-orders.js','js/05-appointments-diet.js','js/06-admin-actions.js','js/07-firebase.js','js/08-analytics.js','js/09-pl-alerts.js','js/10-offline.js','js/11-barcode.js','js/12-i18n-extra.js','js/99-boot.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CORE).then(async c=>{await Promise.all(LOCAL.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})));await Promise.all(CDN.map(u=>c.add(new Request(u,{mode:'no-cors'})).catch(()=>{})))}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>!x.startsWith(VER)).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const OK=u=>u.origin==location.origin||/(^|\.)gstatic\.com$|^cdnjs\.cloudflare\.com$|^fonts\.googleapis\.com$|^res\.cloudinary\.com$/.test(u.hostname);
const store=(r,res,name)=>{if(res&&(res.ok||res.type=='opaque')){const cp=res.clone();caches.open(name).then(c=>c.put(r,cp))}return res};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!='GET')return;const u=new URL(r.url);if(!OK(u)||/firestore\.googleapis|identitytoolkit|securetoken|\/v1_1\//.test(u.href))return;
if(u.origin==location.origin){/* own files: network first, cache as offline fallback */
e.respondWith(fetch(r).then(res=>store(r,res,CORE)).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode=='navigate'?caches.match('./').then(x=>x||caches.match('index.html')):Response.error()))));return}
e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>store(r,res,CDN.includes(r.url)?CORE:RT)).catch(()=>hit);return hit||net}))});
