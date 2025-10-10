import React, { useState } from 'react';
import styled from 'styled-components';
import { FaMap, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import ChartOrderForm from './ChartOrderForm';
import Modal from './ui/Modal';
import Login from './Login';
import Register from './Register';

// Styled Components
const ChartsSection = styled.div`
  background: var(--color-bg-card);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 32px;
  margin-bottom: 32px;
  color: var(--color-text);
  width: 100%;
`;

const ChartsSectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-accent);
  margin: 0 0 24px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ChartsTable = styled.div`
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const ChartsTableHeader = styled.div`
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent2) 100%);
  color: var(--color-text);
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
  border-bottom: 1px solid var(--color-border);
  align-items: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: var(--color-bg);
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
  color: var(--color-text);
  font-size: 0.9rem;
`;

const ChartScale = styled.div`
  font-size: 0.85rem;
  color: var(--color-text-muted);
  font-weight: 500;
`;

const ChartName = styled.div`
  font-size: 0.85rem;
  color: var(--color-text-muted);
`;

const ChartPrices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.8rem;
  color: #10b981;
  font-weight: 600;
`;

const ChartDate = styled.div`
  font-size: 0.8rem;
  color: var(--color-accent2);
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

const ShowMoreButton = styled.button`
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent2) 100%);
  color: var(--color-text);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px auto;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(247, 184, 1, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ChartCounter = styled.div`
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin-bottom: 16px;
  font-weight: 500;
`;

const ChartsNote = styled.div`
  background: rgba(247, 184, 1, 0.1);
  border: 1px solid var(--color-accent);
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  color: var(--color-accent);
  font-size: 0.9rem;
  line-height: 1.4;
`;

// Main Component
const AeronauticalCharts = ({ onOrderClick }) => {
  const isAuthenticated = useSelector(state => !!state.auth.token);
  const [showAllCharts, setShowAllCharts] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  
  const chartData = [
    // World and Area Charts
    {
      title: "World Aeronautical Chart - ICAO (WAC)",
      scale: "1:1 000 000",
      name: "Lake Albert (2909)",
      prices: ["A1 size: 20 USD per sheet"],
      date: "JAN 23",
      id: "wac-lake-albert"
    },
    {
      title: "Aeronautical Chart - ICAO (ANC)",
      scale: "1: 500 000",
      name: ["Lake Albert 2909-A", "Lake Albert 2909-B", "Lake Albert 2909-C", "Lake Albert 2909-D"],
      prices: ["A0 size: 20 USD per sheet"],
      date: "JAN 23",
      id: "anc-lake-albert"
    },
    
    // Index Charts
    {
      title: "Index of aerodromes chart",
      scale: "-",
      name: "Index of aerodromes",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD", "A0 size: 20 USD"],
      date: "16 MAY 24",
      id: "index-aerodromes"
    },
    
    // Aerodrome Charts - ICAO (AC)
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
    
    // Aerodrome Obstacle Charts - ICAO TYPE A (AOC)
    {
      title: "Aerodrome Obstacle Chart - ICAO* TYPE A (AOC)",
      scale: "1:10 000",
      name: "Entebbe AOC RWY 17/ 35",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD", "A0 size: 20 USD"],
      date: "02 NOV 23",
      id: "aoc-entebbe-1735"
    },
    {
      title: "",
      scale: "1:10 000",
      name: "Entebbe AOC RWY 12/ 30",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD", "A0 size: 20 USD"],
      date: "02 NOV 23",
      id: "aoc-entebbe-1230"
    },
    
    // Aircraft Parking/Docking Charts - ICAO
    {
      title: "Aircraft Parking/Docking Chart - ICAO",
      scale: "-",
      name: "Entebbe Apron Aircraft Parking/Docking Chart",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD", "A0 size: 20 USD"],
      date: "JAN 22",
      id: "parking-entebbe-apron"
    },
    {
      title: "",
      scale: "-",
      name: "Entebbe Apron and Parking/Docking Chart",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD", "A0 size: 20 USD"],
      date: "FEB 22",
      id: "parking-entebbe-apron-full"
    },
    {
      title: "",
      scale: "-",
      name: "Entebbe Apron Parking/Docking Chart",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD", "A0 size: 20 USD"],
      date: "02 NOV 23",
      id: "parking-entebbe-apron-main"
    },
    
    // Enroute Charts - ICAO
    {
      title: "Enroute Chart - ICAO",
      scale: "-",
      name: "Enroute Chart ICAO",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD", "A0 size: 20 USD"],
      date: "FEB 18",
      id: "enroute-icao"
    },
    
    // Enroute Index Charts
    {
      title: "Enroute Index Charts",
      scale: "-",
      name: "Air Traffic Services Route System Index Chart",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD"],
      date: "FEB 18",
      id: "index-ats-routes"
    },
    {
      title: "",
      scale: "-",
      name: "Entebbe Airspace Index Chart",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD"],
      date: "02 NOV 23",
      id: "index-entebbe-airspace"
    },
    {
      title: "",
      scale: "-",
      name: "Prohibited/Restricted and Danger Areas Index Chart",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD"],
      date: "02 NOV 23",
      id: "index-restricted-areas"
    },
    {
      title: "",
      scale: "-",
      name: "Air Traffic Services Route System prohibited/restricted and danger areas Chart",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD", "A0 size: 20 USD"],
      date: "FEB 18",
      id: "ats-restricted-areas"
    },
    {
      title: "",
      scale: "-",
      name: "Radio Facility Index Chart",
      prices: ["A4 size: 5 USD", "A3 size: 10 USD"],
      date: "FEB 18",
      id: "index-radio-facilities"
    },
    
    // Instrument Approach Charts - ICAO (IAC)
    {
      title: "Instrument Approach Chart - ICAO (IAC)",
      scale: "-",
      name: "ENTEBBE INSTRUMENT APPROACH CHART ICAO ILS Y or LOC Y RWY 17",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "iac-entebbe-ils-y-17"
    },
    {
      title: "",
      scale: "-",
      name: "ENTEBBE INSTRUMENT APPROACH CHART ICAO ILS Z or LOC Z RWY 17",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "iac-entebbe-ils-z-17"
    },
    {
      title: "",
      scale: "-",
      name: "ENTEBBE RNAV (RNP) IAC RWY 17",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "iac-entebbe-rnav-17"
    },
    {
      title: "",
      scale: "-",
      name: "ENTEBBE INSTRUMENT APPROACH CHART ICAO VOR DME RWY 17",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "iac-entebbe-vor-dme-17"
    },
    {
      title: "",
      scale: "-",
      name: "ENTEBBE RNAV (RNP) IAC RWY 35",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "iac-entebbe-rnav-35"
    },
    {
      title: "",
      scale: "-",
      name: "ENTEBBE INSTRUMENT APPROACH CHART ICAO VOR DME RWY 35",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "iac-entebbe-vor-dme-35"
    },
    
    // Standard Departure Charts - Instrument (SID) ICAO
    {
      title: "Standard Departure Chart - Instrument SID ICAO Charts",
      scale: "-",
      name: "ENTEBBE RNAV SID ICAO RWY 17 APNAD B MANDY B SEZIM B",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "sid-entebbe-17-apnad-b"
    },
    {
      title: "",
      scale: "-",
      name: "ENTEBBE RNAV SID ICAO RWY 17 PASAN B OKSUM B BETAF B",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "sid-entebbe-17-pasan-b"
    },
    {
      title: "",
      scale: "-",
      name: "ENTEBBE RNAV SID ICAO RWY 17 UVBAX B IMVIP B",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "sid-entebbe-17-uvbax-b"
    },
    {
      title: "",
      scale: "-",
      name: "ENTEBBE RNAV SID ICAO RWY 35 OKSUM D BETAF D APNAD D",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "sid-entebbe-35-oksum-d"
    },
    {
      title: "",
      scale: "-",
      name: "ENTEBBE RNAV SID ICAO RWY 35 SEZIM D MANDY D",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "sid-entebbe-35-sezim-d"
    },
    {
      title: "",
      scale: "-",
      name: "ENTEBBE RNAV SID ICAO RWY 35 UVBAX D IMVIP D PASAN D",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "sid-entebbe-35-uvbax-d"
    },
    
    // Standard Arrival Charts - Instrument (STAR) ICAO
    {
      title: "Standard Arrival Chart - Instrument STAR ICAO Charts",
      scale: "-",
      name: "ENTEBBE RNAV STAR ICAO RWY 17 APNAD A MANDY A",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "star-entebbe-17-apnad-a"
    },
    {
      title: "",
      scale: "-",
      name: "ENTEBBE RNAV STAR ICAO RWY 17 IMVIP A IMPOG A OKSUM A BETAF A",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "star-entebbe-17-imvip-a"
    },
    {
      title: "",
      scale: "-",
      name: "ENTEBBE RNAV STAR ICAO RWY 17 UVBAX A SEZIM A",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "star-entebbe-17-uvbax-a"
    },
    {
      title: "",
      scale: "-",
      name: "ENTEBBE RNAV STAR ICAO RWY 35 IMVIP C IMPOG C",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "star-entebbe-35-imvip-c"
    },
    {
      title: "",
      scale: "-",
      name: "ENTEBBE RNAV STAR ICAO RWY 35 OKSUM C BETAF C APNAD C",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "star-entebbe-35-oksum-c"
    },
    {
      title: "",
      scale: "-",
      name: "ENTEBBE RNAV STAR ICAO RWY 35 UVBAX C SEZIM C MANDY C",
      prices: ["A4 size: 5 USD"],
      date: "02 NOV 23",
      id: "star-entebbe-35-uvbax-c"
    },
    
    // Visual Approach Chart - ICAO (VAC)
    {
      title: "Visual Approach Chart - ICAO (VAC)",
      scale: "-",
      name: "ENTEBBE VISUAL APPROACH CHART ICAO",
      prices: ["A4 size: 5 USD"],
      date: "29 MAR 18",
      id: "vac-entebbe"
    }
  ];

  // Determine which charts to display based on showAllCharts state
  const displayedCharts = showAllCharts ? chartData : chartData.slice(0, 5);
  const remainingChartsCount = chartData.length - 5;

  const handleOrderClick = (chartId, chartName) => {
    console.log('Order button clicked for chart:', chartId, chartName);
    
    // Find the selected chart first
    const chart = chartData.find(c => c.id === chartId);
    console.log('Found chart:', chart);
    
    if (!chart) {
      console.error('Chart not found for ID:', chartId);
      return;
    }
    
    // Store the selected chart
    setSelectedChart(chart);
    
    // Check authentication
    if (!isAuthenticated) {
      console.log('User not authenticated, showing login modal');
      setShowAuthModal(true);
      return;
    }
    
    // User is authenticated, show order form
    setShowOrderForm(true);
    console.log('Order form should now be open, showOrderForm:', true);
  };

  const handleCloseOrderForm = () => {
    setShowOrderForm(false);
    setSelectedChart(null);
  };

  const toggleShowCharts = () => {
    setShowAllCharts(!showAllCharts);
  };

  console.log('AeronauticalCharts render - showOrderForm:', showOrderForm, 'selectedChart:', selectedChart);

  return (
    <ChartsSection>
      <ChartsSectionTitle>
        <FaMap /> Aeronautical Charts - Complete Catalog & Orders
      </ChartsSectionTitle>
      
      <ChartCounter>
        Showing {displayedCharts.length} of {chartData.length} available charts
      </ChartCounter>
      
      <ChartsTable>
        <ChartsTableHeader>
          <div>Title of Series</div>
          <div>Scale</div>
          <div>Name and/or Number</div>
          <div>Price ($)</div>
          <div>Date</div>
          <div>Order</div>
        </ChartsTableHeader>
        
        {displayedCharts.map((chart) => (
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
      
      {/* Show More / Show Less Button */}
      <ShowMoreButton onClick={toggleShowCharts}>
        {showAllCharts ? (
          <>
            <FaChevronUp />
            Show Less Charts
          </>
        ) : (
          <>
            <FaChevronDown />
            Show {remainingChartsCount} More Charts
          </>
        )}
      </ShowMoreButton>
      
      <ChartsNote>
        <strong>Note:</strong> Charts can be bought in the local currency at the prevailing UCAA monthly exchange rate.
      </ChartsNote>
      
      {/* Chart Order Form Modal */}
      <ChartOrderForm 
        chart={selectedChart}
        isOpen={showOrderForm}
        onClose={handleCloseOrderForm}
      />
      
      {/* Authentication Modal */}
      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
        {authMode === 'login' ? (
          <Login 
            onSuccess={() => {
              setShowAuthModal(false);
              // After successful login, try to open the order form again
              if (selectedChart) {
                setShowOrderForm(true);
              }
            }} 
            onSwitchMode={() => setAuthMode('register')} 
          />
        ) : (
          <Register 
            onSuccess={() => {
              setShowAuthModal(false);
              // After successful registration, try to open the order form again
              if (selectedChart) {
                setShowOrderForm(true);
              }
            }} 
            onSwitchMode={() => setAuthMode('login')} 
          />
        )}
      </Modal>
    </ChartsSection>
  );
};

export default AeronauticalCharts;
