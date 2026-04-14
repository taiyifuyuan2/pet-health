import { T, calcAge } from "../../theme";
import { Card, Btn, Sec } from "../ui";

export default function Settings({ pet, pets, user, age, fileRef, setModal, handleLogout, delPet }) {
  return (
    <>
      <Sec icon="🐾">プロフィール</Sec>
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
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26 }}>📷</div>
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
          <Btn small v="gh" onClick={() => setModal({ type: "editPet" })}>編集</Btn>
        </div>
      </Card>

      <Sec icon="🏥">かかりつけ医</Sec>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>みなみ動物クリニック</div>
        <div style={{ fontSize: 11, color: T.tx2, lineHeight: 1.7, fontWeight: 500 }}>
          📍 鹿児島市谷山中央4丁目4954-26
          <br />
          📞 099-210-5787
        </div>
      </Card>

      <Sec icon="👤">アカウント</Sec>
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
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            👤
          </div>
          <div style={{ fontSize: 12, color: T.tx2, wordBreak: "break-all" }}>{user?.email}</div>
        </div>
      </Card>

      {pets.length > 1 && (
        <>
          <Sec icon="⚠">データ管理</Sec>
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
        <Btn full v="dn" onClick={handleLogout}>
          ログアウト
        </Btn>
      </div>
    </>
  );
}
