import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Card from './ui/Card';
import styled from 'styled-components';
import { FaFileAlt, FaUpload, FaDownload, FaCheckCircle, FaClock, FaExclamationTriangle, FaPlus, FaGlobe, FaFileAlt as FaPaper, FaCompactDisc, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useGetSubscriberDashboardQuery, useRequestInvoiceMutation, useUploadReceiptMutation, useUpdateSubscriberInfoMutation } from '../api/apiSlice';
import SubscriberInfoForm from './SubscriberInfoForm';

const DashboardContainer = styled.div`
  padding: 32px;
  display: flex;
  gap: 32px;
  min-height: 100vh;
  
  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 32px;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px;
  border-radius: 16px;
  margin-bottom: 24px;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 8px;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: 24px;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--color-accent2);
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: var(--color-text-muted);
  font-size: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 16px;
  color: var(--color-text);
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid var(--color-border);
  margin-bottom: 24px;
`;

const Tab = styled.button`
  padding: 12px 24px;
  border: none;
  background: none;
  color: var(--color-text-muted);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &.active {
    color: var(--color-accent2);
    border-bottom-color: var(--color-accent2);
  }
  
  &:hover {
    color: var(--color-text);
  }
`;

const TabIcon = styled.div`
  font-size: 1.1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: var(--color-text-muted);
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 8px;
`;

const EmptyStateSubtext = styled.p`
  font-size: 0.9rem;
  opacity: 0.7;
`;

const SubscriptionCard = styled(Card)`
  margin-bottom: 16px;
  border-left: 4px solid;
  border-left-color: ${props => {
    switch(props.status) {
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'expired': return '#ef4444';
      default: return '#6b7280';
    }
  }};
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => {
    switch(props.status) {
      case 'active': return '#dcfce7';
      case 'pending': return '#fef3c7';
      case 'expired': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'active': return '#166534';
      case 'pending': return '#92400e';
      case 'expired': return '#991b1b';
      default: return '#6b7280';
    }
  }};
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 8px;
  margin-bottom: 8px;
  
  &.primary {
    background: var(--color-accent2);
    color: white;
    
    &:hover {
      background: #1e40af;
    }
  }
  
  &.secondary {
    background: var(--color-bg-card);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    
    &:hover {
      background: var(--color-bg);
    }
  }
  
  &.success {
    background: #10b981;
    color: white;
    
    &:hover {
      background: #059669;
    }
  }
  
  &.warning {
    background: #f59e0b;
    color: white;
    
    &:hover {
      background: #d97706;
    }
  }
`;

const FileUploadSection = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: var(--color-bg);
  border-radius: 8px;
  border: 2px dashed var(--color-border);
`;

const UploadInput = styled.input`
  display: none;
`;

const UploadLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--color-accent2);
  font-weight: 500;
  
  &:hover {
    color: #1e40af;
  }
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

const HistorySection = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
`;

const HistoryTitle = styled.h4`
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

const RenewButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: #059669;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #047857;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const TabHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const TabTitle = styled.h3`
  font-size: 1.25rem;
  color: var(--color-text);
  margin: 0;
`;

const ExpandableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 16px;
  background: ${props => props.expanded ? 'var(--color-bg)' : 'transparent'};
  border-radius: ${props => props.expanded ? '8px 8px 0 0' : '8px'};
  transition: all 0.2s;
  
  &:hover {
    background: var(--color-bg);
  }
`;

const ExpandableContent = styled.div`
  max-height: ${props => props.expanded ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  background: var(--color-bg);
  border-radius: 0 0 8px 8px;
`;

const ExpandableIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--color-text-muted);
  transition: transform 0.2s;
  transform: ${props => props.expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const ExpiredBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #fee2e2;
  color: #991b1b;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export default function SubscriberDashboard() {
  const user = useSelector(state => state.auth.user);
  const { data: dashboardData, isLoading, error } = useGetSubscriberDashboardQuery();
  const [activeTab, setActiveTab] = useState('eAIP');
  const [expandedSubscriptions, setExpandedSubscriptions] = useState(new Set());
  const [requestInvoice] = useRequestInvoiceMutation();
  const [uploadReceipt] = useUploadReceiptMutation();
  const [updateSubscriberInfo] = useUpdateSubscriberInfoMutation();
  
  const subscriptionTypes = [
    { id: 'eAIP', label: 'eAIP', icon: <FaGlobe />, description: 'Electronic Aeronautical Information Publication' },
    { id: 'Paper AIP', label: 'Paper AIP', icon: <FaPaper />, description: 'Physical Paper Publications' },
    { id: 'CD AIP', label: 'CD AIP', icon: <FaCompactDisc />, description: 'CD-ROM Publications' }
  ];

  const handleRequestInvoice = async (subscriptionId) => {
    try {
      await requestInvoice(subscriptionId).unwrap();
      // TODO: Show success message
    } catch (err) {
      console.error('Failed to request invoice:', err);
      // TODO: Show error message
    }
  };

  const handleUploadReceipt = async (subscriptionId, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await uploadReceipt({ subscriptionId, receiptFile: file }).unwrap();
        // TODO: Show success message
      } catch (err) {
        console.error('Failed to upload receipt:', err);
        // TODO: Show error message
      }
    }
  };

  const handleNewSubscription = () => {
    // TODO: Navigate to subscription form
    console.log('Starting new subscription');
  };

  const handleUpdateSubscriberInfo = async (formData) => {
    try {
      await updateSubscriberInfo(formData).unwrap();
      // Refresh dashboard data after update
      // TODO: Add refetch functionality
    } catch (err) {
      throw new Error(err.data?.error || 'Failed to update subscriber information');
    }
  };

  const handleRenewSubscription = async (subscriptionType) => {
    try {
      // TODO: Implement renewal logic
      console.log(`Renewing ${subscriptionType} subscription`);
      // This would typically navigate to a renewal form or trigger a renewal process
    } catch (err) {
      console.error('Failed to renew subscription:', err);
    }
  };

  const toggleExpandedSubscription = (subscriptionId) => {
    setExpandedSubscriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subscriptionId)) {
        newSet.delete(subscriptionId);
      } else {
        newSet.add(subscriptionId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Loading your dashboard...
        </div>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--color-error)' }}>
          Error loading dashboard: {error.message}
        </div>
      </DashboardContainer>
    );
  }

  const { subscriptions = [], stats = {}, subscriber } = dashboardData || {};
  const { activeSubscriptions = 0, pendingSubscriptions = 0, totalAmount = 0 } = stats;
  const hasExistingData = subscriber && subscriber.sub_name;
  
  // Filter subscriptions by active tab and sort by most recent first
  const filteredSubscriptions = subscriptions
    .filter(sub => sub.sub_type === activeTab || sub.publication_type === activeTab)
    .sort((a, b) => new Date(b.sub_date) - new Date(a.sub_date)); // Most recent first

  return (
    <DashboardContainer>
      <LeftPanel>
        <WelcomeSection>
          <WelcomeTitle>Welcome back, {user?.name || user?.email}!</WelcomeTitle>
          <WelcomeSubtitle>Manage your AIP subscriptions and track your orders</WelcomeSubtitle>
        </WelcomeSection>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <SectionTitle>Your Subscriptions</SectionTitle>
            <ActionButton className="primary" onClick={handleNewSubscription}>
              <FaPlus style={{ marginRight: '8px' }} />
              New Subscription
            </ActionButton>
          </div>
          
          <TabContainer>
            {subscriptionTypes.map(type => (
              <Tab
                key={type.id}
                className={activeTab === type.id ? 'active' : ''}
                onClick={() => setActiveTab(type.id)}
              >
                <TabIcon>{type.icon}</TabIcon>
                <div>
                  <div>{type.label}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{type.description}</div>
                </div>
              </Tab>
            ))}
          </TabContainer>

          {activeTab && (
            <TabHeader>
              <TabTitle>{subscriptionTypes.find(t => t.id === activeTab)?.label} Subscriptions</TabTitle>
              <RenewButton 
                onClick={() => handleRenewSubscription(activeTab)}
                disabled={filteredSubscriptions.length === 0}
              >
                <FaPlus />
                Renew {activeTab}
              </RenewButton>
            </TabHeader>
          )}

          {filteredSubscriptions.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>{subscriptionTypes.find(t => t.id === activeTab)?.icon}</EmptyStateIcon>
              <EmptyStateText>No {activeTab} subscriptions found</EmptyStateText>
              <EmptyStateSubtext>You don't have any {activeTab} subscriptions yet. Start a new subscription to get started.</EmptyStateSubtext>
            </EmptyState>
          ) : (
            filteredSubscriptions.map(subscription => {
              // Determine progress based on subscription data
              const hasOrderForm = subscription.subscription_form;
              const hasInvoice = subscription.subscription_invoice;
              const hasReceipt = subscription.subscription_receipt;
              
              const progress = [
                { 
                  step: 'Order Form', 
                  completed: hasOrderForm, 
                  description: hasOrderForm ? `Submitted on ${new Date(subscription.sub_date).toLocaleDateString()}` : 'Not submitted'
                },
                { 
                  step: 'Invoice', 
                  completed: hasInvoice, 
                  description: hasInvoice ? 'Received' : 'Awaiting admin response'
                },
                { 
                  step: 'Receipt', 
                  completed: hasReceipt, 
                  description: hasReceipt ? 'Submitted' : 'Pending invoice'
                }
              ];

                             const isExpired = subscription.status === 'expired';
               const isExpanded = expandedSubscriptions.has(subscription.id);
               
               if (isExpired) {
                 return (
                   <SubscriptionCard key={subscription.id} status={subscription.status}>
                     <ExpandableHeader 
                       expanded={isExpanded}
                       onClick={() => toggleExpandedSubscription(subscription.id)}
                     >
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                         <div>
                           <h3 style={{ marginBottom: '8px', color: 'var(--color-text)' }}>
                             {subscription.sub_type} Subscription
                           </h3>
                           <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                             <span>Amount: ${subscription.sub_amount}</span>
                             <span>Start: {new Date(subscription.sub_start_date).toLocaleDateString()}</span>
                             <span>End: {new Date(subscription.sub_exp_date).toLocaleDateString()}</span>
                           </div>
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                           <ExpiredBadge>
                             <FaClock />
                             Expired
                           </ExpiredBadge>
                           <ExpandableIcon expanded={isExpanded}>
                             {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                           </ExpandableIcon>
                         </div>
                       </div>
                     </ExpandableHeader>
                     
                     <ExpandableContent expanded={isExpanded}>
                       <div style={{ padding: '16px' }}>
                         <ProgressSection>
                           <h4 style={{ marginBottom: '12px', color: 'var(--color-text)' }}>Progress</h4>
                           {progress.map((step, index) => (
                             <ProgressStep key={index} completed={step.completed}>
                               <StepIcon completed={step.completed}>
                                 {step.completed ? <FaCheckCircle /> : index + 1}
                               </StepIcon>
                               <StepContent>
                                 <StepTitle>{step.step}</StepTitle>
                                 <StepDescription>{step.description}</StepDescription>
                               </StepContent>
                             </ProgressStep>
                           ))}
                         </ProgressSection>

                         <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                           {!hasInvoice && (
                             <ActionButton 
                               className="warning" 
                               onClick={() => handleRequestInvoice(subscription.id)}
                             >
                               <FaExclamationTriangle style={{ marginRight: '8px' }} />
                               Request Invoice
                             </ActionButton>
                           )}
                           
                           {hasInvoice && !hasReceipt && (
                             <FileUploadSection>
                               <UploadLabel>
                                 <FaUpload />
                                 Upload Payment Receipt
                                 <UploadInput
                                   type="file"
                                   accept=".pdf,.jpg,.jpeg,.png"
                                   onChange={(e) => handleUploadReceipt(subscription.id, e)}
                                 />
                               </UploadLabel>
                             </FileUploadSection>
                           )}
                           
                           {hasReceipt && (
                             <ActionButton className="success">
                               <FaCheckCircle style={{ marginRight: '8px' }} />
                               Receipt Submitted
                             </ActionButton>
                           )}
                         </div>

                         <HistorySection>
                           <HistoryTitle>Subscription History</HistoryTitle>
                           <HistoryItem>
                             <HistoryIcon type="order">O</HistoryIcon>
                             <HistoryText>Order form submitted</HistoryText>
                             <HistoryDate>{new Date(subscription.sub_date).toLocaleDateString()}</HistoryDate>
                           </HistoryItem>
                           
                           {hasInvoice && (
                             <HistoryItem>
                               <HistoryIcon type="invoice">I</HistoryIcon>
                               <HistoryText>Invoice received from admin</HistoryText>
                               <HistoryDate>{new Date(subscription.subscription_invoice_date || subscription.sub_date).toLocaleDateString()}</HistoryDate>
                             </HistoryItem>
                           )}
                           
                           {hasReceipt && (
                             <HistoryItem>
                               <HistoryIcon type="receipt">R</HistoryIcon>
                               <HistoryText>Payment receipt uploaded</HistoryText>
                               <HistoryDate>{new Date(subscription.subscription_receipt_date || subscription.sub_date).toLocaleDateString()}</HistoryDate>
                             </HistoryItem>
                           )}
                           
                           {subscription.sub_start_date && (
                             <HistoryItem>
                               <HistoryIcon type="receipt">S</HistoryIcon>
                               <HistoryText>Subscription started</HistoryText>
                               <HistoryDate>{new Date(subscription.sub_start_date).toLocaleDateString()}</HistoryDate>
                             </HistoryItem>
                           )}
                           
                           {subscription.sub_exp_date && (
                             <HistoryItem>
                               <HistoryIcon type="receipt">E</HistoryIcon>
                               <HistoryText>Subscription expires</HistoryText>
                               <HistoryDate>{new Date(subscription.sub_exp_date).toLocaleDateString()}</HistoryDate>
                             </HistoryItem>
                           )}
                         </HistorySection>
                       </div>
                     </ExpandableContent>
                   </SubscriptionCard>
                 );
               } else {
                 // Regular subscription card for non-expired subscriptions
                 return (
                   <SubscriptionCard key={subscription.id} status={subscription.status}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                       <div>
                         <h3 style={{ marginBottom: '8px', color: 'var(--color-text)' }}>
                           {subscription.sub_type} Subscription
                         </h3>
                         <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                           <span>Amount: ${subscription.sub_amount}</span>
                           <span>Start: {new Date(subscription.sub_start_date).toLocaleDateString()}</span>
                           <span>End: {new Date(subscription.sub_exp_date).toLocaleDateString()}</span>
                         </div>
                       </div>
                       <StatusBadge status={subscription.status}>
                         {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                       </StatusBadge>
                     </div>

                     <ProgressSection>
                       <h4 style={{ marginBottom: '12px', color: 'var(--color-text)' }}>Progress</h4>
                       {progress.map((step, index) => (
                         <ProgressStep key={index} completed={step.completed}>
                           <StepIcon completed={step.completed}>
                             {step.completed ? <FaCheckCircle /> : index + 1}
                           </StepIcon>
                           <StepContent>
                             <StepTitle>{step.step}</StepTitle>
                             <StepDescription>{step.description}</StepDescription>
                           </StepContent>
                         </ProgressStep>
                       ))}
                     </ProgressSection>

                     <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                       {!hasInvoice && (
                         <ActionButton 
                           className="warning" 
                           onClick={() => handleRequestInvoice(subscription.id)}
                         >
                           <FaExclamationTriangle style={{ marginRight: '8px' }} />
                           Request Invoice
                         </ActionButton>
                       )}
                       
                       {hasInvoice && !hasReceipt && (
                         <FileUploadSection>
                           <UploadLabel>
                             <FaUpload />
                             Upload Payment Receipt
                             <UploadInput
                               type="file"
                               accept=".pdf,.jpg,.jpeg,.png"
                               onChange={(e) => handleUploadReceipt(subscription.id, e)}
                             />
                           </UploadLabel>
                         </FileUploadSection>
                       )}
                       
                       {hasReceipt && (
                         <ActionButton className="success">
                           <FaCheckCircle style={{ marginRight: '8px' }} />
                           Receipt Submitted
                         </ActionButton>
                       )}
                     </div>

                     <HistorySection>
                       <HistoryTitle>Subscription History</HistoryTitle>
                       <HistoryItem>
                         <HistoryIcon type="order">O</HistoryIcon>
                         <HistoryText>Order form submitted</HistoryText>
                         <HistoryDate>{new Date(subscription.sub_date).toLocaleDateString()}</HistoryDate>
                       </HistoryItem>
                       
                       {hasInvoice && (
                         <HistoryItem>
                           <HistoryIcon type="invoice">I</HistoryIcon>
                           <HistoryText>Invoice received from admin</HistoryText>
                           <HistoryDate>{new Date(subscription.subscription_invoice_date || subscription.sub_date).toLocaleDateString()}</HistoryDate>
                         </HistoryItem>
                       )}
                       
                       {hasReceipt && (
                         <HistoryItem>
                           <HistoryIcon type="receipt">R</HistoryIcon>
                           <HistoryText>Payment receipt uploaded</HistoryText>
                           <HistoryDate>{new Date(subscription.subscription_receipt_date || subscription.sub_date).toLocaleDateString()}</HistoryDate>
                         </HistoryItem>
                       )}
                       
                       {subscription.sub_start_date && (
                         <HistoryItem>
                           <HistoryIcon type="receipt">S</HistoryIcon>
                           <HistoryText>Subscription started</HistoryText>
                           <HistoryDate>{new Date(subscription.sub_start_date).toLocaleDateString()}</HistoryDate>
                         </HistoryItem>
                       )}
                       
                       {subscription.sub_exp_date && (
                         <HistoryItem>
                           <HistoryIcon type="receipt">E</HistoryIcon>
                           <HistoryText>Subscription expires</HistoryText>
                           <HistoryDate>{new Date(subscription.sub_exp_date).toLocaleDateString()}</HistoryDate>
                         </HistoryItem>
                       )}
                     </HistorySection>
                   </SubscriptionCard>
                 );
               }
             })
           )}
         </div>
       </LeftPanel>

       <RightPanel>
         <SubscriberInfoForm
           subscriberData={subscriber}
           onSubmit={handleUpdateSubscriberInfo}
           isUpdating={hasExistingData}
         />
       </RightPanel>
     </DashboardContainer>
   );
} 