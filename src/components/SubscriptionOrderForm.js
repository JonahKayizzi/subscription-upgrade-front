import React, { useState } from 'react';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { useSelector } from 'react-redux';
import Login from './Login';
import Register from './Register';

const PUBLICATIONS = [
  { label: 'New AIP (includes AICs and Amendment service for the first year)', value: 'new_aip' },
  { label: 'AIP Amendment', value: 'aip_amendment' },
  { label: 'AIC set', value: 'aic_set' },
];

export default function SubscriptionOrderForm() {
  const isAuthenticated = useSelector(state => !!state.auth.token);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const handleRegistrationSuccess = () => {
    setShowAuthModal(false);
    setAuthMode('login');
  };

  const [form, setForm] = useState({
    delivery_name: '', delivery_address: '', delivery_tel: '', delivery_fax: '', delivery_email: '',
    billing_name: '', billing_address: '', billing_tel: '', billing_fax: '', billing_email: '',
    publication: '', num_copies: '', reciprocal: false, on_payment: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!form.delivery_name || !form.delivery_address || !form.delivery_email || !form.publication || !form.num_copies) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="order-form-card">
      <h2>Order Form for Renewal of Subscription (2025)</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 className="section-title">Delivery Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-group-label">Delivery Name<span className="required">*</span></label>
              <input name="delivery_name" value={form.delivery_name} onChange={handleChange} required className="form-group-input" />
            </div>
            <div className="form-group">
              <label className="form-group-label">Billing Name</label>
              <input name="billing_name" value={form.billing_name} onChange={handleChange} className="form-group-input" />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-group-label">Delivery Address<span className="required">*</span></label>
              <input name="delivery_address" value={form.delivery_address} onChange={handleChange} required className="form-group-input" />
            </div>
            <div className="form-group">
              <label className="form-group-label">Billing Address</label>
              <input name="billing_address" value={form.billing_address} onChange={handleChange} className="form-group-input" />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-group-label">Delivery Tel</label>
              <input name="delivery_tel" value={form.delivery_tel} onChange={handleChange} type="tel" className="form-group-input" />
            </div>
            <div className="form-group">
              <label className="form-group-label">Billing Tel</label>
              <input name="billing_tel" value={form.billing_tel} onChange={handleChange} type="tel" className="form-group-input" />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-group-label">Delivery Fax</label>
              <input name="delivery_fax" value={form.delivery_fax} onChange={handleChange} className="form-group-input" />
            </div>
            <div className="form-group">
              <label className="form-group-label">Billing Fax</label>
              <input name="billing_fax" value={form.billing_fax} onChange={handleChange} className="form-group-input" />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 className="section-title">Order Details</h3>
          <div className="form-group">
            <label className="form-group-label">Publication<span className="required">*</span></label>
            <select name="publication" value={form.publication} onChange={handleChange} required className="form-group-input">
              <option value="">Select publication</option>
              {PUBLICATIONS.map(pub => (
                <option key={pub.value} value={pub.value}>{pub.label}</option>
              ))}
            </select>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-group-label">No. of Copies<span className="required">*</span></label>
              <input name="num_copies" value={form.num_copies} onChange={handleChange} required type="number" min="1" className="form-group-input" />
            </div>
          </div>
          <div className="form-grid">
            <div className="checkbox-group">
              <input name="reciprocal" type="checkbox" checked={form.reciprocal} onChange={handleChange} />
              <label>Reciprocal basis</label>
            </div>
            <div className="checkbox-group">
              <input name="on_payment" type="checkbox" checked={form.on_payment} onChange={handleChange} />
              <label>On Payment</label>
            </div>
          </div>
        </div>

        {error && <div className="order-form-error">{error}</div>}
        {success && <div className="order-form-success">Order submitted successfully!</div>}
        <div className="order-form-actions">
          <Button type="submit">Submit Order</Button>
        </div>
      </form>

      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
        <div className="auth-modal-inner">
          <h3 className="auth-modal-title">
            {authMode === 'login' ? 'Sign in to continue' : 'Create an account'}
          </h3>
          {authMode === 'login' ? <Login /> : <Register onSuccess={handleRegistrationSuccess} />}
          <div className="auth-modal-switch">
            {authMode === 'login' ? (
              <>Don't have an account? <Button type="button" onClick={() => setAuthMode('register')}>Register</Button></>
            ) : (
              <>Already have an account? <Button type="button" onClick={() => setAuthMode('login')}>Login</Button></>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
