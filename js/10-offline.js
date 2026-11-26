/* ===== Offline support: service worker + offline banner ===== */
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(e=>console.warn('sw:',e)));
(function(){const bar=document.createElement('div');bar.id='offbar';bar.style.cssText='display:none;position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#C9871A;color:#10240F;font:600 13px/1.3 system-ui,sans-serif;text-align:center;padding:6px 10px calc(6px + env(safe-area-inset-bottom))';
const up=()=>{const off=!navigator.onLine;bar.textContent=off?'📴 Offline — app local data se chal raha hai, network aate hi sync ho jayega':'';bar.style.display=off?'block':'none';if(!off&&bar.dataset.was){bar.dataset.was='';try{toast('✓ Online — data sync ho raha hai')}catch(e){}}if(off)bar.dataset.was='1'};
document.body.appendChild(bar);addEventListener('online',up);addEventListener('offline',up);up()})();
