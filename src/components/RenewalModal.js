import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import { getSubscriptionTypePricing } from '../config/subscriptionTypes';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: #111827;
  margin-bottom: 8px;
  font-weight: 600;
`;

const ModalSubtitle = styled.p`
  color: #374151;
  font-size: 1rem;
  font-weight: 500;
`;

const NotificationSection = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const NotificationIcon = styled.div`
  color: #f59e0b;
  font-size: 1.25rem;
  margin-top: 2px;
`;

const NotificationText = styled.div`
  color: #92400e;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const OptionsSection = styled.div`
  margin-bottom: 24px;
`;

const OptionsTitle = styled.h3`
  font-size: 1.1rem;
  color: #111827;
  margin-bottom: 16px;
  text-align: center;
  font-weight: 600;
`;

const OptionGroup = styled.div`
  margin-bottom: 20px;
`;

const OptionGroupTitle = styled.h4`
  font-size: 1rem;
  color: #111827;
  margin-bottom: 12px;
  font-weight: 600;
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  
  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: var(--color-accent2);
  cursor: pointer;
`;

const OptionLabel = styled.label`
  flex: 1;
  font-size: 0.9rem;
  color: #111827;
  cursor: pointer;
  line-height: 1.4;
  font-weight: 500;
`;

const OptionPrice = styled.span`
  font-weight: 600;
  color: #7c3aed;
  font-size: 0.9rem;
`;

const ActionSection = styled.div`
  text-align: center;
`;

const SubmitButton = styled.button`
  background: var(--color-accent2);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
  
  &:hover {
    background: #1e40af;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 16px;
  
  &:hover {
    background: var(--color-bg);
    color: var(--color-text);
  }
`;

const RenewalModal = ({ 
  isOpen, 
  onClose, 
  subscriptionType, 
  isNewSubscription = false,
  onSubmitOrderForm,
  isSubmitting 
}) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [invoiceRequested, setInvoiceRequested] = useState(false);

  // Get subscription options based on type
  const getSubscriptionOptions = (type) => {
    const pricing = getSubscriptionTypePricing(type);
    if (!pricing) return {};
    
    // Convert options array to object with default prices
    const options = {};
    pricing.options.forEach(option => {
      // Set default prices based on subscription type
      let price = '120 USD'; // Default
      
      if (type === 'eAIP') {
        price = '120 USD';
      } else if (type === 'paper' || type === 'Paper AIP') {
        if (option.includes('hand delivery')) price = '230 USD';
        else if (option.includes('postage within country')) price = '293 USD';
        else if (option.includes('postage within Africa')) price = '327 USD';
        else if (option.includes('rest of the world')) price = '366 USD';
        else price = '230 USD';
      } else if (type === 'CD' || type === 'CD AIP') {
        if (option.includes('hand delivery')) price = '70 USD';
        else if (option.includes('postage within country')) price = '100 USD';
        else if (option.includes('postage within Africa')) price = '130 USD';
        else if (option.includes('rest of the world')) price = '170 USD';
        else price = '70 USD';
      }
      
      options[option] = price;
    });
    
    return options;
  };



  // Handle checkbox changes
  const handleOptionChange = (option, checked) => {
    setSelectedOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  // Reset options when subscription type changes
  useEffect(() => {
    setSelectedOptions({});
  }, [subscriptionType]);

  // Get selected options for submission
  const getSelectedOptionsForSubmission = () => {
    return Object.keys(selectedOptions).filter(option => selectedOptions[option]);
  };

  if (!isOpen) return null;

  const subscriptionOptions = getSubscriptionOptions(subscriptionType);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{isNewSubscription ? 'New' : 'Renew'} {subscriptionType} Subscription</ModalTitle>
          <ModalSubtitle>
            {isNewSubscription
              ? 'Select your subscription options and submit your order form to start your new subscription.'
              : 'Select your subscription options and complete your renewal request'}
          </ModalSubtitle>
        </ModalHeader>

        <NotificationSection>
          <NotificationIcon>
            <FaExclamationTriangle />
          </NotificationIcon>
          <NotificationText>
            <strong>Notification:</strong> Ensure your subscriber information is up to date before proceeding with the {isNewSubscription ? 'new subscription' : 'renewal'}.
          </NotificationText>
        </NotificationSection>

        <OptionsSection>
          <OptionsTitle>Select Your Subscription Options</OptionsTitle>
          
          <OptionGroup>
            <OptionGroupTitle>{subscriptionType} Options</OptionGroupTitle>
            {Object.entries(subscriptionOptions).map(([option, price]) => (
              <OptionItem key={option}>
                <Checkbox
                  type="checkbox"
                  id={option}
                  checked={selectedOptions[option] || false}
                  onChange={(e) => handleOptionChange(option, e.target.checked)}
                />
                <OptionLabel htmlFor={option}>
                  {option}
                </OptionLabel>
                <OptionPrice>{price}</OptionPrice>
              </OptionItem>
            ))}
          </OptionGroup>
          <OptionGroupTitle style={{ marginTop: '16px' }}>Invoice</OptionGroupTitle>
          <OptionItem style={{ marginTop: '8px' }}>
            <Checkbox
              type="checkbox"
              id="invoice-request"
              checked={invoiceRequested}
              onChange={(e) => setInvoiceRequested(e.target.checked)}
            />
            <OptionLabel htmlFor="invoice-request">
              I would like to request an invoice for this subscription renewal.
            </OptionLabel>
          </OptionItem>
        </OptionsSection>

        <ActionSection>
          <SubmitButton 
            onClick={() => onSubmitOrderForm(getSelectedOptionsForSubmission(), invoiceRequested)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaCheckCircle />
                Processing...
              </>
            ) : (
              <>
                <FaFileAlt />
                {isNewSubscription ? 'Submit New Subscription' : 'Submit Order Form'}
              </>
            )}
          </SubmitButton>
          
          <CloseButton onClick={onClose}>
            Cancel
          </CloseButton>
        </ActionSection>
      </ModalContent>
    </ModalOverlay>
  );
};

export default RenewalModal;
