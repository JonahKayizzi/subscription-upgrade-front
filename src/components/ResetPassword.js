import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useResetPasswordMutation } from '../api/apiSlice';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPassword, { isLoading, isSuccess, error }] = useResetPasswordMutation();
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!token) {
      setLocalError('Missing reset link. Please use the link from your email.');
      return;
    }
    if (!newPassword || !confirmPassword) {
      setLocalError('Please enter and confirm your new password.');
      return;
    }
    if (newPassword.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    try {
      await resetPassword({ token, newPassword }).unwrap();
    } catch (err) {
      // Error shown via error state
    }
  };

  if (!token) {
    return (
      <div className="app-landing" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
          <h2 style={{ marginBottom: 12, color: '#0f172a', fontSize: '1.5rem', fontWeight: 700 }}>Invalid reset link</h2>
          <p style={{ marginBottom: 24, color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>
            This link is missing or invalid. Request a new password reset from the sign-in page.
          </p>
          <Link to="/forgot-password" style={{ color: '#2563eb', fontSize: '0.95rem', fontWeight: 500, textDecoration: 'underline' }}>Request new reset link</Link>
          <br />
          <Link to="/" style={{ color: '#2563eb', fontSize: '0.95rem', marginTop: 12, display: 'inline-block', fontWeight: 500, textDecoration: 'underline' }}>Back to sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-landing" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 420, width: '100%' }}>
        <h2 style={{ marginBottom: 8, color: '#0f172a', fontSize: '1.5rem', fontWeight: 700 }}>Set new password</h2>
        <p style={{ marginBottom: 24, color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>
          Enter your new password below.
        </p>
        {isSuccess ? (
          <div style={{ padding: 16, background: 'rgba(16, 185, 129, 0.15)', borderRadius: 8, marginBottom: 16, color: '#047857', fontWeight: 500 }}>
            Your password has been reset. You can now sign in with your new password.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-auth">
            <div className="form-field">
              <label htmlFor="new-password" className="form-label" style={{ color: '#334155', fontWeight: 600 }}>New password</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className="form-input"
                minLength={6}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="confirm-password" className="form-label" style={{ color: '#334155', fontWeight: 600 }}>Confirm new password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                autoComplete="new-password"
                className="form-input"
                minLength={6}
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn-auth">
              {isLoading ? 'Updating...' : 'Reset password'}
            </button>
            {(localError || error) && (
              <div className="error-message" style={{ marginTop: 12, color: '#b91c1c' }}>
                {localError || error?.data?.error || 'Something went wrong. The link may have expired.'}
              </div>
            )}
          </form>
        )}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link to="/" style={{ color: '#2563eb', fontSize: '0.95rem', fontWeight: 500, textDecoration: 'underline' }}>Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
