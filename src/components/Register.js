import React, { useState } from 'react';
import styled from 'styled-components';
// import { useRegisterMutation } from '../api/apiSlice'; // To be implemented

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

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [register, { isLoading, error }] = useRegisterMutation();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // TODO: Call registration API
    setSuccess(true);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Full Name"
        autoComplete="name"
      />
      <Input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="email"
        type="email"
      />
      <Input
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        autoComplete="new-password"
      />
      <Button type="submit">Register</Button>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {success && <SuccessMsg>Registration successful!</SuccessMsg>}
    </Form>
  );
} 