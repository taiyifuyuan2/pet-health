import { useState } from "react";
import {
  Crown, Check, X, FlaskConical, Scale, Printer, Download,
  Users, FileText, Sparkles, PawPrint,
} from "lucide-react";
import { T } from "../theme";
import { Btn } from "./ui";

const FEATURES = [
  { label: "ペット登録", free: "5頭まで", premium: "無制限", icon: PawPrint },
  { label: "基本記録（投薬・体重・食事・通院）", free: true, premium: true, icon: Check },
  { label: "検査結果の手入力", free: true, premium: true, icon: FlaskConical },
  { label: "カレンダー・緊急連絡先", free: true, premium: true, icon: Check },
  { label: "検査結果 前回比較・トレンド", free: false, premium: true, icon: FlaskConical },
  { label: "体重トレンド分析・目標達成予測", free: false, premium: true, icon: Scale },
  { label: "獣医さん用PDFレポート", free: false, premium: true, icon: Printer },
  { label: "CSVデータエクスポート", free: false, premium: true, icon: Download },
  { label: "書類保管（写真無制限）", free: false, premium: true, icon: FileText },
  { label: "家族共有（5人まで）", free: "2人まで", premium: "5人まで", icon: Users },
  { label: "犬種別健康ガイド", free: false, premium: true, icon: Sparkles },
  { label: "広告非表示", free: false, premium: true, icon: Check },
];

export default function PremiumModal({ onClose }) {
  const [annual, setAnnual] = useState(true);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,16,24,0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        zIndex: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="slideUp"
        style={{
          background: T.card,
          borderRadius: 24,
          padding: "0 0 24px",
          width: "100%",
          maxWidth: 400,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: T.gr,
            padding: "28px 24px 24px",
            borderRadius: "24px 24px 0 0",
            position: "relative",
            textAlign: "center",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              width: 32,
              height: 32,
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={16} />
          </button>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              margin: "0 auto 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Crown size={32} color="#fff" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
            PetHealth プレミアム
          </h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
            うちの子の健康管理をもっと便利に
          </p>
        </div>

        <div style={{ padding: "20px 24px 0" }}>
          {/* Pricing toggle */}
          <div
            style={{
              display: "flex",
              background: T.input,
              borderRadius: 12,
              padding: 4,
              marginBottom: 20,
            }}
          >
            <button
              onClick={() => setAnnual(false)}
              className="btnTap"
              style={{
                flex: 1,
                padding: "10px 8px",
                borderRadius: 10,
                border: "none",
                background: !annual ? T.card : "transparent",
                boxShadow: !annual ? T.shadow : "none",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                color: !annual ? T.tx : T.tx2,
              }}
            >
              月額
              <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2 }}>
                ¥300<span style={{ fontSize: 10, fontWeight: 600 }}>/月</span>
              </div>
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="btnTap"
              style={{
                flex: 1,
                padding: "10px 8px",
                borderRadius: 10,
                border: "none",
                background: annual ? T.card : "transparent",
                boxShadow: annual ? T.shadow : "none",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                color: annual ? T.tx : T.tx2,
                position: "relative",
              }}
            >
              {annual && (
                <span
                  style={{
                    position: "absolute",
                    top: -8,
                    right: 8,
                    background: T.rd,
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: 6,
                  }}
                >
                  2ヶ月分お得!
                </span>
              )}
              年額
              <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2 }}>
                ¥2,800<span style={{ fontSize: 10, fontWeight: 600 }}>/年</span>
              </div>
            </button>
          </div>

          {/* Feature comparison */}
          <div style={{ marginBottom: 20 }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: i < FEATURES.length - 1 ? `1px solid ${T.bdr}` : "none",
                }}
              >
                <f.icon size={14} color={T.ac} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: T.tx }}>
                  {f.label}
                </span>
                <span style={{ fontSize: 10, color: T.tx3, fontWeight: 600, textAlign: "center", minWidth: 40 }}>
                  {f.free === true ? (
                    <Check size={14} color={T.gn} />
                  ) : f.free === false ? (
                    <X size={14} color={T.tx3} />
                  ) : (
                    f.free
                  )}
                </span>
                <span style={{ fontSize: 10, color: T.gn, fontWeight: 700, textAlign: "center", minWidth: 40 }}>
                  {f.premium === true ? (
                    <Check size={14} color={T.gn} />
                  ) : (
                    f.premium
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Btn full style={{ padding: "16px 24px", fontSize: 15, fontWeight: 800 }}>
            7日間無料で試す
          </Btn>

          <div style={{ textAlign: "center", marginTop: 12 }}>
            <div style={{ fontSize: 10, color: T.tx3, lineHeight: 1.6 }}>
              無料期間終了後に{annual ? "¥2,800/年" : "¥300/月"}で自動更新されます。
              <br />
              いつでもキャンセル可能です。
            </div>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 16 }}>
              <a href="/terms.html" target="_blank" rel="noopener" style={{ fontSize: 10, color: T.tx3 }}>利用規約</a>
              <a href="/privacy.html" target="_blank" rel="noopener" style={{ fontSize: 10, color: T.tx3 }}>プライバシーポリシー</a>
            </div>
            <button
              style={{
                background: "none",
                border: "none",
                color: T.tx3,
                fontSize: 10,
                cursor: "pointer",
                marginTop: 8,
                padding: 4,
              }}
            >
              購入を復元
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PremiumBanner({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="btnTap cardHover"
      style={{
        background: T.gr,
        borderRadius: 16,
        padding: "14px 18px",
        marginBottom: 12,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: `0 4px 16px ${T.acG}`,
      }}
    >
      <Crown size={22} color="#fff" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>
          プレミアムにアップグレード
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
          7日間無料 ・ 検査比較・レポート出力・無制限
        </div>
      </div>
    </div>
  );
}
