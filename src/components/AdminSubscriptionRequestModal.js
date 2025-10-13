import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import styled from 'styled-components';
import { FaPlus, FaFileAlt } from 'react-icons/fa';
import { useSubmitSubscriptionOrderMutation } from '../api/apiSlice';
import { useNavigate } from 'react-router-dom';

const ModalContent = styled.div`
  padding: 32px;
  min-width: 600px;
  max-width: 700px;
`;

const ModalTitle = styled.h3`
  margin: 0 0 24px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
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
  
  input, select, textarea {
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
    
    /* Fix dropdown option styling */
    option {
      background: var(--color-background);
      color: var(--color-text);
      padding: 8px 12px;
      
      /* For better cross-browser support */
      &:hover {
        background: var(--color-bg-muted, #f5f5f5);
        color: var(--color-text);
      }
      
      &:checked {
        background: var(--color-accent2, #a259f7);
        color: white;
      }
    }
    
    /* Additional browser-specific fixes */
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--color-bg-muted);
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--color-border);
      border-radius: 4px;
    }
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const AdminSubscriptionRequestModal = ({ 
  isOpen, 
  onClose, 
  subscriberDetails, 
  onSuccess
}) => {
  const [submitSubscriptionOrder] = useSubmitSubscriptionOrderMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    sub_type: '',
    set_as_pending: true
  });

  // Map subscription types to ensure they match form options
  const mapSubscriptionType = (type) => {
    if (!type) return '';
    
    // Handle case sensitivity and variations
    const normalizedType = type.toString().trim();
    
    // Map common variations to form values
    const typeMap = {
      'eAIP': 'eAIP',
      'eaip': 'eAIP',
      'EAIP': 'eAIP',
      'CD': 'CD',
      'cd': 'CD',
      'Cd': 'CD',
      'Paper': 'Paper',
      'paper': 'Paper',
      'PAPER': 'Paper'
    };
    
    return typeMap[normalizedType] || normalizedType;
  };

  useEffect(() => {
    if (isOpen && subscriberDetails) {
      // Check if this is a renewal request and get the subscription type
      const renewalType = sessionStorage.getItem('renewalSubscriptionType');
      console.log('🔍 Modal opened - Raw renewal type:', JSON.stringify(renewalType));
      
      const mappedType = mapSubscriptionType(renewalType);
      console.log('🔍 Mapped renewal type:', JSON.stringify(mappedType));
      console.log('🔍 Available option values: ["", "eAIP", "CD", "Paper"]');
      
      setForm({
        sub_type: mappedType,
        set_as_pending: true
      });
    }
  }, [isOpen, subscriberDetails]);

  // Check if this is a renewal request
  const isRenewal = sessionStorage.getItem('isRenewalRequest') === 'true';


  // Clean up session storage when modal closes
  useEffect(() => {
    if (!isOpen) {
      sessionStorage.removeItem('isRenewalRequest');
      sessionStorage.removeItem('renewalSubscriptionType');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sub_type) return;

    try {
      setIsSubmitting(true);

      const subscriptionData = {
        subscriber_id: subscriberDetails.sub_id,
        sub_type: form.sub_type,
        sub_status: form.set_as_pending ? 2 : 0,
        order_sent_date: new Date().toISOString().split('T')[0],
        order_receive_date: new Date().toISOString().split('T')[0],
        selected_options: []
      };

      const result = await submitSubscriptionOrder({
        subscriptionData,
        orderFormFile: undefined
      }).unwrap();

      sessionStorage.removeItem('isRenewalRequest');
      sessionStorage.removeItem('renewalSubscriptionType');
      onClose();
      // Navigate to edit-subscription for the newly created subscription
      if (result?.subscriptionId) {
        navigate(`/subscriber/${subscriberDetails.sub_id}/edit-subscription/${result.subscriptionId}`);
      }
      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error('Failed to create admin subscription request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalTitle>
          <FaPlus />
          {isRenewal ? 'Initiate Renewal Request' : 'Initiate Subscription Request'}
        </ModalTitle>
        
        <div style={{ marginBottom: 16, color: 'var(--color-text-muted)' }}>
          {isRenewal ? (
            <>
              Initiate renewal process for <strong>{subscriberDetails?.sub_name}</strong> (expiring soon)
            </>
          ) : (
            <>
              Create a new subscription request for <strong>{subscriberDetails?.sub_name}</strong>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <FormGrid>
            <FormGroup>
              <label>Subscription Type *</label>
              <select 
                name="sub_type" 
                value={form.sub_type} 
                onChange={handleChange}
                required
              >
                <option 
                  value="" 
                  style={{ 
                    backgroundColor: '#f8fafc', 
                    color: '#64748b', 
                    fontStyle: 'italic',
                    fontSize: '15px',
                    padding: '12px 16px'
                  }}
                >
                  Select Type
                </option>
                <option 
                  value="eAIP" 
                  style={{ 
                    backgroundColor: '#ffffff', 
                    color: '#2d3748', 
                    fontWeight: '500',
                    fontSize: '15px',
                    padding: '12px 16px'
                  }}
                >
                  📱 eAIP (Electronic)
                </option>
                <option 
                  value="CD" 
                  style={{ 
                    backgroundColor: '#ffffff', 
                    color: '#2d3748', 
                    fontWeight: '500',
                    fontSize: '15px',
                    padding: '12px 16px'
                  }}
                >
                  💿 CD (Compact Disc)
                </option>
                <option 
                  value="Paper" 
                  style={{ 
                    backgroundColor: '#ffffff', 
                    color: '#2d3748', 
                    fontWeight: '500',
                    fontSize: '15px',
                    padding: '12px 16px'
                  }}
                >
                  📄 Paper (Physical Copy)
                </option>
              </select>
            </FormGroup>
          </FormGrid>

          <div style={{ 
            background: 'var(--color-bg-muted)', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '24px' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '12px',
              fontSize: '1rem',
              color: 'var(--color-text)',
              fontWeight: '500'
            }}>
              <FaFileAlt />
              Subscription Options
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="set_as_pending"
                name="set_as_pending"
                checked={form.set_as_pending}
                onChange={handleChange}
              />
              <label htmlFor="set_as_pending" style={{ margin: 0, cursor: 'pointer' }}>
                Set subscription status as pending (awaiting user completion)
              </label>
            </div>
          </div>

          <ButtonRow>
            <Button 
              type="button" 
              onClick={onClose}
              style={{ background: 'var(--color-bg-muted)', color: 'var(--color-text)' }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !form.sub_type}
              style={{ background: 'var(--color-success)', color: 'white' }}
            >
              {isSubmitting ? 'Creating Request...' : (isRenewal ? 'Create Renewal Request' : 'Create Subscription Request')}
            </Button>
          </ButtonRow>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AdminSubscriptionRequestModal;
