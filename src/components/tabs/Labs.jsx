import { FlaskConical } from "lucide-react";
import { T } from "../../theme";
import { Card, Btn, Sec, Empty, DelBtn, Badge, AddBtn } from "../ui";

function ValueBar({ value, refRange, status }) {
  const m = refRange?.match(/([\d.]+)\s*[-~〜]\s*([\d.]+)/);
  if (!m) return null;
  const lo = parseFloat(m[1]);
  const hi = parseFloat(m[2]);
  const range = hi - lo;
  const pad = range * 0.5;
  const min = lo - pad;
  const max = hi + pad;
  const pct = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  const refLoPct = ((lo - min) / (max - min)) * 100;
  const refHiPct = ((hi - min) / (max - min)) * 100;
  const color = status === "ok" ? T.gn : status === "hi" ? T.rd : T.am;
  return (
    <div
      style={{
        position: "relative",
        height: 6,
        background: T.input,
        borderRadius: 6,
        marginTop: 6,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${refLoPct}%`,
          width: `${refHiPct - refLoPct}%`,
          height: "100%",
          background: T.gnB,
          borderRadius: 6,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -2,
          left: `calc(${pct}% - 5px)`,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: color,
          border: "2px solid #fff",
          boxShadow: `0 1px 3px ${color}66`,
        }}
      />
    </div>
  );
}

export default function Labs({ pet, setModal, delLab }) {
  return (
    <>
      <Sec icon={<FlaskConical size={14} color={T.ac} />} action={<AddBtn onClick={() => setModal({ type: "addLab" })} />}>検査結果</Sec>
      {!pet.labs?.length ? (
        <Empty icon="🔬" text="検査記録はまだありません" />
      ) : (
        pet.labs.map((lab) => {
          const abnormal = lab.results.filter((r) => r.st !== "ok");
          const normal = lab.results.filter((r) => r.st === "ok");
          return (
            <Card key={lab.id}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{lab.type}</div>
                  <div style={{ fontSize: 11, color: T.tx2, marginTop: 1 }}>{lab.date}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Badge text={`異常 ${abnormal.length}`} bg={abnormal.length ? T.rdB : T.gnB} color={abnormal.length ? T.rd : T.gn} />
                  <DelBtn onClick={() => delLab(lab.id)} />
                </div>
              </div>
              {abnormal.map((r, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 0",
                    borderBottom: i < abnormal.length - 1 ? `1px solid ${T.bdr}` : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{r.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: 14, color: r.st === "hi" ? T.rd : T.am }}>
                        {r.val}
                      </span>
                      <span style={{ fontSize: 10, color: T.tx3 }}>{r.unit}</span>
                      <Badge
                        text={r.st === "hi" ? "↑" : "↓"}
                        bg={r.st === "hi" ? T.rdB : T.amB}
                        color={r.st === "hi" ? T.rd : T.am}
                      />
                    </div>
                  </div>
                  <ValueBar value={r.val} refRange={r.ref} status={r.st} />
                  <div style={{ fontSize: 10, color: T.tx3, marginTop: 4 }}>基準値: {r.ref}</div>
                  {r.note && <div style={{ fontSize: 10, color: T.tx2, marginTop: 2 }}>{r.note}</div>}
                </div>
              ))}
              {normal.length > 0 && (
                <details style={{ marginTop: 12 }}>
                  <summary
                    style={{
                      fontSize: 12,
                      color: T.ac,
                      cursor: "pointer",
                      fontWeight: 700,
                      padding: "8px 0",
                    }}
                  >
                    ▼ 基準値内の項目 ({normal.length})
                  </summary>
                  {normal.map((r, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px 0",
                        borderTop: `1px solid ${T.bdr}`,
                        fontSize: 11,
                      }}
                    >
                      <span style={{ color: T.tx2 }}>{r.name}</span>
                      <span style={{ color: T.tx, fontWeight: 600 }}>
                        {r.val} {r.unit}
                      </span>
                    </div>
                  ))}
                </details>
              )}
            </Card>
          );
        })
      )}
    </>
  );
}
