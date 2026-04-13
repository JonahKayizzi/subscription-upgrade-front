import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from './ui/Button';

const Card = styled.div`
  background: linear-gradient(180deg, #1f2c45 0%, #1b263b 100%);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
  padding: 28px 24px 22px;
  width: 100%;
  max-width: 760px;
  margin: 0;
  color: #ffffff;
  border: 1px solid #334155;

  @media (max-width: 992px) {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    padding: 22px 16px 18px;
    border-radius: 14px;
  }
`;

const Title = styled.h2`
  margin: 0 0 24px 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 1.05rem;
    margin-bottom: 18px;
    text-align: left;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  
  &.full-width {
    grid-column: 1 / -1;
  }
  
  label {
    font-size: 0.9rem;
    color: #cbd5e1;
    margin-bottom: 6px;
    font-weight: 600;
  }
  
  input, select, textarea {
    padding: 11px 14px;
    border: 1px solid #475569;
    border-radius: 8px;
    background: #2a3a52;
    color: #ffffff;
    font-size: 0.95rem;
    width: 100%;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    
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
  
  textarea {
    resize: vertical;
    min-height: 80px;
  }

  @media (max-width: 768px) {
    margin-bottom: 8px;

    label {
      font-size: 0.85rem;
    }

    input, select, textarea {
      font-size: 0.9rem;
      padding: 10px 12px;
    }
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 22px;
  gap: 12px;

  @media (max-width: 768px) {
    justify-content: stretch;
    margin-top: 16px;
  }
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

export default function SubscriberInfoForm({ subscriberData, onSubmit, isUpdating = false }) {
  const [formData, setFormData] = useState({
    sub_name: '',
    sub_email: '',
    phy_address: '',
    sub_telephone: '',
    sub_box_number: '',
    sub_other_contact_info: '',
    sub_contact_per: '',
    publication_type: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pre-populate form when subscriberData changes
  useEffect(() => {
    if (subscriberData) {
      setFormData({
        sub_name: subscriberData.sub_name || '',
        sub_email: subscriberData.sub_email || '',
        phy_address: subscriberData.phy_address || '',
        sub_telephone: subscriberData.sub_telephone || '',
        sub_box_number: subscriberData.sub_box_number || '',
        sub_other_contact_info: subscriberData.sub_other_contact_info || '',
        sub_contact_per: subscriberData.sub_contact_per || '',
        publication_type: subscriberData.publication_type || ''
      });
    }
  }, [subscriberData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await onSubmit(formData);
      setSuccess(isUpdating ? 'Subscriber information updated successfully!' : 'Subscriber information submitted successfully!');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <Title>{isUpdating ? 'Update Subscriber Information' : 'Subscriber Information Form'}</Title>
      
      {error && <ErrorText>{error}</ErrorText>}
      {success && <SuccessText>{success}</SuccessText>}
      
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <FormGroup>
            <label htmlFor="sub_name">Organization Name *</label>
            <input
              type="text"
              id="sub_name"
              name="sub_name"
              value={formData.sub_name}
              onChange={handleInputChange}
              placeholder="Enter organization name"
              required
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="publication_type">Publication Type *</label>
            <select
              id="publication_type"
              name="publication_type"
              value={formData.publication_type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select publication type</option>
              <option value="eAIP">eAIP (Electronic Aeronautical Information Publication)</option>
              <option value="Paper AIP">Paper AIP</option>
              <option value="CD AIP">CD AIP</option>
              <option value="Digital Datasets">Digital Datasets (Coming Soon)</option>
            </select>
          </FormGroup>

          <FormGroup>
            <label htmlFor="sub_email">Email Address *</label>
            <input
              type="email"
              id="sub_email"
              name="sub_email"
              value={formData.sub_email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              required
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="sub_telephone">Telephone</label>
            <input
              type="tel"
              id="sub_telephone"
              name="sub_telephone"
              value={formData.sub_telephone}
              onChange={handleInputChange}
              placeholder="Enter telephone number"
            />
          </FormGroup>

          <FormGroup className="full-width">
            <label htmlFor="phy_address">Physical Address</label>
            <textarea
              id="phy_address"
              name="phy_address"
              value={formData.phy_address}
              onChange={handleInputChange}
              placeholder="Enter physical address"
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="sub_box_number">P.O. Box</label>
            <input
              type="text"
              id="sub_box_number"
              name="sub_box_number"
              value={formData.sub_box_number}
              onChange={handleInputChange}
              placeholder="Enter P.O. Box number"
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="sub_contact_per">Contact Person</label>
            <input
              type="text"
              id="sub_contact_per"
              name="sub_contact_per"
              value={formData.sub_contact_per}
              onChange={handleInputChange}
              placeholder="Enter contact person name"
            />
          </FormGroup>

          <FormGroup className="full-width">
            <label htmlFor="sub_other_contact_info">Additional Contact Information</label>
            <textarea
              id="sub_other_contact_info"
              name="sub_other_contact_info"
              value={formData.sub_other_contact_info}
              onChange={handleInputChange}
              placeholder="Enter additional contact information (fax, website, etc.)"
            />
          </FormGroup>
        </FormGrid>

        <ButtonRow>
          <Button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              width: '100%'
            }}
          >
            {isSubmitting ? 'Saving...' : (isUpdating ? 'Update Information' : 'Submit Information')}
          </Button>
        </ButtonRow>
      </form>
    </Card>
  );
} 