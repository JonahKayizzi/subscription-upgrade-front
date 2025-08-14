import React, { useState } from 'react';
import styled from 'styled-components';
import { useRegisterMutation } from '../api/apiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';

const Form = styled.form`
  max-width: 340px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #2d2156;
  background: #231942;
  color: #fff;
  font-size: 1rem;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border-color: #a259f7;
    box-shadow: 0 0 0 2px #a259f733;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 0;
  border-radius: 8px;
  border: none;
  background: #f7b801;
  color: #231942;
  font-weight: 700;
  font-size: 1.08rem;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #ffd700;
    color: #1a1333;
  }
`;

const ErrorMsg = styled.div`
  color: #ff4d4f;
  margin-top: 4px;
  text-align: center;
`;

const SuccessMsg = styled.div`
  color: #22c55e;
  margin-top: 4px;
  text-align: center;
`;

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
      
      // Store the credentials in Redux
      dispatch(setCredentials({
        token: result.token,
        user: result.user
      }));
      
      // Call the onSuccess callback with the user data
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      setError(err.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Full Name"
        autoComplete="name"
        disabled={isLoading}
      />
      <Input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="email"
        type="email"
        disabled={isLoading}
        maxLength={50}
      />
      <Input
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        placeholder="Password (min 6 characters)"
        autoComplete="new-password"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register'}
      </Button>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {success && <SuccessMsg>Registration successful! Welcome email sent.</SuccessMsg>}
    </Form>
  );
} 