import React, { useState } from 'react';
import DashboardStats from './DashboardStats';
import Card from './ui/Card';
import { useGetDashboardStatsQuery } from '../api/apiSlice';
import styled from 'styled-components';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  PointElement,
  LineElement
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, ChartLegend, PointElement, LineElement);

const HistoricalRevenueCard = styled(Card)`
  margin-top: 24px;
  padding: 20px;
`;

const ChartCardContainer = styled.div`
  background: var(--color-bg-card);
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
`;

const ChartTitle = styled.h4`
  margin-bottom: 16px;
  color: var(--color-text);
  text-align: center;
`;

// Helper function to format dates in a user-friendly way
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function Dashboard() {
  const [expiredLimit, setExpiredLimit] = useState(5);
  const { data } = useGetDashboardStatsQuery({ expiredLimit: expiredLimit.toString() });
  const navigate = useNavigate();
  
  const handleLoadMore = () => {
    setExpiredLimit(prev => prev + 5);
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenue = data?.revenue || { total: 0, by_type: {}, monthly: [], historical: [] };

  // Historical revenue data
  const historicalRevenueData = {
    labels: revenue.historical.map(item => item.year.toString()),
    datasets: [
      {
        label: 'Total Revenue',
        data: revenue.historical.map(item => item.revenue),
        backgroundColor: 'rgba(67, 233, 123, 0.5)',
        borderColor: 'rgba(67, 233, 123, 1)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  const historicalChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--color-text-muted)'
        }
      },
      title: {
        display: true,
        text: 'Historical Revenue (Last 5 Years)',
        color: 'var(--color-text-muted)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'var(--color-text-muted)',
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'var(--color-text-muted)'
        }
      }
    }
  };

  const revenueData = {
    labels: months,
    datasets: [
      {
        label: 'eAIP',
        data: revenue.monthly.map(m => m.eAIP),
        backgroundColor: 'rgba(67, 233, 123, 0.5)',
      },
      {
        label: 'CD',
        data: revenue.monthly.map(m => m.CD),
        backgroundColor: 'rgba(162, 89, 247, 0.5)',
      },
      {
        label: 'Paper',
        data: revenue.monthly.map(m => m.Paper),
        backgroundColor: 'rgba(255, 77, 79, 0.5)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--color-text-muted)'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'var(--color-text-muted)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'var(--color-text-muted)'
        }
      }
    }
  };

  return (
    <div style={{ padding: '32px 32px 0 32px', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
      <div style={{ flex: 2, minWidth: 320 }}>
        <Card>
          <DashboardStats />
        </Card>
        <HistoricalRevenueCard>
          <Line data={historicalRevenueData} options={historicalChartOptions} />
        </HistoricalRevenueCard>

        <ChartCardContainer>
          <ChartTitle>Monthly Revenue by Type</ChartTitle>
          <Bar data={revenueData} options={chartOptions} />
        </ChartCardContainer>
      </div>
      <div style={{ flex: 1, minWidth: 320 }}>
        <Card>
          <h4>Upcoming Payments (30 days)</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {data && data.upcoming.length > 0 ? data.upcoming.map(sub => {
              const daysUntilExpiry = Math.ceil((new Date(sub.sub_exp_date) - new Date()) / (1000 * 60 * 60 * 24));
              const isExpiringSoon = daysUntilExpiry <= 7;
              
              return (
                <li key={sub.id} style={{ 
                  marginBottom: 12, 
                  padding: 16, 
                  background: isExpiringSoon ? 'rgba(255,77,79,0.08)' : 'rgba(162,89,247,0.08)', 
                  borderRadius: 8,
                  border: isExpiringSoon ? '1px solid rgba(255,77,79,0.2)' : '1px solid rgba(162,89,247,0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          background: isExpiringSoon ? 'rgba(255,77,79,0.2)' : 'rgba(162,89,247,0.2)',
                          borderRadius: 4,
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}>
                          {sub.sub_type}
                        </span>
                        <span style={{ 
                          color: isExpiringSoon ? 'var(--color-error)' : 'var(--color-text-muted)',
                          fontSize: '0.875rem'
                        }}>
                          {daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'} left
                        </span>
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 500 }}>{sub.sub_name}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        Expires: {formatDate(sub.sub_exp_date)}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/subscriber/${sub.subscriber_id}/add-subscription?type=${sub.sub_type}`)}
                      style={{
                        padding: '8px 16px',
                        background: isExpiringSoon ? 'var(--color-error)' : 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                        boxShadow: isExpiringSoon ? '0 2px 4px rgba(255,77,79,0.2)' : '0 2px 4px rgba(162,89,247,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.opacity = '0.9';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = isExpiringSoon ? '0 4px 8px rgba(255,77,79,0.3)' : '0 4px 8px rgba(162,89,247,0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = isExpiringSoon ? '0 2px 4px rgba(255,77,79,0.2)' : '0 2px 4px rgba(162,89,247,0.2)';
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                      </svg>
                      Renew
                    </button>
                  </div>
                </li>
              );
            }) : <li style={{ color: 'var(--color-text-muted)' }}>No upcoming payments</li>}
          </ul>
        </Card>
        <Card>
          <h4>Expired Subscriptions (Last 12 Months)</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {data && data.expired && data.expired.length > 0 ? data.expired.map(sub => {
              const daysSinceExpiry = Math.ceil((new Date() - new Date(sub.sub_exp_date)) / (1000 * 60 * 60 * 24));
              const monthsSinceExpiry = Math.floor(daysSinceExpiry / 30);
              
              return (
                <li key={sub.id} style={{ 
                  marginBottom: 12, 
                  padding: 16, 
                  background: 'rgba(255,77,79,0.08)', 
                  borderRadius: 8,
                  border: '1px solid rgba(255,77,79,0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          background: 'rgba(255,77,79,0.2)',
                          borderRadius: 4,
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}>
                          {sub.sub_type}
                        </span>
                        <span style={{ 
                          color: 'var(--color-error)',
                          fontSize: '0.875rem'
                        }}>
                          Expired {monthsSinceExpiry > 0 ? `${monthsSinceExpiry} ${monthsSinceExpiry === 1 ? 'month' : 'months'}` : `${daysSinceExpiry} ${daysSinceExpiry === 1 ? 'day' : 'days'}`} ago
                        </span>
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 500 }}>{sub.sub_name}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        Expired on: {formatDate(sub.sub_exp_date)}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/subscriber/${sub.subscriber_id}/add-subscription?type=${sub.sub_type}`)}
                      style={{
                        padding: '8px 16px',
                        background: 'var(--color-error)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(255,77,79,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.opacity = '0.9';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(255,77,79,0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 4px rgba(255,77,79,0.2)';
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                      </svg>
                      Renew
                    </button>
                  </div>
                </li>
              );
            }) : <li style={{ color: 'var(--color-text-muted)' }}>No expired subscriptions</li>}
          </ul>
          {data && data.expired && data.expired.length > 0 && data.expired.length < data.total_expired && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button
                onClick={handleLoadMore}
                style={{
                  padding: '8px 24px',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'var(--color-bg-card)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'var(--color-bg)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Load More
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 