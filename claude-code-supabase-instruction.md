# ペット健康管理アプリ - Supabase導入指示

## 概要
現在 `localStorage` で管理しているデータを Supabase に移行する。
- **Supabase Database (PostgreSQL)**: ペット・薬・検査・通院・体重・食事・やることリスト
- **Supabase Storage**: ペットの写真
- **Supabase Auth**: メール認証（家族共有用）

データの永続化とデバイス間の同期を実現する。

---

## 事前準備（人間が行う作業）

### 1. Supabaseプロジェクト作成
1. https://supabase.com にアクセス → GitHubでサインイン
2. 「New Project」をクリック
3. 設定：
   - **Project name**: `pet-health`
   - **Database Password**: 任意（メモしておく）
   - **Region**: `Northeast Asia (Tokyo)`
4. 「Create new project」

### 2. API情報を取得
1. 左メニュー「Settings」→「API」
2. 以下の2つをコピー：
   - **Project URL**: `https://xxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...`

### 3. プロジェクトルートに `.env` ファイルを作成
```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4. Renderの環境変数にも同じ値を設定
Renderのダッシュボード → pet-health → Environment → 以下を追加：
- `VITE_SUPABASE_URL` = 上記のURL
- `VITE_SUPABASE_ANON_KEY` = 上記のキー

### 5. Supabase SQLエディタでテーブル作成
Supabaseダッシュボード → 左メニュー「SQL Editor」→ 以下を実行：

```sql
-- ユーザープロファイル
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ペット
CREATE TABLE pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '🐾',
  photo_url TEXT,
  birth DATE,
  breed TEXT,
  sex TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 診断
CREATE TABLE conditions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  severity TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- お薬
CREATE TABLE meds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  purpose TEXT,
  freq TEXT,
  interval_days INT DEFAULT 1,
  next_dose DATE,
  remaining INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 検査
CREATE TABLE labs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 検査結果（個別項目）
CREATE TABLE lab_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lab_id UUID REFERENCES labs ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  val NUMERIC,
  unit TEXT,
  ref_range TEXT,
  status TEXT DEFAULT 'ok', -- 'ok', 'hi', 'lo'
  note TEXT
);

-- 通院記録
CREATE TABLE visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  clinic TEXT,
  cost INT DEFAULT 0,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 通院明細
CREATE TABLE visit_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visit_id UUID REFERENCES visits ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  amount INT DEFAULT 0
);

-- 体重
CREATE TABLE weights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  value NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 食事
CREATE TABLE foods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  name TEXT NOT NULL,
  amount TEXT,
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- やることリスト
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 予防スケジュール
CREATE TABLE schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS（Row Level Security）有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meds ENABLE ROW LEVEL SECURITY;
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;

-- RLSポリシー：認証ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can CRUD own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can CRUD own pets" ON pets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own conditions" ON conditions FOR ALL USING (pet_id IN (SELECT id FROM pets WHERE user_id = auth.uid()));
CREATE POLICY "Users can CRUD own meds" ON meds FOR ALL USING (pet_id IN (SELECT id FROM pets WHERE user_id = auth.uid()));
CREATE POLICY "Users can CRUD own labs" ON labs FOR ALL USING (pet_id IN (SELECT id FROM pets WHERE user_id = auth.uid()));
CREATE POLICY "Users can CRUD own lab_results" ON lab_results FOR ALL USING (lab_id IN (SELECT id FROM labs WHERE pet_id IN (SELECT id FROM pets WHERE user_id = auth.uid())));
CREATE POLICY "Users can CRUD own visits" ON visits FOR ALL USING (pet_id IN (SELECT id FROM pets WHERE user_id = auth.uid()));
CREATE POLICY "Users can CRUD own visit_items" ON visit_items FOR ALL USING (visit_id IN (SELECT id FROM visits WHERE pet_id IN (SELECT id FROM pets WHERE user_id = auth.uid())));
CREATE POLICY "Users can CRUD own weights" ON weights FOR ALL USING (pet_id IN (SELECT id FROM pets WHERE user_id = auth.uid()));
CREATE POLICY "Users can CRUD own foods" ON foods FOR ALL USING (pet_id IN (SELECT id FROM pets WHERE user_id = auth.uid()));
CREATE POLICY "Users can CRUD own todos" ON todos FOR ALL USING (pet_id IN (SELECT id FROM pets WHERE user_id = auth.uid()));
CREATE POLICY "Users can CRUD own schedule" ON schedule FOR ALL USING (pet_id IN (SELECT id FROM pets WHERE user_id = auth.uid()));
```

### 6. Supabase Storage バケット作成
1. 左メニュー「Storage」→「New bucket」
2. **Name**: `pet-photos`
3. **Public bucket**: ON（写真を表示するため）
4. 「Create bucket」

### 7. Supabase Auth 設定
1. 左メニュー「Authentication」→「Providers」
2. 「Email」が有効になっていることを確認（デフォルトで有効）

---

## Claude Codeへの実装指示

### 1. Supabaseクライアントのインストールと設定

```bash
npm install @supabase/supabase-js
```

`src/lib/supabase.js` を新規作成：
```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 2. 認証コンポーネント作成

`src/components/Auth.jsx` を新規作成。
以下の機能を実装：
- メールアドレス + パスワードでサインアップ
- メールアドレス + パスワードでログイン
- ログアウト
- UIは既存アプリのダークテーマ（またはライトテーマ）に合わせる
- `supabase.auth.onAuthStateChange` でセッション管理

### 3. App.jsx の改修

#### 3.1 認証状態管理
- アプリ起動時に `supabase.auth.getSession()` でログイン状態を確認
- 未ログイン → Auth画面を表示
- ログイン済み → メインアプリを表示

#### 3.2 データ取得・保存をSupabaseに変更
**現在の localStorage 処理をすべて Supabase に置き換える。**

読み込み（useEffect内）：
```js
// 旧: { value: localStorage.getItem("pet-app-v4") }
// 新:
const { data: petsData } = await supabase
  .from('pets')
  .select('*')
  .eq('user_id', user.id);
// 各ペットごとに conditions, meds, labs, visits, weights, foods, todos, schedule を取得
```

書き込み（各操作ごと）：
```js
// 旧: localStorage.setItem("pet-app-v4", JSON.stringify(d))
// 新: 各テーブルに個別にinsert/update/delete
// 例: 体重追加
const { data, error } = await supabase
  .from('weights')
  .insert({ pet_id: currentPetId, date: '2026-04-14', value: 7.2 });
```

#### 3.3 写真アップロードをSupabase Storageに変更
```js
// 旧: FileReaderでbase64変換してstateに保存
// 新:
const filePath = `${user.id}/${petId}/${Date.now()}.jpg`;
const { data, error } = await supabase.storage
  .from('pet-photos')
  .upload(filePath, file);

// URL取得
const { data: { publicUrl } } = supabase.storage
  .from('pet-photos')
  .getPublicUrl(filePath);

// pets テーブルの photo_url を更新
await supabase
  .from('pets')
  .update({ photo_url: publicUrl })
  .eq('id', petId);
```

#### 3.4 データ操作のマッピング

| 操作 | 旧（localStorage） | 新（Supabase） |
|------|-----|-----|
| ペット追加 | setPets([...pets, newPet]) | supabase.from('pets').insert({...}) |
| ペット削除 | setPets(filter) | supabase.from('pets').delete().eq('id', id) |
| 診断追加 | setPet内でconditions追加 | supabase.from('conditions').insert({...}) |
| 診断削除 | setPet内でfilter | supabase.from('conditions').delete().eq('id', id) |
| 薬追加 | setPet内でmeds追加 | supabase.from('meds').insert({...}) |
| 薬削除 | setPet内でfilter | supabase.from('meds').delete().eq('id', id) |
| 投与記録 | setPet内でnext/remaining更新 | supabase.from('meds').update({next_dose, remaining}).eq('id', id) |
| 検査追加 | setPet内でlabs追加 | supabase.from('labs').insert({...}) → lab_results.insert([...]) |
| 検査削除 | setPet内でfilter | supabase.from('labs').delete().eq('id', id) ※lab_resultsはCASCADE |
| 通院追加 | setPet内でvisits追加 | supabase.from('visits').insert({...}) → visit_items.insert([...]) |
| 通院削除 | setPet内でfilter | supabase.from('visits').delete().eq('id', id) |
| 体重追加 | setPet内でweights追加 | supabase.from('weights').insert({...}) |
| 体重削除 | setPet内でfilter | supabase.from('weights').delete().eq('id', id) |
| 食事追加 | setPet内でfoods追加 | supabase.from('foods').insert({...}) |
| 食事削除 | setPet内でfilter | supabase.from('foods').delete().eq('id', id) |
| やること追加 | setPet内でtodos追加 | supabase.from('todos').insert({...}) |
| やること削除 | setPet内でfilter | supabase.from('todos').delete().eq('id', id) |
| やること完了 | setPet内でdone切替 | supabase.from('todos').update({done}).eq('id', id) |
| スケジュール追加 | setPet内でschedule追加 | supabase.from('schedule').insert({...}) |
| スケジュール削除 | setPet内でfilter | supabase.from('schedule').delete().eq('id', id) |
| 写真設定 | FileReader→state | Storage.upload → pets.update({photo_url}) |

### 4. データ読み込みヘルパー関数

`src/lib/data.js` を新規作成し、以下のヘルパー関数を実装：

```js
import { supabase } from './supabase'

// ペット一覧取得（全リレーション込み）
export async function fetchPets(userId) {
  const { data: pets } = await supabase
    .from('pets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at');

  // 各ペットにリレーションデータを付与
  for (const pet of pets) {
    const [conditions, meds, labs, visits, weights, foods, todos, schedule] = await Promise.all([
      supabase.from('conditions').select('*').eq('pet_id', pet.id),
      supabase.from('meds').select('*').eq('pet_id', pet.id),
      supabase.from('labs').select('*, lab_results(*)').eq('pet_id', pet.id).order('date', { ascending: false }),
      supabase.from('visits').select('*, visit_items(*)').eq('pet_id', pet.id).order('date', { ascending: false }),
      supabase.from('weights').select('*').eq('pet_id', pet.id).order('date'),
      supabase.from('foods').select('*').eq('pet_id', pet.id).order('created_at', { ascending: false }),
      supabase.from('todos').select('*').eq('pet_id', pet.id).order('created_at'),
      supabase.from('schedule').select('*').eq('pet_id', pet.id).order('date'),
    ]);
    pet.conditions = conditions.data || [];
    pet.meds = meds.data || [];
    pet.labs = (labs.data || []).map(l => ({ ...l, results: l.lab_results || [] }));
    pet.visits = (visits.data || []).map(v => ({ ...v, items: v.visit_items || [] }));
    pet.weights = weights.data || [];
    pet.foods = foods.data || [];
    pet.todos = todos.data || [];
    pet.schedule = schedule.data || [];
  }
  return pets;
}
```

### 5. 初期データの投入

初回ログイン時（petsが0件の場合）、既存のINIT_PETSデータをSupabaseに投入する関数を作成：

```js
export async function seedInitialData(userId) {
  // INIT_PETSの各ペットをinsert
  // 各ペットのconditions, meds, labs, visits等もそれぞれinsert
  // 検査結果はlabs insert後にlab_idを使ってlab_resultsをinsert
  // 通院明細はvisits insert後にvisit_idを使ってvisit_itemsをinsert
}
```

### 6. .gitignore に `.env` を追加

```
node_modules
dist
.DS_Store
*.local
.env
```

---

## テスト手順

1. `npm run dev` でローカル起動
2. サインアップ → メール確認 → ログイン
3. 初期データ（ラムちゃん・モカちゃん）が表示されることを確認
4. 各操作（追加・削除・編集）がSupabaseに反映されることを確認
5. 写真アップロードが動くことを確認
6. 別ブラウザ/デバイスで同じアカウントにログインし、データが同期されることを確認
7. `npm run build` でビルドエラーがないことを確認
8. `git add . && git commit -m "feat: migrate to supabase" && git push`

---

## 注意事項

- `.env` は絶対にGitHubにpushしない（.gitignoreに入っていること）
- Renderには環境変数として設定する
- Supabaseの `anon key` はクライアントに公開される前提のキー。RLSで保護されているので安全
- テストモードのRLSポリシーは上記SQLで設定済み。本番運用時はさらに厳格化を検討
