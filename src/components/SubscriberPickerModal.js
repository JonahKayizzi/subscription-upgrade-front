import React, { useState } from 'react';
import Modal from './ui/Modal';
import { useGetSubscribersQuery } from '../api/apiSlice';
import styled from 'styled-components';

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  margin-bottom: 16px;
  background: var(--color-bg-card);
  color: var(--color-text);
`;

const SubscriberList = styled.ul`
  list-style: none;
  padding: 0;
  max-height: 320px;
  overflow-y: auto;
  margin: 0;
`;

const SubscriberItem = styled.li`
  padding: 12px 16px;
  border-radius: 6px;
  background: var(--color-bg-card);
  color: var(--color-text);
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: var(--color-accent2);
    color: #fff;
  }
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.3rem;
  color: var(--color-text);
`;

const SubscriberPickerModal = ({ isOpen, onClose, onSelect }) => {
  const { data, isLoading, error } = useGetSubscribersQuery();
  const [search, setSearch] = useState('');

  const subscribers = data?.subscribers || [];
  const filtered = subscribers.filter(sub =>
    sub.sub_name.toLowerCase().includes(search.toLowerCase()) ||
    (sub.sub_email && sub.sub_email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ padding: 32, minWidth: 350, maxWidth: 400 }}>
        <ModalTitle>Select Subscriber</ModalTitle>
        <SearchInput
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {isLoading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>Error loading subscribers.</div>}
        <SubscriberList>
          {filtered.map(sub => (
            <SubscriberItem key={sub.sub_id} onClick={() => onSelect(sub)}>
              <div style={{ fontWeight: 600 }}>{sub.sub_name}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{sub.sub_email}</div>
            </SubscriberItem>
          ))}
          {filtered.length === 0 && !isLoading && <li style={{ color: 'var(--color-text-muted)', padding: 12 }}>No subscribers found.</li>}
        </SubscriberList>
      </div>
    </Modal>
  );
};

export default SubscriberPickerModal; 