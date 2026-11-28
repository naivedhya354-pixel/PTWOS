/* ===== P&L automation + owner header alerts ===== */
const LOWSTK=10;
const plTabs=()=>`<div class="chips" style="margin:10px 0">${[['main',H('लाभ-हानि (P&L)','Profit & Loss')],['prod',H('📊 प्रोडक्ट-वार P&L','📊 Product-wise P&L')]].map(c=>`<span class="chip" style="${PLT==c[0]?'background:var(--g);color:#fff':''}" onclick="PLT='${c[0]}';draw()">${c[1]}</span>`).join('')}</div>`;
const feeOf=a=>{if(+a.fee>0)return +a.fee;const b=S.branches.find(x=>x.id==a.branch),d=b&&brDocs(b).find(x=>x.en==a.doctor);if(d&&+d.fee>0)return +d.fee;const o=DOCS.find(x=>x.en==a.doctor);return o&&+(S.fees||{})[o.id]||0};
function plAuto(){const out=[],td=ld(Date.now());
(S.appts||[]).forEach(a=>{if(apS(a)!='Confirmed'||!a.date)return;const f=feeOf(a);if(f>0)out.push({auto:1,type:'Income',cat:'Consultation fees',amt:f,date:a.date,branch:a.branch,note:a.doctor})});
S.orders.forEach(o=>{if(o.st!='Delivered')return;const L=olines(o);if(!L.length)return;const f=o.sub>0?Math.max(0,o.sub-(o.disc||0))/o.sub:1;let rev=0,cost=0;L.forEach(l=>{rev+=l.amt*f;cost+=(+l.cost||0)*l.q});const d=odate(o);
out.push({auto:1,type:'Income',cat:'Product / kit sales',amt:Math.round(rev),date:d,branch:o.branch,note:'#'+o.id});if(cost>0)out.push({auto:1,type:'Expense',cat:'Product / kit buying cost',amt:Math.round(cost),date:d,branch:o.branch,note:'#'+o.id})});
(S.bills||[]).forEach(b=>{if(b.st=='cancelled')return;const rev=b.reg?b.taxable:b.tot,cost=(b.lines||[]).reduce((t,l)=>t+(+l.cost||0)*l.q,0);out.push({auto:1,type:'Income',cat:'POS sales',amt:Math.round(rev),date:b.date,branch:b.branch,note:b.id});if(cost>0)out.push({auto:1,type:'Expense',cat:'POS buying cost',amt:Math.round(cost),date:b.date,branch:b.branch,note:b.id})});
S.products.forEach(p=>{const c=stkC(p);if(p.ex&&p.ex<td&&p.stock>0&&c>0)out.push({auto:1,type:'Expense',cat:'Expired stock loss',amt:Math.round(c*p.stock),date:p.ex,branch:'',note:p.en+' × '+p.stock})});
return out}
const CATHI={'Consultation fees':'डॉक्टर फीस','Product / kit sales':'प्रोडक्ट / किट बिक्री','Product / kit buying cost':'बिके प्रोडक्ट / किट की खरीद लागत','POS sales':'POS बिक्री','POS buying cost':'POS बिके माल की खरीद लागत','Expired stock loss':'एक्सपायर स्टॉक का नुकसान'};
const autoRows=L=>{const m={};L.filter(x=>x.auto).forEach(x=>{const k=x.type+x.cat;m[k]=m[k]||{type:x.type,cat:x.cat,amt:0,n:0};m[k].amt+=x.amt;m[k].n++});return Object.values(m).map(x=>`<div class="arow"><div class="nm">🤖 ${x.type=='Income'?'➕':'➖'} ${esc(H(CATHI[x.cat]||x.cat,x.cat))} <span class="tag">auto · ${x.n}</span><b style="float:right;color:${x.type=='Income'?'#1B7F3B':'var(--bad)'}">${inr(x.amt)}</b></div></div>`).join('')};
const plFees=()=>`<div class="card"><b>👨‍⚕️ ${H('डॉक्टर फीस (अगर ब्रांच में फीस नहीं डाली)','Doctor fee (used only if the branch has no fee)')}</b><div class="mut">${H('अपॉइंटमेंट Confirm होते ही फीस अपने आप Income में जुड़ जाती है। Delivered ऑर्डर की बिक्री Income में और उसकी खरीद लागत Expenses में अपने आप जुड़ती है, इसलिए बिक्री का मुनाफ़ा Profit में दिखता है।','Fee is added to Income automatically when an appointment is Confirmed. Delivered order sales go to Income and their buying cost to Expenses automatically, so the sale profit shows up in Profit.')}</div>${DOCS.map(d=>`<label>${esc(d.en)}<input type="number" min="0" placeholder="0" value="${+(S.fees||{})[d.id]||''}" onchange="S.fees=S.fees||{};S.fees['${d.id}']=+this.value||0;save();draw()"></label>`).join('')}</div>`;
function stAlerts(){const td=ld(Date.now()),ex=[],nr=[],lo=[];
S.products.concat(S.kits).forEach(o=>{const d=expD(o),k=!!o.price&&!o.vars,st=k?null:o.stock,n=esc(nm(o));
if(d!=null&&d<0)ex.push('⛔ '+n+' — '+H('एक्सपायर','expired')+' '+esc(fmtD(o.ex)));else if(d!=null&&d<=30)nr.push('⏳ '+n+' — '+d+' '+H('दिन में एक्सपायर','days to expiry')+' ('+esc(fmtD(o.ex))+')');
if(st!=null&&st<=LOWSTK)lo.push('📉 '+n+' — '+(st<=0?H('स्टॉक खत्म','out of stock'):H('कम स्टॉक: ','low stock: ')+st))});
return[...ex,...nr,...lo]}
const stBar=()=>{if(!S.staffUser||S.staffUser.role!='super')return '';const L=stAlerts();if(!L.length)return '';return `<div class="offs" data-n="${L.length}">`+L.map(t=>`<div class="ol" onclick="go('admin','pr')">${t}</div>`).join('')+'</div>'};

Object.assign(OPT,{plTabs,plFees,plAuto,autoRows,stBar});
