import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { useSelector } from 'react-redux';
import Login from './Login';
import Register from './Register';

const Card = styled.div`
  background: #1e293b;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
  padding: 32px 32px 24px 32px;
  min-width: 420px;
  max-width: 700px;
  margin: 0 auto;
  color: #ffffff;
  border: 1px solid #334155;
`;

const Title = styled.h2`
  margin: 0 0 24px 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
    font-size: 0.9rem;
    color: #cbd5e1;
    margin-bottom: 6px;
    font-weight: 500;
  }
  input, select {
    padding: 12px 16px;
    border: 1px solid #475569;
    border-radius: 8px;
    background: #2d3a4b;
    color: #ffffff;
    font-size: 0.95rem;
    transition: border-color 0.2s ease;
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
    &::placeholder {
      color: #94a3b8;
    }
  }
  select {
    color: #ffffff;
    option {
      background: #2d3a4b;
      color: #ffffff;
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
  color: #ef4444;
  margin-bottom: 12px;
  text-align: center;
  font-size: 0.9rem;
`;

const SuccessText = styled.div`
  color: #10b981;
  margin-bottom: 12px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #3b82f6;
    border: 1px solid #cbd5e1;
    border-radius: 3px;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    position: relative;
    cursor: pointer;
    
    &:checked {
      background: #3b82f6;
      border-color: #3b82f6;
      
      &::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
      }
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }
  }
  
  label {
    font-size: 0.9rem;
    color: #cbd5e1;
    margin: 0;
    cursor: pointer;
  }
`;

const RequiredField = styled.span`
  color: #ef4444;
  margin-left: 4px;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 1px solid #475569;
  padding-bottom: 8px;
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
        <FormSection>
          <SectionTitle>Delivery Information</SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>Delivery Name<RequiredField>*</RequiredField></label>
              <input name="delivery_name" value={form.delivery_name} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <label>Billing Name</label>
              <input name="billing_name" value={form.billing_name} onChange={handleChange} />
            </FormGroup>
          </FormGrid>
          <FormGrid>
            <FormGroup>
              <label>Delivery Address<RequiredField>*</RequiredField></label>
              <input name="delivery_address" value={form.delivery_address} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <label>Billing Address</label>
              <input name="billing_address" value={form.billing_address} onChange={handleChange} />
            </FormGroup>
          </FormGrid>
          <FormGrid>
            <FormGroup>
              <label>Delivery Tel</label>
              <input name="delivery_tel" value={form.delivery_tel} onChange={handleChange} type="tel" />
            </FormGroup>
            <FormGroup>
              <label>Billing Tel</label>
              <input name="billing_tel" value={form.billing_tel} onChange={handleChange} type="tel" />
            </FormGroup>
          </FormGrid>
          <FormGrid>
            <FormGroup>
              <label>Delivery Fax</label>
              <input name="delivery_fax" value={form.delivery_fax} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label>Billing Fax</label>
              <input name="billing_fax" value={form.billing_fax} onChange={handleChange} />
            </FormGroup>
          </FormGrid>
        </FormSection>

        <FormSection>
          <SectionTitle>Order Details</SectionTitle>
          <FormGroup>
            <label>Publication<RequiredField>*</RequiredField></label>
            <select name="publication" value={form.publication} onChange={handleChange} required>
              <option value="">Select publication</option>
              {PUBLICATIONS.map(pub => (
                <option key={pub.value} value={pub.value}>{pub.label}</option>
              ))}
            </select>
          </FormGroup>
          <FormGrid>
            <FormGroup>
              <label>No. of Copies<RequiredField>*</RequiredField></label>
              <input name="num_copies" value={form.num_copies} onChange={handleChange} required type="number" min="1" />
            </FormGroup>
          </FormGrid>
          <FormGrid>
            <CheckboxGroup>
              <input name="reciprocal" type="checkbox" checked={form.reciprocal} onChange={handleChange} />
              <label>Reciprocal basis</label>
            </CheckboxGroup>
            <CheckboxGroup>
              <input name="on_payment" type="checkbox" checked={form.on_payment} onChange={handleChange} />
              <label>On Payment</label>
            </CheckboxGroup>
          </FormGrid>
        </FormSection>

        {error && <ErrorText>{error}</ErrorText>}
        {success && <SuccessText>Order submitted successfully!</SuccessText>}
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