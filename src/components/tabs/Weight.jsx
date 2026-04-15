import { Scale, Target, TrendingUp, TrendingDown, Plus, BarChart3 } from "lucide-react";
import { T } from "../../theme";
import { Card, Btn, Sec, DelBtn } from "../ui";

function analyzeTrend(weights, targetWeight) {
  if (weights.length < 2) return null;
  const latest = weights[weights.length - 1];
  const first = weights[0];
  const now = new Date();

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekData = weights.filter((w) => new Date(w.date) >= weekAgo);
  const weekChange = weekData.length >= 2 ? latest.value - weekData[0].value : null;

  const monthAgo = new Date(now);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const monthData = weights.filter((w) => new Date(w.date) >= monthAgo);
  const monthChange = monthData.length >= 2 ? latest.value - monthData[0].value : null;

  const totalChange = latest.value - first.value;
  const totalDays = (new Date(latest.date) - new Date(first.date)) / 86400000;
  const monthlyRate = totalDays > 0 ? (totalChange / totalDays) * 30 : 0;

  const remaining = latest.value - targetWeight;
  const monthsToGoal =
    monthlyRate < 0 && remaining > 0 ? Math.ceil(remaining / Math.abs(monthlyRate)) : null;

  return { first, latest, weekChange, monthChange, totalChange, monthlyRate, monthsToGoal, remaining };
}

function TrendCell({ label, value }) {
  if (value === null || value === undefined) {
    return (
      <div style={{ flex: 1, padding: "12px 10px", background: T.card2, borderRadius: 12, textAlign: "center" }}>
        <div style={{ fontSize: 10, color: T.tx3, fontWeight: 600, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 13, color: T.tx3, fontWeight: 700 }}>—</div>
      </div>
    );
  }
  const color = value > 0 ? T.rd : value < 0 ? T.gn : T.tx3;
  const bg = value > 0 ? T.rdB : value < 0 ? T.gnB : T.input;
  const Ic = value > 0 ? TrendingUp : value < 0 ? TrendingDown : null;
  return (
    <div style={{ flex: 1, padding: "12px 10px", background: bg, borderRadius: 12, textAlign: "center" }}>
      <div style={{ fontSize: 10, color: T.tx3, fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div
        style={{
          fontSize: 14,
          color,
          fontWeight: 800,
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {Ic && <Ic size={13} />}
        {value > 0 ? "+" : ""}
        {value.toFixed(1)}kg
      </div>
    </div>
  );
}

export default function Weight({ pet, lw, tgt, setModal, delWeight }) {
  const weights = pet.weights || [];
  const recent = weights.slice(-15);
  const last = weights.length >= 2 ? weights[weights.length - 1].value - weights[weights.length - 2].value : 0;
  const trendColor = last > 0 ? T.rd : last < 0 ? T.gn : T.tx2;
  const TrendIc = last > 0 ? TrendingUp : last < 0 ? TrendingDown : null;

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
        {last !== 0 && TrendIc && (
          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: trendColor,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <TrendIc size={14} /> {Math.abs(last).toFixed(1)}kg 前回比
          </div>
        )}
        <div
          style={{
            marginTop: 14,
            padding: "10px 14px",
            borderRadius: 12,
            background: lw > tgt ? T.amB : T.gnB,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Target size={14} color={lw > tgt ? T.am : T.gn} />
          <span style={{ fontSize: 12, fontWeight: 700, color: lw > tgt ? T.am : T.gn }}>
            目標 {tgt}kg ・ あと {Math.abs(lw - tgt).toFixed(1)}kg
          </span>
        </div>
      </Card>

      {recent.length > 1 && (
        <Card>
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <TrendingUp size={16} color={T.ac} /> 体重推移
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

      {(() => {
        const t = analyzeTrend(weights, tgt);
        if (!t) return null;
        return (
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <BarChart3 size={16} color={T.ac} />
              <span style={{ fontSize: 13, fontWeight: 800 }}>トレンド分析</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <TrendCell label="直近1週間" value={t.weekChange} />
              <TrendCell label="直近1ヶ月" value={t.monthChange} />
            </div>
            <div
              style={{
                padding: "12px 14px",
                background: T.card2,
                borderRadius: 12,
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 10, color: T.tx3, fontWeight: 600, marginBottom: 4 }}>
                累計変化
              </div>
              <div style={{ fontSize: 12, color: T.tx, fontWeight: 700 }}>
                開始 {t.first.value}kg → 現在 {t.latest.value}kg
                <span
                  style={{
                    marginLeft: 8,
                    color: t.totalChange > 0 ? T.rd : t.totalChange < 0 ? T.gn : T.tx3,
                    fontWeight: 800,
                  }}
                >
                  ({t.totalChange > 0 ? "+" : ""}
                  {t.totalChange.toFixed(1)}kg)
                </span>
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                background: T.card2,
                borderRadius: 12,
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 10, color: T.tx3, fontWeight: 600, marginBottom: 4 }}>
                減量ペース
              </div>
              <div style={{ fontSize: 12, color: T.tx, fontWeight: 700 }}>
                月あたり平均{" "}
                <span style={{ color: t.monthlyRate < 0 ? T.gn : t.monthlyRate > 0 ? T.rd : T.tx3 }}>
                  {t.monthlyRate > 0 ? "+" : ""}
                  {t.monthlyRate.toFixed(2)}kg
                </span>
              </div>
            </div>
            {t.monthsToGoal != null && (
              <div
                style={{
                  padding: "12px 14px",
                  background: T.gnB,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Target size={14} color={T.gn} />
                <span style={{ fontSize: 12, fontWeight: 700, color: T.gn }}>
                  このペースであと約 {t.monthsToGoal}ヶ月で目標達成
                </span>
              </div>
            )}
            {t.remaining <= 0 && (
              <div
                style={{
                  padding: "12px 14px",
                  background: T.gnB,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Target size={14} color={T.gn} />
                <span style={{ fontSize: 12, fontWeight: 700, color: T.gn }}>
                  🎉 目標達成おめでとう！
                </span>
              </div>
            )}
          </Card>
        );
      })()}

      <Sec
        icon={<Scale size={14} color={T.ac} />}
        action={
          <Btn
            small
            v="gh"
            onClick={() => setModal({ type: "addWeight" })}
            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <Plus size={14} /> 記録
          </Btn>
        }
      >
        記録履歴
      </Sec>
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
