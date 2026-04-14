import { T } from "../../theme";
import { Card, Bar } from "../ui";

const CATS = [
  { name: "検査", match: /検査|血液|SDMA|スナップ/, color: T.bl },
  { name: "画像", match: /レントゲン|エコー|MRI/, color: T.cy },
  { name: "処置", match: /点滴|ビタミン|強肝|処置/, color: T.gn },
  { name: "薬", match: /アンチ|イベル|ブラベクト|薬/, color: T.ac },
  { name: "他", match: /.*/, color: T.tx3 },
];

const catOf = (name) => {
  for (const c of CATS) if (c.match.test(name)) return c;
  return CATS[CATS.length - 1];
};

export default function Cost({ pet, totCost }) {
  const allCats = {};
  (pet.visits || []).forEach((v) => {
    (v.items || []).forEach((it) => {
      const c = catOf(it.n);
      allCats[c.name] = (allCats[c.name] || 0) + it.a;
    });
  });
  const totalCat = Object.values(allCats).reduce((s, v) => s + v, 0);

  // donut
  const r = 50, cx = 80, cy = 80;
  const C = 2 * Math.PI * r;
  let acc = 0;
  const segments = Object.entries(allCats).map(([n, v]) => {
    const cat = CATS.find((c) => c.name === n);
    const len = (v / Math.max(totalCat, 1)) * C;
    const seg = { color: cat.color, dasharray: `${len} ${C - len}`, dashoffset: -acc, name: n, value: v };
    acc += len;
    return seg;
  });

  return (
    <>
      <Card glow style={{ textAlign: "center", padding: 24 }}>
        <div style={{ fontSize: 11, color: T.tx2, fontWeight: 600, marginBottom: 6 }}>累計医療費</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: T.ac, letterSpacing: "-0.03em", lineHeight: 1 }}>
          ¥{totCost.toLocaleString()}
        </div>
        <div style={{ fontSize: 11, color: T.tx2, marginTop: 6, fontWeight: 600 }}>
          通院 {pet.visits?.length || 0} 回
        </div>
      </Card>

      {totalCat > 0 && (
        <Card>
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14 }}>📊 カテゴリ別</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.input} strokeWidth="18" />
              {segments.map((s, i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="18"
                  strokeDasharray={s.dasharray}
                  strokeDashoffset={s.dashoffset}
                  transform={`rotate(-90 ${cx} ${cy})`}
                />
              ))}
              <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={T.tx}>
                ¥{(totalCat / 1000).toFixed(0)}K
              </text>
            </svg>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              {segments
                .slice()
                .sort((a, b) => b.value - a.value)
                .map((s) => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background: s.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1, color: T.tx2, fontWeight: 600 }}>{s.name}</span>
                    <span style={{ fontWeight: 700, color: T.tx }}>
                      ¥{s.value.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      )}

      {(pet.visits || []).map((v) => {
        const cats = {};
        (v.items || []).forEach((it) => {
          const c = catOf(it.n);
          cats[c.name] = (cats[c.name] || 0) + it.a;
        });
        const mx = Math.max(...Object.values(cats), 1);
        return (
          <Card key={v.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.tx2 }}>{v.date}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: T.ac }}>
                ¥{v.cost.toLocaleString()}
              </span>
            </div>
            {Object.entries(cats)
              .sort((a, b) => b[1] - a[1])
              .map(([c, a], i) => {
                const cat = CATS.find((x) => x.name === c);
                return (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                      <span style={{ color: T.tx2, fontWeight: 600 }}>{c}</span>
                      <span style={{ fontWeight: 600 }}>¥{a.toLocaleString()}</span>
                    </div>
                    <Bar val={a} max={mx} color={cat.color} h={6} />
                  </div>
                );
              })}
          </Card>
        );
      })}
    </>
  );
}
