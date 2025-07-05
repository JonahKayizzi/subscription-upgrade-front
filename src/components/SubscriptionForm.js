import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { useAddSubscriptionMutation, useGetSubscriberQuery, useAddSubscriberMutation, useGetSubscriptionQuery, useUpdateSubscriptionMutation } from '../api/apiSlice';
import OnboardingPipeline from './OnboardingPipeline';

const MainContent = styled.div`
  flex: 1;
  padding: 40px 0 40px 0;
  display: flex;
  justify-content: center;
  background: var(--color-background);
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 32px;
  width: 100%;
  max-width: 1300px;
`;

const Card = styled.div`
  background: var(--color-background-card);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 32px 32px 24px 32px;
  min-width: 420px;
  flex: 2;
  color: var(--color-text);
`;

const Sidebar = styled.div`
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SidebarCard = styled(Card)`
  padding: 24px;
  min-width: unset;
  flex: unset;
`;

const Title = styled.h2`
  margin: 0 0 24px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  text-align: left;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
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
  select {
    color: var(--color-text);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  gap: 16px;
`;

export default function SubscriptionForm() {
  const { id, subscriptionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedType = queryParams.get('type') || '';
  const isEditMode = !!subscriptionId;
  const { data: subscriptionDetails, isLoading: isLoadingSubscription } = useGetSubscriptionQuery(subscriptionId, { skip: !isEditMode });
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();
  const [addSubscription, { isLoading }] = useAddSubscriptionMutation();
  const [form, setForm] = useState({
    sub_type: preselectedType,
    sub_start_date: '',
    sub_exp_date: '',
    sub_amount: '',
    sub_delivery: '',
    sub_receipt_no: '',
    sub_invoice_no: '',
    eaip_user_name: '',
    eaip_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [files, setFiles] = useState({
    subscription_form: null,
    subscription_receipt: null,
    subscription_invoice: null,
  });
  const [error, setError] = useState('');
  const [addSubscriberModalOpen, setAddSubscriberModalOpen] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({
    sub_name: '',
    sub_category: 'Paying Subscribers',
    sub_email: '',
    phy_address: '',
    sub_telephone: '',
    sub_box_number: '',
    sub_other_contact_info: '',
    sub_contact_per: '',
  });
  const [addSubscriber, { isLoading: isAddingSubscriber }] = useAddSubscriberMutation();
  const { data: subscriberDetails } = useGetSubscriberQuery(id, { skip: !id });

  // Determine if the subscription is expired
  const isExpired = isEditMode && subscriptionDetails && subscriptionDetails.status === 'expired';

  useEffect(() => {
    if (isEditMode && subscriptionDetails) {
      setForm({
        sub_type: subscriptionDetails.sub_type || '',
        sub_start_date: subscriptionDetails.sub_start_date ? subscriptionDetails.sub_start_date.slice(0, 10) : '',
        sub_exp_date: subscriptionDetails.sub_exp_date ? subscriptionDetails.sub_exp_date.slice(0, 10) : '',
        sub_amount: subscriptionDetails.sub_amount || '',
        sub_delivery: subscriptionDetails.sub_delivery || '',
        sub_receipt_no: subscriptionDetails.receipt_no || '',
        sub_invoice_no: subscriptionDetails.invoice_no || '',
        eaip_user_name: subscriptionDetails.eaip_user_name || '',
        eaip_password: subscriptionDetails.eaip_password || '',
      });
    }
  }, [isEditMode, subscriptionDetails]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFileChange = e => {
    const { name, files: fileList } = e.target;
    setFiles(f => ({ ...f, [name]: fileList[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.sub_type || !form.sub_start_date || !form.sub_exp_date || !form.sub_amount) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      const data = new FormData();
      data.append('subscriber_id', id);
      data.append('sub_type', form.sub_type);
      data.append('sub_start_date', form.sub_start_date);
      data.append('sub_exp_date', form.sub_exp_date);
      data.append('sub_amount', form.sub_amount);
      data.append('sub_delivery', form.sub_delivery);
      data.append('sub_receipt_no', form.sub_receipt_no);
      data.append('sub_invoice_no', form.sub_invoice_no);
      if (form.sub_type === 'eAIP') {
        data.append('eaip_user_name', form.eaip_user_name);
        data.append('eaip_password', form.eaip_password);
      }
      if (files.subscription_form) data.append('subscription_form', files.subscription_form);
      if (files.subscription_receipt) data.append('subscription_receipt', files.subscription_receipt);
      if (files.subscription_invoice) data.append('subscription_invoice', files.subscription_invoice);
      if (isEditMode) {
        await updateSubscription({ id: subscriptionId, ...form }).unwrap();
      } else {
        await addSubscription(data).unwrap();
      }
      navigate(-1);
    } catch (err) {
      setError('Failed to save subscription.');
    }
  };

  // Add Subscriber Modal logic
  const handleNewSubscriberChange = e => {
    const { name, value } = e.target;
    setNewSubscriber(f => ({ ...f, [name]: value }));
  };
  const handleAddSubscriber = async e => {
    e.preventDefault();
    try {
      const result = await addSubscriber(newSubscriber).unwrap();
      setAddSubscriberModalOpen(false);
      // Optionally, you could redirect to the new subscriber's add-subscription page
      navigate(`/subscriber/${result.sub_id}/add-subscription`);
    } catch (err) {
      // handle error
    }
  };

  return (
    <MainContent>
      <ContentWrapper>
        <Card>
          {/* Context-aware header */}
          {id && subscriberDetails ? (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-text)' }}>Subscriber: {subscriberDetails.sub_name}</div>
            </div>
          ) : (
            <div style={{ marginBottom: 24 }}>
              <Button style={{ background: 'var(--color-accent2)', color: '#fff', fontWeight: 600 }} onClick={() => setAddSubscriberModalOpen(true)}>
                + Add Subscriber
              </Button>
              <Modal isOpen={addSubscriberModalOpen} onClose={() => setAddSubscriberModalOpen(false)}>
                <div style={{ minWidth: 400, padding: 24 }}>
                  <h3 style={{ margin: 0, marginBottom: 16 }}>Add New Subscriber</h3>
                  <form onSubmit={handleAddSubscriber}>
                    <FormGroup>
                      <label>Name</label>
                      <input name="sub_name" value={newSubscriber.sub_name} onChange={handleNewSubscriberChange} required />
                    </FormGroup>
                    <FormGroup>
                      <label>Category</label>
                      <select name="sub_category" value={newSubscriber.sub_category} onChange={handleNewSubscriberChange}>
                        <option value="Paying Subscribers">Paying Subscribers</option>
                        <option value="AIS of States">AIS of States</option>
                      </select>
                    </FormGroup>
                    <FormGroup>
                      <label>Email</label>
                      <input name="sub_email" value={newSubscriber.sub_email} onChange={handleNewSubscriberChange} />
                    </FormGroup>
                    <FormGroup>
                      <label>Phone</label>
                      <input name="sub_telephone" value={newSubscriber.sub_telephone} onChange={handleNewSubscriberChange} />
                    </FormGroup>
                    <FormGroup>
                      <label>Address</label>
                      <input name="phy_address" value={newSubscriber.phy_address} onChange={handleNewSubscriberChange} />
                    </FormGroup>
                    <FormGroup>
                      <label>Box Number</label>
                      <input name="sub_box_number" value={newSubscriber.sub_box_number} onChange={handleNewSubscriberChange} />
                    </FormGroup>
                    <FormGroup>
                      <label>Other Contact</label>
                      <input name="sub_other_contact_info" value={newSubscriber.sub_other_contact_info} onChange={handleNewSubscriberChange} />
                    </FormGroup>
                    <FormGroup>
                      <label>Contact Person</label>
                      <input name="sub_contact_per" value={newSubscriber.sub_contact_per} onChange={handleNewSubscriberChange} />
                    </FormGroup>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                      <Button type="button" style={{ marginRight: 12 }} onClick={() => setAddSubscriberModalOpen(false)}>Cancel</Button>
                      <Button type="submit" style={{ background: 'var(--color-success)', color: '#fff' }} disabled={isAddingSubscriber}>
                        {isAddingSubscriber ? 'Saving...' : 'Add Subscriber'}
                      </Button>
                    </div>
                  </form>
                </div>
              </Modal>
            </div>
          )}
          {/* Subscription type summary */}
          {form.sub_type && (
            <div style={{ marginBottom: 16, color: 'var(--color-accent2)', fontWeight: 600 }}>
              Subscription Type: {form.sub_type}
            </div>
          )}
          <Title>Add New Subscription</Title>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <FormGrid>
              <FormGroup>
                <label>Type *</label>
                <select name="sub_type" value={form.sub_type} onChange={handleChange} required disabled={!!preselectedType || isEditMode || isExpired}>
                  <option value="">Select Type</option>
                  <option value="eAIP">eAIP</option>
                  <option value="CD">CD</option>
                  <option value="Paper">Paper</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Amount (USD) *</label>
                <input type="number" name="sub_amount" value={form.sub_amount} onChange={handleChange} min="0" step="0.01" required disabled={isExpired} />
              </FormGroup>
              <FormGroup>
                <label>Start Date *</label>
                <input type="date" name="sub_start_date" value={form.sub_start_date} onChange={handleChange} required disabled={isExpired} />
              </FormGroup>
              <FormGroup>
                <label>Expiry Date *</label>
                <input type="date" name="sub_exp_date" value={form.sub_exp_date} onChange={handleChange} required disabled={isExpired} />
              </FormGroup>
              <FormGroup>
                <label>Receipt Number</label>
                <input name="sub_receipt_no" value={form.sub_receipt_no} onChange={handleChange} placeholder="Receipt No" disabled={isExpired} />
              </FormGroup>
              <FormGroup>
                <label>Invoice Number</label>
                <input name="sub_invoice_no" value={form.sub_invoice_no} onChange={handleChange} placeholder="Invoice No (If any)" disabled={isExpired} />
              </FormGroup>
              <FormGroup style={{ gridColumn: '1 / -1' }}>
                <label>Delivery</label>
                <input name="sub_delivery" value={form.sub_delivery} onChange={handleChange} placeholder="e.g. Email, Courier, Pickup" disabled={isExpired} />
              </FormGroup>
              {/* eAIP fields */}
              {form.sub_type === 'eAIP' && (
                <>
                  <FormGroup>
                    <label>eAIP Username</label>
                    <input name="eaip_user_name" value={form.eaip_user_name} onChange={handleChange} disabled={isExpired} />
                  </FormGroup>
                  <FormGroup>
                    <label>eAIP Password</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        name="eaip_password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.eaip_password}
                        onChange={handleChange}
                        style={{ flex: 1 }}
                        disabled={isExpired}
                      />
                      <Button type="button" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => setShowPassword(v => !v)} disabled={isExpired}>
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                    </div>
                  </FormGroup>
                </>
              )}
              {/* File uploads */}
              <FormGroup style={{ gridColumn: '1 / -1' }}>
                <label>Attach Subscription Form (Max 5MB)</label>
                <input type="file" name="subscription_form" accept=".pdf,.jpg,.jpeg,.png,.gif" onChange={handleFileChange} disabled={isExpired} />
              </FormGroup>
              <FormGroup style={{ gridColumn: '1 / -1' }}>
                <label>Attach Receipt (Max 5MB)</label>
                <input type="file" name="subscription_receipt" accept=".pdf,.jpg,.jpeg,.png,.gif" onChange={handleFileChange} disabled={isExpired} />
              </FormGroup>
              <FormGroup style={{ gridColumn: '1 / -1' }}>
                <label>Attach Invoice (Max 5MB)</label>
                <input type="file" name="subscription_invoice" accept=".pdf,.jpg,.jpeg,.png,.gif" onChange={handleFileChange} disabled={isExpired} />
              </FormGroup>
            </FormGrid>
            {error && <div style={{ color: 'var(--color-error)', marginTop: 12 }}>{error}</div>}
            <ButtonRow>
              <Button type="button" style={{ background: 'var(--color-bg-muted)', color: 'var(--color-text)' }} onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" style={{ background: 'var(--color-success)', color: '#fff' }} disabled={isLoading || isExpired}>
                {isExpired ? 'Expired' : (isLoading ? 'Saving...' : (isEditMode ? 'Update Subscription' : 'Add Subscription'))}
              </Button>
            </ButtonRow>
          </form>
        </Card>
        <Sidebar>
          <OnboardingPipeline subscription={subscriptionDetails} />
        </Sidebar>
      </ContentWrapper>
    </MainContent>
  );
} 