import React, { useState, useRef } from 'react';
import { useGetInvoiceRequestsQuery, useUploadInvoiceMutation } from '../api/apiSlice';
import Card from './ui/Card';
import Button from './ui/Button';
import { FaFileInvoice, FaUpload, FaSpinner } from 'react-icons/fa';
import styled from 'styled-components';

const PageTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  align-items: center;
`;

const FilterBtn = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: ${(p) => (p.$active ? 'var(--color-accent)' : 'var(--color-bg)')};
  color: ${(p) => (p.$active ? 'var(--color-bg)' : 'var(--color-text)')};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  &:hover {
    opacity: 0.9;
  }
`;

const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-bg-card);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  background: rgba(247, 184, 1, 0.15);
  color: var(--color-accent);
  font-weight: 600;
  border-bottom: 1px solid var(--color-border);
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  vertical-align: middle;
`;

const Tr = styled.tr`
  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${(p) => (p.$status === 'uploaded' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(247, 184, 1, 0.2)')};
  color: ${(p) => (p.$status === 'uploaded' ? '#34d399' : '#f7b801')};
`;

const FileInput = styled.input`
  display: none;
`;

const SmallText = styled.span`
  font-size: 0.85rem;
  color: var(--color-text-muted);
`;

export default function InvoiceRequests() {
  const [filter, setFilter] = useState('all');
  const [uploadingId, setUploadingId] = useState(null);
  const fileInputRefs = useRef({});
  const { data, isLoading, refetch } = useGetInvoiceRequestsQuery(filter);
  const [uploadInvoice] = useUploadInvoiceMutation();
  const list = data?.invoiceRequests || [];

  const rowKey = (row) => `${row.requestType || 'subscription'}-${row.id}`;

  const handleFileChange = async (row, e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be 5MB or less.');
      return;
    }
    const key = rowKey(row);
    setUploadingId(key);
    try {
      const payload = { invoiceFile: file, invoiceNumber: '' };
      if (row.requestType === 'chart_order') {
        payload.chartOrderId = String(row.id);
      } else {
        payload.subscriptionId = String(row.id);
      }
      await uploadInvoice(payload).unwrap();
      refetch();
    } catch (err) {
      alert(err?.data?.error || 'Upload failed.');
    } finally {
      setUploadingId(null);
      e.target.value = '';
    }
  };

  const triggerFileInput = (key) => {
    if (!fileInputRefs.current[key]) return;
    fileInputRefs.current[key].click();
  };

  return (
    <div style={{ padding: '0 0 2rem 0' }}>
      <PageTitle>
        <FaFileInvoice style={{ marginRight: '8px', verticalAlign: 'middle' }} />
        Invoice Requests
      </PageTitle>
      <FilterBar>
        <span style={{ marginRight: '8px', color: 'var(--color-text-muted)' }}>Filter:</span>
        {['all', 'pending', 'uploaded'].map((f) => (
          <FilterBtn key={f} $active={filter === f} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All requests' : f === 'pending' ? 'Pending invoices' : 'Uploaded invoices'}
          </FilterBtn>
        ))}
      </FilterBar>
      <Card>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading...
          </div>
        ) : list.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No invoice requests found.
          </div>
        ) : (
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Subscriber</Th>
                  <Th>Email</Th>
                  <Th>Type</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {list.map((row) => {
                  const key = rowKey(row);
                  return (
                    <Tr key={key}>
                      <Td>{row.requestType === 'chart_order' ? `CO-${row.id}` : row.id}</Td>
                      <Td>{row.sub_name || '-'}</Td>
                      <Td><SmallText>{row.sub_email || '-'}</SmallText></Td>
                      <Td>{row.sub_type || '-'}</Td>
                      <Td><SmallText>{row.sub_date ? new Date(row.sub_date).toLocaleDateString() : '-'}</SmallText></Td>
                      <Td>
                        <StatusBadge $status={row.invoice_status || 'pending'}>
                          {(row.invoice_status || 'pending') === 'uploaded' ? 'Uploaded' : 'Pending'}
                        </StatusBadge>
                      </Td>
                      <Td>
                        {(row.invoice_status || 'pending') !== 'uploaded' && (
                          <>
                            <FileInput
                              ref={(el) => { fileInputRefs.current[key] = el; }}
                              type="file"
                              accept=".pdf,application/pdf"
                              onChange={(e) => handleFileChange(row, e)}
                            />
                            <Button
                              type="button"
                              size="small"
                              onClick={() => triggerFileInput(key)}
                              disabled={!!uploadingId}
                            >
                              {uploadingId === key ? <FaSpinner className="spin" /> : <FaUpload />}
                              {' '}Upload Invoice
                            </Button>
                          </>
                        )}
                        {row.invoice_status === 'uploaded' && (
                          <SmallText>Uploaded {row.invoice_uploaded_at ? new Date(row.invoice_uploaded_at).toLocaleDateString() : ''}</SmallText>
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          </TableWrap>
        )}
      </Card>
    </div>
  );
}
