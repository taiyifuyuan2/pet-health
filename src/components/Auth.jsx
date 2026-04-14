import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { T, css } from '../theme';

export default function Auth() {
  const [mode, setMode] = useState('login');
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
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('確認メールを送信しました。メールをご確認ください。');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'メールアドレスまたはパスワードが正しくありません'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: `1.5px solid ${T.bdr}`,
    background: T.card,
    color: T.tx,
    fontSize: 14,
    boxSizing: 'border-box',
    transition: 'all .15s',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.grWarm,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{css}</style>
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-15%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: T.acL,
          filter: 'blur(80px)',
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: '#ffe4f0',
          filter: 'blur(80px)',
          opacity: 0.5,
        }}
      />
      <div
        className="slideUp"
        style={{
          background: T.card,
          borderRadius: 24,
          padding: '36px 28px',
          maxWidth: 380,
          width: '100%',
          boxShadow: '0 20px 60px rgba(20,16,24,0.12), 0 4px 16px rgba(20,16,24,0.04)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: T.gr,
              margin: '0 auto 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              boxShadow: `0 10px 30px ${T.acG}`,
            }}
          >
            🐾
          </div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: T.tx,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            ペット健康管理
          </h1>
          <p style={{ fontSize: 13, color: T.tx2, marginTop: 6, fontWeight: 500 }}>
            {mode === 'login' ? 'おかえりなさい 🐶' : '新しい家族を迎えましょう ✨'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                color: T.tx2,
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="example@email.com"
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                color: T.tx2,
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={inputStyle}
              placeholder="6文字以上"
            />
          </div>

          {error && (
            <div
              style={{
                background: T.rdB,
                color: T.rd,
                padding: '10px 14px',
                borderRadius: 12,
                fontSize: 12,
                marginBottom: 14,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          {message && (
            <div
              style={{
                background: T.gnB,
                color: T.gn,
                padding: '10px 14px',
                borderRadius: 12,
                fontSize: 12,
                marginBottom: 14,
                fontWeight: 600,
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btnTap"
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 12,
              border: 'none',
              background: T.gr,
              color: '#fff',
              fontSize: 14,
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: `0 4px 16px ${T.acG}`,
              letterSpacing: '0.02em',
            }}
          >
            {loading ? '処理中...' : mode === 'login' ? 'ログイン' : 'アカウント作成'}
          </button>
        </form>

        <div style={{ marginTop: 18, textAlign: 'center' }}>
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
              fontWeight: 600,
              padding: 6,
            }}
          >
            {mode === 'login' ? 'アカウントをお持ちでない方はこちら' : 'すでにアカウントをお持ちの方はこちら'}
          </button>
        </div>
      </div>
    </div>
  );
}
