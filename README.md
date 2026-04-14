# 🐾 ペット健康管理アプリ - PetHealth

ラムちゃん・モカちゃんの健康管理PWAアプリ

## 機能

- 🐕 複数ペット管理（切り替え式）
- 💊 お薬管理・投与リマインダー
- 🔬 検査結果記録（異常値ハイライト）
- 📅 通院記録・予防スケジュール
- 🍽️ 食事・フード記録
- ⚖️ 体重推移グラフ
- 💰 医療費累計・カテゴリ別内訳
- 📱 PWA対応（ホーム画面に追加可能）
- 🌙 ダークモード

## ローカル開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

## Renderへのデプロイ手順

### 1. GitHubにリポジトリを作成

```bash
cd pet-health
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pet-health.git
git push -u origin main
```

### 2. Renderでデプロイ

1. [Render](https://render.com) にログイン
2. 「New +」→「Static Site」を選択
3. GitHubリポジトリ「pet-health」を接続
4. 以下を設定：
   - **Name**: pet-health
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. 「Create Static Site」をクリック

### 3. スマホにインストール

デプロイ後、スマホでURLにアクセスして：

**iPhone**: Safari → 共有ボタン → 「ホーム画面に追加」
**Android**: Chrome → メニュー → 「アプリをインストール」

## 技術スタック

- React 18
- Vite
- vite-plugin-pwa
- localStorage（データ永続化）
