import { T, daysTo } from "../../theme";
import { Card, Btn, Sec, Empty, DelBtn, Badge, IconCircle } from "../ui";

export default function Meds({ pet, setModal, delMed, delSchedule }) {
  return (
    <>
      <Sec icon="💊" action={<Btn small v="gh" onClick={() => setModal({ type: "addMed" })}>＋追加</Btn>}>お薬・予防</Sec>
      {!pet.meds?.length ? (
        <Empty icon="💊" text="お薬の登録はまだありません" />
      ) : (
        pet.meds.map((m) => {
          const dl = daysTo(m.next);
          const now = dl <= 0;
          const lowStock = m.remaining != null && m.remaining <= 3;
          return (
            <Card
              key={m.id}
              bc={now ? `${T.rd}55` : lowStock ? `${T.am}55` : undefined}
              style={{
                background: now ? T.rdB : T.card,
                ...(now ? { borderWidth: 2 } : {}),
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ display: "flex", gap: 12, flex: 1, minWidth: 0 }}>
                  <IconCircle color={now ? T.rd : T.ac} size={42}>💊</IconCircle>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: T.tx }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: T.tx2, marginTop: 1 }}>{m.purpose}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  {m.active && (
                    <Btn small v={now ? "pri" : "gh"} onClick={() => setModal({ type: "dose", id: m.id })}>
                      {now ? "投与記録" : "記録"}
                    </Btn>
                  )}
                  <DelBtn onClick={() => delMed(m.id)} />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: `1px solid ${T.bdr}`,
                  flexWrap: "wrap",
                }}
              >
                <Badge text={`📅 ${m.freq}`} bg={T.input} color={T.tx2} />
                <Badge
                  text={now ? "🔔 今日！" : `次回 ${dl}日後`}
                  bg={now ? `${T.rd}18` : T.gnB}
                  color={now ? T.rd : T.gn}
                />
                {m.remaining != null && (
                  <Badge
                    text={`残り ${m.remaining}回`}
                    bg={lowStock ? `${T.am}18` : T.input}
                    color={lowStock ? T.am : T.tx2}
                  />
                )}
              </div>
            </Card>
          );
        })
      )}

      <Sec icon="📋" action={<Btn small v="gh" onClick={() => setModal({ type: "addSchedule" })}>＋追加</Btn>}>予防スケジュール</Sec>
      {!pet.schedule?.length ? (
        <Empty icon="📅" text="予定はまだありません" />
      ) : (
        pet.schedule
          .slice()
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((s) => {
            const d = daysTo(s.date);
            const soon = d <= 7;
            return (
              <Card key={s.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 12,
                    background: soon ? T.rdB : T.acL,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 800, color: soon ? T.rd : T.ac, lineHeight: 1 }}>
                    {parseInt(s.date.slice(8))}
                  </span>
                  <span style={{ fontSize: 9, color: soon ? T.rd : T.ac, marginTop: 2, fontWeight: 700 }}>
                    {parseInt(s.date.slice(5, 7))}月
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: T.tx3, marginTop: 2 }}>{s.date}</div>
                </div>
                <Badge text={d <= 0 ? "今日" : `${d}日後`} bg={soon ? T.rdB : T.acL} color={soon ? T.rd : T.ac} />
                <DelBtn onClick={() => delSchedule(s.id)} />
              </Card>
            );
          })
      )}
    </>
  );
}
