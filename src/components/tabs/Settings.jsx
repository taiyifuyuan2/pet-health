import { PawPrint, Stethoscope, User, AlertTriangle, Camera, LogOut, Pencil, Target, Phone, MapPin } from "lucide-react";
import { T, calcAge } from "../../theme";
import { Card, Btn, Sec, Bar } from "../ui";

export default function Settings({ pet, pets, user, age, lw, tgt, fileRef, setModal, handleLogout, delPet }) {
  return (
    <>
      <Sec icon={<PawPrint size={14} color={T.ac} />}>プロフィール</Sec>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            onClick={() => fileRef.current?.click()}
            className="btnTap"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              overflow: "hidden",
              background: T.acL,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `3px solid ${T.acL}`,
              boxShadow: `0 4px 12px ${T.acG}`,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {pet.photo ? (
              <img src={pet.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ textAlign: "center", color: T.ac }}>
                <Camera size={26} />
                <div style={{ fontSize: 8, color: T.tx3, marginTop: 2 }}>タップ</div>
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em" }}>{pet.name}</div>
            <div style={{ fontSize: 11, color: T.tx2, marginTop: 4, fontWeight: 600 }}>
              {pet.breed} ・ {age}歳 ・ {pet.sex}
            </div>
            <div style={{ fontSize: 10, color: T.tx3, marginTop: 2 }}>🎂 {pet.birth}</div>
          </div>
          <Btn
            small
            v="gh"
            onClick={() => setModal({ type: "editPet" })}
            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <Pencil size={14} /> 編集
          </Btn>
        </div>
      </Card>

      <Sec icon={<Target size={14} color={T.gn} />}>減量目標</Sec>
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 11, color: T.tx2, fontWeight: 600 }}>目標</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: T.ac, letterSpacing: "-0.02em" }}>
                {tgt}
                <span style={{ fontSize: 12, color: T.tx2, marginLeft: 2 }}>kg</span>
              </span>
              {lw > 0 && (
                <span style={{ fontSize: 10, color: T.tx3, fontWeight: 600 }}>
                  / 現在 {lw}kg
                </span>
              )}
            </div>
            {lw > 0 && (
              <div style={{ marginTop: 8 }}>
                <Bar
                  val={Math.max(lw - tgt, 0)}
                  max={Math.max(lw, tgt) * 0.5}
                  color={lw > tgt ? T.am : T.gn}
                  h={6}
                />
                <div style={{ fontSize: 10, color: T.tx3, fontWeight: 600, marginTop: 4 }}>
                  {lw > tgt ? `あと ${(lw - tgt).toFixed(1)}kg` : "目標達成 🎉"}
                </div>
              </div>
            )}
          </div>
          <Btn
            small
            v="gh"
            onClick={() => setModal({ type: "editTargetWeight" })}
            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <Pencil size={14} /> 変更
          </Btn>
        </div>
      </Card>

      <Sec icon={<Stethoscope size={14} color={T.ac} />}>かかりつけ医</Sec>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 800, flex: 1, minWidth: 0 }}>{pet.clinic_name}</div>
          <Btn
            small
            v="gh"
            onClick={() => setModal({ type: "editClinic" })}
            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <Pencil size={14} /> 編集
          </Btn>
        </div>
        {pet.clinic_address && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              fontSize: 11,
              color: T.tx2,
              fontWeight: 500,
              marginBottom: 10,
              lineHeight: 1.5,
            }}
          >
            <MapPin size={13} color={T.tx3} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{pet.clinic_address}</span>
          </div>
        )}
        {pet.clinic_tel && (
          <a
            href={`tel:${pet.clinic_tel}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              background: T.acL,
              borderRadius: 12,
              color: T.ac,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            <Phone size={14} />
            {pet.clinic_tel}
            <span style={{ fontSize: 10, color: T.tx2, fontWeight: 500, marginLeft: 4 }}>
              タップで発信
            </span>
          </a>
        )}
      </Card>

      <Sec icon={<User size={14} color={T.ac} />}>アカウント</Sec>
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 0",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: T.acL,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: T.ac,
              flexShrink: 0,
            }}
          >
            <User size={16} />
          </div>
          <div style={{ fontSize: 12, color: T.tx2, wordBreak: "break-all" }}>{user?.email}</div>
        </div>
      </Card>

      {pets.length > 1 && (
        <>
          <Sec icon={<AlertTriangle size={14} color={T.am} />}>データ管理</Sec>
          <Card>
            <Btn
              full
              v="dn"
              onClick={() => {
                if (confirm(`${pet.name}を削除しますか？`)) delPet(pet.id);
              }}
            >
              この子の情報を削除
            </Btn>
          </Card>
        </>
      )}

      <div style={{ marginTop: 24 }}>
        <Btn
          full
          v="dn"
          onClick={handleLogout}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <LogOut size={14} /> ログアウト
        </Btn>
      </div>
    </>
  );
}
