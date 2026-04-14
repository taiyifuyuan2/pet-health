import { useEffect, useState } from "react";
import { T } from "../theme";

export function Card({ children, glow, bc, onClick, style, accent, hover }) {
  return (
    <div
      onClick={onClick}
      className={hover !== false ? "cardHover" : ""}
      style={{
        background: T.card,
        borderRadius: 16,
        border: bc ? `1px solid ${bc}` : "none",
        padding: 16,
        marginBottom: 12,
        boxShadow: glow ? `0 0 0 2px ${T.acL}, ${T.shadow}` : T.shadow,
        transition: "all .2s ease",
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
        ...(accent
          ? { borderLeft: `4px solid ${accent}`, paddingLeft: 14 }
          : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Btn({ children, v = "pri", small, full, ...p }) {
  const m = {
    pri: { background: T.gr, color: "#fff", border: "none", boxShadow: "0 2px 8px rgba(109,92,205,0.25)" },
    gh: { background: T.card, color: T.ac, border: `1.5px solid ${T.acL}` },
    dn: { background: T.rdB, color: T.rd, border: `1.5px solid ${T.rd}33` },
    gn: { background: T.gnB, color: T.gn, border: `1.5px solid ${T.gn}33` },
    soft: { background: T.acL, color: T.ac, border: "none" },
  };
  return (
    <button
      {...p}
      className="btnTap"
      style={{
        padding: small ? "7px 14px" : "12px 24px",
        borderRadius: 12,
        fontSize: small ? 12 : 13,
        fontWeight: 700,
        cursor: "pointer",
        transition: "all .15s ease",
        whiteSpace: "nowrap",
        ...(full ? { width: "100%" } : {}),
        ...m[v],
        ...p.style,
      }}
    >
      {children}
    </button>
  );
}

export function Inp({ label, ...p }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label style={{ display: "block", fontSize: 12, color: T.tx2, marginBottom: 6, fontWeight: 600 }}>
          {label}
        </label>
      )}
      <input
        {...p}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 12,
          border: `1.5px solid ${T.bdr}`,
          background: T.card,
          color: T.tx,
          fontSize: 14,
          transition: "all .15s",
          ...p.style,
        }}
      />
    </div>
  );
}

export function Sel({ label, options, ...p }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label style={{ display: "block", fontSize: 12, color: T.tx2, marginBottom: 6, fontWeight: 600 }}>
          {label}
        </label>
      )}
      <select
        {...p}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 12,
          border: `1.5px solid ${T.bdr}`,
          background: T.card,
          color: T.tx,
          fontSize: 14,
          transition: "all .15s",
          ...p.style,
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Badge({ text, color, bg }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        color: color || "#fff",
        background: bg || "rgba(0,0,0,.05)",
      }}
    >
      {text}
    </span>
  );
}

export function Bar({ val, max, color, h = 10 }) {
  const pct = Math.min(Math.max((val / max) * 100, 0), 100);
  return (
    <div
      style={{
        width: "100%",
        height: h,
        borderRadius: h,
        background: "rgba(0,0,0,.05)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          borderRadius: h,
          background: `linear-gradient(90deg,${color},${color}aa)`,
          transition: "width .6s cubic-bezier(.16,1,.3,1)",
        }}
      />
    </div>
  );
}

export function Sec({ children, icon, action }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
        marginTop: 18,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {icon && (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: T.acL,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            {icon}
          </div>
        )}
        <h3 style={{ fontSize: 15, fontWeight: 800, color: T.tx, letterSpacing: "-0.01em" }}>{children}</h3>
      </div>
      {action}
    </div>
  );
}

export function Modal({ title, children, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,16,24,0.5)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 200,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="slideUp"
        style={{
          background: T.card,
          borderRadius: "24px 24px 0 0",
          padding: "12px 22px 28px",
          width: "100%",
          maxWidth: 520,
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: T.shadowLg,
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            background: T.bdr2,
            borderRadius: 4,
            margin: "4px auto 14px",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em" }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: T.input,
              border: "none",
              color: T.tx2,
              fontSize: 16,
              cursor: "pointer",
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Empty({ icon = "🐾", text, action }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px 20px",
        color: T.tx3,
        background: T.card,
        borderRadius: 16,
        border: `1.5px dashed ${T.bdr}`,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          fontSize: 40,
          marginBottom: 10,
          opacity: 0.6,
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 13, color: T.tx2, marginBottom: action ? 14 : 0 }}>{text}</div>
      {action}
    </div>
  );
}

export function DelBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="btnTap"
      style={{
        background: "transparent",
        border: "none",
        color: T.tx3,
        fontSize: 14,
        cursor: "pointer",
        padding: 6,
        borderRadius: 8,
        transition: "all .15s",
      }}
      title="削除"
      onMouseEnter={(e) => {
        e.currentTarget.style.background = T.rdB;
        e.currentTarget.style.color = T.rd;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = T.tx3;
      }}
    >
      🗑
    </button>
  );
}

export function Toast({ show, text }) {
  if (!show) return null;
  return (
    <div
      className="toast"
      style={{
        position: "fixed",
        bottom: 88,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(20,16,24,0.92)",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: 24,
        fontSize: 12,
        fontWeight: 600,
        zIndex: 150,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: T.gn,
          animation: "pulse 1.2s infinite",
        }}
      />
      {text}
    </div>
  );
}

export function Skeleton({ h = 80 }) {
  return (
    <div
      style={{
        height: h,
        borderRadius: 16,
        background: `linear-gradient(90deg,${T.input},${T.card2},${T.input})`,
        backgroundSize: "200% 100%",
        animation: "pulse 1.5s ease-in-out infinite",
        marginBottom: 12,
      }}
    />
  );
}

export function IconCircle({ children, color = T.ac, size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `${color}15`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}
