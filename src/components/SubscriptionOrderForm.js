import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { useSelector } from 'react-redux';
import Login from './Login';
import Register from './Register';

const Card = styled.div`
  background: var(--color-background-card);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 32px 32px 24px 32px;
  min-width: 420px;
  max-width: 700px;
  margin: 0 auto;
  color: var(--color-text);
`;

const Title = styled.h2`
  margin: 0 0 24px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary, #3B82F6);
  text-align: center;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  label {
    font-size: 0.95rem;
    color: var(--color-text-muted);
    margin-bottom: 6px;
    font-weight: 500;
  }
  input, select {
    padding: 10px 12px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-background);
    color: var(--color-text);
    font-size: 1rem;
    &:focus {
      outline: none;
      border-color: var(--color-accent2);
      box-shadow: 0 0 0 2px var(--color-accent2, rgba(162, 89, 247, 0.15));
    }
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  gap: 16px;
`;

const ErrorText = styled.div`
  color: var(--color-error, #e53e3e);
  margin-bottom: 12px;
  text-align: center;
`;

const PUBLICATIONS = [
  { label: 'New AIP (includes AICs and Amendment service for the first year)', value: 'new_aip' },
  { label: 'AIP Amendment', value: 'aip_amendment' },
  { label: 'AIC set', value: 'aic_set' },
];

export default function SubscriptionOrderForm() {
  const isAuthenticated = useSelector(state => !!state.auth.token);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [form, setForm] = useState({
    delivery_name: '',
    delivery_address: '',
    delivery_tel: '',
    delivery_fax: '',
    delivery_email: '',
    billing_name: '',
    billing_address: '',
    billing_tel: '',
    billing_fax: '',
    billing_email: '',
    publication: '',
    num_copies: '',
    reciprocal: false,
    on_payment: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Show modal on hover if not authenticated and not already open
  const handleFormMouseEnter = () => {
    if (!isAuthenticated && !showAuthModal) {
      setShowAuthModal(true);
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    // Validate required fields
    if (!form.delivery_name || !form.delivery_address || !form.delivery_email || !form.publication || !form.num_copies) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    // TODO: Submit to backend (useAddSubscriptionMutation or custom endpoint)
    setSuccess(true);
  };

  return (
    <Card>
      <Title>Order Form for Renewal of Subscription (2025)</Title>
      <form onSubmit={handleSubmit} onMouseEnter={handleFormMouseEnter}>
        <FormGrid>
          <FormGroup>
            <label>Delivery Name *</label>
            <input name="delivery_name" value={form.delivery_name} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <label>Billing Name</label>
            <input name="billing_name" value={form.billing_name} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label>Delivery Address *</label>
            <input name="delivery_address" value={form.delivery_address} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <label>Billing Address</label>
            <input name="billing_address" value={form.billing_address} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label>Delivery Tel</label>
            <input name="delivery_tel" value={form.delivery_tel} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label>Billing Tel</label>
            <input name="billing_tel" value={form.billing_tel} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label>Delivery Fax</label>
            <input name="delivery_fax" value={form.delivery_fax} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label>Billing Fax</label>
            <input name="billing_fax" value={form.billing_fax} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label>Delivery Email *</label>
            <input name="delivery_email" value={form.delivery_email} onChange={handleChange} required type="email" />
          </FormGroup>
          <FormGroup>
            <label>Billing Email</label>
            <input name="billing_email" value={form.billing_email} onChange={handleChange} type="email" />
          </FormGroup>
        </FormGrid>
        <FormGroup>
          <label>Publication *</label>
          <select name="publication" value={form.publication} onChange={handleChange} required>
            <option value="">Select publication</option>
            {PUBLICATIONS.map(pub => (
              <option key={pub.value} value={pub.value}>{pub.label}</option>
            ))}
          </select>
        </FormGroup>
        <FormGrid>
          <FormGroup>
            <label>No. of Copies *</label>
            <input name="num_copies" value={form.num_copies} onChange={handleChange} required type="number" min="1" />
          </FormGroup>
          <FormGroup>
            <label>Reciprocal basis</label>
            <input name="reciprocal" type="checkbox" checked={form.reciprocal} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label>On Payment</label>
            <input name="on_payment" type="checkbox" checked={form.on_payment} onChange={handleChange} />
          </FormGroup>
        </FormGrid>
        {error && <ErrorText>{error}</ErrorText>}
        {success && <div style={{ color: 'var(--color-success)' }}>Order submitted successfully!</div>}
        <ButtonRow>
          <Button type="submit">Submit Order</Button>
        </ButtonRow>
      </form>
      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
        <div style={{ padding: 24, minWidth: 320 }}>
          <h3 style={{ textAlign: 'center', marginBottom: 16 }}>
            {authMode === 'login' ? 'Login to Continue' : 'Register to Continue'}
          </h3>
          {authMode === 'login' ? <Login /> : <Register />}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            {authMode === 'login' ? (
              <>
                Don't have an account?{' '}
                <Button type="button" onClick={() => setAuthMode('register')}>Register</Button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Button type="button" onClick={() => setAuthMode('login')}>Login</Button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </Card>
  );
} 