import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { checkSessionTimeout } from '../utils/sessionUtils';

export default function SessionStatus() {
  const token = useSelector(state => state.auth.token);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    if (!token) return;

    const updateTimeRemaining = () => {
      const tokenTimestamp = localStorage.getItem('tokenTimestamp');
      if (!tokenTimestamp) return;

      const now = Date.now();
      const tokenAge = now - parseInt(tokenTimestamp);
      const maxAge = 8 * 60 * 60 * 1000; // 8 hours
      const remaining = maxAge - tokenAge;

      if (remaining <= 0) {
        setTimeRemaining('Session expired');
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [token]);

  if (!token || checkSessionTimeout(token)) {
    return null;
  }

  return (
    <div style={{
      fontSize: '12px',
      color: 'var(--color-text-secondary)',
      padding: '4px 8px',
      borderRadius: '4px',
      background: 'var(--color-bg-secondary)',
      marginRight: '8px'
    }}>
      Session: {timeRemaining}
    </div>
  );
} 