/* ===== Owner analytics: sales / profit / loss / expiry (Products tab) ===== */
let AN={r:'today',a:'',b:'',st:'all',sort:'pf'};
const ld=t=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const money=x=>(x<0?'−':'')+'₹'+Math.abs(Math.round(x)).toLocaleString('en-IN');
const gcol=x=>x<0?'var(--bad)':'#2EAD66';
const odate=o=>{if(o.ts)return ld(o.ts);const p=String(o.date||'').split(/[\/\-\.]/).map(Number);if(p.length<3||p.some(isNaN))return '';let d,m,y;if(p[0]>31)[y,m,d]=p;else[d,m,y]=p;if(m>12&&d<=12)[d,m]=[m,d];if(y<100)y+=2000;return y+'-'+String(m).padStart(2,'0')+'-'+String(d).padStart(2,'0')};
const anRange=()=>{const n=new Date(),t=ld(n),sh=k=>{const d=new Date(n);d.setDate(d.getDate()-k);return ld(d)};
if(AN.r=='today')return[t,t];if(AN.r=='yest')return[sh(1),sh(1)];if(AN.r=='7')return[sh(6),t];if(AN.r=='30')return[sh(29),t];if(AN.r=='mon')return[t.slice(0,8)+'01',t];if(AN.r=='cus')return[AN.a||'',AN.b||''];return['','']};
function olines(o){if(Array.isArray(o.lines)&&o.lines.length)return o.lines;const out=[];(o.items||[]).forEach(s=>{const m=String(s).match(/^(.*?)(?: \(([^()]*)\))? ×(\d+) = ₹(\d+)$/);if(!m)return;const n=m[1],q=+m[3],amt=+m[4],p=S.products.find(x=>x.en==n||x.hi==n);if(p){const v=p.vars.find(x=>x.s==m[2])||p.vars[0];return out.push({t:'p',id:p.id,n:p.en,q,amt,cost:+(v&&v.c)||0})}const k=S.kits.find(x=>x.en==n||x.hi==n);if(k)out.push({t:'k',id:k.id,n:k.en,q,amt,cost:+k.cost||0})});return out}
function anData(a,b){const M={},mk=(t,x)=>M[t+x.id]=M[t+x.id]||{t,id:x.id,n:x.en,o:x,q:0,rev:0,cost:0};
S.products.forEach(p=>mk('p',p));S.kits.forEach(k=>mk('k',k));let n=0,old=0,items=0;
S.orders.forEach(o=>{if(AN.st=='del'&&o.st!='Delivered')return;const d=odate(o);if((a||b)&&!d)return;if(a&&d<a)return;if(b&&d>b)return;const L=olines(o);if(!L.length){old++;return}n++;const f=o.sub>0?Math.max(0,o.sub-(o.disc||0))/o.sub:1;
L.forEach(l=>{const r=M[l.t+l.id];if(!r)return;r.q+=l.q;r.rev+=l.amt*f;r.cost+=(+l.cost||0)*l.q;items+=l.q})});
const L=Object.values(M);L.forEach(r=>r.pf=r.rev-r.cost);const T={rev:0,cost:0,pf:0,n,items,old};L.forEach(r=>{T.rev+=r.rev;T.cost+=r.cost;T.pf+=r.pf});return{L,T}}
const unitRows=r=>r.t=='k'?[{s:'',p:+r.o.price||0,c:+r.o.cost||0}]:r.o.vars.map(v=>({s:v.s,p:ep(r.o,v).price,c:+v.c||0}));
const expD=o=>o&&o.ex?Math.floor((new Date(o.ex+'T23:59:59')-Date.now())/864e5):null;
const anLine=(l,v,c)=>`<div class="row" style="padding:3px 0"><span class="mut">${l}</span><b${c?` style="color:${c}"`:''}>${v}</b></div>`;
const anBox=(l,v,c)=>`<div style="flex:1;text-align:center;min-width:90px;padding:4px 0"><div class="mut">${l}</div><b style="font-size:17px;color:${c||'inherit'}">${v}</b></div>`;
function anCard(r){const U=unitRows(r),st=r.t=='p'?r.o.stock:null,sv=st==null?null:st*U[0].c,dd=expD(r.o);
return U.map(u=>`<div style="margin-bottom:6px">${u.s?`<div class="tag">${esc(u.s)}</div>`:''}${anLine(H('खरीद मूल्य (Buying)','Buying Price'),u.c?money(u.c):H('सेट नहीं','not set'))}${anLine(H('बिक्री मूल्य','Selling Price'),money(u.p))}${anLine(H('मार्जिन / यूनिट','Margin / unit'),u.c?money(u.p-u.c):'—',u.c?gcol(u.p-u.c):'')}</div>`).join('')
+anLine(H('मौजूदा स्टॉक','Current Stock'),st==null?'—':st)+anLine(H('स्टॉक वैल्यू','Stock Value'),sv==null?'—':money(sv))
+(dd==null?'':anLine(H('एक्सपायरी','Expiry'),esc(fmtD(r.o.ex))+' · '+(dd<0?H('एक्सपायर','Expired'):dd+' '+H('दिन बचे','days left')),dd<0?'var(--bad)':dd<=30?'#C9871A':''))
+'<hr style="border:0;border-top:1.5px dashed var(--g);margin:8px 0">'
+anLine('Total Qty Sold',r.q)+anLine('Total Revenue',money(r.rev))+anLine('Total Cost',money(r.cost))+anLine('<b>Total '+(r.pf<0?'Loss':'Profit')+'</b>','<b>'+money(Math.abs(r.pf))+'</b>',gcol(r.pf))}
const anRk=(ti,L,fn,em)=>`<div class="card"><b>${ti}</b>${L.length?L.map((r,i)=>`<div class="arow"><div class="nm">${i+1}. ${esc(r.n)}<span style="float:right;text-align:right">${fn(r)}</span></div></div>`).join(''):`<div class="mut">${em||'—'}</div>`}</div>`;
function anHtml(){const[a,b]=anRange(),D=anData(a,b),T=D.T,L=D.L,td=ld(Date.now()),TT=anData(td,td).T;
const ch=[['today','आज','Today'],['yest','कल','Yesterday'],['7','7 दिन','7 days'],['30','30 दिन','30 days'],['mon','इस महीने','This month'],['all','कुल','All time'],['cus','कस्टम','Custom']];
const sel=(v,x,t)=>`<option value="${v}" ${x==v?'selected':''}>${t}</option>`;
const noCost=L.filter(r=>r.q>0&&unitRows(r).some(u=>!u.c)).length;
const sold=L.filter(r=>r.q>0),act=L.filter(r=>r.t=='k'||r.o.on!==0);
const exp=L.map(r=>({r,d:expD(r.o)})).filter(x=>x.d!=null),stv=r=>r.t=='p'?r.o.stock:0,loss=r=>stv(r)*unitRows(r)[0].c;
const srt={pf:(x,y)=>y.pf-x.pf,pfa:(x,y)=>x.pf-y.pf,q:(x,y)=>y.q-x.q,n:(x,y)=>x.n.localeCompare(y.n)}[AN.sort]||((x,y)=>y.pf-x.pf);
const dr=a||b?(fmtD(a)||'…')+' → '+(fmtD(b)||'…'):H('सभी तारीखें','All dates');
return `<div class="card"><b>📊 ${H('बिक्री, लाभ और हानि','Sales, Profit & Loss')}</b>
<div class="acts" style="margin:10px 0 0;flex-wrap:wrap">${anBox(H('आज की बिक्री','Today sales'),money(TT.rev))}${anBox(H('आज का '+(TT.pf<0?'नुकसान':'लाभ'),'Today '+(TT.pf<0?'loss':'profit')),money(Math.abs(TT.pf)),gcol(TT.pf))}${anBox(H('आज के ऑर्डर','Today orders'),TT.n)}</div></div>
<div class="card"><b>${H('रिपोर्ट अवधि','Report period')}</b><div class="chips">${ch.map(c=>`<span class="chip" style="${AN.r==c[0]?'background:var(--g);color:#fff':''}" onclick="AN.r='${c[0]}';draw()">${H(c[1],c[2])}</span>`).join('')}</div>
${AN.r=='cus'?`<div class="grid2"><label>${H('से','From')}<input type="date" value="${AN.a}" onchange="AN.a=this.value;draw()"></label><label>${H('तक','To')}<input type="date" value="${AN.b}" onchange="AN.b=this.value;draw()"></label></div>`:''}
<label>${H('कौन से ऑर्डर गिनें','Orders to count')}<select onchange="AN.st=this.value;draw()">${sel('all',AN.st,H('सभी ऑर्डर','All orders'))}${sel('del',AN.st,H('सिर्फ Delivered','Delivered only'))}</select></label>
<div class="mut" style="margin-top:8px">${dr}</div>
<div class="acts" style="margin:8px 0 0;flex-wrap:wrap">${anBox(H('बिक्री','Revenue'),money(T.rev))}${anBox(H('खरीद लागत','Cost'),money(T.cost))}${anBox(T.pf<0?H('हानि','Loss'):H('लाभ','Profit'),money(Math.abs(T.pf)),gcol(T.pf))}${anBox(H('ऑर्डर','Orders'),T.n)}${anBox(H('बिके आइटम','Items sold'),T.items)}</div>
${noCost?`<div class="note warn">${H(noCost+' प्रोडक्ट/किट का Buying price सेट नहीं है, इसलिए उनका लाभ ज़्यादा दिखेगा। Edit में Sizes की हर लाइन में चौथा नंबर (खरीद मूल्य) डालें।',noCost+' product(s)/kit(s) have no buying price, so their profit is overstated. In Edit, add the 4th value (buying price) on each Sizes line.')}</div>`:''}
${T.old?`<div class="note">${H(T.old+' पुराने ऑर्डर में प्रोडक्ट डिटेल नहीं मिली, वे शामिल नहीं हैं।',T.old+' older order(s) had no readable product details and are not included.')}</div>`:''}</div>`
+anRk('🏆 '+H('सबसे ज़्यादा लाभ वाले प्रोडक्ट','Top profitable products'),sold.slice().sort((x,y)=>y.pf-x.pf).slice(0,5),r=>`<b style="color:${gcol(r.pf)}">${money(r.pf)}</b> <span class="mut">· ${r.q} ${H('बिके','sold')}</span>`,H('इस अवधि में कोई बिक्री नहीं','No sales in this period'))
+anRk('🔥 '+H('सबसे ज़्यादा बिकने वाले','Top selling products'),sold.slice().sort((x,y)=>y.q-x.q).slice(0,5),r=>`<b>${r.q}</b> <span class="mut">${H('बिके','sold')} · ${money(r.rev)}</span>`,H('इस अवधि में कोई बिक्री नहीं','No sales in this period'))
+anRk('🐢 '+H('कम बिकने वाले','Low selling products'),act.slice().sort((x,y)=>x.q-y.q||x.pf-y.pf).slice(0,5),r=>`<b>${r.q}</b> <span class="mut">${H('बिके','sold')}</span>`)
+anRk('📉 '+H('घाटे वाले प्रोडक्ट','Loss-making products'),L.filter(r=>r.q>0&&r.pf<0).sort((x,y)=>x.pf-y.pf),r=>`<b style="color:var(--bad)">${money(r.pf)}</b>`,H('कोई प्रोडक्ट घाटे में नहीं','No loss-making products'))
+anRk('⏳ '+H('जल्द एक्सपायर (30 दिन में)','Near expiry (within 30 days)'),exp.filter(x=>x.d>=0&&x.d<=30).sort((x,y)=>x.d-y.d).map(x=>x.r),r=>{const d=expD(r.o);return `<b style="color:#C9871A">${d} ${H('दिन','days')}</b> <span class="mut">· ${esc(fmtD(r.o.ex))}${r.t=='p'?' · '+H('स्टॉक','stock')+' '+r.o.stock:''}</span>`},H('कोई प्रोडक्ट जल्द एक्सपायर नहीं हो रहा','Nothing expiring soon'))
+anRk('⛔ '+H('एक्सपायर हो चुके','Expired products'),exp.filter(x=>x.d<0).sort((x,y)=>x.d-y.d).map(x=>x.r),r=>`<b style="color:var(--bad)">${esc(fmtD(r.o.ex))}</b> <span class="mut">${r.t=='p'?'· '+H('स्टॉक','stock')+' '+r.o.stock+(loss(r)?' · '+H('नुकसान','loss')+' '+money(loss(r)):''):''}</span>`,H('कोई एक्सपायर प्रोडक्ट नहीं','No expired products'))
+`<div class="card"><b>📦 ${H('प्रोडक्ट-वार लाभ / हानि','Product-wise profit / loss')}</b><label>${H('क्रम','Sort by')}<select onchange="AN.sort=this.value;draw()">${sel('pf',AN.sort,H('सबसे ज़्यादा लाभ','Highest profit'))}${sel('pfa',AN.sort,H('सबसे कम लाभ / ज़्यादा हानि','Lowest profit / most loss'))}${sel('q',AN.sort,H('सबसे ज़्यादा बिक्री','Most sold'))}${sel('n',AN.sort,H('नाम','Name'))}</select></label>
${L.slice().sort(srt).map(r=>`<details><summary>${esc(r.n)} <span style="float:right"><span class="mut">${r.q} ${H('बिके','sold')} · </span><b style="color:${gcol(r.pf)}">${money(r.pf)}</b></span></summary><div style="padding:6px 0">${anCard(r)}</div></details>`).join('')||'<div class="mut">—</div>'}</div>`}

OPT.anHtml=anHtml;
