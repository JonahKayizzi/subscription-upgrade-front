import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { setSearchQuery } from '../features/search/searchSlice';
import { logout } from '../features/auth/authSlice';
import SubscriberPickerModal from './SubscriberPickerModal';
import { FiSettings } from 'react-icons/fi';

export default function Topbar() {
  const dispatch = useDispatch();
  const searchQuery = useSelector(state => state.search.query);
  const user = useSelector(state => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [pickerOpen, setPickerOpen] = useState(false);

  const isAdmin = user?.email === '***REMOVED***';

  const handleSearchInputChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const showSearchInput = location.pathname === '/subscribers' && isAdmin;

  const handleAddSubscriptionClick = () => {
    setPickerOpen(true);
  };

  const handleSubscriberSelect = (subscriber) => {
    setPickerOpen(false);
    navigate(`/subscriber/${subscriber.sub_id}/add-subscription`);
  };

  const handleLogout = () => {
    dispatch(logout());
    // Navigate to landing page
    navigate('/');
  };

  return (
    <div className="topbar">
      {showSearchInput && (
        <input
          type="text"
          placeholder="Search for subscriptions, payouts, and reminders"
          value={searchQuery}
          onChange={handleSearchInputChange}
          style={{
            background: 'var(--color-bg-card)',
            border: 'none',
            borderRadius: 8,
            padding: '10px 16px',
            color: 'var(--color-text)',
            width: 320,
            marginRight: 24,
          }}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {isAdmin && (
            <button className="button-primary" onClick={handleAddSubscriptionClick}>+ Add Subscription</button>
          )}
          <Link to="/settings" style={{ textDecoration: 'none' }}>
            <button 
              style={{
                background: 'var(--color-bg-card)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--color-bg-hover)'}
              onMouseLeave={(e) => e.target.style.background = 'var(--color-bg-card)'}
            >
              <FiSettings size={16} />
              Settings
            </button>
          </Link>
          <div style={{ background: 'var(--color-accent2)', color: '#fff', borderRadius: 16, padding: '8px 20px', fontWeight: 700, fontSize: 18 }}>
            {today}
          </div>
          {user && (
            <span style={{ color: 'var(--color-text)', fontSize: 14 }}>
              Welcome, {user.name || user.email}
            </span>
          )}
        </div>
        <button 
          onClick={handleLogout}
          style={{
            background: 'var(--color-error)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#dc2626'}
          onMouseLeave={(e) => e.target.style.background = 'var(--color-error)'}
        >
          Logout
        </button>
      </div>
      <SubscriberPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSubscriberSelect}
      />
    </div>
  );
} 