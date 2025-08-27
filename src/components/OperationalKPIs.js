import React from 'react';
import { useGetDashboardStatsQuery } from '../api/apiSlice';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const Title = styled.h4`
  margin: 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: var(--color-border);
  border-radius: 999px;
  overflow: hidden;
  margin: 8px 0 16px 0;
`;

const Progress = styled.div`
  height: 100%;
  width: ${props => props.value || 0}%;
  background: var(--color-primary);
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-bg);
  padding: 8px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Texts = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`;

const Badge = styled.span`
  display: inline-flex;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #444;
  background: ${props => props.bg || 'var(--color-bg-card)'};
`;

const Label = styled.div`
  color: var(--color-text);
  font-weight: 300;
  font-size: 0.8rem;
`;

const Value = styled.div`
  color: var(--color-text);
  font-weight: 500;
  font-size: 1.25rem;
`;

export default function OperationalKPIs() {
  const token = useSelector(state => state.auth.token);
  const { data, error, isLoading } = useGetDashboardStatsQuery(undefined, { skip: !token });

  if (!token) return null;
  if (isLoading || error || !data) return null;

  // Calculate simple completion percent: completed over total in the pipeline-like metrics
  const totalOps = (data.pending_subscriptions || 0) + (data.pipeline?.receipts_pending_verification || 0) + (data.pipeline?.invoices_pending_upload || 0);
  const completedOps = (data.renewals?.renewals_this_year || 0);
  const completePct = totalOps + completedOps > 0 ? Math.min(100, Math.round((completedOps / (totalOps + completedOps)) * 100)) : 0;

  return (
    <div>
      <Header>
        <Title>Task Overview</Title>
      </Header>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ color: 'var(--color-success)', fontWeight: 700 }}>{completePct}%</div>
        <div style={{ color: 'var(--color-text-muted)' }}>Complete</div>
      </div>
      <ProgressBar>
        <Progress value={completePct} />
      </ProgressBar>
      <List>
        <Item>
          <Left>
            <Badge bg="rgba(99, 102, 241, 0.15)">📋</Badge>
            <Texts>
              <Value>{totalOps + completedOps}</Value>
              <Label>Total Tasks</Label>
            </Texts>
          </Left>
        </Item>
        <Item>
          <Left>
            <Badge bg="rgba(16, 185, 129, 0.15)">✅</Badge>
            <Texts>
              <Value>{completedOps}</Value>
              <Label>Completed</Label>
            </Texts>
          </Left>
        </Item>
        <Item>
          <Left>
            <Badge bg="rgba(250, 204, 21, 0.2)">🕒</Badge>
            <Texts>
              <Value>{data.pending_subscriptions || 0}</Value>
              <Label>Pending</Label>
            </Texts>
          </Left>
        </Item>
        <Item>
          <Left>
            <Badge bg="rgba(167, 139, 250, 0.2)">📅</Badge>
            <Texts>
              <Value>{data.pipeline?.receipts_pending_verification || 0}</Value>
              <Label>Pending Receipts</Label>
            </Texts>
          </Left>
        </Item>
        <Item>
          <Left>
            <Badge bg="rgba(59, 130, 246, 0.2)">📨</Badge>
            <Texts>
              <Value>{data.pipeline?.invoices_pending_upload || 0}</Value>
              <Label>Pending Invoices</Label>
            </Texts>
          </Left>
        </Item>
        <Item>
          <Left>
            <Badge bg="rgba(250, 204, 21, 0.25)">⚠</Badge>
            <Texts>
              <Value>{(data.expiring_buckets?.days_7 || 0) + (data.expiring_buckets?.days_30 || 0) + (data.expiring_buckets?.days_90 || 0)}</Value>
              <Label>Expiring in 7/30/90 days</Label>
            </Texts>
          </Left>
        </Item>
      </List>
    </div>
  );
}


