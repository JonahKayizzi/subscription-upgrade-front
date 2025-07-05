import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { setSearchQuery } from '../features/search/searchSlice';
import SubscriberPickerModal from './SubscriberPickerModal';

export default function Topbar() {
  const dispatch = useDispatch();
  const searchQuery = useSelector(state => state.search.query);
  const location = useLocation();
  const navigate = useNavigate();
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSearchInputChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const showSearchInput = location.pathname === '/subscribers';

  const handleAddSubscriptionClick = () => {
    setPickerOpen(true);
  };

  const handleSubscriberSelect = (subscriber) => {
    setPickerOpen(false);
    navigate(`/subscriber/${subscriber.sub_id}/add-subscription`);
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <button className="button-primary" onClick={handleAddSubscriptionClick}>+ Add Subscription</button>
        <div style={{ background: 'var(--color-accent2)', color: '#fff', borderRadius: 16, padding: '8px 20px', fontWeight: 700, fontSize: 18 }}>
          {today}
        </div>
      </div>
      <SubscriberPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSubscriberSelect}
      />
    </div>
  );
} 