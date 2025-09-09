import React from 'react';
import styled from 'styled-components';
import { FaMap, FaCheckCircle } from 'react-icons/fa';

// Aeronautical Charts Section Components
const ChartsSection = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 32px;
  margin-bottom: 32px;
  color: #1e293b;
  width: 100%;
`;

const ChartsSectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2563eb;
  margin: 0 0 24px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ChartsTable = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const ChartsTableHeader = styled.div`
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  padding: 16px;
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1.5fr 1fr 0.8fr;
  gap: 16px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 8px;
    text-align: center;
  }
`;

const ChartsTableRow = styled.div`
  padding: 16px;
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1.5fr 1fr 0.8fr;
  gap: 16px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 8px;
    text-align: center;
    padding: 20px 16px;
  }
`;

const ChartTitle = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
`;

const ChartScale = styled.div`
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
`;

const ChartName = styled.div`
  font-size: 0.85rem;
  color: #475569;
`;

const ChartPrices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.8rem;
  color: #059669;
  font-weight: 600;
`;

const ChartDate = styled.div`
  font-size: 0.8rem;
  color: #7c3aed;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const OrderButton = styled.button`
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ChartsNote = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  color: #92400e;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const AeronauticalCharts = ({ onOrderClick }) => {
  const chartData = [
    {
      title: "World Aeronautical Chart - ICAO (WAC)",
      scale: "1:1 000 000",
      name: "Lake Albert (2909)",
      prices: ["A1 size: 20 USD per sheet"],
      date: "JAN 23",
      id: "wac-lake-albert"
    },
    {
      title: "Aeronautical Chart – ICAO (ANC)",
      scale: "1: 500 000",
      name: ["Lake Albert 2909-A", "Lake Albert 2909-B", "Lake Albert 2909-C", "Lake Albert 2909-D"],
      prices: ["A0 size: 20 USD per sheet"],
      date: "JAN 23",
      id: "anc-lake-albert"
    },
    {
      title: "Index of aerodromes chart",
      scale: "-",
      name: "Index of aerodromes",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD", "A0 size: 20 USD"],
      date: "16 MAY 24",
      id: "index-aerodromes"
    },
    {
      title: "Aerodrome Chart - ICAO* (AC)",
      scale: "1:10 000",
      name: "Entebbe/Intl",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD", "A0 size: 20 USD"],
      date: "02 NOV 23",
      id: "ac-entebbe"
    },
    {
      title: "",
      scale: "1:5 500",
      name: "Arua/National",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD", "A0 size: 20 USD"],
      date: "29 MAR 18",
      id: "ac-arua"
    },
    {
      title: "",
      scale: "1:9 000",
      name: "Gulu/National",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD", "A0 size: 20 USD"],
      date: "29 MAR 18",
      id: "ac-gulu"
    },
    {
      title: "",
      scale: "1: 8 000",
      name: "Soroti/National",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD", "A0 size: 20 USD"],
      date: "29 MAR 18",
      id: "ac-soroti"
    },
    {
      title: "Aerodrome Obstacle Chart - ICAO* TYPE A (AOC)",
      scale: "1:10 000",
      name: "Entebbe AOC RWY 17/ 35",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD", "A0 size: 20 USD"],
      date: "02 NOV 23",
      id: "aoc-entebbe"
    }
  ];

  const handleOrderClick = (chartId, chartName) => {
    if (onOrderClick) {
      onOrderClick(chartId, chartName);
    } else {
      // Default behavior if no callback is provided
      console.log(`Order requested for chart: ${chartName} (ID: ${chartId})`);
      alert(`Order functionality will be implemented for: ${chartName}`);
    }
  };

  return (
    <ChartsSection>
      <ChartsSectionTitle>
        <FaMap /> Aeronautical Charts - Pricing & Orders
      </ChartsSectionTitle>
      
      <ChartsTable>
        <ChartsTableHeader>
          <div>Title of Series</div>
          <div>Scale</div>
          <div>Name and/or Number</div>
          <div>Price ($)</div>
          <div>Date</div>
          <div>Order</div>
        </ChartsTableHeader>
        
        {chartData.map((chart, index) => (
          <ChartsTableRow key={chart.id}>
            <ChartTitle>{chart.title}</ChartTitle>
            <ChartScale>{chart.scale}</ChartScale>
            <ChartName>
              {Array.isArray(chart.name) ? (
                chart.name.map((nameItem, i) => (
                  <div key={i}>{nameItem}</div>
                ))
              ) : (
                chart.name
              )}
            </ChartName>
            <ChartPrices>
              {chart.prices.map((price, i) => (
                <div key={i}>{price}</div>
              ))}
            </ChartPrices>
            <ChartDate>{chart.date}</ChartDate>
            <OrderButton onClick={() => handleOrderClick(chart.id, chart.name)}>
              <FaCheckCircle /> Order
            </OrderButton>
          </ChartsTableRow>
        ))}
      </ChartsTable>
      
      <ChartsNote>
        <strong>Note:</strong> All prices are in USD. Charts are available for immediate download upon payment confirmation. Physical delivery options are available with additional shipping charges. For bulk orders (10+ charts), please contact our office for discounted pricing.
      </ChartsNote>
    </ChartsSection>
  );
};

export default AeronauticalCharts;
