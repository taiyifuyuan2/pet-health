import { Stethoscope } from "lucide-react";
import { T, todayStr } from "../../theme";
import { Card, Btn, Sec, Empty, DelBtn, Badge, AddBtn } from "../ui";

export default function CalendarTab({ pet, setModal, delVisit }) {
  const visits = (pet.visits || []).slice().sort((a, b) => b.date.localeCompare(a.date));
  const today = todayStr();
  return (
    <>
      <Sec icon={<Stethoscope size={14} color={T.ac} />} action={<AddBtn onClick={() => setModal({ type: "addVisit" })} />}>通院記録</Sec>
      {!visits.length ? (
        <Empty icon="🏥" text="通院記録はまだありません" />
      ) : (
        <div style={{ position: "relative", paddingLeft: 24 }}>
          <div
            style={{
              position: "absolute",
              left: 8,
              top: 12,
              bottom: 12,
              width: 2,
              background: T.bdr,
              borderRadius: 2,
            }}
          />
          {visits.map((v) => {
            const past = v.date < today;
            return (
              <div key={v.id} style={{ position: "relative", marginBottom: 14 }}>
                <div
                  style={{
                    position: "absolute",
                    left: -20,
                    top: 18,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: past ? T.ac : T.gn,
                    border: `3px solid ${T.bg}`,
                    boxShadow: `0 0 0 2px ${past ? T.ac : T.gn}`,
                  }}
                />
                <Card style={{ marginBottom: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800 }}>{v.date}</div>
                      <div style={{ fontSize: 11, color: T.tx2, marginTop: 1 }}>{v.clinic}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: T.ac }}>
                        ¥{v.cost.toLocaleString()}
                      </span>
                      <DelBtn onClick={() => delVisit(v.id)} />
                    </div>
                  </div>
                  {v.summary && (
                    <p style={{ fontSize: 12, color: T.tx2, lineHeight: 1.5, marginBottom: 6 }}>
                      {v.summary}
                    </p>
                  )}
                  {v.items?.length > 0 && (
                    <details style={{ marginTop: 4 }}>
                      <summary style={{ fontSize: 11, color: T.ac, cursor: "pointer", fontWeight: 700 }}>
                        ▼ 明細 ({v.items.length})
                      </summary>
                      {v.items.map((it, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "5px 0",
                            fontSize: 11,
                            color: T.tx2,
                            borderTop: i ? `1px solid ${T.bdr}` : "none",
                          }}
                        >
                          <span>{it.n}</span>
                          <span style={{ fontWeight: 600 }}>¥{it.a.toLocaleString()}</span>
                        </div>
                      ))}
                    </details>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
