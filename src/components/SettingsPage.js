import React from 'react';
import { useSelector } from 'react-redux';
import Card from './ui/Card';

export default function SettingsPage() {
  const user = useSelector(state => state.auth.user);
  const isAdmin = user?.email === 'ais@caa.co.ug';

  return (
    <div style={{ padding: '24px 32px 48px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--color-text)' }}>Settings</h2>
          <p style={{ marginTop: 8, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Manage your account and application preferences.
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
            Preferences
          </h3>
          <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Theme and notification preferences can be configured here in future. For now this is a placeholder page so the
            Settings button takes you somewhere meaningful.
          </p>
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

