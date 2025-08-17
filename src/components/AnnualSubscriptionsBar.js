import React from 'react';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getSubscriptionTypeColors } from '../config/subscriptionTypes';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartContainer = styled.div`
  background-color: var(--color-bg-card);
  padding: 20px;
  border-radius: 16px;
  margin-top: 20px;
  max-width: 500px;
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function AnnualSubscriptionsBar({ data }) {
  const currentYear = new Date().getFullYear();
  const subscriptionTypeColors = getSubscriptionTypeColors();

  const chartData = {
    labels: data.map((d) => d.sub_type),
    datasets: [
      {
        label: `Subscriptions for ${currentYear}`,
        data: data.map((d) => d.count),
        backgroundColor: data.map((d) => subscriptionTypeColors[d.sub_type] || '#cccccc'),
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { 
        display: true, 
        text: `Subscriptions for ${currentYear}`, 
        color: '#fff', 
        font: { size: 18 } 
      },
    },
    scales: {
      x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true },
    },
  };

  return (
    <ChartContainer>
      <Bar data={chartData} options={chartOptions} height={360} />
    </ChartContainer>
  );
} 