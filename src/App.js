import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import SubscriberDashboard from './components/SubscriberDashboard';
import SubscribersTable from './components/SubscribersTable';
import SubscriptionForm from './components/SubscriptionForm';
import SubscriptionOrderForm from './components/SubscriptionOrderForm';
import Settings from './components/Settings';
// import AddSubscriptionPage from './components/AddSubscriptionPage';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { logout } from './features/auth/authSlice';
import { checkSessionTimeout } from './utils/sessionUtils';
import styled from 'styled-components';
import { FaMap, FaBook, FaChartBar, FaEnvelope, FaPhone, FaDatabase, FaCheckCircle, FaUserShield, FaRocket, FaCloud, FaRegFileAlt, FaCompactDisc, FaGlobe, FaMapMarkerAlt, FaFileAlt, FaExclamationTriangle } from 'react-icons/fa';
const LandingContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(90deg, #f8fafc 60%, #f1f5f9 100%);
  flex-direction: column;
`;

const Hero = styled.section`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
  padding: 48px;
  margin-top: 24px;
  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
    gap: 0;
    padding: 0 20px 40px 20px;
  }
`;

const LeftPanel = styled.div`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0 16px 4px 0;
  margin-left: 0;
  background: transparent;
  overflow-y: auto;
  @media (max-width: 1200px) {
    align-items: center;
    padding: 0 0 32px 0;
  }
`;

const InfoCard = styled.div`
  background: #fff;
  padding: 0 0 0 0;
  color: #1e293b;
  width: 100%;
  margin-left: 32px;
  @media (max-width: 600px) {
    padding: 18px 8px 16px 8px;
    max-width: 98vw;
    margin-left: 0;
  }
`;

const PricingSection = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  margin: 32px 0 0 0;
  flex-wrap: nowrap;
  
  @media (max-width: 1200px) {
    gap: 16px;
  }
  
  @media (max-width: 1024px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const PricingCard = styled.div`
  background: ${({ gradient }) => gradient || '#fff'};
  color: ${({ dark }) => (dark ? '#fff' : '#231942')};
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(44, 34, 84, 0.12);
  padding: 32px 24px;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
`;

const PlanTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: center;
  width: 100%;
  justify-content: center;
`;

const PriceRow = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 24px;
  display: flex;
  align-items: baseline;
  gap: 8px;
  justify-content: center;
  width: 100%;
`;

const PriceUnit = styled.span`
  font-size: 1rem;
  font-weight: 500;
  margin-left: 2px;
`;

const FeatureList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: inherit;
  & svg {
    color: inherit;
    font-size: .7em;
    border-radius: 50%;
    padding: 2px;
    width: 1.2em;
    height: 1.2em;
  }
`;

const FeaturesTitle = styled.h5`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: inherit;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 48px 0 48px 0;
  gap: 24px;
  @media (max-width: 1200px) {
    align-items: center;
    padding: 0 0 32px 0;
  }
`;

const ContactCard = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 32px;
  margin-bottom: 24px;
  color: #1e293b;
  width: 100%;
  max-width: 570px;
  display: flex;
  align-items: center;
  gap: 40px;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
`;

const ContactBranding = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const ContactLogo = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f7b801 0%, #f59e42 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  font-weight: bold;
`;

const ContactCompanyType = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #231942;
  text-align: center;
  opacity: 0.8;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  color: #1e293b;
`;

const ContactIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #231942;
  font-size: 14px;
  flex-shrink: 0;
`;

const InfoCardsRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const InfoCardHalf = styled(InfoCard)`
  flex: 1;
  max-width: none;
`;

const ComingSoonBanner = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  margin-bottom: 0;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    animation: float 20s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const ComingSoonTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 4px 0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  letter-spacing: -0.5px;
  position: relative;
  z-index: 2;
  line-height: 1.1;
  
  &::before, &::after {
    content: '✦';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.8rem;
    color: #ffffff;
    opacity: 0.8;
  }
  
  &::before {
    left: -20px;
  }
  
  &::after {
    right: -20px;
  }
`;

const ComingSoonSubtitle = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 4px 8px;
  display: inline-block;
  position: relative;
  z-index: 2;
  backdrop-filter: blur(10px);
  margin-top: 4px;
`;

const DecorativeLines = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    width: 20px;
    height: 20px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: none;
    border-right: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 8px;
    right: 8px;
    width: 20px;
    height: 20px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-bottom: none;
    border-left: none;
  }
`;

const ProductsCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 24px;
  display: flex;
  gap: 24px;
  align-items: center;
  border: 1px solid #f1f5f9;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
`;

const ProductsDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductsTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #231942;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;



const ProductsSpecs = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 4px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const SpecItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SpecLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SpecValue = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #231942;
`;

const ProductsList = styled.ul`
  margin: 8px 0 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProductItem = styled.li`
  font-size: 0.9rem;
  color: #475569;
  font-weight: 500;
  
  &::before {
    content: '•';
    color: #667eea;
    font-weight: bold;
    margin-right: 8px;
  }
`;

const ProductsNote = styled.div`
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
  margin-top: 8px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  display: inline-block;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
  border: 1px solid #f1f5f9;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 80px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
    gap: 8px;
    min-height: auto;
  }
`;

const ProductIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background: ${({ gradient }) => gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
`;

const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const ProductName = styled.h4`
  font-size: 0.9rem;
  font-weight: 700;
  color: #231942;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  line-height: 1.2;
`;

const ProductDescription = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
  line-height: 1.3;
`;

const WelcomeBanner = styled.div`
  border-radius: 16px;
  padding: 32px;
  color: #1e293b;
  position: relative;
  overflow: hidden;
  margin-bottom: 32px;
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
`;
const WelcomeText = styled.div`
  flex: 1;
`;

const WelcomeTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2563eb;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const WelcomeDescription = styled.p`
  font-size: 0.98rem;
  color: #1e293b;
  margin: 0;
  line-height: 1.5;
`;

// Pricing Breakdown Styled Components
const PricingBreakdown = styled.div`
  margin-top: 0;
  padding: 0 0 24px 0;
  background: none;
  border-radius: 0;
  border: none;
  width: 100%;
`;

const BreakdownTitle = styled.h5`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ dark }) => (dark ? '#fff' : '#1e293b')};
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Update BreakdownTable and BreakdownCell for better alignment
const BreakdownTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BreakdownRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
`;

const BreakdownHeader = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ dark }) => (dark ? '#e2e8f0' : '#475569')};
  flex: 1;
  text-align: left;
`;

const BreakdownCell = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ dark }) => (dark ? '#fff' : '#1e293b')};
  text-align: right;
  position: relative;
  min-width: 80px;
  &::before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    height: 1.5em;
    width: 1px;
    background: ${({ dark }) => (dark ? '#4a5568' : '#e0d6cc')};
    margin: 0 18px 0 18px;
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

function App() {
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  // Check if user is admin (***REMOVED***)
  const isAdmin = user?.email === '***REMOVED***';

  // Auto-logout on session timeout
  React.useEffect(() => {
    if (!token) return;

    const checkSession = () => {
      if (checkSessionTimeout(token)) {
        dispatch(logout());
      }
    };

    // Check every minute
    const interval = setInterval(checkSession, 60000);
    
    // Initial check
    checkSession();

    return () => clearInterval(interval);
  }, [token, dispatch]);

  if (!token) {
    return (
      <LandingContainer>
        <Hero>
          <LeftPanel>
            <WelcomeBanner>
              <WelcomeContent>
                <WelcomeText>
                  <WelcomeTitle>Welcome to the AIP Subscription Portal</WelcomeTitle>
                  <WelcomeDescription>
                    Uganda Civil Aviation Authority's Aeronautical Information Service (AIS) provides the information necessary for the safety, regularity, and efficiency of air navigation in Uganda. AIS products are available in paper, CD, and online formats.
                  </WelcomeDescription>
                </WelcomeText>
              </WelcomeContent>
            </WelcomeBanner>
            <InfoCardsRow>
              <InfoCardHalf>
                <ProductsCard>
                  <ProductsDetails>
                    <ProductsTitle>Aeronautical Information Products</ProductsTitle>
                    <ProductsGrid>
                      <ProductCard>
                        <ProductIcon gradient="linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)">
                          <FaBook />
                        </ProductIcon>
                        <ProductInfo>
                          <ProductName>AIP</ProductName>
                          <ProductDescription>Aeronautical Information Publication - comprehensive guide for air navigation in Uganda</ProductDescription>
                        </ProductInfo>
                      </ProductCard>
                      
                      <ProductCard>
                        <ProductIcon gradient="linear-gradient(135deg, #f7b801 0%, #f59e42 100%)">
                          <FaFileAlt />
                        </ProductIcon>
                        <ProductInfo>
                          <ProductName>AIP Amendments</ProductName>
                          <ProductDescription>Official amendments to the AIP with updated aeronautical information</ProductDescription>
                        </ProductInfo>
                      </ProductCard>
                      
                      <ProductCard>
                        <ProductIcon gradient="linear-gradient(135deg, #a259f7 0%, #ec4899 100%)">
                          <FaFileAlt />
                        </ProductIcon>
                        <ProductInfo>
                          <ProductName>AIP Supplements</ProductName>
                          <ProductDescription>Temporary changes and special procedures affecting air navigation</ProductDescription>
                        </ProductInfo>
                      </ProductCard>
                      
                      <ProductCard>
                        <ProductIcon gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)">
                          <FaEnvelope />
                        </ProductIcon>
                        <ProductInfo>
                          <ProductName>Aeronautical Information Circulars</ProductName>
                          <ProductDescription>Important notices and information for aviation community</ProductDescription>
                        </ProductInfo>
                      </ProductCard>
                      
                      <ProductCard>
                        <ProductIcon gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)">
                          <FaExclamationTriangle />
                        </ProductIcon>
                        <ProductInfo>
                          <ProductName>NOTAM & PIB</ProductName>
                          <ProductDescription>Notices to Airmen and Pre-flight Information Bulletins</ProductDescription>
                        </ProductInfo>
                      </ProductCard>
                      
                      <ProductCard>
                        <ProductIcon gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)">
                          <FaMap />
                        </ProductIcon>
                        <ProductInfo>
                          <ProductName>Aeronautical Charts</ProductName>
                          <ProductDescription>Detailed charts and maps for flight planning and navigation</ProductDescription>
                        </ProductInfo>
                      </ProductCard>
                      
                      <ComingSoonBanner>
                        <DecorativeLines />
                        <ComingSoonTitle>COMING SOON</ComingSoonTitle>
                        <ComingSoonSubtitle>DIGITAL DATA SETS</ComingSoonSubtitle>
                      </ComingSoonBanner>
                    </ProductsGrid>
                  </ProductsDetails>
                </ProductsCard>
              </InfoCardHalf>
            </InfoCardsRow>
            {/* VAT Inclusive Disclaimer Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              padding: '16px 24px',
              borderRadius: '12px',
              marginBottom: '24px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
              border: '2px solid #fecaca',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M20 20c0-11.046-8.954-20-20-20v20h20z\'/%3E%3C/g%3E%3C/svg%3E")',
                animation: 'float 15s ease-in-out infinite',
                zIndex: 1
              }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '1.4rem',
                  fontWeight: '900',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '0.5px'
                }}>
                  ⚠️ IMPORTANT: ALL PRICES INCLUDE 18% VAT ⚠️
                </h3>
                <p style={{
                  margin: '0',
                  fontSize: '1rem',
                  fontWeight: '600',
                  opacity: '0.95',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}>
                  Prices shown are final amounts including 18% VAT
                </p>
              </div>
            </div>
            <PricingSection>
              {/* eAIP Card */}
              <PricingCard gradient="linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)" dark>
                <PlanTitle><FaCloud /> eAIP</PlanTitle>
                <PriceRow>200.6<PriceUnit>USD/year</PriceUnit></PriceRow>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  textAlign: 'center',
                  marginBottom: '16px',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  ✅ INCLUDES 18% VAT
                </div>
                <PricingBreakdown>
                  <BreakdownTable>
                    <BreakdownRow>
                      <BreakdownHeader>Online AIP (web-based)</BreakdownHeader>
                      <BreakdownCell>200.6 USD</BreakdownCell>
                    </BreakdownRow>
                  </BreakdownTable>
                </PricingBreakdown>
                <FeaturesTitle>Features</FeaturesTitle>
                <FeatureList>
                  <FeatureItem><FaCheckCircle /> Web-based access to AIP</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Includes AICs and 1st year amendment</FeatureItem>
                  <FeatureItem><FaCheckCircle /> 24/7 online availability</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Secure login for subscribers</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Email notifications for updates</FeatureItem>
                </FeatureList>
              </PricingCard>
              {/* Paper Card */}
              <PricingCard gradient="linear-gradient(135deg, #f7b801 0%, #f59e42 100%)">
                <PlanTitle><FaRegFileAlt /> Paper</PlanTitle>
                <PriceRow>271.4-431.9<PriceUnit>USD/year</PriceUnit></PriceRow>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#231942',
                  textAlign: 'center',
                  marginBottom: '16px',
                  padding: '8px 12px',
                  background: 'rgba(35, 25, 66, 0.1)',
                  borderRadius: '6px',
                  border: '1px solid rgba(35, 25, 66, 0.2)'
                }}>
                  ✅ INCLUDES 18% VAT
                </div>
                <PricingBreakdown>
                  <BreakdownTable>
                    <BreakdownRow>
                      <BreakdownHeader>Hand delivery</BreakdownHeader>
                      <BreakdownCell>271.4 USD</BreakdownCell>
                    </BreakdownRow>
                    <BreakdownRow>
                      <BreakdownHeader>Within country</BreakdownHeader>
                      <BreakdownCell>345.7 USD</BreakdownCell>
                    </BreakdownRow>
                    <BreakdownRow>
                      <BreakdownHeader>Within Africa</BreakdownHeader>
                      <BreakdownCell>385.9 USD</BreakdownCell>
                    </BreakdownRow>
                    <BreakdownRow>
                      <BreakdownHeader>Rest of world</BreakdownHeader>
                      <BreakdownCell>431.9 USD</BreakdownCell>
                    </BreakdownRow>
                    <BreakdownRow>
                      <BreakdownHeader>AIP Binder</BreakdownHeader>
                      <BreakdownCell>54.3 USD </BreakdownCell>
                    </BreakdownRow>
                    <BreakdownRow>
                      <BreakdownHeader>AIC Set (AICs and AIC covers)</BreakdownHeader>
                      <BreakdownCell>154.6 USD</BreakdownCell>
                    </BreakdownRow>
                  </BreakdownTable>
                </PricingBreakdown>
                <FeaturesTitle>Features</FeaturesTitle>
                <FeatureList>
                  <FeatureItem><FaCheckCircle /> Printed AIP (includes AICs & 1st year amendment)</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Annual amendment service</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Delivery options: hand, local, Africa, worldwide</FeatureItem>
                  <FeatureItem><FaCheckCircle /> AIP binder and AIC set available</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Support for organizations and individuals</FeatureItem>
                </FeatureList>
              </PricingCard>
              {/* CD Card */}
              <PricingCard gradient="linear-gradient(135deg, #a259f7 0%, #ec4899 100%)" dark>
                <PlanTitle><FaCompactDisc /> CD</PlanTitle>
                <PriceRow>82.6-200.6<PriceUnit>USD/year</PriceUnit></PriceRow>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  textAlign: 'center',
                  marginBottom: '16px',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  ✅ INCLUDES 18% VAT
                </div>
                <PricingBreakdown>
                  <BreakdownTable>
                    <BreakdownRow>
                      <BreakdownHeader dark>Hand delivery</BreakdownHeader>
                      <BreakdownCell dark>82.6 USD</BreakdownCell>
                    </BreakdownRow>
                    <BreakdownRow>
                      <BreakdownHeader dark>Within country</BreakdownHeader>
                      <BreakdownCell dark>118.0 USD</BreakdownCell>
                    </BreakdownRow>
                    <BreakdownRow>
                      <BreakdownHeader dark>Within Africa</BreakdownHeader>
                      <BreakdownCell dark>153.4 USD</BreakdownCell>
                    </BreakdownRow>
                    <BreakdownRow>
                      <BreakdownHeader dark>Rest of world</BreakdownHeader>
                      <BreakdownCell dark>200.6 USD</BreakdownCell>
                    </BreakdownRow>
                  </BreakdownTable>
                </PricingBreakdown>
                <FeaturesTitle>Features</FeaturesTitle>
                <FeatureList>
                  <FeatureItem><FaCheckCircle /> AIP on CD (includes AICs & 1st year amendment)</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Annual amendment service</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Delivery options: hand, local, Africa, worldwide</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Compatible with Windows/Mac</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Support for organizations and individuals</FeatureItem>
                </FeatureList>
              </PricingCard>
            </PricingSection>
          </LeftPanel>
          <RightPanel>
          <SubscriptionOrderForm />
            <ContactCard>
              <ContactBranding>
                <ContactLogo>AIP</ContactLogo>
                <ContactCompanyType>UGANDA</ContactCompanyType>
              </ContactBranding>
              <ContactInfo>
                <ContactItem>
                  <ContactIcon><FaPhone /></ContactIcon>
                  <span>+256-312-352534 / 352503</span>
                </ContactItem>
                <ContactItem>
                  <ContactIcon><FaEnvelope /></ContactIcon>
                  <span>***REMOVED***</span>
                </ContactItem>
                <ContactItem>
                  <ContactIcon><FaGlobe /></ContactIcon>
                  <span>aim.caa.co.ug</span>
                </ContactItem>
                <ContactItem>
                  <ContactIcon><FaMapMarkerAlt /></ContactIcon>
                  <span>Uganda Civil Aviation Authority, AIS Headquarters</span>
                </ContactItem>
              </ContactInfo>
            </ContactCard>
          </RightPanel>
        </Hero>
      </LandingContainer>
    );
  }

  // Show the main app if authenticated
  return (
    <div className="App">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <Routes>
          <Route path="/" element={isAdmin ? <Dashboard /> : <SubscriberDashboard />} />
          <Route path="/settings" element={<Settings />} />
          {isAdmin && (
            <>
          <Route path="/subscribers" element={<SubscribersTable />} />
          <Route path="/subscriber/:id/add-subscription" element={<SubscriptionForm />} />
          <Route path="/subscriber/:id/edit-subscription/:subscriptionId" element={<SubscriptionForm />} />
            </>
          )}
          {/* <Route path="/add-subscription" element={<AddSubscriptionPage />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
