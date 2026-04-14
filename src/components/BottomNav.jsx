import { useState } from "react";
import {
  Home, Pill, Calendar, Stethoscope, MoreHorizontal, X,
  FlaskConical, UtensilsCrossed, Scale, Coins, Settings,
} from "lucide-react";
import { T } from "../theme";

const PRIMARY = [
  { id: "dash", Ic: Home, lb: "ホーム" },
  { id: "meds", Ic: Pill, lb: "お薬" },
  { id: "cal", Ic: Calendar, lb: "カレンダー" },
  { id: "visits", Ic: Stethoscope, lb: "通院" },
];

const MORE = [
  { id: "labs", Ic: FlaskConical, lb: "検査" },
  { id: "food", Ic: UtensilsCrossed, lb: "食事" },
  { id: "wt", Ic: Scale, lb: "体重" },
  { id: "cost", Ic: Coins, lb: "費用" },
  { id: "cfg", Ic: Settings, lb: "設定" },
];

export default function BottomNav({ tab, setTab }) {
  const [open, setOpen] = useState(false);
  const moreActive = MORE.some((m) => m.id === tab);

  const TabButton = ({ t, active }) => (
    <button
      onClick={() => {
        setTab(t.id);
        setOpen(false);
      }}
      className="btnTap"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        padding: "8px 4px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        position: "relative",
        height: "100%",
      }}
    >
      <div
        style={{
          padding: "4px 14px",
          borderRadius: 16,
          background: active ? T.acL : "transparent",
          transition: "background .25s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: active ? T.ac : T.tx3,
        }}
      >
        <t.Ic size={22} />
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: active ? 800 : 600,
          color: active ? T.ac : T.tx3,
          letterSpacing: "-0.02em",
        }}
      >
        {t.lb}
      </span>
    </button>
  );

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(20,16,24,0.4)",
            backdropFilter: "blur(8px)",
            zIndex: 90,
          }}
        />
      )}
      {open && (
        <div
          className="slideUp"
          style={{
            position: "fixed",
            bottom: "calc(56px + env(safe-area-inset-bottom, 0px))",
            left: 0,
            right: 0,
            background: T.card,
            borderRadius: "20px 20px 0 0",
            padding: "18px 22px 22px",
            zIndex: 100,
            boxShadow: T.shadowLg,
            maxWidth: 520,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: 40,
              height: 4,
              background: T.bdr2,
              borderRadius: 4,
              margin: "0 auto 16px",
            }}
          />
          <div style={{ fontSize: 13, fontWeight: 700, color: T.tx2, marginBottom: 14 }}>その他</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {MORE.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTab(t.id);
                    setOpen(false);
                  }}
                  className="btnTap"
                  style={{
                    background: active ? T.acL : T.card2,
                    border: "none",
                    borderRadius: 14,
                    padding: "16px 6px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    color: active ? T.ac : T.tx3,
                  }}
                >
                  <t.Ic size={22} />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: active ? T.ac : T.tx,
                    }}
                  >
                    {t.lb}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "calc(56px + env(safe-area-inset-bottom, 0px))",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: `1px solid ${T.bdr}`,
          display: "flex",
          alignItems: "center",
          zIndex: 100,
          maxWidth: 520,
          margin: "0 auto",
        }}
      >
        {PRIMARY.map((t) => (
          <TabButton key={t.id} t={t} active={tab === t.id} />
        ))}
        <button
          onClick={() => setOpen(!open)}
          className="btnTap"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            padding: "8px 4px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            height: "100%",
          }}
        >
          <div
            style={{
              padding: "4px 14px",
              borderRadius: 16,
              background: moreActive || open ? T.acL : "transparent",
              transition: "background .25s",
              color: moreActive || open ? T.ac : T.tx3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {open ? <X size={22} /> : <MoreHorizontal size={22} />}
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: moreActive || open ? 800 : 600,
              color: moreActive || open ? T.ac : T.tx3,
            }}
          >
            もっと
          </span>
        </button>
      </div>
    </>
  );
}
