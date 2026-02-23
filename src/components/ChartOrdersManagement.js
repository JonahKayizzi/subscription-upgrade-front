import React, { useState } from 'react';
import styled from 'styled-components';
import { useGetAllChartOrdersQuery, useUpdateChartOrderStatusMutation } from '../api/apiSlice';

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: var(--color-text);
  margin-bottom: 24px;
  font-size: 1.8rem;
  font-weight: 700;
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--color-bg-card);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background: var(--color-bg);
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
`;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--color-border);
  
  &:hover {
    background: var(--color-bg);
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  color: var(--color-text);
  font-size: 0.9rem;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.status) {
      case 'pending':
        return 'background: #fef3c7; color: #92400e;';
      case 'processing':
        return 'background: #dbeafe; color: #1e40af;';
      case 'shipped':
        return 'background: #d1fae5; color: #065f46;';
      case 'delivered':
        return 'background: #dcfce7; color: #166534;';
      case 'cancelled':
        return 'background: #fee2e2; color: #991b1b;';
      default:
        return 'background: #f3f4f6; color: #374151;';
    }
  }}
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return 'background: #3b82f6; color: white; &:hover { background: #2563eb; }';
      case 'success':
        return 'background: #10b981; color: white; &:hover { background: #059669; }';
      case 'warning':
        return 'background: #f59e0b; color: white; &:hover { background: #d97706; }';
      case 'danger':
        return 'background: #ef4444; color: white; &:hover { background: #dc2626; }';
      default:
        return 'background: #6b7280; color: white; &:hover { background: #4b5563; }';
    }
  }}
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: var(--color-bg-card);
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  margin: 0 0 16px 0;
  color: var(--color-text);
  font-size: 1.25rem;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: var(--color-text);
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.9rem;
  background: var(--color-bg);
  color: var(--color-text);
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 80px;
  background: var(--color-bg);
  color: var(--color-text);
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.primary ? 
    'background: #3b82f6; color: white; &:hover { background: #2563eb; }' :
    'background: #6b7280; color: white; &:hover { background: #4b5563; }'
  }
`;

const LoadingText = styled.div`
  text-align: center;
  color: var(--color-text-muted);
  padding: 24px;
`;

const ErrorText = styled.div`
  color: var(--color-error);
  background: rgba(255, 77, 79, 0.1);
  border: 1px solid var(--color-error);
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 16px;
`;

export default function ChartOrdersManagement() {
  const { data: ordersData, isLoading, error, refetch } = useGetAllChartOrdersQuery();
  const [updateStatus] = useUpdateChartOrderStatusMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;
    
    setIsUpdating(true);
    try {
      await updateStatus({
        orderId: selectedOrder.id,
        status: newStatus,
        admin_notes: adminNotes
      }).unwrap();
      
      setShowModal(false);
      setSelectedOrder(null);
      setNewStatus('');
      setAdminNotes('');
      refetch();
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.order_status);
    setAdminNotes(order.admin_notes || '');
    setShowModal(true);
  };

  const getStatusActions = (order) => {
    const currentStatus = order.order_status;
    const actions = [];

    if (currentStatus === 'pending') {
      actions.push({ label: 'Process', status: 'processing', variant: 'primary' });
      actions.push({ label: 'Cancel', status: 'cancelled', variant: 'danger' });
    } else if (currentStatus === 'processing') {
      actions.push({ label: 'Ship', status: 'shipped', variant: 'success' });
      actions.push({ label: 'Cancel', status: 'cancelled', variant: 'danger' });
    } else if (currentStatus === 'shipped') {
      actions.push({ label: 'Deliver', status: 'delivered', variant: 'success' });
    }

    return actions;
  };

  if (isLoading) return <LoadingText>Loading chart orders...</LoadingText>;
  if (error) return <ErrorText>Error loading chart orders: {error.message}</ErrorText>;

  const orders = ordersData?.orders || [];

  return (
    <Container>
      <Title>Chart Orders Management</Title>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#6b7280', padding: '48px' }}>
          No chart orders found
        </div>
      ) : (
        <OrdersTable>
          <TableHeader>
            <tr>
              <TableHeaderCell>Order ID</TableHeaderCell>
              <TableHeaderCell>Customer</TableHeaderCell>
              <TableHeaderCell>Chart</TableHeaderCell>
              <TableHeaderCell>Size</TableHeaderCell>
              <TableHeaderCell>Copies</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Order Date</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>
                  <div>
                    <div style={{ fontWeight: '500' }}>{order.sub_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{order.sub_email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div style={{ fontWeight: '500' }}>{order.chart_name}</div>
                    {order.chart_title && (
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{order.chart_title}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{order.chart_size.toUpperCase()}</TableCell>
                <TableCell>{order.num_copies}</TableCell>
                <TableCell>
                  <StatusBadge status={order.order_status}>
                    {order.order_status}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  {new Date(order.order_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {getStatusActions(order).map((action, index) => (
                      <ActionButton
                        key={index}
                        variant={action.variant}
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(action.status);
                          setAdminNotes(order.admin_notes || '');
                          setShowModal(true);
                        }}
                      >
                        {action.label}
                      </ActionButton>
                    ))}
                    <ActionButton
                      variant="default"
                      onClick={() => openStatusModal(order)}
                    >
                      Update
                    </ActionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </OrdersTable>
      )}

      {showModal && selectedOrder && (
        <Modal onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <ModalContent>
            <ModalTitle>Update Order Status</ModalTitle>
            
            <FormGroup>
              <Label>Order #{selectedOrder.id}</Label>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '8px' }}>
                {selectedOrder.chart_name} - {selectedOrder.chart_size.toUpperCase()}
              </div>
            </FormGroup>

            <FormGroup>
              <Label>Status</Label>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Admin Notes</Label>
              <TextArea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add any notes about this order..."
              />
            </FormGroup>

            <ButtonRow>
              <Button onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button primary onClick={handleStatusUpdate} disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Update Status'}
              </Button>
            </ButtonRow>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}

