import {
  PawPrint, Stethoscope, User, AlertTriangle, Camera, LogOut, Pencil,
  Target, Phone, MapPin, Siren, FileText, Plus, Dog, Cat, Rabbit, Bird,
  Shield, ScrollText, ExternalLink, Download, Printer, Cloud, CheckCircle, Users,
} from "lucide-react";
import { T, calcAge, speciesLabel } from "../../theme";
import { Card, Btn, Sec, Bar, DelBtn, AddBtn, Empty } from "../ui";
import {
  exportWeightsCsv, exportLabsCsv, exportVisitsCsv, exportMedsCsv, exportVetReport,
} from "../../lib/export";
import { PremiumBanner } from "../Premium";

const SPECIES_ICON = { dog: Dog, cat: Cat, rabbit: Rabbit, bird: Bird };
const SpeciesIcon = ({ species, size = 24, color }) => {
  const Ic = SPECIES_ICON[species] || PawPrint;
  return <Ic size={size} color={color} />;
};

const DOC_TYPE_LABELS = {
  rabies: "狂犬病ワクチン",
  combo: "混合ワクチン",
  pedigree: "血統書",
  insurance: "保険証",
  other: "その他",
};

export default function Settings({
  pet, pets, user, age, lw, tgt,
  emergencyContacts = [],
  delContact, delDocument,
  fileRef, setModal, handleLogout, delPet, onDeleteAccount, onShowPremium,
}) {
  return (
    <>
      <PremiumBanner onClick={onShowPremium} />

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
                <SpeciesIcon species={pet.species} size={32} color={T.ac} />
                <div style={{ fontSize: 8, color: T.tx3, marginTop: 2 }}>タップ</div>
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em" }}>{pet.name}</div>
            <div style={{ fontSize: 11, color: T.tx2, marginTop: 4, fontWeight: 600 }}>
              {speciesLabel(pet.species)}{pet.breed ? `（${pet.breed}）` : ""} ・ {age}歳 ・ {pet.sex}
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

      <Sec
        icon={<Siren size={14} color={T.rd} />}
        action={<AddBtn onClick={() => setModal({ type: "addContact" })} />}
      >
        緊急連絡先
      </Sec>
      {emergencyContacts.length === 0 ? (
        <Empty text="緊急連絡先を追加しましょう" />
      ) : (
        emergencyContacts.map((c) => (
          <Card key={c.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{c.name}</div>
                {c.note && (
                  <div style={{ fontSize: 10, color: T.tx2, marginTop: 2, fontWeight: 500 }}>
                    {c.note}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 2 }}>
                <button
                  onClick={() => setModal({ type: "editContact", id: c.id })}
                  className="btnTap"
                  title="編集"
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
                  <Pencil size={14} />
                </button>
                <DelBtn onClick={() => delContact(c.id)} />
              </div>
            </div>
            <a
              href={`tel:${c.tel}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                background: T.rdB,
                borderRadius: 12,
                color: T.rd,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              <Phone size={14} /> {c.tel}
            </a>
          </Card>
        ))
      )}

      <Sec
        icon={<FileText size={14} color={T.ac} />}
        action={<AddBtn onClick={() => setModal({ type: "addDocument" })} />}
      >
        書類保管
      </Sec>
      {!(pet.documents?.length) ? (
        <Empty text="書類を追加してペットの情報を整理しましょう" />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {pet.documents.map((d) => (
            <Card key={d.id} style={{ padding: 10, marginBottom: 0 }}>
              {d.photo ? (
                <a href={d.photo} target="_blank" rel="noopener">
                  <img
                    src={d.photo}
                    alt={d.name}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      objectFit: "cover",
                      borderRadius: 10,
                      background: T.input,
                    }}
                  />
                </a>
              ) : (
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    background: T.input,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: T.tx3,
                  }}
                >
                  <FileText size={28} />
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 4, marginTop: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.tx, lineHeight: 1.3 }}>
                    {d.name}
                  </div>
                  <div style={{ fontSize: 9, color: T.tx3, marginTop: 2, fontWeight: 600 }}>
                    {DOC_TYPE_LABELS[d.type] || "その他"}
                    {d.date && ` ・ ${d.date}`}
                  </div>
                </div>
                <DelBtn onClick={() => delDocument(d.id)} />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Sec icon={<Cloud size={14} color={T.gn} />}>データ同期</Sec>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: T.gnB,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CheckCircle size={20} color={T.gn} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.gn }}>クラウドに自動保存中</div>
            <div style={{ fontSize: 10, color: T.tx3, marginTop: 2, fontWeight: 500 }}>
              機種変更しても安心です。データはリアルタイムで同期されています。
            </div>
          </div>
        </div>
      </Card>

      <Sec icon={<Users size={14} color={T.bl} />}>家族共有</Sec>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: `${T.bl}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Users size={20} color={T.bl} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>家族とデータを共有</div>
            <div style={{ fontSize: 10, color: T.tx3, marginTop: 2, fontWeight: 500 }}>
              家族を招待して、投薬や食事の記録を共有しましょう
            </div>
          </div>
        </div>
        <Btn
          full
          v="soft"
          onClick={() => setModal({ type: "inviteFamily" })}
          style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}
        >
          <Plus size={14} /> 家族を招待（Coming Soon）
        </Btn>
      </Card>

      <Sec icon={<Download size={14} color={T.bl} />}>データエクスポート</Sec>
      <Card>
        <div style={{ fontSize: 11, color: T.tx2, marginBottom: 12, fontWeight: 500, lineHeight: 1.6 }}>
          データをCSV形式でダウンロード、または獣医さん用レポートをPDFで出力できます。
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Btn small v="gh" onClick={() => exportWeightsCsv(pet)} style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
            <Download size={12} /> 体重CSV
          </Btn>
          <Btn small v="gh" onClick={() => exportLabsCsv(pet)} style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
            <Download size={12} /> 検査CSV
          </Btn>
          <Btn small v="gh" onClick={() => exportVisitsCsv(pet)} style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
            <Download size={12} /> 通院CSV
          </Btn>
          <Btn small v="gh" onClick={() => exportMedsCsv(pet)} style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
            <Download size={12} /> 投薬CSV
          </Btn>
        </div>
        <div style={{ marginTop: 12 }}>
          <Btn full v="soft" onClick={() => exportVetReport(pet)} style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
            <Printer size={14} /> 獣医さん用レポートを出力
          </Btn>
        </div>
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

      <Sec icon={<Shield size={14} color={T.tx2} />}>法的情報</Sec>
      <Card>
        <a
          href="/privacy.html"
          target="_blank"
          rel="noopener"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: `1px solid ${T.bdr}`,
            textDecoration: "none",
            color: T.tx,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Shield size={16} color={T.tx2} />
            <span style={{ fontSize: 13, fontWeight: 700 }}>プライバシーポリシー</span>
          </div>
          <ExternalLink size={14} color={T.tx3} />
        </a>
        <a
          href="/terms.html"
          target="_blank"
          rel="noopener"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 0",
            textDecoration: "none",
            color: T.tx,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ScrollText size={16} color={T.tx2} />
            <span style={{ fontSize: 13, fontWeight: 700 }}>利用規約</span>
          </div>
          <ExternalLink size={14} color={T.tx3} />
        </a>
      </Card>

      <div
        style={{
          padding: "12px 16px",
          background: T.amB,
          borderRadius: 12,
          fontSize: 11,
          color: T.am,
          fontWeight: 600,
          lineHeight: 1.6,
          marginBottom: 12,
        }}
      >
        本アプリは獣医師による医療アドバイスの代替ではありません。ペットの健康に関する判断は、必ず獣医師にご相談ください。
      </div>

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
        <Btn
          full
          v="dn"
          onClick={handleLogout}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <LogOut size={14} /> ログアウト
        </Btn>
        <button
          onClick={() => {
            if (confirm("アカウントを削除すると、全てのデータが失われます。本当に削除しますか？")) {
              if (confirm("この操作は取り消せません。最終確認：本当にアカウントを削除しますか？")) {
                if (onDeleteAccount) onDeleteAccount();
              }
            }
          }}
          style={{
            background: "none",
            border: "none",
            color: T.tx3,
            fontSize: 11,
            cursor: "pointer",
            fontWeight: 600,
            padding: 8,
            textAlign: "center",
          }}
        >
          アカウントを削除
        </button>
      </div>
    </>
  );
}
