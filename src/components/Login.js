import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoginMutation } from '../api/apiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials({ token: result.token, user: result.user }));
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-auth">
      <div className="form-field">
        <label htmlFor="login-email" className="form-label">Email</label>
        <input id="login-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" type="email" className="form-input" />
      </div>
      <div className="form-field">
        <label htmlFor="login-password" className="form-label">Password</label>
        <input id="login-password" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" autoComplete="current-password" className="form-input" />
      </div>
      <div style={{ marginBottom: 12, fontSize: '0.9rem' }}>
        <Link to="/forgot-password" style={{ color: 'var(--color-accent2)' }}>Forgot password?</Link>
      </div>
      <button type="submit" disabled={isLoading} className="btn-auth">
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
      {error && <div className="error-message">{error.data?.error || error.data?.message || 'Login failed. Please check your credentials.'}</div>}
    </form>
  );
}
