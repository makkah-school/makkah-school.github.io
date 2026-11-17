/* =========================================================
   نظام التعاميم والتوقيع الإلكتروني — الملف المشترك
   متوسطة مكة المكرمة
   ========================================================= */

/* ---------- الإعدادات: عدّلها مرة واحدة ---------- */
const CIRC_CONFIG = {
  SUPABASE_URL: 'https://pyrxwqgapwjwhiskowhk.supabase.co',
  SUPABASE_KEY: 'sb_publishable_bfe-B4f-Rag1SR0-PoIb9w_nMfA1Ere',          // ← الصق هنا نفس مفتاح anon المستخدم في منصة مَعَاك. إذا تُرك فارغاً يعمل النظام في وضع التجربة على هذا الجهاز فقط
  BUCKET: 'reports',
  ROOT: 'school-portal',          // مجلد النظام داخل الـ bucket
  DEFAULT_PIN: '1448',         // رمز الدخول الأول للوحة الإدارة (غيّره من الإعدادات بعد أول دخول)
  SCHOOL: 'متوسطة مكة المكرمة',
  PRINCIPAL_NAME: 'إبراهيم علي آل صمع',
  PRINCIPAL_PHONE: ''          // جوال المدير، ويمكن تعديله من الإعدادات
};

/* ---------- قائمة المنسوبين الافتراضية (من كشف الاطلاع) ---------- */
const CIRC_DEFAULT_STAFF = ["إبراهيم علي آل صمع", "عبد الله محمد الشمراني", "محمد حسن الشمراني", "أحمد سعيد الشهري", "أحمد محمد الدغريري", "موسى سليمان العمري", "عبد الله علي الشمراني", "سعيد علي الزهراني", "خالد علي الشهري", "عبدالرحمن أحمد الخطابي", "موسى محمد الشهري", "إبراهيم سعد الدوسري", "إبراهيم فيصل الحربي", "إبراهيم محمد الغامدي", "أحمد بن سعيد الزهراني", "أحمد بن علي العرياني", "أحمد دخيل الله السبعي", "أحمد علي سعيد الزهراني", "أحمد مهدي محمد العيافي", "أحمد يحيى سعيد الزهراني", "ثامر محمد الرباط", "حسن محمد الشهري", "سعد فالح متعب السلمي", "سعد محمد عبدالله القرني", "سعيد ساعد المالكي", "سعيد يوسف الزهراني", "منصور أحمد الغامدي", "ضيف الله سعد السهيمي", "سعيد علي الغامدي", "عبدالرحمن بريك الشمراني", "عبدالرحمن عبدالله الشمراني", "عبدالرحمن علي الشهري", "عبدالرحمن عايض الحارثي", "عبدالرحمن قريش الكثيري", "عبدالرحمن محمد الصاعدي", "عبدالسلام جرعي الزهراني", "عبدالله إبراهيم البسيسي", "عبد الهادي عبدالله الشمراني", "عبدالله حسن المدني", "عثمان محمد الزهراني", "عدنان محمد اليوبي", "علي عبدالله العمري", "فارس علي الغامدي", "فواز دخيل المالكي", "محمد حامد القرني", "محمد عبدالعزيز الزهراني", "محمد علي اليحياوي", "محمد قليل الزبيدي", "محمد مبروك الخزاعي", "محمد مرعي الحربي", "محمد موسى الغامدي", "مسلم رجاء الله السلمي", "هاشم محمد باموسى", "هلال يحيى هلال العتيبي", "يحيى أحمد الشمراني", "حسن بن علي العلياني", "حسين منصور الكبيشي", "زين العابدين القرني", "سعد سالم الزهراني", "علي بن محمد المالكي", "علي سعيد الغامدي", "علي محمد الزهراني", "محمد أحمد السهيمي", "بندر نصار الخلوي", "صالح أحمد آل زعمان", "ظافر عبدالله الشهري", "عالي فرج الله السلمي", "عبدالعزيز عبدالله فروان", "سالم علي السميري", "سعيد أحمد الزهراني", "فهد حسن الزهراني", "يحيى محمد الزهراني"];

/* =========================================================
   طبقة التخزين: Supabase Storage أو التخزين المحلي (وضع التجربة)
   ========================================================= */
const Circ = (() => {
  const C = CIRC_CONFIG;
  const DEMO = !C.SUPABASE_KEY;
  const P = p => `${C.ROOT}/${p}`;
  const H = () => ({ apikey: C.SUPABASE_KEY, Authorization: `Bearer ${C.SUPABASE_KEY}` });
  const LS = 'circ:';

  function lsGet(k){ try { return localStorage.getItem(LS + k); } catch(e){ return null; } }
  function lsSet(k, v){ try { localStorage.setItem(LS + k, v); } catch(e){ throw new Error('مساحة التخزين المحلي ممتلئة (وضع التجربة). اربط Supabase أو استخدم ملفاً أصغر.'); } }

  async function getJSON(path){
    if (DEMO){ const v = lsGet(P(path)); return v ? JSON.parse(v) : null; }
    const r = await fetch(`${C.SUPABASE_URL}/storage/v1/object/public/${C.BUCKET}/${P(path)}?t=${Date.now()}`, { cache:'no-store' });
    if (r.status === 400 || r.status === 404) return null;
    if (!r.ok) throw new Error('تعذّر قراءة البيانات (' + r.status + ')');
    return r.json();
  }
  async function putJSON(path, obj){
    if (DEMO){ lsSet(P(path), JSON.stringify(obj)); return; }
    const r = await fetch(`${C.SUPABASE_URL}/storage/v1/object/${C.BUCKET}/${P(path)}`, {
      method:'POST', headers:{ ...H(), 'Content-Type':'application/json', 'x-upsert':'true', 'cache-control':'max-age=0' }, body: JSON.stringify(obj) });
    if (!r.ok) throw new Error('تعذّر الحفظ (' + r.status + ')');
  }
  async function putFile(path, file){
    if (DEMO){
      const data = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(file); });
      lsSet(P(path), data); return;
    }
    const r = await fetch(`${C.SUPABASE_URL}/storage/v1/object/${C.BUCKET}/${P(path)}`, {
      method:'POST', headers:{ ...H(), 'Content-Type': file.type || 'application/octet-stream', 'x-upsert':'true', 'cache-control':'max-age=0' }, body: file });
    if (!r.ok) throw new Error('تعذّر رفع الملف (' + r.status + ')');
  }
  async function getFileBlob(path){
    if (DEMO){ const d = lsGet(P(path)); if (!d) return null; return (await fetch(d)).blob(); }
    const r = await fetch(`${C.SUPABASE_URL}/storage/v1/object/public/${C.BUCKET}/${P(path)}?t=${Date.now()}`, { cache:'no-store' });
    if (!r.ok) return null;
    return r.blob();
  }
  async function list(prefix){
    if (DEMO){
      const out = [], full = LS + P(prefix);
      for (let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); if (k.startsWith(full)) out.push(k.slice(full.length)); }
      return out;
    }
    const r = await fetch(`${C.SUPABASE_URL}/storage/v1/object/list/${C.BUCKET}`, {
      method:'POST', headers:{ ...H(), 'Content-Type':'application/json' },
      body: JSON.stringify({ prefix: P(prefix), limit: 1000, offset: 0 }) });
    if (!r.ok) return [];
    return (await r.json()).map(o => o.name).filter(n => n && !n.startsWith('.'));
  }

  /* ---------- أدوات مساعدة ---------- */
  const uid = (n = 10) => { const a = new Uint8Array(n); crypto.getRandomValues(a); return Array.from(a, b => 'abcdefghjkmnpqrstuvwxyz23456789'[b % 31]).join(''); };
  async function sha(s){ const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return Array.from(new Uint8Array(b), x => x.toString(16).padStart(2,'0')).join(''); }
  const hijri = (d = new Date()) => new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', { year:'numeric', month:'2-digit', day:'2-digit' }).format(d).replace(/\s*هـ/, '') + 'هـ';
  const timeStr = (d = new Date()) => d.toLocaleTimeString('ar-SA-u-nu-latn', { hour:'2-digit', minute:'2-digit' });
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function phone(p){
    let d = String(p || '').replace(/[٠-٩]/g, c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)).replace(/\D/g, '');
    if (d.startsWith('00')) d = d.slice(2);
    if (d.startsWith('05') && d.length === 10) d = '966' + d.slice(1);
    else if (d.startsWith('5') && d.length === 9) d = '966' + d;
    return d;
  }
  const wa = (num, text) => `https://wa.me/${phone(num)}?text=${encodeURIComponent(text)}`;
  const pageURL = (file, params) => { const u = new URL(file, location.href); Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v)); return u.toString(); };

  /* ---------- البيانات ---------- */
  async function settings(){
    const s = await getJSON('settings.json');
    return Object.assign({ school: C.SCHOOL, principalName: C.PRINCIPAL_NAME, principalPhone: C.PRINCIPAL_PHONE, pinHash: null }, s || {});
  }
  async function staff(){
    let s = await getJSON('staff.json');
    if (s && !Array.isArray(s)) throw new Error('ملف المنسوبين تالف');
    if (!s){
      s = CIRC_DEFAULT_STAFF.map((name) => ({ id: uid(6), name, phone: '', token: uid(12) }));
      await saveStaff(s);
    }
    return s;
  }
  async function saveStaff(list){
    await putJSON('staff.json', list);
    await Promise.all(list.map(t => putJSON(`keys/${t.token}.json`, { id: t.id, name: t.name })));
  }
  const circulars = async () => (await getJSON('index.json')) || [];
  // التواقيع: يُفحص ملف كل منسوب مباشرة (لا يعتمد على صلاحية عرض المجلدات)
  async function signatures(cid, staffList){
    const ids = (staffList || await staff()).map(t => t.id);
    const out = [];
    for (let i = 0; i < ids.length; i += 12){
      const part = await Promise.all(ids.slice(i, i + 12).map(id => getJSON(`c/${cid}/sig/${id}.json`).catch(() => null)));
      part.forEach(r => r && out.push(r));
    }
    return out;
  }

  return { DEMO, C, getJSON, putJSON, putFile, getFileBlob, list, uid, sha, hijri, timeStr, esc, phone, wa, pageURL, settings, staff, saveStaff, circulars, signatures };
})();

/* ---------- عرض ملف PDF (يعتمد pdf.js إن توفر) ---------- */
async function circRenderPDF(blob, host){
  host.innerHTML = '';
  if (blob.type.startsWith('image/')){
    const img = document.createElement('img'); img.src = URL.createObjectURL(blob); img.className = 'pdf-page'; host.appendChild(img); return;
  }
  if (window.pdfjsLib){
    try {
      const pdf = await pdfjsLib.getDocument({ data: await blob.arrayBuffer(), cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/', cMapPacked: true, standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/standard_fonts/', useSystemFonts: true }).promise;
      for (let i = 1; i <= pdf.numPages; i++){
        const page = await pdf.getPage(i);
        const w = host.clientWidth || 700, v0 = page.getViewport({ scale: 1 });
        const scale = (w / v0.width) * (window.devicePixelRatio || 1);
        const v = page.getViewport({ scale });
        const cv = document.createElement('canvas'); cv.width = v.width; cv.height = v.height; cv.className = 'pdf-page';
        host.appendChild(cv);
        await page.render({ canvasContext: cv.getContext('2d'), viewport: v }).promise;
      }
      return;
    } catch(e){ console.warn(e); }
  }
  const url = URL.createObjectURL(blob);
  host.innerHTML = `<iframe class="pdf-frame" src="${url}"></iframe><a class="btn ghost" href="${url}" target="_blank">فتح التعميم في نافذة مستقلة</a>`;
}
