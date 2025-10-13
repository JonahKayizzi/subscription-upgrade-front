import React, { useState } from 'react';
import styled from 'styled-components';
import { FaFileExcel, FaDownload, FaSpinner } from 'react-icons/fa';
import { exportAnnualSubscriptionReport } from '../utils/excelExport';
import { useGetAnnualSubscriptionReportQuery } from '../api/apiSlice';

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .icon {
    font-size: 16px;
  }
`;


const StatusMessage = styled.div`
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  background-color: ${props => props.success ? '#d4edda' : '#f8d7da'};
  color: ${props => props.success ? '#155724' : '#721c24'};
  border: 1px solid ${props => props.success ? '#c3e6cb' : '#f5c6cb'};
`;

export default function ExcelExportButton({ 
  dashboardData, 
  subscribers = [], 
  subscriptions = [],
  onExportComplete 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  
  // Get comprehensive annual subscription data
  const { data: annualReportData, isLoading: isReportLoading } = useGetAnnualSubscriptionReportQuery();

  const handleExport = async () => {
    setIsLoading(true);
    setStatusMessage(null);

    try {
      // Use comprehensive annual report data if available, otherwise fall back to dashboard data
      const reportData = annualReportData || dashboardData;
      const reportSubscribers = annualReportData?.subscriptions?.map(sub => ({
        sub_id: sub.subscriber_id,
        sub_name: sub.sub_name,
        sub_category: sub.sub_category,
        sub_email: sub.sub_email,
        sub_telephone: sub.sub_telephone,
        phy_address: sub.phy_address,
        subscription_status: {
          eAIP: sub.sub_type === 'eAIP' ? sub.status : 'none',
          CD: sub.sub_type === 'CD' ? sub.status : 'none',
          Paper: sub.sub_type === 'Paper' ? sub.status : 'none'
        }
      })) || subscribers;
      
      const reportSubscriptions = annualReportData?.subscriptions || subscriptions;
      
      const result = exportAnnualSubscriptionReport(reportData, reportSubscribers, reportSubscriptions);

      if (result.success) {
        setStatusMessage({
          type: 'success',
          message: result.message
        });
        if (onExportComplete) {
          onExportComplete(result);
        }
      } else {
        setStatusMessage({
          type: 'error',
          message: result.message || 'Export failed'
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      setStatusMessage({
        type: 'error',
        message: 'An error occurred during export'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ExportButton onClick={handleExport} disabled={isLoading}>
        {isLoading ? (
          <FaSpinner className="icon" style={{ animation: 'spin 1s linear infinite' }} />
        ) : (
          <FaFileExcel className="icon" />
        )}
        {isLoading ? 'Exporting...' : 'Export to Excel'}
        <FaDownload className="icon" />
      </ExportButton>

      {statusMessage && (
        <StatusMessage success={statusMessage.type === 'success'}>
          {statusMessage.message}
        </StatusMessage>
      )}
    </div>
  );
}
