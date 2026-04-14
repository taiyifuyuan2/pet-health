import { Modal, Inp, Sel, Btn } from "./ui";
import { T, todayStr } from "../theme";

export default function Modals({
  modal,
  setModal,
  pet,
  recordDose,
  addTodo,
  addCondition,
  addMed,
  editMed,
  addFood,
  addWeight,
  addVisit,
  addSchedule,
  addLab,
  addPet,
  updatePet,
}) {
  if (!modal) return null;

  if (modal.type === "dose") {
    const med = pet?.meds?.find((m) => m.id === modal.id);
    return (
      <Modal title="💊 投与記録" onClose={() => setModal(null)}>
        <p style={{ fontSize: 14, color: T.tx2, marginBottom: 18, lineHeight: 1.6 }}>
          <strong style={{ color: T.tx }}>{med?.name}</strong> を投与しましたか？
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn full v="gh" onClick={() => setModal(null)}>キャンセル</Btn>
          <Btn full onClick={() => recordDose(modal.id)}>記録する</Btn>
        </div>
      </Modal>
    );
  }

  if (modal.type === "addTodo") {
    let val = "";
    return (
      <Modal title="✅ やること追加" onClose={() => setModal(null)}>
        <Inp label="内容" placeholder="例: 歯科チェック" onChange={(e) => (val = e.target.value)} />
        <Btn full onClick={() => { addTodo(val); setModal(null); }}>追加</Btn>
      </Modal>
    );
  }

  if (modal.type === "addCondition") {
    const s = { name: "", sev: "", note: "" };
    return (
      <Modal title="🏥 診断追加" onClose={() => setModal(null)}>
        <Inp label="診断名" placeholder="例: 僧帽弁閉鎖不全症" onChange={(e) => (s.name = e.target.value)} />
        <Inp label="重症度" placeholder="例: 要経過観察" onChange={(e) => (s.sev = e.target.value)} />
        <Inp label="メモ" placeholder="補足情報" onChange={(e) => (s.note = e.target.value)} />
        <Btn full onClick={() => { if (s.name) { addCondition(s); setModal(null); } }}>追加</Btn>
      </Modal>
    );
  }

  if (modal.type === "addMed") {
    const s = { name: "", purpose: "", freq: "毎日", interval: 1, next: todayStr(), remaining: 30 };
    return (
      <Modal title="💊 お薬追加" onClose={() => setModal(null)}>
        <Inp label="薬名" placeholder="例: アンチノール" onChange={(e) => (s.name = e.target.value)} />
        <Inp label="目的" placeholder="例: 心臓サポート" onChange={(e) => (s.purpose = e.target.value)} />
        <Sel
          label="頻度"
          options={["毎日", "週1回", "月1回", "3ヶ月に1回"]}
          onChange={(e) => {
            s.freq = e.target.value;
            s.interval = { 毎日: 1, 週1回: 7, 月1回: 30, "3ヶ月に1回": 90 }[e.target.value] || 1;
          }}
        />
        <Inp label="次回投与日" type="date" defaultValue={todayStr()} onChange={(e) => (s.next = e.target.value)} />
        <Inp label="残り回数" type="number" defaultValue="30" onChange={(e) => (s.remaining = parseInt(e.target.value) || 0)} />
        <Btn full onClick={() => { if (s.name) { addMed(s); setModal(null); } }}>追加</Btn>
      </Modal>
    );
  }

  if (modal.type === "addFood") {
    const s = { name: "", amount: "", type: "ドライフード" };
    return (
      <Modal title="🍽 食事記録" onClose={() => setModal(null)}>
        <Inp label="フード名" placeholder="例: ロイヤルカナン 消化器サポート" onChange={(e) => (s.name = e.target.value)} />
        <Inp label="量" placeholder="例: 80g" onChange={(e) => (s.amount = e.target.value)} />
        <Sel
          label="種類"
          options={["ドライフード", "ウェットフード", "療法食", "おやつ", "トッピング", "サプリ"]}
          onChange={(e) => (s.type = e.target.value)}
        />
        <Btn full onClick={() => { if (s.name) { addFood(s); setModal(null); } }}>記録する</Btn>
      </Modal>
    );
  }

  if (modal.type === "addWeight") {
    let v = "";
    return (
      <Modal title="⚖ 体重記録" onClose={() => setModal(null)}>
        <Inp label="体重 (kg)" type="number" step="0.1" placeholder="例: 7.2" onChange={(e) => (v = e.target.value)} />
        <Btn full onClick={() => { addWeight(v); setModal(null); }}>記録する</Btn>
      </Modal>
    );
  }

  if (modal.type === "addVisit") {
    const s = { date: todayStr(), clinic: "みなみ動物クリニック", cost: 0, summary: "" };
    return (
      <Modal title="🏥 通院記録追加" onClose={() => setModal(null)}>
        <Inp label="日付" type="date" defaultValue={todayStr()} onChange={(e) => (s.date = e.target.value)} />
        <Inp label="病院名" defaultValue="みなみ動物クリニック" onChange={(e) => (s.clinic = e.target.value)} />
        <Inp label="合計金額" type="number" placeholder="例: 15000" onChange={(e) => (s.cost = parseInt(e.target.value) || 0)} />
        <Inp label="概要メモ" placeholder="例: 定期検診、血液検査" onChange={(e) => (s.summary = e.target.value)} />
        <Btn full onClick={() => { addVisit(s); setModal(null); }}>追加</Btn>
      </Modal>
    );
  }

  if (modal.type === "addSchedule") {
    const s = { date: "", label: "" };
    return (
      <Modal title="📅 予定追加" onClose={() => setModal(null)}>
        <Inp label="日付" type="date" onChange={(e) => (s.date = e.target.value)} />
        <Inp label="内容" placeholder="例: 混合ワクチン" onChange={(e) => (s.label = e.target.value)} />
        <Btn full onClick={() => { if (s.date && s.label) { addSchedule(s); setModal(null); } }}>追加</Btn>
      </Modal>
    );
  }

  if (modal.type === "addLab") {
    const s = { date: todayStr(), type: "", results: [] };
    let rn = "", rv = "", ru = "", rr = "", rs = "ok", rnote = "";
    return (
      <Modal title="🔬 検査結果追加" onClose={() => setModal(null)}>
        <Inp label="日付" type="date" defaultValue={todayStr()} onChange={(e) => (s.date = e.target.value)} />
        <Inp label="検査種別" placeholder="例: 血液検査" onChange={(e) => (s.type = e.target.value)} />
        <div style={{ borderTop: `1px solid ${T.bdr}`, marginTop: 14, paddingTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, color: T.tx2 }}>検査項目を追加：</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Inp placeholder="項目名" onChange={(e) => (rn = e.target.value)} />
            <Inp placeholder="値" type="number" step="any" onChange={(e) => (rv = e.target.value)} />
            <Inp placeholder="単位" onChange={(e) => (ru = e.target.value)} />
            <Inp placeholder="基準値" onChange={(e) => (rr = e.target.value)} />
          </div>
          <Sel
            label="判定"
            options={["正常", "高値", "低値"]}
            onChange={(e) => (rs = { 正常: "ok", 高値: "hi", 低値: "lo" }[e.target.value])}
          />
          <Inp placeholder="メモ（任意）" onChange={(e) => (rnote = e.target.value)} />
          <Btn
            full
            v="gh"
            onClick={() => {
              if (rn && rv) {
                s.results.push({ name: rn, val: parseFloat(rv), unit: ru, ref: rr, st: rs, note: rnote || undefined });
                alert(`${rn} を追加（計${s.results.length}項目）`);
              }
            }}
            style={{ marginBottom: 12 }}
          >
            ＋ この項目を追加
          </Btn>
        </div>
        <Btn full onClick={() => { if (s.type && s.results.length) { addLab(s); setModal(null); } }}>
          検査結果を保存
        </Btn>
      </Modal>
    );
  }

  if (modal.type === "editMed") {
    const med = pet?.meds?.find((m) => m.id === modal.id);
    if (!med) return null;
    const FREQ = { 毎日: 1, 週1回: 7, 月1回: 30, "3ヶ月に1回": 90 };
    const initialFreq =
      Object.keys(FREQ).find((k) => FREQ[k] === med.interval) || "毎日";
    const s = {
      name: med.name,
      purpose: med.purpose || "",
      freq: initialFreq,
      interval: med.interval || 1,
      next: med.next,
      remaining: med.remaining ?? 0,
      active: med.active !== false,
    };
    return (
      <Modal title="💊 お薬を編集" onClose={() => setModal(null)}>
        <Inp label="薬名" defaultValue={med.name} onChange={(e) => (s.name = e.target.value)} />
        <Inp label="目的" defaultValue={med.purpose || ""} onChange={(e) => (s.purpose = e.target.value)} />
        <Sel
          label="頻度"
          options={["毎日", "週1回", "月1回", "3ヶ月に1回"]}
          defaultValue={initialFreq}
          onChange={(e) => {
            s.freq = e.target.value;
            s.interval = FREQ[e.target.value] || 1;
          }}
        />
        <Inp label="次回投与日" type="date" defaultValue={med.next} onChange={(e) => (s.next = e.target.value)} />
        <Inp
          label="残り回数"
          type="number"
          defaultValue={med.remaining ?? 0}
          onChange={(e) => (s.remaining = parseInt(e.target.value) || 0)}
        />
        <label
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: T.card2,
            borderRadius: 12,
            marginBottom: 14,
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: T.tx }}>この薬を有効にする</span>
          <input
            type="checkbox"
            defaultChecked={s.active}
            onChange={(e) => (s.active = e.target.checked)}
            style={{ width: 20, height: 20, accentColor: T.ac, cursor: "pointer" }}
          />
        </label>
        <Btn full onClick={() => { if (s.name) editMed(med.id, s); }}>
          保存
        </Btn>
      </Modal>
    );
  }

  if (modal.type === "addPet") {
    const s = { name: "", emoji: "🐾", birth: "", breed: "ミニチュアダックスフンド", sex: "♂ 去勢済" };
    return (
      <Modal title="🐾 ペット追加" onClose={() => setModal(null)}>
        <Inp label="名前" placeholder="例: チョコちゃん" onChange={(e) => (s.name = e.target.value)} />
        <Inp label="絵文字" defaultValue="🐾" onChange={(e) => (s.emoji = e.target.value)} />
        <Inp label="誕生日" type="date" onChange={(e) => (s.birth = e.target.value)} />
        <Inp label="犬種" defaultValue="ミニチュアダックスフンド" onChange={(e) => (s.breed = e.target.value)} />
        <Sel
          label="性別"
          options={["♂ 去勢済", "♂ 未去勢", "♀ 避妊済", "♀ 未避妊"]}
          onChange={(e) => (s.sex = e.target.value)}
        />
        <Btn full onClick={() => { if (s.name && s.birth) addPet(s); }}>追加</Btn>
      </Modal>
    );
  }

  if (modal.type === "editPet" && pet) {
    const s = { name: pet.name, emoji: pet.emoji, birth: pet.birth, breed: pet.breed, sex: pet.sex };
    return (
      <Modal title="✏ プロフィール編集" onClose={() => setModal(null)}>
        <Inp label="名前" defaultValue={pet.name} onChange={(e) => (s.name = e.target.value)} />
        <Inp label="絵文字" defaultValue={pet.emoji} onChange={(e) => (s.emoji = e.target.value)} />
        <Inp label="誕生日" type="date" defaultValue={pet.birth} onChange={(e) => (s.birth = e.target.value)} />
        <Inp label="犬種" defaultValue={pet.breed} onChange={(e) => (s.breed = e.target.value)} />
        <Sel
          label="性別"
          options={["♂ 去勢済", "♂ 未去勢", "♀ 避妊済", "♀ 未避妊"]}
          defaultValue={pet.sex}
          onChange={(e) => (s.sex = e.target.value)}
        />
        <Btn full onClick={() => updatePet(s)}>保存</Btn>
      </Modal>
    );
  }

  return null;
}
