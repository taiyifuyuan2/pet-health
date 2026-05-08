import { useState } from "react";
import { Heart, BarChart3, Cloud, ChevronRight, ChevronLeft } from "lucide-react";
import { T } from "../theme";

const SLIDES = [
  {
    icon: Heart,
    color: T.ac,
    title: "うちの子の健康、まるごと管理",
    desc: "投薬リマインダー、通院記録、体重管理、検査結果…\nペットの健康情報をひとつのアプリにまとめましょう。",
  },
  {
    icon: BarChart3,
    color: T.bl,
    title: "検査結果を前回と自動比較",
    desc: "血液検査の数値を前回と並べて変化を可視化。\n体重トレンドで減量ペースと目標達成を予測します。",
  },
  {
    icon: Cloud,
    color: T.gn,
    title: "クラウド同期で安心",
    desc: "データはクラウドに自動保存。\n機種変更しても、家族とのデータ共有も安心です。",
  },
];

export default function Onboarding({ onComplete }) {
  const [page, setPage] = useState(0);
  const isLast = page === SLIDES.length - 1;
  const slide = SLIDES[page];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.grWarm,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-15%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: T.acL,
          filter: "blur(80px)",
          opacity: 0.6,
        }}
      />

      <button
        onClick={onComplete}
        style={{
          position: "absolute",
          top: 16,
          right: 20,
          background: "none",
          border: "none",
          color: T.tx2,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          padding: "8px 12px",
          zIndex: 2,
        }}
      >
        スキップ
      </button>

      <div
        key={page}
        className="fadeIn"
        style={{
          textAlign: "center",
          maxWidth: 360,
          position: "relative",
          zIndex: 1,
          animation: "fadeIn .35s ease-out",
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: `${slide.color}15`,
            margin: "0 auto 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <slide.icon size={40} color={slide.color} />
        </div>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: T.tx,
            marginBottom: 14,
            letterSpacing: "-0.02em",
            lineHeight: 1.4,
          }}
        >
          {slide.title}
        </h1>
        <p
          style={{
            fontSize: 14,
            color: T.tx2,
            lineHeight: 1.8,
            fontWeight: 500,
            whiteSpace: "pre-line",
          }}
        >
          {slide.desc}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 40,
          position: "relative",
          zIndex: 1,
        }}
      >
        {SLIDES.map((_, i) => (
          <div
            key={i}
            style={{
              width: page === i ? 24 : 8,
              height: 8,
              borderRadius: 8,
              background: page === i ? T.ac : T.bdr2,
              transition: "all .3s",
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 32,
          width: "100%",
          maxWidth: 360,
          position: "relative",
          zIndex: 1,
        }}
      >
        {page > 0 && (
          <button
            onClick={() => setPage(page - 1)}
            className="btnTap"
            style={{
              flex: 1,
              padding: "14px 20px",
              borderRadius: 14,
              border: `1.5px solid ${T.bdr}`,
              background: T.card,
              color: T.tx2,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <ChevronLeft size={16} /> 戻る
          </button>
        )}
        <button
          onClick={() => (isLast ? onComplete() : setPage(page + 1))}
          className="btnTap"
          style={{
            flex: 1,
            padding: "14px 20px",
            borderRadius: 14,
            border: "none",
            background: T.gr,
            color: "#fff",
            fontSize: 14,
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: `0 4px 16px ${T.acG}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {isLast ? "はじめる" : "次へ"} {!isLast && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
}
