import { T, daysTo } from "../../theme";
import { Card, Btn, Sec, Empty, DelBtn, Bar, Badge, IconCircle } from "../ui";

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
              fontSize: 24,
              flexShrink: 0,
              boxShadow: nextDays <= 0 ? "none" : T.shadow,
            }}
          >
            💊
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
          { ic: "🩺", v: pet.conditions?.length || 0, l: "診断", c: T.rd },
          { ic: "⚠️", v: abnC, l: "異常値", c: T.am },
          { ic: "💰", v: totCost > 0 ? `¥${(totCost / 1000).toFixed(0)}K` : "¥0", l: "累計", c: T.cy },
        ].map((s, i) => (
          <Card key={i} style={{ textAlign: "center", padding: "16px 8px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <IconCircle color={s.c} size={36}>{s.ic}</IconCircle>
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
              <span style={{ fontSize: 16 }}>🎯</span>
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

      <Sec icon="🏥" action={<Btn small v="gh" onClick={() => setModal({ type: "addCondition" })}>＋追加</Btn>}>診断</Sec>
      {!pet.conditions?.length ? (
        <Empty icon="📋" text="診断記録はまだありません" />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {pet.conditions.map((c) => (
            <Card key={c.id} accent={sevColor(c.sev)} style={{ padding: 14, marginBottom: 0 }}>
              <div style={{ position: "absolute", top: 6, right: 6 }}>
                <DelBtn onClick={() => delCondition(c.id)} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6, paddingRight: 18 }}>{c.name}</div>
              <Badge text={c.sev} bg={`${sevColor(c.sev)}18`} color={sevColor(c.sev)} />
              {c.note && <p style={{ fontSize: 10, color: T.tx2, marginTop: 6, lineHeight: 1.4 }}>{c.note}</p>}
            </Card>
          ))}
        </div>
      )}

      <Sec icon="✅" action={<Btn small v="gh" onClick={() => setModal({ type: "addTodo" })}>＋追加</Btn>}>やること</Sec>
      {!pet.todos?.length ? (
        <Empty icon="✨" text="今やることはありません" />
      ) : (
        pet.todos.map((t) => (
          <div
            key={t.id}
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
              {t.done && <span style={{ color: "#fff", fontSize: 13, fontWeight: 800 }}>✓</span>}
            </div>
            <span
              className={t.done ? "tdone" : ""}
              style={{
                flex: 1,
                fontSize: 13,
                fontWeight: 600,
                color: T.tx,
              }}
            >
              {t.text}
            </span>
            <DelBtn onClick={() => delTodo(t.id)} />
          </div>
        ))
      )}
    </>
  );
}
