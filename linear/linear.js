'use strict';

const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={
 arrow:'M5 12h14m-6-6 6 6-6 6',back:'M19 12H5m6-6-6 6 6 6',close:'m6 6 12 12M6 18 18 6',
 book:'M12 5v15M3 4c4-1 7 0 9 2 2-2 5-3 9-2v15c-4-1-7 0-9 2-2-2-5-3-9-2Z',
 game:'M7 7h10a5 5 0 0 1 5 5l-1 6a2 2 0 0 1-3 1l-3-3H9l-3 3a2 2 0 0 1-3-1l-1-6a5 5 0 0 1 5-5Zm-1 5h4m-2-2v4m8-3h.01m2 3h.01',
 quiz:'M8 3h8l4 4v14H4V3h4Zm8 0v5h4M9 12a3 3 0 1 1 4 3v1m-1 3h.01',
 user:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
 star:'m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z',
 clock:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2',pin:'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0ZM14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
 check:'m5 12 4 4L19 6',circlecheck:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-14 0 3 3 7-7',
 info:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 11v6m0-10h.01',
 trophy:'M8 3h8v7a4 4 0 0 1-8 0V3Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v5m-4 2h8',
 sound:'M11 4 6 8H3v8h3l5 4V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14',
 play:'m8 4 12 8-12 8Z',refresh:'M3 10a9 9 0 1 1 2 8M3 3v7h7',help:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9a3 3 0 1 1 4 3v2m-1 3h.01',home:'m3 11 9-8 9 8M5 10v11h5v-7h4v7h5V10'
};
const icon=name=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[name]||icons.info}"/></svg>`;
const dims={logo:[165,127],sakera:[311,315],marlena:[231,230],jokotole:[597,520],'potre-koneng':[368,206],'ke-lesap':[365,206],'art-jokotole':[369,206],odeng:[103,118],celurit:[101,97],'art-batik':[365,201],'art-karapan':[368,201]};
const img=(name,alt,cls='od-media')=>`<img src="assets/${name}.png" alt="${esc(alt)}" width="${dims[name][0]}" height="${dims[name][1]}" class="${cls}" loading="lazy">`;
const button=(action,text,cls='btn-secondary',ic='',extra='')=>`<button type="button" class="btn ${cls}" data-action="${action}" ${extra}>${ic?icon(ic):''}<span>${text}</span></button>`;
const badge=(text,cls='',ic='')=>`<span class="badge ${cls}">${ic?icon(ic):''}${text}</span>`;
const notice=(text,cls='',ic='info')=>`<div class="notice ${cls}">${icon(ic)}<p>${text}</p></div>`;
const progress=(value,label,right='')=>`<div class="progress-container"><div class="progress-label"><span>${label}</span><strong>${right||value+'%'}</strong></div><progress class="progress-track" max="100" value="${value}" aria-label="${esc(label)}">${value}%</progress></div>`;
const guide=(who,text,slim=false)=>`<div class="guide ${slim?'slim':''}">${img(who,who==='sakera'?'Sakera, pemandu belajar':'Marlena, sahabat membaca')}<div class="od-field"><strong>${who==='sakera'?'Kak Sakera':'Kak Marlena'}</strong><p>${text}</p></div></div>`;
const time=n=>`${Math.floor(n/60).toString().padStart(2,'0')}:${(n%60).toString().padStart(2,'0')}`;

const STORIES=[
 {id:'jokotole',title:'Jokotole & Kuda Si Giga',origin:'Sumenep',category:'Kisah kepahlawanan',readerImage:'jokotole',cardImage:'art-jokotole',minutes:7,desc:'Ksatria sakti pembela keadilan, bersama kuda bersayap Si Giga.',
  text:{heading:'Bab 1: Kelahiran dan Kesaktian Jokotole',paras:['Jokotole adalah putra dari Putri Potre Koneng dan Adipoday. Sejak kecil, ia diasuh oleh Empu Kelleng di Desa Majungan. Jokotole dikenal memiliki kekuatan luar biasa dan hati yang sangat dermawan.','Ketika beranjak dewasa, Jokotole mendapat hadiah pusaka cemeti sakti dan kuda bersayap bernama Si Giga. Dengan ketulusan dan keberaniannya, ia membantu membangun pintu gerbang Kerajaan Majapahit yang megah.'],quote:'“Kekuatan sejati bukanlah untuk menaklukkan yang lemah, melainkan untuk menegakkan keadilan dan melindungi sesama insan ciptaan Tuhan.”'},
  glossary:[['Adipoday','Ayah Jokotole dalam cuplikan cerita ini.'],['Empu Kelleng','Tokoh yang mengasuh Jokotole di Desa Majungan.'],['Pusaka Cemeti','Cemeti sakti yang diterima Jokotole.']],
  guide:'Mengapa Jokotole rela membantu orang lain meski memiliki kesaktian besar?',
  questions:[{question:'Siapakah ksatria perkasa asal Madura yang menunggangi kuda bersayap bernama Si Giga untuk membela keadilan?',options:['Jokotole','Putri Potre Koneng','Ke’ Lesap','Empu Kelleng'],correct:0,explanation:'Jokotole adalah ksatria yang menunggangi Si Giga.'}]},
 {id:'potre-koneng',title:'Putri Potre Koneng',origin:'Sumenep',category:'Legenda keraton',readerImage:'potre-koneng',cardImage:'potre-koneng',minutes:6,desc:'Putri penuh welas asih dalam legenda dari Gua Payudan.',
  text:{heading:'Bab 1: Putri Penyayang dari Sumenep',paras:['Dikisahkan di tanah Sumenep, hiduplah seorang putri bernama Potre Koneng. Ia gemar menumbuhkan rempah-rempah dan mengolah ramuan untuk membantu warga yang sedang sakit. Kebaikannya membuat seluruh kampung menyayanginya.','Suatu hari, ramuan buatan Putri Koneng berhasil menolong banyak warga. Sejak itu, ia dikenang sebagai putri penyayang yang selalu berbagi, dan kisahnya menjadi legenda yang bertahan di Gua Payudan, Sumenep.'],quote:'“Kebaikan yang diberikan dengan tulus akan dikenang jauh lebih lama daripada kecantikan.”'},
  glossary:[['Potre Koneng','Putri; “koneng” berarti kuning dalam bahasa Madura.'],['Ramuan','Campuran rempah untuk pengobatan tradisional.'],['Gua Payudan','Gua di Sumenep yang dikenang dalam legenda ini.']],
  guide:'Mengapa warga kampung menyayangi Putri Potre Koneng?',
  questions:[{question:'Dari daerah manakah asal kisah Putri Potre Koneng?',options:['Sumenep','Bangkalan','Pamekasan','Sampang'],correct:0,explanation:'Kisah Putri Potre Koneng dikenal sebagai legenda dari Sumenep.'}]},
 {id:'ke-lesap',title:'Ke’ Lesap Sang Pemberani',origin:'Bangkalan',category:'Kisah perjuangan',readerImage:'ke-lesap',cardImage:'ke-lesap',minutes:8,desc:'Kisah perjuangan seorang pemberani pembela rakyat Madura.',
  text:{heading:'Bab 1: Pemberani dari Bangkalan',paras:['Dikisahkan di Bangkalan, ada seorang pemuda pemberani yang oleh rakyat disapa Ke’ Lesap. Ia tidak tega melihat warga kecil diperlakukan semena-mena, lalu berani membela mereka.','Ketangguhan dan ketulusan Ke’ Lesap dijunjung tinggi warga. Hingga kini, kisahnya masih dipakai orang tua untuk menanamkan sikap berani, rendah hati, dan suka menolong kepada anak-anak.'],quote:'“Kesederhanaan adalah rumah keberanian; yang hatinya tulus tidak takut kehilangan.”'},
  glossary:[['Ke’ Lesap','Tokoh pemberani dalam kisah rakyat Bangkalan.'],['Pemberani','Orang yang berani membela yang benar.'],['Rendah hati','Tidak sombong meskipun hebat.']],
  guide:'Apa yang membuat Ke’ Lesap dijunjung tinggi oleh warga?',
  questions:[{question:'Kisah Ke’ Lesap Sang Pemberani berasal dari daerah?',options:['Bangkalan','Sumenep','Sampang','Pamekasan'],correct:0,explanation:'Ke’ Lesap adalah tokoh dalam kisah rakyat dari Bangkalan.'}]}
];
const story=()=>STORIES.find(s=>s.id===lin.story)||STORIES[0];
const questions=()=>story().questions;
const cultures=[
 {id:'pesaan',label:'Pakaian adat pria',term:"Pesa’an",desc:'Baju hitam dengan kaos garis merah-putih.',image:'sakera'},
 {id:'odeng',label:'Penutup kepala',term:'Odeng',desc:'Ikat kepala batik berlipat.',image:'odeng'},
 {id:'celurit',label:'Senjata tradisional',term:'Celurit',desc:'Bilah baja melengkung bulan sabit.',image:'celurit'},
 {id:'batik',label:'Kain khas daerah',term:'Batik Madura',desc:'Kain bermotif flora dengan warna berani.',image:'art-batik'},
 {id:'karapan',label:'Pesta pacuan rakyat',term:'Karapan Sapi',desc:'Lomba pacuan sepasang sapi.',image:'art-karapan'}
];
const termOrder=['celurit','batik','pesaan','karapan','odeng'];

const STORAGE='kirara.linear.v1';
const freshGame=()=>({selected:null,pairs:{},confirmed:[],errors:[],checked:false,elapsed:0,finished:false});
const freshQuiz=()=>({index:0,answer:null,doubt:false,review:false,revealed:false,elapsed:0,finished:false,answers:[]});
const defaults=()=>({version:1,name:'',story:'',readDone:false,game:freshGame(),quiz:freshQuiz(),lastResult:null});
let lin=defaults(),storageAvailable=true;
try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'null');if(saved?.version===1)lin={...defaults(),...saved,game:{...freshGame(),...saved.game},quiz:{...freshQuiz(),...saved.quiz}};}catch(e){storageAvailable=false;}
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(lin));storageAvailable=true;return true;}catch(e){storageAvailable=false;return false;}}
const points=()=>(lin.readDone?50:0)+(lin.game.finished?500:0)+(lin.lastResult?.score===100?20:0);

let stage=lin.name?(lin.quiz.finished?'hasil':lin.game.finished?'kuis':lin.story?'baca':'pilih'):'welcome';
if(lin.quiz.finished)stage='hasil';
if(!lin.name)stage='welcome';
if(lin.name&&!lin.story)stage='pilih';

let toastTimeout,dialogReturn;
function toast(message){const node=$('#toast');node.innerHTML=`${icon('info')}<span>${esc(message)}</span>`;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>node.replaceChildren(),6500);}
function modal(title,body,actions=''){dialogReturn=document.activeElement;const d=$('#modal');d.innerHTML=`<div class="dialog-head"><h2 id="dialog-title">${title}</h2>${button('close-modal','Tutup','btn-ghost icon-button','close','aria-label="Tutup dialog"')}</div><div class="dialog-body">${body}</div>${actions?`<div class="dialog-actions">${actions}</div>`:''}`;d.showModal();$('input,textarea,button',d)?.focus();}
function closeModal(){const d=$('#modal');if(d.open)d.close();}
$('#modal').addEventListener('close',()=>{if(dialogReturn?.isConnected)dialogReturn.focus();});

const STAGES=[['welcome','Nama','user'],['pilih','Pilih Cerita','book'],['baca','Baca Cerita','book'],['game','Mini Game','game'],['kuis','Kuis','quiz'],['hasil','Hasil','trophy']];
const BACK_MAP={pilih:'welcome',baca:'pilih',game:'baca',kuis:'game',hasil:'kuis'};
function topBar(){
 const idx=STAGES.findIndex(s=>s[0]===stage);
 const done={welcome:!!lin.name,pilih:!!lin.story,baca:lin.readDone,game:lin.game.finished,kuis:lin.quiz.finished};
 const backTarget=BACK_MAP[stage];
 return `${backTarget?`<button type="button" class="btn btn-ghost lin-back" data-action="lin-back" aria-label="Kembali ke tahap ${STAGES.find(s=>s[0]===backTarget)[1]}">${icon('back')}<span>${STAGES.find(s=>s[0]===backTarget)[1]}</span></button>`:''}<span class="lin-brand"><img src="assets/logo.png" alt="Logo KIRARA">KIRARA</span>
 <ol class="lin-steps" aria-label="Tahap petualangan">${STAGES.map(([id,label,ic],i)=>`<li class="lin-step ${i===idx?'current':done[id]?'done':''}" ${i===idx?'aria-current="step"':''}><span class="lin-step-num">${done[id]?icon('check'):i+1}</span>${label}</li>`).join('')}</ol>
 <span class="lin-points">${icon('star')}<span>${points().toLocaleString('id-ID')}</span></span>`;
}

function welcomeStage(){
 return `<section class="lin-welcome"><img class="scene-background" src="assets/kirara-village-background.png" width="1556" height="1011" alt="" decoding="async">
 <div class="lin-welcome-inner">
  <figure class="scene-companion scene-sakera">${img('sakera','Sakera menyambut petualangan belajarmu')}<figcaption class="od-field"><strong>Sakera</strong><span>Sahabat belajarmu</span></figcaption></figure>
  <div class="lin-welcome-card"><img class="lin-logo" src="assets/logo.png" alt="Logo KIRARA" width="165" height="127"><h1>Kisah dari Madura.<br><span class="primary-text">Petualangan untukmu.</span></h1>
  <form id="lin-form" class="od-stack gap-6" novalidate>
   <div class="field"><label for="lin-name">Nama panggilan kamu <span class="scene-required">(wajib diisi)</span></label><input id="lin-name" name="name" class="input" autocomplete="given-name" maxlength="40" placeholder="Contoh: Budi" value="${esc(lin.name)}" required minlength="2" aria-describedby="lin-name-hint lin-name-error"><p id="lin-name-hint" class="small muted">Isi minimal 2 huruf, lalu tekan Mulai Petualangan.</p><p id="lin-name-error" class="field-error" aria-live="polite"></p></div>
   <button class="btn btn-primary wide" type="button" data-action="lin-start"><span>Mulai Petualangan</span>${icon('arrow')}</button>
  </form></div>
  <figure class="scene-companion scene-marlena">${img('marlena','Marlena menyambut petualangan belajarmu')}<figcaption class="od-field"><strong>Marlena</strong><span>Sahabat membaca</span></figcaption></figure>
 </div></section>`;
}

function audioPlayer(){return `<section class="card audio-player" aria-label="Audio narator"><div class="od-row gap-4">${icon('sound')}<div class="od-field"><strong>Dengarkan cerita</strong><span class="small muted">Audio narator belum tersedia</span></div></div><div class="audio-controls"><button class="btn btn-primary icon-button" disabled aria-label="Putar audio, rekaman belum tersedia">${icon('play')}</button><span>00:00</span><input type="range" min="0" max="100" value="0" disabled aria-label="Posisi audio"><span>--:--</span><select class="input" disabled aria-label="Kecepatan audio"><option>1×</option></select></div></section>`;}

function pilihStage(){
 const s=story();
 return `<section class="lin-pilih"><div class="lin-pilih-wrap">
 ${pageHeading('Pilih ceritamu, mulai petualangan.',`Halo ${esc(lin.name)}, pilih bebas salah satu kisah rakyat Madura tentang keberanian, kebaikan, dan perjuangan.`,badge(lin.story?'Kisah terpilih · '+esc(s.title):'3 kisah tersedia','terra','book'))}
 <div class="od-grid story-grid">${STORIES.map(x=>{const chosen=lin.story===x.id;return `<article class="card story-card ${chosen?'is-chosen':''}"><div class="story-media">${img(x.cardImage,x.title)}</div><div class="story-body"><div class="story-meta"><span>${icon('pin')}${esc(x.origin)}</span><span>${icon('clock')}${x.minutes} menit</span></div><h2>${esc(x.title)}</h2><p>${esc(x.desc)}</p><div class="story-meta"><span class="story-reward">${icon('star')}+50 Poin Budaya</span></div>${button('lin-pilih-story',chosen?'Pilih Ulang Kisah Ini':'Pilih Kisah Ini',chosen?'btn-secondary':'btn-primary','book',`data-id="${x.id}"`)}</div></article>`;}).join('')}</div>
 <div class="mt-6">${guide('sakera',lin.story?'Kamu sudah memilih. Tekan tombol untuk membaca ulang atau ganti kisah.':'Pilih cerita paling menarik menurutmu, lalu lanjut membaca dengan Kak Marlena!')}</div>
 </div></section>`;
}

function bacaStage(){
 const s=story(),large=lin.largeText;
 return `<section class="lin-baca"><div class="lin-baca-wrap">
 <div class="reader-layout">
  <aside><figure class="reader-figure"><img src="assets/${s.readerImage}.png" alt="Ilustrasi ${esc(s.title)}" width="${dims[s.readerImage][0]}" height="${dims[s.readerImage][1]}" class="od-media"><figcaption>${esc(s.title)} · ${esc(s.origin)}</figcaption></figure>${audioPlayer()}</aside>
  <section class="card reader-copy"><div class="od-cluster between">${badge(s.category,'terra')}<span class="small muted od-row">${icon('clock')}±${s.minutes} menit baca</span></div>
   <h1>${esc(s.text.heading)}</h1><article ${large?'style="font-size:26px"':''}>${s.text.paras.map(p=>`<p>${esc(p)}</p>`).join('')}<blockquote>${s.text.quote}</blockquote></article><details class="glossary"><summary>Kenali kata dalam cerita</summary><div class="od-stack gap-4 mt-4">${s.glossary.map(([t,d])=>`<p><strong>${esc(t)}</strong> — ${esc(d)}</p>`).join('')}</div></details>${guide('marlena',esc(s.guide))}
  </section>
 </div>
 <div class="lin-reader-footer">
  ${button('lin-back','Sebelumnya','btn-secondary','back')}
  <div class="reading-progress">${progress(lin.readDone?100:0,'Membaca cerita',lin.readDone?'Selesai dibaca':'Belum selesai dibaca')}</div>
  ${button('lin-to-game','Lanjut Mini Game','btn-primary','game')}
 </div>
 </div></section>`;
}

function matchCorrect(id){return lin.game.confirmed.includes(id);}
function matchStatus(id){return matchCorrect(id)?'correct':lin.game.errors.includes(id)?'wrong':lin.game.selected===id?'selected':lin.game.pairs[id]?'connected':'';}
function gameStage(){
 const g=lin.game;
 const correct=g.confirmed.length,assigned=Object.keys(g.pairs).length;
 const message=g.finished?'Hebat! Semua pasangan sudah benar. Kamu semakin mengenal budaya Madura.':g.errors.length?'Masih ada pasangan yang belum tepat. Tarik ulang tali bertanda “Coba lagi”; pasangan benar tetap terkunci.':g.selected?'Kartu terpilih. Pilih nama tradisi di kanan dengan klik, Enter, atau Spasi.':assigned===5?'Semua tali sudah terpasang. Klik Periksa Jawaban untuk melihat hasilnya.':'Tarik tali dari pin kiri, lalu lepaskan pada kartu nama tradisi di kanan.';
 return `<section class="mini-game lin-game"><div class="od-stack gap-6">
 <div class="game-utility"><div class="od-cluster"><span class="badge terra">Misi Edukasi Budaya · Kelas VI SD</span></div><div class="game-counters"><div class="game-counter">${icon('clock')}<span class="od-field"><span class="small">Waktu bermain</span><strong id="game-time" class="timer">${time(g.elapsed)}</strong></span></div><div class="game-counter score">${icon('star')}<span class="od-field"><span class="small">Skor permainan</span><strong>${correct*100} <small>poin</small></strong></span></div>${button('game-hint','Petunjuk','btn-secondary','help')}</div></div>
 <header class="game-banner"><div class="game-title-icon">${icon('game')}</div><div class="od-field od-fill"><h1>Cocokkan Budaya Madura</h1><p>Pasangkan kartu gambar warisan adat Madura dengan nama tradisi yang tepat!</p></div><div class="game-progress">${progress(correct*20,'Pasangan selesai',correct+' / 5')}</div></header>
 <div class="card game-board"><div class="game-instruction">${icon('arrow')}<p id="match-instructions"><strong>Tarik talinya.</strong> Tahan pin kiri, tarik ke pasangan di kanan, lalu lepaskan. Bisa juga klik kedua kartu atau gunakan Tab dan Enter.</p></div>
 <div class="match-stage" role="group" aria-label="Papan pasangan budaya" aria-describedby="match-instructions"><div class="match-heading source-heading"><h2>Kartu Gambar Tradisi</h2><span>Kolom A</span></div><div class="match-heading target-heading"><h2>Nama Istilah Tradisi</h2><span>Kolom B</span></div><svg id="match-lines" class="match-lines" aria-hidden="true" focusable="false"></svg>
 ${cultures.map((c,i)=>{const status=matchStatus(c.id),paired=cultures.find(t=>t.id===g.pairs[c.id]);const label=status==='correct'?'Benar':status==='wrong'?'Coba lagi':status==='selected'?'Terpilih':paired?'Terhubung':'Belum terhubung';return `<button type="button" class="culture-match ${status}" style="grid-row:${i+2}" data-action="select-culture" data-id="${c.id}" aria-pressed="${g.selected===c.id}" aria-label="${i+1}. ${esc(c.label)}. ${esc(c.desc)} ${paired?'Pasangan: '+esc(paired.term)+'. ':''}${label}" ${matchCorrect(c.id)?'disabled':''}><span class="culture-picture">${img(c.image,c.label,'od-media')}</span><span class="od-field culture-copy"><span class="culture-label"><span class="culture-number">${i+1}</span><strong>${esc(c.label)}</strong></span><span class="culture-description">${esc(c.desc)}</span><span class="pair-state">${status==='correct'?icon('circlecheck'):status==='wrong'?icon('close'):''}${label}</span></span><span class="match-pin" data-source-pin="${c.id}" aria-hidden="true">${status==='correct'?icon('check'):status==='wrong'?icon('close'):icon('arrow')}</span></button>`;}).join('')}
 ${termOrder.map((id,i)=>{const c=cultures.find(x=>x.id===id),source=cultures.find(x=>g.pairs[x.id]===id);const status=source?matchStatus(source.id):'';const good=source&&matchCorrect(source.id);return `<button type="button" class="term-match ${status}" style="grid-row:${i+2}" data-action="select-term" data-id="${id}" aria-label="${esc(c.term)}. ${source?'Terhubung dengan kartu '+(cultures.indexOf(source)+1):'Belum terhubung'}${good?'. Benar':''}" ${good?'disabled':''}><span class="match-pin" data-target-pin="${id}" aria-hidden="true">${good?icon('check'):status==='wrong'?icon('close'):icon('arrow')}</span><span class="od-field od-fill"><strong class="term-name">${esc(c.term)}</strong><span class="term-source">${source?'Kartu '+(cultures.indexOf(source)+1)+' · '+source.label:'Belum ada kartu terhubung'}</span></span><span class="term-status">${good?icon('circlecheck'):status==='wrong'?icon('close'):icon('arrow')}<span>${good?'Benar':status==='wrong'?'Coba lagi':source?'Terhubung':'Pasangkan'}</span></span></button>`;}).join('')}
 </div><div class="game-feedback ${g.finished?'is-success':g.errors.length?'is-error':''}" role="status">${icon(g.finished?'circlecheck':g.errors.length?'info':'help')}<p>${message}</p></div>
 <div class="game-board-footer">${guide('sakera',g.finished?'Mantap! Yuk, lanjut ke Kuis Budaya!':'Perhatikan ciri khas pada gambar. Tenang, kamu boleh memperbaiki pasanganmu.',true)}<div class="game-actions">${button('lin-back','Sebelumnya','btn-secondary stage-back','back')}${button('reset-game','Reset','btn-secondary','refresh')}${g.finished?button('lin-to-kuis','Lanjut Kuis','btn-primary','arrow'):button('check-game','Periksa Jawaban','btn-primary','check',assigned<5?'disabled':'')}</div></div></div>
 </div></section>`;
}

function kuisStage(){
 const Q=questions();
 const q=Q[lin.quiz.index];
 const correct=lin.quiz.answer===q.correct;
 return `<section class="lin-kuis"><div class="quiz-layout">
 <aside class="quiz-guide">${img('sakera','Sakera mendampingi kuis')}<div class="od-stack gap-4 wide"><h2>Kamu pasti bisa!</h2><p>Ingat kembali kisah ${esc(story().title)} yang baru kamu baca.</p>${progress(Math.round(lin.quiz.answers.length/Q.length*100),'Pertanyaan',(lin.quiz.index+1)+' dari '+Q.length)}</div></aside>
 <section class="card quiz-main"><div class="od-cluster between">${badge('Kuis Budaya','gold','book')}<span class="activity-stat small">${icon('clock')}<span id="quiz-time" class="timer">${time(lin.quiz.elapsed)}</span></span></div>
 <h2 class="quiz-question">${esc(q.question)}</h2>
 <div class="quiz-options" role="group" aria-label="Pilihan jawaban">${q.options.map((a,i)=>`<button type="button" class="quiz-option ${lin.quiz.answer===i?'selected':''} ${lin.quiz.revealed?(i===q.correct?'correct':lin.quiz.answer===i?'wrong':''):''}" data-action="quiz-answer" data-index="${i}" aria-pressed="${lin.quiz.answer===i}" ${lin.quiz.revealed?'disabled':''}><span class="option-key">${'ABCD'[i]}</span><span class="od-fill">${esc(a)}</span>${lin.quiz.revealed&&i===q.correct?icon('circlecheck'):lin.quiz.revealed&&lin.quiz.answer===i?icon('close'):''}</button>`).join('')}</div>
 <div class="mt-6" role="status">${lin.quiz.revealed?notice((correct?'Benar! ':'Belum tepat. Jawaban: '+esc(q.options[q.correct])+'. ')+esc(q.explanation),correct?'success':'error',correct?'circlecheck':'info'):lin.quiz.review?notice('Tinjau pilihanmu, lalu tekan Periksa Jawaban.'):lin.quiz.doubt?notice('Soal ditandai ragu-ragu. Tinjau kembali sebelum menjawab.'):''}</div>
  <div class="quiz-actions">${button('lin-back','Sebelumnya','btn-secondary stage-back','back')}${!lin.quiz.revealed?button('quiz-doubt',lin.quiz.doubt?'Batalkan Tanda':'Ragu-ragu','btn-secondary','help','aria-pressed="'+lin.quiz.doubt+'"'):''}${lin.quiz.revealed?button('quiz-advance','Berikutnya','btn-primary','arrow'):button('quiz-next',lin.quiz.review?'Periksa Jawaban':'Berikutnya','btn-primary','arrow',lin.quiz.answer===null?'disabled':'')}</div>
 </section></div></section>`;
}

const pageHeading=(title,subtitle,action='')=>`<div class="page-heading"><div><h1>${title}</h1>${subtitle?`<p>${subtitle}</p>`:''}</div>${action}</div>`;
function hasilStage(){
 const r=lin.lastResult,good=r&&r.score===100;
 return `<section class="lin-hasil"><div class="od-stack gap-6" style="max-width:1100px;width:100%">
 ${pageHeadingless()}
 <section class="card panel result-layout" style="padding:var(--s8)">
  <div class="result-guide">${img('sakera','Sakera menyemangati hasil belajarmu')}<h2>${good?'Hebat Sakaleh!':'Terus semangat!'}</h2></div>
  <div><p class="muted">Nilai Kuis Budaya</p><div class="result-score mt-4">${r?r.score:0}<small> / 100</small></div><div class="mt-4">${badge(good?'Tantangan terselesaikan':'Ayo coba lagi',good?'green':'terra',good?'circlecheck':'book')}</div>
   <div class="result-stats"><div class="od-stat"><strong>${r?r.correct:0} dari ${r?r.total:questions().length}</strong><span class="muted small">Jawaban benar</span></div><div class="od-stat"><strong>${lin.game.finished?lin.game.confirmed.length+' / 5':'—'}</strong><span class="muted small">Pasangan mini game benar</span></div><div class="od-stat"><strong>${r?time(r.elapsed):'—'}</strong><span class="muted small">Waktu kuis</span></div></div>
  ${lin.game.finished?`<div class="achievement">${icon('trophy')}<div class="od-field"><strong>Sahabat Budaya</strong><span class="small">Lencana Mini Game</span></div></div>`:''}
  ${good?`<div class="achievement">${icon('trophy')}<div class="od-field"><strong>Pembaca Cermat</strong><span class="small">Lencana kuis sempurna</span></div></div>`:''}
  <p class="mt-6">${good?'Kamu menyelesaikan petualangan dengan teliti. Terus kenali kekayaan budaya Madura!':'Belum tepat kali ini tidak apa-apa. Baca kembali cerita, lalu coba jawab dengan lebih teliti.'}</p>
  <p class="small muted mt-4">Poin Budaya terkumpul: ${points().toLocaleString('id-ID')}.</p>
  <div class="result-actions">${button('lin-restart','Ulangi Petualangan','btn-secondary','refresh')}${button('lin-finish','Selesai','btn-primary','home')}</div>
  </div>
 </section></div></section>`;
}
function pageHeadingless(){return `<div class="page-heading" style="justify-content:center;text-align:center"><div><h1>Petualangan selesai!</h1><p>Inilah hasil belajarmu, ${esc(lin.name||'Sobat Budaya')}.</p></div></div>`;}

const renders={welcome:welcomeStage,pilih:pilihStage,baca:bacaStage,game:gameStage,kuis:kuisStage,hasil:hasilStage};
let scrollMemo={};
function render(opts={}){
 const quiet=!!opts.quiet;
 if(opts.memo||quiet)scrollMemo={game:$('.lin-game')?.scrollTop||0,kuis:$('.lin-kuis')?.scrollTop||0,copy:$('.reader-copy')?.scrollTop||0};
 $('#lin-top').innerHTML=topBar();
 $('#stage').innerHTML=renders[stage]();
 if(quiet){const section=$('#stage').firstElementChild;if(section)section.style.animation='none';}
 document.title=`${STAGES.find(s=>s[0]===stage)[1]} · KIRARA Linear`;
 if(opts.restoreScroll!==false){
  if(stage==='game')$('.lin-game').scrollTo(0,scrollMemo.game||0);
  if(stage==='kuis')$('.lin-kuis').scrollTo(0,scrollMemo.kuis||0);
  if(stage==='baca')$('.reader-copy').scrollTo(0,scrollMemo.copy||0);
 }
 if(stage==='game')bindMatchConnections();
 $('#stage').focus({preventScroll:true});
}

let matchCleanup=null,matchClickGuard=null;
document.addEventListener('pointerdown',()=>{matchClickGuard=null;},{capture:true});
document.addEventListener('click',e=>{
 if(!matchClickGuard||!e.detail)return;
 const card=e.target.closest('.culture-match,.term-match');
 if(card&&performance.now()<matchClickGuard.until){matchClickGuard=null;e.preventDefault();e.stopImmediatePropagation();}
},{capture:true});
function selectCulture(id){
 if(matchCorrect(id)||lin.game.finished)return;
 lin.game.selected=lin.game.selected===id?null:id;
 render({quiet:true});
 if(lin.game.selected)$('.term-match:not(:disabled)')?.focus({preventScroll:true});
}
function connectCulture(sourceId,targetId){
 if(!cultures.some(c=>c.id===sourceId)||!cultures.some(c=>c.id===targetId)||lin.game.finished||matchCorrect(sourceId)||lin.game.confirmed.some(key=>lin.game.pairs[key]===targetId))return false;
 for(const key of Object.keys(lin.game.pairs)){
  if(lin.game.pairs[key]===targetId){delete lin.game.pairs[key];lin.game.errors=lin.game.errors.filter(x=>x!==key);}
 }
 lin.game.pairs[sourceId]=targetId;lin.game.errors=lin.game.errors.filter(x=>x!==sourceId);
  lin.game.selected=null;lin.game.checked=false;
  persist();render({quiet:true});
 const next=cultures.find(c=>!matchCorrect(c.id)&&!lin.game.pairs[c.id]);
 const focus=next?$(`[data-action="select-culture"][data-id="${next.id}"]`):$('[data-action="check-game"]');
 focus?.focus({preventScroll:true});
 toast(`${cultures.find(c=>c.id===sourceId).label} terhubung dengan ${cultures.find(c=>c.id===targetId).term}.`);
 return true;
}
function bindMatchConnections(){
 matchCleanup?.();matchCleanup=null;
 const svg=document.getElementById('match-lines');if(!svg)return;
 const stageEl=svg.closest('.match-stage'),events=new AbortController(),signal=events.signal;
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
  for(const [sourceId,targetId] of Object.entries(lin.game.pairs)){
   if(drag?.moved&&drag.id===sourceId)continue;
   const from=$(`[data-source-pin="${sourceId}"]`,stageEl),to=$(`[data-target-pin="${targetId}"]`,stageEl);if(!from||!to)continue;
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
  return card&&stageEl.contains(card)&&!card.disabled?card:null;
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
  previous.button.classList.remove('dragging');previous.hover?.classList.remove('drop-target');stageEl.classList.remove('is-dragging');
  previous.button.setAttribute('aria-pressed',String(lin.game.selected===previous.id));
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
  hoverTarget();draw();frame=requestAnimationFrame(tick);
 };
 stageEl.addEventListener('pointerdown',e=>{
  const pin=e.target.closest('[data-source-pin]');
  if(!pin||e.button!==0||e.isPrimary===false||drag)return;
  const btn=pin.closest('.culture-match');if(btn.disabled||lin.game.finished)return;
  e.preventDefault();btn.focus({preventScroll:true});
  drag={id:pin.dataset.sourcePin,pin,button:btn,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,moved:false,hover:null};
  pin.setPointerCapture(e.pointerId);btn.classList.add('dragging');btn.setAttribute('aria-pressed','true');stageEl.classList.add('is-dragging');
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
 stageEl.addEventListener('lostpointercapture',e=>{if(drag?.pointerId===e.pointerId)finishDrag(null,true);},{signal});
 document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  if(drag){e.preventDefault();finishDrag(null,true);}
   else if(lin.game.selected&&!$('#modal').open){e.preventDefault();lin.game.selected=null;render({quiet:true});toast('Pilihan kartu dibatalkan.');}
 },{signal});
 window.addEventListener('blur',()=>{if(drag)finishDrag(null,true);},{signal});
 window.addEventListener('resize',scheduleDraw,{signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&drag)finishDrag(null,true);},{signal});
 $$('img',stageEl).forEach(image=>image.addEventListener('load',scheduleDraw,{signal}));
 const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(scheduleDraw):null;
 observer?.observe(stageEl);scheduleDraw();
 matchCleanup=()=>{clearDrag();events.abort();observer?.disconnect();cancelAnimationFrame(frame);cancelAnimationFrame(drawFrame);};
}

function validName(input,error){const name=input.value.trim(),ok=name.length>=2;input.setAttribute('aria-invalid',String(!ok));error.textContent=ok?'':'Tulis nama panggilan dengan minimal 2 huruf.';return ok;}
function startAdventure(){
 const input=$('#lin-name'),error=$('#lin-name-error');
 if(!validName(input,error)){input.focus();return;}
 lin.name=input.value.trim();persist();
 goStage('pilih');
 toast(`Selamat datang, ${lin.name}! Yuk, pilih kisah favoritmu.`);
}
function goStage(next){
 persist();
 stage=next;render();
}

document.addEventListener('submit',e=>{
 if(e.target.id!=='lin-form')return;
 e.preventDefault();startAdventure();
});
document.addEventListener('keydown',e=>{
 if(e.key==='Enter'&&e.target.id==='lin-name'){e.preventDefault();startAdventure();}
 if(e.key==='Escape'&&$('#modal').open)closeModal();
});

setInterval(()=>{
 if(stage==='game'&&!lin.game.finished){lin.game.elapsed++;const n=$('#game-time');if(n)n.textContent=time(lin.game.elapsed);persist();}
 if(stage==='kuis'&&!lin.quiz.finished){lin.quiz.elapsed++;const n=$('#quiz-time');if(n)n.textContent=time(lin.quiz.elapsed);persist();}
},1000);

document.addEventListener('click',e=>{
 const target=e.target.closest('[data-action]');if(!target||target.disabled)return;
 const action=target.dataset.action,id=target.dataset.id;
 switch(action){
 case'lin-start':startAdventure();break;
 case'lin-back':goStage(BACK_MAP[stage]||'welcome');break;
 case'lin-back-welcome':goStage('welcome');break;
 case'lin-pilih-story':{
  lin.story=id;lin.game=freshGame();lin.quiz=freshQuiz();lin.lastResult=null;lin.readDone=false;
  persist();goStage('baca');
  toast(`Kisah ${story().title} dipilih. Selamat membaca!`);break;
 }
 case'lin-to-game':lin.readDone=true;lin.game=freshGame();persist();goStage('game');break;
 case'lin-to-kuis':lin.quiz=freshQuiz();persist();goStage('kuis');break;
  case'text-size':lin.largeText=!lin.largeText;persist();render({quiet:true});break;
 case'select-culture':selectCulture(id);break;
 case'select-term':{
  if(!lin.game.selected){toast('Pilih kartu budaya di sebelah kiri terlebih dahulu.');return;}
  connectCulture(lin.game.selected,id);break;
 }
  case'check-game':{
   if(Object.keys(lin.game.pairs).length<5)return;
   lin.game.checked=true;lin.game.selected=null;
   lin.game.confirmed=cultures.filter(c=>lin.game.pairs[c.id]===c.id).map(c=>c.id);
   lin.game.errors=cultures.filter(c=>lin.game.pairs[c.id]!==c.id).map(c=>c.id);
   if(lin.game.confirmed.length===5)lin.game.finished=true;
   persist();render({quiet:true});break;
  }
 case'reset-game':if(Object.keys(lin.game.pairs).length)modal('Mulai ulang permainan?','<p>Pasangan pada permainan ini akan dikosongkan.</p>',button('close-modal','Batal','btn-secondary')+button('confirm-reset-game','Mulai Ulang','btn-primary','refresh'));else{lin.game=freshGame();persist();render();}break;
 case'confirm-reset-game':closeModal();lin.game=freshGame();persist();render();break;
 case'game-hint':modal('Cara bermain','<ol><li>Tahan pin di sisi kanan kartu gambar, lalu <strong>tarik talinya</strong> dengan jari atau mouse.</li><li>Arahkan ujung tali ke kartu nama tradisi di kolom kanan, lalu lepaskan.</li><li>Pasangkan kelima kartu, lalu tekan <strong>Periksa Jawaban</strong>. Pasangan benar terkunci.</li><li>Tarik ulang pin pada pasangan <strong>Coba lagi</strong> untuk memperbaikinya.</li></ol><p>Alternatif: ketuk kartu kiri lalu kartu kanan.</p>');break;
  case'quiz-answer':if(lin.quiz.revealed)break;lin.quiz.answer=Number(target.dataset.index);persist();render({quiet:true});break;
  case'quiz-doubt':lin.quiz.doubt=!lin.quiz.doubt;lin.quiz.review=false;persist();render({quiet:true});break;
 case'quiz-next':{
  if(lin.quiz.answer===null||lin.quiz.revealed)break;
  if(lin.quiz.doubt&&!lin.quiz.review){lin.quiz.review=true;}
  else{
   const q=questions()[lin.quiz.index];
   lin.quiz.answers[lin.quiz.index]=lin.quiz.answer===q.correct;
   lin.quiz.revealed=true;
   if(lin.quiz.index===questions().length-1){
    lin.quiz.finished=true;
    const correct=lin.quiz.answers.filter(Boolean).length,score=Math.round(correct/questions().length*100);
    lin.lastResult={kind:'quiz',score,correct,total:questions().length,elapsed:lin.quiz.elapsed};
   }
  }
  persist();render({quiet:true});break;
 }
 case'quiz-advance':{
  if(!lin.quiz.revealed)break;
  if(lin.quiz.finished){persist();goStage('hasil');break;}
  lin.quiz.index++;lin.quiz.answer=null;lin.quiz.revealed=false;lin.quiz.doubt=false;lin.quiz.review=false;
  persist();
  goStage(lin.quiz.finished?'hasil':'kuis');break;
 }
 case'lin-restart':lin={...defaults()};persist();stage='welcome';render();toast('Petualangan dimulai dari awal. Semangat, Sobat Budaya!');break;
 case'lin-finish':stage='welcome';render();toast('Progresmu tersimpan di perangkat ini. Sampai jumpa, Sakaleh!');break;
 case'close-modal':closeModal();break;
 case'help':modal('Bantuan KIRARA Linear','<p>Ikuti alurnya: pilih cerita, baca kisahnya, selesaikan Mini Game, jawab Kuis, lalu lihat hasil akhir. Gunakan tombol besar Sebelumnya dan Lanjut untuk berpindah tahap.</p>');break;
 }
});

render();
