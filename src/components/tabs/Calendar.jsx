import { useState, useMemo } from "react";
import {
  Pill, Calendar as CalIcon, Stethoscope, FlaskConical, Scale,
  UtensilsCrossed, Check, ExternalLink, Plus, Pin,
} from "lucide-react";
import { T, todayStr, googleCalUrl, petColor } from "../../theme";
import { Card, Sec, Empty, Btn } from "../ui";

const KIND = {
  med:      { Ic: Pill,            color: "#6d5ccd", label: "お薬" },
  schedule: { Ic: CalIcon,         color: "#2563eb", label: "予定" },
  visit:    { Ic: Stethoscope,     color: "#059669", label: "通院" },
  lab:      { Ic: FlaskConical,    color: "#0891b2", label: "検査" },
  weight:   { Ic: Scale,           color: "#ca8a04", label: "体重" },
  food:     { Ic: UtensilsCrossed, color: "#db2777", label: "食事" },
  todo:     { Ic: Check,           color: "#d97706", label: "タスク" },
};

function collectAllEvents(pets) {
  const events = [];
  pets.forEach((p) => {
    const pet = { id: p.id, name: p.name, emoji: p.emoji, photo: p.photo };
    (p.meds || []).forEach((m) => {
      if (m.active && m.next)
        events.push({
          date: m.next,
          kind: "med",
          title: `${m.name} 投与日`,
          sub: m.purpose,
          gcalTitle: `💊 ${m.name} 投与日`,
          id: `med-${m.id}`,
          pet,
        });
    });
    (p.schedule || []).forEach((s) => {
      events.push({
        date: s.date,
        kind: "schedule",
        title: s.label,
        sub: "予防スケジュール",
        gcalTitle: `📅 ${s.label}`,
        id: `sch-${s.id}`,
        pet,
      });
    });
    (p.visits || []).forEach((v) => {
      events.push({
        date: v.date,
        kind: "visit",
        title: v.clinic || "通院",
        sub: v.summary || `¥${v.cost?.toLocaleString() || 0}`,
        gcalTitle: `🏥 ${v.clinic || "通院"} ${v.summary || ""}`.trim(),
        id: `vis-${v.id}`,
        pet,
      });
    });
    (p.labs || []).forEach((l) => {
      const ab = l.results.filter((r) => r.st !== "ok").length;
      events.push({
        date: l.date,
        kind: "lab",
        title: l.type || "検査",
        sub: `異常 ${ab}項目`,
        gcalTitle: `🔬 ${l.type || "検査"}`,
        id: `lab-${l.id}`,
        pet,
      });
    });
    (p.weights || []).forEach((w) => {
      events.push({
        date: w.date,
        kind: "weight",
        title: `体重 ${w.value}kg`,
        sub: "体重記録",
        gcalTitle: `⚖️ 体重 ${w.value}kg`,
        id: `wt-${w.id}`,
        pet,
      });
    });
    (p.foods || []).forEach((f) => {
      events.push({
        date: f.date,
        kind: "food",
        title: f.name,
        sub: `${f.type}${f.amount ? ` ・${f.amount}` : ""}`,
        gcalTitle: `🍽️ ${f.name}`,
        id: `fd-${f.id}`,
        pet,
      });
    });
    (p.todos || []).forEach((t) => {
      if (t.due && !t.done)
        events.push({
          date: t.due,
          kind: "todo",
          title: t.text,
          sub: "未完了",
          gcalTitle: `✅ ${t.text}`,
          id: `td-${t.id}`,
          pet,
        });
    });
  });
  return events.sort((a, b) => a.date.localeCompare(b.date));
}

function PetAvatar({ pet, size = 20 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        background: T.input,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {pet.photo ? (
        <img src={pet.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span style={{ fontSize: size * 0.6 }}>{pet.emoji || "🐾"}</span>
      )}
    </div>
  );
}

function MonthGrid({ year, month, eventsByDate, selected, setSelected, onPrev, onNext, pets }) {
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
          onClick={onPrev}
          className="btnTap"
          style={{ background: T.input, border: "none", borderRadius: 10, width: 32, height: 32, fontSize: 14, cursor: "pointer", color: T.tx2 }}
        >
          ‹
        </button>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.01em" }}>
          {year}年 {month + 1}月
        </div>
        <button
          onClick={onNext}
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
          const petIds = [...new Set(evs.map((e) => e.pet.id))].slice(0, 4);
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
              {petIds.length > 0 && (
                <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  {petIds.map((pid) => (
                    <span
                      key={pid}
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: isSelected ? "#fff" : petColor(pets, pid),
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

export default function Calendar({ pets, setTab, setModal }) {
  const today = todayStr();
  const [selected, setSelected] = useState(today);
  const [filterPid, setFilterPid] = useState("all");
  const [cursor, setCursor] = useState(() => {
    const d = new Date(today);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const allEvents = useMemo(() => collectAllEvents(pets), [pets]);
  const events = useMemo(
    () => (filterPid === "all" ? allEvents : allEvents.filter((e) => e.pet.id === filterPid)),
    [allEvents, filterPid]
  );
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
      case "med":
      case "schedule":
        return "meds";
      case "visit":
        return "visits";
      case "lab":
        return "labs";
      case "weight":
        return "wt";
      case "food":
        return "food";
      case "todo":
        return "dash";
      default:
        return null;
    }
  };

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Btn
          full
          onClick={() => setModal({ type: "addCalendarEvent" })}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <Plus size={16} /> 予定追加
        </Btn>
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 12,
          overflowX: "auto",
          paddingBottom: 4,
        }}
      >
        <button
          onClick={() => setFilterPid("all")}
          className="btnTap"
          style={{
            padding: "8px 14px",
            borderRadius: 20,
            border: "none",
            background: filterPid === "all" ? T.ac : T.card,
            color: filterPid === "all" ? "#fff" : T.tx2,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: T.shadow,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          全員
        </button>
        {pets.map((p) => {
          const active = filterPid === p.id;
          const c = petColor(pets, p.id);
          return (
            <button
              key={p.id}
              onClick={() => setFilterPid(p.id)}
              className="btnTap"
              style={{
                padding: "6px 12px 6px 6px",
                borderRadius: 20,
                border: "none",
                background: active ? c : T.card,
                color: active ? "#fff" : T.tx2,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: T.shadow,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <PetAvatar pet={p} size={22} />
              {p.name}
            </button>
          );
        })}
      </div>

      <MonthGrid
        year={cursor.year}
        month={cursor.month}
        eventsByDate={eventsByDate}
        selected={selected}
        setSelected={setSelected}
        onPrev={onPrev}
        onNext={onNext}
        pets={pets}
      />

      <Card style={{ padding: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {Object.entries(KIND).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: T.tx2 }}>
              <v.Ic size={12} color={v.color} />
              <span style={{ fontWeight: 600 }}>{v.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <Sec icon={<Pin size={14} color={T.ac} />}>{selected} の予定</Sec>
      {dayEvents.length === 0 ? (
        <Empty icon="📭" text="この日の予定はありません" />
      ) : (
        dayEvents.map((e) => {
          const k = KIND[e.kind];
          const target = tabFor(e.kind);
          const pc = petColor(pets, e.pet.id);
          const onCal = (ev) => {
            ev.stopPropagation();
            window.open(
              googleCalUrl({
                title: e.gcalTitle,
                date: e.date,
                description: `${e.pet.name} - ${e.sub || ""}`,
              }),
              "_blank"
            );
          };
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
                  flexShrink: 0,
                }}
              >
                <k.Ic size={20} color={k.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <PetAvatar pet={e.pet} size={18} />
                  <span style={{ fontSize: 10, color: pc, fontWeight: 700 }}>{e.pet.name}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.tx, lineHeight: 1.3 }}>{e.title}</div>
                {e.sub && <div style={{ fontSize: 10, color: T.tx2, marginTop: 2 }}>{e.sub}</div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <button
                  onClick={onCal}
                  className="btnTap"
                  title="Googleカレンダーに追加"
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
                  <ExternalLink size={14} />
                </button>
              </div>
            </Card>
          );
        })
      )}
    </>
  );
}
