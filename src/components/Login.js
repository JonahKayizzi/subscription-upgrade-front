import React, { useState } from 'react';
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
      dispatch(setCredentials({ token: result.token }));
      // Optionally redirect or show success
    } catch (err) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: '2rem auto' }}>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        style={{ display: 'block', width: '100%', marginBottom: 8 }}
      />
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        style={{ display: 'block', width: '100%', marginBottom: 8 }}
      />
      <button type="submit" disabled={isLoading} style={{ width: '100%' }}>Login</button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>Login failed</div>}
    </form>
  );
} 