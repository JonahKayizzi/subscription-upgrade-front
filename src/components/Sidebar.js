import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { FiHome, FiUsers, FiPlusSquare, FiSettings, FiLogOut, FiBarChart2, FiShoppingBag, FiClipboard, FiFileText } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SubscriberPickerModal from './SubscriberPickerModal';

export default function Sidebar() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [pickerOpen, setPickerOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isAdmin = user?.email === 'ais@caa.co.ug';

  const handleAddSubscriptionClick = () => setPickerOpen(true);
  const handleSubscriberSelect = (subscriber) => {
    setPickerOpen(false);
    navigate(`/subscriber/${subscriber.sub_id}/add-subscription`);
  };

  const iconColor = (path) => (isActive(path) ? '#f7b801' : '#fff');

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" alt="Logo" />
      </div>
      <div className="sidebar-nav">
        <Link to="/"><FiHome size={28} color={iconColor('/')} title="Dashboard" /></Link>
        {isAdmin && (
          <>
            <Link to="/subscribers"><FiUsers size={28} color={iconColor('/subscribers')} title="Subscribers" /></Link>
            <button type="button" onClick={handleAddSubscriptionClick} title="Add Subscription">
              <FiPlusSquare size={28} color="#fff" />
            </button>
          </>
        )}
        <Link to="/charts"><FiBarChart2 size={28} color={iconColor('/charts')} title="Browse Charts" /></Link>
        <Link to="/my-orders"><FiShoppingBag size={28} color={iconColor('/my-orders')} title="My Orders" /></Link>
        {isAdmin && (
          <>
            <Link to="/admin/chart-orders"><FiClipboard size={28} color={iconColor('/admin/chart-orders')} title="Manage All Orders" /></Link>
            <Link to="/admin/invoice-requests"><FiFileText size={28} color={iconColor('/admin/invoice-requests')} title="Invoice Requests" /></Link>
            <Link to="/admin/charts"><FiBarChart2 size={28} color={iconColor('/admin/charts')} title="Manage Charts" /></Link>
          </>
        )}
        <FiSettings size={28} color="#fff" title="Settings" />
      </div>
      <div className="sidebar-logout">
        <button type="button" onClick={() => dispatch(logout())} title="Logout">
          <FiLogOut size={28} />
        </button>
      </div>
      <SubscriberPickerModal isOpen={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={handleSubscriberSelect} />
    </div>
  );
}
