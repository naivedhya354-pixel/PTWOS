/* ===== PanchTatva prototype — data lives in localStorage; swap save()/load() for Firebase/Firestore later ===== */
const LS='ptwos_v2',SLOTS=['10:00','11:00','12:00','16:00','17:00','18:00'],STAT=['Placed','Confirmed','Shipped','Delivered'];
const T={home:['होम','Home'],dis:['स्वास्थ्य','Wellness'],shop:['ऑर्गेनिक','Organic'],cart:['कार्ट','Cart'],acct:['अकाउंट','Account'],
tag:['आपका स्वास्थ्य, आपकी वेलनेस, बेहतर जीवनशैली','Your Health, Your Wellness, Your Better Lifestyle'],
o1:['डिजीज़ और वेलनेस','DISEASE & WELLNESS'],o1d:['अपनी स्वास्थ्य समस्या साझा करें और सही जानकारी, डाइट गाइडेंस एवं डॉक्टर से परामर्श प्राप्त करें।','Share your health concern and get information, diet guidance and doctor consultation.'],
o2:['ऑर्गेनिक प्रोडक्ट्स','ORGANIC PRODUCTS'],o2d:['अपने परिवार के लिए चुनें गुणवत्तापूर्ण ऑर्गेनिक खाद्य उत्पाद।','Choose quality organic food products for your family.'],
doctors:['डॉक्टर','Doctors'],diet:['डाइट परामर्श','Diet consultation'],kits:['वेलनेस किट','Wellness kits'],
add:['कार्ट में जोड़ें','Add to cart'],buy:['अभी खरीदें','Buy now'],consult:['डॉक्टर से परामर्श','Consult our doctor'],
disc:['यह जानकारी केवल जागरूकता के लिए है, निदान या इलाज नहीं। कृपया योग्य डॉक्टर से सलाह लें।','This information is for awareness only, not a diagnosis or treatment. Please consult a qualified doctor.'],
emer:['तेज़ सीने में दर्द, सांस लेने में तकलीफ़, अचानक कमज़ोरी/लकवा या बेहोशी हो तो तुरंत नज़दीकी इमरजेंसी सेवा से संपर्क करें।','Severe chest pain, trouble breathing, sudden weakness/paralysis or loss of consciousness: contact emergency services immediately.'],
kitnote:['कोई भी किट बीमारी का निश्चित इलाज या रिकवरी की गारंटी नहीं है।','No kit is a cure or a guarantee of recovery.']};
const tr=k=>T[k][S.lang=='hi'?0:1],nm=o=>S.lang=='hi'&&o.hi?o.hi:o.en,esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),uid=()=>Math.random().toString(36).slice(2,8),inr=n=>'₹'+n;
const CATS=[['Diabetes & Metabolic Disorders','डायबिटीज़ और मेटाबॉलिक','Diabetes / Sugar|Insulin Resistance|Obesity|Thyroid Disorders|High Cholesterol|Metabolic Syndrome','k1'],
['Bone, Joint & Spine Problems','हड्डी, जोड़ और स्पाइन','Cervical Pain|Lumbar Spondylosis|Slip Disc|Sciatica|Knee Pain|Arthritis|Frozen Shoulder|Back Pain|Joint Stiffness','k6'],
['Neurological Problems','न्यूरोलॉजिकल समस्याएं','Peripheral Neuropathy|Diabetic Neuropathy|Burning Sensation in Feet|Numbness & Tingling|Nerve-related Problems|Sleep Disorders','k7'],
['Heart & Circulatory Problems','हृदय और रक्त संचार','High Blood Pressure|Poor Blood Circulation|Heart Health|Cardiovascular Wellness','k2'],
['Liver & Kidney Health','लिवर और किडनी','Fatty Liver|Liver Wellness|Kidney Health|Urinary Health','k3'],
['Digestive Problems','पाचन संबंधी समस्याएं','Acidity|Constipation|Gas & Bloating|IBS|Piles|Digestive Weakness','k4'],
['Special Wellness Categories','विशेष वेलनेस','Autism Spectrum Support|Male Infertility|Female Infertility|Women\u2019s Wellness|Hormonal Health|General Immunity|Stress Management','k5']];
const KITS=[['k1','Sugar & Metabolic Wellness Kit','शुगर और मेटाबॉलिक वेलनेस किट',1499],['k2','Heart Wellness & Antioxidant Kit','हार्ट वेलनेस और एंटीऑक्सीडेंट किट',1599],['k3','Liver Wellness Support Kit','लिवर वेलनेस सपोर्ट किट',1399],['k4','Digestive Wellness Kit','डाइजेस्टिव वेलनेस किट',1199],['k5','Immunity & Nutrition Support Kit','इम्यूनिटी और न्यूट्रिशन किट',1299],['k6','Joint & Mobility Wellness Kit','जॉइंट और मोबिलिटी वेलनेस किट',1499],['k7','General Wellness Kit','जनरल वेलनेस किट',999]];
const PC={r:['Rice & Traditional Grains','चावल और पारंपरिक अनाज'],p:['Pulses & Dals','दालें'],f:['Flour & Wheat','आटा और गेहूं'],d:['Traditional Dairy','पारंपरिक डेयरी'],s:['Natural Sweeteners','प्राकृतिक मिठास'],o:['Wood Pressed Oils','लकड़ी की घानी के तेल']};
const PR=[['r','Organic Basmati Rice','ऑर्गेनिक बासमती चावल',[['1 KG',180,160],['5 KG',850,780],['10 KG',1650,1500]]],['p','Aahar Dal','आहार दाल',[['1 KG',170,150]]],['p','Moong Dal','मूंग दाल',[['1 KG',160,140]]],
['f','Khapli Wheat','खपली गेहूं',[['1 KG',90,80],['5 KG',430,390]]],['f','Bansi Wheat','बंसी गेहूं',[['5 KG',330,300]]],['f','Sonamoti Wheat','सोनामोती गेहूं',[['5 KG',320,290]]],
['f','Sharbati Whole Wheat','शरबती होल व्हीट आटा',[['5 KG',340,310],['10 KG',650,600]],'Stone Grounded at 30 RPM.'],['f','Organic Besan','ऑर्गेनिक बेसन',[['1 KG',130,115]]],
['d','A2 Bilona Ghee','A2 बिलोना घी',[['500 ML',1100,999],['1 L',2100,1899]]],['s','Natural / Organic Honey','प्राकृतिक / ऑर्गेनिक शहद',[['500 G',450,399]]],
['o','Wood Pressed Groundnut Oil','वुड प्रेस्ड मूंगफली तेल',[['1 L',320,290]]],['o','Wood Pressed Mustard Oil','वुड प्रेस्ड सरसों तेल',[['1 L',260,235]]]];
const DOCS=[{id:'d1',en:'Dr. Pawan Kumar Srivastav',sub:'Naturopathy Physician & Wellness Expert'},{id:'d2',en:'Dr. Juhi Srivastava',sub:'Naturopathy Physician & Wellness Expert'}];
const seed=()=>({lang:'hi',theme:'ptows',user:null,cart:[],orders:[],appts:[],diets:[],records:[],guest:0,staffUser:null,offers:[],pl:[],pcats:Object.keys(PC).map(k=>({id:k,en:PC[k][0],hi:PC[k][1]})),users:[],branches:[{id:'gkp',en:'Gorakhpur OPD'},{id:'lko',en:'Lucknow OPD'}],staff:[{id:'owner',pw:'owner@123',role:'super',name:'Owner (all branches)'},{id:'gkp_head',pw:'gkp@123',role:'branch',branch:'gkp',name:'Dr. Pawan Kumar Srivastav'},{id:'lko_head',pw:'lko@123',role:'branch',branch:'lko',name:'Dr. Juhi Srivastava'}],
diseases:CATS.flatMap((c,ci)=>c[2].split('|').map((n,i)=>({id:ci+'-'+i,cat:ci,en:n,kit:c[3],on:1}))),
cats:CATS.map(c=>({en:c[0],hi:c[1]})),kits:KITS.map(k=>({id:k[0],en:k[1],hi:k[2],price:k[3]})),
products:PR.map((p,i)=>({id:'p'+i,cat:p[0],en:p[1],hi:p[2],vars:p[3].map(v=>({s:v[0],mrp:v[1],p:v[2]})),stock:50,on:1,desc:p[4]||''})),qs:{}});
let S=(()=>{try{const x=JSON.parse(localStorage.getItem(LS));if(x)return Object.assign(seed(),x)}catch(e){}return seed()})(),R=['home'],pending=null,ED=null,IMG=[],VID='',PLM='';try{if(!localStorage.getItem('ptows_th3')){S.theme='ptows';localStorage.setItem('ptows_th3','1')}}catch(e){}
const save=()=>{try{if(FB){localStorage.setItem(LS,JSON.stringify({lang:S.lang,theme:S.theme,cart:S.cart,coupon:S.coupon}));if(S.staffUser?.role=='super')catSave()}else localStorage.setItem(LS,JSON.stringify(S))}catch(e){}};
const toast=m=>{const t=document.getElementById('toast');t.textContent=toastHi(m);t.style.display='block';setTimeout(()=>t.style.display='none',2200)};
const go=(...r)=>{opt('scanStop');ED=null;IMG=[];VID='';R=r;draw();scrollTo(0,0)};
const back=(to)=>`<a class="mut" style="cursor:pointer" onclick="go(${to})">← ${S.lang=='hi'?'वापस':'Back'}</a>`;
const kit=id=>S.kits.find(k=>k.id==id),dz=id=>S.diseases.find(d=>d.id==id),pd=id=>S.products.find(p=>p.id==id);
const DQ={'0-0':['कितने वर्षों से शुगर है? / Years with diabetes','Fasting Sugar','PP Sugar','HbA1c','Weight (kg)','क्या इंसुलिन लेते हैं? / On insulin?','चल रही दवाइयां / Current medicines','पैरों में जलन या झनझनाहट? / Burning or tingling in feet?'],
'1-0':['आपकी उम्र / Age','समस्या कितने दिनों से? / Duration','गर्दन में दर्द कहां होता है? / Pain location','दर्द कंधे या हाथ तक जाता है? / Radiates to shoulder or arm?','हाथों में झनझनाहट या कमज़ोरी? / Tingling or weakness in hands?','MRI / X-Ray कराया है? / Done MRI or X-Ray?','चल रही दवाइयां / Current medicines']};
const DEF=['आपकी उम्र / Age','समस्या कितने दिनों से है? / Since when?','मुख्य लक्षण / Main symptoms','चल रही दवाइयां / Current medicines','कोई रिपोर्ट? / Any reports available?'];
const qsOf=id=>[...(DQ[id]||DEF),...(S.qs[id]||[])];
const INFO=['What is the condition?|Common symptoms|Possible causes / risk factors|Lifestyle factors|Diet & nutrition guidance|Frequently asked questions|Health awareness videos'][0].split('|');
const pw=(n,m)=>`<div style="position:relative"><input name="${n}" type="password" ${m?'minlength="'+m+'"':''} required autocomplete="off" style="padding-right:80px"><button type="button" class="eye" onclick="eye(this)">${H('दिखाएं','Show')}</button></div>`;
function eye(b){const i=b.previousElementSibling,sh=i.type=='password';i.type=sh?'text':'password';b.textContent=sh?H('छुपाएं','Hide'):H('दिखाएं','Show')}
const H=(a,b)=>S.lang=='hi'?a:b,bn=id=>(S.branches.find(b=>b.id==id)||{en:id}).en,mine=k=>S[k].filter(x=>x.mobile==S.user?.mobile),brSel=n=>`<label>${H('ब्रांच','Branch')}<select name="${n}">${S.branches.map(b=>`<option value="${b.id}">${b.en}</option>`).join('')}</select></label>`;
function need(){if(S.user)return 1;S.guest=1;S.ret=[...R];toast(H('पहले लॉगिन करें','Please login first'));go('login','c');return 0}
function draw(){if(!FB||catReady)S.cart=S.cart.filter(cOk);applyTheme();const A=document.getElementById('app'),N=document.getElementById('nav');A.dataset.v=S.staffUser?'admin':(!S.user&&!S.guest?'login':R[0]);
if(S.staffUser){A.innerHTML=head()+V.admin(R[0]=='admin'?R[1]:'');N.innerHTML=`<a class="on" onclick="go('admin','od')"><i>▤</i>Panel</a><a onclick="FB&&auth.signOut();S.staffUser=null;S.guest=0;save();go('home')"><i>⎋</i>Logout</a>`;adminHi(A);adminHi(N);return}
if(!S.user&&!S.guest){A.innerHTML=head()+V.login(R[0]=='login'?R[1]:'c');N.innerHTML='';return}
document.getElementById('app').innerHTML=head()+V[R[0]](...R.slice(1));if(R[0]=='prod')pv(0,R[1]);if(R[0]=='book')sl(document.querySelector('#app form'));
document.getElementById('nav').innerHTML=navH()}


/* ===== shared helpers (core): optional modules plug in via OPT, so one broken module cannot stop the app ===== */
var SCAN=null,SCS=null;
const OPT={},opt=(n,...a)=>{try{return OPT[n]?OPT[n](...a):''}catch(e){console.error('module '+n+':',e);return ''}};
let PLT='main';
const fmtD=d=>d?String(d).split('-').reverse().join('/'):'';
