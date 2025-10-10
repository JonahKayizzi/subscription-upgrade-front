import React, { useState } from 'react';
import styled from 'styled-components';
import { useGetChartOrdersQuery } from '../api/apiSlice';
import { FaEye, FaEyeSlash, FaClock, FaTruck, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

const Container = styled.div`
  padding: 24px;
  max-width: 1000px;
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

const EmptyState = styled.div`
  text-align: center;
  color: var(--color-text-muted);
  padding: 48px;
  background: var(--color-bg-card);
  border-radius: 8px;
  border: 1px solid var(--color-border);
`;

const OrderDetails = styled.div`
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 12px;
  margin-top: 8px;
  font-size: 0.8rem;
  color: var(--color-text-muted);
`;

const ExpandableRow = styled.tr`
  border-bottom: 1px solid var(--color-border);
  
  &:hover {
    background: var(--color-bg);
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: var(--color-accent);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background: var(--color-bg);
  }
`;

const ExpandedDetails = styled.td`
  padding: 0;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
`;

const DetailsContent = styled.div`
  padding: 16px;
  background: var(--color-bg);
  border-left: 3px solid var(--color-accent);
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  margin-bottom: 8px;
  
  strong {
    color: var(--color-text);
    font-weight: 600;
  }
  
  span {
    color: var(--color-text-muted);
  }
`;

const StatusIcon = styled.span`
  margin-right: 6px;
  font-size: 0.9rem;
`;

const StatusDescription = styled.div`
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: 4px;
  font-style: italic;
`;

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return <FaClock />;
    case 'processing':
      return <FaInfoCircle />;
    case 'shipped':
      return <FaTruck />;
    case 'delivered':
      return <FaCheckCircle />;
    case 'cancelled':
      return <FaTimesCircle />;
    default:
      return <FaInfoCircle />;
  }
};

const getStatusDescription = (status) => {
  switch (status) {
    case 'pending':
      return 'Your order is being reviewed by our team';
    case 'processing':
      return 'Your order is being prepared for shipment';
    case 'shipped':
      return 'Your order has been shipped and is on its way';
    case 'delivered':
      return 'Your order has been successfully delivered';
    case 'cancelled':
      return 'Your order has been cancelled';
    default:
      return 'Status unknown';
  }
};

export default function MyChartOrders() {
  const { data: ordersData, isLoading, error } = useGetChartOrdersQuery();
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  if (isLoading) return <LoadingText>Loading your chart orders...</LoadingText>;
  if (error) return <ErrorText>Error loading chart orders: {error.message}</ErrorText>;

  const orders = ordersData || [];

  const toggleExpanded = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  return (
    <Container>
      <Title>My Chart Orders</Title>
      
      {orders.length === 0 ? (
        <EmptyState>
          <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>No chart orders yet</h3>
          <p style={{ margin: 0 }}>You haven't placed any chart orders yet. Browse our aeronautical charts to get started!</p>
        </EmptyState>
      ) : (
        <OrdersTable>
          <TableHeader>
            <tr>
              <TableHeaderCell>Order ID</TableHeaderCell>
              <TableHeaderCell>Chart Details</TableHeaderCell>
              <TableHeaderCell>Size & Copies</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Order Date</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <ExpandableRow>
                  <TableCell>
                    <strong>#{order.id}</strong>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                        {order.chart_name}
                      </div>
                      {order.chart_title && (
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>
                          {order.chart_title}
                        </div>
                      )}
                      {order.chart_scale && (
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          Scale: {order.chart_scale}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div style={{ fontWeight: '500' }}>
                        {order.chart_size.toUpperCase()} Size
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {order.num_copies} {order.num_copies === 1 ? 'copy' : 'copies'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StatusIcon>
                        {getStatusIcon(order.order_status)}
                      </StatusIcon>
                      <StatusBadge status={order.order_status}>
                        {order.order_status}
                      </StatusBadge>
                    </div>
                    <StatusDescription>
                      {getStatusDescription(order.order_status)}
                    </StatusDescription>
                    {order.admin_notes && (
                      <OrderDetails>
                        <strong>Admin Notes:</strong> {order.admin_notes}
                      </OrderDetails>
                    )}
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{new Date(order.order_date).toLocaleDateString()}</span>
                      <ExpandButton onClick={() => toggleExpanded(order.id)}>
                        {expandedOrders.has(order.id) ? <FaEyeSlash /> : <FaEye />}
                      </ExpandButton>
                    </div>
                  </TableCell>
                </ExpandableRow>
                {expandedOrders.has(order.id) && (
                  <ExpandableRow>
                    <ExpandedDetails colSpan="5">
                      <DetailsContent>
                        <DetailsGrid>
                          <div>
                            <DetailItem>
                              <strong>Delivery Name:</strong> <span>{order.delivery_name}</span>
                            </DetailItem>
                            <DetailItem>
                              <strong>Delivery Address:</strong> <span>{order.delivery_address}</span>
                            </DetailItem>
                            <DetailItem>
                              <strong>Delivery Email:</strong> <span>{order.delivery_email}</span>
                            </DetailItem>
                            {order.delivery_tel && (
                              <DetailItem>
                                <strong>Delivery Phone:</strong> <span>{order.delivery_tel}</span>
                              </DetailItem>
                            )}
                          </div>
                          <div>
                            {order.billing_name && (
                              <DetailItem>
                                <strong>Billing Name:</strong> <span>{order.billing_name}</span>
                              </DetailItem>
                            )}
                            {order.billing_address && (
                              <DetailItem>
                                <strong>Billing Address:</strong> <span>{order.billing_address}</span>
                              </DetailItem>
                            )}
                            {order.billing_email && (
                              <DetailItem>
                                <strong>Billing Email:</strong> <span>{order.billing_email}</span>
                              </DetailItem>
                            )}
                            {order.special_instructions && (
                              <DetailItem>
                                <strong>Special Instructions:</strong> <span>{order.special_instructions}</span>
                              </DetailItem>
                            )}
                          </div>
                        </DetailsGrid>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                          {order.reciprocal && (
                            <span style={{ 
                              background: '#dbeafe', 
                              color: '#1e40af', 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.8rem' 
                            }}>
                              Reciprocal Basis
                            </span>
                          )}
                          {order.on_payment && (
                            <span style={{ 
                              background: '#d1fae5', 
                              color: '#065f46', 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.8rem' 
                            }}>
                              On Payment
                            </span>
                          )}
                        </div>
                      </DetailsContent>
                    </ExpandedDetails>
                  </ExpandableRow>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </OrdersTable>
      )}
    </Container>
  );
}

