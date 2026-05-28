import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp } from './Icons';

const AuthScreen = ({ authView, setAuthView, authLoading, setAuthLoading, authError, setAuthError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) { setAuthError('Enter your email address first.'); return; }
    setResetLoading(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setResetSent(true);
    } catch (err) {
      setAuthError(err.message || 'Failed to send reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authView === 'signup') {
        if (password !== confirmPassword) {
          setAuthError('Passwords do not match.');
          setAuthLoading(false);
          return;
        }
        const passwordValid =
          password.length >= 10 &&
          /[A-Z]/.test(password) &&
          /[a-z]/.test(password) &&
          /[0-9]/.test(password) &&
          /[^A-Za-z0-9]/.test(password);
        if (!passwordValid) {
          setAuthError('Password must be at least 10 characters and include uppercase, lowercase, a number, and a special character.');
          setAuthLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSignUpSuccess(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setAuthError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const switchView = (newView) => {
    setAuthView(newView);
    setAuthError('');
    setSignUpSuccess(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2027 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{ maxWidth: '420px', width: '100%' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
            borderRadius: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <TrendingUp size={28} color="white" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'white', margin: '0 0 8px' }}>
            Migo
          </h1>
          <p style={{ fontSize: '15px', color: '#94a3b8', margin: 0 }}>
            Your financial literacy companion
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)'
        }}>
          {authView === 'forgotPassword' ? (
            <div style={{ padding: '8px 0' }}>
              <button
                onClick={() => switchView('signin')}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer', padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                ← Back to Sign In
              </button>
              {resetSent ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>Check your email</h2>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '24px' }}>
                    We sent a password reset link to <strong>{email}</strong>.
                  </p>
                  <button
                    onClick={() => { setResetSent(false); switchView('signin'); }}
                    style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Reset your password</h2>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
                    Enter your email and we'll send you a reset link.
                  </p>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      style={{ width: '100%', padding: '12px 14px', fontSize: '15px', border: '1.5px solid #e2e8f0', borderRadius: '10px', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={(e) => e.target.style.borderColor = '#10b981'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                  {authError && (
                    <div style={{ marginBottom: '16px', padding: '12px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px', color: '#dc2626' }}>
                      {authError}
                    </div>
                  )}
                  <button
                    onClick={handleResetPassword}
                    disabled={resetLoading}
                    style={{ width: '100%', padding: '14px', background: resetLoading ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: resetLoading ? 'not-allowed' : 'pointer' }}
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </>
              )}
            </div>
          ) : signUpSuccess ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
                Check your email
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '24px' }}>
                We sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account, then sign in.
              </p>
              <button
                onClick={() => { setSignUpSuccess(false); switchView('signin'); }}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <>
              {/* Tab Toggle */}
              <div style={{
                display: 'flex',
                background: '#f1f5f9',
                borderRadius: '10px',
                padding: '4px',
                marginBottom: '28px'
              }}>
                {['signin', 'signup'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => switchView(tab)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: authView === tab ? '#1e293b' : '#64748b',
                      background: authView === tab ? 'white' : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      boxShadow: authView === tab ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab === 'signin' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontSize: '15px',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '10px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Password */}
                <div style={{ marginBottom: authView === 'signup' ? '16px' : '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontSize: '15px',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '10px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                  {authView === 'signup' && password.length > 0 && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {[
                        { label: 'At least 10 characters', met: password.length >= 10 },
                        { label: 'Uppercase letter (A–Z)', met: /[A-Z]/.test(password) },
                        { label: 'Lowercase letter (a–z)', met: /[a-z]/.test(password) },
                        { label: 'Number (0–9)', met: /[0-9]/.test(password) },
                        { label: 'Special character (!@#$...)', met: /[^A-Za-z0-9]/.test(password) },
                      ].map((rule, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: rule.met ? '#059669' : '#94a3b8' }}>
                          <span style={{ fontWeight: '700' }}>{rule.met ? '✓' : '○'}</span>
                          <span>{rule.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password (signup only) */}
                {authView === 'signup' && (
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: '15px',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '10px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#10b981'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                )}

                {/* Forgot password link (sign-in only) */}
                {authView === 'signin' && (
                  <div style={{ textAlign: 'right', marginBottom: '20px', marginTop: '-16px' }}>
                    <button
                      type="button"
                      onClick={() => { switchView('forgotPassword'); setResetSent(false); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#10b981',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Error */}
                {authError && (
                  <div style={{
                    marginBottom: '16px',
                    padding: '12px 14px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#dc2626'
                  }}>
                    {authError}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: authLoading
                      ? '#94a3b8'
                      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: authLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {authLoading
                    ? (authView === 'signin' ? 'Signing in...' : 'Creating account...')
                    : (authView === 'signin' ? 'Sign In' : 'Create Account')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


export default AuthScreen;
