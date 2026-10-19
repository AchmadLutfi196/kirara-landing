'use strict';

// KIRARA: local, editable prototype. Learning text comes only from supplied references.
const $ = (s, parent=document) => parent.querySelector(s);
const $$ = (s, parent=document) => [...parent.querySelectorAll(s)];
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons = {
 arrow:'M5 12h14m-6-6 6 6-6 6', back:'M19 12H5m6-6-6 6 6 6', down:'m6 9 6 6 6-6', close:'m6 6 12 12M6 18 18 6', menu:'M4 6h16M4 12h16M4 18h16',
 book:'M12 5v15M3 4c4-1 7 0 9 2 2-2 5-3 9-2v15c-4-1-7 0-9 2-2-2-5-3-9-2Z',
 home:'m3 11 9-8 9 8M5 10v11h5v-7h4v7h5V10',
 game:'M7 7h10a5 5 0 0 1 5 5l-1 6a2 2 0 0 1-3 1l-3-3H9l-3 3a2 2 0 0 1-3-1l-1-6a5 5 0 0 1 5-5Zm-1 5h4m-2-2v4m8-3h.01m2 3h.01',
 quiz:'M8 3h8l4 4v14H4V3h4Zm8 0v5h4M9 12a3 3 0 1 1 4 3v1m-1 3h.01',
 art:'M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 0-4h-1a1 1 0 0 1-1-1 1 1 0 0 1 1-1h4a4 4 0 0 0 4-4 9 9 0 0 0-9-8ZM7 9h.01M11 6h.01M16 8h.01M6 14h.01',
 user:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
 star:'m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z',
 clock:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2',
 pin:'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0ZM14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
 check:'m5 12 4 4L19 6', circlecheck:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-14 0 3 3 7-7',
 info:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 11v6m0-10h.01',
 trophy:'M8 3h8v7a4 4 0 0 1-8 0V3Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v5m-4 2h8',
 heart:'M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1C-2 11 12 21 12 21S26 11 20 5Z',
 search:'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 5 6 6',
 camera:'M8 6 10 3h4l2 3h5v15H3V6h5Zm8 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
 sound:'M11 4 6 8H3v8h3l5 4V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14',
 play:'m8 4 12 8-12 8Z', pause:'M8 4v16M16 4v16',
 refresh:'M3 10a9 9 0 1 1 2 8M3 3v7h7', lock:'M6 10h12v11H6V10Zm2 0V7a4 4 0 0 1 8 0v3m-4 5v2',
 help:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9a3 3 0 1 1 4 3v2m-1 3h.01',
 leaf:'M20 3C7 3 3 7 4 14s10 9 14 2c2-4 2-9 2-13ZM6 19 16 9', upload:'M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6', edit:'m4 15 12-12 5 5L9 20l-6 1 1-6Zm9-9 5 5'
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[name] || icons.info}"/></svg>`;
const dims = {logo:[165,127],sakera:[311,315],marlena:[231,230],jokotole:[597,520],'potre-koneng':[368,206],'ke-lesap':[365,206],'art-jokotole':[369,206],'art-craft':[369,201],'art-karapan':[368,201],'art-batik':[365,201],odeng:[103,118],celurit:[101,97]};
const img = (name, alt, cls='od-media') => `<img src="assets/${name}.png" alt="${esc(alt)}" width="${dims[name][0]}" height="${dims[name][1]}" class="${cls}" loading="lazy">`;
const link = (href,text,cls='btn-secondary',ic='arrow',extra='') => `<a class="btn ${cls}" href="#/${href}" ${extra}>${ic==='back'?icon(ic):''}<span>${text}</span>${ic && ic!=='back'?icon(ic):''}</a>`;
const button = (action,text,cls='btn-secondary',ic='',extra='') => `<button type="button" class="btn ${cls}" data-action="${action}" ${extra}>${ic?icon(ic):''}<span>${text}</span></button>`;
const badge = (text,cls='',ic='') => `<span class="badge ${cls}">${ic?icon(ic):''}${text}</span>`;
const notice = (text,cls='',ic='info') => `<div class="notice ${cls}">${icon(ic)}<p>${text}</p></div>`;
const progress = (value,label,right='') => `<div class="progress-container"><div class="progress-label"><span>${label}</span><strong>${right || value+'%'}</strong></div><progress class="progress-track" max="100" value="${value}" aria-label="${esc(label)}">${value}%</progress></div>`;
const guide = (who,text,slim=false) => `<div class="guide ${slim?'slim':''}">${img(who,who==='sakera'?'Sakera, pemandu belajar':'Marlena, sahabat membaca')}<div class="od-field"><strong>${who==='sakera'?'Kak Sakera':'Kak Marlena'}</strong><p>${text}</p></div></div>`;
const pageHeading = (title,subtitle,action='') => `<div class="page-heading"><div><h1>${title}</h1>${subtitle?`<p>${subtitle}</p>`:''}</div>${action}</div>`;
const blank = (title,text,cta,ic='book') => `<div class="card empty-state"><div class="empty-symbol">${icon(ic)}</div><h2>${title}</h2><p>${text}</p>${cta}</div>`;

const STORAGE='kirara.v1';
const defaults = () => ({version:1,name:'',className:'VI',visited:{},reflection:'',bestQuiz:null,quizEarned:false,gameEarned:false,likes:[],uploads:[],lastResult:null,progress:{}});
let state=defaults(), storageAvailable=true;
try { const saved=JSON.parse(localStorage.getItem(STORAGE)||'null'); if(saved?.version===1) state={...state,...saved,visited:saved.visited||{},likes:Array.isArray(saved.likes)?saved.likes:[],uploads:Array.isArray(saved.uploads)?saved.uploads:[],progress:saved.progress&&typeof saved.progress==='object'?saved.progress:{}}; } catch(e){storageAvailable=false;}
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(state));storageAvailable=true;return true;}catch(e){storageAvailable=false;toast('Penyimpanan perangkat penuh atau tidak tersedia. Progres sesi ini tetap bisa digunakan.');return false;}}
const stage = (id,key) => state.progress[id]?.[key]===true;
const readDone = id => stage(id,'read')||state.completedStories?.[id]===true;
const storyDone = id => readDone(id)&&stage(id,'game')&&stage(id,'quiz');
function markStage(id,key){
 if(stage(id,key))return false;
 state.progress[id]={read:readDone(id),game:stage(id,'game'),quiz:stage(id,'quiz'),[key]:true};
 if(storyDone(id)&&state.completedStories?.[id]!==true){state.completedStories=state.completedStories||{};state.completedStories[id]=true;toast('Petualangan '+esc(stories.find(s=>s.id===id)?.title||id)+' selesai. +50 Poin Budaya!');}
 persist();return true;
}
const points = () => (state.gameEarned?500:0)+(state.quizEarned?20:0)+Object.keys(state.completedStories||{}).filter(id=>stories.some(s=>s.id===id)).length*50;
let toastTimeout, dialogReturn, currentRoute='', scrollPositions={}, readerPage=0, largeText=false;
let galleryFilter='Semua Karya', gallerySearch='', gallerySort='popular';
let game={selected:null,pairs:{},confirmed:[],errors:[],checked:false,elapsed:0,finished:false};
let quiz={answer:null,doubt:false,review:false,revealed:false,elapsed:0,finished:false};
let seq={story:null,order:[],checked:false,attempts:0,elapsed:0,finished:false};
let storyQuiz={story:null,index:0,answers:[],selected:null,revealed:false,elapsed:0,finished:false};
const time = n => `${Math.floor(n/60).toString().padStart(2,'0')}:${(n%60).toString().padStart(2,'0')}`;
function toast(message){const node=$('#toast');node.innerHTML=`${icon('info')}<span>${esc(message)}</span>`;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>node.replaceChildren(),6500);}
function modal(title,body,actions=''){dialogReturn=document.activeElement;const d=$('#modal');d.innerHTML=`<div class="dialog-head"><h2 id="dialog-title">${title}</h2>${button('close-modal','Tutup','btn-ghost icon-button','close','aria-label="Tutup dialog"')}</div><div class="dialog-body">${body}</div>${actions?`<div class="dialog-actions">${actions}</div>`:''}`;d.showModal();const input=$('input:not([type=file]),textarea',d);if(input)input.focus();}
function closeModal(){const d=$('#modal');if(d.open)d.close();}
$('#modal').addEventListener('close',()=>{if(dialogReturn?.isConnected)dialogReturn.focus();});

const stories=[
 {id:'jokotole',title:'Jokotole & Kuda Si Giga',origin:'Sumenep',minutes:7,category:'Kisah kepahlawanan',image:'art-jokotole',readerImage:'jokotole',desc:'Ksatria sakti pembela keadilan, bersama kuda bersayap Si Giga.',available:true},
 {id:'potre-koneng',title:'Putri Potre Koneng',origin:'Sumenep',minutes:6,category:'Legenda keraton',image:'potre-koneng',readerImage:'potre-koneng',desc:'Putri penuh welas asih dalam legenda dari Gua Payudan.',available:false},
 {id:'ke-lesap',title:"Ke' Lesap Sang Pemberani",origin:'Bangkalan',minutes:8,category:'Kisah perjuangan',image:'ke-lesap',readerImage:'ke-lesap',desc:'Kisah perjuangan seorang pemberani pembela rakyat Madura.',available:false}
];
const artworks=[
 {id:'ref-1',title:'Jokotole Terbang di Langit',category:'Ilustrasi Cerita',student:'Budi Santoso',school:'SDN Manding Laok',className:'VI-A',likes:48,image:'art-jokotole'},
 {id:'ref-2',title:'Putri Potre Koneng & Gua',category:'Ilustrasi Cerita',student:'Siti Aisyah',school:'SDN Pajagalan 1',className:'VI-B',likes:56,image:'potre-koneng'},
 {id:'ref-3',title:"Ke’ Lesap Penjaga Selat",category:'Komik Mini',student:'Farhan Maulidi',school:'SDN Bangkalan 3',className:'VI-C',likes:42,image:'ke-lesap'},
 {id:'ref-4',title:"Miniatur Pesa’an & Odeng",category:'Kerajinan Tangan',student:'Rian Hidayat',school:'SDN Kalianget 2',className:'VI-A',likes:39,image:'art-craft'},
 {id:'ref-5',title:'Karapan Sapi Ceria',category:'Ilustrasi Cerita',student:'Aulia Rahma',school:'SDN Kolor 1 Sumenep',className:'VI-B',likes:61,image:'art-karapan'},
 {id:'ref-6',title:'Motif Batik Gentongan Madura',category:'Kerajinan Tangan',student:'Dewi Sekar',school:'SDN Tanjungkarang 1',className:'VI-A',likes:50,image:'art-batik'}
];
const cultures=[
 {id:'pesaan',label:'Pakaian adat pria',term:"Pesa’an",desc:'Baju hitam dengan kaos garis merah-putih.',image:'sakera'},
 {id:'odeng',label:'Penutup kepala',term:'Odeng',desc:'Ikat kepala batik berlipat.',image:'odeng'},
 {id:'celurit',label:'Senjata tradisional',term:'Celurit',desc:'Bilah baja melengkung bulan sabit.',image:'celurit'},
 {id:'batik',label:'Kain khas daerah',term:'Batik Madura',desc:'Kain bermotif flora dengan warna berani.',image:'art-batik'},
 {id:'karapan',label:'Pesta pacuan rakyat',term:'Karapan Sapi',desc:'Lomba pacuan sepasang sapi.',image:'art-karapan'}
];
const termOrder=['celurit','batik','pesaan','karapan','odeng'];
// Per-story activity content: sequence events and quiz questions follow each tale's theme.
const storyActivities={
 jokotole:{
  intro:'Urutkan perjalanan Jokotole, dari kecil di Desa Majungan hingga menjadi ksatria pembela.',
  sequence:[
   'Jokotole kecil diasuh Empu Kelleng di Desa Majungan.',
   'Ia dikenal memiliki kekuatan luar biasa dan hati yang dermawan.',
   'Saat dewasa, ia menerima pusaka cemeti sakti dan kuda bersayap Si Giga.',
   'Dengan ketulusannya, ia membantu membangun gerbang Kerajaan Majapahit yang megah.',
   'Kekuatannya dipakai untuk menegakkan keadilan dan melindungi sesama.'
  ],
  quiz:[
   {q:'Di mana Jokotole diasuh sejak kecil?',options:['Desa Majungan','Gua Payudan','Selat Madura','Keraton Majapahit'],correct:0,explain:'Jokotole diasuh oleh Empu Kelleng di Desa Majungan.'},
   {q:'Apa nama kuda bersayap milik Jokotole?',options:['Odeng','Si Giga',"Pesa'an",'Karapan'],correct:1,explain:'Kuda bersayap pusaka Jokotole bernama Si Giga.'},
   {q:'Untuk apa kekuatan sejati Jokotole dipakai?',options:['Menaklukkan yang lemah','Mengumpulkan harta','Menegakkan keadilan','Memperdaya musuh'],correct:2,explain:'"Kekuatan sejati bukanlah untuk menaklukkan yang lemah, melainkan menegakkan keadilan."'}
  ]
 },
 'potre-koneng':{
  intro:'Susun perjalanan Putri Potre Koneng, dari kewelas asihannya hingga legenda Gua Payudan.',
  sequence:[
   'Putri Potre Koneng hidup dengan welas asih di tanah Sumenep.',
   'Banyak pemuda datang melamar, namun semuanya ditolak dengan santun.',
   'Putri memilih menyepi bersembahyang di Gua Payudan.',
   'Ia berdoa agar tetap setia pada tujuan dan kesuciannya.',
   'Hingga kini masyarakat mengenangnya dalam legenda Gua Payudan.'
  ],
  quiz:[
   {q:'Dari daerah mana asal legenda Putri Potre Koneng?',options:['Bangkalan','Sumenep','Sampang','Pamekasan'],correct:1,explain:'Legenda Putri Potre Koneng berasal dari Sumenep.'},
   {q:'Apa sifat utama Putri Potre Koneng dalam cerita?',options:['Welas asih','Sombong','Pemarah','Serakah'],correct:0,explain:'Putri dikenal penuh welas asih kepada semua orang.'},
   {q:'Di mana Putri menyepi bersembahyang?',options:['Gua Jepang','Keraton Sumenep','Gua Payudan','Pantai Slopeng'],correct:2,explain:'Putri menyepi bersembahyang di Gua Payudan.'}
  ]
 },
 'ke-lesap':{
  intro:'Susun perjalanan Ke\' Lesap, sang pemberani pembela rakyat dari Bangkalan.',
  sequence:[
   'Ke\' Lesap tumbuh di pesisir Bangkalan, dekat selat Madura.',
   'Ia dewasa menjadi pemberani yang gemar membela kebenaran.',
   'Rakyat tertindas datang kepadanya untuk mencari perlindungan.',
   'Dengan keberanian ia membela rakyat dari para penindas.',
   'Kisah perjuangannya dikenang hingga kini di Bangkalan.'
  ],
  quiz:[
   {q:'Dari daerah mana asal Ke\' Lesap?',options:['Bangkalan','Sumenep','Pamekasan','Sampang'],correct:0,explain:"Ke' Lesap berasal dari Bangkalan."},
   {q:'Siapa yang dibela oleh Ke\' Lesap?',options:['Para penindas','Rakyat kecil','Pedagang kaya','Adipati'],correct:1,explain:"Ke' Lesap membela rakyat kecil dari penindasan."},
   {q:'Kisah Ke\' Lesap dikenang sebagai kisah…',options:['Legenda keraton','Dongeng binatang','Cerita jenaka','Perjuangan'],correct:3,explain:"Kisahnya dikenang sebagai kisah perjuangan pembela rakyat."}
  ]
 }
};

function renderHeader(route){
 document.body.classList.add('world-theme');
 document.body.dataset.surface=route==='masuk'||route==='menu'?'entry':route.startsWith('baca/')?'reader':route==='kuis'||route.startsWith('kuis/')?'quiz':route==='mini-game'||route.startsWith('susun/')?'game':route==='ui-kit'?'kit':'learning';
 const nav=[['menu','Peta Petualangan'],['cerita','Pilih Cerita'],['mini-game','Mini Game'],['kuis','Kuis Budaya'],['karya','Ruang Karya']];const selected=route.startsWith('baca')?'cerita':route.startsWith('susun/')?'mini-game':route.startsWith('kuis/')?'kuis':route==='materi'?'menu':route==='hasil'?(state.lastResult?.kind==='game'?'mini-game':'kuis'):route;
 $('#header').innerHTML=`<div class="header-inner"><a class="brand" href="#/menu" aria-label="KIRARA Menu Utama">${img('logo','Logo KIRARA','')}<div class="od-field"><span class="brand-name">KIRARA</span><span class="brand-caption">Kisah Rakyat Madura</span></div></a><nav id="main-nav" class="main-nav" aria-label="Navigasi utama">${nav.map(([id,label])=>`<a class="nav-item" href="#/${id}" ${selected===id?'aria-current="page"':''}>${label}</a>`).join('')}<a class="nav-item mobile-profile" href="#/profil" style="display:none">Profil Siswa</a></nav><div class="header-tools"><span class="points">${icon('star')}<strong>${points().toLocaleString('id-ID')}</strong><span class="points-label">Poin Budaya</span></span><a href="#/profil" class="avatar" aria-label="Buka profil siswa">${esc((state.name||'S').charAt(0).toUpperCase())}</a>${button('toggle-nav','Menu','btn-ghost icon-button mobile-toggle','menu','aria-label="Buka menu navigasi" aria-expanded="false" aria-controls="main-nav"')}</div></div>`;
}
function sceneFooter(){return `<footer class="scene-footer scene-plaque od-row"><div class="od-field"><strong>KIRARA · Kisah Rakyat Madura</strong><span>Belajar cerita, mencintai budaya.</span></div><div class="od-cluster gap-4"><a class="btn btn-ghost" href="#/admin">Area Admin</a><span class="small muted">Media pembelajaran · Kelas VI SD</span>${button('help','Bantuan','btn-ghost','help')}</div></footer>`;}
// Illustrated theme is intentionally limited to entry and main menu.
function entryLandscape(){return '<img class="scene-background" src="assets/kirara-village-background.png" width="1556" height="1011" alt="" loading="eager" decoding="async">';}
function entryBrand(){return '<header class="scene-brand"><p class="scene-brand-name">KIRARA</p><p class="scene-brand-subtitle">Kisah Rakyat Madura</p></header>';}
function entryCompanion(name){const label=name==='sakera'?'Sakera':'Marlena';return `<figure class="scene-companion scene-${name}">${img(name,label+' menyambut petualangan belajarmu','od-media')}<figcaption class="od-field"><strong>${label}</strong><span>Sahabat belajarmu</span></figcaption></figure>`;}
function onboarding(){
 const steps=[['1','Baca kisahnya','Pilih cerita rakyat Madura yang paling menarik bagimu. Bebas mulai dari mana saja.'],['2','Susun alurnya','Geser kartu peristiwa menjadi urutan cerita yang benar.'],['3','Jawab kuisnya','Buktikan pemahamanmu tentang kisah itu.'],['4','Bagikan karyamu','Apresiasi dan unggah kreativitasmu di Ruang Karya.']];
 return `<section class="storybook-surface" aria-labelledby="entry-title">${entryLandscape()}<div class="scene-wrap">${entryBrand()}<div class="scene-grid scene-onboarding">${entryCompanion('sakera')}<div class="scene-main">
 <div class="scene-welcome scene-plaque od-stack"><h1 id="entry-title">Kisah dari Madura.<br><span class="primary-text">Petualangan bebas untukmu.</span></h1><p>Halo, Sobat Budaya! Jelajahi cerita rakyat Madura bersama Sakera dan Marlena. Pilih kisah mana pun untuk memulai, tanpa urutan wajib. Yuk, kenalan dulu.</p></div>
 <form id="onboarding-form" class="onboarding-form scene-form od-stack" novalidate><div class="error-summary" role="alert"></div><div class="field"><label for="student-name">Nama panggilan kamu <span class="scene-required">(wajib diisi)</span></label><input id="student-name" name="name" class="input" autocomplete="given-name" maxlength="40" placeholder="Contoh: Budi" value="${esc(state.name)}" required minlength="2" aria-describedby="name-hint name-error"><p id="name-hint" class="small muted">Isi minimal 2 huruf, lalu tekan Mulai Petualangan.</p><p id="name-error" class="field-error" aria-live="polite"></p></div><button class="btn btn-primary scene-primary wide" type="button" data-action="start-adventure"><span>Mulai Petualangan</span>${icon('arrow')}</button><p class="small muted od-row">${icon('lock')}<span>Progres tersimpan di perangkat ini.</span></p></form>
 <div class="scene-story-preview scene-plaque">${img('art-jokotole','Jokotole menunggang kuda bersayap Si Giga','od-media')}<div class="od-field"><strong>Jokotole & Kuda Si Giga</strong><span>Satu dari tiga kisah pilihan</span></div></div>
 </div>${entryCompanion('marlena')}</div><ol class="scene-steps">${steps.map(([n,t,d])=>`<li class="scene-step scene-plaque"><span class="scene-step-number" aria-hidden="true">${n}</span><div class="od-field"><strong>${t}</strong><p>${d}</p></div></li>`).join('')}</ol>${sceneFooter()}</div></section>`;
}
function storyStage(id){
 if(!readDone(id))return['Baca','baca/'+id,'book'];
 if(!stage(id,'game'))return['Susun Alur','susun/'+id,'game'];
 if(!stage(id,'quiz'))return['Jawab Kuis','kuis/'+id,'quiz'];
 return null;
}
function journeyCard(s){
 const next=storyStage(s.id);
 const stages=[['Baca',readDone(s.id)],['Susun Alur',stage(s.id,'game')],['Kuis',stage(s.id,'quiz')]];
 return `<article class="scene-plaque journey-card ${next?'':'is-done'}"><div class="journey-media">${KiraraAdmin.storyImage(s)}</div><div class="od-stack journey-copy"><div class="story-meta"><span>${icon('pin')}${esc(s.origin)}</span><span>${icon('clock')}${s.minutes} menit</span></div><h2>${esc(s.title)}</h2><p>${esc(s.desc)}</p><div class="journey-stages" aria-label="Tahap petualangan cerita ini">${stages.map(([t,done])=>`<span class="journey-stage ${done?'done':''}">${icon(done?'circlecheck':'lock')}<span>${t}</span></span>`).join('')}</div><div class="journey-cta-wrap">${next?link(next[1],(readDone(s.id)?'Lanjut ':'Mulai ')+next[0],'btn-primary journey-cta',next[2]):`<span class="success-text od-row">${icon('trophy')}<span>Kisah ini selesai. Hebat!</span></span>`}</div></div></article>`;
}
function menu(){
 const stories=KiraraAdmin.visibleStories();
 const pending=stories.find(s=>storyStage(s.id));
 const step=pending?storyStage(pending.id):null;
 const quick=[['materi','book','Materi','Kenali warisan budaya Madura.'],['mini-game','game','Mini Game','Pasangkan gambar dan istilah tradisi.'],['karya','art','Ruang Karya','Lihat kreativitas teman.'],['profil','user','Profil','Lihat perjalanan belajarmu.']];
 return `<section class="storybook-surface" aria-labelledby="menu-title">${entryLandscape()}<div class="scene-wrap">${entryBrand()}<div class="scene-grid">${entryCompanion('sakera')}<div class="scene-main">
 <div class="scene-greeting scene-plaque od-stack"><h1 id="menu-title">Peta Petualangan <span class="primary-text">${esc(state.name||'Sobat Budaya')}</span></h1><p>Tidak ada urutan wajib. Pilih kisah mana pun, lalu selesaikan tiga tahapnya: Baca, Susun Alur, dan Kuis.</p></div>
 <div class="scene-action scene-plaque">${step?link(step[1],'Lanjutkan: '+esc(pending.title),'btn-primary scene-primary','arrow')+'<span>Tahap berikutnya: '+step[0]+'</span>':link('karya','Bagikan Karyamu','btn-primary scene-primary','art')+'<span>Semua kisah selesai — hebat, Sakaleh!</span>'}</div>
 <div class="scene-menu-heading"><h2>Tiga kisah menantimu</h2><span>Baca → Susun Alur → Kuis</span></div>
 <div class="od-grid journey-grid">${stories.map(journeyCard).join('')}</div>
 <div class="scene-menu-heading"><h2>Aktivitas lainnya</h2></div>
 <nav class="scene-menu-grid od-grid" aria-label="Aktivitas lainnya">${quick.map(([route,ic,title,desc])=>`<a href="#/${route}" class="scene-menu-item"><span class="scene-menu-icon" aria-hidden="true"><img class="menu-illustration" src="assets/menu-${route}-v1.png" width="256" height="256" alt="" decoding="async"></span><span class="od-field scene-menu-copy"><span class="scene-menu-title">${title}</span><span class="scene-menu-helper">${desc}</span></span><span class="scene-menu-arrow">${icon('arrow')}</span></a>`).join('')}<a href="linear/" class="scene-menu-item"><span class="scene-menu-icon" aria-hidden="true"><img class="menu-illustration" src="assets/menu-cerita-v1.png" width="256" height="256" alt="" decoding="async"></span><span class="od-field scene-menu-copy"><span class="scene-menu-title">KIRARA Linear</span><span class="scene-menu-helper">Alur belajar berurutan untuk layar sentuh kelas.</span></span><span class="scene-menu-arrow">${icon('arrow')}</span></a></nav>
 <div class="scene-guidance scene-plaque">${icon('info')}<p><strong>Pesan Sakera</strong><span>Pilih cerita yang paling menarik bagimu, baca sampai tuntas, lalu susun alur ceritanya sebelum menjawab kuis.</span></p></div>
 </div>${entryCompanion('marlena')}</div>${sceneFooter()}</div></section>`;
}
function storyCard(s){const seen=state.visited[s.id];return `<article class="card story-card"><div class="story-media">${KiraraAdmin.storyImage(s)}</div><div class="story-body"><div class="story-meta"><span>${icon('pin')}${esc(s.origin)}</span><span>${icon('clock')}${s.minutes} menit</span></div><h2>${esc(s.title)}</h2><p>${esc(s.desc)}</p><div class="story-meta"><span class="story-reward">${icon('star')}+50 Poin Budaya</span></div><div class="story-progress">${seen?`<span class="success-text od-row">${icon('book')}<span>${state.completedStories?.[s.id]?'Cerita selesai':s.body?'Naskah pernah dibuka':s.available?'Cuplikan pernah dibuka':'Sampul pernah dibuka'}</span></span>`:'<span class="muted">Belum mulai membaca</span>'}</div>${link('baca/'+s.id,'Mulai Baca','btn-primary','book')}</div></article>`;}
function storyList(){return `${pageHeading('Pilih ceritamu, mulai petualangan.','Tiga kisah rakyat Madura tentang keberanian, kebaikan, dan perjuangan.',badge(Object.keys(state.completedStories||{}).length+' / 3 cerita selesai','green','book'))}<div class="od-grid story-grid">${KiraraAdmin.visibleStories().map(storyCard).join('')}</div><p class="section-note">Estimasi waktu dan hadiah mengikuti referensi. Poin cerita diberikan setelah naskah lengkap selesai dibaca; saat ini tersedia satu cuplikan Jokotole.</p><div class="mt-8">${guide('sakera','Yuk, mulai mengenal Jokotole dan Si Giga! Untuk cerita lainnya, ilustrasi sudah bisa kamu lihat sambil menunggu naskah lengkap.')}</div>`;}
function audioPlayer(){return `<section class="card audio-player" aria-label="Audio narator"><div class="od-row gap-4">${icon('sound')}<div class="od-field"><strong>Dengarkan cerita</strong><span class="small muted">Audio narator belum tersedia</span></div></div><div class="audio-controls"><button class="btn btn-primary icon-button" disabled aria-label="Putar audio, rekaman belum tersedia">${icon('play')}</button><span>00:00</span><input type="range" min="0" max="100" value="0" disabled aria-label="Posisi audio"><span>--:--</span><select class="input" disabled aria-label="Kecepatan audio"><option>1×</option></select></div></section>`;}
function reader(id){const managed=KiraraAdmin.studentReader(id);if(managed!==null)return managed;const s=stories.find(x=>x.id===id)||stories[0];state.visited[s.id]=true;if(!s.available)markStage(s.id,'read');persist();const hasText=s.available&&readerPage===0;return `<div class="reader-toolbar">${link('cerita','Daftar Cerita','btn-ghost','back')}${button('text-size',largeText?'Teks Normal':'Perbesar Teks','btn-secondary','book','aria-pressed="'+largeText+'"')}</div><div class="reader-layout"><aside><figure class="reader-figure">${KiraraAdmin.storyImage(s,'reader-picture',true)}<figcaption>${esc(s.title)} · ${esc(s.origin)}</figcaption></figure>${audioPlayer()}</aside><section class="card reader-copy"><div class="od-cluster between">${badge(s.category,'terra')}<span class="small muted od-row">${icon('clock')}${hasText?'±3':s.minutes} menit baca</span></div><h1>${hasText?'Bab 1: Kelahiran dan Kesaktian Jokotole':s.title}</h1>${hasText?`<article ${largeText?'style="font-size:22px"':''}><p>Jokotole adalah putra dari Putri Potre Koneng dan Adipoday. Sejak kecil, ia diasuh oleh Empu Kelleng di Desa Majungan. Jokotole dikenal memiliki kekuatan luar biasa dan hati yang sangat dermawan.</p><p>Ketika beranjak dewasa, Jokotole mendapat hadiah pusaka cemeti sakti dan kuda bersayap bernama Si Giga. Dengan ketulusan dan keberaniannya, ia membantu membangun pintu gerbang Kerajaan Majapahit yang megah.</p><blockquote>“Kekuatan sejati bukanlah untuk menaklukkan yang lemah, melainkan untuk menegakkan keadilan dan melindungi sesama insan ciptaan Tuhan.”</blockquote></article><details class="glossary"><summary>Kenali kata dalam cerita</summary><div class="od-stack gap-4 mt-4"><p><strong>Adipoday</strong> — Ayah Jokotole dalam cuplikan cerita ini.</p><p><strong>Empu Kelleng</strong> — Tokoh yang mengasuh Jokotole di Desa Majungan.</p><p><strong>Pusaka Cemeti</strong> — Cemeti sakti yang diterima Jokotole.</p></div></details>${guide('marlena','Mengapa Jokotole rela membantu orang lain meski memiliki kesaktian besar?')}<div class="field mt-6"><label for="reflection">Menurutmu, apa yang bisa kita teladani?</label><textarea id="reflection" class="input" maxlength="1000" placeholder="Tuliskan pendapatmu...">${esc(state.reflection)}</textarea></div><div class="mt-4">${button('save-reflection','Simpan Refleksi','btn-secondary','check')}</div><p class="section-note">Cuplikan dari referensi. Naskah lengkap cerita belum tersedia.</p>`:`<div class="empty-state"><div class="empty-symbol">${icon('book')}</div><h2>${s.available?'Kelanjutan cerita belum tersedia':'Naskah cerita belum tersedia'}</h2><p>Ilustrasi dan identitas cerita tetap tersedia. Isi cerita lengkap akan ditambahkan dari naskah asli.</p>${s.available?button('reader-prev','Kembali ke Cuplikan','btn-secondary','back')+link('susun/'+s.id,'Lanjut Susun Alur','btn-primary','game','data-action="susun-cta"'):link('susun/'+s.id,'Lanjut Susun Alur','btn-primary','game','data-action="susun-cta"')}</div>`}</section></div><div class="reader-bottom">${button('reader-prev','Halaman Sebelumnya','btn-secondary','back',readerPage===0?'disabled':'')}<div class="reading-progress">${progress(0,'Cerita lengkap','Belum tersedia')}</div><div class="od-cluster">${button('reader-next','Halaman Berikutnya','btn-secondary','arrow',!s.available||readerPage>0?'disabled':'')}${link('susun/'+s.id,'Susun Alur Cerita','btn-primary','game','data-action="susun-cta"')}</div></div>`;}

function matchCorrect(id){return game.confirmed.includes(id);}
function matchStatus(id){return matchCorrect(id)?'correct':game.errors.includes(id)?'wrong':game.selected===id?'selected':game.pairs[id]?'connected':'';}
function miniGame(){
 const correct=game.confirmed.length,assigned=Object.keys(game.pairs).length;
 const message=game.finished?'Hebat! Semua pasangan sudah benar. Kamu semakin mengenal budaya Madura.':game.errors.length?'Masih ada pasangan yang belum tepat. Tarik ulang tali bertanda “Coba lagi”; pasangan benar tetap terkunci.':game.selected?'Kartu terpilih. Pilih nama tradisi di kanan dengan klik, Enter, atau Spasi.':assigned===5?'Semua tali sudah terpasang. Klik Periksa Jawaban untuk melihat hasilnya.':'Tarik tali dari pin kiri, lalu lepaskan pada kartu nama tradisi di kanan.';
 return `<section class="mini-game" aria-labelledby="game-title">
 <div class="game-utility"><div class="od-cluster">${link('menu','Menu Utama','btn-ghost','back')}<span class="badge terra">Misi Edukasi Budaya · Kelas VI SD</span></div><div class="game-counters"><div class="game-counter">${icon('clock')}<span class="od-field"><span class="small">Waktu bermain</span><strong id="game-time" class="timer">${time(game.elapsed)}</strong></span></div><div class="game-counter score">${icon('star')}<span class="od-field"><span class="small">Skor permainan</span><strong>${correct*100} <small>poin</small></strong></span></div>${button('game-hint','Petunjuk','btn-secondary','help')}</div></div>
 <header class="game-banner"><div class="game-title-icon">${icon('game')}</div><div class="od-field od-fill"><h1 id="game-title">Cocokkan Budaya Madura</h1><p>Pasangkan kartu gambar warisan adat Madura dengan nama tradisi yang tepat!</p></div><div class="game-progress">${progress(correct*20,'Pasangan selesai',correct+' / 5')}</div></header>
 <div class="card game-board"><div class="game-instruction">${icon('arrow')}<p id="match-instructions"><strong>Tarik talinya.</strong> Tahan pin kiri, tarik ke pasangan di kanan, lalu lepaskan. Bisa juga klik kedua kartu atau gunakan Tab dan Enter.</p></div>
 <div class="match-stage" role="group" aria-label="Papan pasangan budaya" aria-describedby="match-instructions"><div class="match-heading source-heading"><h2>Kartu Gambar Tradisi</h2><span>Kolom A</span></div><div class="match-heading target-heading"><h2>Nama Istilah Tradisi</h2><span>Kolom B</span></div><svg id="match-lines" class="match-lines" aria-hidden="true" focusable="false"></svg>
 ${cultures.map((c,i)=>{const status=matchStatus(c.id),paired=cultures.find(t=>t.id===game.pairs[c.id]);const label=status==='correct'?'Benar':status==='wrong'?'Coba lagi':status==='selected'?'Terpilih':paired?'Terhubung':'Belum terhubung';return `<button type="button" class="culture-match ${status}" style="grid-row:${i+2}" data-action="select-culture" data-id="${c.id}" aria-pressed="${game.selected===c.id}" aria-label="${i+1}. ${esc(c.label)}. ${esc(c.desc)} ${paired?'Pasangan: '+esc(paired.term)+'. ':''}${label}" ${matchCorrect(c.id)?'disabled':''}><span class="culture-picture">${img(c.image,c.label,'od-media')}</span><span class="od-field culture-copy"><span class="culture-label"><span class="culture-number">${i+1}</span><strong>${esc(c.label)}</strong></span><span class="culture-description">${esc(c.desc)}</span><span class="pair-state">${status==='correct'?icon('circlecheck'):status==='wrong'?icon('close'):''}${label}</span></span><span class="match-pin" data-source-pin="${c.id}" aria-hidden="true">${status==='correct'?icon('check'):status==='wrong'?icon('close'):icon('arrow')}</span></button>`;}).join('')}
 ${termOrder.map((id,i)=>{const c=cultures.find(x=>x.id===id),source=cultures.find(x=>game.pairs[x.id]===id);const status=source?matchStatus(source.id):'';const good=source&&matchCorrect(source.id);return `<button type="button" class="term-match ${status}" style="grid-row:${i+2}" data-action="select-term" data-id="${id}" aria-label="${esc(c.term)}. ${source?'Terhubung dengan kartu '+(cultures.indexOf(source)+1):'Belum terhubung'}${good?'. Benar':''}" ${good?'disabled':''}><span class="match-pin" data-target-pin="${id}" aria-hidden="true">${good?icon('check'):status==='wrong'?icon('close'):icon('arrow')}</span><span class="od-field od-fill"><strong class="term-name">${esc(c.term)}</strong><span class="term-source">${source?'Kartu '+(cultures.indexOf(source)+1)+' · '+source.label:'Belum ada kartu terhubung'}</span></span><span class="term-status">${good?icon('circlecheck'):status==='wrong'?icon('close'):icon('arrow')}<span>${good?'Benar':status==='wrong'?'Coba lagi':source?'Terhubung':'Pasangkan'}</span></span></button>`;}).join('')}
 </div><div class="game-feedback ${game.finished?'is-success':game.errors.length?'is-error':''}" role="status">${icon(game.finished?'circlecheck':game.errors.length?'info':'help')}<p>${message}</p></div>
 <div class="game-board-footer">${guide('sakera',game.finished?'Mantap! Kamu sudah menyelesaikan semua pasangan. Yuk, lihat hasilnya!':'Perhatikan ciri khas pada gambar. Tenang, kamu boleh memperbaiki pasanganmu.',true)}<div class="game-actions">${button('reset-game','Reset','btn-secondary','refresh')}${game.finished?link('hasil','Lihat Hasil','btn-primary','arrow'):button('check-game','Periksa Jawaban','btn-primary','check',assigned<5?'disabled':'')}</div></div></div></section>`;
}
// Pointer Events keep the same rope interaction on mouse, pen, and touch.
// Click/keyboard selection shares the pairing rules with dragging.
let matchCleanup=null,matchClickGuard=null;
document.addEventListener('pointerdown',()=>{matchClickGuard=null;},{capture:true});
document.addEventListener('click',e=>{
 if(!matchClickGuard||!e.detail)return;
 const card=e.target.closest('.culture-match,.term-match');
 if(card&&performance.now()<matchClickGuard.until){
  matchClickGuard=null;e.preventDefault();e.stopImmediatePropagation();
 }
},{capture:true});
function selectCulture(id){
 if(matchCorrect(id)||game.finished)return;
 game.selected=game.selected===id?null:id;
 render({preserveScroll:true});
 if(game.selected)$('.term-match:not(:disabled)')?.focus({preventScroll:true});
}
function connectCulture(sourceId,targetId){
 if(!cultures.some(c=>c.id===sourceId)||!cultures.some(c=>c.id===targetId)||game.finished||matchCorrect(sourceId)||game.confirmed.some(key=>game.pairs[key]===targetId))return false;
 for(const key of Object.keys(game.pairs)){
  if(game.pairs[key]===targetId){delete game.pairs[key];game.errors=game.errors.filter(x=>x!==key);}
 }
 game.pairs[sourceId]=targetId;game.errors=game.errors.filter(x=>x!==sourceId);
 game.selected=null;game.checked=false;
 render({preserveScroll:true});
 const next=cultures.find(c=>!matchCorrect(c.id)&&!game.pairs[c.id]);
 const focus=next?$(`[data-action="select-culture"][data-id="${next.id}"]`):$('[data-action="check-game"]');
 focus?.focus({preventScroll:true});
 toast(`${cultures.find(c=>c.id===sourceId).label} terhubung dengan ${cultures.find(c=>c.id===targetId).term}.`);
 return true;
}
function bindMatchConnections(){
 matchCleanup?.();matchCleanup=null;
 const svg=document.getElementById('match-lines');if(!svg)return;
 const stage=svg.closest('.match-stage'),events=new AbortController(),signal=events.signal;
 let drag=null,frame=0,drawFrame=0;
 const feedback=$('.game-feedback p'),originalFeedback=feedback.textContent;
 const point=pin=>{const p=pin.getBoundingClientRect(),r=svg.getBoundingClientRect();return{x:p.left+p.width/2-r.left,y:p.top+p.height/2-r.top};};
 const rope=(from,to,status)=>{
  const bend=Math.max(24,Math.abs(to.x-from.x)*.45);
  const d=`M ${from.x} ${from.y} C ${from.x+bend} ${from.y}, ${to.x-bend} ${to.y}, ${to.x} ${to.y}`;
  const group=document.createElementNS('http://www.w3.org/2000/svg','g');
  group.setAttribute('class',`rope ${status}`);
  for(const layer of ['rope-edge','pair-line','rope-fiber']){
   const path=document.createElementNS('http://www.w3.org/2000/svg','path');
   path.setAttribute('d',d);path.setAttribute('class',layer);group.append(path);
  }
  svg.append(group);
 };
 const draw=()=>{
  if(!svg.isConnected)return;
  const rect=svg.getBoundingClientRect();if(!rect.width||!rect.height)return;
  svg.setAttribute('viewBox',`0 0 ${rect.width} ${rect.height}`);svg.replaceChildren();
  for(const [sourceId,targetId] of Object.entries(game.pairs)){
   if(drag?.moved&&drag.id===sourceId)continue;
   const from=$(`[data-source-pin="${sourceId}"]`,stage),to=$(`[data-target-pin="${targetId}"]`,stage);if(!from||!to)continue;
   rope(point(from),point(to),matchStatus(sourceId));
  }
  if(drag){
   const target=drag.hover?$('[data-target-pin]',drag.hover):null;
   const to=target?point(target):{x:Math.max(0,Math.min(rect.width,drag.x-rect.left)),y:Math.max(0,Math.min(rect.height,drag.y-rect.top))};
   rope(point(drag.pin),to,'is-live');
   const tip=document.createElementNS('http://www.w3.org/2000/svg','circle');
   tip.setAttribute('cx',to.x);tip.setAttribute('cy',to.y);tip.setAttribute('r','6');tip.setAttribute('class','rope-tip');svg.append(tip);
  }
 };
 const scheduleDraw=()=>{if(!drawFrame)drawFrame=requestAnimationFrame(()=>{drawFrame=0;draw();});};
 const targetAt=(x,y)=>{
  const card=document.elementFromPoint(x,y)?.closest('.term-match');
  return card&&stage.contains(card)&&!card.disabled?card:null;
 };
 const hoverTarget=()=>{
  if(!drag)return;
  const next=targetAt(drag.x,drag.y);
  if(next===drag.hover)return;
  drag.hover?.classList.remove('drop-target');drag.hover=next;
  next?.classList.add('drop-target');
  feedback.textContent=next?`Lepaskan tali untuk menghubungkan ke ${$('.term-name',next).textContent}.`:'Arahkan ujung tali ke kartu nama tradisi di kanan. Escape untuk membatalkan.';
 };
 const clearDrag=()=>{
  if(!drag)return null;
  const previous=drag;drag=null;
  cancelAnimationFrame(frame);frame=0;
  previous.button.classList.remove('dragging');previous.hover?.classList.remove('drop-target');stage.classList.remove('is-dragging');
  previous.button.setAttribute('aria-pressed',String(game.selected===previous.id));
  if(previous.pin.hasPointerCapture(previous.pointerId))previous.pin.releasePointerCapture(previous.pointerId);
  feedback.textContent=originalFeedback;
  return previous;
 };
 const finishDrag=(e,canceled=false)=>{
  if(!drag||(e&&e.pointerId!==drag.pointerId))return;
  if(e){drag.x=e.clientX;drag.y=e.clientY;}
  const target=canceled?null:targetAt(drag.x,drag.y);
  const moved=drag.moved||Math.hypot(drag.x-drag.startX,drag.y-drag.startY)>4;
  const previous=clearDrag();
  matchClickGuard={until:performance.now()+500};
  if(canceled){scheduleDraw();toast('Tarikan tali dibatalkan. Pasangan sebelumnya tetap tersimpan.');return;}
  if(target&&moved){connectCulture(previous.id,target.dataset.id);return;}
  if(!moved){selectCulture(previous.id);return;}
  scheduleDraw();toast('Tali belum terpasang. Lepaskan di kartu kanan yang belum terkunci.');
 };
 const tick=()=>{
  if(!drag)return;
  if(drag.moved){
   const top=Math.max(0,$('.site-header')?.getBoundingClientRect().bottom||0)+48;
   const bottom=window.innerHeight-72;
   const scroll=drag.y<top?-Math.min(12,(top-drag.y)/4):drag.y>bottom?Math.min(12,(drag.y-bottom)/4):0;
   if(scroll)window.scrollBy(0,scroll);
  }
  hoverTarget();draw();frame=requestAnimationFrame(tick);
 };
 stage.addEventListener('pointerdown',e=>{
  const pin=e.target.closest('[data-source-pin]');
  if(!pin||e.button!==0||e.isPrimary===false||drag)return;
  const button=pin.closest('.culture-match');if(button.disabled||game.finished)return;
  e.preventDefault();button.focus({preventScroll:true});
  drag={id:pin.dataset.sourcePin,pin,button,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,moved:false,hover:null};
  pin.setPointerCapture(e.pointerId);button.classList.add('dragging');button.setAttribute('aria-pressed','true');stage.classList.add('is-dragging');
  feedback.textContent='Tarik tali ke kartu nama tradisi di kanan. Escape untuk membatalkan.';
  tick();
 },{signal});
 document.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.pointerId)return;
  e.preventDefault();drag.x=e.clientX;drag.y=e.clientY;
  if(Math.hypot(drag.x-drag.startX,drag.y-drag.startY)>4)drag.moved=true;
 },{signal,passive:false});
 document.addEventListener('pointerup',e=>finishDrag(e),{signal});
 document.addEventListener('pointercancel',e=>finishDrag(e,true),{signal});
 stage.addEventListener('lostpointercapture',e=>{if(drag?.pointerId===e.pointerId)finishDrag(null,true);},{signal});
 document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  if(drag){e.preventDefault();finishDrag(null,true);}
  else if(game.selected&&!$('#modal').open){e.preventDefault();game.selected=null;render({preserveScroll:true});toast('Pilihan kartu dibatalkan.');}
 },{signal});
 window.addEventListener('blur',()=>{if(drag)finishDrag(null,true);},{signal});
 window.addEventListener('scroll',scheduleDraw,{signal,passive:true});
 window.addEventListener('resize',scheduleDraw,{signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&drag)finishDrag(null,true);},{signal});
 $$('img',stage).forEach(image=>image.addEventListener('load',scheduleDraw,{signal}));
 const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(scheduleDraw):null;
 observer?.observe(stage);scheduleDraw();
 matchCleanup=()=>{clearDrag();events.abort();observer?.disconnect();cancelAnimationFrame(frame);cancelAnimationFrame(drawFrame);};
}
function gatePage(s,title,cta){
 return `<section class="mini-game gate-page" aria-labelledby="gate-title"><div class="game-utility"><div class="od-cluster">${link('menu','Kembali ke Peta','btn-ghost','back')}<span class="badge terra">Petualangan Cerita · Kelas VI SD</span></div></div><header class="game-banner"><div class="game-title-icon">${icon('lock')}</div><div class="od-field od-fill"><h1 id="gate-title">${esc(title)}</h1><p>Tahap ini menanti kamu di ${esc(s.title)}.</p></div></header><div class="card game-board"><div class="gate-body empty-state"><div class="empty-symbol">${icon('book')}</div><h2>Baca dulu kisahnya, Sakaleh!</h2><p>Agar ${esc(title).toLowerCase()} bermakna, baca kisah <strong>${esc(s.title)}</strong> terlebih dahulu. Petualanganmu bebas memilih cerita, tetapi setiap kisah harus dibaca sebelum permainan dan kuisnya terbuka.</p><div class="od-cluster mt-4">${link('baca/'+s.id,'Baca '+esc(s.title),'btn-primary','book')}${cta||''}</div></div><div class="game-board-footer">${guide('sakera','Sudah membaca cerita ini? Coba muat ulang halaman atau buka lewat Peta Petualangan.',true)}</div></div></section>`;
}
function sequenceGame(id){
 const s=KiraraAdmin.visibleStories().find(x=>x.id===id),act=storyActivities[id];
 if(!s||!act)return blank('Permainan tidak ditemukan','Kembali ke Peta Petualangan untuk memilih kisah.',link('menu','Kembali ke Peta','btn-primary','home'));
 if(!readDone(id))return gatePage(s,'Susun Alur Cerita');
 if(seq.story!==id)resetSequence(id);
 const total=act.sequence.length;
 const correct=seq.checked?seq.order.filter((v,i)=>v===i).length:0;
 const message=seq.finished?'Alur cerita sudah benar semua! Kamu memahami rangkaian peristiwa '+esc(s.title)+'.':seq.checked?correct+' dari '+total+' kartu sudah di posisi yang tepat. Perbaiki kartu bertanda "Periksa lagi", lalu periksa kembali.':'Geser kartu (atau pakai tombol Naik/Turun) sampai urutannya masuk akal, lalu tekan Periksa Urutan.';
 return `<section class="mini-game" aria-labelledby="game-title">
 <div class="game-utility"><div class="od-cluster">${link('menu','Kembali ke Peta','btn-ghost','back')}<span class="badge terra">${esc(s.title)} · Misi Baca Paham</span></div><div class="game-counters"><div class="game-counter">${icon('clock')}<span class="od-field"><span class="small">Waktu bermain</span><strong id="game-time" class="timer">${time(seq.elapsed)}</strong></span></div><div class="game-counter score">${icon('star')}<span class="od-field"><span class="small">Upaya pemeriksaan</span><strong>${seq.attempts} <small>kali</small></strong></span></div>${button('seq-hint','Petunjuk','btn-secondary','help')}</div></div>
 <header class="game-banner"><div class="game-title-icon">${icon('game')}</div><div class="od-field od-fill"><h1 id="game-title">Susun Alur Cerita</h1><p>${esc(act.intro)}</p></div><div class="game-progress">${progress(seq.finished?100:seq.checked?Math.round(correct/total*100):0,'Posisi tepat',seq.finished?total+' / '+total:correct+' / '+total)}</div></header>
 <div class="card game-board"><div class="game-instruction">${icon('arrow')}<p id="seq-instructions"><strong>Urutkan peristiwa.</strong> Tahan kartu lalu geser untuk menukar posisinya, atau gunakan tombol Naik/Turun di tiap kartu. Kartu nomor 1 adalah peristiwa awal cerita.</p></div>
 <ol class="sequence-board" id="sequence-board" aria-describedby="seq-instructions">${seq.order.map((cardIdx,pos)=>{const text=act.sequence[cardIdx];const status=seq.checked?(cardIdx===pos?'correct':'wrong'):'';const label='Kartu '+(pos+1)+' dari '+total+': '+text+(seq.checked?(cardIdx===pos?'. Posisi tepat.':'. Belum tepat.'):'');return `<li class="sequence-card ${status}" data-card-index="${cardIdx}" data-pos="${pos}" aria-label="${esc(label)}"><span class="sequence-number ${seq.checked?(cardIdx===pos?'correct':'wrong'):'wrong'}" aria-hidden="true">${pos+1}</span><span class="sequence-text od-fill">${esc(text)}</span><span class="sequence-state" aria-hidden="true">${seq.checked?(cardIdx===pos?icon('circlecheck'):icon('close')):icon('help')}</span><span class="sequence-handle" aria-hidden="true">⠿</span><span class="sequence-move"><button type="button" class="btn btn-secondary icon-button" data-action="seq-up" data-index="${pos}" aria-label="Naikkan kartu ${pos+1}" ${pos===0?'disabled':''}>${icon('arrow')}</button><button type="button" class="btn btn-secondary icon-button seq-down-btn" data-action="seq-down" data-index="${pos}" aria-label="Turunkan kartu ${pos+1}" ${pos===total-1?'disabled':''}>${icon('arrow')}</button></span></li>`}).join('')}</ol>
 <div class="game-feedback ${seq.finished?'is-success':seq.checked&&correct<total?'is-error':''}" role="status">${icon(seq.finished?'circlecheck':seq.checked&&correct<total?'info':'help')}<p>${message}</p></div>
 <div class="game-board-footer">${guide('sakera',seq.finished?'Mantap! Alurnya sudah runtut. Yuk, jawab kuis cerita ini!':'Ingat kembali isi cerita yang kamu baca. Tenang, kartu boleh diatur ulang berkali-kali.',true)}<div class="game-actions">${button('seq-reset','Acak Ulang','btn-secondary','refresh')}${seq.finished?link('kuis/'+id,'Lanjut Kuis Cerita','btn-primary','quiz'):button('seq-check','Periksa Urutan','btn-primary','check')}</div></div></div></section>`;
}
function resetSequence(id){
 const total=storyActivities[id].sequence.length;
 let order;
 do{order=[...Array(total).keys()];for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}}while(order.every((v,i)=>v===i));
 seq={story:id,order,checked:false,attempts:0,elapsed:0,finished:false};
}
function checkSequence(){
 if(seq.finished||!seq.story)return;
 seq.attempts++;seq.checked=true;
 const total=storyActivities[seq.story].sequence.length;
 const correct=seq.order.filter((v,i)=>v===i).length;
 if(correct===total){
  seq.finished=true;
  const score=seq.attempts===1?100:Math.max(70,100-(seq.attempts-1)*10);
  const story=seq.story;markStage(story,'game');
  state.lastResult={kind:'game',story,label:'Susun Alur · '+(stories.find(x=>x.id===story)?.title||story),score,correct:total,total,elapsed:seq.elapsed,note:'Hasil ini mencakup '+total+' kartu alur '+esc(stories.find(x=>x.id===story)?.title||story)+'.'};
  persist();render({preserveScroll:true});toast('Alur cerita berhasil disusun! Kamu mendapat '+score+' nilai.');
 }else render({preserveScroll:true});
}
function storyQuizPage(id){
 const s=KiraraAdmin.visibleStories().find(x=>x.id===id),act=storyActivities[id];
 if(!s||!act)return blank('Kuis tidak ditemukan','Kembali ke Peta Petualangan untuk memilih kisah.',link('menu','Kembali ke Peta','btn-primary','home'));
 if(!readDone(id))return gatePage(s,'Kuis Cerita');
 if(storyQuiz.story!==id)storyQuiz={story:id,index:0,answers:[],selected:null,revealed:false,elapsed:0,finished:false};
 const list=act.quiz;
 if(storyQuiz.finished){
  const score=Math.round(storyQuiz.answers.filter(Boolean).length/list.length*100);
  const good=score===100;
  return `<section class="mini-game" aria-labelledby="game-title"><div class="game-utility"><div class="od-cluster">${link('menu','Kembali ke Peta','btn-ghost','back')}<span class="badge terra">${esc(s.title)} · Kuis Cerita</span></div></div><header class="game-banner"><div class="game-title-icon">${icon('quiz')}</div><div class="od-field od-fill"><h1 id="game-title">Kuis ${esc(s.title)}</h1><p>${esc(s.desc)}</p></div></header><div class="card game-board quiz-main"><h2 class="quiz-question">${good?'Kamu paham kisahnya!':'Sudah berani mencoba, itu hebat!'}</h2><div class="result-score mt-4">${score}<small> / 100</small></div><div class="mt-4">${badge(good?'Kuis cerita terselesaikan':'Ayo coba lagi setelah membaca ulang',good?'green':'terra',good?'circlecheck':'book')}</div><p class="mt-6">${good?'Pemahamanmu tentang '+esc(s.title)+' sudah kuat. Petualangan cerita ini selesai!':'Belum tepat kali ini tidak apa-apa. Baca kembali kisahnya, lalu coba lagi.'}</p><div class="result-actions od-cluster gap-4">${link('menu','Kembali ke Peta','btn-primary','home')}${button('story-quiz-retry','Coba Lagi','btn-secondary','refresh')}${link('karya','Ruang Karya','btn-ghost','art')}</div></div></section>`;
 }
 const q=list[storyQuiz.index];
 const correct=storyQuiz.selected===q.correct;
 return `<section class="mini-game" aria-labelledby="game-title"><div class="game-utility"><div class="od-cluster">${link('menu','Kembali ke Peta','btn-ghost','back')}<span class="badge terra">${esc(s.title)} · Kuis Cerita</span></div><div class="game-counters"><div class="game-counter">${icon('clock')}<span class="od-field"><span class="small">Waktu mengerjakan</span><strong id="quiz-time" class="timer">${time(storyQuiz.elapsed)}</strong></span></div><div class="game-counter score">${icon('star')}<span class="od-field"><span class="small">Jawaban benar</span><strong>${storyQuiz.answers.filter(Boolean).length} <small>/ ${list.length}</small></strong></span></div>${button('story-quiz-hint','Petunjuk','btn-secondary','help')}</div></div><header class="game-banner"><div class="game-title-icon">${icon('quiz')}</div><div class="od-field od-fill"><h1 id="game-title">Kuis ${esc(s.title)}</h1><p>Baca pertanyaannya dengan teliti. Pilih jawaban yang paling tepat.</p></div><div class="game-progress">${progress(Math.round(storyQuiz.answers.length/list.length*100),'Pertanyaan',(storyQuiz.index+1)+' dari '+list.length)}</div></header><div class="card game-board quiz-main"><h2 class="quiz-question">${esc(q.q)}</h2><div class="quiz-options" role="group" aria-label="Pilihan jawaban">${q.options.map((a,i)=>`<button type="button" class="quiz-option ${storyQuiz.selected===i?'selected':''} ${storyQuiz.revealed?(i===q.correct?'correct':storyQuiz.selected===i?'wrong':''):''}" data-action="story-quiz-answer" data-index="${i}" aria-pressed="${storyQuiz.selected===i}" ${storyQuiz.revealed?'disabled':''}><span class="option-key">${'ABCD'[i]}</span><span class="od-fill">${esc(a)}</span>${storyQuiz.revealed&&i===q.correct?icon('circlecheck'):storyQuiz.revealed&&storyQuiz.selected===i?icon('close'):''}</button>`).join('')}</div><div class="mt-6" role="status">${storyQuiz.revealed?notice((correct?'Benar! ':'Belum tepat. Jawaban: '+esc(q.options[q.correct])+'. ')+esc(q.explain||''),correct?'success':'error',correct?'circlecheck':'info'):notice('Pilih satu jawaban, lalu tekan Berikutnya.','')}${''}</div><div class="quiz-actions">${storyQuiz.revealed?(storyQuiz.index===list.length-1?button('story-quiz-finish','Lihat Hasil','btn-primary','arrow'):button('story-quiz-next','Berikutnya','btn-primary','arrow')):button('story-quiz-check','Periksa Jawaban','btn-primary','check',storyQuiz.selected===null?'disabled':'')}</div></div></section>`;
}
function bindSequenceGame(){
 const board=$('#sequence-board');if(!board)return;
 const events=new AbortController(),signal=events.signal;
 let drag=null;
 board.addEventListener('pointerdown',e=>{
  if(e.button!==0||e.isPrimary===false||drag)return;
  const card=e.target.closest('.sequence-card');if(!card||e.target.closest('button'))return;
  e.preventDefault();
  drag={card,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,moved:false};
  card.classList.add('dragging');board.classList.add('is-dragging');
  card.setPointerCapture(e.pointerId);
 },{signal});
 board.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.pointerId)return;
  const x=e.clientX,y=e.clientY;
  if(Math.hypot(x-drag.startX,y-drag.startY)>6&&!drag.moved){drag.moved=true;drag.card.style.pointerEvents='none';}
  if(!drag.moved)return;
  drag.card.style.transform=`translateY(${y-drag.startY}px)`;
  const target=document.elementFromPoint(x,y)?.closest('.sequence-card');
  if(target&&target!==drag.card){
   const rect=target.getBoundingClientRect(),after=y>rect.top+rect.height/2;
   const parent=target.parentElement;
   if(after)parent.insertBefore(drag.card,target.nextSibling);else parent.insertBefore(drag.card,target);
   drag.startY=y;drag.card.style.transform='';
   $$('.sequence-card',board).forEach((c,i)=>{const n=$('.sequence-number',c);if(n)n.textContent=String(i+1);});
  }
 },{signal});
 const finishDrag=e=>{
  if(!drag||(e&&e.pointerId!==drag.pointerId))return;
  const card=drag.card;drag=null;
  card.classList.remove('dragging');board.classList.remove('is-dragging');
  card.style.pointerEvents='';card.style.transform='';
  seq.order=$$('.sequence-card',board).map(c=>Number(c.dataset.cardIndex));
  seq.checked=false;
  render({preserveScroll:true});
 };
 board.addEventListener('pointerup',finishDrag,{signal});
 board.addEventListener('pointercancel',finishDrag,{signal});
 board.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&drag){e.preventDefault();$$('.sequence-card',board).forEach(c=>c.classList.remove('dragging'));board.classList.remove('is-dragging');drag=null;render({preserveScroll:true});}
 },{signal});
}
function moveSequence(pos,dir){
 if(seq.finished)return;
 const swap=pos+dir;if(swap<0||swap>=seq.order.length)return;
 [seq.order[pos],seq.order[swap]]=[seq.order[swap],seq.order[pos]];
 seq.checked=false;
 render({preserveScroll:true});
 const btn=$(`[data-action="${dir<0?'seq-up':'seq-down'}"][data-index="${swap}"]`);
 btn?.focus({preventScroll:true});
}
function storyQuizAction(action,index){
 const act=storyActivities[storyQuiz.story];if(!act)return;
 const list=act.quiz;
 if(action==='story-quiz-retry'){storyQuiz={story:storyQuiz.story,index:0,answers:[],selected:null,revealed:false,elapsed:0,finished:false};render({preserveScroll:true});return;}
 if(storyQuiz.finished)return;
 if(action==='story-quiz-answer'){if(storyQuiz.revealed)return;storyQuiz.selected=Number(index);}
 else if(action==='story-quiz-check'){
  if(storyQuiz.selected===null||storyQuiz.revealed)return;
  const q=list[storyQuiz.index];
  storyQuiz.answers[storyQuiz.index]=storyQuiz.selected===q.correct;
  storyQuiz.revealed=true;
 }else if(action==='story-quiz-next'){
  if(!storyQuiz.revealed)return;
  storyQuiz.index++;storyQuiz.selected=null;storyQuiz.revealed=false;
 }else if(action==='story-quiz-finish'){
  if(!storyQuiz.revealed)return;
  storyQuiz.finished=true;
  const total=list.length,correct=storyQuiz.answers.filter(Boolean).length,score=Math.round(correct/total*100);
  const story=storyQuiz.story,s=stories.find(x=>x.id===story);
  markStage(story,'quiz');
  state.lastResult={kind:'story-quiz',story,label:'Kuis · '+(s?.title||story),score,correct,total,elapsed:storyQuiz.elapsed,note:'Hasil ini mencakup '+total+' soal kuis '+(s?.title||story)+', bukan penilaian seluruh cerita.'};
  persist();
 }
 render({preserveScroll:true});
}
function quizPage(){return KiraraAdmin.studentQuiz();}
function resultPage(){const r=state.lastResult;if(!r)return `${pageHeading('Hasil Belajarmu','Selesaikan satu aktivitas untuk melihat hasilnya.')}${blank('Petualanganmu baru dimulai','Hasil kuis dan permainan akan tampil setelah kamu menyelesaikannya.',link('menu','Kembali ke Peta','btn-primary','game'),'trophy')}`;const good=r.score===100;const label=r.label||(r.kind==='game'?'Mini Game':'Kuis Budaya');const statText=r.kind==='game'&&r.story?'Posisi kartu benar':r.kind==='game'?'Pasangan benar':'Jawaban benar';const note=r.note||(r.kind==='quiz'?'Hasil ini mencakup '+r.total+' soal yang dikerjakan, bukan penilaian seluruh cerita.':'Hasil ini mencakup 5 pasangan budaya dari referensi.');return `${pageHeading('Setiap langkah adalah kemajuan.','Inilah hasil aktivitas yang baru kamu selesaikan.')}<section class="card panel result-layout" style="padding:var(--s8)"><div class="result-guide">${img('sakera','Sakera menyemangati hasil belajarmu')}<h2>${good?'Hebat Sakaleh!':'Terus semangat!'}</h2></div><div><p class="muted">Nilai ${esc(label)}</p><div class="result-score mt-4">${r.score}<small> / 100</small></div><div class="mt-4">${badge(good?'Tantangan terselesaikan':'Ayo coba lagi',good?'green':'terra',good?'circlecheck':'book')}</div><div class="result-stats"><div class="od-stat"><strong>${r.correct} dari ${r.total}</strong><span class="muted small">${statText}</span></div><div class="od-stat"><strong>${time(r.elapsed)}</strong><span class="muted small">Waktu pengerjaan</span></div></div>${good?`<div class="achievement">${icon('trophy')}<div class="od-field"><strong>${r.kind==='game'&&r.story?'Penyusun Alur Cerita':r.kind==='game'?'Sahabat Budaya':'Pembaca Cermat'}</strong><span class="small">Lencana aktivitasmu</span></div></div>`:''}<p class="mt-6">${good?'Kamu menyelesaikan tantangan dengan teliti. Terus belajar dan kenali kekayaan budaya Madura!':'Belum tepat kali ini tidak apa-apa. Baca kembali cerita, lalu coba jawab dengan lebih teliti.'}</p><p class="small muted mt-4">${note}</p><div class="result-actions">${button('play-again','Main Lagi','btn-secondary','refresh')}${link('menu','Kembali ke Peta','btn-primary','home')}${link('karya','Ruang Karya','btn-ghost','art')}</div></div></section>`;}

function allArtworks(){return [...artworks,...KiraraAdmin.galleryUploads()];}
function artworkImage(a){return a.data?`<img class="od-media" src="${esc(a.data)}" alt="${esc(a.title)}" width="${Number(a.width)||600}" height="${Number(a.height)||400}" loading="lazy">`:img(a.image,a.title);}
function likes(a){return a.likes+(state.likes.includes(a.id)?1:0);}
function likeButton(a){return `<button class="like-button" data-action="like-art" data-id="${esc(a.id)}" aria-pressed="${state.likes.includes(a.id)}" aria-label="${state.likes.includes(a.id)?'Batalkan apresiasi':'Apresiasi'} ${esc(a.title)}">${icon('heart')}<span>${likes(a)}</span></button>`;}
function galleryCards(){let list=allArtworks().filter(a=>(galleryFilter==='Semua Karya'||a.category===galleryFilter)&&[a.title,a.student,a.school].join(' ').toLowerCase().includes(gallerySearch.toLowerCase()));if(gallerySort==='popular')list.sort((a,b)=>likes(b)-likes(a));else if(gallerySort==='name')list.sort((a,b)=>a.title.localeCompare(b.title,'id'));else list.reverse();if(!list.length)return `<div style="grid-column:1/-1">${blank('Belum ada karya yang cocok','Coba kata pencarian lain atau tampilkan semua kategori.',button('clear-filter','Tampilkan Semua','btn-secondary','refresh'),'search')}</div>`;return list.map(a=>`<article class="card art-card"><button class="art-open" data-action="open-art" data-id="${esc(a.id)}" aria-label="Lihat karya ${esc(a.title)}">${artworkImage(a)}</button><div class="art-info">${badge(esc(a.category))}<h2><button class="art-title-button" data-action="open-art" data-id="${esc(a.id)}">${esc(a.title)}</button></h2><div class="od-field"><strong class="small">${esc(a.student)}</strong><span class="small muted">${esc(a.school||'Karya di perangkat ini')}</span></div></div><div class="art-footer"><span class="muted">Kelas ${esc(a.className)}</span>${likeButton(a)}</div></article>`).join('');}
function gallery(){return `${pageHeading('Ruang Karya','Cerita yang dibaca, kreativitas yang tumbuh.',button('upload-art','Scan & Upload Karya Kamu','btn-primary upload-cta','camera'))}${KiraraAdmin.galleryStatus()}<div class="gallery-toolbar"><div class="field"><label for="art-search">Cari karya atau nama teman</label><input id="art-search" type="search" class="input" placeholder="Misalnya: Jokotole" value="${esc(gallerySearch)}"></div><div class="field sort-field"><label for="art-sort">Urutkan karya</label><select id="art-sort" class="input"><option value="popular" ${gallerySort==='popular'?'selected':''}>Paling banyak diapresiasi</option><option value="newest" ${gallerySort==='newest'?'selected':''}>Terbaru ditambahkan</option><option value="name" ${gallerySort==='name'?'selected':''}>Judul A–Z</option></select></div></div><div class="filters" role="group" aria-label="Kategori karya">${['Semua Karya','Ilustrasi Cerita','Kerajinan Tangan','Komik Mini'].map(c=>button('filter-art',c,'filter-btn','',`data-category="${c}" aria-pressed="${galleryFilter===c}"`)).join('')}</div><div id="gallery-grid" class="od-grid gallery-grid" aria-live="polite">${galleryCards()}</div><p class="gallery-caption">Karya dan nama awal merupakan contoh dari referensi desain. Apresiasi dan unggahanmu tersimpan di perangkat ini.</p><div class="mt-8">${guide('marlena','Setiap karya punya cerita. Lihat karya teman, beri apresiasi, lalu bagikan hasil kreativitasmu sendiri.')}</div>`;}
function profile(){
 const vstories=KiraraAdmin.visibleStories();
 const opened=Object.keys(state.visited).length;
 const completedAch=(state.gameEarned?1:0)+(state.bestQuiz!==null?1:0);
 const stagesTotal=vstories.length*3;
 const stagesDone=vstories.reduce((n,s)=>n+(readDone(s.id)?1:0)+(stage(s.id,'game')?1:0)+(stage(s.id,'quiz')?1:0),0);
 return `${pageHeading('Profil Siswa','Perjalanan kecilmu mengenal budaya Madura.')}<div class="profile-layout"><aside class="card profile-intro"><div class="avatar large">${esc((state.name||'S').charAt(0).toUpperCase())}</div><div class="profile-name od-field"><h2>${esc(state.name||'Sobat Budaya')}</h2><p class="muted">Kelas ${esc(state.className)}</p></div>${button('edit-profile','Ubah Profil','btn-secondary','edit')}<p class="small muted">Profil dan progres tersimpan di perangkat ini.</p></aside><div class="od-stack gap-8"><div class="od-grid stats-grid"><div class="card od-stat stat-card"><strong>${points()}</strong><span>Poin Budaya</span></div><div class="card od-stat stat-card"><strong>${Object.keys(state.completedStories||{}).length} / ${vstories.length}</strong><span>Cerita selesai</span></div><div class="card od-stat stat-card"><strong>${state.bestQuiz===null?'—':state.bestQuiz}</strong><span>Nilai kuis terbaik</span></div></div><section class="card"><h2>Progres petualangan</h2><div class="mt-6">${progress(Math.round(stagesDone/stagesTotal*100),'Tahap petualangan',stagesDone+' / '+stagesTotal+' tahap selesai')}</div><p class="small muted mt-4">Setiap kisah punya tiga tahap: Baca, Susun Alur, dan Kuis Cerita. Tamatkan ketiganya di sebuah kisah untuk +50 Poin Budaya. ${opened} sampul atau cuplikan cerita pernah dibuka.</p><div class="mt-6">${vstories.map(s=>{const next=storyStage(s.id);const chips=[['Baca',readDone(s.id)],['Susun Alur',stage(s.id,'game')],['Kuis',stage(s.id,'quiz')]];return `<div class="profile-story">${KiraraAdmin.storyImage(s,'')}<div class="od-field od-fill"><h3>${esc(s.title)}</h3><div class="journey-stages">${chips.map(([t,done])=>`<span class="journey-stage ${done?'done':''}">${icon(done?'circlecheck':'lock')}<span>${t}</span></span>`).join('')}</div></div>${next?link(next[1],next[0],'btn-ghost','arrow'):`<span class="success-text od-row">${icon('trophy')}<span>Selesai</span></span>`}</div>`}).join('')}</div></section><section class="card"><h2>Lencana perjalanan</h2><div class="badge-list mt-6">${[['Sahabat Budaya',state.gameEarned,'Selesaikan 5 pasangan budaya'],['Pembaca Cermat',state.quizEarned,'Jawab kuis dengan benar'],['Penyusun Alur',vstories.some(s=>stage(s.id,'game')),'Susun alur satu cerita dengan tepat']].map(([t,earned,d])=>`<div class="achievement ${earned?'':'locked'}">${icon(earned?'trophy':'lock')}<div class="od-field"><strong>${t}</strong><span class="small">${earned?'Sudah diraih':d}</span></div></div>`).join('')}</div></section></div></div>`;}
function materials(){return `${pageHeading('Kenali Budaya Madura','Istilah yang akan kamu temui dalam permainan budaya.',link('mini-game','Coba Mini Game','btn-primary','game'))}<div class="od-grid material-grid">${KiraraAdmin.visibleMaterials().map(c=>`<article class="card material-card" style="padding:var(--s4)"><span class="material-frame">${img(c.image,c.term,'material-image')}</span><div class="od-stack material-copy"><h2>${esc(c.term)}</h2><p class="mt-2">${esc(c.desc)}</p>${KiraraAdmin.materialBody(c.id)?'<p class="mt-2">'+esc(KiraraAdmin.materialBody(c.id)).replace(/\n/g,'<br>')+'</p>':''}</div></article>`).join('')}</div><p class="section-note">Ringkasan mengikuti kartu pada referensi. Materi pembelajaran lengkap belum tersedia.</p><div class="mt-8">${guide('sakera','Kenali nama budayanya terlebih dahulu. Setelah itu, coba cocokkan gambar dengan istilah yang tepat.')}</div>`;}

function kit(){
 const colors=[['Cream','var(--background)'],['Panel','var(--surface)'],['Bacaan','var(--reading-surface)'],['Terracotta','var(--primary)'],['Kayu','var(--world-wood)'],['Kayu gelap','var(--world-wood-dark)'],['Kayu muda','var(--world-wood-light)'],['Emas','var(--gold)'],['Hijau','var(--success)'],['Teks','var(--text)'],['Sekunder','var(--muted)'],['Error','var(--error)'],['Fokus','var(--focus)'],['Langit','var(--world-sky)'],['Padang','var(--world-meadow)']];
 const colorCodes=['#FFF9F2','#FFF4DD','#FFFFFF','#A83D24','#8A5038','#613A2B','#C28A62','#F2BF45','#2D6845','#382B24','#69584A','#AE2634','#214F75','#A7D1D7','#AFC797'];
 return `${pageHeading('KIRARA Design System','Satu dunia petualangan budaya, satu sistem komponen.',link('menu','Buka Aplikasi','btn-primary','arrow'))}
 <nav class="kit-nav" aria-label="Dokumentasi"><a href="DESIGN.md">Spesifikasi desain</a><a href="design-tokens.json" download>Unduh token JSON</a><a href="README.md">Panduan implementasi</a></nav>
 <div class="od-grid kit-grid">
 <section class="card kit-section"><h2>Palet warna</h2><div class="swatches">${colors.map(([n,v],i)=>`<div class="swatch"><span class="swatch-color" style="background:${v}"></span><strong>${n}</strong><span>${colorCodes[i]}</span></div>`).join('')}</div><p class="small muted">Terracotta menandai aksi, emas untuk reward, hijau untuk keberhasilan. Status selalu memiliki teks atau ikon. Panel opak melindungi bacaan dari latar ilustrasi.</p></section>
 <section class="card kit-section"><h2>Tipografi</h2><div class="od-stack gap-6"><div><h3 style="font-size:var(--display)">Kisah yang menginspirasi.</h3><p class="small muted">Display · Trebuchet MS · 32–56px</p></div><div><h3 style="font-size:var(--section-title)">Kenali budaya Madura</h3><p class="small muted">Section · 24px / 700</p></div><div><h3>Jokotole & Kuda Si Giga</h3><p class="small muted">Card · 20px / 700</p></div><p>Segoe UI untuk isi pembelajaran. Body 18px; label dan caption 16px. Line-height 1.6, bacaan 1.7 dengan lebar maksimal 65ch.</p></div></section>
 <section class="card kit-section"><h2>Tombol dan state</h2><div class="od-cluster gap-4">${button('kit-toast','Primary','btn-primary','arrow')}${button('kit-toast','Secondary','btn-secondary','book')}${button('kit-toast','Ghost','btn-ghost','back')}<button type="button" class="btn btn-primary" disabled>Belum Tersedia</button>${button('kit-loading','Simpan Contoh','btn-secondary','check')}</div><p class="small muted">Tinggi minimal 48px; target sentuh minimal 44px. Primary memakai terracotta dan secondary memakai cream dengan bingkai kayu. Fokus biru terlihat, hover menggelapkan aksi, dan pressed memberi umpan balik. Reduced-motion menghapus pergeseran.</p><div class="od-cluster">${badge('Terpilih','terra','check')}${badge('Benar','green','circlecheck')}${badge('Contoh reward','gold','star')}</div></section>
 <section class="card kit-section"><h2>Input dan pencarian</h2><form id="kit-form" class="od-stack gap-4" novalidate><div class="field"><label for="kit-name">Nama panggilan *</label><input id="kit-name" class="input" placeholder="Tulis namamu" required aria-describedby="kit-error"><p id="kit-error" class="field-error"></p></div><div class="field"><label for="kit-search">Pencarian komponen</label><input id="kit-search" class="input" type="search" placeholder="Coba: Button"></div><p id="kit-search-result" class="small muted" aria-live="polite">Nama komponen akan ditampilkan di sini.</p><button type="submit" class="btn btn-secondary">Coba Validasi</button></form><p class="small muted">Label selalu terlihat. Validasi saat blur dan submit; pesan kesalahan muncul di dekat input. Isi field dan error tidak bergantung pada warna saja.</p></section>
 <section class="card kit-section"><h2>Progress dan notifikasi</h2>${progress(60,'Contoh progres','3 / 5')}${notice('Contoh: jawaban benar.','success','circlecheck')}${notice('Contoh: pilih jawaban sebelum melanjutkan.','error','info')}${notice('Contoh: naskah lengkap belum tersedia.')}${button('kit-modal','Buka Modal','btn-secondary','info')}<p class="small muted">Dialog menyediakan tombol tutup, Escape, serta fokus kembali. Loading hanya dipakai untuk pekerjaan yang memang membutuhkan waktu.</p></section>
 <section class="card kit-section"><h2>Dialog karakter</h2>${guide('sakera','Baca petunjuknya, lalu pilih jawabanmu.')}${guide('marlena','Menurutmu, apa yang bisa kita teladani?')}<p class="small muted">Karakter asli menjadi pendamping satu pesan. Ukuran ilustrasi mengikuti peran halaman dan mempertahankan rasio intrinsiknya.</p></section>
 <section class="card kit-section"><h2>Navigasi dan ikon</h2><div class="od-cluster">${['menu','book','game','quiz','art','user','star','clock','heart','check','camera','sound'].map(n=>`<span class="icon-tile" aria-label="${n}" role="img">${icon(n)}</span>`).join('')}</div><div class="od-cluster"><a class="nav-item" href="#/menu" aria-current="page">Menu Utama</a><a class="nav-item" href="#/cerita">Pilih Cerita</a></div><p class="small muted">SVG outline 24px, stroke 2, satu keluarga ikon. Navbar tetap lima menu; profil tersedia melalui avatar atau menu mobile. Lokasi aktif memakai terracotta dengan teks yang jelas.</p></section>
 <section class="card kit-section"><h2>Pilihan kuis dan chip</h2><button type="button" class="quiz-option selected" data-action="kit-toast" aria-pressed="true"><span class="option-key">A</span><span class="od-fill">Jokotole</span>${icon('check')}</button><button type="button" class="quiz-option correct" data-action="kit-toast"><span class="option-key">A</span><span class="od-fill">Benar</span>${icon('circlecheck')}</button><button type="button" class="quiz-option wrong" data-action="kit-toast"><span class="option-key">B</span><span class="od-fill">Belum tepat</span>${icon('close')}</button><div class="od-cluster">${badge('Ilustrasi Cerita')}${badge('Komik Mini')}${badge('Kelas VI')}</div><p class="small muted">Satu pertanyaan per langkah. Pilihan sejajar, padding konsisten, teks jawaban utuh, dan status disertai ikon serta penjelasan.</p></section>
 <section class="card kit-section"><h2>Kartu cerita dan karya</h2><p>Kartu cerita: gambar → metadata → judul → deskripsi → reward → progres → CTA. Kartu karya: gambar → kategori → judul → pembuat → apresiasi.</p><div class="outline-panel od-stack gap-4"><h3>Story Card</h3><p class="muted">Jokotole & Kuda Si Giga</p>${link('cerita','Lihat Kartu Cerita','btn-secondary','book')}</div><div class="outline-panel od-stack gap-4"><h3>Artwork Card</h3><p class="muted">Gambar karya tampil utuh, dengan judul dan pembuat yang terbaca.</p>${link('karya','Lihat Kartu Karya','btn-secondary','art')}</div></section>
 <section class="card kit-section"><h2>Tali Mini Game</h2><p class="small muted">Contoh tampilan pasangan benar:</p><div class="kit-match-example"><div class="kit-match-node correct"><strong>Kartu budaya</strong><span>${icon('circlecheck')}</span></div>${icon('arrow')}<div class="kit-match-node correct"><strong>Nama tradisi</strong><span>Benar · terkunci</span></div></div><div class="od-cluster">${badge('Terpilih','terra','check')}${badge('Coba lagi','','info')}${badge('Benar','green','circlecheck')}</div><p class="small muted">Pin 44px, tali mengikuti pointer, drop target jelas. Pasangan diperiksa lewat tombol; pasangan benar terkunci. Klik dua kartu dan keyboard tetap tersedia.</p>${link('mini-game','Coba Tarik Tali','btn-secondary','game')}</section>
 <section class="card kit-section"><h2>Latar dan panel</h2><img class="kit-asset" src="assets/kirara-village-background.png" width="1556" height="1011" alt="Latar ilustratif desa, sawah, pegunungan, dan langit hangat yang digunakan KIRARA" loading="lazy"><p class="small muted">Satu gambar lokal dipakai ulang di seluruh aplikasi. Membaca dan kuis memakai latar yang lebih ringan serta panel putih opak. Logo, ilustrasi cerita, Sakera, dan Marlena memakai aset yang sudah ada.</p><p class="small muted">Radius: kontrol 12px, kartu 16px, panel/papan 24px. Bingkai 2px pada komponen umum dan maksimal 4px pada papan utama. Detail kayu tebal dibatasi pada menu dan aksi utama.</p></section>
 <section class="card kit-section"><h2>Spacing dan responsif</h2><div class="od-cluster">${[4,8,12,16,24,32,48,64,96].map(n=>badge(n+'px')).join('')}</div><table class="tokens-table"><thead><tr><th>Ukuran</th><th>Perilaku</th></tr></thead><tbody><tr><td>375px</td><td>Menu compact; konten satu kolom; reader vertikal; matching dua kolom sentuh.</td></tr><tr><td>768px</td><td>Grid dua kolom bila muat; sidebar masuk alur utama.</td></tr><tr><td>1024px</td><td>Reader dua kolom; navbar penuh; grid menyesuaikan ruang.</td></tr><tr><td>1280 / 1440px</td><td>Whitespace lebih lapang; batas lebar halaman 1344px.</td></tr></tbody></table><p class="small muted">Enter 180ms ease-out; exit 120ms ease-in. Konten memakai flex/grid dan layout primitives. Label, harga, waktu, serta status tidak terpotong. Kontrol penting tetap dapat digunakan dengan keyboard dan pembesaran teks.</p></section>
 </div>`;
}

function render(options={}){const previousFocus=document.activeElement;const focusKey=previousFocus?.dataset?{...previousFocus.dataset}:null;const focusId=previousFocus?.id;const route=options.route||location.hash.replace(/^#\/?/,'')||(state.name?'menu':'masuk');currentRoute=route;const isAdmin=route==='admin'||route.startsWith('admin/');document.body.classList.toggle('admin-view',isAdmin);if(isAdmin)return KiraraAdmin.render(route,options);const main=$('#main');main.classList.remove('admin-page');renderHeader(route);let html;switch(route){case'masuk':html=onboarding();break;case'menu':html=menu();break;case'cerita':html=storyList();break;case'mini-game':html=miniGame();break;case'kuis':html=quizPage();break;case'hasil':html=resultPage();break;case'karya':html=gallery();break;case'profil':html=profile();break;case'materi':html=materials();break;case'ui-kit':html=kit();break;default:html=route.startsWith('baca/')?reader(route.split('/')[1]):route.startsWith('susun/')?sequenceGame(route.split('/')[1]):route.startsWith('kuis/')?storyQuizPage(route.split('/')[1]):blank('Halaman tidak ditemukan','Kembali ke Peta Petualangan untuk melanjutkan petualanganmu.',link('menu','Kembali ke Peta','btn-primary','home'));}
 main.classList.toggle('entry-page',route==='masuk'||route==='menu');
 if(choicesInstance){try{choicesInstance.destroy()}catch(e){}choicesInstance=null;}
 main.innerHTML=html;bindMatchConnections();if(route.startsWith('susun/'))bindSequenceGame();document.title=`${$('h1',main)?.textContent || 'KIRARA'} · KIRARA`;if(!options.preserveScroll){requestAnimationFrame(()=>{window.scrollTo(0,scrollPositions[route]||0);main.focus({preventScroll:true});});}else{const replacement=focusId?document.getElementById(focusId):focusKey?.action?$$('[data-action]').find(b=>Object.entries(focusKey).every(([k,v])=>b.dataset[k]===v)):null;(replacement&&!replacement.disabled?replacement:main).focus({preventScroll:true});}if(route==='karya')bindGalleryInputs();bindForms();if(!storageAvailable&&!options.silent)toast('Penyimpanan lokal tidak tersedia. Kamu tetap bisa mencoba aktivitas selama halaman terbuka.');}
window.addEventListener('scroll',()=>{if(currentRoute)scrollPositions[currentRoute]=window.scrollY;},{passive:true});
window.addEventListener('hashchange',()=>{closeModal();readerPage=0;render();});
function updateGallery(){const grid=$('#gallery-grid');if(grid)grid.innerHTML=galleryCards();}
let choicesInstance=null;
function bindGalleryInputs(){
 $('#art-search')?.addEventListener('input',e=>{gallerySearch=e.target.value;updateGallery();});
 const sort=$('#art-sort');
 if(sort){
  try{choicesInstance?.destroy();}catch(e){}
  choicesInstance=window.Choices?new Choices(sort,{searchEnabled:false,shouldSort:false,itemSelectText:'',noChoicesText:'',labelId:sort.previousElementSibling?.id||'art-sort-label',classNames:{flippedState:'is-flipped'}}):null;
  sort.addEventListener('change',e=>{gallerySort=e.target.value;updateGallery();});
 }
}
function validName(input,error){const name=input.value.trim();const ok=name.length>=2;input.setAttribute('aria-invalid',String(!ok));error.textContent=ok?'':'Tulis nama panggilan dengan minimal 2 huruf.';return ok;}
function navigateTo(route){
 closeModal();readerPage=0;
 // The app view changes directly even when a preview restricts URL navigation.
 try{history.pushState(null,'','#/'+route);}catch(e){try{location.hash='/'+route;}catch(ignored){}}
 render({route});
}
function startAdventure(form){
 const input=$('#student-name',form),error=$('#name-error',form),summary=$('.error-summary',form);
 if(!validName(input,error)){
  summary.textContent='Isi nama panggilanmu terlebih dahulu, lalu tekan Mulai Petualangan.';
  input.focus();return;
 }
 summary.textContent='';
 state.name=input.value.trim();persist();
 navigateTo('menu');
}
document.addEventListener('submit',e=>{
 if(e.target.id!=='onboarding-form')return;
 e.preventDefault();startAdventure(e.target);
});
function bindForms(){const form=$('#onboarding-form');if(form){
 const input=$('#student-name',form),error=$('#name-error',form);
 input.addEventListener('blur',e=>{
  // Keep the button still when focus moves from the input to Submit.
  if(e.relatedTarget?.closest('#onboarding-form [data-action="start-adventure"]'))return;
  const ok=validName(input,error);if(ok)$('.error-summary',form).textContent='';
 });
}$('#reflection')?.addEventListener('input',e=>{state.reflection=e.target.value;});const k=$('#kit-form');if(k){$('#kit-name').addEventListener('blur',()=>validName($('#kit-name'),$('#kit-error')));k.addEventListener('submit',e=>{e.preventDefault();if(validName($('#kit-name'),$('#kit-error')))toast('Contoh input berhasil divalidasi.');else $('#kit-name').focus();});$('#kit-search').addEventListener('input',e=>{const names=['Primary Button','Secondary Button','Ghost Button','Card','Story Card','Artwork Card','Quiz Option','Badge','Chip','Progress Bar','Navigation','Input','Search Field','Modal','Notification','Character Dialogue'];const query=e.target.value.toLowerCase();$('#kit-search-result').textContent=names.filter(n=>n.toLowerCase().includes(query)).join(', ')||'Tidak ada komponen yang cocok.';});}}

document.addEventListener('keydown',e=>{
 if(e.key!=='Enter'||e.isComposing||e.target.id!=='student-name')return;
 const form=e.target.closest('#onboarding-form');if(!form)return;
 e.preventDefault();startAdventure(form);
});
document.addEventListener('click',e=>{
 const anchor=e.target.closest('a[href^="#/"]');
 if(anchor&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey&&e.button===0){
  e.preventDefault();navigateTo(anchor.getAttribute('href').slice(2));return;
 }
 const target=e.target.closest('[data-action]');if(!target||target.disabled)return;const action=target.dataset.action,id=target.dataset.id;
 switch(action){
 case'complete-story':KiraraAdmin.completeStory(id);break;
 case'start-adventure':e.preventDefault();startAdventure(target.closest('#onboarding-form'));break;
 case'toggle-nav':{const nav=$('#main-nav');const open=nav.classList.toggle('open');target.setAttribute('aria-expanded',String(open));target.setAttribute('aria-label',open?'Tutup menu navigasi':'Buka menu navigasi');$('.mobile-profile',nav).style.display=open?'flex':'none';break;}
 case'close-modal':closeModal();break;
 case'help':modal('Bantuan KIRARA',`<p>Pilih kisah di <strong>Peta Petualangan</strong>, lalu selesaikan tiga tahapnya: Baca, Susun Alur, dan Kuis Cerita. Kamu bebas memilih cerita mana pun untuk dimulai.</p><p>Di <strong>Mini Game</strong>, pasangkan gambar budaya dengan istilahnya, dan di <strong>Kuis Budaya</strong> jawab soal dari pengelola. Ruang Karya untuk mengapresiasi karya teman.</p><p>Progres dan karya hanya disimpan di perangkat ini. Naskah lengkap serta audio yang belum tersedia diberi keterangan.</p><p>Gunakan tombol Tab untuk berpindah, Enter untuk memilih, dan Escape untuk menutup dialog.</p>`);break;
 case'text-size':largeText=!largeText;render({preserveScroll:true});break;
 case'reader-prev':readerPage=0;render({preserveScroll:true});break;
 case'reader-next':readerPage=1;{const sid=currentRoute.split('/')[1];if(sid&&stories.some(x=>x.id===sid))markStage(sid,'read');}render({preserveScroll:true});break;
 case'susun-cta':{e.preventDefault();const sid=currentRoute.split('/')[1];if(sid&&stories.some(x=>x.id===sid))markStage(sid,'read');location.hash='#/susun/'+(sid||'');}break;
 case'save-reflection':{state.reflection=$('#reflection').value;const sid=currentRoute.split('/')[1];if(sid&&stories.some(x=>x.id===sid))markStage(sid,'read');const saved=persist();toast(saved?'Refleksimu tersimpan. Terima kasih sudah berpikir bersama Marlena.':'Refleksi tersimpan untuk sesi ini. Penyimpanan perangkat tidak tersedia.');}break;
 case'seq-up':case'seq-down':moveSequence(Number(target.dataset.index),action==='seq-up'?-1:1);break;
 case'seq-check':checkSequence();break;
 case'seq-reset':if(seq.attempts&&!seq.finished)modal('Acak ulang kartu?','<p>Urutan yang sudah kamu atur akan diacak kembali dari awal. Nilai dan lencana yang sudah diraih tetap tersimpan.</p>',button('close-modal','Batal','btn-secondary')+button('confirm-seq-reset','Acak Ulang','btn-primary','refresh'));else if(!seq.finished){resetSequence(seq.story);render({preserveScroll:true});}break;
 case'confirm-seq-reset':closeModal();resetSequence(seq.story);render({preserveScroll:true});break;
 case'seq-hint':modal('Cara bermain Susun Alur','<ol><li>Baca tiap kartu peristiwa, lalu pikirkan urutan cerita yang kamu baca.</li><li>Tahan kartu dengan mouse atau jari, geser ke posisi baru, lalu lepaskan.</li><li>Cara lain: gunakan tombol <strong>Naik</strong> dan <strong>Turun</strong> di sisi kartu dengan keyboard.</li><li>Tekan <strong>Periksa Urutan</strong>. Kartu di posisi yang tepat terkunci hijau; kartu lain ditandai "Periksa lagi".</li><li>Perbaiki kartu yang belum tepat, lalu periksa kembali sampai seluruh alur runtut.</li></ol>');break;
 case'story-quiz-hint':modal('Cara menjawab kuis','<ol><li>Baca pertanyaan dan keempat pilihan dengan teliti.</li><li>Pilih satu jawaban, lalu tekan <strong>Periksa Jawaban</strong>.</li><li>Baca penjelasannya, lalu tekan <strong>Berikutnya</strong> untuk soal berikutnya.</li><li>Setelah soal terakhir, lihat hasilmu. Kamu boleh mencoba lagi kapan saja.</li></ol>');break;
 case'game-hint':modal('Cara bermain',`<ol><li>Tahan pin di sisi kanan kartu gambar, lalu <strong>tarik talinya</strong> dengan mouse atau jari.</li><li>Arahkan ujung tali ke kartu nama tradisi di kolom kanan. Kartu tujuan ditandai saat siap menerima tali.</li><li>Lepaskan untuk memasang tali. Jika kartu tujuan sudah dipasangkan dan belum terkunci, tali sebelumnya akan diganti.</li><li>Pasangkan kelima kartu, lalu tekan <strong>Periksa Jawaban</strong>. Pasangan benar mendapat centang hijau dan terkunci.</li><li>Tarik ulang pin pada pasangan <strong>Coba lagi</strong> untuk memperbaikinya. Lepaskan di luar kartu atau tekan Escape untuk membatalkan tarikan.</li></ol><p>Alternatif: klik kartu kiri lalu kartu kanan. Dengan keyboard, gunakan Tab untuk berpindah serta Enter atau Spasi untuk memilih. Kamu dapat menggulir halaman saat tidak menarik pin; saat menarik tali, arahkan ke tepi layar untuk menggulir.</p>`);break;
 case'select-culture':selectCulture(id);break;
 case'select-term':{
  if(!game.selected){toast('Pilih kartu budaya di sebelah kiri terlebih dahulu.');return;}
  connectCulture(game.selected,id);break;
 }
 case'check-game':{
  if(Object.keys(game.pairs).length<5)return;
  game.checked=true;game.selected=null;game.confirmed=cultures.filter(c=>game.pairs[c.id]===c.id).map(c=>c.id);game.errors=cultures.filter(c=>game.pairs[c.id]!==c.id).map(c=>c.id);
  if(game.confirmed.length===5){game.finished=true;state.gameEarned=true;state.lastResult={kind:'game',score:100,correct:5,total:5,elapsed:game.elapsed};persist();}
  render({preserveScroll:true});break;
 }
 case'reset-game':if(Object.keys(game.pairs).length)modal('Mulai ulang permainan?',`<p>Pasangan pada permainan ini akan dikosongkan. Poin dan lencana yang sudah diraih tetap tersimpan.</p>`,button('close-modal','Batal','btn-secondary')+button('confirm-reset-game','Mulai Ulang','btn-primary','refresh'));else resetGame();break;
 case'confirm-reset-game':closeModal();resetGame();break;
 case'quiz-answer':KiraraAdmin.quizAction(action,target);break;
 case'quiz-doubt':KiraraAdmin.quizAction(action,target);break;
 case'quiz-next':case'quiz-advance':KiraraAdmin.quizAction(action,target);break;
 case'story-quiz-answer':case'story-quiz-check':case'story-quiz-next':case'story-quiz-finish':case'story-quiz-retry':storyQuizAction(action,target.dataset.index);break;
 case'play-again':{const kind=state.lastResult?.kind,story=state.lastResult?.story;
  if(kind==='game'&&story){resetSequence(story);location.hash='/susun/'+story;}
  else if(kind==='game'){game={selected:null,pairs:{},confirmed:[],errors:[],checked:false,elapsed:0,finished:false};location.hash='/mini-game';}
  else if(kind==='story-quiz'){storyQuiz={story,index:0,answers:[],selected:null,revealed:false,elapsed:0,finished:false};location.hash='/kuis/'+story;}
  else{quiz={answer:null,doubt:false,review:false,revealed:false,elapsed:0,finished:false};location.hash='/kuis';}
 break;}
 case'filter-art':galleryFilter=target.dataset.category;$$('[data-action="filter-art"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===galleryFilter)));updateGallery();break;
 case'clear-filter':galleryFilter='Semua Karya';gallerySearch='';render({preserveScroll:true});break;
 case'like-art':{const index=state.likes.indexOf(id);if(index>=0)state.likes.splice(index,1);else state.likes.push(id);persist();const a=allArtworks().find(a=>a.id===id);if(a){$$(`[data-action="like-art"][data-id="${id}"]`).forEach(b=>{b.setAttribute('aria-pressed',String(state.likes.includes(id)));b.setAttribute('aria-label',(state.likes.includes(id)?'Batalkan apresiasi ':'Apresiasi ')+a.title);$('span',b).textContent=likes(a);});}break;}
 case'open-art':{const a=allArtworks().find(a=>a.id===id);if(!a)return;modal(esc(a.title),`${artworkImage(a)}<div class="od-cluster between">${badge(esc(a.category))}${likeButton(a)}</div><p><strong>${esc(a.student)}</strong><br>Kelas ${esc(a.className)}${a.school?' · '+esc(a.school):''}</p><p class="small muted">${a.data?'Karya di perangkat ini. Belum dipublikasikan ke server.':'Contoh karya dari referensi desain KIRARA.'}</p>`);break;}
 case'upload-art':openUpload();break;
 case'edit-profile':openProfile();break;
 case'kit-toast':toast('Contoh komponen aktif. Tampilan ini menggunakan token KIRARA.');break;
 case'kit-loading':target.disabled=true;target.innerHTML=icon('clock')+'<span>Menyimpan contoh…</span>';setTimeout(()=>{if(target.isConnected){target.disabled=false;target.innerHTML=icon('check')+'<span>Simpan Contoh</span>';}toast('Contoh state berhasil. Tidak ada data siswa yang diubah.');},800);break;
 case'kit-modal':modal('Contoh Modal','<p>Modal menggunakan judul, tombol tutup, fokus keyboard, dan tombol Escape. Setelah ditutup, fokus kembali ke pemicunya.</p>',button('close-modal','Selesai','btn-primary','check'));break;
 }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#main-nav')?.classList.contains('open')){$('#main-nav').classList.remove('open');const b=$('[data-action="toggle-nav"]');b?.setAttribute('aria-expanded','false');b?.focus();}});
function resetGame(){game={selected:null,pairs:{},confirmed:[],errors:[],checked:false,elapsed:0,finished:false};render({preserveScroll:true});toast('Permainan dimulai kembali.');}
function openProfile(){modal('Ubah Profil',`<form id="profile-form" class="od-stack gap-4" novalidate><div class="field"><label for="profile-name">Nama panggilan *</label><input class="input" id="profile-name" value="${esc(state.name)}" maxlength="40" required aria-describedby="profile-error"><p class="field-error" id="profile-error"></p></div><div class="field"><label for="profile-class">Kelas</label><select class="input" id="profile-class">${['VI','VI-A','VI-B','VI-C'].map(c=>`<option ${c===state.className?'selected':''}>${c}</option>`).join('')}</select></div><button class="btn btn-primary" type="submit">Simpan Profil</button></form>`);const input=$('#profile-name'),error=$('#profile-error');input.addEventListener('blur',()=>validName(input,error));$('#profile-form').addEventListener('submit',e=>{e.preventDefault();if(!validName(input,error)){input.focus();return;}state.name=input.value.trim();state.className=$('#profile-class').value;persist();closeModal();render({preserveScroll:true});toast('Profil diperbarui.');});}

function openUpload(){modal('Bagikan kreativitasmu',`<p class="muted">Ambil foto atau pilih gambar karya. Unggahan akan ditambahkan ke galeri di perangkat ini.</p><form id="upload-form" class="od-stack gap-4" novalidate><div id="upload-errors" role="alert"></div><div class="field"><label for="art-file">Foto karya *</label><input id="art-file" class="input" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" required aria-describedby="file-hint file-error"><p id="file-hint" class="small muted">JPG, PNG, atau WebP. Maksimal 2 MB. Pada perangkat yang mendukung, pilih kamera untuk memotret.</p><p id="file-error" class="field-error"></p></div><img id="upload-preview" class="upload-preview od-media" alt="Pratinjau karya yang dipilih" hidden><div class="field"><label for="art-title">Judul karya *</label><input id="art-title" class="input" maxlength="100" required placeholder="Beri judul karyamu" aria-describedby="title-error"><p id="title-error" class="field-error"></p></div><div class="field"><label for="art-category">Kategori</label><select id="art-category" class="input"><option>Ilustrasi Cerita</option><option>Kerajinan Tangan</option><option>Komik Mini</option></select></div><div class="field"><label for="art-author">Nama pembuat *</label><input id="art-author" class="input" maxlength="40" value="${esc(state.name)}" required aria-describedby="author-error"><p id="author-error" class="field-error"></p></div><button id="upload-submit" type="submit" class="btn btn-primary">${icon('upload')}Tambahkan ke Galeri</button><p id="upload-status" class="small" role="status"></p></form>`);
 let fileData=null,dimensions=null,pendingRead=false;
 const file=$('#art-file'),title=$('#art-title'),author=$('#art-author');
 function fieldCheck(input,error,label){const ok=input.value.trim().length>=2;$(error).textContent=ok?'':`Tulis ${label} dengan minimal 2 huruf.`;input.setAttribute('aria-invalid',String(!ok));return ok;}
 title.addEventListener('blur',()=>fieldCheck(title,'#title-error','judul karya'));author.addEventListener('blur',()=>fieldCheck(author,'#author-error','nama pembuat'));
 file.addEventListener('change',()=>{fileData=null;dimensions=null;$('#upload-preview').hidden=true;const f=file.files[0];if(!f)return;if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>2*1024*1024){$('#file-error').textContent='Pilih JPG, PNG, atau WebP berukuran maksimal 2 MB.';file.setAttribute('aria-invalid','true');return;}$('#file-error').textContent='';file.setAttribute('aria-invalid','false');pendingRead=true;$('#upload-status').textContent='Menyiapkan pratinjau gambar…';$('#upload-submit').disabled=true;const reader=new FileReader();reader.onload=()=>{const probe=new Image();probe.onload=()=>{fileData=reader.result;dimensions=[probe.naturalWidth,probe.naturalHeight];const p=$('#upload-preview');if(!p)return;p.src=fileData;p.width=dimensions[0];p.height=dimensions[1];p.hidden=false;pendingRead=false;$('#upload-submit').disabled=false;$('#upload-status').textContent='Gambar siap ditambahkan.';};probe.onerror=()=>uploadFailure();probe.src=reader.result;};reader.onerror=()=>uploadFailure();reader.readAsDataURL(f);function uploadFailure(){pendingRead=false;if(!$('#upload-submit'))return;$('#upload-submit').disabled=false;$('#upload-status').textContent='';$('#file-error').textContent='Gambar tidak dapat dibaca. Coba pilih berkas gambar lain.';}});
 $('#upload-form').addEventListener('submit',e=>{e.preventDefault();if(pendingRead)return;const okTitle=fieldCheck(title,'#title-error','judul karya');const okAuthor=fieldCheck(author,'#author-error','nama pembuat');if(!fileData)$('#file-error').textContent='Pilih foto karya terlebih dahulu.';const errors=[];if(!fileData)errors.push(['art-file','Pilih foto karya']);if(!okTitle)errors.push(['art-title','Lengkapi judul karya']);if(!okAuthor)errors.push(['art-author','Lengkapi nama pembuat']);if(errors.length){$('#upload-errors').innerHTML=notice('Lengkapi bagian berikut: '+errors.map(([id,t])=>`<a href="#${id}" data-error-target="${id}">${t}</a>`).join(', '),'error');$$('[data-error-target]').forEach(a=>a.addEventListener('click',ev=>{ev.preventDefault();$('#'+a.dataset.errorTarget).focus();}));$('#'+errors[0][0]).focus();return;}const item={id:'local-'+Date.now(),title:title.value.trim(),student:author.value.trim(),category:$('#art-category').value,className:state.className,school:'',likes:0,data:fileData,width:dimensions[0],height:dimensions[1]};state.uploads.push(item);KiraraAdmin.registerUpload(item);const saved=persist();closeModal();galleryFilter='Semua Karya';gallerySearch='';gallerySort='newest';if(currentRoute==='karya')render({preserveScroll:true});else location.hash='/karya';toast(saved?'Karyamu tersimpan. Lihat status peninjauan di Ruang Karya.':'Karya tampil untuk sesi ini. Penyimpanan perangkat penuh atau tidak tersedia.');});
}

setInterval(()=>{if(currentRoute==='mini-game'&&!game.finished){game.elapsed++;const n=$('#game-time');if(n)n.textContent=time(game.elapsed);}if(currentRoute==='kuis'&&!quiz.finished){quiz.elapsed++;const n=$('#quiz-time');if(n)n.textContent=time(quiz.elapsed);}if(currentRoute&&currentRoute.startsWith('susun/')&&!seq.finished){seq.elapsed++;const n=$('#game-time');if(n)n.textContent=time(seq.elapsed);}if(currentRoute&&currentRoute.startsWith('kuis/')&&!storyQuiz.finished){storyQuiz.elapsed++;const n=$('#quiz-time');if(n)n.textContent=time(storyQuiz.elapsed);}},1000);
KiraraAdmin.init();
render();
