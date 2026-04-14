import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════
// THEME
// ═══════════════════════════════════════
const T = {
  bg: "#f7f6f3",        // ページ背景（温かみのあるオフホワイト）
  card: "#ffffff",       // カード背景（白）
  card2: "#faf9f7",      // カード背景2（やや暖色）
  input: "#f0eeea",      // 入力フィールド背景
  bdr: "#e4e0d8",        // ボーダー
  bdr2: "#d4cfc5",       // ボーダー濃いめ
  tx: "#2d2a24",         // メインテキスト（ダークブラウン）
  tx2: "#7a7468",        // サブテキスト
  tx3: "#a09888",        // 薄いテキスト
  ac: "#7c5bf5",         // アクセント（紫・据え置き）
  acG: "rgba(124,91,245,0.08)", // アクセントグロー
  acS: "#6a4de0",        // アクセント暗め
  gn: "#16a34a",         // 緑
  gnB: "#dcfce7",        // 緑背景
  rd: "#dc2626",         // 赤
  rdB: "#fee2e2",        // 赤背景
  am: "#d97706",         // アンバー
  amB: "#fef3c7",        // アンバー背景
  bl: "#2563eb",         // 青
  pk: "#db2777",         // ピンク
  cy: "#0891b2",         // シアン
  gr: "linear-gradient(135deg,#7c5bf5,#6366f1,#8b5cf6)", // グラデーション（据え置き）
};

// ═══════════════════════════════════════
// INITIAL DATA
// ═══════════════════════════════════════
const INIT_PETS = [
  {
    id: "ram", name: "ラムちゃん", emoji: "🐕", photo: null,
    birth: "2021-08-07", breed: "ミニチュアダックスフンド", sex: "♂ 去勢済",
    conditions: [
      { id: "c1", name: "心肥大", sev: "要経過観察", note: "レントゲンで確認。エコー未実施。" },
      { id: "c2", name: "高脂血症", sev: "軽度", note: "CPK 226。食事管理必要。" },
      { id: "c3", name: "椎間板ヘルニア", sev: "Gr.1", note: "背骨湾曲。安静指示。" },
      { id: "c4", name: "電解質異常", sev: "要確認", note: "Na/K/Cl低値。腎臓正常。" },
      { id: "c5", name: "血小板低値", sev: "要観察", note: "PLT 8.5（基準20-50）。" },
      { id: "c6", name: "肥満", sev: "要改善", note: "7.4kg。適正4.5-5kg。" },
    ],
    meds: [
      { id: "m1", name: "アンチノール30", purpose: "抗炎症（心臓・関節）", freq: "毎日1粒", interval: 1, next: "2026-04-15", remaining: 28, active: true },
      { id: "m2", name: "イベルメックM", purpose: "フィラリア予防", freq: "月1回", interval: 30, next: "2026-05-01", remaining: 3, active: true },
      { id: "m3", name: "ブラベクト250", purpose: "ノミ・マダニ予防", freq: "3ヶ月に1回", interval: 90, next: "2026-04-14", remaining: 2, active: true },
    ],
    labs: [{
      id: "l1", date: "2026-04-13", type: "総合血液検査+腎臓パネル",
      results: [
        { name: "GLU", val: 120, unit: "mg/dL", ref: "75-128", st: "ok" },
        { name: "TCHO", val: 166, unit: "mg/dL", ref: "111-312", st: "ok" },
        { name: "TG", val: 78, unit: "mg/dL", ref: "30-133", st: "ok" },
        { name: "CPK", val: 226, unit: "U/L", ref: "49-166", st: "hi", note: "心筋損傷指標" },
        { name: "GOT", val: 34, unit: "U/L", ref: "17-44", st: "ok" },
        { name: "GPT", val: 69, unit: "U/L", ref: "17-78", st: "ok" },
        { name: "Na", val: 133, unit: "mEq/L", ref: "141-152", st: "lo", note: "電解質低下" },
        { name: "K", val: 2.8, unit: "mEq/L", ref: "3.8-5.0", st: "lo", note: "電解質低下" },
        { name: "Cl", val: 95, unit: "mEq/L", ref: "102-117", st: "lo", note: "電解質低下" },
        { name: "RBC", val: 942, unit: "×10⁴/μL", ref: "550-850", st: "hi", note: "脱水or心臓代償" },
        { name: "HGB", val: 18.4, unit: "g/dL", ref: "12.0-18.0", st: "hi" },
        { name: "HCT", val: 57.1, unit: "%", ref: "37.0-55.0", st: "hi" },
        { name: "PLT", val: 8.5, unit: "×10⁴/μL", ref: "20.0-50.0", st: "lo", note: "血小板低値" },
        { name: "SDMA", val: 10, unit: "μg/dL", ref: "0-14", st: "ok" },
        { name: "CRE", val: 0.8, unit: "mg/dL", ref: "0.5-1.8", st: "ok" },
        { name: "BUN", val: 16, unit: "mg/dL", ref: "7-27", st: "ok" },
      ],
    }],
    visits: [{
      id: "v1", date: "2026-04-13", clinic: "みなみ動物クリニック", cost: 44869,
      summary: "初診。心肥大・高脂血症・椎間板ヘルニア確認。皮下点滴。安静指示。",
      items: [
        { n: "初診料", a: 1000 }, { n: "レントゲン×2", a: 7000 }, { n: "血液血球", a: 2500 },
        { n: "血液生化SDMA", a: 8950 }, { n: "犬スナップ", a: 2000 }, { n: "皮下点滴", a: 1000 },
        { n: "ビタミン剤・強肝剤", a: 1500 }, { n: "トリミング", a: 1500 },
        { n: "アンチノール30", a: 3300 }, { n: "イベルメックM×3", a: 2580 }, { n: "ブラベクト250×2", a: 9460 },
      ],
    }],
    weights: [{ date: "2026-04-13", value: 7.4 }],
    foods: [],
    todos: [
      { id: "t1", text: "心臓エコー検査", done: false },
      { id: "t2", text: "低脂肪フードへ切り替え", done: false },
      { id: "t3", text: "歯科チェック", done: false },
      { id: "t4", text: "減量：まず6.5kgへ", done: false },
    ],
    schedule: [
      { id: "s1", date: "2026-05-01", label: "イベルメック投与開始" },
      { id: "s2", date: "2026-07-13", label: "ブラベクト次回" },
      { id: "s3", date: "2026-10-13", label: "半年検診" },
      { id: "s4", date: "2026-11-25", label: "6種混合ワクチン" },
    ],
  },
  {
    id: "moka", name: "モカちゃん", emoji: "🐶", photo: null,
    birth: "2023-06-06", breed: "ミニチュアダックスフンド", sex: "♂ 去勢済",
    conditions: [{ id: "mc1", name: "肥満気味", sev: "要注意", note: "7.1kg。適正4.5-5kg。" }],
    meds: [], labs: [],
    visits: [],
    weights: [{ date: "2026-04-14", value: 7.1 }],
    foods: [],
    todos: [
      { id: "mt1", text: "フィラリア検査・予防薬", done: false },
      { id: "mt2", text: "ノミ・マダニ予防", done: false },
      { id: "mt3", text: "狂犬病ワクチン確認", done: false },
    ],
    schedule: [{ id: "ms1", date: "2026-11-25", label: "6種混合ワクチン" }],
  },
];

// ═══════════════════════════════════════
// UTILS
// ═══════════════════════════════════════
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const todayStr = () => new Date().toISOString().slice(0, 10);
const timeStr = () => new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
const calcAge = (b) => { const d = new Date(), bd = new Date(b); let y = d.getFullYear() - bd.getFullYear(); if (d.getMonth() < bd.getMonth() || (d.getMonth() === bd.getMonth() && d.getDate() < bd.getDate())) y--; return y; };
const daysTo = (d) => Math.ceil((new Date(d) - new Date(todayStr())) / 86400000);

// ═══════════════════════════════════════
// PRIMITIVES
// ═══════════════════════════════════════
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0}::-webkit-scrollbar{display:none}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.fade{animation:fadeIn .25s ease}
input:focus,textarea:focus,select:focus{border-color:${T.ac}!important;outline:none}
details summary{list-style:none}details summary::-webkit-details-marker{display:none}
`;

function Card({ children, glow, bc, onClick, style }) {
  return <div onClick={onClick} style={{ background: T.card, borderRadius: 14, border: `1px solid ${bc || T.bdr}`, padding: 14, marginBottom: 10, transition: "all .15s", cursor: onClick ? "pointer" : "default", ...(glow ? { boxShadow: `0 0 14px ${T.acG}` } : {}), ...style }}>{children}</div>;
}
function Btn({ children, v = "pri", small, full, ...p }) {
  const m = { pri: { background: T.gr, color: "#fff", border: "none" }, gh: { background: "transparent", color: T.ac, border: `1px solid ${T.bdr}` }, dn: { background: T.rdB, color: T.rd, border: `1px solid ${T.rd}33` }, gn: { background: T.gnB, color: T.gn, border: `1px solid ${T.gn}33` } };
  return <button {...p} style={{ padding: small ? "5px 12px" : "9px 16px", borderRadius: 10, fontSize: small ? 11 : 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", ...(full ? { width: "100%" } : {}), ...m[v], ...p.style }}>{children}</button>;
}
function Inp({ label, ...p }) {
  return <div style={{ marginBottom: 8 }}>
    {label && <label style={{ display: "block", fontSize: 11, color: T.tx2, marginBottom: 3, fontWeight: 600 }}>{label}</label>}
    <input {...p} style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: `1px solid ${T.bdr}`, background: T.input, color: T.tx, fontSize: 13, fontFamily: "inherit", ...p.style }} />
  </div>;
}
function Sel({ label, options, ...p }) {
  return <div style={{ marginBottom: 8 }}>
    {label && <label style={{ display: "block", fontSize: 11, color: T.tx2, marginBottom: 3, fontWeight: 600 }}>{label}</label>}
    <select {...p} style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: `1px solid ${T.bdr}`, background: T.input, color: T.tx, fontSize: 13, fontFamily: "inherit", ...p.style }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>;
}
function Badge({ text, color, bg }) {
  return <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700, color: color || "#fff", background: bg || "rgba(0,0,0,.05)" }}>{text}</span>;
}
function Bar({ val, max, color, h = 6 }) {
  return <div style={{ width: "100%", height: h, borderRadius: h, background: "rgba(0,0,0,.06)", overflow: "hidden" }}>
    <div style={{ width: `${Math.min((val / max) * 100, 100)}%`, height: "100%", borderRadius: h, background: `linear-gradient(90deg,${color},${color}66)`, transition: "width .4s" }} />
  </div>;
}
function Sec({ children, icon, action }) {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, marginTop: 8 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
      <h3 style={{ fontSize: 14, fontWeight: 700, color: T.tx }}>{children}</h3>
    </div>
    {action}
  </div>;
}
function Modal({ title, children, onClose }) {
  return <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16, backdropFilter: "blur(4px)" }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{ background: T.card, borderRadius: 16, border: `1px solid ${T.bdr}`, padding: 20, maxWidth: 380, width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800 }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: T.tx3, fontSize: 20, cursor: "pointer", padding: 4 }}>✕</button>
      </div>
      {children}
    </div>
  </div>;
}
function Empty({ text }) {
  return <Card style={{ textAlign: "center", padding: 28, color: T.tx3 }}><div style={{ fontSize: 28, marginBottom: 6 }}>📭</div>{text}</Card>;
}
function DelBtn({ onClick }) {
  return <button onClick={onClick} style={{ background: "none", border: "none", color: T.tx3, fontSize: 14, cursor: "pointer", padding: "2px 6px", borderRadius: 6 }} title="削除">🗑</button>;
}

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
const TABS = [
  { id: "dash", ic: "🏠", lb: "ホーム" }, { id: "meds", ic: "💊", lb: "お薬" },
  { id: "labs", ic: "🔬", lb: "検査" }, { id: "cal", ic: "📅", lb: "通院" },
  { id: "food", ic: "🍽️", lb: "食事" }, { id: "wt", ic: "⚖️", lb: "体重" },
  { id: "cost", ic: "💰", lb: "費用" }, { id: "cfg", ic: "⚙️", lb: "設定" },
];

export default function App() {
  const [pets, setPets] = useState(INIT_PETS);
  const [pid, setPid] = useState("ram");
  const [tab, setTab] = useState("dash");
  const [modal, setModal] = useState(null); // { type, data? }
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const pet = pets.find(p => p.id === pid) || pets[0];
  const setPet = (fn) => setPets(ps => ps.map(p => p.id === pid ? (typeof fn === "function" ? fn(p) : { ...p, ...fn }) : p));

  // Storage
  useEffect(() => { (async () => { try { const r = { value: localStorage.getItem("pet-app-v4") }; if (r?.value) setPets(JSON.parse(r.value)); } catch {} setLoaded(true); })(); }, []);
  const save = useCallback(async d => { setSaving(true); try { localStorage.setItem("pet-app-v4", JSON.stringify(d)); } catch {} setSaving(false); }, []);
  useEffect(() => { if (loaded) save(pets); }, [pets, loaded, save]);

  // Computed
  const age = calcAge(pet.birth);
  const lw = pet.weights.length ? pet.weights[pet.weights.length - 1].value : 0;
  const tgt = 5.0;
  const abnC = pet.labs.reduce((s, l) => s + l.results.filter(r => r.st !== "ok").length, 0);
  const totCost = pet.visits.reduce((s, v) => s + v.cost, 0);
  const nextMed = pet.meds.filter(m => m.active).sort((a, b) => a.next.localeCompare(b.next))[0];
  const nextDays = nextMed ? daysTo(nextMed.next) : null;

  // ─── Handlers ───
  const handlePhoto = e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = ev => setPet(p => ({ ...p, photo: ev.target.result })); r.readAsDataURL(f); };

  const addTodo = (text) => { if (!text.trim()) return; setPet(p => ({ ...p, todos: [...p.todos, { id: uid(), text, done: false }] })); };
  const togTodo = i => setPet(p => ({ ...p, todos: p.todos.map((t, j) => j === i ? { ...t, done: !t.done } : t) }));
  const delTodo = i => setPet(p => ({ ...p, todos: p.todos.filter((_, j) => j !== i) }));

  const addWeight = (v) => { const n = parseFloat(v); if (isNaN(n) || n <= 0) return; setPet(p => ({ ...p, weights: [...p.weights, { date: todayStr(), value: n }] })); };
  const delWeight = i => setPet(p => ({ ...p, weights: p.weights.filter((_, j) => j !== i) }));

  const addFood = (d) => setPet(p => ({ ...p, foods: [...p.foods, { id: uid(), date: todayStr(), time: timeStr(), ...d }] }));
  const delFood = id => setPet(p => ({ ...p, foods: p.foods.filter(f => f.id !== id) }));

  const addMed = (d) => setPet(p => ({ ...p, meds: [...p.meds, { id: uid(), active: true, ...d }] }));
  const delMed = id => setPet(p => ({ ...p, meds: p.meds.filter(m => m.id !== id) }));
  const recordDose = id => { setPet(p => ({ ...p, meds: p.meds.map(m => { if (m.id !== id) return m; const nd = new Date(todayStr()); nd.setDate(nd.getDate() + (m.interval || 30)); return { ...m, next: nd.toISOString().slice(0, 10), remaining: Math.max(0, (m.remaining || 1) - 1) }; }) })); setModal(null); };

  const addCondition = d => setPet(p => ({ ...p, conditions: [...p.conditions, { id: uid(), ...d }] }));
  const delCondition = id => setPet(p => ({ ...p, conditions: p.conditions.filter(c => c.id !== id) }));

  const addVisit = d => setPet(p => ({ ...p, visits: [{ id: uid(), ...d }, ...p.visits] }));
  const delVisit = id => setPet(p => ({ ...p, visits: p.visits.filter(v => v.id !== id) }));

  const addSchedule = d => setPet(p => ({ ...p, schedule: [...p.schedule, { id: uid(), ...d }] }));
  const delSchedule = id => setPet(p => ({ ...p, schedule: p.schedule.filter(s => s.id !== id) }));

  const addLab = d => setPet(p => ({ ...p, labs: [{ id: uid(), ...d }, ...p.labs] }));
  const delLab = id => setPet(p => ({ ...p, labs: p.labs.filter(l => l.id !== id) }));

  const addPet = d => { const np = { id: uid(), conditions: [], meds: [], labs: [], visits: [], weights: [], foods: [], todos: [], schedule: [], photo: null, ...d }; setPets(ps => [...ps, np]); setPid(np.id); setModal(null); };
  const delPet = id => { if (pets.length <= 1) return; setPets(ps => ps.filter(p => p.id !== id)); if (pid === id) setPid(pets.find(p => p.id !== id)?.id); };

  if (!loaded) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: T.bg }}><div style={{ textAlign: "center" }}><div style={{ fontSize: 32, animation: "pulse 1.5s infinite" }}>🐾</div><p style={{ color: T.tx2, fontSize: 13, marginTop: 8 }}>読み込み中...</p></div></div>;

  // ═══════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════
  return (
    <div style={{ fontFamily: "'Inter','Hiragino Kaku Gothic ProN',sans-serif", background: T.bg, minHeight: "100vh", color: T.tx }}>
      <style>{css}</style>
      <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />

      {/* ── Pet Switcher ── */}
      <div style={{ display: "flex", background: T.card, borderBottom: `1px solid ${T.bdr}` }}>
        {pets.map(p => (
          <button key={p.id} onClick={() => { setPid(p.id); }} style={{ flex: 1, padding: "10px 0", border: "none", background: pid === p.id ? T.acG : "none", cursor: "pointer", fontFamily: "inherit", borderBottom: pid === p.id ? `2px solid ${T.ac}` : "2px solid transparent" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {p.photo ? <img src={p.photo} alt="" style={{ width: 24, height: 24, borderRadius: 6, objectFit: "cover" }} /> : <span style={{ fontSize: 18 }}>{p.emoji || "🐾"}</span>}
              <span style={{ fontSize: 12, fontWeight: pid === p.id ? 800 : 500, color: pid === p.id ? T.tx : T.tx2 }}>{p.name}</span>
            </div>
          </button>
        ))}
        <button onClick={() => setModal({ type: "addPet" })} style={{ flex: "0 0 44px", border: "none", background: "none", color: T.tx3, fontSize: 18, cursor: "pointer" }} title="ペット追加">＋</button>
      </div>

      {/* ── Header ── */}
      <div style={{ background: `linear-gradient(180deg,${T.card},${T.bg})`, padding: "14px 14px 10px", position: "relative" }}>
        <div style={{ position: "absolute", top: -40, right: -20, width: 120, height: 120, borderRadius: "50%", background: T.acG, filter: "blur(30px)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
          <div onClick={() => fileRef.current?.click()} style={{ width: 46, height: 46, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: pet.photo ? "none" : T.acG, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${T.ac}33`, cursor: "pointer" }}>
            {pet.photo ? <img src={pet.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 24 }}>{pet.emoji || "🐾"}</span>}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 17, fontWeight: 800 }}>{pet.name}</h1>
            <p style={{ fontSize: 10, color: T.tx2 }}>{pet.breed}・{age}歳・{pet.sex}・🎂{pet.birth}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: T.ac }}>{lw}<span style={{ fontSize: 10, color: T.tx2 }}>kg</span></div>
            {saving && <span style={{ fontSize: 8, color: T.tx3 }}>保存中</span>}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", overflowX: "auto", background: T.card, borderBottom: `1px solid ${T.bdr}`, WebkitOverflowScrolling: "touch" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, padding: "7px 10px", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", borderBottom: tab === t.id ? `2px solid ${T.ac}` : "2px solid transparent", opacity: tab === t.id ? 1 : .4 }}>
            <span style={{ fontSize: 13 }}>{t.ic}</span>
            <span style={{ fontSize: 8, fontWeight: 600, color: tab === t.id ? T.ac : T.tx2 }}>{t.lb}</span>
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="fade" key={`${pid}-${tab}`} style={{ padding: 12, maxWidth: 520, margin: "0 auto", paddingBottom: 32 }}>

        {/* ═══ DASHBOARD ═══ */}
        {tab === "dash" && <>
          {nextMed && nextDays !== null && (
            <Card glow bc={nextDays <= 0 ? `${T.rd}66` : `${T.ac}33`} style={{ display: "flex", alignItems: "center", gap: 10, background: nextDays <= 0 ? T.rdB : T.card }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: nextDays <= 0 ? `${T.rd}22` : T.acG, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💊</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700 }}>{nextDays <= 0 ? "今日のお薬！" : `次のお薬 ${nextDays}日後`}</div><div style={{ fontSize: 10, color: T.tx2 }}>{nextMed.name}</div></div>
              {nextDays <= 0 && <Btn small onClick={() => setModal({ type: "dose", id: nextMed.id })}>投与記録</Btn>}
            </Card>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
            {[{ ic: "🩺", v: pet.conditions.length, l: "診断", c: T.rd }, { ic: "⚠️", v: abnC, l: "異常値", c: T.am }, { ic: "💰", v: totCost > 0 ? `¥${(totCost / 1000).toFixed(0)}K` : "¥0", l: "累計", c: T.cy }].map((s, i) => (
              <Card key={i} style={{ textAlign: "center", padding: "10px 4px" }}>
                <div style={{ fontSize: 16 }}>{s.ic}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 9, color: T.tx2 }}>{s.l}</div>
              </Card>
            ))}
          </div>

          {lw > 0 && <Card>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
              <span style={{ fontWeight: 700 }}>🎯 減量</span><span style={{ color: T.tx2 }}>目標 {tgt}kg</span>
            </div>
            <Bar val={Math.max(pet.weights[0].value - lw, 0)} max={pet.weights[0].value - tgt} color={T.gn} h={6} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9, color: T.tx2 }}><span>現在 {lw}kg</span><span>あと {(lw - tgt).toFixed(1)}kg</span></div>
          </Card>}

          {/* Conditions */}
          <Sec icon="🏥" action={<Btn small v="gh" onClick={() => setModal({ type: "addCondition" })}>＋追加</Btn>}>診断</Sec>
          {pet.conditions.length === 0 ? <Empty text="診断記録なし" /> : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {pet.conditions.map(c => (
                <Card key={c.id} style={{ padding: 10, position: "relative" }}>
                  <div style={{ position: "absolute", top: 6, right: 6 }}><DelBtn onClick={() => delCondition(c.id)} /></div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{c.name}</div>
                  <Badge text={c.sev} bg={`${T.am}22`} color={T.am} />
                  {c.note && <p style={{ fontSize: 9, color: T.tx2, marginTop: 4, lineHeight: 1.3 }}>{c.note}</p>}
                </Card>
              ))}
            </div>
          )}

          {/* Todos */}
          <Sec icon="✅" action={<Btn small v="gh" onClick={() => setModal({ type: "addTodo" })}>＋追加</Btn>}>やること</Sec>
          {pet.todos.length === 0 ? <Empty text="タスクなし" /> : pet.todos.map((t, i) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, background: T.card, borderRadius: 9, border: `1px solid ${T.bdr}`, padding: "8px 10px", marginBottom: 4, opacity: t.done ? .35 : 1 }}>
              <div onClick={() => togTodo(i)} style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, border: t.done ? "none" : `2px solid ${T.bdr}`, background: t.done ? T.ac : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                {t.done && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
              </div>
              <span style={{ flex: 1, fontSize: 12, textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
              <DelBtn onClick={() => delTodo(i)} />
            </div>
          ))}
        </>}

        {/* ═══ MEDS ═══ */}
        {tab === "meds" && <>
          <Sec icon="💊" action={<Btn small v="gh" onClick={() => setModal({ type: "addMed" })}>＋追加</Btn>}>お薬・予防</Sec>
          {pet.meds.length === 0 ? <Empty text="お薬の登録なし" /> : pet.meds.map(m => {
            const dl = daysTo(m.next), now = dl <= 0;
            return (
              <Card key={m.id} bc={now ? `${T.rd}55` : undefined} style={{ background: now ? `${T.rd}06` : T.card }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div><div style={{ fontSize: 14, fontWeight: 700 }}>{m.name}</div><div style={{ fontSize: 11, color: T.tx2 }}>{m.purpose}</div></div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {m.active && <Btn small v={now ? "pri" : "gh"} onClick={() => setModal({ type: "dose", id: m.id })}>{now ? "投与記録" : "投与済み"}</Btn>}
                    <DelBtn onClick={() => delMed(m.id)} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 10, color: T.tx2 }}>
                  <span>📅 {m.freq}</span>
                  <span>次回: <span style={{ color: now ? T.rd : T.gn, fontWeight: 600 }}>{now ? "今日！" : `${dl}日後`}</span></span>
                  {m.remaining != null && <span>残{m.remaining}</span>}
                </div>
              </Card>
            );
          })}

          <Sec icon="📋" action={<Btn small v="gh" onClick={() => setModal({ type: "addSchedule" })}>＋追加</Btn>}>予防スケジュール</Sec>
          {pet.schedule.length === 0 ? <Empty text="予定なし" /> : pet.schedule.sort((a, b) => a.date.localeCompare(b.date)).map(s => {
            const d = daysTo(s.date);
            return (
              <Card key={s.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 9, background: T.acG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `1px solid ${T.ac}22`, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: T.ac }}>{s.date.slice(8)}</span>
                  <span style={{ fontSize: 8, color: T.tx3 }}>{s.date.slice(5, 7)}月</span>
                </div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{s.label}</div><div style={{ fontSize: 10, color: T.tx2 }}>{s.date}</div></div>
                <Badge text={d <= 0 ? "今日" : `${d}日後`} bg={d <= 7 ? T.rdB : T.acG} color={d <= 7 ? T.rd : T.ac} />
                <DelBtn onClick={() => delSchedule(s.id)} />
              </Card>
            );
          })}
        </>}

        {/* ═══ LABS ═══ */}
        {tab === "labs" && <>
          <Sec icon="🔬" action={<Btn small v="gh" onClick={() => setModal({ type: "addLab" })}>＋追加</Btn>}>検査結果</Sec>
          {pet.labs.length === 0 ? <Empty text="検査記録なし" /> : pet.labs.map(lab => (
            <div key={lab.id}>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div><div style={{ fontSize: 13, fontWeight: 700 }}>{lab.type}</div><div style={{ fontSize: 10, color: T.tx2 }}>{lab.date}</div></div>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    <Badge text={`異常${lab.results.filter(r => r.st !== "ok").length}`} bg={T.rdB} color={T.rd} />
                    <DelBtn onClick={() => delLab(lab.id)} />
                  </div>
                </div>
                {lab.results.filter(r => r.st !== "ok").map((r, i) => (
                  <div key={i} style={{ padding: "6px 0", borderBottom: `1px solid ${T.bdr}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{r.name}</span>
                      <Badge text={r.st === "hi" ? "↑高" : "↓低"} bg={r.st === "hi" ? T.rdB : T.amB} color={r.st === "hi" ? T.rd : T.am} />
                    </div>
                    <div style={{ fontSize: 11, marginTop: 2 }}><span style={{ fontWeight: 700, color: r.st === "hi" ? T.rd : T.am }}>{r.val}</span> <span style={{ color: T.tx3 }}>{r.unit} (基準:{r.ref})</span></div>
                    {r.note && <div style={{ fontSize: 9, color: T.tx2, marginTop: 1 }}>{r.note}</div>}
                  </div>
                ))}
                <details style={{ marginTop: 6 }}>
                  <summary style={{ fontSize: 11, color: T.ac, cursor: "pointer", fontWeight: 600 }}>▼ 基準値内 ({lab.results.filter(r => r.st === "ok").length})</summary>
                  {lab.results.filter(r => r.st === "ok").map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${T.bdr}`, fontSize: 11 }}>
                      <span style={{ color: T.tx2 }}>{r.name}</span><span>{r.val} {r.unit}</span><span style={{ color: T.tx3 }}>{r.ref}</span>
                    </div>
                  ))}
                </details>
              </Card>
            </div>
          ))}
        </>}

        {/* ═══ CALENDAR ═══ */}
        {tab === "cal" && <>
          <Sec icon="🏥" action={<Btn small v="gh" onClick={() => setModal({ type: "addVisit" })}>＋追加</Btn>}>通院記録</Sec>
          {pet.visits.length === 0 ? <Empty text="通院記録なし" /> : pet.visits.map(v => (
            <Card key={v.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div><div style={{ fontSize: 13, fontWeight: 700 }}>{v.date}</div><div style={{ fontSize: 10, color: T.tx2 }}>{v.clinic}</div></div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: T.ac }}>¥{v.cost.toLocaleString()}</span>
                  <DelBtn onClick={() => delVisit(v.id)} />
                </div>
              </div>
              <p style={{ fontSize: 11, color: T.tx2, lineHeight: 1.4, marginBottom: 6 }}>{v.summary}</p>
              {v.items?.length > 0 && <details>
                <summary style={{ fontSize: 10, color: T.ac, cursor: "pointer", fontWeight: 600 }}>▼ 明細</summary>
                {v.items.map((it, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontSize: 10, color: T.tx2, borderBottom: `1px solid ${T.bdr}` }}>
                    <span>{it.n}</span><span>¥{it.a.toLocaleString()}</span>
                  </div>
                ))}
              </details>}
            </Card>
          ))}
        </>}

        {/* ═══ FOOD ═══ */}
        {tab === "food" && <>
          <Sec icon="🍽️" action={<Btn small v="gh" onClick={() => setModal({ type: "addFood" })}>＋追加</Btn>}>食事記録</Sec>
          {pet.foods.length === 0 ? <Empty text="食事記録なし。＋追加で記録しよう" /> : (
            [...pet.foods].reverse().map(f => (
              <Card key={f.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px" }}>
                <span style={{ fontSize: 16 }}>{f.type === "おやつ" ? "🦴" : f.type === "サプリ" ? "💊" : "🍖"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{f.name}</div>
                  <div style={{ fontSize: 9, color: T.tx2 }}>{f.date} {f.time} ・{f.type}{f.amount && ` ・${f.amount}`}</div>
                </div>
                <DelBtn onClick={() => delFood(f.id)} />
              </Card>
            ))
          )}
        </>}

        {/* ═══ WEIGHT ═══ */}
        {tab === "wt" && <>
          <Card glow style={{ textAlign: "center", padding: 18 }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: T.ac }}>{lw}<span style={{ fontSize: 14, color: T.tx2 }}>kg</span></div>
            <div style={{ marginTop: 10, padding: 6, borderRadius: 8, background: lw > 6 ? T.rdB : T.gnB }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: lw > 6 ? T.rd : T.gn }}>🎯 目標{tgt}kg あと{(lw - tgt).toFixed(1)}kg</span>
            </div>
          </Card>
          {pet.weights.length > 1 && <Card>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>📈 推移</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 100 }}>
              {pet.weights.slice(-15).map((w, i) => {
                const p = ((w.value - 4) / 4) * 100;
                return <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 36 }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: T.ac, marginBottom: 2 }}>{w.value}</span>
                  <div style={{ width: "100%", height: `${Math.max(p, 5)}%`, background: `linear-gradient(180deg,${w.value > 6 ? T.rd : T.gn}cc,${w.value > 6 ? T.rd : T.gn}22)`, borderRadius: "5px 5px 2px 2px" }} />
                  <span style={{ fontSize: 7, color: T.tx3, marginTop: 2 }}>{w.date.slice(5)}</span>
                </div>;
              })}
            </div>
          </Card>}
          <Sec icon="⚖️" action={<Btn small v="gh" onClick={() => setModal({ type: "addWeight" })}>＋記録</Btn>}>記録履歴</Sec>
          {[...pet.weights].reverse().map((w, i) => (
            <Card key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px" }}>
              <span style={{ fontSize: 12 }}>{w.date}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: w.value > 6 ? T.am : T.gn }}>{w.value}kg</span>
                <DelBtn onClick={() => delWeight(pet.weights.length - 1 - i)} />
              </div>
            </Card>
          ))}
        </>}

        {/* ═══ COST ═══ */}
        {tab === "cost" && <>
          <Card glow style={{ textAlign: "center", padding: 18 }}>
            <div style={{ fontSize: 10, color: T.tx2 }}>累計医療費</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.ac }}>¥{totCost.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: T.tx2, marginTop: 2 }}>通院{pet.visits.length}回</div>
          </Card>
          {pet.visits.map(v => {
            const cats = {};
            (v.items || []).forEach(it => {
              const cat = it.n.match(/検査|血液|SDMA|スナップ/) ? "検査" : it.n.match(/レントゲン/) ? "画像" : it.n.match(/点滴|ビタミン|強肝/) ? "処置" : it.n.match(/アンチ|イベル|ブラベクト/) ? "薬" : "他";
              cats[cat] = (cats[cat] || 0) + it.a;
            });
            const mx = Math.max(...Object.values(cats), 1);
            return <Card key={v.id}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{v.date} - ¥{v.cost.toLocaleString()}</div>
              {Object.entries(cats).sort((a, b) => b[1] - a[1]).map(([c, a], i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}><span style={{ color: T.tx2 }}>{c}</span><span>¥{a.toLocaleString()}</span></div>
                  <Bar val={a} max={mx} color={T.ac} />
                </div>
              ))}
            </Card>;
          })}
        </>}

        {/* ═══ SETTINGS ═══ */}
        {tab === "cfg" && <>
          <Sec icon="🐾">プロフィール</Sec>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div onClick={() => fileRef.current?.click()} style={{ width: 56, height: 56, borderRadius: 14, overflow: "hidden", background: T.acG, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${T.ac}33`, cursor: "pointer", flexShrink: 0 }}>
                {pet.photo ? <img src={pet.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ textAlign: "center" }}><span style={{ fontSize: 20 }}>📷</span><div style={{ fontSize: 7, color: T.tx3 }}>タップ</div></div>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{pet.name}</div>
                <div style={{ fontSize: 10, color: T.tx2 }}>{pet.breed}・{age}歳・{pet.sex}</div>
                <div style={{ fontSize: 10, color: T.tx3 }}>🎂 {pet.birth}</div>
              </div>
              <Btn small v="gh" onClick={() => setModal({ type: "editPet" })}>編集</Btn>
            </div>
          </Card>
          <Sec icon="🏥">かかりつけ医</Sec>
          <Card>
            <div style={{ fontSize: 13, fontWeight: 700 }}>みなみ動物クリニック</div>
            <div style={{ fontSize: 10, color: T.tx2, lineHeight: 1.6, marginTop: 2 }}>📍 鹿児島市谷山中央4丁目4954-26<br/>📞 099-210-5787</div>
          </Card>
          <Sec icon="👨‍👩‍👦">家族で共有</Sec>
          <Card>
            <Btn full v="gh" onClick={async () => { try { localStorage.setItem("pet-shared", JSON.stringify(pets)); alert("共有データを更新しました！"); } catch {} }}>🔗 家族と共有する</Btn>
          </Card>
          <Sec icon="🗑️">データ</Sec>
          <Card><Btn full v="dn" onClick={() => { if (confirm("全データリセットしますか？")) { setPets(INIT_PETS); setPid("ram"); } }}>データをリセット</Btn></Card>
          {pets.length > 1 && <Card><Btn full v="dn" onClick={() => { if (confirm(`${pet.name}を削除しますか？`)) delPet(pet.id); }}>この子を削除</Btn></Card>}
        </>}
      </div>

      {/* ═══ MODALS ═══ */}
      {modal?.type === "dose" && (
        <Modal title="💊 投与記録" onClose={() => setModal(null)}>
          <p style={{ fontSize: 13, color: T.tx2, marginBottom: 14 }}>{pet.meds.find(m => m.id === modal.id)?.name} を投与しましたか？</p>
          <div style={{ display: "flex", gap: 8 }}><Btn full v="gh" onClick={() => setModal(null)}>キャンセル</Btn><Btn full onClick={() => recordDose(modal.id)}>記録する</Btn></div>
        </Modal>
      )}

      {modal?.type === "addTodo" && (() => {
        let val = "";
        return <Modal title="✅ やること追加" onClose={() => setModal(null)}>
          <Inp label="内容" placeholder="例: 歯科チェック" onChange={e => val = e.target.value} />
          <Btn full onClick={() => { addTodo(val); setModal(null); }}>追加</Btn>
        </Modal>;
      })()}

      {modal?.type === "addCondition" && (() => {
        const s = { name: "", sev: "", note: "" };
        return <Modal title="🏥 診断追加" onClose={() => setModal(null)}>
          <Inp label="診断名" placeholder="例: 僧帽弁閉鎖不全症" onChange={e => s.name = e.target.value} />
          <Inp label="重症度" placeholder="例: 要経過観察" onChange={e => s.sev = e.target.value} />
          <Inp label="メモ" placeholder="補足情報" onChange={e => s.note = e.target.value} />
          <Btn full onClick={() => { if (s.name) { addCondition(s); setModal(null); } }}>追加</Btn>
        </Modal>;
      })()}

      {modal?.type === "addMed" && (() => {
        const s = { name: "", purpose: "", freq: "毎日", interval: 1, next: todayStr(), remaining: 30 };
        return <Modal title="💊 お薬追加" onClose={() => setModal(null)}>
          <Inp label="薬名" placeholder="例: アンチノール" onChange={e => s.name = e.target.value} />
          <Inp label="目的" placeholder="例: 心臓サポート" onChange={e => s.purpose = e.target.value} />
          <Sel label="頻度" options={["毎日", "週1回", "月1回", "3ヶ月に1回"]} onChange={e => { s.freq = e.target.value; s.interval = { "毎日": 1, "週1回": 7, "月1回": 30, "3ヶ月に1回": 90 }[e.target.value] || 1; }} />
          <Inp label="次回投与日" type="date" defaultValue={todayStr()} onChange={e => s.next = e.target.value} />
          <Inp label="残り回数" type="number" defaultValue="30" onChange={e => s.remaining = parseInt(e.target.value) || 0} />
          <Btn full onClick={() => { if (s.name) { addMed(s); setModal(null); } }}>追加</Btn>
        </Modal>;
      })()}

      {modal?.type === "addFood" && (() => {
        const s = { name: "", amount: "", type: "ドライフード" };
        return <Modal title="🍽️ 食事記録" onClose={() => setModal(null)}>
          <Inp label="フード名" placeholder="例: ロイヤルカナン 消化器サポート" onChange={e => s.name = e.target.value} />
          <Inp label="量" placeholder="例: 80g" onChange={e => s.amount = e.target.value} />
          <Sel label="種類" options={["ドライフード", "ウェットフード", "療法食", "おやつ", "トッピング", "サプリ"]} onChange={e => s.type = e.target.value} />
          <Btn full onClick={() => { if (s.name) { addFood(s); setModal(null); } }}>記録する</Btn>
        </Modal>;
      })()}

      {modal?.type === "addWeight" && (() => {
        let v = "";
        return <Modal title="⚖️ 体重記録" onClose={() => setModal(null)}>
          <Inp label="体重 (kg)" type="number" step="0.1" placeholder="例: 7.2" onChange={e => v = e.target.value} />
          <Btn full onClick={() => { addWeight(v); setModal(null); }}>記録する</Btn>
        </Modal>;
      })()}

      {modal?.type === "addVisit" && (() => {
        const s = { date: todayStr(), clinic: "みなみ動物クリニック", cost: 0, summary: "", items: [] };
        let itemN = "", itemA = "";
        return <Modal title="🏥 通院記録追加" onClose={() => setModal(null)}>
          <Inp label="日付" type="date" defaultValue={todayStr()} onChange={e => s.date = e.target.value} />
          <Inp label="病院名" defaultValue="みなみ動物クリニック" onChange={e => s.clinic = e.target.value} />
          <Inp label="合計金額" type="number" placeholder="例: 15000" onChange={e => s.cost = parseInt(e.target.value) || 0} />
          <Inp label="概要メモ" placeholder="例: 定期検診、血液検査" onChange={e => s.summary = e.target.value} />
          <Btn full onClick={() => { addVisit(s); setModal(null); }}>追加</Btn>
        </Modal>;
      })()}

      {modal?.type === "addSchedule" && (() => {
        const s = { date: "", label: "" };
        return <Modal title="📅 予定追加" onClose={() => setModal(null)}>
          <Inp label="日付" type="date" onChange={e => s.date = e.target.value} />
          <Inp label="内容" placeholder="例: 混合ワクチン" onChange={e => s.label = e.target.value} />
          <Btn full onClick={() => { if (s.date && s.label) { addSchedule(s); setModal(null); } }}>追加</Btn>
        </Modal>;
      })()}

      {modal?.type === "addLab" && (() => {
        const s = { date: todayStr(), type: "", results: [] };
        let rn = "", rv = "", ru = "", rr = "", rs = "ok", rnote = "";
        return <Modal title="🔬 検査結果追加" onClose={() => setModal(null)}>
          <Inp label="日付" type="date" defaultValue={todayStr()} onChange={e => s.date = e.target.value} />
          <Inp label="検査種別" placeholder="例: 血液検査" onChange={e => s.type = e.target.value} />
          <div style={{ borderTop: `1px solid ${T.bdr}`, marginTop: 8, paddingTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6, color: T.tx2 }}>検査項目を追加：</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              <Inp placeholder="項目名" onChange={e => rn = e.target.value} />
              <Inp placeholder="値" type="number" step="any" onChange={e => rv = e.target.value} />
              <Inp placeholder="単位" onChange={e => ru = e.target.value} />
              <Inp placeholder="基準値" onChange={e => rr = e.target.value} />
            </div>
            <Sel label="判定" options={["正常", "高値", "低値"]} onChange={e => rs = { "正常": "ok", "高値": "hi", "低値": "lo" }[e.target.value]} />
            <Inp placeholder="メモ（任意）" onChange={e => rnote = e.target.value} />
            <Btn full v="gh" onClick={() => { if (rn && rv) { s.results.push({ name: rn, val: parseFloat(rv), unit: ru, ref: rr, st: rs, note: rnote || undefined }); alert(`${rn} を追加（計${s.results.length}項目）`); } }} style={{ marginBottom: 8 }}>＋ この項目を追加</Btn>
          </div>
          <Btn full onClick={() => { if (s.type && s.results.length) { addLab(s); setModal(null); } }}>検査結果を保存</Btn>
        </Modal>;
      })()}

      {modal?.type === "addPet" && (() => {
        const s = { name: "", emoji: "🐾", birth: "", breed: "ミニチュアダックスフンド", sex: "♂ 去勢済" };
        return <Modal title="🐾 ペット追加" onClose={() => setModal(null)}>
          <Inp label="名前" placeholder="例: チョコちゃん" onChange={e => s.name = e.target.value} />
          <Inp label="絵文字" defaultValue="🐾" onChange={e => s.emoji = e.target.value} />
          <Inp label="誕生日" type="date" onChange={e => s.birth = e.target.value} />
          <Inp label="犬種" defaultValue="ミニチュアダックスフンド" onChange={e => s.breed = e.target.value} />
          <Sel label="性別" options={["♂ 去勢済", "♂ 未去勢", "♀ 避妊済", "♀ 未避妊"]} onChange={e => s.sex = e.target.value} />
          <Btn full onClick={() => { if (s.name && s.birth) { addPet(s); } }}>追加</Btn>
        </Modal>;
      })()}

      {modal?.type === "editPet" && (() => {
        const s = { name: pet.name, emoji: pet.emoji, birth: pet.birth, breed: pet.breed, sex: pet.sex };
        return <Modal title="✏️ プロフィール編集" onClose={() => setModal(null)}>
          <Inp label="名前" defaultValue={pet.name} onChange={e => s.name = e.target.value} />
          <Inp label="絵文字" defaultValue={pet.emoji} onChange={e => s.emoji = e.target.value} />
          <Inp label="誕生日" type="date" defaultValue={pet.birth} onChange={e => s.birth = e.target.value} />
          <Inp label="犬種" defaultValue={pet.breed} onChange={e => s.breed = e.target.value} />
          <Sel label="性別" options={["♂ 去勢済", "♂ 未去勢", "♀ 避妊済", "♀ 未避妊"]} value={s.sex} onChange={e => s.sex = e.target.value} />
          <Btn full onClick={() => { setPet(p => ({ ...p, ...s })); setModal(null); }}>保存</Btn>
        </Modal>;
      })()}
    </div>
  );
}
