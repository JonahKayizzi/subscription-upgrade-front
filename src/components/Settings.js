import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Card from './ui/Card';
import Modal from './ui/Modal';
import styled from 'styled-components';
import { FiSettings, FiUser, FiMail, FiLock, FiBell, FiDatabase, FiShield, FiEye, FiEyeOff, FiX, FiCheck, FiDownload } from 'react-icons/fi';
import { useChangePasswordMutation, useGetUserSettingsQuery, useUpdateUserSettingsMutation, useExportDataMutation } from '../api/apiSlice';
import { exportAnnualSubscriptionReport } from '../utils/excelExport';

const SettingsContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;


const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
`;

const SettingsTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
`;

const SettingsSection = styled(Card)`
  margin-bottom: 24px;
  padding: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SettingName = styled.span`
  font-weight: 600;
  color: var(--color-text);
  font-size: 1rem;
`;

const SettingDescription = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-muted);
`;

const SettingControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.3s;
    border-radius: 24px;
    
    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
  }
  
  input:checked + .slider {
    background-color: var(--color-accent);
  }
  
  input:checked + .slider:before {
    transform: translateX(26px);
  }
`;

const Button = styled.button`
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InfoText = styled.div`
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-style: italic;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 500px;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
`;

const PasswordInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-card);
  color: var(--color-text);
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px rgba(247, 184, 1, 0.1);
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: var(--color-text);
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 0.875rem;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const CancelButton = styled(Button)`
  background: var(--color-bg-card);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  
  &:hover {
    background: var(--color-border);
  }
`;

const SuccessToast = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #10b981;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ErrorToast = styled(SuccessToast)`
  background: var(--color-error);
`;

export default function Settings() {
  const user = useSelector(state => state.auth.user);
  const isAdmin = user?.role === 'ADMIN';
  
  // Load user settings from backend
  const { data: settingsData, isLoading: isLoadingSettings } = useGetUserSettingsQuery(undefined, {
    skip: !user?.email
  });
  
  const [updateSettings, { isLoading: isUpdatingSettings }] = useUpdateUserSettingsMutation();
  
  // Local state for settings (will be synced with backend)
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  
  // Toast messages
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success'); // 'success' or 'error'
  
  // Export data
  const [exportData, { isLoading: isExportingData }] = useExportDataMutation();
  const [isExporting, setIsExporting] = useState(false);
  
  // Change password modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  
  // Sync settings from backend when loaded
  useEffect(() => {
    if (settingsData) {
      setNotifications(settingsData.notifications ?? true);
      setEmailAlerts(settingsData.emailAlerts ?? true);
      setTwoFactorAuth(settingsData.twoFactorAuth ?? false);
      setAutoBackup(settingsData.autoBackup ?? false);
    }
  }, [settingsData]);
  
  // Show toast message
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };
  
  // Handle settings toggle changes
  const handleNotificationsChange = async (checked) => {
    setNotifications(checked);
    try {
      await updateSettings({ notifications: checked }).unwrap();
      showToast('Notifications setting updated successfully');
    } catch (err) {
      setNotifications(!checked); // Revert on error
      showToast(err?.data?.error || 'Failed to update notifications setting', 'error');
    }
  };
  
  const handleEmailAlertsChange = async (checked) => {
    setEmailAlerts(checked);
    try {
      await updateSettings({ emailAlerts: checked }).unwrap();
      showToast('Email alerts setting updated successfully');
    } catch (err) {
      setEmailAlerts(!checked); // Revert on error
      showToast(err?.data?.error || 'Failed to update email alerts setting', 'error');
    }
  };
  
  const handleTwoFactorAuthChange = async (checked) => {
    setTwoFactorAuth(checked);
    try {
      await updateSettings({ twoFactorAuth: checked }).unwrap();
      if (checked) {
        showToast('Two-factor authentication enabled. Full implementation coming soon.');
      } else {
        showToast('Two-factor authentication disabled');
      }
    } catch (err) {
      setTwoFactorAuth(!checked); // Revert on error
      showToast(err?.data?.error || 'Failed to update two-factor authentication setting', 'error');
    }
  };
  
  const handleAutoBackupChange = async (checked) => {
    setAutoBackup(checked);
    try {
      await updateSettings({ autoBackup: checked }).unwrap();
      if (checked) {
        showToast('Automatic backup enabled. Backups will be scheduled.');
      } else {
        showToast('Automatic backup disabled');
      }
    } catch (err) {
      setAutoBackup(!checked); // Revert on error
      showToast(err?.data?.error || 'Failed to update auto backup setting', 'error');
    }
  };
  
  // Handle export data
  const handleExportData = async () => {
    if (!isAdmin) {
      showToast('Export data is only available for administrators', 'error');
      return;
    }
    
    setIsExporting(true);
    try {
      const response = await exportData().unwrap();
      
      if (response) {
        // Use the export utility to create Excel file
        const result = exportAnnualSubscriptionReport(
          {
            year: new Date().getFullYear(),
            summary: response.summary || {},
            revenue: { total: 0 }, // Will be calculated if needed
            subs_by_type: [],
            expiring_buckets: { days_7: 0, days_30: 0, days_90: 0 }
          },
          response.subscribers || [],
          response.subscriptions || []
        );
        
        if (result.success) {
          showToast(`Data exported successfully: ${result.filename}`);
        } else {
          showToast(result.message || 'Failed to export data', 'error');
        }
      } else {
        showToast('No data received from server', 'error');
      }
    } catch (err) {
      console.error('Export error:', err);
      const errorMessage = err?.data?.error || err?.data?.details || err?.message || 'Failed to export data';
      showToast(errorMessage, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
  };

  const validatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return false;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return false;
    }

    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from current password');
      return false;
    }

    return true;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!validatePassword()) {
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword
      }).unwrap();
      
      setPasswordSuccess('Password changed successfully!');
      setTimeout(() => {
        handleClosePasswordModal();
      }, 2000);
    } catch (err) {
      setPasswordError(err?.data?.error || 'Failed to change password. Please try again.');
    }
  };

  return (
    <SettingsContainer>
      {toastMessage && (
        toastType === 'success' ? (
          <SuccessToast key="success">
            <FiCheck size={18} />
            {toastMessage}
          </SuccessToast>
        ) : (
          <ErrorToast key="error">
            <FiX size={18} />
            {toastMessage}
          </ErrorToast>
        )
      )}
      
      <SettingsHeader>
        <FiSettings size={32} color="var(--color-accent)" />
        <SettingsTitle>Settings</SettingsTitle>
      </SettingsHeader>

      <SettingsSection>
        <SectionTitle>
          <FiUser size={20} />
          Account Information
        </SectionTitle>
        <SettingItem>
          <SettingLabel>
            <SettingName>Email Address</SettingName>
            <SettingDescription>Your account email address</SettingDescription>
          </SettingLabel>
          <InfoText>{user?.email || 'N/A'}</InfoText>
        </SettingItem>
        <SettingItem>
          <SettingLabel>
            <SettingName>Name</SettingName>
            <SettingDescription>Your display name</SettingDescription>
          </SettingLabel>
          <InfoText>{user?.name || user?.email || 'N/A'}</InfoText>
        </SettingItem>
        <SettingItem>
          <SettingLabel>
            <SettingName>Account Type</SettingName>
            <SettingDescription>Your account role and permissions</SettingDescription>
          </SettingLabel>
          <InfoText>{isAdmin ? 'Administrator' : 'Subscriber'}</InfoText>
        </SettingItem>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FiBell size={20} />
          Notifications
        </SectionTitle>
        <SettingItem>
          <SettingLabel>
            <SettingName>Enable Notifications</SettingName>
            <SettingDescription>Receive in-app notifications</SettingDescription>
          </SettingLabel>
          <SettingControl>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => handleNotificationsChange(e.target.checked)}
                disabled={isLoadingSettings || isUpdatingSettings}
              />
              <span className="slider"></span>
            </ToggleSwitch>
          </SettingControl>
        </SettingItem>
        <SettingItem>
          <SettingLabel>
            <SettingName>Email Alerts</SettingName>
            <SettingDescription>Receive email notifications for important events</SettingDescription>
          </SettingLabel>
          <SettingControl>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => handleEmailAlertsChange(e.target.checked)}
                disabled={isLoadingSettings || isUpdatingSettings}
              />
              <span className="slider"></span>
            </ToggleSwitch>
          </SettingControl>
        </SettingItem>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FiShield size={20} />
          Security
        </SectionTitle>
        <SettingItem>
          <SettingLabel>
            <SettingName>Two-Factor Authentication</SettingName>
            <SettingDescription>Add an extra layer of security to your account</SettingDescription>
          </SettingLabel>
          <SettingControl>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => handleTwoFactorAuthChange(e.target.checked)}
                disabled={isLoadingSettings || isUpdatingSettings}
              />
              <span className="slider"></span>
            </ToggleSwitch>
          </SettingControl>
        </SettingItem>
        <SettingItem>
          <SettingLabel>
            <SettingName>Change Password</SettingName>
            <SettingDescription>Update your account password</SettingDescription>
          </SettingLabel>
          <SettingControl>
            <Button onClick={handleOpenPasswordModal}>Change Password</Button>
          </SettingControl>
        </SettingItem>
      </SettingsSection>

      {isAdmin && (
        <SettingsSection>
          <SectionTitle>
            <FiDatabase size={20} />
            Data Management
          </SectionTitle>
          <SettingItem>
            <SettingLabel>
              <SettingName>Automatic Backup</SettingName>
              <SettingDescription>Automatically backup data on a schedule</SettingDescription>
            </SettingLabel>
            <SettingControl>
              <ToggleSwitch>
                <input
                  type="checkbox"
                  checked={autoBackup}
                  onChange={(e) => handleAutoBackupChange(e.target.checked)}
                  disabled={isLoadingSettings || isUpdatingSettings}
                />
                <span className="slider"></span>
              </ToggleSwitch>
            </SettingControl>
          </SettingItem>
          <SettingItem>
            <SettingLabel>
              <SettingName>Export Data</SettingName>
              <SettingDescription>Download all data as a backup file</SettingDescription>
            </SettingLabel>
            <SettingControl>
              <Button onClick={handleExportData} disabled={isExporting}>
                {isExporting ? (
                  <>Exporting...</>
                ) : (
                  <>
                    <FiDownload style={{ marginRight: '8px' }} />
                    Export Data
                  </>
                )}
              </Button>
            </SettingControl>
          </SettingItem>
        </SettingsSection>
      )}

      <Modal isOpen={isPasswordModalOpen} onClose={handleClosePasswordModal}>
        <ModalContent>
          <ModalTitle>
            <FiLock size={24} />
            Change Password
          </ModalTitle>
          
          <form onSubmit={handleChangePassword}>
            <FormGroup>
              <Label>Current Password</Label>
              <PasswordInput>
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  disabled={isChangingPassword}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isChangingPassword}
                >
                  {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </PasswordToggle>
              </PasswordInput>
            </FormGroup>

            <FormGroup>
              <Label>New Password</Label>
              <PasswordInput>
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password (min. 6 characters)"
                  disabled={isChangingPassword}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isChangingPassword}
                >
                  {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </PasswordToggle>
              </PasswordInput>
            </FormGroup>

            <FormGroup>
              <Label>Confirm New Password</Label>
              <PasswordInput>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  disabled={isChangingPassword}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isChangingPassword}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </PasswordToggle>
              </PasswordInput>
            </FormGroup>

            {passwordError && (
              <ErrorMessage>
                <FiX size={16} />
                {passwordError}
              </ErrorMessage>
            )}

            {passwordSuccess && (
              <SuccessMessage>
                <FiCheck size={16} />
                {passwordSuccess}
              </SuccessMessage>
            )}

            <ButtonGroup>
              <CancelButton type="button" onClick={handleClosePasswordModal} disabled={isChangingPassword}>
                Cancel
              </CancelButton>
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </Button>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>
    </SettingsContainer>
  );
}
