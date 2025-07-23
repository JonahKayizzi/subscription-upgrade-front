import './App.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SubscribersTable from './components/SubscribersTable';
import SubscriptionForm from './components/SubscriptionForm';
import SubscriptionOrderForm from './components/SubscriptionOrderForm';
// import AddSubscriptionPage from './components/AddSubscriptionPage';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { FaMap, FaBook, FaChartBar, FaEnvelope, FaPhone, FaDatabase, FaCheckCircle, FaUserShield, FaRocket, FaCloud, FaRegFileAlt, FaCompactDisc } from 'react-icons/fa';
import Logo from './logo.svg';

const LandingContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(90deg, #f8fafc 60%, #f1f5f9 100%);
  flex-direction: column;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 48px 0 48px;
  background: transparent;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 16px;
    padding: 24px 12px 0 12px;
  }
`;

const LogoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const LogoImg = styled.img`
  height: 54px;
  width: 54px;
`;

const SiteTitle = styled.h1`
  font-size: 2.1rem;
  font-weight: 800;
  color: #231942;
  margin: 0;
  letter-spacing: -1px;
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
  /*border-radius: 18px;*/
  /*box-shadow: 0 4px 24px rgba(0,0,0,0.08);*/
  padding: 0 0 0 0;
  /*max-width: 480px;*/
  color: #1e293b;
  width: 100%;
  margin-left: 32px;
  @media (max-width: 600px) {
    padding: 18px 8px 16px 8px;
    max-width: 98vw;
    margin-left: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 3.0rem;
  font-weight: 500;
  color: #2563eb;
  margin: 0 0 12px 32px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.98rem;
  margin-bottom: 4px;
`;

const ProductList = styled.ul`
  margin: 0 0 12px 0;
  padding-left: 20px;
  font-size: 0.98rem;
`;

const PricingTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  background: #f9fafb;
  border-radius: 8px;
  overflow: hidden;
  font-size: 0.97rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const PricingHeader = styled.th`
  background: #e0e7ef;
  color: #222;
  font-weight: 600;
  padding: 10px 8px;
  border-bottom: 1px solid #e5e7eb;
`;

const PricingCell = styled.td`
  padding: 8px 8px;
  border-bottom: 1px solid #e5e7eb;
`;

const PricingSection = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
  margin: 32px 0 0 0;
  flex-wrap: wrap;
`;

const PricingCard = styled.div`
  background: ${({ gradient }) => gradient || '#fff'};
  color: ${({ dark }) => (dark ? '#fff' : '#231942')};
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(44, 34, 84, 0.12);
  padding: 36px 32px 32px 32px;
  min-width: 270px;
  max-width: 340px;
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
`;

const PlanTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PriceRow = styled.div`
  font-size: 2.2rem;
  font-weight: 900;
  margin-bottom: 4px;
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const PriceUnit = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  margin-left: 2px;
`;

const FeatureList = styled.ul`
  margin: 18px 0 24px 0;
  padding: 0 0 0 0;
  list-style: none;
  font-size: 1.01rem;
  color: inherit;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const CTAButton = styled.button`
  width: 100%;
  padding: 14px 0;
  border-radius: 8px;
  border: none;
  background: #f7b801;
  color: #231942;
  font-weight: 700;
  font-size: 1.08rem;
  cursor: pointer;
  margin-top: auto;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #ffd700;
    color: #1a1333;
  }
`;

const WhySection = styled(InfoCard)`
  background: linear-gradient(90deg, #e0e7ef 60%, #f1f5f9 100%);
  color: #1e293b;
  margin-bottom: 36px;
`;

const WhyList = styled.ul`
  margin: 0 0 0 0;
  padding-left: 20px;
  font-size: 1.05rem;
  color: #334155;
`;

const WhyItem = styled.li`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 0 48px 0;
  @media (max-width: 1200px) {
    align-items: center;
    padding: 0 0 32px 0;
  }
`;

const PricingBreakdown = styled.div`
  margin-top: 12px;
  width: 100%;
`;

const BreakdownTitle = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
  color: #fff;
  font-size: 1.05rem;
`;

const BreakdownTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(255,255,255,0.08);
  border-radius: 6px;
  font-size: 0.97rem;
  margin-bottom: 0;
`;

const BreakdownRow = styled.tr``;
const BreakdownCell = styled.td`
  padding: 4px 6px;
  color: #f3f4f6;
`;
const BreakdownHeader = styled.th`
  color: #f7b801;
  font-weight: 600;
  padding: 4px 6px;
`;

function App() {
  const token = useSelector(state => state.auth.token);

  if (!token) {
    return (
      <LandingContainer>
        <Header>
          <LogoTitle>
            <LogoImg src={Logo} alt="AIS Logo" />
            <SiteTitle>AIP Subscription Portal</SiteTitle>
          </LogoTitle>
        </Header>
        <Hero>
          <LeftPanel>
            <InfoCard>
              <SectionTitle>Welcome to the AIP Subscription Portal</SectionTitle>
              <p>
                Uganda Civil Aviation Authority's Aeronautical Information Service (AIS) provides the information necessary for the safety, regularity, and efficiency of air navigation in Uganda. AIS products are available in paper, CD, and online formats.
              </p>
              <SectionTitle><FaEnvelope /> Contact Information</SectionTitle>
              <ContactRow><FaBook /> Uganda Civil Aviation Authority, AIS Headquarters</ContactRow>
              <ContactRow><FaEnvelope /> Email: <a href="mailto:***REMOVED***">***REMOVED***</a></ContactRow>
              <ContactRow><FaPhone /> Tel: +256-312-352534 / 352503</ContactRow>
              <ContactRow>Web: <a href="https://aim.caa.co.ug" target="_blank" rel="noopener noreferrer">aim.caa.co.ug</a></ContactRow>
            </InfoCard>
            <InfoCard>
              <SectionTitle><FaBook /> Aeronautical Information Products</SectionTitle>
              <ProductList>
                <li>Aeronautical Information Publication (AIP)</li>
                <li>AIP Amendments (AIP AMDT)</li>
                <li>AIP Supplements (AIP SUP)</li>
                <li>Aeronautical Information Circulars (AIC)</li>
                <li>NOTAM and Pre-Flight Information Bulletins (PIB)</li>
                <li>Aeronautical Charts</li>
                <li>Checklists and lists of valid NOTAM</li>
              </ProductList>
              <div style={{ fontSize: '0.97rem', color: '#334155' }}>
                All products are available by subscription. See pricing below.
              </div>
            </InfoCard>
            <InfoCard>
              <SectionTitle><FaDatabase /> Digital Data Sets</SectionTitle>
              <div style={{ fontSize: '1rem', color: '#334155' }}>
                <strong>Coming soon:</strong> Digital aeronautical datasets will be published and made available for subscription in the near future.
              </div>
            </InfoCard>
            <PricingSection>
              {/* eAIP Card */}
              <PricingCard gradient="linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)" dark>
                <PlanTitle><FaCloud /> eAIP</PlanTitle>
                <PriceRow>170<PriceUnit>USD/year</PriceUnit></PriceRow>
                <FeatureList>
                  <FeatureItem><FaCheckCircle /> Web-based access to AIP</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Includes AICs and 1st year amendment</FeatureItem>
                  <FeatureItem><FaCheckCircle /> 24/7 online availability</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Secure login for subscribers</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Email notifications for updates</FeatureItem>
                </FeatureList>
                <PricingBreakdown>
                  <BreakdownTitle>Pricing breakdown</BreakdownTitle>
                  <BreakdownTable>
                    <tbody>
                      <BreakdownRow>
                        <BreakdownHeader>Online AIP (web-based)</BreakdownHeader>
                        <BreakdownCell>170 USD/year</BreakdownCell>
                      </BreakdownRow>
                    </tbody>
                  </BreakdownTable>
                </PricingBreakdown>
                <CTAButton>Start eAIP Subscription</CTAButton>
              </PricingCard>
              {/* Paper Card */}
              <PricingCard gradient="linear-gradient(135deg, #f7b801 0%, #f59e42 100%)">
                <PlanTitle><FaRegFileAlt /> Paper</PlanTitle>
                <PriceRow>230-293<PriceUnit>USD/year</PriceUnit></PriceRow>
                <FeatureList>
                  <FeatureItem><FaCheckCircle /> Printed AIP (includes AICs & 1st year amendment)</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Annual amendment service</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Delivery options: hand, local, Africa, worldwide</FeatureItem>
                  <FeatureItem><FaCheckCircle /> AIP binder and AIC set available</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Support for organizations and individuals</FeatureItem>
                </FeatureList>
                <PricingBreakdown>
                  <BreakdownTitle>Pricing breakdown</BreakdownTitle>
                  <BreakdownTable>
                    <tbody>
                      <BreakdownRow>
                        <BreakdownHeader>Hand delivery</BreakdownHeader>
                        <BreakdownCell>230 USD/year</BreakdownCell>
                      </BreakdownRow>
                      <BreakdownRow>
                        <BreakdownHeader>Within country</BreakdownHeader>
                        <BreakdownCell>293 USD/year</BreakdownCell>
                      </BreakdownRow>
                      <BreakdownRow>
                        <BreakdownHeader>Within Africa</BreakdownHeader>
                        <BreakdownCell>293 USD/year</BreakdownCell>
                      </BreakdownRow>
                      <BreakdownRow>
                        <BreakdownHeader>Rest of world</BreakdownHeader>
                        <BreakdownCell>293 USD/year</BreakdownCell>
                      </BreakdownRow>
                      <BreakdownRow>
                        <BreakdownHeader>AIP Binder</BreakdownHeader>
                        <BreakdownCell>46 USD (one-time)</BreakdownCell>
                      </BreakdownRow>
                      <BreakdownRow>
                        <BreakdownHeader>AIC Set (AICs and AIC covers)</BreakdownHeader>
                        <BreakdownCell>131 USD/year</BreakdownCell>
                      </BreakdownRow>
                    </tbody>
                  </BreakdownTable>
                </PricingBreakdown>
                <CTAButton>Start Paper Subscription</CTAButton>
              </PricingCard>
              {/* CD Card */}
              <PricingCard gradient="linear-gradient(135deg, #a259f7 0%, #ec4899 100%)" dark>
                <PlanTitle><FaCompactDisc /> CD</PlanTitle>
                <PriceRow>70-170<PriceUnit>USD/year</PriceUnit></PriceRow>
                <FeatureList>
                  <FeatureItem><FaCheckCircle /> AIP on CD (includes AICs & 1st year amendment)</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Annual amendment service</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Delivery options: hand, local, Africa, worldwide</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Compatible with Windows/Mac</FeatureItem>
                  <FeatureItem><FaCheckCircle /> Support for organizations and individuals</FeatureItem>
                </FeatureList>
                <PricingBreakdown>
                  <BreakdownTitle>Pricing breakdown</BreakdownTitle>
                  <BreakdownTable>
                    <tbody>
                      <BreakdownRow>
                        <BreakdownHeader>Hand delivery</BreakdownHeader>
                        <BreakdownCell>70 USD/year</BreakdownCell>
                      </BreakdownRow>
                      <BreakdownRow>
                        <BreakdownHeader>Within country</BreakdownHeader>
                        <BreakdownCell>100 USD/year</BreakdownCell>
                      </BreakdownRow>
                      <BreakdownRow>
                        <BreakdownHeader>Within Africa</BreakdownHeader>
                        <BreakdownCell>130 USD/year</BreakdownCell>
                      </BreakdownRow>
                      <BreakdownRow>
                        <BreakdownHeader>Rest of world</BreakdownHeader>
                        <BreakdownCell>170 USD/year</BreakdownCell>
                      </BreakdownRow>
                    </tbody>
                  </BreakdownTable>
                </PricingBreakdown>
                <CTAButton>Start CD Subscription</CTAButton>
              </PricingCard>
            </PricingSection>
          </LeftPanel>
          <RightPanel>
            <SubscriptionOrderForm />
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
          <Route path="/" element={<Dashboard />} />
          <Route path="/subscribers" element={<SubscribersTable />} />
          <Route path="/subscriber/:id/add-subscription" element={<SubscriptionForm />} />
          <Route path="/subscriber/:id/edit-subscription/:subscriptionId" element={<SubscriptionForm />} />
          {/* <Route path="/add-subscription" element={<AddSubscriptionPage />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
