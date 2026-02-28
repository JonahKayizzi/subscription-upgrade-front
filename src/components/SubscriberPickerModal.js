import React, { useState } from 'react';
import Modal from './ui/Modal';
import { useGetSubscribersQuery } from '../api/apiSlice';

export default function SubscriberPickerModal({ isOpen, onClose, onSelect }) {
  const { data, isLoading, error } = useGetSubscribersQuery();
  const [search, setSearch] = useState('');

  const subscribers = data?.subscribers || [];
  const filtered = subscribers.filter(sub =>
    sub.sub_name?.toLowerCase().includes(search.toLowerCase()) ||
    (sub.sub_email && sub.sub_email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ minWidth: '350px', maxWidth: '400px', padding: '2rem' }}>
        <h3 className="picker-modal-title">Select Subscriber</h3>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="picker-modal-input"
        />
        {isLoading && <div style={{ color: 'var(--color-text)' }}>Loading...</div>}
        {error && <div style={{ color: 'var(--color-error)' }}>Error loading subscribers.</div>}
        <ul className="picker-modal-list scrollbar-thin">
          {filtered.map(sub => (
            <li
              key={sub.sub_id}
              onClick={() => onSelect(sub)}
              className="picker-modal-item"
            >
              <div className="picker-modal-item-name">{sub.sub_name}</div>
              <div className="picker-modal-item-email">{sub.sub_email}</div>
            </li>
          ))}
          {filtered.length === 0 && !isLoading && (
            <li style={{ padding: '0.75rem 0', color: 'var(--color-text-muted)' }}>No subscribers found.</li>
          )}
        </ul>
      </div>
    </Modal>
  );
}
