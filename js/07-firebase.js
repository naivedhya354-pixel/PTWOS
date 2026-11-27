/* ===== FIREBASE: paste your web-app config here (Firebase Console > Project settings > Your apps) ===== */
const FBCFG={apiKey:'AIzaSyCfMl5JpvP1YHpKKEVxdO9CZy6DLkma5lY',authDomain:'ptows-d1e63.firebaseapp.com',projectId:'ptows-d1e63',storageBucket:'ptows-d1e63.firebasestorage.app',messagingSenderId:'985305041738',appId:'1:985305041738:web:16ee6b3554c57118c90fb3'};
const FB=typeof firebase!='undefined'&&!FBCFG.apiKey.startsWith('YOUR');
let auth,db,sec,catReady=0,catExists=0,regBusy=0,subs=[];
let rdT=0,lastTouch=0;['pointerdown','touchstart','mousedown','keydown'].forEach(ev=>addEventListener(ev,()=>{lastTouch=Date.now()},true));
function rdGo(){const a=document.activeElement;if(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName))return;if(Date.now()-lastTouch<1500){clearTimeout(rdT);rdT=setTimeout(rdGo,700);return}
const y=scrollY,fv=[...document.querySelectorAll('#app form [name]')].map(e=>e.type=='file'?null:e.value),vsv=(document.getElementById('vs')||{}).value;
try{draw()}catch(e){console.error(e)}
const ne=[...document.querySelectorAll('#app form [name]')];if(ne.length==fv.length)ne.forEach((e,i)=>{if(fv[i]!=null&&e.type!='file'&&e.value!==fv[i])e.value=fv[i]});
const vs2=document.getElementById('vs');if(vs2&&vsv!=null&&vs2.options[vsv]){vs2.value=vsv;pv(+vsv,R[1])}scrollTo(0,y)}
const clean=o=>JSON.parse(JSON.stringify(o)),rd=()=>{clearTimeout(rdT);rdT=setTimeout(rdGo,250)};
function put(c,o){if(!FB){S[c].push(o);save();return}db.collection(c).add(clean({...o,uid:auth.currentUser.uid,ts:Date.now()})).catch(e=>toast(c+': '+e.code))}
function setSt(i,v){const o=S.orders[i],ch=!!opt('stkOrder',o,v);
if(!FB){o.st=v;if(ch)o.stkDone=v=='Delivered';save();return toast('Updated')}
const up={st:v};if(ch)up.stkDone=v=='Delivered';db.collection('orders').doc(o._id).update(up).then(()=>toast('Updated')).catch(e=>toast(e.code))}
function dS(i){if(!confirm('Delete login?'))return;if(!FB){S.staff.splice(i,1);save();return draw()}db.collection('staff').doc(S.staff[i].uid).delete().then(()=>toast('Access removed')).catch(e=>toast(e.code))}
/* catalog is split: config/meta (small settings) + one document per product / kit / disease (collections: products, kits, diseases) */
const CC=['products','kits','diseases'],LAST={products:{},kits:{},diseases:{},meta:''},RDY={};let LEG=null;
const metaOf=()=>({cats:S.cats,pcats:S.pcats,branches:S.branches,offers:S.offers,qs:S.qs,baseUrl:S.baseUrl||'',fees:S.fees||{}});
function catSave(){if(!catReady||!db)return;const ops=[];
CC.forEach(c=>{const cur={};S[c].forEach((x,i)=>{if(x.ord==null)x.ord=Date.now()+i;cur[x.id]=JSON.stringify(x);if(LAST[c][x.id]!==cur[x.id])ops.push(b=>b.set(db.collection(c).doc(String(x.id)),clean(x)))});
Object.keys(LAST[c]).forEach(id=>{if(!(id in cur))ops.push(b=>b.delete(db.collection(c).doc(id)))});LAST[c]=cur});
const m=JSON.stringify(metaOf());if(m!==LAST.meta){ops.push(b=>b.set(db.doc('config/meta'),clean(metaOf())));LAST.meta=m}
for(let i=0;i<ops.length;i+=400){const b=db.batch();ops.slice(i,i+400).forEach(f=>f(b));b.commit().catch(e=>toast(e.code))}}
function catChecked(){if(catReady||!(RDY.meta&&RDY.products&&RDY.kits&&RDY.diseases&&RDY.leg))return;catExists=RDY.hasNew?1:0;if(!catExists&&LEG)Object.assign(S,LEG);catReady=1;if(!catExists&&S.staffUser?.role=='super')catSave();rd()}
function catSnap(c,sn){if(sn.metadata.hasPendingWrites)return;const L=sn.docs.map(x=>x.data()).sort((a,b)=>(a.ord||0)-(b.ord||0));if(L.length)RDY.hasNew=1;if(catReady||L.length){S[c]=L;LAST[c]=Object.fromEntries(L.map(x=>[x.id,JSON.stringify(x)]))}RDY[c]=1;catChecked();rd()}
function lgC(f){return FB?auth.signInWithEmailAndPassword(f.m.value+'@ptwos.app',f.p.value).catch(()=>toast(H('मोबाइल या पासवर्ड गलत है','Wrong mobile or password'))):lgC0(f)}
function lgS(f){return FB?auth.signInWithEmailAndPassword(f.i.value.trim().toLowerCase()+'@staff.ptwos.app',f.p.value).catch(()=>toast('Wrong ID or password')):lgS0(f)}
function rgC(f){if(!FB)return rgC0(f);if(f.p.value!=f.p2.value)return toast('Passwords do not match');regBusy=1;
auth.createUserWithEmailAndPassword(f.m.value+'@ptwos.app',f.p.value).then(async c=>{await db.collection('users').doc(c.user.uid).set(clean({name:f.n.value,mobile:f.m.value,email:f.e.value,city:f.c.value,pin:f.pin.value}));regBusy=0;onAuth(c.user)}).catch(e=>{regBusy=0;toast(e.code=='auth/email-already-in-use'?H('यह मोबाइल पहले से रजिस्टर है','Mobile already registered'):e.message)})}
function cpw(f){if(!FB)return cpw0(f);const u=auth.currentUser;u.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(u.email,f.o.value)).then(()=>u.updatePassword(f.n.value)).then(()=>{toast('Password updated ✓');f.reset()}).catch(e=>toast(/password|credential/.test(e.code)?'Current password is wrong':e.message))}
async function aS(f){if(!FB)return aS0(f);const id=f.i.value.trim().toLowerCase();try{const c=await sec.auth().createUserWithEmailAndPassword(id+'@staff.ptwos.app',f.p.value);await db.collection('staff').doc(c.user.uid).set({id,name:f.n.value,role:'branch',branch:f.b.value});await sec.auth().signOut();toast('Login created ✓');f.reset()}catch(e){toast(e.code=='auth/email-already-in-use'?'Login ID already exists':e.message)}}
function rp(i){if(!FB)return rp0(i);toast('Password reset: Firebase Console > Authentication, or delete and recreate this login')}
function watch(st){const q=c=>{let r=db.collection(c);r=st?(st.role=='super'?r:r.where('branch','==',st.branch)):r.where('uid','==',auth.currentUser.uid);
subs.push(r.onSnapshot(sn=>{S[c]=sn.docs.map(x=>({...x.data(),_id:x.id})).sort((a,b)=>(a.ts||0)-(b.ts||0));rd()},e=>toast(c+': '+e.code)))};
['orders','appts','records','diets',...(st&&st.role=='super'?['pl']:[]),...(st?['stocklog']:[])].forEach(q);
if(st&&st.role=='super')subs.push(db.collection('staff').onSnapshot(sn=>{S.staff=sn.docs.map(x=>({...x.data(),uid:x.id}));rd()}))}
async function onAuth(u){if(regBusy)return;subs.forEach(f=>f());subs=[];['orders','appts','records','diets','pl','stocklog'].forEach(c=>S[c]=[]);
if(!u){S.user=null;S.staffUser=null;return draw()}
if(catErr){catErr=0;catWatch()}
try{const st=await db.collection('staff').doc(u.uid).get();
if(st.exists){const d=st.data();S.staffUser={id:d.id,name:d.name,role:d.role,branch:d.branch,uid:u.uid};S.user=null;watch(d);if(d.role=='super'&&catReady&&!catExists)catSave();go('admin','od')}
else{const us=await db.collection('users').doc(u.uid).get();if(!us.exists){toast('Account not found');return auth.signOut()}S.user={...us.data(),uid:u.uid};S.staffUser=null;watch(null);after()}
}catch(e){toast('Error: '+e.code)}}
let catUn=[],catErr=0;function catWatch(){catUn.forEach(f=>f());catUn=[];
catUn.push(db.doc('config/meta').onSnapshot(sn=>{if(sn.metadata.hasPendingWrites)return;if(sn.exists){RDY.hasNew=1;Object.assign(S,sn.data());LAST.meta=JSON.stringify(metaOf())}RDY.meta=1;catChecked();rd()},e=>{catErr=1;toast('meta: '+e.code)}));
CC.forEach(c=>catUn.push(db.collection(c).onSnapshot(sn=>catSnap(c,sn),e=>{catErr=1;toast(c+': '+e.code)})))}
if(FB){S.staff=[];S.users=[];firebase.initializeApp(FBCFG);auth=firebase.auth();db=firebase.firestore();try{db.enablePersistence({synchronizeTabs:true}).catch(e=>console.warn('offline cache:',e.code))}catch(e){}sec=firebase.initializeApp(FBCFG,'sec');
catWatch();
db.doc('config/catalog').get().then(sn=>{if(sn.exists)LEG=sn.data()}).catch(()=>{}).then(()=>{RDY.leg=1;catChecked()});
auth.onAuthStateChanged(onAuth)}
