# ペット健康管理アプリ - UIUX大幅改善指示

## 概要
現在の `src/App.jsx` のUIUXを大幅に改善する。機能・ロジック・Supabase連携は一切変更しない。
見た目と操作感のみを改善する。

## デザイン方針
- **モダンで温かみのある明るいUI**（ペットアプリらしい親しみやすさ）
- **余白・spacing を大きく取る**（現状は詰まりすぎ）
- **カードに軽いシャドウ**を付けて奥行き感を出す
- **フォントを Noto Sans JP** に変更（日本語に最適）
- **アイコンを絵文字からSVGアイコン的な表現**に格上げ
- **タブバーを下部固定**に（スマホ操作しやすい）
- **色使いをもう少し柔らかく**（ペットアプリらしい暖色系アクセント）
- **トランジション・マイクロアニメーション**を追加

---

## 具体的な変更内容

### 1. テーマカラー変更

```js
const T = {
  bg: "#faf8f5",
  card: "#ffffff",
  card2: "#f8f6f2",
  input: "#f3f1ed",
  bdr: "#ebe7df",
  bdr2: "#ddd8ce",
  tx: "#1a1814",
  tx2: "#6b6560",
  tx3: "#a8a29e",
  ac: "#6d5ccd",         // 少し落ち着いた紫
  acG: "rgba(109,92,205,0.07)",
  acL: "#ede8ff",        // アクセント薄い背景
  gn: "#059669",
  gnB: "#ecfdf5",
  rd: "#e11d48",
  rdB: "#fff1f2",
  am: "#ca8a04",
  amB: "#fefce8",
  bl: "#2563eb",
  cy: "#0891b2",
  gr: "linear-gradient(135deg,#6d5ccd,#8b7cf0)",
  shadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
  shadowHover: "0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.05)",
};
```

### 2. CSS / フォント変更

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; }
::-webkit-scrollbar { display: none; }

body {
  font-family: 'Noto Sans JP', sans-serif;
  -webkit-font-smoothing: antialiased;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade { animation: fadeIn 0.3s ease-out; }
```

### 3. Card コンポーネント改善

- `border` を薄くするか削除
- `box-shadow: T.shadow` をデフォルトで追加
- `border-radius: 16px` に拡大
- `padding: 16px` に増加
- ホバー時に軽く浮く: `transform: translateY(-1px)`, `box-shadow: T.shadowHover`

### 4. タブバーを下部固定に変更

```
現在: ヘッダー下にスクロール式タブ
変更: 画面下部にposition:fixedでタブバーを固定配置
```

- 下部タブバーの高さ: 56px
- コンテンツのpaddingBottomを56px + 余白に
- 選択中のタブは `background` のピルシェイプで囲む
- タブアイコンサイズ: 20px、ラベル: 10px
- 最大5つ表示（残りはスクロールまたは「もっと」メニュー）
  - 表示: ホーム、お薬、検査、通院、もっと（食事・体重・費用・設定をドロワーで表示）

### 5. ヘッダー改善

- 背景にほんのり暖色グラデーション: `linear-gradient(135deg, #f5f0ff 0%, #faf8f5 100%)`
- ペット写真を丸形に（border-radius: 50%）、56x56px
- 写真にリング装飾: `border: 3px solid ${T.acL}`
- 名前フォントサイズ: 20px, fontWeight: 800
- ペット切り替えはヘッダー内の名前タップでドロップダウン表示に変更（上部のタブを廃止）

### 6. ペット切り替えUI改善

現在の上部タブ式を廃止し、以下に変更：
- ヘッダーのペット名の右に `▼` を表示
- タップするとドロップダウンメニューが開く（他のペット一覧 + 「＋追加」）
- ドロップダウンには写真・名前・年齢を表示

### 7. ダッシュボード改善

#### 投薬リマインダーカード
- アクセントカラーのグラデーション背景に白テキスト
- 「投与記録」ボタンを目立つように

#### サマリーカード（診断数・異常値・累計費用）
- 3カラムのまま、ただし各カードにアイコン背景（薄い色の円形）を追加
- 数値フォントを大きく（24px, weight 800）

#### 減量進捗バー
- バーを太めに（height: 10px）
- 開始値・目標値のラベルを見やすく
- バー上に現在値のドットインジケータ

#### 診断カード
- 2列グリッドは維持
- 各カードの左に色付きの縦線（4px）を追加（severity別の色）
- 削除ボタンは普段は非表示、カード長押し or スワイプで表示

#### やることリスト
- チェックボックスをもっと大きく（24x24px）
- 完了時に打ち消し線 + フェードアウトアニメーション
- 左スワイプで削除（モバイル向け）
- 空のときのイラスト的な表示を改善

### 8. モーダル改善

- 下からスライドアップするシート形式（モバイルフレンドリー）
- `border-radius: 24px 24px 0 0`（上だけ丸く）
- 上部にドラッグハンドル（グレーの小さいバー）
- 背景のblurを強めに: `backdropFilter: blur(12px)`
- フォーム内のspacingを広く

### 9. ボタン改善

- プライマリボタン: `border-radius: 12px`, `padding: 12px 24px`
- ホバー時: 少し暗く + 軽くスケール
- タップ時: スケールダウン（0.97）のフィードバック
- ゴーストボタン: ボーダーをもう少し太く

### 10. 入力フィールド改善

- `border-radius: 12px`
- `padding: 12px 16px`
- フォーカス時: ボーダーのカラー変更 + 薄いシャドウグロー
- ラベルをフィールド上に浮かせるデザイン（オプション）

### 11. お薬タブ改善

- 各薬カードにタイムライン的な表示（投与履歴のドット）
- 次回投与日を大きく目立たせる
- 残数がが少ない時の警告をもっと目立つように（赤い枠線 + アイコン）

### 12. 検査結果タブ改善

- 異常値をカード形式ではなく、シンプルなリストに
- 各項目の右に小さなインラインバー（基準範囲内のどこに値があるか視覚化）
- 基準値内の項目はアコーディオンで折りたたみ（現状維持でOK）

### 13. 体重タブ改善

- チャートをもっと大きく表示（高さ180px以上）
- 各データポイントをタップで詳細表示
- 目標線を点線で常に表示
- 直近の推移（+0.2kgとか-0.3kg）を色付きで表示

### 14. 通院タブ改善

- タイムライン形式で表示（左に縦線 + 日付ドット）
- 今後の予定と過去の履歴を視覚的に区別

### 15. 費用タブ改善

- 上部にドーナツチャート or 棒グラフ（カテゴリ別）
- 月別の推移も表示できるとベスト

### 16. 設定タブ改善

- プロフィールカードを大きめに（写真 80x80px）
- アカウント情報、かかりつけ医情報をきれいに表示
- ログアウトボタンは一番下に赤系で

### 17. 空ステート改善

各タブでデータがない時の表示を改善：
- シンプルなイラスト的SVG or 大きな絵文字
- 「ここに〇〇が表示されます」的なガイドテキスト
- 追加ボタンをEmptyコンポーネント内にも表示

### 18. ローディング改善

- スケルトンローディング（カード形状のプレースホルダー）
- 保存中インジケータをトースト通知に変更（画面下部に一時表示）

---

## 実装上の注意

- `src/App.jsx` のUI部分のみ変更。Supabase連携のロジック（handlers）は一切触らない
- `src/components/Auth.jsx` の認証UIも同じテーマに合わせて改善する
- `src/lib/supabase.js` と `src/lib/data.js` は変更しない
- 外部ライブラリの追加は最小限に（recharts等のチャートライブラリはOK）
- 全体で900行を超える場合は、コンポーネントをファイル分割する:
  - `src/components/Dashboard.jsx`
  - `src/components/Meds.jsx`
  - `src/components/Labs.jsx`
  - `src/components/Calendar.jsx`
  - `src/components/Food.jsx`
  - `src/components/Weight.jsx`
  - `src/components/Cost.jsx`
  - `src/components/Settings.jsx`
  - `src/components/BottomNav.jsx`
  - `src/components/PetSwitcher.jsx`
  - `src/components/ui/Card.jsx` (等のプリミティブ)

## テスト

変更後に以下を確認：
1. `npm run dev` でエラーなく表示されること
2. 全タブが正しく表示されること
3. データのCRUDが引き続き動作すること
4. スマホサイズ（375px幅）で問題なく表示されること
5. `npm run build` でビルドエラーがないこと

完了後：
```bash
git add .
git commit -m "feat: major UIUX redesign"
git push
```
