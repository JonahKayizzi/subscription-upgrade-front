import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import SubscriberDashboard from "./components/SubscriberDashboard";
import SubscribersTable from "./components/SubscribersTable";
import SubscriptionForm from "./components/SubscriptionForm";
import SubscriptionOrderForm from "./components/SubscriptionOrderForm";
import AeronauticalCharts from "./components/AeronauticalCharts";
import MyChartOrders from "./components/MyChartOrders";
import ChartOrdersManagement from "./components/ChartOrdersManagement";
import ChartsManagement from "./components/ChartsManagement";
import InvoiceRequests from "./components/InvoiceRequests";
import SettingsPage from "./components/SettingsPage";
import Modal from "./components/ui/Modal";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Button from "./components/ui/Button";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { logout } from "./features/auth/authSlice";
import { checkSessionTimeout } from "./utils/sessionUtils";
import {
  FaMap,
  FaBook,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaCloud,
  FaRegFileAlt,
  FaCompactDisc,
  FaGlobe,
  FaMapMarkerAlt,
  FaFileAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

const PRODUCT_ICONS = {
  blue: "linear-gradient(to bottom right, #3b82f6, #60a5fa)",
  accent: "linear-gradient(to bottom right, var(--color-accent), #fb923c)",
  purple: "linear-gradient(to bottom right, var(--color-accent2), #ec4899)",
  emerald: "linear-gradient(to bottom right, #10b981, #059669)",
  red: "linear-gradient(to bottom right, #ef4444, #dc2626)",
  violet: "linear-gradient(to bottom right, #8b5cf6, #7c3aed)",
};

function App() {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const isAdmin = user?.email === "ais@caa.co.ug";

  React.useEffect(() => {
    if (!token) return;
    const checkSession = () => {
      if (checkSessionTimeout(token)) dispatch(logout());
    };
    const interval = setInterval(checkSession, 60000);
    checkSession();
    return () => clearInterval(interval);
  }, [token, dispatch]);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  if (!token) {
    return (
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="*"
          element={
            <div className="app-landing">
              <header className="landing-header">
                <div className="landing-header-logo">
                  <span className="landing-header-badge">AIP</span>
                  <span>Uganda CAA · AIP Subscription</span>
                </div>
                <div className="landing-header-actions">
                  <button
                    type="button"
                    className="btn-landing-login"
                    onClick={() => {
                      setAuthMode("login");
                      setShowAuthModal(true);
                    }}
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    className="btn-landing-signup"
                    onClick={() => {
                      setAuthMode("register");
                      setShowAuthModal(true);
                    }}
                  >
                    Sign up
                  </button>
                </div>
              </header>

              <Modal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
              >
                <div className="auth-modal-inner">
                  <h3 className="auth-modal-title">
                    {authMode === "login" ? "Sign in" : "Create an account"}
                  </h3>
                  {authMode === "login" ? (
                    <Login />
                  ) : (
                    <Register onSuccess={() => setShowAuthModal(false)} />
                  )}
                  <div className="auth-modal-switch">
                    {authMode === "login" ? (
                      <>
                        Don't have an account?{" "}
                        <Button
                          type="button"
                          onClick={() => setAuthMode("register")}
                        >
                          Sign up
                        </Button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <Button
                          type="button"
                          onClick={() => setAuthMode("login")}
                        >
                          Log in
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Modal>

              <section className="landing-section">
                <div className="landing-main">
                  <div className="landing-hero">
                    <div className="landing-hero-inner">
                      <div>
                        <h2>Welcome to the AIP Subscription Portal</h2>
                        <p>
                          Uganda Civil Aviation Authority's Aeronautical
                          Information Service (AIS) provides the information
                          necessary for the safety, regularity, and efficiency
                          of air navigation in Uganda. AIS products are
                          available in paper, CD, and online formats.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="landing-products-panel">
                    <div className="landing-products-card">
                      <h3 className="landing-products-title">
                        Aeronautical Information Products
                      </h3>
                      <div className="products-grid">
                        {[
                          {
                            icon: FaBook,
                            name: "AIP",
                            desc: "Aeronautical Information Publication - comprehensive guide for air navigation in Uganda",
                            iconBg: "blue",
                          },
                          {
                            icon: FaFileAlt,
                            name: "AIP Amendments",
                            desc: "Official amendments to the AIP with updated aeronautical information",
                            iconBg: "accent",
                          },
                          {
                            icon: FaFileAlt,
                            name: "AIP Supplements",
                            desc: "Temporary changes and special procedures affecting air navigation",
                            iconBg: "purple",
                          },
                          {
                            icon: FaEnvelope,
                            name: "Aeronautical Information Circulars",
                            desc: "Important notices and information for aviation community",
                            iconBg: "emerald",
                          },
                          {
                            icon: FaExclamationTriangle,
                            name: "NOTAM & PIB",
                            desc: "Notices to Airmen and Pre-flight Information Bulletins",
                            iconBg: "red",
                          },
                          {
                            icon: FaMap,
                            name: "Aeronautical Charts",
                            desc: "Detailed charts and maps for flight planning and navigation",
                            iconBg: "violet",
                          },
                        ].map(({ icon: Icon, name, desc, iconBg }) => (
                          <div key={name} className="product-item">
                            <div
                              className="product-icon"
                              style={{ background: PRODUCT_ICONS[iconBg] }}
                            >
                              <Icon />
                            </div>
                            <div>
                              <h4>{name}</h4>
                              <p>{desc}</p>
                            </div>
                          </div>
                        ))}
                        <div className="product-coming-soon">
                          <h2>✦ COMING SOON ✦</h2>
                          <span>DIGITAL DATA SETS</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="vat-banner">
                    <h3>⚠️ IMPORTANT: ALL PRICES INCLUDE 18% VAT ⚠️</h3>
                    <p>Prices shown are final amounts including 18% VAT</p>
                  </div>

                  <div className="pricing-wrap">
                    {[
                      {
                        type: "eAIP",
                        Icon: FaCloud,
                        price: "200.6",
                        gradient:
                          "linear-gradient(145deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)",
                        dark: true,
                        popular: true,
                        breakdown: [
                          {
                            label: "Online AIP (web-based)",
                            value: "200.6 USD",
                          },
                        ],
                        features: [
                          "Web-based access to AIP",
                          "Includes AICs and 1st year amendment",
                          "24/7 online availability",
                          "Secure login for subscribers",
                          "Email notifications for updates",
                        ],
                      },
                      {
                        type: "Paper",
                        Icon: FaRegFileAlt,
                        price: "271.4-431.9",
                        gradient:
                          "linear-gradient(145deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)",
                        dark: false,
                        popular: false,
                        breakdown: [
                          { label: "Hand delivery", value: "271.4 USD" },
                          { label: "Within country", value: "345.7 USD" },
                          { label: "Within Africa", value: "385.9 USD" },
                          { label: "Rest of world", value: "431.9 USD" },
                          { label: "AIP Binder", value: "54.3 USD" },
                          {
                            label: "AIC Set (AICs and AIC covers)",
                            value: "154.6 USD",
                          },
                        ],
                        features: [
                          "Printed AIP (includes AICs & 1st year amendment)",
                          "Annual amendment service",
                          "Delivery options: hand, local, Africa, worldwide",
                          "AIP binder and AIC set available",
                          "Support for organizations and individuals",
                        ],
                      },
                      {
                        type: "CD",
                        Icon: FaCompactDisc,
                        price: "82.6-200.6",
                        gradient:
                          "linear-gradient(145deg, #6d28d9 0%, #7c3aed 50%, #a855f7 100%)",
                        dark: true,
                        popular: false,
                        breakdown: [
                          { label: "Hand delivery", value: "82.6 USD" },
                          { label: "Within country", value: "118.0 USD" },
                          { label: "Within Africa", value: "153.4 USD" },
                          { label: "Rest of world", value: "200.6 USD" },
                        ],
                        features: [
                          "AIP on CD (includes AICs & 1st year amendment)",
                          "Annual amendment service",
                          "Delivery options: hand, local, Africa, worldwide",
                          "Compatible with Windows/Mac",
                          "Support for organizations and individuals",
                        ],
                      },
                    ].map(
                      ({
                        type,
                        Icon,
                        price,
                        gradient,
                        dark,
                        popular,
                        breakdown,
                        features,
                      }) => (
                        <div
                          key={type}
                          className={`pricing-card ${dark ? "pricing-card-dark" : "pricing-card-light"} ${popular ? "pricing-card-popular" : ""}`}
                          style={{ background: gradient }}
                        >
                          {popular && (
                            <span className="pricing-badge-popular">
                              Most popular
                            </span>
                          )}
                          <h4>
                            <Icon /> {type}
                          </h4>
                          <div className="pricing-price-row">
                            <span className="pricing-price">{price}</span>
                            <span className="pricing-unit">USD/year</span>
                          </div>
                          <div
                            className={`pricing-vat-badge ${dark ? "dark" : "light"}`}
                          >
                            ✅ INCLUDES 18% VAT
                          </div>
                          <div className="pricing-breakdown">
                            {breakdown.map(({ label, value }) => (
                              <div
                                key={label}
                                className="pricing-breakdown-row"
                              >
                                <span className="pricing-breakdown-label">
                                  {label}
                                </span>
                                <span className="pricing-breakdown-value">
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                          <h5 className="pricing-features-title">Features</h5>
                          <ul className="pricing-features-list">
                            {features.map((f) => (
                              <li key={f}>
                                <FaCheckCircle /> {f}
                              </li>
                            ))}
                          </ul>
                          <button
                            type="button"
                            className="pricing-cta"
                            onClick={() =>
                              document
                                .getElementById("order-form")
                                ?.scrollIntoView({ behavior: "smooth" })
                            }
                          >
                            Get started
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="landing-sidebar">
                  <div id="order-form">
                    <SubscriptionOrderForm />
                  </div>
                  <div className="contact-card">
                    <div className="contact-card-logo">
                      <div className="contact-card-logo-icon">AIP</div>
                      <div className="contact-card-logo-label">UGANDA</div>
                    </div>
                    <div className="contact-card-list">
                      {[
                        { Icon: FaPhone, text: "+256-312-352534 / 352503" },
                        { Icon: FaEnvelope, text: "ais@caa.co.ug" },
                        { Icon: FaGlobe, text: "aim.caa.co.ug" },
                        {
                          Icon: FaMapMarkerAlt,
                          text: "Uganda Civil Aviation Authority, AIS Headquarters",
                        },
                      ].map(({ Icon, text }) => (
                        <div key={text} className="contact-card-row">
                          <span>
                            <Icon />
                          </span>
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="landing-charts-fullwidth">
                  <AeronauticalCharts />
                </div>
              </section>
            </div>
          }
        />
      </Routes>
    );
  }

  return (
    <div className="app-authenticated">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <div className="app-content">
          <Routes>
            <Route
              path="/"
              element={isAdmin ? <Dashboard /> : <SubscriberDashboard />}
            />
            <Route path="/charts" element={<AeronauticalCharts />} />
            <Route path="/my-orders" element={<MyChartOrders />} />
            <Route path="/settings" element={<SettingsPage />} />
            {isAdmin && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/subscribers" element={<SubscribersTable />} />
                <Route
                  path="/subscriber/:id/add-subscription"
                  element={<SubscriptionForm />}
                />
                <Route
                  path="/subscriber/:id/edit-subscription/:subscriptionId"
                  element={<SubscriptionForm />}
                />
                <Route path="/admin/my-orders" element={<MyChartOrders />} />
                <Route
                  path="/admin/chart-orders"
                  element={<ChartOrdersManagement />}
                />
                <Route path="/admin/charts" element={<ChartsManagement />} />
                <Route
                  path="/admin/invoice-requests"
                  element={<InvoiceRequests />}
                />
              </>
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
