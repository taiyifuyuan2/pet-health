import {
  Stethoscope, AlertTriangle, Coins, Target, Pill,
  Heart, Droplets, Bone, Zap, CircleDot, Ruler,
  Plus, Pencil, Check,
} from "lucide-react";
import { T, daysTo, todayStr } from "../../theme";
import { Card, Btn, Sec, Empty, DelBtn, Bar, Badge, IconCircle, IconBubble, AddBtn } from "../ui";

function conditionIcon(name) {
  if (/心/.test(name)) return { Ic: Heart, color: "#e11d48" };
  if (/脂/.test(name)) return { Ic: Droplets, color: "#ca8a04" };
  if (/ヘルニア|椎間板|骨/.test(name)) return { Ic: Bone, color: "#6d5ccd" };
  if (/電解質/.test(name)) return { Ic: Zap, color: "#0891b2" };
  if (/血小板|血/.test(name)) return { Ic: CircleDot, color: "#db2777" };
  if (/肥満|減量/.test(name)) return { Ic: Ruler, color: "#ea580c" };
  return { Ic: Stethoscope, color: T.ac };
}

function TodoRow({ t, togTodo, delTodo, setModal }) {
  let dueLabel = null, dueColor = null, dueBg = null;
  if (t.due && !t.done) {
    const d = daysTo(t.due);
    if (d < 0) {
      dueLabel = "期限切れ";
      dueColor = T.rd;
      dueBg = T.rdB;
    } else if (d === 0) {
      dueLabel = "今日";
      dueColor = T.rd;
      dueBg = T.rdB;
    } else if (d <= 3) {
      dueLabel = `あと${d}日`;
      dueColor = T.am;
      dueBg = T.amB;
    } else {
      dueLabel = `${d}日後`;
      dueColor = T.tx2;
      dueBg = T.input;
    }
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
          transition: "all .2s",
        }}
      >
        {t.done && <Check size={14} color="#fff" strokeWidth={3} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          className={t.done ? "tdone" : ""}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: T.tx,
            display: "block",
          }}
        >
          {t.text}
        </span>
        {t.due && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 10, color: T.tx3 }}>📅 {t.due}</span>
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

export default function Dashboard({ pet, abnC, totCost, lw, tgt, nextMed, nextDays, setModal, togTodo, delTodo, delCondition }) {
  const sevColor = (sev) => {
    if (!sev) return T.tx3;
    if (sev.includes("重") || sev.includes("緊")) return T.rd;
    if (sev.includes("経過") || sev.includes("注意")) return T.am;
    return T.bl;
  };

  return (
    <>
      {nextMed && nextDays !== null && (
        <Card
          glow
          style={{
            background: nextDays <= 0 ? T.gr : `linear-gradient(135deg,${T.acL},${T.card})`,
            color: nextDays <= 0 ? "#fff" : T.tx,
            display: "flex",
            alignItems: "center",
            gap: 14,
            border: "none",
            padding: 18,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: nextDays <= 0 ? "rgba(255,255,255,0.2)" : T.card,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: nextDays <= 0 ? "none" : T.shadow,
              color: nextDays <= 0 ? "#fff" : T.ac,
            }}
          >
            <Pill size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 2 }}>
              {nextDays <= 0 ? "今日のお薬！" : `次のお薬まで ${nextDays}日`}
            </div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>{nextMed.name}</div>
          </div>
          {nextDays <= 0 && (
            <Btn
              small
              v="gh"
              onClick={() => setModal({ type: "dose", id: nextMed.id })}
              style={{ background: "#fff", color: T.ac, border: "none", fontWeight: 800 }}
            >
              投与記録
            </Btn>
          )}
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 4 }}>
        {[
          { Ic: Stethoscope, v: pet.conditions?.length || 0, l: "診断", c: T.rd, bg: "#fee2e2" },
          { Ic: AlertTriangle, v: abnC, l: "異常値", c: T.am, bg: "#fef3c7" },
          { Ic: Coins, v: totCost > 0 ? `¥${(totCost / 1000).toFixed(0)}K` : "¥0", l: "累計", c: T.gn, bg: "#d1fae5" },
        ].map((s, i) => (
          <Card key={i} style={{ textAlign: "center", padding: "16px 8px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <IconBubble bg={s.bg} size={40}>
                <s.Ic size={20} color={s.c} />
              </IconBubble>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.c, letterSpacing: "-0.02em" }}>{s.v}</div>
            <div style={{ fontSize: 10, color: T.tx2, marginTop: 2, fontWeight: 600 }}>{s.l}</div>
          </Card>
        ))}
      </div>

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
        </Card>
      )}

      <Sec icon="🏥" action={<AddBtn onClick={() => setModal({ type: "addCondition" })} />}>診断</Sec>
      {!pet.conditions?.length ? (
        <Empty icon="📋" text="診断記録はまだありません" />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {pet.conditions.map((c) => {
            const ci = conditionIcon(c.name);
            return (
              <Card key={c.id} accent={sevColor(c.sev)} style={{ padding: 14, marginBottom: 0 }}>
                <div style={{ position: "absolute", top: 6, right: 6 }}>
                  <DelBtn onClick={() => delCondition(c.id)} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, paddingRight: 18 }}>
                  <ci.Ic size={16} color={ci.color} />
                  <div style={{ fontSize: 13, fontWeight: 800 }}>{c.name}</div>
                </div>
                <Badge text={c.sev} bg={`${sevColor(c.sev)}18`} color={sevColor(c.sev)} />
                {c.note && <p style={{ fontSize: 10, color: T.tx2, marginTop: 6, lineHeight: 1.4 }}>{c.note}</p>}
              </Card>
            );
          })}
        </div>
      )}

      <Sec icon="✅" action={<AddBtn onClick={() => setModal({ type: "addTodo" })} />}>やること</Sec>
      {(() => {
        const todos = pet.todos || [];
        if (!todos.length) return <Empty icon="✨" text="今やることはありません" />;
        const active = todos.filter((t) => !t.done);
        const done = todos.filter((t) => t.done);
        const withDue = active
          .filter((t) => t.due)
          .sort((a, b) => a.due.localeCompare(b.due));
        const noDue = active.filter((t) => !t.due);
        return (
          <>
            {withDue.length > 0 && (
              <>
                <div style={{ fontSize: 11, color: T.tx3, fontWeight: 700, marginBottom: 6, marginTop: 4 }}>📅 期日あり</div>
                {withDue.map((t) => (
                  <TodoRow key={t.id} t={t} togTodo={togTodo} delTodo={delTodo} setModal={setModal} />
                ))}
              </>
            )}
            {noDue.length > 0 && (
              <>
                {withDue.length > 0 && (
                  <div style={{ fontSize: 11, color: T.tx3, fontWeight: 700, marginBottom: 6, marginTop: 12 }}>その他</div>
                )}
                {noDue.map((t) => (
                  <TodoRow key={t.id} t={t} togTodo={togTodo} delTodo={delTodo} setModal={setModal} />
                ))}
              </>
            )}
            {done.length > 0 && (
              <>
                <div style={{ fontSize: 11, color: T.tx3, fontWeight: 700, marginBottom: 6, marginTop: 12 }}>
                  完了済み ({done.length})
                </div>
                {done.map((t) => (
                  <TodoRow key={t.id} t={t} togTodo={togTodo} delTodo={delTodo} setModal={setModal} />
                ))}
              </>
            )}
          </>
        );
      })()}
    </>
  );
}
