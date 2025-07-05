import React, { useState } from 'react';
import { useGetSubscriptionsQuery, useDeleteSubscriptionMutation } from '../api/apiSlice';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';

export default function SubscriptionsTable() {
  const { data, isLoading, error } = useGetSubscriptionsQuery();
  const [deleteSubscription] = useDeleteSubscriptionMutation();
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) return <Card>Loading subscriptions...</Card>;
  if (error) return <Card>Error loading subscriptions.</Card>;

  const handleView = (sub) => {
    setSelected(sub);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      await deleteSubscription(id);
    }
  };

  return (
    <Card style={{ overflowX: 'auto' }}>
      <h3>Subscriptions</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
        <thead>
          <tr style={{ background: 'rgba(162,89,247,0.08)' }}>
            <th style={{ padding: 8, textAlign: 'left' }}>Type</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Status</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Start Date</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Expiry Date</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Amount</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Subscriber ID</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(sub => (
            <tr key={sub.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: 8 }}>{sub.sub_type}</td>
              <td style={{ padding: 8 }}>{sub.sub_status === 1 ? 'Active' : sub.sub_status === 0 ? 'Inactive' : sub.sub_status}</td>
              <td style={{ padding: 8 }}>{sub.sub_start_date ? new Date(sub.sub_start_date).toLocaleDateString() : ''}</td>
              <td style={{ padding: 8 }}>{sub.sub_exp_date ? new Date(sub.sub_exp_date).toLocaleDateString() : ''}</td>
              <td style={{ padding: 8 }}>{sub.sub_amount}</td>
              <td style={{ padding: 8 }}>{sub.subscriber_id}</td>
              <td style={{ padding: 8, display: 'flex', gap: 8 }}>
                <Button style={{ padding: '4px 12px', fontSize: 14 }} onClick={() => handleView(sub)}>View</Button>
                <Button style={{ padding: '4px 12px', fontSize: 14, background: 'var(--color-error)', color: '#fff' }} onClick={() => handleDelete(sub.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {selected && (
          <div>
            <h3>{selected.sub_type} Subscription</h3>
            <div><b>Status:</b> {selected.sub_status === 1 ? 'Active' : selected.sub_status === 0 ? 'Inactive' : selected.sub_status}</div>
            <div><b>Start Date:</b> {selected.sub_start_date ? new Date(selected.sub_start_date).toLocaleDateString() : ''}</div>
            <div><b>Expiry Date:</b> {selected.sub_exp_date ? new Date(selected.sub_exp_date).toLocaleDateString() : ''}</div>
            <div><b>Amount:</b> {selected.sub_amount}</div>
            <div><b>Subscriber ID:</b> {selected.subscriber_id}</div>
            <div><b>Receipt No:</b> {selected.receipt_no}</div>
            <div><b>Invoice No:</b> {selected.invoice_no}</div>
          </div>
        )}
      </Modal>
    </Card>
  );
} 