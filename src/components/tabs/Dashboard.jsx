import {
  Pill, Target, Pencil, Check, Cake, Calendar as CalIcon,
  ListChecks, ChevronRight, Syringe,
} from "lucide-react";
import { T, daysTo, todayStr, calcAge } from "../../theme";
import { Card, Btn, Sec, Empty, DelBtn, Bar, Badge, AddBtn } from "../ui";

function dogToHumanAge(dogAge) {
  if (dogAge <= 0) return 0;
  if (dogAge <= 1) return Math.round(dogAge * 15);
  if (dogAge <= 2) return Math.round(15 + (dogAge - 1) * 9);
  return Math.round(24 + (dogAge - 2) * 4);
}

function daysUntilBirthday(birth) {
  if (!birth) return null;
  const today = new Date(todayStr());
  const b = new Date(birth);
  const next = new Date(today.getFullYear(), b.getMonth(), b.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return Math.ceil((next - today) / 86400000);
}

const KIND_COLORS = {
  med: "#6d5ccd",
  schedule: "#2563eb",
  todo: "#d97706",
  visit: "#059669",
};

function TodoRow({ t, togTodo, delTodo, setModal }) {
  let dueLabel = null, dueColor = null, dueBg = null;
  if (t.due && !t.done) {
    const d = daysTo(t.due);
    if (d < 0) { dueLabel = "期限切れ"; dueColor = T.rd; dueBg = T.rdB; }
    else if (d === 0) { dueLabel = "今日"; dueColor = T.rd; dueBg = T.rdB; }
    else if (d <= 3) { dueLabel = `あと${d}日`; dueColor = T.am; dueBg = T.amB; }
    else { dueLabel = `${d}日後`; dueColor = T.tx2; dueBg = T.input; }
  }
  return (
    <div
      className="cardHover"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: T.card,
        borderRadius: 14,
        padding: "12px 14px",
        marginBottom: 8,
        boxShadow: T.shadow,
        transition: "all .25s",
      }}
    >
      <div
        onClick={() => togTodo(t)}
        className="btnTap"
        style={{
          width: 24,
          height: 24,
          borderRadius: 8,
          flexShrink: 0,
          border: t.done ? "none" : `2px solid ${T.bdr2}`,
          background: t.done ? T.gr : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {t.done && <Check size={14} color="#fff" strokeWidth={3} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          className={t.done ? "tdone" : ""}
          style={{ fontSize: 13, fontWeight: 600, color: T.tx, display: "block" }}
        >
          {t.text}
        </span>
        {t.due && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 10, color: T.tx3 }}>{t.due}</span>
            {dueLabel && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: dueColor,
                  background: dueBg,
                  padding: "2px 6px",
                  borderRadius: 6,
                }}
              >
                {dueLabel}
              </span>
            )}
          </div>
        )}
      </div>
      <button
        onClick={() => setModal({ type: "editTodo", id: t.id })}
        className="btnTap"
        title="編集"
        style={{
          background: "transparent",
          border: "none",
          color: T.tx3,
          cursor: "pointer",
          padding: 6,
          borderRadius: 8,
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <Pencil size={14} />
      </button>
      <DelBtn onClick={() => delTodo(t.id)} />
    </div>
  );
}

function MedReminder({ med, setModal }) {
  const dl = daysTo(med.next);
  const today = dl <= 0;
  return (
    <Card
      glow={today}
      style={{
        background: today ? T.gr : T.card,
        color: today ? "#fff" : T.tx,
        display: "flex",
        alignItems: "center",
        gap: 14,
        border: "none",
        padding: 16,
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          background: today ? "rgba(255,255,255,0.2)" : T.acL,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: today ? "#fff" : T.ac,
        }}
      >
        <Pill size={22} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 800 }}>
          {today ? "今日のお薬！" : `あと ${dl}日`}
        </div>
        <div style={{ fontSize: 11, opacity: 0.85, marginTop: 1 }}>
          {med.name}
          {med.purpose ? ` ・ ${med.purpose}` : ""}
        </div>
      </div>
      {today && (
        <Btn
          small
          onClick={() => setModal({ type: "dose", id: med.id })}
          style={{
            background: "#fff",
            color: T.ac,
            border: "none",
            fontWeight: 800,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Syringe size={14} /> 投与
        </Btn>
      )}
    </Card>
  );
}

function AgeCard({ pet }) {
  const age = calcAge(pet.birth);
  const human = dogToHumanAge(age);
  const dToBd = daysUntilBirthday(pet.birth);
  const lifespan = 15;
  const pct = Math.min((age / lifespan) * 100, 100);
  return (
    <Card style={{ padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: T.tx2, fontWeight: 600 }}>現在</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: T.ac, letterSpacing: "-0.03em", lineHeight: 1 }}>
            {age}
            <span style={{ fontSize: 14, color: T.tx2, fontWeight: 600, marginLeft: 2 }}>歳</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingLeft: 16, borderLeft: `1px solid ${T.bdr}` }}>
          <div style={{ fontSize: 11, color: T.tx2, fontWeight: 600 }}>人間でいうと</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.tx, letterSpacing: "-0.02em" }}>
            {human}
            <span style={{ fontSize: 12, color: T.tx2, fontWeight: 600, marginLeft: 2 }}>歳</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <Bar val={age} max={lifespan} color={T.ac} h={8} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: T.tx3, fontWeight: 600 }}>
          <span>0歳</span>
          <span>平均寿命 {lifespan}歳</span>
        </div>
      </div>
      {dToBd != null && dToBd <= 30 && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 14px",
            borderRadius: 12,
            background: "linear-gradient(135deg,#fff1f2,#fce7f3)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: T.pk,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <Cake size={16} />
          {dToBd === 0 ? "今日は誕生日！🎉" : `誕生日まであと ${dToBd}日！`}
        </div>
      )}
    </Card>
  );
}

function NextEventsCard({ pet, setTab }) {
  const today = todayStr();
  const events = [];
  (pet.meds || []).forEach((m) => {
    if (m.active && m.next && m.next >= today)
      events.push({ date: m.next, kind: "med", title: `${m.name} 投与`, id: `med-${m.id}` });
  });
  (pet.schedule || []).forEach((s) => {
    if (s.date >= today)
      events.push({ date: s.date, kind: "schedule", title: s.label, id: `sch-${s.id}` });
  });
  (pet.todos || []).forEach((t) => {
    if (t.due && !t.done && t.due >= today)
      events.push({ date: t.due, kind: "todo", title: t.text, id: `td-${t.id}` });
  });

  events.sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = events.slice(0, 2);

  if (upcoming.length === 0) return null;

  const fmt = (date) => {
    const d = new Date(date);
    const dow = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
    const days = daysTo(date);
    const suffix = days === 0 ? "今日" : days === 1 ? "明日" : `あと${days}日`;
    return `${d.getMonth() + 1}/${d.getDate()}（${dow}） ${suffix}`;
  };

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div
        style={{
          padding: "14px 16px 6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CalIcon size={16} color={T.ac} />
          <span style={{ fontSize: 13, fontWeight: 800 }}>次の予定</span>
        </div>
        <button
          onClick={() => setTab("cal")}
          className="btnTap"
          style={{
            background: "transparent",
            border: "none",
            color: T.ac,
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          カレンダー <ChevronRight size={14} />
        </button>
      </div>
      <div style={{ padding: "0 16px 14px" }}>
        {upcoming.map((e) => (
          <div
            key={e.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderTop: `1px solid ${T.bdr}`,
              position: "relative",
            }}
          >
            <div
              style={{
                width: 4,
                height: 32,
                borderRadius: 4,
                background: KIND_COLORS[e.kind] || T.ac,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.tx }}>{e.title}</div>
              <div style={{ fontSize: 10, color: T.tx2, marginTop: 2, fontWeight: 600 }}>{fmt(e.date)}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function Dashboard({ pet, lw, tgt, setModal, setTab, togTodo, delTodo }) {
  const activeMeds = (pet.meds || [])
    .filter((m) => m.active && m.next)
    .sort((a, b) => a.next.localeCompare(b.next));

  return (
    <>
      {activeMeds.length > 0 && (
        <div>
          {activeMeds.map((m) => (
            <MedReminder key={m.id} med={m} setModal={setModal} />
          ))}
        </div>
      )}

      {pet.birth && <AgeCard pet={pet} />}

      {lw > 0 && pet.weights?.[0] && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Target size={16} color={T.gn} />
              <span style={{ fontSize: 13, fontWeight: 800 }}>減量プラン</span>
            </div>
            <Badge text={`目標 ${tgt}kg`} bg={T.acL} color={T.ac} />
          </div>
          <Bar
            val={Math.max(pet.weights[0].value - lw, 0)}
            max={Math.max(pet.weights[0].value - tgt, 0.1)}
            color={T.gn}
            h={10}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: T.tx2, fontWeight: 600 }}>
            <span>開始 {pet.weights[0].value}kg</span>
            <span style={{ color: T.gn, fontWeight: 800 }}>現在 {lw}kg</span>
            <span>あと {Math.max(lw - tgt, 0).toFixed(1)}kg</span>
          </div>
          {pet.weights.length >= 2 && (() => {
            const prev = pet.weights[pet.weights.length - 2].value;
            const diff = lw - prev;
            if (diff === 0) return null;
            const c = diff < 0 ? T.gn : T.rd;
            return (
              <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: c }}>
                前回比 {diff > 0 ? "+" : ""}
                {diff.toFixed(1)}kg
              </div>
            );
          })()}
        </Card>
      )}

      <NextEventsCard pet={pet} setTab={setTab} />

      <Sec icon={<ListChecks size={14} color={T.ac} />} action={<AddBtn onClick={() => setModal({ type: "addTodo" })} />}>
        やること
      </Sec>
      {(() => {
        const todos = pet.todos || [];
        const active = todos.filter((t) => !t.done);
        if (active.length === 0) return <Empty text="今やることはありません" />;
        const sorted = active
          .slice()
          .sort((a, b) => {
            if (a.due && b.due) return a.due.localeCompare(b.due);
            if (a.due) return -1;
            if (b.due) return 1;
            return 0;
          })
          .slice(0, 5);
        const more = active.length - sorted.length;
        return (
          <>
            {sorted.map((t) => (
              <TodoRow key={t.id} t={t} togTodo={togTodo} delTodo={delTodo} setModal={setModal} />
            ))}
            {more > 0 && (
              <div style={{ textAlign: "center", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: T.tx3, fontWeight: 600 }}>
                  他 {more} 件
                </span>
              </div>
            )}
          </>
        );
      })()}
    </>
  );
}
