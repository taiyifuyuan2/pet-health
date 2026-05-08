import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, Plus, Dog, Cat, Rabbit, Bird, PawPrint } from "lucide-react";
import { T, calcAge, speciesLabel } from "../theme";

const SPECIES_ICON = { dog: Dog, cat: Cat, rabbit: Rabbit, bird: Bird };
const SpeciesIcon = ({ species, size = 24, color }) => {
  const Ic = SPECIES_ICON[species] || PawPrint;
  return <Ic size={size} color={color} />;
};

export default function Header({ pet, pets, setPid, onAddPet, onPhotoClick, lw }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const age = pet ? calcAge(pet.birth) : 0;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  return (
    <div
      style={{
        background: T.grWarm,
        padding: "20px 18px 22px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -40,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: T.acL,
            filter: "blur(40px)",
            opacity: 0.7,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          position: "relative",
        }}
      >
        <div
          onClick={onPhotoClick}
          className="btnTap"
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            background: pet?.photo ? "none" : T.acL,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `3px solid ${T.acL}`,
            boxShadow: `0 4px 12px ${T.acG}, 0 0 0 1px ${T.ac}22`,
            cursor: "pointer",
          }}
        >
          {pet?.photo ? (
            <img
              src={pet.photo}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <SpeciesIcon species={pet?.species} size={28} color={T.ac} />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0, position: "relative" }} ref={ref}>
          <div
            onClick={() => setOpen(!open)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: T.tx,
                letterSpacing: "-0.02em",
              }}
            >
              {pet?.name}
            </h1>
            <span
              style={{
                color: T.tx2,
                transition: "transform .2s",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <ChevronDown size={16} />
            </span>
          </div>
          <div
            style={{
              fontSize: 11,
              color: T.tx2,
              marginTop: 2,
              fontWeight: 500,
            }}
          >
            {pet?.breed || speciesLabel(pet?.species)} ・ {age}歳 ・ {pet?.sex}
          </div>

          {open && (
            <div
              className="pop"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                background: T.card,
                borderRadius: 16,
                boxShadow: T.shadowHover,
                padding: 8,
                zIndex: 999,
                border: `1px solid ${T.bdr}`,
                maxHeight: "70vh",
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {pets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPid(p.id);
                    setOpen(false);
                  }}
                  className="btnTap"
                  style={{
                    width: "100%",
                    minHeight: 52,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: pet?.id === p.id ? T.acL : "transparent",
                    border: "none",
                    borderRadius: 12,
                    cursor: "pointer",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      overflow: "hidden",
                      background: T.input,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      border: `2px solid ${pet?.id === p.id ? T.ac : "transparent"}`,
                    }}
                  >
                    {p.photo ? (
                      <img
                        src={p.photo}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <SpeciesIcon species={p.species} size={18} color={pet?.id === p.id ? T.ac : T.tx3} />
                    )}
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.tx,
                      }}
                    >
                      {p.name}
                    </div>
                    <div style={{ fontSize: 10, color: T.tx2 }}>
                      {p.breed || speciesLabel(p.species)} ・ {calcAge(p.birth)}歳
                    </div>
                  </div>
                  {pet?.id === p.id && (
                    <span style={{ color: T.ac, display: "inline-flex" }}>
                      <Check size={16} />
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={() => {
                  onAddPet();
                  setOpen(false);
                }}
                className="btnTap"
                style={{
                  width: "100%",
                  minHeight: 48,
                  padding: "10px 12px",
                  background: "transparent",
                  border: `1.5px dashed ${T.bdr}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  fontSize: 12,
                  color: T.ac,
                  fontWeight: 700,
                  marginTop: 4,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                <Plus size={14} /> ペットを追加
              </button>
            </div>
          )}
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: T.ac,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {lw}
            <span style={{ fontSize: 11, color: T.tx2, fontWeight: 600, marginLeft: 2 }}>kg</span>
          </div>
          <div style={{ fontSize: 9, color: T.tx3, marginTop: 4, fontWeight: 600 }}>現在の体重</div>
        </div>
      </div>

      {pets.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 14,
            paddingTop: 12,
            borderTop: `1px solid ${T.bdr}33`,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            position: "relative",
          }}
        >
          {pets.map((p) => {
            const active = pet?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPid(p.id)}
                className="btnTap"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  flexShrink: 0,
                  minWidth: 52,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: active ? T.acL : T.input,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2.5px solid ${active ? T.ac : "transparent"}`,
                    transition: "all .2s",
                  }}
                >
                  {p.photo ? (
                    <img src={p.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <SpeciesIcon species={p.species} size={18} color={active ? T.ac : T.tx3} />
                  )}
                </div>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: active ? 800 : 600,
                    color: active ? T.ac : T.tx3,
                    maxWidth: 56,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.name}
                </span>
              </button>
            );
          })}
          <button
            onClick={onAddPet}
            className="btnTap"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              flexShrink: 0,
              minWidth: 52,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `1.5px dashed ${T.bdr2}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={16} color={T.tx3} />
            </div>
            <span style={{ fontSize: 9, color: T.tx3, fontWeight: 600 }}>追加</span>
          </button>
        </div>
      )}
    </div>
  );
}
