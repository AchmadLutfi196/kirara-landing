/* Browser acceptance checks. Run against an already-running Next.js application.
 * No server or package installation is performed by this script. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.BASE_URL || 'http://localhost:3000';
const output = process.env.QA_OUTPUT || '/tmp/kirara-next-qa';
const executablePath = process.env.CHROMIUM_PATH || undefined;
fs.mkdirSync(output, { recursive: true });
const routes = ['/masuk','/menu','/cerita','/baca/jokotole','/baca/potre-koneng','/baca/ke-lesap','/mini-game','/kuis','/hasil','/karya','/profil','/materi','/ui-kit','/admin','/admin/konten','/admin/kuis','/admin/mini-game','/admin/karya','/admin/siswa','/admin/pengaturan'];
const results = [];
let browser;
async function check(name, task) {
  if(process.env.QA_FILTER && !name.toLowerCase().includes(process.env.QA_FILTER.toLowerCase()))return;
  try { await task(); results.push({name,status:'PASS'}); console.log('PASS', name); }
  catch(error) { results.push({name,status:'FAIL',error:error.message}); console.error('FAIL',name,error.message); }
}
async function go(page, route) {
  await page.goto(baseURL + route, {waitUntil:'networkidle'});
  await page.locator('h1').first().waitFor();
}
async function context(viewport={width:1440,height:1000}, withProfile=true) {
  const c=await browser.newContext({viewport});
  if(withProfile) await c.addInitScript(()=>{
    try {
      if(location.origin==='null'||sessionStorage.getItem('qa-seeded'))return;
      if(!localStorage.getItem('kirara.next.v2')&&!localStorage.getItem('kirara.v1'))
        localStorage.setItem('kirara.next.v2',JSON.stringify({version:2,name:'QA Sobat Budaya',className:'VI'}));
    } catch {}
  });
  const p=await c.newPage();
  p.setDefaultTimeout(10000);
  const errors=[];
  p.on('pageerror', e=>errors.push(e.message));
  return {c,p,errors};
}
async function routeChecks(width) {
  const {c,p,errors}=await context({width,height:1000});
  try {
    const failures=[];
    for(const route of routes) {
      try {
      await go(p,route);
      assert.ok((await p.locator('main').innerText()).trim().length>30, route+' has no useful main content');
      assert.equal(await p.locator('body').innerText().then(t=>/Application error|Internal Server Error|Hydration failed/.test(t)),false,route+' error UI');
      const dimensions=await p.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
      assert.ok(dimensions.scroll<=dimensions.width+1,`${route} horizontal overflow: ${dimensions.scroll} > ${dimensions.width}`);
      if(['/masuk','/menu','/baca/jokotole','/mini-game','/admin/konten'].includes(route)) await p.screenshot({path:path.join(output,`${width}-${route.slice(1).replaceAll('/','-')}.png`),fullPage:true});
      await p.reload({waitUntil:'networkidle'});
      await p.locator('h1').first().waitFor();
      } catch(error) {failures.push(route+': '+error.message);}
    }
    assert.deepEqual(failures,[],'route/reload/overflow failures');
    assert.deepEqual(errors,[],'uncaught browser errors');
  } finally {await c.close();}
}
async function onboarding() {
  const {c,p,errors}=await context(undefined,false);
  try {
    await go(p,'/masuk');
    await p.getByRole('button',{name:'Mulai Petualangan',exact:true}).click();
    assert.ok(await p.getByText(/minimal 2|setidaknya 2/i).first().isVisible(),'missing name validation');
    await p.getByLabel(/Nama panggilan/).fill('QA Budaya');
    await p.getByRole('button',{name:'Mulai Petualangan',exact:true}).click();
    await p.waitForURL('**/menu');
    await go(p,'/profil');
    assert.ok((await p.locator('main').innerText()).includes('QA Budaya'));
    await p.reload({waitUntil:'networkidle'});
    assert.ok((await p.locator('main').innerText()).includes('QA Budaya'),'name lost on reload');
    await p.goBack({waitUntil:'networkidle'});
    assert.deepEqual(errors,[]);
  } finally {await c.close();}
}
async function directRoutesRequireOnboarding() {
  const {c,p,errors}=await context(undefined,false);
  try {
    await go(p,'/menu',{emptyProfile:true});
    await p.waitForURL('**/masuk');
    assert.ok((await p.locator('main').innerText()).includes('kenalan dulu'),'new visitor should be asked for a name');
    await p.getByLabel(/Nama panggilan/).fill('Sobat Baru');
    await p.getByRole('button',{name:'Mulai Petualangan',exact:true}).click();
    await p.waitForURL('**/menu');
    assert.ok((await p.locator('main').innerText()).includes('Sobat Baru'));
    assert.deepEqual(errors,[]);
  } finally {await c.close();}
  const second=await context(undefined,false);
  try {
    await go(second.p,'/kuis',{emptyProfile:true});
    await second.p.waitForURL('**/masuk');
    assert.deepEqual(second.errors,[]);
  } finally {await second.c.close();}
  const admin=await context(undefined,false);
  try {
    await go(admin.p,'/admin');
    assert.match(admin.p.url(),/\/admin$/,'admin workspace remains reachable without a student profile');
    assert.deepEqual(admin.errors,[]);
  } finally {await admin.c.close();}
}
async function seed(c, values) {
  await c.addInitScript(values=>{
    if(sessionStorage.getItem('qa-seeded'))return;
    localStorage.clear();
    for(const [key,value] of Object.entries(values))localStorage.setItem(key,value);
    sessionStorage.setItem('qa-seeded','yes');
  },values);
}
async function malformedStorage() {
  for(const value of ['{invalid',JSON.stringify({version:1,name:42,visited:null,likes:[null],uploads:[null],completedStories:'bad',docs:{'story:jokotole':{published:{title:42}}},quizzes:[null,{id:'bad',published:{question:'Malformed',options:null}}]})]) {
    const {c,p,errors}=await context();
    try {
      await seed(c,{'kirara.v1':value,'kirara.admin.v1':value});
      for(const route of ['/profil','/cerita','/karya','/admin','/admin/kuis']) await go(p,route);
      assert.deepEqual(errors,[],'malformed stored data caused exception');
    } finally {await c.close();}
  }
}
async function malformedCurrentStorage() {
  const {c,p,errors}=await context();
  try {
    await seed(c,{'kirara.next.v2':JSON.stringify({version:2,name:[],docs:{'story:jokotole':null,'material:odeng':{published:{title:{bad:true}}}},quizzes:[null,{id:'broken',published:{question:'Broken',options:[null,{}],correct:9}}],moderation:{broken:null},uploads:[{id:'bad',title:'Invalid data',data:{bad:true}}],lastResult:{kind:'quiz',questions:[null]}})});
    for(const route of ['/profil','/cerita','/baca/jokotole','/materi','/kuis','/hasil','/karya','/admin/kuis','/admin/karya'])await go(p,route);
    assert.deepEqual(errors,[]);
  } finally {await c.close();}
}
// A real decodable PNG, used only as a file fixture and migration payload.
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=','base64');
async function legacyMigration() {
  const {c,p,errors}=await context();
  try {
    await seed(c,{'kirara.v1':JSON.stringify({version:1,name:'Nama Warisan',className:'VI-B',gameEarned:true,completedStories:{forged:true}}),'kirara.admin.v1':'{invalid'});
    await go(p,'/profil');
    assert.ok((await p.locator('main').innerText()).includes('Nama Warisan'),'valid student namespace lost because admin JSON is invalid');
    assert.equal((await p.locator('.points strong').innerText()).trim(),'500','unknown story IDs must not grant points');
    assert.deepEqual(errors,[]);
  } finally {await c.close();}
  const second=await context();
  try {
    const cover='data:image/png;base64,'+png.toString('base64');
    await seed(second.c,{'kirara.v1':JSON.stringify({version:1,name:'Migrasi Sampul'}),'kirara.admin.v1':JSON.stringify({version:1,docs:{'story:jokotole':{published:{cover:{data:cover,width:1,height:1,name:'legacy.png'}}}}})});
    await go(second.p,'/cerita');
    const image=second.p.getByRole('img',{name:'Jokotole & Kuda Si Giga',exact:true});
    assert.equal(await image.getAttribute('src'),cover,'legacy cover object was not normalized');
    assert.ok(await image.evaluate(img=>img.complete&&img.naturalWidth>0),'imported cover is broken');
    assert.deepEqual(second.errors,[]);
  } finally {await second.c.close();}
}
async function quizRewards() {
  const {c,p,errors}=await context();
  try {
    const answer=async(correct)=>{
      await go(p,'/kuis');
      await p.getByRole('button',{name:correct?/^A[ .:]*Jokotole$/:/^B[ .:]*Putri Potre Koneng$/}).click();
      await p.getByRole('button',{name:'Tinjau Jawaban',exact:true}).click();
      await p.getByRole('button',{name:'Selesaikan Kuis',exact:true}).click();
      await p.waitForURL('**/hasil');
    };
    await answer(false);
    assert.match(await p.locator('main').innerText(),/0\s*\/\s*100/,'incorrect answer must score zero');
    assert.equal((await p.locator('.points strong').innerText()).trim(),'0');
    await p.getByRole('link',{name:'Main Lagi',exact:true}).click();
    await answer(true);
    assert.match(await p.locator('main').innerText(),/100\s*\/\s*100/);
    assert.equal((await p.locator('.points strong').innerText()).trim(),'20');
    await p.getByRole('link',{name:'Main Lagi',exact:true}).click();
    await answer(true);
    await p.reload({waitUntil:'networkidle'});
    assert.equal((await p.locator('.points strong').innerText()).trim(),'20','quiz reward duplicated');
    assert.deepEqual(errors,[]);
  } finally {await c.close();}
}
async function matchingRewards() {
  const {c,p,errors}=await context();
  try {
    await go(p,'/mini-game');
    const ids=['pesaan','odeng','celurit','batik','karapan'];
    const pair=async(a,b)=>{await p.getByTestId('culture-'+a).click();await p.getByTestId('term-'+b).click();};
    await pair('pesaan','odeng');await pair('odeng','pesaan');
    for(const id of ids.slice(2))await pair(id,id);
    await p.getByRole('button',{name:'Periksa Jawaban',exact:true}).click();
    assert.equal((await p.locator('.points strong').innerText()).trim(),'0','partial game granted reward');
    assert.ok(await p.getByTestId('culture-celurit').isDisabled(),'correct pair should lock');
    assert.ok(await p.getByTestId('culture-pesaan').isEnabled(),'wrong pair should be correctable');
    await pair('pesaan','pesaan');
    assert.ok(await p.getByTestId('culture-celurit').isDisabled(),'confirmed correct pair unlocked during correction');
    await pair('odeng','odeng');
    await p.getByRole('button',{name:'Periksa Jawaban',exact:true}).click();
    assert.equal((await p.locator('.points strong').innerText()).trim(),'500');
    await p.getByRole('button',{name:'Ulangi Permainan',exact:true}).click();
    for(const id of ids)await pair(id,id);
    await p.getByRole('button',{name:'Periksa Jawaban',exact:true}).click();
    await p.reload({waitUntil:'networkidle'});
    assert.equal((await p.locator('.points strong').innerText()).trim(),'500','matching reward duplicated');
    assert.deepEqual(errors,[]);
  } finally {await c.close();}
}
async function galleryValidation() {
  const {c,p,errors}=await context();
  try {
    await go(p,'/karya');
    await p.getByRole('button',{name:'Unggah Karya',exact:true}).click();
    const file=p.getByLabel(/Gambar karya/);
    await file.setInputFiles({name:'bad.svg',mimeType:'image/svg+xml',buffer:Buffer.from('<svg/>')});
    assert.match(await p.locator('form [role="alert"]').innerText(),/JPG|PNG|WebP/);
    await file.setInputFiles({name:'large.png',mimeType:'image/png',buffer:Buffer.alloc(2*1024*1024+1)});
    assert.match(await p.locator('form [role="alert"]').innerText(),/2 MB/);
    await file.setInputFiles({name:'broken.png',mimeType:'image/png',buffer:Buffer.from('this is not a PNG')});
    await p.getByText(/Gambar tidak dapat dibaca/).waitFor();
    await file.setInputFiles({name:'qa.png',mimeType:'image/png',buffer:png});
    await p.getByRole('img',{name:'Pratinjau karya',exact:true}).waitFor();
    await p.getByLabel('Judul karya',{exact:true}).fill('Karya Uji Lokal');
    await p.getByRole('button',{name:'Simpan Karya Lokal',exact:true}).click();
    assert.equal(await p.getByRole('button',{name:'Lihat karya Karya Uji Lokal',exact:true}).count(),0,'pending upload leaked into student gallery');
    await p.getByText(/Status karya di perangkat ini/).click();
    assert.match(await p.locator('.local-work-status').innerText(),/Karya Uji Lokal.*Menunggu/s);
    await p.reload({waitUntil:'networkidle'});
    assert.equal(await p.getByRole('button',{name:'Lihat karya Karya Uji Lokal',exact:true}).count(),0);
    await go(p,'/admin/karya');
    await p.getByRole('button',{name:'Setujui Karya',exact:true}).click();
    await go(p,'/karya');
    const uploaded=p.getByRole('button',{name:'Lihat karya Karya Uji Lokal',exact:true});
    await uploaded.waitFor();await uploaded.click();
    await p.getByRole('dialog').waitFor();
    await p.keyboard.press('Escape');
    await p.getByRole('dialog').waitFor({state:'hidden'});
    assert.ok(await uploaded.evaluate(el=>el===document.activeElement),'dialog did not return focus');
    const appreciation=p.getByRole('button',{name:'Apresiasi Karya Uji Lokal',exact:true});
    await appreciation.click();assert.equal(await appreciation.getAttribute('aria-pressed'),'true');
    await appreciation.click();assert.equal(await appreciation.getAttribute('aria-pressed'),'false');
    assert.deepEqual(errors,[]);
  } finally {await c.close();}
}
async function adminPublication() {
  const {c,p,errors}=await context();
  try {
    await go(p,'/admin/konten');
    const edit=()=>p.getByRole('button',{name:'Edit Jokotole & Kuda Si Giga',exact:true}).click();
    await edit();
    await p.getByLabel('Judul',{exact:true}).fill('Judul QA Draf');
    await p.getByRole('button',{name:'Simpan Draf',exact:true}).click();
    await go(p,'/cerita');
    assert.equal(await p.getByRole('heading',{name:'Judul QA Draf',exact:true}).count(),0,'draft title leaked');
    assert.equal(await p.getByRole('heading',{name:'Jokotole & Kuda Si Giga',exact:true}).count(),1);
    await go(p,'/admin/konten');await edit();
    assert.equal(await p.getByLabel('Judul',{exact:true}).inputValue(),'Judul QA Draf','draft lost on navigation');
    // Synthetic QA text lives only in this isolated browser context, never in app seeds.
    await p.getByLabel('Naskah lengkap (dari sumber asli)',{exact:true}).fill('TEKS UJI QA LOKAL. Ini fixture pengujian, bukan naskah cerita rakyat atau sumber resmi.');
    await p.getByRole('button',{name:'Terbitkan',exact:true}).click();
    await go(p,'/baca/jokotole');
    await p.getByRole('heading',{name:'Judul QA Draf',exact:true}).waitFor();
    assert.ok((await p.locator('main').innerText()).includes('TEKS UJI QA LOKAL'));
    await p.getByRole('button',{name:'Tandai Selesai Membaca',exact:true}).click();
    assert.equal((await p.locator('.points strong').innerText()).trim(),'50');
    await p.reload({waitUntil:'networkidle'});
    assert.equal((await p.locator('.points strong').innerText()).trim(),'50');
    await go(p,'/admin/konten');
    const row=p.locator('article').filter({has:p.getByRole('heading',{name:'Judul QA Draf',exact:true})});
    await row.getByRole('button',{name:'Arsipkan',exact:true}).click();
    await go(p,'/cerita');
    assert.equal(await p.getByRole('heading',{name:'Judul QA Draf',exact:true}).count(),0,'archived story remained visible');
    await go(p,'/admin/konten');
    await p.getByRole('button',{name:'Pulihkan',exact:true}).click();
    await go(p,'/cerita');
    await p.getByRole('heading',{name:'Judul QA Draf',exact:true}).waitFor();
    assert.deepEqual(errors,[]);
  } finally {await c.close();}
}
async function coverPublication() {
  const {c,p,errors}=await context();
  try {
    await go(p,'/admin/konten');
    const edit=()=>p.getByRole('button',{name:'Edit Jokotole & Kuda Si Giga',exact:true}).click();
    await edit();
    await p.getByLabel('Judul',{exact:true}).fill('Draf Rahasia QA');
    await p.getByRole('button',{name:'Simpan Draf',exact:true}).click();
    await edit();
    await p.getByLabel(/Sampul cerita.*JPG/).setInputFiles({name:'cover-qa.png',mimeType:'image/png',buffer:png});
    const preview=p.getByRole('img',{name:'Pratinjau sampul',exact:true});
    await p.waitForFunction(()=>Array.from(document.images).some(i=>i.alt==='Pratinjau sampul'&&i.src.startsWith('data:image/')&&i.complete&&i.naturalWidth>0));
    await p.getByRole('button',{name:'Terbitkan Sampul',exact:true}).click();
    await go(p,'/cerita');
    const cover=p.getByRole('img',{name:'Jokotole & Kuda Si Giga',exact:true});
    assert.ok((await cover.getAttribute('src')).startsWith('data:image/'),'cover-only publication missing');
    assert.equal(await p.getByRole('heading',{name:'Draf Rahasia QA',exact:true}).count(),0,'cover-only action published draft title');
    await go(p,'/baca/jokotole');
    assert.ok((await p.locator('main').innerText()).includes('Cuplikan'),'cover-only action erased snippet');
    await go(p,'/admin/konten');await edit();
    assert.equal(await p.getByLabel('Judul',{exact:true}).inputValue(),'Draf Rahasia QA','cover-only action lost draft text');
    await p.getByRole('button',{name:'Pulihkan Sampul Asli',exact:true}).click();
    await go(p,'/cerita');
    assert.match(await p.getByRole('img',{name:'Jokotole & Kuda Si Giga',exact:true}).getAttribute('src'),/art-jokotole/);
    assert.deepEqual(errors,[]);
  } finally {await c.close();}
}
async function materialPublication() {
  const {c,p,errors}=await context();
  try {
    await go(p,'/admin/konten');
    await p.getByRole('button',{name:'Materi',exact:true}).click();
    await p.getByRole('button',{name:'Edit Odeng',exact:true}).click();
    await p.getByLabel('Judul',{exact:true}).fill('Odeng QA');
    await p.getByLabel('Label budaya',{exact:true}).fill('Label kepala QA');
    await p.getByLabel('Deskripsi',{exact:true}).fill('Deskripsi materi QA lokal');
    await p.getByLabel('Isi materi',{exact:true}).fill('ISI MATERI UJI QA');
    await p.getByRole('button',{name:'Simpan Draf',exact:true}).click();
    await go(p,'/materi');
    assert.equal(await p.getByText('ISI MATERI UJI QA',{exact:true}).count(),0);
    await go(p,'/mini-game');
    assert.ok(!(await p.getByTestId('term-odeng').innerText()).includes('Odeng QA'));
    await go(p,'/admin/konten');
    await p.getByRole('button',{name:'Materi',exact:true}).click();
    await p.getByRole('button',{name:'Edit Odeng',exact:true}).click();
    await p.getByLabel('Judul',{exact:true}).fill('Celurit');
    await p.getByRole('button',{name:'Terbitkan',exact:true}).click();
    assert.ok(await p.getByRole('button',{name:'Terbitkan',exact:true}).isVisible(),'duplicate term should fail publication');
    await p.getByLabel('Judul',{exact:true}).fill('Odeng QA');
    await p.getByRole('button',{name:'Terbitkan',exact:true}).click();
    await go(p,'/materi');
    await p.getByText('ISI MATERI UJI QA',{exact:true}).waitFor();
    await go(p,'/mini-game');
    assert.ok((await p.getByTestId('term-odeng').innerText()).includes('Odeng QA'));
    assert.ok((await p.getByTestId('culture-odeng').innerText()).includes('Label kepala QA'));
    assert.ok((await p.getByTestId('culture-odeng').innerText()).includes('Deskripsi materi QA lokal'));
    assert.deepEqual(errors,[]);
  } finally {await c.close();}
}
async function adminCatalogCrud() {
  const {c,p,errors}=await context();
  try {
    await go(p,'/admin/konten');
    await p.getByRole('button',{name:'Tambah Cerita',exact:true}).click();
    await p.getByLabel('Judul',{exact:true}).fill('Cerita CRUD QA');
    await p.getByLabel('Asal cerita',{exact:true}).fill('Fixture pengujian lokal');
    await p.getByLabel('Deskripsi',{exact:true}).fill('Deskripsi fixture cerita.');
    await p.getByLabel('Naskah lengkap (dari sumber asli)',{exact:true}).fill('Naskah fixture QA; bukan cerita rakyat atau sumber resmi.');
    await p.getByRole('button',{name:'Simpan Draf',exact:true}).click();
    await go(p,'/cerita');
    assert.equal(await p.getByRole('heading',{name:'Cerita CRUD QA',exact:true}).count(),0,'new draft story leaked to students');
    await go(p,'/admin/konten');
    await p.getByRole('button',{name:'Edit Cerita CRUD QA',exact:true}).click();
    await p.getByLabel('Deskripsi',{exact:true}).fill('Deskripsi cerita yang sudah diperbarui.');
    await p.getByRole('button',{name:'Simpan Draf',exact:true}).click();
    await p.getByRole('button',{name:'Edit Cerita CRUD QA',exact:true}).click();
    assert.equal(await p.getByLabel('Deskripsi',{exact:true}).inputValue(),'Deskripsi cerita yang sudah diperbarui.','custom story update was not saved');
    await p.getByRole('button',{name:'Terbitkan',exact:true}).click();
    await go(p,'/cerita');
    const story=p.locator('article').filter({has:p.getByRole('heading',{name:'Cerita CRUD QA',exact:true})});
    await story.getByRole('link',{name:'Mulai Baca',exact:true}).click();
    await p.getByText('Naskah fixture QA; bukan cerita rakyat atau sumber resmi.',{exact:true}).waitFor();
    await p.getByRole('button',{name:'Tandai Selesai Membaca',exact:true}).click();
    assert.equal((await p.locator('.points strong').innerText()).trim(),'50','custom published story should count once');
    await go(p,'/admin/konten');
    p.once('dialog',dialog=>dialog.accept());
    const storyRow=p.locator('article').filter({has:p.getByRole('heading',{name:'Cerita CRUD QA',exact:true})});
    await storyRow.getByRole('button',{name:'Hapus',exact:true}).click();
    await p.getByRole('heading',{name:'Cerita CRUD QA',exact:true}).waitFor({state:'hidden'});

    await p.getByRole('button',{name:'Materi',exact:true}).click();
    await p.getByRole('button',{name:'Tambah Materi',exact:true}).click();
    await p.getByLabel('Judul',{exact:true}).fill('Istilah CRUD QA');
    await p.getByLabel('Label budaya',{exact:true}).fill('Budaya fixture');
    await p.getByLabel('Deskripsi',{exact:true}).fill('Materi fixture untuk uji CRUD.');
    await p.getByLabel('Isi materi',{exact:true}).fill('Penjelasan materi QA.');
    await p.getByRole('button',{name:'Simpan Draf',exact:true}).click();
    await p.getByRole('button',{name:'Edit Istilah CRUD QA',exact:true}).click();
    assert.equal(await p.getByLabel('Isi materi',{exact:true}).inputValue(),'Penjelasan materi QA.','custom material update was not saved');
    await p.getByRole('button',{name:'Terbitkan',exact:true}).click();
    await go(p,'/materi');
    await p.getByRole('heading',{name:'Istilah CRUD QA',exact:true}).waitFor();
    await go(p,'/admin/konten');
    await p.getByRole('button',{name:'Materi',exact:true}).click();
    p.once('dialog',dialog=>dialog.accept());
    await p.locator('article').filter({has:p.getByRole('heading',{name:'Istilah CRUD QA',exact:true})}).getByRole('button',{name:'Hapus',exact:true}).click();
    await go(p,'/materi');
    assert.equal(await p.getByRole('heading',{name:'Istilah CRUD QA',exact:true}).count(),0,'deleted material remained visible');
    assert.deepEqual(errors,[]);
  } finally {await c.close();}
}
async function mobileNavigationAndKeyboard() {
  const {c,p,errors}=await context({width:390,height:844});
  try {
    await go(p,'/menu');
    const toggle=p.getByRole('button',{name:'Buka menu navigasi',exact:true});
    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-expanded'),'true');
    await p.getByRole('navigation',{name:'Navigasi utama',exact:true}).getByRole('link',{name:'Mini Game',exact:true}).click();
    await p.waitForURL('**/mini-game');
    await p.getByTestId('culture-odeng').focus();await p.keyboard.press('Enter');
    assert.equal(await p.getByTestId('culture-odeng').getAttribute('aria-pressed'),'true');
    await p.getByTestId('term-odeng').focus();await p.keyboard.press('Space');
    assert.match(await p.getByTestId('term-odeng').innerText(),/Terhubung/);
    const dimensions=await p.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
    assert.ok(dimensions.scroll<=dimensions.width+1);
    await p.screenshot({path:path.join(output,'390-keyboard-matching.png'),fullPage:true});
    await go(p,'/karya');
    await p.getByRole('button',{name:'Unggah Karya',exact:true}).click();
    assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'mobile upload form overflows');
    await p.screenshot({path:path.join(output,'390-upload-form.png'),fullPage:true});
    await go(p,'/admin/konten');
    await p.getByRole('button',{name:'Edit Jokotole & Kuda Si Giga',exact:true}).click();
    assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'mobile admin editor overflows');
    await p.screenshot({path:path.join(output,'390-admin-editor.png'),fullPage:true});
    assert.deepEqual(errors,[]);
  } finally {await c.close();}
}
async function desktopHeader() {
  for(const width of [1280,1440]) {
    const {c,p,errors}=await context({width,height:1000});
    try {
      await go(p,'/menu');
      const nav=p.getByRole('navigation',{name:'Navigasi utama',exact:true});
      const tops=await nav.locator('a').evaluateAll(els=>els.filter(el=>el.getBoundingClientRect().width>0).map(el=>Math.round(el.getBoundingClientRect().top)));
      assert.ok(Math.max(...tops)-Math.min(...tops)<=2,'desktop links wrap into multiple rows');
      assert.ok(await p.getByRole('button',{name:'Buka menu navigasi',exact:true}).isHidden(),'desktop menu toggle must be hidden');
      const cta=p.getByRole('link',{name:'Mulai Membaca',exact:true});
      assert.equal(await cta.evaluate(el=>getComputedStyle(el).backgroundColor),await p.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()).then(hex=>{const n=parseInt(hex.slice(1),16);return `rgb(${n>>16}, ${(n>>8)&255}, ${n&255})`;}),'main reading action should use terracotta primary');
      await p.screenshot({path:path.join(output,`${width}-header-final.png`),fullPage:true});
      assert.deepEqual(errors,[]);
    } finally {await c.close();}
  }
}
(async()=>{
  browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox']});
  await check('Desktop 1440 routes, direct reload and overflow',()=>routeChecks(1440));
  await check('Mobile 390 routes, direct reload and overflow',()=>routeChecks(390));
  await check('Onboarding validation and persistence',onboarding);
  await check('Direct student routes require name onboarding',directRoutesRequireOnboarding);
  await check('Malformed legacy storage recovers without crash',malformedStorage);
  await check('Malformed current storage nested data recovers without crash',malformedCurrentStorage);
  await check('Independent legacy imports, cover object and reward guard',legacyMigration);
  await check('Quiz correctness and one-time rewards',quizRewards);
  await check('Matching correction, locking and one-time rewards',matchingRewards);
  await check('Gallery image validation, moderation, dialog and appreciation',galleryValidation);
  await check('Admin draft, publish, story reward, archive and restore',adminPublication);
  await check('Cover-only publication preserves draft text and restores original',coverPublication);
  await check('Material drafts, unique terms and published student/game content',materialPublication);
  await check('Admin CRUD creates, publishes and deletes story and material',adminCatalogCrud);
  await check('Mobile navigation and matching keyboard controls',mobileNavigationAndKeyboard);
  await check('Desktop header 1280 and 1440 plus primary reading action',desktopHeader);
})().catch(e=>{results.push({name:'Harness',status:'FAIL',error:e.stack});console.error(e);}).finally(async()=>{
  if(browser)await browser.close();
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({baseURL,at:new Date().toISOString(),results},null,2));
  process.exitCode=results.some(r=>r.status==='FAIL')?1:0;
});
