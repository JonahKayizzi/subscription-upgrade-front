import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { useAddSubscriptionMutation, useGetSubscriberQuery, useAddSubscriberMutation, useGetSubscriptionQuery, useUpdateSubscriptionMutation, useRequestInvoiceMutation, useUploadReceiptMutation, useMarkInvoiceNotRequiredMutation, useUploadInvoiceMutation, useVerifyReceiptMutation } from '../api/apiSlice';
import { FaEye, FaExclamationTriangle, FaTimes, FaDownload, FaUpload, FaCheckCircle, FaClock } from 'react-icons/fa';

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

// Subscription Pipeline Styled Components
const PipelineContainer = styled.div`
  background: var(--color-background-card);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 24px;
  min-width: unset;
  flex: unset;
`;

const PipelineTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 20px 0;
`;

const ProgressSection = styled.div`
  margin-top: 16px;
`;

const ProgressStep = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background: var(--color-bg-card);
  border-radius: 8px;
  border-left: 3px solid ${props => props.completed ? '#10b981' : '#e5e7eb'};
`;

const StepIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  background: ${props => props.completed ? '#10b981' : '#e5e7eb'};
  color: ${props => props.completed ? 'white' : '#9ca3af'};
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.div`
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 4px;
`;

const StepDescription = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-muted);
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  
  &.primary {
    background: var(--color-primary);
    color: white;
    &:hover { background: var(--color-primary-dark); }
  }
  
  &.warning {
    background: var(--color-warning);
    color: white;
    &:hover { background: var(--color-warning-dark); }
  }
  
  &.secondary {
    background: var(--color-secondary);
    color: white;
    &:hover { background: var(--color-secondary-dark); }
  }
  
  &.success {
    background: var(--color-success);
    color: white;
    &:hover { background: var(--color-success-dark); }
  }
`;

const FileUploadSection = styled.div`
  margin-top: 8px;
`;

const UploadLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--color-bg-muted);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  transition: all 0.2s;
  
  &:hover {
    background: var(--color-border);
  }
`;

const UploadInput = styled.input`
  display: none;
`;

const DateInput = styled.input`
  padding: 4px 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.75rem;
  background: var(--color-background);
  color: var(--color-text);
  margin-left: 8px;
  
  &:focus {
    outline: none;
    border-color: var(--color-accent2);
  }
`;

const DateLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 8px;
`;

const SummarySection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
`;

const SummaryTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 12px;
`;

const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 0.875rem;
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border-light);
  }
`;

const HistoryIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  background: ${props => props.type === 'order' ? '#3b82f6' : props.type === 'invoice' ? '#f59e0b' : '#10b981'};
  color: white;
`;

const HistoryText = styled.div`
  flex: 1;
  color: var(--color-text-muted);
`;

const HistoryDate = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 500;
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
  const [requestInvoice] = useRequestInvoiceMutation();
  const [uploadReceipt] = useUploadReceiptMutation();
  const [markInvoiceNotRequired] = useMarkInvoiceNotRequiredMutation();
  const [uploadInvoice] = useUploadInvoiceMutation();
  const [verifyReceipt] = useVerifyReceiptMutation();
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
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [manualInvoiceRequestDate, setManualInvoiceRequestDate] = useState('');
  const [isSettingInvoiceDate, setIsSettingInvoiceDate] = useState(false);
  const [isSubmittingInvoice, setIsSubmittingInvoice] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);
  const [isVerifyingReceipt, setIsVerifyingReceipt] = useState(false);
  const [showReceiptVerificationModal, setShowReceiptVerificationModal] = useState(false);
  const [receiptVerificationData, setReceiptVerificationData] = useState({
    sub_start_date: '',
    sub_exp_date: '',
    sub_amount: '',
    sub_delivery: '',
    eaip_user_name: '',
    eaip_password: ''
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

  // Subscription Pipeline Logic
  const hasOrderForm = !!subscriptionDetails?.subscription_form;
  const hasInvoice = !!subscriptionDetails?.subscription_invoice;
  const isInvoiceNotRequired = subscriptionDetails?.invoice_no === 'NOT_REQUIRED';
  const hasInvoiceRequested = !!subscriptionDetails?.invoice_requested_date;
  const hasReceipt = !!subscriptionDetails?.subscription_receipt;

  const handleViewForm = (formPath) => {
    if (formPath) {
      const pdfUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${formPath}`;
      window.open(pdfUrl, '_blank');
    }
  };

  const handleViewInvoice = (invoicePath) => {
    if (invoicePath) {
      const invoiceUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${invoicePath}`;
      window.open(invoiceUrl, '_blank');
    }
  };

  const handleViewReceipt = (receiptPath) => {
    if (receiptPath) {
      const receiptUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${receiptPath}`;
      window.open(receiptUrl, '_blank');
    }
  };

  const handleRequestInvoice = async (subscriptionId) => {
    try {
      await requestInvoice(subscriptionId).unwrap();
      // Optionally refresh the subscription data
    } catch (error) {
      console.error('Failed to request invoice:', error);
    }
  };

  const handleInvoiceNotRequired = async (subscriptionId) => {
    try {
      await markInvoiceNotRequired(subscriptionId).unwrap();
      // Optionally refresh the subscription data
    } catch (error) {
      console.error('Failed to mark invoice as not required:', error);
    }
  };

  const handleUploadReceipt = async (subscriptionId, event) => {
    const file = event.target.files[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const handleSubmitReceipt = async (subscriptionId) => {
    if (!receiptFile || !receiptNumber) return;
    
    try {
      setIsSubmittingReceipt(true);
      
      await uploadReceipt({
        subscriptionId,
        receiptFile: receiptFile,
        receiptNumber: receiptNumber || null
      }).unwrap();
      
      // Clear form and refresh data
      setReceiptFile(null);
      setReceiptNumber('');
      
      // Refresh subscription data to show updated status
      // The subscription query will automatically refetch
      
    } catch (error) {
      console.error('Failed to upload receipt:', error);
    } finally {
      setIsSubmittingReceipt(false);
    }
  };

  const handleSetInvoiceRequestDate = async (subscriptionId, date) => {
    if (!date) return;
    
    try {
      setIsSettingInvoiceDate(true);
      // This would need a new API endpoint to update the invoice_requested_date
      // For now, we'll just update the local state
      setManualInvoiceRequestDate(date);
      console.log(`Invoice request date set to ${date} for subscription ${subscriptionId}`);
      // TODO: Implement API call to update invoice_requested_date
    } catch (error) {
      console.error('Failed to set invoice request date:', error);
    } finally {
      setIsSettingInvoiceDate(false);
    }
  };

  const handleUploadInvoice = async (subscriptionId, event) => {
    const file = event.target.files[0];
    if (file) {
      setInvoiceFile(file);
    }
  };

  const handleSubmitInvoice = async (subscriptionId) => {
    if (!invoiceFile || !invoiceNumber) return;
    
    try {
      setIsSubmittingInvoice(true);
      const formData = new FormData();
      formData.append('subscriptionId', subscriptionId);
      formData.append('invoiceFile', invoiceFile);
      formData.append('invoiceNumber', invoiceNumber);
      
      await uploadInvoice({
        subscriptionId,
        invoiceFile,
        invoiceNumber
      }).unwrap();
      
      // Clear form and refresh data
      setInvoiceFile(null);
      setInvoiceNumber('');
      
      // Refresh subscription data to show updated status
      // The subscription query will automatically refetch
      console.log('Invoice submitted successfully');
      
    } catch (error) {
      console.error('Failed to submit invoice:', error);
    } finally {
      setIsSubmittingInvoice(false);
    }
  };

  const handleReceiptVerification = async (subscriptionId, verified, details = null) => {
    try {
      setIsVerifyingReceipt(true);
      
      // Prepare subscription details, handling delivery method for non-eAIP subscriptions
      let processedDetails = null;
      if (details) {
        processedDetails = { ...details };
        
        // For eAIP subscriptions, don't send delivery method
        if (subscriptionDetails?.sub_type === 'eAIP') {
          delete processedDetails.sub_delivery;
        } else {
          // For CD/Paper, only send if not empty
          if (!processedDetails.sub_delivery || processedDetails.sub_delivery.trim() === '') {
            delete processedDetails.sub_delivery;
          }
        }
      }
      
      await verifyReceipt({
        subscriptionId,
        receiptVerified: verified,
        subscriptionDetails: processedDetails
      }).unwrap();
      
      // Close modal and refresh data
      setShowReceiptVerificationModal(false);
      setReceiptVerificationData({
        sub_start_date: '',
        sub_exp_date: '',
        sub_amount: '',
        sub_delivery: '',
        eaip_user_name: '',
        eaip_password: ''
      });
      
      console.log('Receipt verification completed successfully');
      
    } catch (error) {
      console.error('Failed to verify receipt:', error);
    } finally {
      setIsVerifyingReceipt(false);
    }
  };

  const handleReceiptVerificationDataChange = (e) => {
    const { name, value } = e.target;
    setReceiptVerificationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const progress = [
    { 
      step: 'Order Form', 
      completed: hasOrderForm, 
      description: hasOrderForm ? `Submitted on ${new Date(subscriptionDetails?.sub_date || Date.now()).toLocaleDateString()}` : 'Not submitted',
      hasAction: hasOrderForm,
      actionButton: hasOrderForm ? (
        <ActionButton 
          className="primary" 
          onClick={() => handleViewForm(subscriptionDetails?.subscription_form)}
          style={{ fontSize: '0.75rem', padding: '4px 8px', marginTop: '8px', marginLeft: 'auto' }}
        >
          <FaEye style={{ marginRight: '4px' }} />
          View Form
        </ActionButton>
      ) : null
    },
    { 
      step: 'Invoice', 
      completed: hasInvoice || isInvoiceNotRequired, 
      description: hasInvoice ? 'Submitted' : isInvoiceNotRequired ? 'Not Required - No invoice needed for this subscription' : hasInvoiceRequested ? 'Requested on ' + new Date(subscriptionDetails?.invoice_requested_date).toLocaleDateString() : 'Waiting for subscriber to request',
      hasAction: (!hasInvoice && !isInvoiceNotRequired) || hasInvoice,
             actionButton: !hasInvoice && !isInvoiceNotRequired ? (
         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', marginLeft: 'auto' }}>
           {!hasInvoiceRequested ? (
             <>
               <DateLabel>
                 <span>Set request date (offline):</span>
                 <DateInput
                   type="date"
                   value={manualInvoiceRequestDate}
                   onChange={(e) => setManualInvoiceRequestDate(e.target.value)}
                   max={new Date().toISOString().split('T')[0]}
                 />
               </DateLabel>
               <ActionButton 
                 className="primary" 
                 onClick={() => handleSetInvoiceRequestDate(subscriptionDetails?.id, manualInvoiceRequestDate)}
                 disabled={!manualInvoiceRequestDate || isSettingInvoiceDate}
                 style={{ fontSize: '0.75rem', padding: '4px 8px' }}
               >
                 {isSettingInvoiceDate ? 'Setting...' : 'Set Date'}
               </ActionButton>
             </>
           ) : (
             <>
               <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginBottom: '8px' }}>
                 Date set: {new Date(subscriptionDetails.invoice_requested_date || manualInvoiceRequestDate).toLocaleDateString()}
               </div>
               <FileUploadSection>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                       Invoice Number:
                     </label>
                     <input
                       type="text"
                       placeholder="Enter invoice number"
                       value={invoiceNumber || ''}
                       onChange={(e) => setInvoiceNumber(e.target.value)}
                       style={{
                         padding: '4px 8px',
                         border: '1px solid var(--color-border)',
                         borderRadius: '4px',
                         fontSize: '0.75rem',
                         background: 'var(--color-background)',
                         color: 'var(--color-text)',
                         minWidth: '120px'
                       }}
                     />
                   </div>
                   <UploadLabel>
                     <FaUpload />
                     Upload Invoice File
                     <UploadInput
                       type="file"
                       accept=".pdf,.jpg,.jpeg,.png"
                       onChange={(e) => handleUploadInvoice(subscriptionDetails?.id, e)}
                     />
                   </UploadLabel>
                   {invoiceFile && (
                     <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '4px' }}>
                       ✓ File selected: {invoiceFile.name}
                     </div>
                   )}
                   <ActionButton 
                     className="primary" 
                     onClick={() => handleSubmitInvoice(subscriptionDetails?.id)}
                     disabled={!invoiceFile || !invoiceNumber || isSubmittingInvoice}
                     style={{ fontSize: '0.75rem', padding: '4px 8px', alignSelf: 'flex-start' }}
                   >
                     {isSubmittingInvoice ? 'Submitting...' : 'Submit Invoice'}
                   </ActionButton>
                 </div>
               </FileUploadSection>
             </>
           )}
         </div>
       ) : isInvoiceNotRequired ? (
        <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '8px', marginLeft: 'auto', fontStyle: 'italic' }}>
          ✓ Invoice not required for this subscription
        </div>
      ) : hasInvoice ? (
        <ActionButton 
          className="primary" 
          onClick={() => handleViewInvoice(subscriptionDetails?.subscription_invoice)}
          style={{ fontSize: '0.75rem', padding: '4px 8px', marginTop: '8px', marginLeft: 'auto' }}
        >
          <FaDownload style={{ marginRight: '4px' }} />
          View Invoice
        </ActionButton>
      ) : null
    },
         { 
       step: 'Receipt', 
       completed: hasReceipt && subscriptionDetails?.receipt_verified_date, 
       description: hasReceipt ? 
         (subscriptionDetails?.receipt_verified_date ? 'Verified and activated' : 'Submitted - Pending verification') : 
         (hasInvoice || isInvoiceNotRequired) ? 'Pending payment receipt' : 'Pending invoice',
       hasAction: hasReceipt || (hasInvoice || isInvoiceNotRequired),
               actionButton: hasReceipt ? (
          subscriptionDetails?.receipt_verified_date ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', marginLeft: 'auto' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontStyle: 'italic' }}>
                ✓ Receipt verified on {new Date(subscriptionDetails.receipt_verified_date).toLocaleDateString()}
              </div>
              <ActionButton 
                className="primary" 
                onClick={() => handleViewReceipt(subscriptionDetails?.subscription_receipt)}
                style={{ fontSize: '0.75rem', padding: '4px 8px', alignSelf: 'flex-start' }}
              >
                <FaEye style={{ marginRight: '4px' }} />
                View Receipt
              </ActionButton>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', marginLeft: 'auto' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-warning)', marginBottom: '8px' }}>
                Receipt uploaded - Ready for verification
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <ActionButton 
                  className="primary" 
                  onClick={() => handleViewReceipt(subscriptionDetails?.subscription_receipt)}
                  style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                >
                  <FaEye style={{ marginRight: '4px' }} />
                  View Receipt
                </ActionButton>
                <ActionButton 
                  className="success" 
                  onClick={() => setShowReceiptVerificationModal(true)}
                  style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                >
                  <FaCheckCircle style={{ marginRight: '4px' }} />
                  Verify Receipt
                </ActionButton>
              </div>
            </div>
          )
                                ) : (hasInvoice || isInvoiceNotRequired) && !hasReceipt ? (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', marginLeft: 'auto' }}>
             <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
               Upload payment receipt to continue
             </div>
             <FileUploadSection>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                     Receipt Number:
                   </label>
                   <input
                     type="text"
                     placeholder="Enter receipt number"
                     value={receiptNumber || ''}
                     onChange={(e) => setReceiptNumber(e.target.value)}
                     style={{
                       padding: '4px 8px',
                       border: '1px solid var(--color-border)',
                       borderRadius: '4px',
                       fontSize: '0.75rem',
                       background: 'var(--color-background)',
                       color: 'var(--color-text)',
                       minWidth: '120px'
                     }}
                   />
                 </div>
                 <UploadLabel>
                   <FaUpload />
                   Upload Receipt File
                   <UploadInput
                     type="file"
                     accept=".pdf,.jpg,.jpeg,.png"
                     onChange={(e) => handleUploadReceipt(subscriptionDetails?.id, e)}
                   />
                 </UploadLabel>
                 {receiptFile && (
                   <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '4px' }}>
                     ✓ File selected: {receiptFile.name}
                   </div>
                 )}
                 <ActionButton 
                   className="primary" 
                   onClick={() => handleSubmitReceipt(subscriptionDetails?.id)}
                   disabled={!receiptFile || isSubmittingReceipt}
                   style={{ fontSize: '0.75rem', padding: '4px 8px', alignSelf: 'flex-start' }}
                 >
                   {isSubmittingReceipt ? 'Submitting...' : 'Submit Receipt'}
                 </ActionButton>
               </div>
             </FileUploadSection>
           </div>
         ) : null
     }
  ];

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

           {/* Receipt Verification Modal */}
           <Modal isOpen={showReceiptVerificationModal} onClose={() => setShowReceiptVerificationModal(false)}>
             <div style={{ minWidth: 500, padding: 24 }}>
               <h3 style={{ margin: 0, marginBottom: 16 }}>Verify Receipt & Activate Subscription</h3>
               <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
                 Verify the payment receipt and populate subscription details to activate the subscription.
               </p>
               
               <form onSubmit={(e) => {
                 e.preventDefault();
                 handleReceiptVerification(subscriptionDetails?.id, true, receiptVerificationData);
               }}>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                   <FormGroup>
                     <label>Start Date *</label>
                     <input
                       type="date"
                       name="sub_start_date"
                       value={receiptVerificationData.sub_start_date}
                       onChange={handleReceiptVerificationDataChange}
                       required
                     />
                   </FormGroup>
                   <FormGroup>
                     <label>Expiry Date *</label>
                     <input
                       type="date"
                       name="sub_exp_date"
                       value={receiptVerificationData.sub_exp_date}
                       onChange={handleReceiptVerificationDataChange}
                       required
                     />
                   </FormGroup>
                   <FormGroup>
                     <label>Amount (USD) *</label>
                     <input
                       type="number"
                       name="sub_amount"
                       value={receiptVerificationData.sub_amount}
                       onChange={handleReceiptVerificationDataChange}
                       min="0"
                       step="0.01"
                       required
                     />
                   </FormGroup>
                                       {subscriptionDetails?.sub_type !== 'eAIP' && (
                      <FormGroup>
                        <label>Delivery Method</label>
                        <input
                          name="sub_delivery"
                          value={receiptVerificationData.sub_delivery}
                          onChange={handleReceiptVerificationDataChange}
                          placeholder="e.g. Email, Courier, Pickup"
                        />
                      </FormGroup>
                    )}
                   {subscriptionDetails?.sub_type === 'eAIP' && (
                     <>
                       <FormGroup>
                         <label>eAIP Username</label>
                         <input
                           name="eaip_user_name"
                           value={receiptVerificationData.eaip_user_name}
                           onChange={handleReceiptVerificationDataChange}
                           placeholder="Username for eAIP access"
                         />
                       </FormGroup>
                       <FormGroup>
                         <label>eAIP Password</label>
                         <input
                           name="eaip_password"
                           type="password"
                           value={receiptVerificationData.eaip_password}
                           onChange={handleReceiptVerificationDataChange}
                           placeholder="Password for eAIP access"
                         />
                       </FormGroup>
                     </>
                   )}
                 </div>
                 
                 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                   <Button 
                     type="button" 
                     onClick={() => setShowReceiptVerificationModal(false)}
                     style={{ background: 'var(--color-bg-muted)', color: 'var(--color-text)' }}
                   >
                     Cancel
                   </Button>
                   <Button 
                     type="submit" 
                     disabled={isVerifyingReceipt || !receiptVerificationData.sub_start_date || !receiptVerificationData.sub_exp_date || !receiptVerificationData.sub_amount}
                     style={{ background: 'var(--color-success)', color: '#fff' }}
                   >
                     {isVerifyingReceipt ? 'Verifying...' : 'Verify & Activate'}
                   </Button>
                 </div>
               </form>
             </div>
           </Modal>
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
          {subscriptionDetails ? (
            <PipelineContainer>
              <PipelineTitle>Subscription Pipeline</PipelineTitle>
              <ProgressSection>
                {progress.map((step, index) => (
                  <ProgressStep key={index} completed={step.completed}>
                    <StepIcon completed={step.completed}>
                      {step.completed ? <FaCheckCircle /> : index + 1}
                    </StepIcon>
                    <StepContent>
                      <StepTitle>{step.step}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                      {step.actionButton}
                    </StepContent>
                  </ProgressStep>
                ))}
              </ProgressSection>

              <SummarySection>
                <SummaryTitle>Subscription Summary</SummaryTitle>
                                 <HistoryItem>
                   <HistoryIcon type="order">O</HistoryIcon>
                   <HistoryText>Order form submitted</HistoryText>
                   <HistoryDate>{subscriptionDetails?.sub_date ? new Date(subscriptionDetails.sub_date).toLocaleDateString() : 'N/A'}</HistoryDate>
                 </HistoryItem>
                 
                 {hasInvoiceRequested && !hasInvoice && !isInvoiceNotRequired && (
                   <HistoryItem>
                     <HistoryIcon type="invoice">I</HistoryIcon>
                     <HistoryText>Invoice requested</HistoryText>
                     <HistoryDate>{subscriptionDetails?.invoice_requested_date ? new Date(subscriptionDetails.invoice_requested_date).toLocaleDateString() : 'N/A'}</HistoryDate>
                   </HistoryItem>
                 )}
                 
                                   {hasInvoice && !isInvoiceNotRequired && (
                    <HistoryItem>
                      <HistoryIcon type="invoice">I</HistoryIcon>
                      <HistoryText>Invoice submitted</HistoryText>
                      <HistoryDate>{subscriptionDetails?.invoice_received_date ? new Date(subscriptionDetails.invoice_received_date).toLocaleDateString() : 'N/A'}</HistoryDate>
                    </HistoryItem>
                  )}
                 {isInvoiceNotRequired && (
                   <HistoryItem>
                     <HistoryIcon type="invoice">I</HistoryIcon>
                     <HistoryText>Invoice not required</HistoryText>
                     <HistoryDate style={{ color: 'var(--color-success)', fontStyle: 'italic' }}>N/A</HistoryDate>
                   </HistoryItem>
                 )}
                 
                                   {hasReceipt && (
                   <HistoryItem>
                     <HistoryIcon type="receipt">R</HistoryIcon>
                     <HistoryText>Payment receipt submitted</HistoryText>
                     <HistoryDate>{subscriptionDetails?.receipt_received_date ? new Date(subscriptionDetails.receipt_received_date).toLocaleDateString() : 'N/A'}</HistoryDate>
                   </HistoryItem>
                 )}
                 
                 {subscriptionDetails?.receipt_verified_date && (
                   <HistoryItem>
                     <HistoryIcon type="receipt">✓</HistoryIcon>
                     <HistoryText>Receipt verified and subscription activated</HistoryText>
                     <HistoryDate>{new Date(subscriptionDetails.receipt_verified_date).toLocaleDateString()}</HistoryDate>
                   </HistoryItem>
                 )}
              </SummarySection>
            </PipelineContainer>
          ) : (
            <SidebarCard>
              <Title>Subscription Pipeline</Title>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                The subscription pipeline will appear here once a subscription is created or selected for editing.
              </p>
            </SidebarCard>
          )}
        </Sidebar>
      </ContentWrapper>
    </MainContent>
  );
} 