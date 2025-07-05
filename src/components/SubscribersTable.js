import React, { useState } from 'react';
import { useGetSubscribersQuery, useSearchSubscribersQuery, useDeleteSubscriberMutation, useGetSubscriberQuery, useUpdateSubscriberMutation } from '../api/apiSlice';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import styled from 'styled-components';
import { Line, Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBox, FaInfoCircle, FaUserTie, FaCalendarAlt, FaRegBuilding, FaFileContract } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AddSubscriberForm from './AddSubscriberForm';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to format dates in a user-friendly way
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-right: 4px;
  background: ${props => {
    switch (props.status) {
      case 'active': return 'rgba(67, 233, 123, 0.2)';
      case 'expired': return 'rgba(255, 77, 79, 0.2)';
      case 'inactive': return 'rgba(162, 89, 247, 0.2)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return 'var(--color-success)';
      case 'expired': return 'var(--color-error)';
      case 'inactive': return 'var(--color-accent2)';
      default: return 'var(--color-text-muted)';
    }
  }};
`;

const StatusContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Container = styled.div`
  padding: 32px 32px 0 32px;
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`;

const MainContent = styled.div`
  flex: 2;
  min-width: 320px;
`;

const Sidebar = styled.div`
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StatCard = styled.div`
  background: var(--color-bg-card);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: var(--color-accent2);
  margin: 8px 0;
`;

const StatLabel = styled.div`
  color: var(--color-text-muted);
  font-size: 14px;
`;

const ActionButton = styled(Button)`
  width: 100%;
  margin-top: 12px;
  padding: 12px 16px;
  background: var(--color-bg-card);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-accent2);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(162, 89, 247, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:first-of-type {
    margin-top: 0;
  }
`;

const ActionIcon = styled.span`
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotificationItem = styled.div`
  padding: 12px;
  background: var(--color-bg-card);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  margin-bottom: 8px;
  font-size: 14px;
`;

const ChartContainer = styled.div`
  background: var(--color-bg-card);
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
`;

const RevenueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 8px;
`;

const RevenueItem = styled.div`
  background: var(--color-bg);
  padding: 8px;
  border-radius: 4px;
  font-size: 0.875rem;
`;

const ModalContentWrapper = styled.div`
  padding: 0;
  max-width: 85vw;
  background: var(--color-background);
  border-radius: 12px;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 20px 32px;
  background: var(--color-background-card);
  border-bottom: 1px solid var(--color-border);
  h3 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-text);
  }
  p {
    margin: 4px 0 0;
    color: var(--color-text-muted);
  }
`;

const ModalBody = styled.div`
  display: flex;
  background: var(--color-background);
`;

const LeftPane = styled.div`
  flex: 1;
  min-width: 400px;
  padding: 24px 32px;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
`;

const RightPane = styled.div`
  flex: 2;
  padding: 24px 32px;
  overflow-y: auto;
  max-height: 70vh;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  flex-grow: 1;
`;

const FormGroup = styled.div`
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-text-muted);
    margin-bottom: 8px;
  }
  input, select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-background-card);
    color: var(--color-text);
    font-size: 1rem;
    &:focus {
      outline: none;
      border-color: var(--color-accent2);
      box-shadow: 0 0 0 2px rgba(162, 89, 247, 0.2);
    }
    &:disabled {
      background: var(--color-bg-muted);
      cursor: not-allowed;
    }
  }
`;

const SaveButtonContainer = styled.div`
  padding-top: 24px;
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--color-border);
`;

const SectionTitle = styled.h4`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CurrentSubscriptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const SubscriptionItem = styled.div`
  background: var(--color-background-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;

  p {
    margin: 4px 0;
    font-size: 0.9rem;
    color: var(--color-text-muted);
    strong {
      color: var(--color-text);
    }
  }
`;

const SubscriptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  h6 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text);
  }
`;

const SubscriptionActions = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 8px;
  button {
    width: 100%;
    padding: 6px 10px;
  }
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid var(--color-border);
    font-size: 0.9rem;
  }
  thead th {
    font-weight: 600;
    color: var(--color-text);
    background: var(--color-background-card);
  }
  tbody tr:hover {
    background: var(--color-background-card);
  }
`;

export default function SubscribersTable() {
  const globalSearchQuery = useSelector(state => state.search.query);
  const { data: allData, isLoading: isLoadingAll, error: allError } = useGetSubscribersQuery(undefined, { skip: globalSearchQuery !== '' });
  const { data: searchData, isLoading: isLoadingSearch, error: searchError } = useSearchSubscribersQuery(globalSearchQuery, {
    skip: globalSearchQuery === ''
  });
  const [deleteSubscriber] = useDeleteSubscriberMutation();
  const [updateSubscriber, { isLoading: isUpdatingSubscriber }] = useUpdateSubscriberMutation();
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [showEaipCredentials, setShowEaipCredentials] = useState(false);
  const [isEditingSubscriber, setIsEditingSubscriber] = useState(false);
  const [editedSubscriber, setEditedSubscriber] = useState(null);
  const { data: subscriberDetails, isLoading: isLoadingDetails, refetch } = useGetSubscriberQuery(selected?.sub_id, { skip: !selected });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (subscriberDetails) {
      setEditedSubscriber(subscriberDetails);
    }
  }, [subscriberDetails]);

  if (isLoadingAll && globalSearchQuery === '') return <Card>Loading subscribers...</Card>;
  if (isLoadingSearch && globalSearchQuery !== '') return <Card>Searching subscribers...</Card>;
  if (allError || searchError) return <Card>Error loading subscribers.</Card>;

  const data = globalSearchQuery !== '' ? searchData : allData;
  const subscribers = data?.subscribers || [];
  const lags = data?.lags || [];
  const revenue = data?.revenue || { total: 0, by_type: {}, monthly: [] };

  const sortedSubscribers = [...subscribers].sort((a, b) => 
    a.sub_name.localeCompare(b.sub_name)
  );

  const currentYear = new Date().getFullYear();
  const stats = {
    total: subscribers.length,
    active: subscribers.filter(sub => 
      Object.values(sub.subscription_status).some(status => status === 'active')
    ).length,
    expired: subscribers.filter(sub => 
      Object.values(sub.subscription_status).some(status => status === 'expired')
    ).length,
    inactive: subscribers.filter(sub => 
      Object.values(sub.subscription_status).every(status => status === 'inactive' || status === 'none')
    ).length,
    newThisYear: subscribers.filter(sub => 
      new Date(sub.sub_add_date).getFullYear() === currentYear
    ).length,
    revenue: {
      total: revenue.total,
      eAIP: revenue.by_type.eAIP || 0,
      CD: revenue.by_type.CD || 0,
      Paper: revenue.by_type.Paper || 0
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueData = {
    labels: months,
    datasets: [
      {
        label: 'eAIP',
        data: revenue.monthly.map(m => m.eAIP),
        backgroundColor: 'rgba(67, 233, 123, 0.5)',
      },
      {
        label: 'CD',
        data: revenue.monthly.map(m => m.CD),
        backgroundColor: 'rgba(162, 89, 247, 0.5)',
      },
      {
        label: 'Paper',
        data: revenue.monthly.map(m => m.Paper),
        backgroundColor: 'rgba(255, 77, 79, 0.5)',
      }
    ]
  };

  const top5Dormant = [...lags].sort((a, b) => b.lag_days - a.lag_days).slice(0, 5);

  const chartLags = lags.filter(l => l.lag_days <= 365);
  const lagsBarData = {
    labels: chartLags.map(l => l.sub_name),
    datasets: [
      {
        label: 'Lag (days)',
        data: chartLags.map(l => l.lag_days),
        backgroundColor: 'rgba(255, 77, 79, 0.7)',
        borderRadius: 6,
      }
    ]
  };

  const lagsBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Subscription Lags (days)', color: '#fff', font: { size: 16 } },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        ticks: { color: '#fff', font: { size: 12 } },
        grid: { color: 'rgba(255,255,255,0.08)' },
        beginAtZero: true,
      },
      y: {
        ticks: { display: false },
        grid: { color: 'rgba(255,255,255,0.08)' },
      }
    },
    animation: {
      x: { duration: 0 },
      y: { duration: 0 }
    }
  };

  const handleView = (subscriber) => {
    setSelected(subscriber);
    setModalOpen(true);
    setShowEaipCredentials(false);
    setIsEditingSubscriber(false);
  };

  const handleEditSubscriber = () => {
    setIsEditingSubscriber(true);
  };

  const handleSaveSubscriber = async () => {
    if (editedSubscriber) {
      try {
        await updateSubscriber({ id: editedSubscriber.sub_id, ...editedSubscriber }).unwrap();
        setIsEditingSubscriber(false);
        refetch();
      } catch (err) {
        console.error('Failed to update subscriber:', err);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditingSubscriber(false);
    setEditedSubscriber(subscriberDetails);
  };

  const handleSubscriberDetailChange = (e) => {
    const { name, value } = e.target;
    setEditedSubscriber(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      try {
        await deleteSubscriber(id).unwrap();
      } catch (err) {
        console.error('Failed to delete subscriber:', err);
      }
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--color-text)'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'var(--color-text)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'var(--color-text)'
        }
      }
    }
  };

  return (
    <Container>
      <MainContent>
        <Card>
          <h3 style={{ marginBottom: 24 }}>Subscribers</h3>
          <Card style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{ background: 'rgba(162,89,247,0.08)' }}>
                  <th style={{ padding: 12, textAlign: 'left' }}>Name</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Email</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Contact</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Subscription Status</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedSubscribers.map(sub => (
                  <tr key={sub.sub_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 12, textAlign: 'left' }}>{sub.sub_name}</td>
                    <td style={{ padding: 12, textAlign: 'left' }}>{sub.sub_email}</td>
                    <td style={{ padding: 12, textAlign: 'left' }}>{sub.sub_telephone}</td>
                    <td style={{ padding: 12, textAlign: 'left' }}>
                      <StatusContainer>
                        <StatusBadge status={sub.subscription_status.eAIP}>eAIP</StatusBadge>
                        <StatusBadge status={sub.subscription_status.CD}>CD</StatusBadge>
                        <StatusBadge status={sub.subscription_status.Paper}>Paper</StatusBadge>
                      </StatusContainer>
                    </td>
                    <td style={{ padding: 12, textAlign: 'left', display: 'flex', gap: 8 }}>
                      <Button style={{ padding: '4px 12px', fontSize: 14 }} onClick={() => handleView(sub)}>View</Button>
                      <Button style={{ padding: '4px 12px', fontSize: 14, background: 'var(--color-error)', color: '#fff' }} onClick={() => handleDelete(sub.sub_id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {subscribers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--color-text-muted)' }}>
                No subscribers found matching your search.
              </div>
            )}
          </Card>
        </Card>
      </MainContent>
      <Sidebar>
        <Card>
          <h4>Actions</h4>
          <ActionButton onClick={() => setAddModalOpen(true)}>
              <ActionIcon>+</ActionIcon>
              Add New Subscriber
            </ActionButton>
            <ActionButton>
              <ActionIcon>📋</ActionIcon>
              Print Dispatch List
            </ActionButton>
            <ActionButton>
              <ActionIcon>🏷️</ActionIcon>
              Print Mailing Labels
            </ActionButton>
            <ActionButton>
              <ActionIcon>📊</ActionIcon>
              Annual Subscription Report
            </ActionButton>
        </Card>

        <Card>
          <h4>Statistics</h4>
          <StatCard>
            <StatLabel>Active Subscribers</StatLabel>
            <StatValue>{stats.active}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>New Subscribers ({currentYear})</StatLabel>
            <StatValue>{stats.newThisYear}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Inactive Subscribers</StatLabel>
            <StatValue>{stats.inactive}</StatValue>
          </StatCard>
        </Card>

        <Card>
          <h4>Subscription Lags</h4>
          <ChartContainer>
            <Bar data={lagsBarData} options={lagsBarOptions} height={220} />
          </ChartContainer>
        </Card>

        <Card>
          <h4>Remove Dormant Subscribers</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {top5Dormant.length > 0 ? (top5Dormant.map(sub => (
              <li key={sub.sub_id || sub.sub_name} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'var(--color-text)' }}>{sub.sub_name} ({sub.lag_days} days)</span>
                <Button 
                  style={{ padding: '4px 10px', fontSize: 13, background: 'var(--color-error)', color: '#fff' }}
                  onClick={() => handleDelete(sub.sub_id)}
                >
                  Delete
                </Button>
              </li>
            ))) : (
              <li style={{ color: 'var(--color-text-muted)' }}>No dormant subscribers found.</li>
            )}
          </ul>
        </Card>

        <Card>
          <h4>Recent Notifications</h4>
          <NotificationItem>
            <div style={{ color: 'var(--color-error)' }}>3 subscriptions expired today</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>2 hours ago</div>
          </NotificationItem>
          <NotificationItem>
            <div style={{ color: 'var(--color-success)' }}>5 new subscriptions added</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>5 hours ago</div>
          </NotificationItem>
          <NotificationItem>
            <div style={{ color: 'var(--color-accent2)' }}>2 subscribers updated their information</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>1 day ago</div>
          </NotificationItem>
        </Card>

      </Sidebar>

      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <AddSubscriberForm onClose={() => setAddModalOpen(false)} />
      </Modal>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {isLoadingDetails ? (
          <ModalContentWrapper>Loading...</ModalContentWrapper>
        ) : subscriberDetails ? (
          <ModalContentWrapper>
            <ModalHeader>
              <h3>{subscriberDetails.sub_name}</h3>
              <p>Subscriber ID: {subscriberDetails.sub_id}</p>
            </ModalHeader>
            <ModalBody>
              <LeftPane>
                <FormGrid>
                  <FormGroup style={{ gridColumn: '1 / -1' }}>
                    <label><FaUser /> Name</label>
                    <input name="sub_name" value={editedSubscriber?.sub_name || ''} onChange={handleSubscriberDetailChange} />
                  </FormGroup>
                  <FormGroup>
                    <label><FaRegBuilding /> Category</label>
                    <select name="sub_category" value={editedSubscriber?.sub_category || ''} onChange={handleSubscriberDetailChange}>
                      <option value="Paying Subscribers">Paying Subscribers</option>
                      <option value="AIS of States">AIS of States</option>
                    </select>
                  </FormGroup>
                  <FormGroup>
                    <label><FaEnvelope /> Email</label>
                    <input type="email" name="sub_email" value={editedSubscriber?.sub_email || ''} onChange={handleSubscriberDetailChange} />
                  </FormGroup>
                  <FormGroup>
                    <label><FaPhone /> Phone</label>
                    <input name="sub_telephone" value={editedSubscriber?.sub_telephone || ''} onChange={handleSubscriberDetailChange} />
                  </FormGroup>
                  <FormGroup>
                    <label><FaMapMarkerAlt /> Address</label>
                    <input name="phy_address" value={editedSubscriber?.phy_address || ''} onChange={handleSubscriberDetailChange} />
                  </FormGroup>
                  <FormGroup>
                    <label><FaBox /> Box Number</label>
                    <input name="sub_box_number" value={editedSubscriber?.sub_box_number || ''} onChange={handleSubscriberDetailChange} />
                  </FormGroup>
                  <FormGroup>
                    <label><FaUserTie /> Contact Person</label>
                    <input name="sub_contact_per" value={editedSubscriber?.sub_contact_per || ''} onChange={handleSubscriberDetailChange} />
                  </FormGroup>
                  <FormGroup style={{ gridColumn: '1 / -1' }}>
                    <label><FaInfoCircle /> Other Contact Info</label>
                    <input name="sub_other_contact_info" value={editedSubscriber?.sub_other_contact_info || ''} onChange={handleSubscriberDetailChange} />
                  </FormGroup>
                  <FormGroup>
                    <label><FaCalendarAlt /> Added Date</label>
                    <input value={formatDate(subscriberDetails.sub_add_date)} disabled />
                  </FormGroup>
                </FormGrid>
                <SaveButtonContainer>
                  <Button 
                    style={{ padding: '10px 24px', fontSize: 14, background: 'var(--color-success)', color: '#fff' }}
                    onClick={handleSaveSubscriber}
                    disabled={isUpdatingSubscriber}
                  >
                    {isUpdatingSubscriber ? 'Saving...' : 'Update Subscriber Details'}
                  </Button>
                </SaveButtonContainer>
              </LeftPane>
              <RightPane>
                <ActionButton onClick={() => navigate(`/subscriber/${subscriberDetails.sub_id}/add-subscription`)} style={{ marginBottom: 24 }}>
                  <ActionIcon><FaFileContract /></ActionIcon>
                  Add Subscription
                </ActionButton>
                <SectionTitle>Current Subscriptions</SectionTitle>
                <CurrentSubscriptionsGrid>
                  <SubscriptionItem>
                    <SubscriptionHeader>
                      <h6>eAIP</h6>
                      <StatusBadge status={subscriberDetails.subscriptions.find(s => s.sub_type === 'eAIP')?.status || 'inactive'}>
                        {subscriberDetails.subscriptions.find(s => s.sub_type === 'eAIP')?.status || 'inactive'}
                      </StatusBadge>
                    </SubscriptionHeader>
                    {subscriberDetails.subscriptions.find(s => s.sub_type === 'eAIP') ? (
                    <>
                      <p><strong>Expiry:</strong> {formatDate(subscriberDetails.subscriptions.find(s => s.sub_type === 'eAIP').sub_exp_date)}</p>
                      <p><strong>Username:</strong> {subscriberDetails.subscriptions.find(s => s.sub_type === 'eAIP').eaip_user_name}</p>
                      <SubscriptionActions>
                        <Button onClick={() => navigate(`/subscriber/${subscriberDetails.sub_id}/edit-subscription/${subscriberDetails.subscriptions.find(s => s.sub_type === 'eAIP')?.id}`)}>Manage</Button>
                      </SubscriptionActions>
                    </> 
                    ) : ( <Button onClick={() => navigate(`/subscriber/${subscriberDetails.sub_id}/add-subscription?type=eAIP`)}>Add Subscription</Button> )}
                  </SubscriptionItem>
                  <SubscriptionItem>
                    <SubscriptionHeader>
                      <h6>CD</h6>
                      <StatusBadge status={subscriberDetails.subscriptions.find(s => s.sub_type === 'CD')?.status || 'inactive'}>
                        {subscriberDetails.subscriptions.find(s => s.sub_type === 'CD')?.status || 'inactive'}
                      </StatusBadge>
                    </SubscriptionHeader>
                    {subscriberDetails.subscriptions.find(s => s.sub_type === 'CD') ? (
                    <>
                      <p><strong>Expiry:</strong> {formatDate(subscriberDetails.subscriptions.find(s => s.sub_type === 'CD').sub_exp_date)}</p>
                      <p><strong>Delivery:</strong> {subscriberDetails.subscriptions.find(s => s.sub_type === 'CD').sub_delivery}</p>
                      <SubscriptionActions>
                        <Button onClick={() => navigate(`/subscriber/${subscriberDetails.sub_id}/edit-subscription/${subscriberDetails.subscriptions.find(s => s.sub_type === 'CD')?.id}`)}>Manage</Button>
                      </SubscriptionActions>
                    </> 
                    ) : ( <Button onClick={() => navigate(`/subscriber/${subscriberDetails.sub_id}/add-subscription?type=CD`)}>Add Subscription</Button> )}
                  </SubscriptionItem>
                  <SubscriptionItem>
                    <SubscriptionHeader>
                      <h6>Paper</h6>
                      <StatusBadge status={subscriberDetails.subscriptions.find(s => s.sub_type === 'Paper')?.status || 'inactive'}>
                        {subscriberDetails.subscriptions.find(s => s.sub_type === 'Paper')?.status || 'inactive'}
                      </StatusBadge>
                    </SubscriptionHeader>
                    {subscriberDetails.subscriptions.find(s => s.sub_type === 'Paper') ? (
                    <>
                      <p><strong>Expiry:</strong> {formatDate(subscriberDetails.subscriptions.find(s => s.sub_type === 'Paper').sub_exp_date)}</p>
                      <p><strong>Delivery:</strong> {subscriberDetails.subscriptions.find(s => s.sub_type === 'Paper').sub_delivery}</p>
                      <SubscriptionActions>
                        <Button onClick={() => navigate(`/subscriber/${subscriberDetails.sub_id}/edit-subscription/${subscriberDetails.subscriptions.find(s => s.sub_type === 'Paper')?.id}`)}>Manage</Button>
                      </SubscriptionActions>
                    </> 
                    ) : ( <Button onClick={() => navigate(`/subscriber/${subscriberDetails.sub_id}/add-subscription?type=Paper`)}>Add Subscription</Button> )}
                  </SubscriptionItem>
                </CurrentSubscriptionsGrid>
                <SectionTitle>Subscription History</SectionTitle>
                <HistoryTable>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Type</th>
                      <th>Start Date</th>
                      <th>Expiry Date</th>
                      <th>Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriberDetails.subscriptions.length > 0 ? (
                      [...subscriberDetails.subscriptions].sort((a, b) => new Date(b.sub_exp_date) - new Date(a.sub_exp_date)).map(sub => (
                        <tr key={sub.id}>
                          <td><StatusBadge status={sub.status}>{sub.status}</StatusBadge></td>
                          <td>{sub.sub_type}</td>
                          <td>{formatDate(sub.sub_start_date)}</td>
                          <td>{formatDate(sub.sub_exp_date)}</td>
                          <td>${sub.sub_amount?.toLocaleString()}</td>
                          <td>
                            <Button style={{ padding: '4px 12px', fontSize: 13 }} onClick={() => navigate(`/subscriber/${subscriberDetails.sub_id}/edit-subscription/${sub.id}`)}>
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" style={{ textAlign: 'center' }}>No history</td></tr>
                    )}
                  </tbody>
                </HistoryTable>
              </RightPane>
            </ModalBody>
          </ModalContentWrapper>
        ) : (
          <ModalContentWrapper>Error loading details.</ModalContentWrapper>
        )}
      </Modal>
    </Container>
  );
} 