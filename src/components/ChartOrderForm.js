import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { useAddChartOrderMutation } from '../api/apiSlice';

const Card = styled.div`
  background: var(--color-bg-card);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
  padding: 32px 32px 24px 32px;
  min-width: 420px;
  max-width: 700px;
  margin: 0 auto;
  color: var(--color-text);
  border: 1px solid var(--color-border);
`;

const Title = styled.h2`
  margin: 0 0 24px 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-text);
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
    color: var(--color-text-muted);
    margin-bottom: 6px;
    font-weight: 500;
  }
  input, select, textarea {
    padding: 12px 16px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 0.95rem;
    transition: border-color 0.2s ease;
    &:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px rgba(247, 184, 1, 0.1);
    }
    &::placeholder {
      color: var(--color-text-muted);
    }
  }
  select {
    color: var(--color-text);
    option {
      background: var(--color-bg);
      color: var(--color-text);
    }
  }
  textarea {
    resize: vertical;
    min-height: 80px;
  }
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
  color: var(--color-text);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 8px;
`;

const RequiredField = styled.span`
  color: var(--color-error);
  margin-left: 4px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: var(--color-accent);
    cursor: pointer;
  }
  
  label {
    font-size: 0.9rem;
    color: var(--color-text-muted);
    margin: 0;
    cursor: pointer;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const ErrorText = styled.div`
  color: var(--color-error);
  background: rgba(255, 77, 79, 0.1);
  border: 1px solid var(--color-error);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 0.9rem;
`;

const SuccessText = styled.div`
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid #10b981;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 0.9rem;
`;

const PriceDisplay = styled.div`
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: center;
  
  h4 {
    color: var(--color-accent);
    margin: 0 0 8px 0;
    font-size: 1rem;
  }
  
  .price {
    color: #10b981;
    font-size: 1.2rem;
    font-weight: 700;
  }
`;

const FieldError = styled.div`
  color: var(--color-error);
  font-size: 0.8rem;
  margin-top: 4px;
`;

const FormGroupWithError = styled(FormGroup)`
  ${props => props.hasError && `
    input, select, textarea {
      border-color: var(--color-error);
    }
  `}
`;

const ChartInfo = styled.div`
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  h4 {
    color: var(--color-accent);
    margin: 0 0 8px 0;
    font-size: 1rem;
  }
  p {
    color: var(--color-text-muted);
    margin: 4px 0;
    font-size: 0.9rem;
  }
`;

const CHART_SIZES = [
  { label: 'A4 size', value: 'a4' },
  { label: 'A3 size', value: 'a3' },
  { label: 'A0 size', value: 'a0' },
];

// Pricing calculation based on chart prices
const calculatePrice = (chartPrices, size, copies) => {
  if (!chartPrices || !size || !copies) return 0;
  
  // Handle both old format (array of strings) and new format (array of objects)
  let pricePerSheet = 0;
  
  if (Array.isArray(chartPrices) && chartPrices.length > 0) {
    // Check if it's new format (array of objects with size and price_usd)
    if (typeof chartPrices[0] === 'object' && chartPrices[0].size) {
      const priceObj = chartPrices.find(p => p.size && p.size.toLowerCase() === size.toLowerCase());
      if (priceObj && priceObj.price_usd) {
        pricePerSheet = parseFloat(priceObj.price_usd);
      }
    } else {
      // Old format (array of strings like "A4 size: 5 USD")
      const priceString = chartPrices.find(price => 
        typeof price === 'string' && price.toLowerCase().includes(size.toLowerCase())
      );
      
      if (priceString) {
        const priceMatch = priceString.match(/(\d+)\s*USD/);
        if (priceMatch) {
          pricePerSheet = parseInt(priceMatch[1]);
        }
      }
    }
  }
  
  return pricePerSheet * parseInt(copies);
};

export default function ChartOrderForm({ chart, isOpen, onClose }) {
  console.log('ChartOrderForm rendered with props:', { chart, isOpen, onClose });
  const [addChartOrder, { isLoading }] = useAddChartOrderMutation();
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
    chart_size: '',
    num_copies: '',
    special_instructions: '',
    reciprocal: false,
    on_payment: false,
    invoice_requested: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Calculate total price
  const totalPrice = chart ? calculatePrice(chart.prices, form.chart_size, form.num_copies) : 0;

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    if (!form.delivery_name.trim()) {
      errors.delivery_name = 'Delivery name is required';
    }
    
    if (!form.delivery_address.trim()) {
      errors.delivery_address = 'Delivery address is required';
    }
    
    if (!form.delivery_email.trim()) {
      errors.delivery_email = 'Delivery email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.delivery_email)) {
      errors.delivery_email = 'Please enter a valid email address';
    }
    
    if (!form.chart_size) {
      errors.chart_size = 'Please select a chart size';
    }
    
    if (!form.num_copies || parseInt(form.num_copies) < 1) {
      errors.num_copies = 'Please enter a valid number of copies (minimum 1)';
    }
    
    if (form.billing_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.billing_email)) {
      errors.billing_email = 'Please enter a valid billing email address';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    // Validate form
    if (!validateForm()) {
      setError('Please correct the errors below.');
      return;
    }
    
    // Authentication is handled by parent component

    try {
      // Prepare order data
      const orderData = {
        chart_id: chart.id,
        chart_name: Array.isArray(chart.name) ? chart.name[0] : chart.name,
        chart_title: chart.title || '',
        chart_scale: chart.scale || '',
        chart_date: chart.update_date || chart.date || '',
        chart_prices: chart.prices || [],
        ...form,
        order_type: 'chart'
      };

      // Submit to backend using Redux mutation
      await addChartOrder(orderData).unwrap();

      setSuccess(true);
      // Reset form after successful submission
      setTimeout(() => {
        setForm({
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
          chart_size: '',
          num_copies: '',
          special_instructions: '',
          reciprocal: false,
          on_payment: false,
          invoice_requested: false,
        });
        onClose();
      }, 2000);
      
    } catch (err) {
      setError(err.data?.error || err.message || 'Failed to submit order. Please try again.');
    }
  };

  console.log('ChartOrderForm render - isOpen:', isOpen, 'chart:', chart);

  if (!chart) {
    console.log('No chart provided, returning null');
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card>
        <Title>Order form for renewal of chart</Title>
        
        <ChartInfo>
          <h4>{chart.title || 'Chart'}</h4>
          <p><strong>Name:</strong> {Array.isArray(chart.name) ? chart.name.join(', ') : chart.name}</p>
          {chart.scale && <p><strong>Scale:</strong> {chart.scale}</p>}
          <p><strong>Date:</strong> {chart.update_date || chart.date || 'N/A'}</p>
          <p><strong>Available Sizes & Prices:</strong></p>
          {chart.prices && chart.prices.length > 0 ? (
            chart.prices.map((price, i) => {
              // Handle both old format (string) and new format (object)
              const priceText = typeof price === 'object' && price.size
                ? `${price.size.toUpperCase()} size: ${price.price_usd} USD`
                : price;
              return (
                <p key={i} style={{ marginLeft: '16px' }}>• {priceText}</p>
              );
            })
          ) : (
            <p style={{ marginLeft: '16px', color: 'var(--color-text-muted)' }}>No pricing available</p>
          )}
        </ChartInfo>

        {totalPrice > 0 && (
          <PriceDisplay>
            <h4>Order Total</h4>
            <div className="price">${totalPrice} USD</div>
          </PriceDisplay>
        )}

        <form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Delivery Information</SectionTitle>
            <FormGrid>
              <FormGroupWithError hasError={validationErrors.delivery_name}>
                <label>Delivery Name<RequiredField>*</RequiredField></label>
                <input name="delivery_name" value={form.delivery_name} onChange={handleChange} required />
                {validationErrors.delivery_name && <FieldError>{validationErrors.delivery_name}</FieldError>}
              </FormGroupWithError>
              <FormGroup>
                <label>Billing Name</label>
                <input name="billing_name" value={form.billing_name} onChange={handleChange} />
              </FormGroup>
            </FormGrid>
            <FormGrid>
              <FormGroupWithError hasError={validationErrors.delivery_address}>
                <label>Delivery Address<RequiredField>*</RequiredField></label>
                <input name="delivery_address" value={form.delivery_address} onChange={handleChange} required />
                {validationErrors.delivery_address && <FieldError>{validationErrors.delivery_address}</FieldError>}
              </FormGroupWithError>
              <FormGroup>
                <label>Billing Address</label>
                <input name="billing_address" value={form.billing_address} onChange={handleChange} />
              </FormGroup>
            </FormGrid>
            <FormGrid>
              <FormGroup>
                <label>Delivery Telephone</label>
                <input name="delivery_tel" value={form.delivery_tel} onChange={handleChange} type="tel" />
              </FormGroup>
              <FormGroup>
                <label>Billing Telephone</label>
                <input name="billing_tel" value={form.billing_tel} onChange={handleChange} type="tel" />
              </FormGroup>
            </FormGrid>
            <FormGrid>
              <FormGroupWithError hasError={validationErrors.delivery_email}>
                <label>Delivery Email<RequiredField>*</RequiredField></label>
                <input name="delivery_email" value={form.delivery_email} onChange={handleChange} type="email" required />
                {validationErrors.delivery_email && <FieldError>{validationErrors.delivery_email}</FieldError>}
              </FormGroupWithError>
              <FormGroupWithError hasError={validationErrors.billing_email}>
                <label>Billing Email</label>
                <input name="billing_email" value={form.billing_email} onChange={handleChange} type="email" />
                {validationErrors.billing_email && <FieldError>{validationErrors.billing_email}</FieldError>}
              </FormGroupWithError>
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
            <FormGrid>
              <FormGroupWithError hasError={validationErrors.chart_size}>
                <label>Chart Size<RequiredField>*</RequiredField></label>
                <select name="chart_size" value={form.chart_size} onChange={handleChange} required>
                  <option value="">Select chart size</option>
                  {CHART_SIZES.map(size => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
                {validationErrors.chart_size && <FieldError>{validationErrors.chart_size}</FieldError>}
              </FormGroupWithError>
              <FormGroupWithError hasError={validationErrors.num_copies}>
                <label>No. of Copies<RequiredField>*</RequiredField></label>
                <input name="num_copies" value={form.num_copies} onChange={handleChange} required type="number" min="1" />
                {validationErrors.num_copies && <FieldError>{validationErrors.num_copies}</FieldError>}
              </FormGroupWithError>
            </FormGrid>
            <FormGroup>
              <label>Special Instructions</label>
              <textarea 
                name="special_instructions" 
                value={form.special_instructions} 
                onChange={handleChange}
                placeholder="Any special delivery instructions or requirements..."
              />
            </FormGroup>
            <FormGrid>
              <CheckboxGroup>
                <input id="reciprocal" name="reciprocal" type="checkbox" checked={form.reciprocal} onChange={handleChange} />
                <label htmlFor="reciprocal">Reciprocal basis</label>
              </CheckboxGroup>
              <CheckboxGroup>
                <input id="on_payment" name="on_payment" type="checkbox" checked={form.on_payment} onChange={handleChange} />
                <label htmlFor="on_payment">On Payment</label>
              </CheckboxGroup>
            </FormGrid>
            <CheckboxGroup style={{ marginTop: '12px' }}>
              <input id="invoice_requested" name="invoice_requested" type="checkbox" checked={form.invoice_requested} onChange={handleChange} />
              <label htmlFor="invoice_requested">I would like to request an invoice for this chart order.</label>
            </CheckboxGroup>
          </FormSection>

          {error && <ErrorText>{error}</ErrorText>}
          {success && <SuccessText>Chart order submitted successfully!</SuccessText>}
          <ButtonRow>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Order'}
            </Button>
          </ButtonRow>
        </form>
      </Card>
    </Modal>
  );
}

