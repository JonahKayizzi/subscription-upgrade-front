import React, { useState } from 'react';
import styled from 'styled-components';
import { useAddSubscriberMutation } from '../api/apiSlice';
import Button from './ui/Button';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBox, FaInfoCircle, FaUserTie, FaRegBuilding } from 'react-icons/fa';

const ModalContentWrapper = styled.div`
  padding: 0;
  width: 60vw;
  max-width: 800px;
  background: var(--color-background);
  border-radius: 12px;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 20px 32px;
  background: var(--color-background-card);
  border-bottom: 1px solid var(--color-border);
  h3 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-text);
  }
  p {
    margin: 4px 0 0;
    color: var(--color-text-muted);
  }
`;

const ModalBody = styled.form`
  padding: 24px 32px;
  background: var(--color-background);
`;


const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const FormGroup = styled.div`
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-text-muted);
    margin-bottom: 8px;
  }
  input, select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-background-card);
    color: var(--color-text);
    font-size: 1rem;
    &:focus {
      outline: none;
      border-color: var(--color-accent2);
      box-shadow: 0 0 0 2px rgba(162, 89, 247, 0.2);
    }
  }
`;

const ActionsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    padding-top: 24px;
    margin-top: 24px;
    border-top: 1px solid var(--color-border);
`;

const AddSubscriberForm = ({ onClose }) => {
  const [addSubscriber, { isLoading }] = useAddSubscriberMutation();
  const [formData, setFormData] = useState({
    sub_name: '',
    sub_category: 'Paying Subscribers',
    sub_email: '',
    phy_address: '',
    sub_telephone: '',
    sub_box_number: '',
    sub_other_contact_info: '',
    sub_contact_per: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSubscriber(formData).unwrap();
      onClose();
    } catch (err) {
      console.error('Failed to add subscriber:', err);
    }
  };

  return (
    <ModalContentWrapper>
        <ModalHeader>
          <h3>Add New Subscriber</h3>
          <p>Enter the details for the new subscriber below.</p>
        </ModalHeader>
        <ModalBody onSubmit={handleSubmit}>
            <FormGrid>
                <FormGroup style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="sub_name"><FaUser /> Name</label>
                    <input type="text" id="sub_name" name="sub_name" value={formData.sub_name} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <label htmlFor="sub_email"><FaEnvelope /> Email</label>
                    <input type="email" id="sub_email" name="sub_email" value={formData.sub_email} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <label htmlFor="sub_telephone"><FaPhone /> Telephone</label>
                    <input type="text" id="sub_telephone" name="sub_telephone" value={formData.sub_telephone} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <label htmlFor="sub_category"><FaRegBuilding /> Category</label>
                    <select id="sub_category" name="sub_category" value={formData.sub_category} onChange={handleChange}>
                        <option value="Paying Subscribers">Paying Subscribers</option>
                        <option value="AIS of States">AIS of States</option>
                        <option value="CAA Departments">CAA Departments</option>
                        <option value="Embassies">Embassies</option>
                        <option value="Flying Schools">Flying Schools</option>
                        <option value="Govt Org">Govt Org</option>
                    </select>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="phy_address"><FaMapMarkerAlt /> Physical Address</label>
                    <input type="text" id="phy_address" name="phy_address" value={formData.phy_address} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <label htmlFor="sub_box_number"><FaBox /> Box Number</label>
                    <input type="text" id="sub_box_number" name="sub_box_number" value={formData.sub_box_number} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <label htmlFor="sub_contact_per"><FaUserTie /> Contact Person</label>
                    <input type="text" id="sub_contact_per" name="sub_contact_per" value={formData.sub_contact_per} onChange={handleChange} />
                </FormGroup>
                <FormGroup style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="sub_other_contact_info"><FaInfoCircle /> Other Contact Info</label>
                    <input type="text" id="sub_other_contact_info" name="sub_other_contact_info" value={formData.sub_other_contact_info} onChange={handleChange} />
                </FormGroup>
            </FormGrid>
            <ActionsContainer>
                <Button type="button" onClick={onClose} style={{ background: 'var(--color-bg-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading} style={{ background: 'var(--color-success)', color: '#fff' }}>
                    {isLoading ? 'Adding...' : 'Add Subscriber'}
                </Button>
            </ActionsContainer>
        </ModalBody>
    </ModalContentWrapper>
  );
};

export default AddSubscriberForm; 