import React from 'react';
import { useGetDashboardStatsQuery } from '../api/apiSlice';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AnnualSubscriptionsBar from './AnnualSubscriptionsBar';
import { SUBSCRIPTION_TYPES, getSubscriptionTypeColors } from '../config/subscriptionTypes';

const BoardContainer = styled.div`
  background-color: var(--color-bg-card);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-bottom: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background-color: var(--color-bg);
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
`;

const StatValue = styled.h3`
  font-size: 2rem;
  color: var(--color-accent2);
  margin: 10px 0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }
`;

const StatLabel = styled.p`
  color: var(--color-text-muted);
  font-size: 15px;
`;

const ChartRow = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 32px;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 24px;
    align-items: center;
  }
`;

const PieChartBox = styled.div`
  flex: 3 1 0%;
  min-width: 220px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BarChartBox = styled.div`
  flex: 7 1 0%;
  min-width: 320px;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChartTitle = styled.h4`
  margin-bottom: 16px;
  color: var(--color-text);
  text-align: center;
`;

export default function DashboardStats() {
  const token = useSelector(state => state.auth.token);
  const { data, error, isLoading } = useGetDashboardStatsQuery(undefined, { skip: !token });
  const navigate = useNavigate();

  if (!token) return <div>Please log in to view dashboard stats.</div>;
  if (isLoading) return <div>Loading dashboard stats...</div>;
  if (error) return <div>Error loading dashboard stats.</div>;

  const subscriptionTypeColors = getSubscriptionTypeColors();
  const COLORS = Object.values(subscriptionTypeColors);

  return (

      <><h3 style={{ marginBottom: 24 }}>Subscription Stats</h3><StatsGrid>
      <StatCard>
        <StatValue onClick={() => navigate('/subscribers')}>{data.total_subscribers}</StatValue>
        <StatLabel>Total Subscribers</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>{data.total_subscriptions}</StatValue>
        <StatLabel>Total Subscriptions</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue style={{ color: 'var(--color-success)' }}>{data.active_subscribers}</StatValue>
        <StatLabel>Active Subscribers</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue style={{ color: 'var(--color-accent2)' }}>${data.revenue.total.toLocaleString()}</StatValue>
        <StatLabel>Total Revenue (YTD)</StatLabel>
      </StatCard>
    </StatsGrid><ChartRow>
        <PieChartBox>
          <ChartTitle>Subscriptions by Type</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.subs_by_type}
                dataKey="count"
                nameKey="sub_type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.subs_by_type.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </PieChartBox>

        <BarChartBox>
          <ChartTitle>Annual Subscriptions</ChartTitle>
          <AnnualSubscriptionsBar data={data.current_year_subs} />
        </BarChartBox>
      </ChartRow></>
 
  );
} 