import { useState, useRef } from "react";
import { Phone, Upload } from "lucide-react";
import { Modal, Inp, Sel, Btn } from "./ui";
import { T, todayStr } from "../theme";

function AddDocumentBody({ addDocument, setModal }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("rabies");
  const [date, setDate] = useState(todayStr());
  const [note, setNote] = useState("");
  const inputRef = useRef(null);
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };
  const TYPE_OPTIONS = {
    "狂犬病ワクチン": "rabies",
    "混合ワクチン": "combo",
    "血統書": "pedigree",
    "保険証": "insurance",
    "その他": "other",
  };
  return (
    <Modal title="📋 書類を追加" onClose={() => setModal(null)}>
      <div
        onClick={() => inputRef.current?.click()}
        className="btnTap"
        style={{
          border: `2px dashed ${T.bdr2}`,
          borderRadius: 14,
          padding: 20,
          textAlign: "center",
          cursor: "pointer",
          marginBottom: 14,
          background: T.card2,
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt=""
            style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 10 }}
          />
        ) : (
          <div style={{ color: T.tx3 }}>
            <Upload size={28} style={{ marginBottom: 6 }} />
            <div style={{ fontSize: 12, fontWeight: 600 }}>タップして写真を選択</div>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: "none" }}
      />
      <Inp label="書類名" placeholder="例: 狂犬病予防接種証明書 2026" value={name} onChange={(e) => setName(e.target.value)} />
      <Sel
        label="種類"
        options={Object.keys(TYPE_OPTIONS)}
        onChange={(e) => setType(TYPE_OPTIONS[e.target.value] || "other")}
      />
      <Inp label="日付" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <Inp label="メモ（任意）" placeholder="補足情報" value={note} onChange={(e) => setNote(e.target.value)} />
      <Btn
        full
        onClick={() => {
          if (!name) return;
          addDocument({ name, type, date, note }, file);
        }}
      >
        保存
      </Btn>
    </Modal>
  );
}

export default function Modals({
  modal,
  setModal,
  pet,
  pets = [],
  recordDose,
  addTodo,
  editTodo,
  addCondition,
  addMed,
  editMed,
  addFood,
  addWeight,
  addVisit,
  addSchedule,
  addCalendarEvent,
  addLab,
  addPet,
  updatePet,
  updateTargetWeight,
  editClinic,
  addContact,
  editContact,
  emergencyContacts = [],
  addDocument,
  lw,
  tgt,
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
    const s = { text: "", due: "" };
    return (
      <Modal title="✅ やること追加" onClose={() => setModal(null)}>
        <Inp label="内容" placeholder="例: 歯科チェック" onChange={(e) => (s.text = e.target.value)} />
        <Inp label="期日（任意）" type="date" onChange={(e) => (s.due = e.target.value)} />
        <Btn full onClick={() => { addTodo(s.text, s.due); setModal(null); }}>追加</Btn>
      </Modal>
    );
  }

  if (modal.type === "editTodo") {
    const todo = pet?.todos?.find((t) => t.id === modal.id);
    if (!todo) return null;
    const s = { text: todo.text, due: todo.due || "" };
    return (
      <Modal title="✅ やること編集" onClose={() => setModal(null)}>
        <Inp label="内容" defaultValue={todo.text} onChange={(e) => (s.text = e.target.value)} />
        <Inp label="期日（任意）" type="date" defaultValue={todo.due || ""} onChange={(e) => (s.due = e.target.value)} />
        <Btn full onClick={() => { if (s.text) editTodo(todo.id, s); }}>保存</Btn>
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

  if (modal.type === "addCalendarEvent") {
    const petOptions = ["全員", ...pets.map((p) => p.name)];
    const s = {
      date: todayStr(),
      title: "",
      kind: "予防",
      petName: pets[0]?.name || "全員",
      note: "",
    };
    return (
      <Modal title="📅 予定追加" onClose={() => setModal(null)}>
        <Inp label="日付" type="date" defaultValue={todayStr()} onChange={(e) => (s.date = e.target.value)} />
        <Inp label="タイトル" placeholder="例: 狂犬病ワクチン" onChange={(e) => (s.title = e.target.value)} />
        <Sel
          label="種類"
          options={["予防", "通院", "お薬", "その他"]}
          onChange={(e) => (s.kind = e.target.value)}
        />
        <Sel label="対象ペット" options={petOptions} onChange={(e) => (s.petName = e.target.value)} />
        <Inp label="メモ（任意）" placeholder="補足情報" onChange={(e) => (s.note = e.target.value)} />
        <Btn
          full
          onClick={() => {
            if (!s.date || !s.title) return;
            const label = s.note ? `${s.title}（${s.note}）` : s.title;
            const targetIds =
              s.petName === "全員"
                ? pets.map((p) => p.id)
                : [pets.find((p) => p.name === s.petName)?.id].filter(Boolean);
            addCalendarEvent({ date: s.date, label, petIds: targetIds });
            setModal(null);
          }}
        >
          追加
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

  if (modal.type === "addContact") {
    const s = { name: "", tel: "", note: "" };
    return (
      <Modal title="🚨 緊急連絡先を追加" onClose={() => setModal(null)}>
        <Inp label="名称" placeholder="例: ペット中毒110番" onChange={(e) => (s.name = e.target.value)} />
        <Inp label="電話番号" type="tel" placeholder="例: 072-726-9923" onChange={(e) => (s.tel = e.target.value)} />
        <Inp label="メモ（任意）" placeholder="24時間対応など" onChange={(e) => (s.note = e.target.value)} />
        <Btn full onClick={() => { if (s.name && s.tel) addContact(s); }}>追加</Btn>
      </Modal>
    );
  }

  if (modal.type === "editContact") {
    const c = emergencyContacts.find((x) => x.id === modal.id);
    if (!c) return null;
    const s = { name: c.name, tel: c.tel, note: c.note || "" };
    return (
      <Modal title="🚨 緊急連絡先を編集" onClose={() => setModal(null)}>
        <Inp label="名称" defaultValue={c.name} onChange={(e) => (s.name = e.target.value)} />
        <Inp label="電話番号" type="tel" defaultValue={c.tel} onChange={(e) => (s.tel = e.target.value)} />
        <Inp label="メモ（任意）" defaultValue={c.note || ""} onChange={(e) => (s.note = e.target.value)} />
        <Btn full onClick={() => { if (s.name && s.tel) editContact(c.id, s); }}>保存</Btn>
      </Modal>
    );
  }

  if (modal.type === "emergencyList") {
    return (
      <Modal title="🚨 緊急連絡先" onClose={() => setModal(null)}>
        {emergencyContacts.length === 0 ? (
          <div style={{ textAlign: "center", padding: 30, color: T.tx3 }}>
            緊急連絡先が登録されていません
          </div>
        ) : (
          emergencyContacts.map((c) => (
            <a
              key={c.id}
              href={`tel:${c.tel}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                background: T.rdB,
                borderRadius: 14,
                marginBottom: 10,
                textDecoration: "none",
                color: T.tx,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: T.rd,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Phone size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.tx }}>{c.name}</div>
                <div style={{ fontSize: 12, color: T.rd, fontWeight: 700, marginTop: 2 }}>{c.tel}</div>
                {c.note && (
                  <div style={{ fontSize: 10, color: T.tx2, marginTop: 2 }}>{c.note}</div>
                )}
              </div>
            </a>
          ))
        )}
      </Modal>
    );
  }

  if (modal.type === "addDocument") {
    return (
      <AddDocumentBody addDocument={addDocument} setModal={setModal} />
    );
  }

  if (modal.type === "editClinic" && pet) {
    const s = {
      name: pet.clinic_name || "",
      address: pet.clinic_address || "",
      tel: pet.clinic_tel || "",
    };
    return (
      <Modal title="🏥 かかりつけ医を編集" onClose={() => setModal(null)}>
        <Inp label="病院名" defaultValue={s.name} onChange={(e) => (s.name = e.target.value)} />
        <Inp label="住所" defaultValue={s.address} onChange={(e) => (s.address = e.target.value)} />
        <Inp label="電話番号" type="tel" defaultValue={s.tel} onChange={(e) => (s.tel = e.target.value)} />
        <Btn full onClick={() => editClinic(s)}>保存</Btn>
      </Modal>
    );
  }

  if (modal.type === "editTargetWeight") {
    let v = String(tgt ?? 5.0);
    return (
      <Modal title="🎯 減量目標を設定" onClose={() => setModal(null)}>
        {lw > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: T.card2,
              borderRadius: 12,
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 12, color: T.tx2, fontWeight: 600 }}>現在の体重</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: T.tx }}>{lw}kg</span>
          </div>
        )}
        <Inp
          label="目標体重 (kg)"
          type="number"
          step="0.1"
          defaultValue={String(tgt ?? 5.0)}
          onChange={(e) => (v = e.target.value)}
        />
        <div
          style={{
            padding: "10px 14px",
            background: T.acL,
            borderRadius: 12,
            marginBottom: 14,
            fontSize: 11,
            color: T.tx2,
            lineHeight: 1.6,
            fontWeight: 500,
          }}
        >
          <strong style={{ color: T.ac }}>参考：</strong>
          <br />
          ミニチュアダックスフンドの適正体重は <strong>4.5〜5.0kg</strong> 前後です。
        </div>
        <Btn full onClick={() => updateTargetWeight(v)}>
          保存
        </Btn>
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
