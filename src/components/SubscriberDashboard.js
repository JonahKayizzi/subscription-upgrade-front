import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import styled from 'styled-components';
import { FaFileAlt, FaUpload, FaDownload, FaCheckCircle, FaClock, FaExclamationTriangle, FaPlus, FaChevronDown, FaChevronUp, FaEye, FaTimes, FaMap, FaShoppingBag, FaFileInvoice } from 'react-icons/fa';
import { useGetSubscriberDashboardQuery, useRequestInvoiceMutation, useMarkInvoiceNotRequiredMutation, useUploadReceiptMutation, useUpdateSubscriberInfoMutation, useCreateRenewalSubscriptionMutation, useGetChartOrdersQuery, useGetMyInvoicesQuery, useLazyGetInvoiceDownloadQuery, useLazyGetChartOrderInvoiceDownloadQuery } from '../api/apiSlice';
import SubscriberInfoForm from './SubscriberInfoForm';
import RenewalModal from './RenewalModal';
import { SUBSCRIPTION_TYPES } from '../config/subscriptionTypes';

const DashboardContainer = styled.div`
  padding: 24px 32px 48px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    padding: 20px 16px 40px;
  }

  @media (max-width: 768px) {
    padding: 16px 12px 32px;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-width: 0;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 24px;

  @media (max-width: 1200px) {
    position: static;
    order: -1;
  }
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 28px 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.25);
`;

const WelcomeTitle = styled.h1`
  font-size: 1.75rem;
  margin: 0 0 6px 0;
  font-weight: 600;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1rem;
  opacity: 0.92;
  margin: 0;
`;

const DashboardStatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const DashboardStat = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
`;

const DashboardStatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 4px;
`;

const DashboardStatLabel = styled.div`
  font-size: 0.8rem;
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
  font-size: 1.35rem;
  margin: 0 0 16px 0;
  color: var(--color-text);
  font-weight: 600;
`;

const SubscriptionsSection = styled.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px;
`;

const TabContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  border-bottom: 2px solid var(--color-border);
  margin-bottom: 24px;
`;

const Tab = styled.button`
  padding: 10px 18px;
  border: none;
  background: none;
  color: var(--color-text-muted);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
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

const QuickAccessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const QuickAccessCard = styled(Link)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 22px 20px;
  text-decoration: none;
  color: var(--color-text);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 160px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    border-color: var(--color-accent2);
  }
`;

const QuickAccessIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent2) 100%);
  color: var(--color-text);
`;

const QuickAccessTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text);
`;

const QuickAccessDescription = styled.p`
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.4;
`;

const QuickAccessBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  margin-top: auto;
  align-self: flex-start;
`;

const NewSubModalOverlay = styled.div`
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

const NewSubModalContent = styled.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 32px;
  max-width: 560px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
`;

const NewSubModalTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 8px 0;
  color: var(--color-text);
`;

const NewSubModalSubtitle = styled.p`
  font-size: 0.95rem;
  color: var(--color-text-muted);
  margin: 0 0 24px 0;
`;

const NewSubTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const NewSubTypeCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  border: 2px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-bg);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  &:hover {
    border-color: var(--color-accent2);
    background: rgba(167, 139, 250, 0.08);
    transform: translateY(-2px);
  }
`;

const NewSubTypeIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent2) 100%);
  color: white;
`;

const NewSubTypeLabel = styled.span`
  font-weight: 600;
  font-size: 1rem;
`;

const NewSubTypeDesc = styled.span`
  font-size: 0.8rem;
  color: var(--color-text-muted);
  line-height: 1.3;
`;

const NewSubCloseBtn = styled.button`
  margin-top: 20px;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  cursor: pointer;
  width: 100%;
  &:hover {
    color: var(--color-text);
    background: var(--color-bg);
  }
`;

function MyInvoicesSection() {
  const { data, isLoading } = useGetMyInvoicesQuery();
  const [triggerSubscriptionDownload, { isLoading: isDownloadingSub }] = useLazyGetInvoiceDownloadQuery();
  const [triggerChartOrderDownload, { isLoading: isDownloadingCo }] = useLazyGetChartOrderInvoiceDownloadQuery();
  const invoices = data?.invoices || [];
  const isDownloading = isDownloadingSub || isDownloadingCo;

  const handleDownload = async (inv) => {
    const isChartOrder = inv.requestType === 'chart_order';
    const trigger = isChartOrder ? triggerChartOrderDownload : triggerSubscriptionDownload;
    const fileName = isChartOrder ? `chart-order-invoice-${inv.id}.pdf` : `invoice-${inv.id}.pdf`;
    try {
      const result = await trigger(inv.id).unwrap();
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ marginBottom: '0' }} id="my-invoices">
      <SectionTitle style={{ marginBottom: '16px' }}>
        <FaFileInvoice style={{ marginRight: '8px', verticalAlign: 'middle' }} />
        My Invoices
      </SectionTitle>
      <Card style={{ padding: '20px', borderRadius: '12px' }}>
        {isLoading ? (
          <div style={{ padding: '16px', color: 'var(--color-text-muted)' }}>Loading...</div>
        ) : invoices.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <FaFileInvoice style={{ fontSize: '2rem', marginBottom: '12px', opacity: 0.6 }} />
            <p style={{ margin: 0, fontSize: '1rem' }}>No invoices yet</p>
            <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>When you request an invoice for a subscription renewal or chart order, it will appear here for download once ready.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--color-accent)' }}>Description</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--color-accent)' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--color-accent)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={`${inv.requestType || 'subscription'}-${inv.id}`} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '10px 12px' }}>{inv.requestType === 'chart_order' ? (inv.sub_type || 'Chart order') : `Renewal ${inv.sub_type || '2025'}`}</td>
                    <td style={{ padding: '10px 12px' }}>
                      {inv.invoice_status === 'uploaded' ? 'Uploaded' : 'Pending'}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {inv.invoice_status === 'uploaded' ? (
                        <ActionButton className="primary" onClick={() => handleDownload(inv)} disabled={isDownloading} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                          <FaDownload style={{ marginRight: '6px' }} /> Download
                        </ActionButton>
                      ) : (
                        <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Invoice is being prepared</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function SubscriberDashboard() {
  const user = useSelector(state => state.auth.user);
  const { data: dashboardData, isLoading, error, refetch } = useGetSubscriberDashboardQuery();
  const { data: chartOrdersData } = useGetChartOrdersQuery();
  const [activeTab, setActiveTab] = useState('eAIP');
  const [expandedSubscriptions, setExpandedSubscriptions] = useState(new Set());
  const [renewalModal, setRenewalModal] = useState({ isOpen: false, subscriptionType: null, isNew: false });
  const [newSubscriptionTypeModalOpen, setNewSubscriptionTypeModalOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);
  const [requestInvoice] = useRequestInvoiceMutation();
  const [markInvoiceNotRequired] = useMarkInvoiceNotRequiredMutation();
  const [uploadReceipt] = useUploadReceiptMutation();
  const [updateSubscriberInfo] = useUpdateSubscriberInfoMutation();
  const [createRenewalSubscription] = useCreateRenewalSubscriptionMutation();
  
  const chartOrdersCount = chartOrdersData?.length || 0;
  const pendingOrdersCount = chartOrdersData?.filter(order => order.order_status === 'pending').length || 0;
  
  const subscriptionTypes = SUBSCRIPTION_TYPES.map(type => ({
    id: type.id,
    label: type.label,
    icon: React.createElement(type.icon),
    description: type.description
  }));

  const handleRequestInvoice = async (subscriptionId) => {
    try {
      await requestInvoice(subscriptionId).unwrap();
      // Refresh dashboard data after update
      refetch();
      // TODO: Show success message
    } catch (err) {
      console.error('Failed to request invoice:', err);
      // TODO: Show error message
    }
  };

  const handleInvoiceNotRequired = async (subscriptionId) => {
    try {
      await markInvoiceNotRequired(subscriptionId).unwrap();
      // Refresh dashboard data after update
      refetch();
      // TODO: Show success message
    } catch (err) {
      console.error('Failed to mark invoice as not required:', err);
      // TODO: Show error message
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
        receiptNumber: receiptNumber
      }).unwrap();
      
      // Clear form and refresh data
      setReceiptFile(null);
      setReceiptNumber('');
      
      // Refresh the data to show updated status
      refetch();
      
    } catch (err) {
      console.error('Failed to upload receipt:', err);
      // TODO: Show error message
    } finally {
      setIsSubmittingReceipt(false);
    }
  };

  const handleNewSubscription = () => {
    setNewSubscriptionTypeModalOpen(true);
  };

  const handleChooseNewSubscriptionType = (typeId) => {
    setNewSubscriptionTypeModalOpen(false);
    setRenewalModal({ isOpen: true, subscriptionType: typeId, isNew: true });
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
    setRenewalModal({ isOpen: true, subscriptionType });
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

  const baseUrlForFiles = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
  const fileUrlForView = (filePath) => {
    if (!filePath) return null;
    const normalized = filePath.replace(/^\/?/, '').replace(/^uploads[/\\]/, '');
    return `${baseUrlForFiles}/uploads/${normalized}`;
  };
  const handleViewForm = (filePath) => {
    const url = fileUrlForView(filePath);
    if (url) window.open(url, '_blank');
  };
  const handleViewInvoice = (filePath) => {
    const url = fileUrlForView(filePath);
    if (url) window.open(url, '_blank');
  };
  const handleViewReceipt = (filePath) => {
    const url = fileUrlForView(filePath);
    if (url) window.open(url, '_blank');
  };

  const handleSubmitOrderForm = async (selectedOptions = [], invoiceRequested = false) => {
    try {
      // Helper function to format date for MySQL DATE columns
      const formatMySQLDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const now = new Date();
      const renewalData = {
        sub_type: renewalModal.subscriptionType,
        sub_status: 2, // pending
        order_sent_date: formatMySQLDate(now),
        order_received_date: formatMySQLDate(now),
        selected_options: selectedOptions,
        invoice_requested: !!invoiceRequested
      };

      await createRenewalSubscription(renewalData).unwrap();
      
      // Close modal and refresh dashboard
      setRenewalModal({ isOpen: false, subscriptionType: null, isNew: false });
      refetch(); // Refresh dashboard data
      
    } catch (err) {
      console.error('Failed to create renewal subscription:', err);
      // TODO: Show error message to user
    }
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
          <DashboardStatsRow>
            <DashboardStat>
              <DashboardStatValue>{activeSubscriptions}</DashboardStatValue>
              <DashboardStatLabel>Active</DashboardStatLabel>
            </DashboardStat>
            <DashboardStat>
              <DashboardStatValue>{pendingSubscriptions}</DashboardStatValue>
              <DashboardStatLabel>Pending</DashboardStatLabel>
            </DashboardStat>
            <DashboardStat>
              <DashboardStatValue>${totalAmount || '0'}</DashboardStatValue>
              <DashboardStatLabel>Total (USD)</DashboardStatLabel>
            </DashboardStat>
          </DashboardStatsRow>
        </WelcomeSection>

        <QuickAccessGrid>
          <QuickAccessCard to="/charts">
            <QuickAccessIcon>
              <FaMap />
            </QuickAccessIcon>
            <QuickAccessTitle>Browse Charts</QuickAccessTitle>
            <QuickAccessDescription>
              Explore our complete catalog of aeronautical charts. Search, filter, and order charts in various sizes.
            </QuickAccessDescription>
            <QuickAccessBadge>View Catalog →</QuickAccessBadge>
          </QuickAccessCard>
          
          <QuickAccessCard to="/my-orders">
            <QuickAccessIcon>
              <FaShoppingBag />
            </QuickAccessIcon>
            <QuickAccessTitle>My Chart Orders</QuickAccessTitle>
            <QuickAccessDescription>
              View and track all your chart orders. {chartOrdersCount > 0 && (
                <>You have {chartOrdersCount} order{chartOrdersCount !== 1 ? 's' : ''}.</>
              )}
            </QuickAccessDescription>
            {chartOrdersCount > 0 ? (
              <QuickAccessBadge>
                {pendingOrdersCount > 0 && `${pendingOrdersCount} Pending • `}
                {chartOrdersCount} Total Order{chartOrdersCount !== 1 ? 's' : ''} →
              </QuickAccessBadge>
            ) : (
              <QuickAccessBadge>No orders yet →</QuickAccessBadge>
            )}
          </QuickAccessCard>

          <QuickAccessCard as="div" onClick={() => document.getElementById('my-invoices')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
            <QuickAccessIcon>
              <FaFileInvoice />
            </QuickAccessIcon>
            <QuickAccessTitle>My Invoices</QuickAccessTitle>
            <QuickAccessDescription>
              Download invoices for your subscription renewals and chart orders once they are ready.
            </QuickAccessDescription>
            <QuickAccessBadge>View & download →</QuickAccessBadge>
          </QuickAccessCard>
        </QuickAccessGrid>

        <MyInvoicesSection />

        <SubscriptionsSection>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <SectionTitle style={{ marginBottom: 0 }}>Your Subscriptions</SectionTitle>
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
              const hasOrderForm = subscription.subscription_form || subscription.order_sent_date;
              const hasInvoice = subscription.subscription_invoice;
              const hasReceipt = subscription.subscription_receipt;
              const hasInvoiceRequested = subscription.invoice_requested_date;
              const isInvoiceNotRequired = subscription.invoice_no === 'NOT_REQUIRED' || subscription.sub_invoice === 'NOT_REQUIRED';
              
              const progress = [
                { 
                  step: 'Order Form', 
                  completed: hasOrderForm, 
                  description: hasOrderForm ? `Submitted on ${new Date(subscription.sub_date).toLocaleDateString()}` : 'Not submitted',
                  hasAction: hasOrderForm,
                  actionButton: hasOrderForm ? (
                    <ActionButton 
                      className="primary" 
                      onClick={() => handleViewForm(subscription.subscription_form)}
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
                  description: hasInvoice ? 'Received' : isInvoiceNotRequired ? 'Not Required - No invoice needed for this subscription' : hasInvoiceRequested ? 'Waiting for admin upload' : 'Awaiting admin response',
                  hasAction: (!hasInvoice && !isInvoiceNotRequired) || hasInvoice,
                  actionButton: !hasInvoice && !isInvoiceNotRequired && !hasInvoiceRequested ? (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', marginLeft: 'auto' }}>
                      <ActionButton 
                        className="warning" 
                        onClick={() => handleRequestInvoice(subscription.id)}
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                      >
                        <FaExclamationTriangle style={{ marginRight: '4px' }} />
                        Request Invoice
                      </ActionButton>
                      <ActionButton 
                        className="secondary" 
                        onClick={() => handleInvoiceNotRequired(subscription.id)}
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                      >
                        <FaTimes style={{ marginRight: '4px' }} />
                        Not Required
                      </ActionButton>
                    </div>
                  ) : hasInvoiceRequested && !hasInvoice ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-warning)', marginTop: '8px', marginLeft: 'auto', fontStyle: 'italic' }}>
                      ⏳ Waiting for admin to upload invoice
                    </div>
                  ) : isInvoiceNotRequired ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '8px', marginLeft: 'auto', fontStyle: 'italic' }}>
                      ✓ Invoice not required for this subscription
                    </div>
                  ) : hasInvoice ? (
                    <ActionButton 
                      className="primary" 
                      onClick={() => handleViewInvoice(subscription.subscription_invoice)}
                      style={{ fontSize: '0.75rem', padding: '4px 8px', marginTop: '8px', marginLeft: 'auto' }}
                    >
                      <FaDownload style={{ marginRight: '4px' }} />
                      View Invoice
                    </ActionButton>
                  ) : null
                },
                { 
                  step: 'Receipt', 
                  completed: hasReceipt && subscription.receipt_verified_date, 
                  description: hasReceipt ? 
                    (subscription.receipt_verified_date ? 'Verified and activated' : 'Submitted - Pending admin verification') : 
                    (hasInvoice || isInvoiceNotRequired) ? 'Pending payment receipt' : 'Pending invoice',
                  hasAction: hasReceipt || (hasInvoice || isInvoiceNotRequired) && !hasReceipt,
                  actionButton: hasReceipt ? (
                    subscription.receipt_verified_date ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', marginLeft: 'auto' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontStyle: 'italic' }}>
                          ✓ Receipt verified on {new Date(subscription.receipt_verified_date).toLocaleDateString()}
                        </div>
                        <ActionButton 
                          className="primary" 
                          onClick={() => handleViewReceipt(subscription.subscription_receipt)}
                          style={{ fontSize: '0.75rem', padding: '4px 8px', alignSelf: 'flex-start' }}
                        >
                          <FaEye style={{ marginRight: '4px' }} />
                          View Receipt
                        </ActionButton>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', marginLeft: 'auto' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-warning)', marginBottom: '8px' }}>
                          Receipt uploaded - Pending admin verification
                        </div>
                        <ActionButton 
                          className="primary" 
                          onClick={() => handleViewReceipt(subscription.subscription_receipt)}
                          style={{ fontSize: '0.75rem', padding: '4px 8px', alignSelf: 'flex-start' }}
                        >
                          <FaEye style={{ marginRight: '4px' }} />
                          View Receipt
                        </ActionButton>
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
                              onChange={(e) => handleUploadReceipt(subscription.id, e)}
                            />
                          </UploadLabel>
                          {receiptFile && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '4px' }}>
                              ✓ File selected: {receiptFile.name}
                            </div>
                          )}
                          <ActionButton 
                            className="primary" 
                            onClick={() => handleSubmitReceipt(subscription.id)}
                            disabled={!receiptFile || !receiptNumber || isSubmittingReceipt}
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
                           {subscription.status !== 'pending' && subscription.sub_status !== 2 && (
                             <>
                               <span>Amount: ${subscription.sub_amount}</span>
                               <span>Start: {new Date(subscription.sub_start_date).toLocaleDateString()}</span>
                               <span>End: {new Date(subscription.sub_exp_date).toLocaleDateString()}</span>
                             </>
                           )}
                           {subscription.status === 'pending' || subscription.sub_status === 2 ? (
                             <span style={{ fontStyle: 'italic', color: 'var(--color-accent2)' }}>
                               Details will be provided once approved
                             </span>
                           ) : null}
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
                                 {step.actionButton}
                               </StepContent>
                             </ProgressStep>
                           ))}
                           

                         </ProgressSection>

                         <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                           {hasReceipt && (
                             <ActionButton className="success">
                               <FaCheckCircle style={{ marginRight: '8px' }} />
                               Receipt Submitted
                             </ActionButton>
                           )}
                         </div>

                         <HistorySection>
                           <HistoryTitle>Subscription Summary</HistoryTitle>
                           <HistoryItem>
                             <HistoryIcon type="order">O</HistoryIcon>
                             <HistoryText>Order form submitted</HistoryText>
                             <HistoryDate>{new Date(subscription.sub_date).toLocaleDateString()}</HistoryDate>
                           </HistoryItem>
                           
                           {hasInvoiceRequested && !hasInvoice && !isInvoiceNotRequired && (
                             <HistoryItem>
                               <HistoryIcon type="invoice">I</HistoryIcon>
                               <HistoryText>Invoice requested</HistoryText>
                               <HistoryDate>{new Date(subscription.invoice_requested_date).toLocaleDateString()}</HistoryDate>
                             </HistoryItem>
                           )}
                           
                           {hasInvoice && !isInvoiceNotRequired && (
                             <HistoryItem>
                               <HistoryIcon type="invoice">I</HistoryIcon>
                               <HistoryText>Invoice received from admin</HistoryText>
                               <HistoryDate>{new Date(subscription.invoice_received_date || subscription.sub_date).toLocaleDateString()}</HistoryDate>
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
                               <HistoryText>Payment receipt uploaded</HistoryText>
                               <HistoryDate>
                                 {new Date(subscription.receipt_received_date || subscription.sub_date).toLocaleDateString()}
                               </HistoryDate>
                             </HistoryItem>
                           )}
                           
                           {subscription.receipt_verified_date && (
                             <HistoryItem>
                               <HistoryIcon type="receipt">✓</HistoryIcon>
                               <HistoryText>Receipt verified and subscription activated</HistoryText>
                               <HistoryDate>{new Date(subscription.receipt_verified_date).toLocaleDateString()}</HistoryDate>
                             </HistoryItem>
                           )}
                           
                           {subscription.sub_start_date && (subscription.status !== 'pending' && subscription.sub_status !== 2) && (
                         <HistoryItem>
                           <HistoryIcon type="receipt">S</HistoryIcon>
                           <HistoryText>Subscription started</HistoryText>
                           <HistoryDate>{new Date(subscription.sub_start_date).toLocaleDateString()}</HistoryDate>
                         </HistoryItem>
                       )}
                       
                       {subscription.sub_exp_date && (subscription.status !== 'pending' && subscription.sub_status !== 2) && (
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
                           {subscription.status !== 'pending' && subscription.sub_status !== 2 && (
                             <>
                               <span>Amount: ${subscription.sub_amount}</span>
                               <span>Start: {new Date(subscription.sub_start_date).toLocaleDateString()}</span>
                               <span>End: {new Date(subscription.sub_exp_date).toLocaleDateString()}</span>
                             </>
                           )}
                           {subscription.status === 'pending' || subscription.sub_status === 2 ? (
                             <span style={{ fontStyle: 'italic', color: 'var(--color-accent2)' }}>
                               Details will be provided once approved
                             </span>
                           ) : null}
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
                             {step.actionButton}
                           </StepContent>
                         </ProgressStep>
                       ))}
                       

                     </ProgressSection>

                     <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                       {hasReceipt && (
                         <ActionButton className="success">
                           <FaCheckCircle style={{ marginRight: '8px' }} />
                           Receipt Submitted
                         </ActionButton>
                       )}
                     </div>

                     <HistorySection>
                       <HistoryTitle>Subscription Summary</HistoryTitle>
                       <HistoryItem>
                         <HistoryIcon type="order">O</HistoryIcon>
                         <HistoryText>Order form submitted</HistoryText>
                         <HistoryDate>{new Date(subscription.sub_date).toLocaleDateString()}</HistoryDate>
                       </HistoryItem>
                       
                       {hasInvoiceRequested && !hasInvoice && !isInvoiceNotRequired && (
                         <HistoryItem>
                           <HistoryIcon type="invoice">I</HistoryIcon>
                           <HistoryText>Invoice requested</HistoryText>
                           <HistoryDate>{new Date(subscription.invoice_requested_date).toLocaleDateString()}</HistoryDate>
                         </HistoryItem>
                       )}
                       
                                                  {hasInvoice && !isInvoiceNotRequired && (
                             <HistoryItem>
                               <HistoryIcon type="invoice">I</HistoryIcon>
                               <HistoryText>Invoice received from admin</HistoryText>
                               <HistoryDate>{new Date(subscription.invoice_received_date || subscription.sub_date).toLocaleDateString()}</HistoryDate>
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
                               <HistoryText>Payment receipt uploaded</HistoryText>
                               <HistoryDate>
                                 {new Date(subscription.receipt_received_date || subscription.sub_date).toLocaleDateString()}
                               </HistoryDate>
                             </HistoryItem>
                           )}
                           
                           {subscription.receipt_verified_date && (
                             <HistoryItem>
                               <HistoryIcon type="receipt">✓</HistoryIcon>
                               <HistoryText>Receipt verified and subscription activated</HistoryText>
                               <HistoryDate>{new Date(subscription.receipt_verified_date).toLocaleDateString()}</HistoryDate>
                             </HistoryItem>
                           )}
                       
                       {subscription.sub_start_date && (subscription.status !== 'pending' && subscription.sub_status !== 2) && (
                         <HistoryItem>
                           <HistoryIcon type="receipt">S</HistoryIcon>
                           <HistoryText>Subscription started</HistoryText>
                           <HistoryDate>{new Date(subscription.sub_start_date).toLocaleDateString()}</HistoryDate>
                         </HistoryItem>
                       )}
                       
                       {subscription.sub_exp_date && (subscription.status !== 'pending' && subscription.sub_status !== 2) && (
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
        </SubscriptionsSection>
       </LeftPanel>

       <RightPanel>
         <SubscriberInfoForm
           subscriberData={subscriber}
           onSubmit={handleUpdateSubscriberInfo}
           isUpdating={hasExistingData}
                 />
      </RightPanel>

      {newSubscriptionTypeModalOpen && (
        <NewSubModalOverlay onClick={() => setNewSubscriptionTypeModalOpen(false)}>
          <NewSubModalContent onClick={(e) => e.stopPropagation()}>
            <NewSubModalTitle>New Subscription</NewSubModalTitle>
            <NewSubModalSubtitle>Choose the type of subscription you want to start</NewSubModalSubtitle>
            <NewSubTypeGrid>
              {subscriptionTypes.map((type) => (
                <NewSubTypeCard
                  key={type.id}
                  type="button"
                  onClick={() => handleChooseNewSubscriptionType(type.id)}
                >
                  <NewSubTypeIcon>{type.icon}</NewSubTypeIcon>
                  <NewSubTypeLabel>{type.label}</NewSubTypeLabel>
                  <NewSubTypeDesc>{type.description}</NewSubTypeDesc>
                </NewSubTypeCard>
              ))}
            </NewSubTypeGrid>
            <NewSubCloseBtn type="button" onClick={() => setNewSubscriptionTypeModalOpen(false)}>
              Cancel
            </NewSubCloseBtn>
          </NewSubModalContent>
        </NewSubModalOverlay>
      )}

      <RenewalModal
        isOpen={renewalModal.isOpen}
        onClose={() => setRenewalModal({ isOpen: false, subscriptionType: null, isNew: false })}
        subscriptionType={renewalModal.subscriptionType}
        isNewSubscription={renewalModal.isNew}
        onSubmitOrderForm={handleSubmitOrderForm}
        isSubmitting={createRenewalSubscription.isLoading}
      />
    </DashboardContainer>
  );
} 