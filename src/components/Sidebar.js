import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { FiHome, FiUsers, FiPlusSquare, FiSettings, FiLogOut, FiBarChart2, FiShoppingBag, FiClipboard } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SubscriberPickerModal from './SubscriberPickerModal';

export default function Sidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [pickerOpen, setPickerOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleAddSubscriptionClick = () => {
    setPickerOpen(true);
  };

  const handleSubscriberSelect = (subscriber) => {
    setPickerOpen(false);
    navigate(`/subscriber/${subscriber.sub_id}/add-subscription`);
  };

  return (
    <div className="sidebar">
      <div style={{ marginBottom: 32 }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" alt="Logo" style={{ width: 40, borderRadius: 8 }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <FiHome 
            size={28} 
            color={isActive('/') ? '#f7b801' : '#fff'} 
            style={{ marginBottom: 24, cursor: 'pointer' }} 
            title="Dashboard" 
          />
        </Link>
        <Link to="/subscribers" style={{ textDecoration: 'none' }}>
          <FiUsers 
            size={28} 
            color={isActive('/subscribers') ? '#f7b801' : '#fff'} 
            style={{ marginBottom: 24, cursor: 'pointer' }} 
            title="Subscribers" 
          />
        </Link>
        <button
          onClick={handleAddSubscriptionClick}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            margin: 0,
            cursor: 'pointer',
            marginBottom: 24
          }}
          title="Add Subscription"
        >
          <FiPlusSquare size={28} color="#fff" />
        </button>
        <Link to="/charts" style={{ textDecoration: 'none' }}>
          <FiBarChart2 
            size={28} 
            color={isActive('/charts') ? '#f7b801' : '#fff'} 
            style={{ marginBottom: 24, cursor: 'pointer' }} 
            title="Browse Charts" 
          />
        </Link>
        <Link to="/my-orders" style={{ textDecoration: 'none' }}>
          <FiShoppingBag 
            size={28} 
            color={isActive('/my-orders') ? '#f7b801' : '#fff'} 
            style={{ marginBottom: 24, cursor: 'pointer' }} 
            title="My Orders" 
          />
        </Link>
        <Link to="/admin/chart-orders" style={{ textDecoration: 'none' }}>
          <FiClipboard 
            size={28} 
            color={isActive('/admin/chart-orders') ? '#f7b801' : '#fff'} 
            style={{ marginBottom: 24, cursor: 'pointer' }} 
            title="Manage Orders" 
          />
        </Link>
        <FiSettings size={28} color="#fff" style={{ marginBottom: 24, cursor: 'pointer' }} title="Settings" />
      </div>
      <div style={{ marginTop: 'auto', marginBottom: 16 }}>
        <button onClick={() => dispatch(logout())} style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Logout">
          <FiLogOut size={28} color="#f7b801" />
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
