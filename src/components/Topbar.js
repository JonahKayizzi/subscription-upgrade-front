import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../features/search/searchSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import SubscriberPickerModal from './SubscriberPickerModal';

export default function Topbar() {
  const dispatch = useDispatch();
  const searchQuery = useSelector(state => state.search.query);
  const user = useSelector(state => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [pickerOpen, setPickerOpen] = useState(false);

  const isAdmin = user?.email === 'ais@caa.co.ug';
  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const showSearchInput = location.pathname === '/subscribers' && isAdmin;

  const handleAddSubscriptionClick = () => setPickerOpen(true);
  const handleSubscriberSelect = (subscriber) => {
    setPickerOpen(false);
    navigate(`/subscriber/${subscriber.sub_id}/add-subscription`);
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="topbar">
      {showSearchInput && (
        <input
          type="text"
          placeholder="Search for subscriptions, payouts, and reminders"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="topbar-search"
        />
      )}
      <div className="topbar-row">
        <div className="topbar-left">
          {isAdmin && (
            <button type="button" onClick={handleAddSubscriptionClick} className="btn-add-subscription">
              + Add Subscription
            </button>
          )}
          <div className="topbar-date">{today}</div>
          {user && <span className="topbar-welcome">Welcome, {user.name || user.email}</span>}
        </div>
        <button type="button" onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
      <SubscriberPickerModal isOpen={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={handleSubscriberSelect} />
    </div>
  );
}
