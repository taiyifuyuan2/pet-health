import { useState, useMemo } from "react";
import { T, todayStr } from "../../theme";
import { Card, Sec, Empty } from "../ui";

const KIND = {
  med:      { ic: "💊", color: "#6d5ccd", label: "お薬" },
  schedule: { ic: "📅", color: "#2563eb", label: "予定" },
  visit:    { ic: "🏥", color: "#059669", label: "通院" },
  lab:      { ic: "🔬", color: "#0891b2", label: "検査" },
  weight:   { ic: "⚖️", color: "#ca8a04", label: "体重" },
  food:     { ic: "🍽️", color: "#db2777", label: "食事" },
  todo:     { ic: "✅", color: "#d97706", label: "タスク" },
};

function collectEvents(pet) {
  const events = [];
  (pet.meds || []).forEach((m) => {
    if (m.next) events.push({ date: m.next, kind: "med", title: m.name, sub: m.purpose, id: `med-${m.id}` });
  });
  (pet.schedule || []).forEach((s) => {
    events.push({ date: s.date, kind: "schedule", title: s.label, sub: "予防スケジュール", id: `sch-${s.id}` });
  });
  (pet.visits || []).forEach((v) => {
    events.push({ date: v.date, kind: "visit", title: v.clinic || "通院", sub: v.summary || `¥${v.cost?.toLocaleString() || 0}`, id: `vis-${v.id}` });
  });
  (pet.labs || []).forEach((l) => {
    const ab = l.results.filter((r) => r.st !== "ok").length;
    events.push({ date: l.date, kind: "lab", title: l.type, sub: `異常 ${ab}項目`, id: `lab-${l.id}` });
  });
  (pet.weights || []).forEach((w) => {
    events.push({ date: w.date, kind: "weight", title: `${w.value}kg`, sub: "体重記録", id: `wt-${w.id}` });
  });
  (pet.foods || []).forEach((f) => {
    events.push({ date: f.date, kind: "food", title: f.name, sub: `${f.type}${f.amount ? ` ・${f.amount}` : ""}`, id: `fd-${f.id}` });
  });
  (pet.todos || []).forEach((t) => {
    if (t.due) events.push({ date: t.due, kind: "todo", title: t.text, sub: t.done ? "完了" : "未完了", id: `td-${t.id}`, done: t.done });
  });
  return events;
}

function MonthGrid({ year, month, eventsByDate, selected, setSelected, onPrevMonth, onNextMonth }) {
  const today = todayStr();
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button
          onClick={onPrevMonth}
          className="btnTap"
          style={{ background: T.input, border: "none", borderRadius: 10, width: 32, height: 32, fontSize: 14, cursor: "pointer", color: T.tx2 }}
        >
          ‹
        </button>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.01em" }}>
          {year}年 {month + 1}月
        </div>
        <button
          onClick={onNextMonth}
          className="btnTap"
          style={{ background: T.input, border: "none", borderRadius: 10, width: 32, height: 32, fontSize: 14, cursor: "pointer", color: T.tx2 }}
        >
          ›
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 4 }}>
        {["日", "月", "火", "水", "木", "金", "土"].map((d, i) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 10,
              fontWeight: 700,
              color: i === 0 ? T.rd : i === 6 ? T.bl : T.tx3,
              padding: "4px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const evs = eventsByDate[dateStr] || [];
          const isToday = dateStr === today;
          const isSelected = dateStr === selected;
          const dow = (startDow + d - 1) % 7;
          const kinds = [...new Set(evs.map((e) => e.kind))].slice(0, 4);
          return (
            <button
              key={i}
              onClick={() => setSelected(dateStr)}
              className="btnTap"
              style={{
                aspectRatio: "1",
                border: "none",
                background: isSelected ? T.ac : isToday ? T.acL : "transparent",
                borderRadius: 10,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                padding: 2,
                transition: "all .15s",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: isToday || isSelected ? 800 : 600,
                  color: isSelected
                    ? "#fff"
                    : isToday
                    ? T.ac
                    : dow === 0
                    ? T.rd
                    : dow === 6
                    ? T.bl
                    : T.tx,
                }}
              >
                {d}
              </span>
              {kinds.length > 0 && (
                <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  {kinds.map((k) => (
                    <span
                      key={k}
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: isSelected ? "#fff" : KIND[k].color,
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default function Calendar({ pet, setTab }) {
  const today = todayStr();
  const [selected, setSelected] = useState(today);
  const [cursor, setCursor] = useState(() => {
    const d = new Date(today);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const events = useMemo(() => collectEvents(pet), [pet]);
  const eventsByDate = useMemo(() => {
    const m = {};
    events.forEach((e) => {
      if (!m[e.date]) m[e.date] = [];
      m[e.date].push(e);
    });
    return m;
  }, [events]);

  const onPrev = () => {
    setCursor((c) => {
      const m = c.month - 1;
      return m < 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: m };
    });
  };
  const onNext = () => {
    setCursor((c) => {
      const m = c.month + 1;
      return m > 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: m };
    });
  };

  const dayEvents = eventsByDate[selected] || [];

  const tabFor = (kind) => {
    switch (kind) {
      case "med": case "schedule": return "meds";
      case "visit": return "visits";
      case "lab": return "labs";
      case "weight": return "wt";
      case "food": return "food";
      case "todo": return "dash";
      default: return null;
    }
  };

  return (
    <>
      <MonthGrid
        year={cursor.year}
        month={cursor.month}
        eventsByDate={eventsByDate}
        selected={selected}
        setSelected={setSelected}
        onPrevMonth={onPrev}
        onNextMonth={onNext}
      />

      <Card style={{ padding: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {Object.entries(KIND).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: T.tx2 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: v.color }} />
              <span style={{ fontWeight: 600 }}>{v.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <Sec icon="📌">{selected} の予定</Sec>
      {dayEvents.length === 0 ? (
        <Empty icon="📭" text="この日の予定はありません" />
      ) : (
        dayEvents.map((e) => {
          const k = KIND[e.kind];
          const target = tabFor(e.kind);
          return (
            <Card
              key={e.id}
              accent={k.color}
              onClick={target ? () => setTab(target) : undefined}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: `${k.color}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {k.ic}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.tx, textDecoration: e.done ? "line-through" : "none" }}>
                  {e.title}
                </div>
                <div style={{ fontSize: 10, color: T.tx2, marginTop: 2 }}>{e.sub}</div>
              </div>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: k.color,
                  background: `${k.color}15`,
                  padding: "3px 8px",
                  borderRadius: 8,
                }}
              >
                {k.label}
              </span>
            </Card>
          );
        })
      )}
    </>
  );
}
