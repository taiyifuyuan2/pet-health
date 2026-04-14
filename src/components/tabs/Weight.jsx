import { T } from "../../theme";
import { Card, Btn, Sec, DelBtn } from "../ui";

export default function Weight({ pet, lw, tgt, setModal, delWeight }) {
  const weights = pet.weights || [];
  const recent = weights.slice(-15);
  const last = weights.length >= 2 ? weights[weights.length - 1].value - weights[weights.length - 2].value : 0;
  const trendColor = last > 0 ? T.rd : last < 0 ? T.gn : T.tx2;
  const trendIc = last > 0 ? "▲" : last < 0 ? "▼" : "—";

  // Chart bounds
  const allValues = recent.map((w) => w.value);
  const min = Math.min(...allValues, tgt) - 0.3;
  const max = Math.max(...allValues, tgt) + 0.3;
  const W = 320, H = 180;
  const padX = 28, padY = 24;
  const innerW = W - padX * 2, innerH = H - padY * 2;
  const x = (i) => padX + (recent.length === 1 ? innerW / 2 : (i * innerW) / (recent.length - 1));
  const y = (v) => padY + innerH - ((v - min) / (max - min)) * innerH;
  const tgtY = y(tgt);
  const path = recent.map((w, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(w.value)}`).join(" ");
  const area = recent.length
    ? `${path} L${x(recent.length - 1)},${padY + innerH} L${padX},${padY + innerH} Z`
    : "";

  return (
    <>
      <Card glow style={{ textAlign: "center", padding: 24 }}>
        <div style={{ fontSize: 11, color: T.tx2, fontWeight: 600, marginBottom: 4 }}>現在の体重</div>
        <div style={{ fontSize: 44, fontWeight: 800, color: T.ac, letterSpacing: "-0.03em", lineHeight: 1 }}>
          {lw}
          <span style={{ fontSize: 16, color: T.tx2, marginLeft: 4, fontWeight: 600 }}>kg</span>
        </div>
        {last !== 0 && (
          <div style={{ marginTop: 8, fontSize: 12, color: trendColor, fontWeight: 700 }}>
            {trendIc} {Math.abs(last).toFixed(1)}kg 前回比
          </div>
        )}
        <div
          style={{
            marginTop: 14,
            padding: "10px 14px",
            borderRadius: 12,
            background: lw > tgt ? T.amB : T.gnB,
            display: "inline-block",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: lw > tgt ? T.am : T.gn }}>
            🎯 目標 {tgt}kg ・ あと {Math.abs(lw - tgt).toFixed(1)}kg
          </span>
        </div>
      </Card>

      {recent.length > 1 && (
        <Card>
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            📈 体重推移
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 200 }}>
            <defs>
              <linearGradient id="wtArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.ac} stopOpacity="0.3" />
                <stop offset="100%" stopColor={T.ac} stopOpacity="0" />
              </linearGradient>
            </defs>
            <line
              x1={padX}
              y1={tgtY}
              x2={W - padX}
              y2={tgtY}
              stroke={T.gn}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text x={W - padX} y={tgtY - 4} textAnchor="end" fontSize="9" fill={T.gn} fontWeight="700">
              目標 {tgt}kg
            </text>
            <path d={area} fill="url(#wtArea)" />
            <path d={path} fill="none" stroke={T.ac} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {recent.map((w, i) => (
              <g key={i}>
                <circle cx={x(i)} cy={y(w.value)} r="4" fill={T.card} stroke={T.ac} strokeWidth="2.5" />
                <text x={x(i)} y={y(w.value) - 10} textAnchor="middle" fontSize="9" fontWeight="700" fill={T.ac}>
                  {w.value}
                </text>
                <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="8" fill={T.tx3}>
                  {w.date.slice(5)}
                </text>
              </g>
            ))}
          </svg>
        </Card>
      )}

      <Sec icon="⚖" action={<Btn small v="gh" onClick={() => setModal({ type: "addWeight" })}>＋記録</Btn>}>記録履歴</Sec>
      {[...weights].reverse().map((w, i, arr) => {
        const prev = arr[i + 1];
        const diff = prev ? w.value - prev.value : 0;
        const dColor = diff > 0 ? T.rd : diff < 0 ? T.gn : T.tx3;
        return (
          <Card
            key={w.id || i}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", marginBottom: 8 }}
          >
            <span style={{ fontSize: 12, color: T.tx2, fontWeight: 600 }}>{w.date}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {prev && (
                <span style={{ fontSize: 10, color: dColor, fontWeight: 700 }}>
                  {diff > 0 ? "+" : ""}
                  {diff.toFixed(1)}kg
                </span>
              )}
              <span style={{ fontSize: 15, fontWeight: 800, color: w.value > tgt ? T.am : T.gn }}>
                {w.value}kg
              </span>
              <DelBtn onClick={() => delWeight(w.id)} />
            </div>
          </Card>
        );
      })}
    </>
  );
}
