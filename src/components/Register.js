import React, { useState } from 'react';
import { useRegisterMutation } from '../api/apiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';

export default function Register({ onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (email.length > 50) {
      setError('Email address is too long. Please use a shorter email address (maximum 50 characters).');
      return;
    }
    try {
      const result = await register({ name, email, password }).unwrap();
      setSuccess(true);
      dispatch(setCredentials({ token: result.token, user: result.user }));
      if (onSuccess) onSuccess(result);
    } catch (err) {
      setError(err.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-auth">
      <div className="form-field">
        <label htmlFor="register-name" className="form-label">Full name</label>
        <input id="register-name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" autoComplete="name" disabled={isLoading} className="form-input" />
      </div>
      <div className="form-field">
        <label htmlFor="register-email" className="form-label">Email</label>
        <input id="register-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" type="email" disabled={isLoading} maxLength={50} className="form-input" />
      </div>
      <div className="form-field">
        <label htmlFor="register-password" className="form-label">Password (min 6 characters)</label>
        <input id="register-password" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" autoComplete="new-password" disabled={isLoading} className="form-input" />
      </div>
      <button type="submit" disabled={isLoading} className="btn-auth">
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Registration successful! Welcome email sent.</div>}
    </form>
  );
}
