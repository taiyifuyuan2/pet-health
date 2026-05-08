import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { T, css } from '../theme';

export default function Auth() {
  const [mode, setMode] = useState('login'); // login, signup, reset
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
      if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setMessage('パスワードリセットメールを送信しました。メールをご確認ください。');
      } else if (mode === 'signup') {
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

  const handleOAuth = async (provider) => {
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
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

  const oauthBtnStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: `1.5px solid ${T.bdr}`,
    background: T.card,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    color: T.tx,
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
            {mode === 'login' ? 'おかえりなさい' : mode === 'signup' ? '新しい家族を迎えましょう' : 'パスワードをリセット'}
          </p>
        </div>

        {mode !== 'reset' && (
          <div style={{ marginBottom: 18 }}>
            <button
              onClick={() => handleOAuth('google')}
              className="btnTap"
              style={oauthBtnStyle}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Googleでログイン
            </button>
            <button
              onClick={() => handleOAuth('apple')}
              className="btnTap"
              style={{ ...oauthBtnStyle, marginTop: 8 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={T.tx}><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Apple IDでログイン
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
              <div style={{ flex: 1, height: 1, background: T.bdr }} />
              <span style={{ fontSize: 11, color: T.tx3, fontWeight: 600 }}>または</span>
              <div style={{ flex: 1, height: 1, background: T.bdr }} />
            </div>
          </div>
        )}

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

          {mode !== 'reset' && (
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
          )}

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
            {loading
              ? '処理中...'
              : mode === 'login'
              ? 'ログイン'
              : mode === 'signup'
              ? 'アカウント作成'
              : 'リセットメール送信'}
          </button>
        </form>

        {mode === 'login' && (
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <button
              onClick={() => { setMode('reset'); setError(''); setMessage(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: T.tx3,
                fontSize: 11,
                cursor: 'pointer',
                fontWeight: 600,
                padding: 4,
              }}
            >
              パスワードをお忘れですか？
            </button>
          </div>
        )}

        <div style={{ marginTop: mode === 'login' ? 8 : 18, textAlign: 'center' }}>
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
            {mode === 'login'
              ? 'アカウントをお持ちでない方はこちら'
              : 'すでにアカウントをお持ちの方はこちら'}
          </button>
        </div>
      </div>
    </div>
  );
}
