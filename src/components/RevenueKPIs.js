import React from 'react';
import { useGetDashboardStatsQuery } from '../api/apiSlice';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
`;

const StatCard = styled.div`
  background-color: var(--color-bg);
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
`;

const StatValue = styled.h3`
  font-size: 1.6rem;
  color: var(--color-text);
  margin: 10px 0;
`;

const StatLabel = styled.p`
  color: var(--color-text-muted);
  font-size: 14px;
`;

export default function RevenueKPIs() {
  const token = useSelector(state => state.auth.token);
  const { data, error, isLoading } = useGetDashboardStatsQuery(undefined, { skip: !token });

  if (!token) return null;
  if (isLoading || error || !data) return null;

  return (
    <div>
      <h4 style={{ marginBottom: 16 }}>Revenue KPIs</h4>
      <StatsGrid>
        <StatCard>
          <StatValue style={{ color: 'var(--color-accent2)' }}>${(data.revenue.mrr_current_month || 0).toLocaleString()}</StatValue>
          <StatLabel>Revenue This Month</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue style={{ color: data.revenue.yoy_growth > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
            {data.revenue.yoy_growth === null ? 'N/A' : `${(data.revenue.yoy_growth * 100).toFixed(1)}%`}
          </StatValue>
          <StatLabel>YoY Growth</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>${(data.revenue.last_year_total || 0).toLocaleString()}</StatValue>
          <StatLabel>Revenue Last Year</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>${(data.revenue.total || 0).toLocaleString()}</StatValue>
          <StatLabel>Revenue YTD</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>${(data.revenue.arpa || 0).toFixed(2)}</StatValue>
          <StatLabel>ARPA (YTD)</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{data.renewals?.renewals_this_year || 0}</StatValue>
          <StatLabel>Renewals (YTD)</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{data.renewals?.starts_this_year || 0}</StatValue>
          <StatLabel>New Starts (YTD)</StatLabel>
        </StatCard>
      </StatsGrid>
    </div>
  );
}


