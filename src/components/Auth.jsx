import { useState } from 'react';
import { supabase } from '../lib/supabase';

const T = {
  bg: "#f7f6f3",
  card: "#ffffff",
  input: "#f0eeea",
  bdr: "#e4e0d8",
  tx: "#2d2a24",
  tx2: "#7a7468",
  tx3: "#a09888",
  ac: "#7c5bf5",
  acG: "rgba(124,91,245,0.08)",
  rd: "#dc2626",
  rdB: "#fee2e2",
  gn: "#16a34a",
  gr: "linear-gradient(135deg,#7c5bf5,#6366f1,#8b5cf6)",
};

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('確認メールを送信しました。メールをご確認ください。');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'メールアドレスまたはパスワードが正しくありません'
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      fontFamily: "'Inter','Hiragino Kaku Gothic ProN',sans-serif",
    }}>
      <div style={{
        background: T.card,
        borderRadius: 16,
        border: `1px solid ${T.bdr}`,
        padding: 28,
        maxWidth: 360,
        width: '100%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🐾</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: T.tx, margin: 0 }}>
            ペット健康管理
          </h1>
          <p style={{ fontSize: 12, color: T.tx2, marginTop: 4 }}>
            {mode === 'login' ? 'ログインしてください' : 'アカウントを作成'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 11, color: T.tx2, marginBottom: 4, fontWeight: 600 }}>
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: `1px solid ${T.bdr}`,
                background: T.input,
                color: T.tx,
                fontSize: 14,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
              placeholder="example@email.com"
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, color: T.tx2, marginBottom: 4, fontWeight: 600 }}>
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: `1px solid ${T.bdr}`,
                background: T.input,
                color: T.tx,
                fontSize: 14,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
              placeholder="6文字以上"
            />
          </div>

          {error && (
            <div style={{
              background: T.rdB,
              color: T.rd,
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 12,
              marginBottom: 12,
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{
              background: T.acG,
              color: T.ac,
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 12,
              marginBottom: 12,
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: 'none',
              background: T.gr,
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '処理中...' : mode === 'login' ? 'ログイン' : 'アカウント作成'}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
              setMessage('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: T.ac,
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {mode === 'login'
              ? 'アカウントをお持ちでない方はこちら'
              : 'すでにアカウントをお持ちの方はこちら'}
          </button>
        </div>
      </div>
    </div>
  );
}
