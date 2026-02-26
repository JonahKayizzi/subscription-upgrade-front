import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from './ui/Card';
import { useChangePasswordMutation } from '../api/apiSlice';

const NOTIFICATION_PREFS_KEY = 'aip_notification_prefs';

export default function SettingsPage() {
  const user = useSelector(state => state.auth.user);
  const isAdmin = user?.email === 'ais@caa.co.ug';

  const [notificationPrefs, setNotificationPrefs] = useState({
    emailRenewals: true,
    emailInvoices: true,
    emailChartOrders: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changePassword, { isLoading: isChanging }] = useChangePasswordMutation();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTIFICATION_PREFS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setNotificationPrefs(prev => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const togglePref = (key) => {
    setNotificationPrefs(prev => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password should be at least 6 characters long.');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      setPasswordSuccess('Password updated successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err?.data?.error || 'Unable to change password. Please check your current password and try again.');
    }
  };

  return (
    <div style={{ padding: '24px 32px 48px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--color-text)' }}>Settings</h2>
          <p style={{ marginTop: 8, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Manage your account, notifications, and preferences.
          </p>
        </div>

        <Card style={{ padding: 24 }}>
          <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: '1.1rem', color: 'var(--color-text)' }}>
            Account
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--color-text-muted)', marginBottom: 4 }}>Name</div>
              <div style={{ fontSize: 14 }}>{user?.name || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--color-text-muted)', marginBottom: 4 }}>Email</div>
              <div style={{ fontSize: 14 }}>{user?.email}</div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: 24 }}>
          <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: '1.1rem', color: 'var(--color-text)' }}>
            Notifications
          </h3>
          <p style={{ marginTop: 0, marginBottom: 16, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Choose which email updates you want to receive. These preferences are stored in your browser for now.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.95rem' }}>
              <input
                type="checkbox"
                checked={notificationPrefs.emailRenewals}
                onChange={() => togglePref('emailRenewals')}
              />
              <span>Email me about subscription renewals and expiries</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.95rem' }}>
              <input
                type="checkbox"
                checked={notificationPrefs.emailInvoices}
                onChange={() => togglePref('emailInvoices')}
              />
              <span>Notify me when invoices are ready or updated</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.95rem' }}>
              <input
                type="checkbox"
                checked={notificationPrefs.emailChartOrders}
                onChange={() => togglePref('emailChartOrders')}
              />
              <span>Send updates about my chart orders</span>
            </label>
          </div>
        </Card>

        <Card style={{ padding: 24 }}>
          <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: '1.1rem', color: 'var(--color-text)' }}>
            Change password
          </h3>
          {passwordError && (
            <div style={{ marginBottom: 10, color: 'var(--color-error)', fontSize: '0.9rem' }}>
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div style={{ marginBottom: 10, color: 'var(--color-success)', fontSize: '0.9rem' }}>
              {passwordSuccess}
            </div>
          )}
          <form onSubmit={handleChangePassword} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                Current password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordInputChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                New password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordInputChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                Confirm new password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordInputChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}
              />
            </div>
            <div style={{ alignSelf: 'flex-end', justifySelf: 'flex-end' }}>
              <button
                type="submit"
                disabled={isChanging}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--color-accent2)',
                  color: '#fff',
                  fontWeight: 500,
                  cursor: isChanging ? 'default' : 'pointer',
                  opacity: isChanging ? 0.7 : 1,
                }}
              >
                {isChanging ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </Card>

        {isAdmin && (
          <Card style={{ padding: 24 }}>
            <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: '1.1rem', color: 'var(--color-text)' }}>
              Admin options
            </h3>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              This area can host admin-only configuration such as system-wide defaults, contact emails, and operational
              thresholds.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

