import React from 'react';
import styled from 'styled-components';
import Button from './ui/Button';
import { FaFileAlt, FaFileInvoice, FaReceipt, FaChevronRight } from 'react-icons/fa';

const colors = [
  '#3B82F6', // blue
  '#EC4899', // pink
  '#F59E42', // orange
];

const BreadcrumbContainer = styled.div`
  padding: 24px 0 24px 0;
  background: var(--color-background-card);
  border-radius: 16px;
  min-width: unset;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const BreadcrumbList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
`;

const BreadcrumbItem = styled.li`
  position: relative;
  display: flex;
  align-items: flex-start;
  min-height: 80px;
  margin-bottom: 0;

  &:not(:last-child) {
    margin-bottom: 32px;
  }
`;

const CircleWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
`;

const BreadcrumbCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ color }) => color};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 4px solid #fff;
`;

const VerticalLine = styled.div`
  position: absolute;
  top: 48px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: calc(100% - 48px);
  background: ${({ color }) => color};
  z-index: 1;
  border-radius: 4px;
`;

const ContentWrapper = styled.div`
  margin-left: 32px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StepTitle = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SubStep = styled.div`
  font-size: 0.97rem;
  color: var(--color-text-muted);
  margin: 4px 0 0 0;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 0;
`;

const HorizontalLine = styled.div`
  height: 2px;
  width: 32px;
  background: ${({ color }) => color};
  position: absolute;
  left: 48px;
  top: 24px;
  z-index: 1;
`;

const ViewButton = styled(Button)`
  font-size: 0.9rem;
  padding: 4px 12px;
  margin-left: 8px;
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #cccccc;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const CompleteText = styled.div`
  margin-top: 32px;
  color: var(--color-success);
  font-weight: 600;
  font-size: 1.1rem;
  transition: background 0.2s;
`;

const SubStepContainer = styled.div`
  display: flex;
  justify-content: ${({ hasDate }) => (hasDate ? 'space-between' : 'center')};
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid ${({ completed }) => (completed ? '#22C55E' : 'var(--color-border-muted, #e5e7eb)')};
  background: transparent;
  color: ${({ completed }) => (completed ? '#22C55E' : 'var(--color-text-muted)')};
  min-width: 220px;
  transition: all 0.2s ease-in-out;
  flex: 1;
`;

const SubStepContent = styled.div`
  font-weight: 600;
  font-size: 1rem;
`;

const SubStepMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  font-size: 0.95rem;
`;

const PipelineTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0 0 18px 0;
  color: var(--color-primary, #3B82F6);
`;

const SubStepRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;
  align-items: center;
`;

function format(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const stepIcons = [
  <FaFileAlt size={22} />, // Order Form
  <FaFileInvoice size={22} />, // Invoice
  <FaReceipt size={22} />, // Receipt
];

const OnboardingPipeline = ({ subscription }) => {
  // Extract file and date fields
  const orderForm = subscription?.subscription_form;
  const invoice = subscription?.subscription_invoice;
  const receipt = subscription?.subscription_receipt;

  // Determine step completion
  const orderFormDone = !!orderForm;
  const invoiceDone = !!invoice;
  const receiptDone = !!receipt;
  const allDone = orderFormDone && invoiceDone && receiptDone;

  // File view handlers (assume files are in /aip_subscription/uploads/)
  const handleView = (file) => {
    if (file) {
      window.open(`/aip_subscription/uploads/${file}`, '_blank');
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Order Form',
      color: colors[0],
      icon: stepIcons[0],
      active: orderFormDone,
      substeps: [
        { label: 'Sent to customer', date: subscription?.order_form_sent_date, container: true },
        { label: 'Received from customer', date: subscription?.order_form_received_date, view: orderFormDone ? () => handleView(orderForm) : null, container: true },
      ],
    },
    {
      number: 2,
      title: 'Invoice',
      color: colors[1],
      icon: stepIcons[1],
      active: invoiceDone,
      substeps: [
        { label: 'Requested from Accounts', date: subscription?.invoice_requested_date, container: true },
        { label: 'Received from Accounts', date: subscription?.invoice_received_date, view: invoiceDone ? () => handleView(invoice) : null, container: true },
        { label: 'Sent to Customer', date: subscription?.invoice_sent_to_customer_date, container: true },
      ],
    },
    {
      number: 3,
      title: 'Receipt',
      color: colors[2],
      icon: stepIcons[2],
      active: receiptDone,
      substeps: [
        { label: 'Received from Customer', date: subscription?.receipt_received_date, container: true },
        { label: 'Verified by Accounts', date: subscription?.receipt_verified_date, view: receiptDone ? () => handleView(receipt) : null, container: true },
      ],
    },
  ];

  return (
    <BreadcrumbContainer>
      <PipelineTitle>Onboarding Pipeline</PipelineTitle>
      <BreadcrumbList>
        {steps.map((step, idx) => (
          <BreadcrumbItem key={step.number}>
            <CircleWrapper>
              <BreadcrumbCircle color={step.color} active={step.active}>
                {step.icon}
              </BreadcrumbCircle>
              {idx < steps.length - 1 && <VerticalLine color={steps[idx + 1].color} />}
            </CircleWrapper>
            <HorizontalLine color={step.color} />
            <ContentWrapper>
              <StepTitle color={step.color}>{step.title}</StepTitle>
              {(() => {
                const containerSubs = step.substeps.filter(sub => sub.container);
                const nonContainerSubs = step.substeps.filter(sub => !sub.container);
                return (
                  <>
                    {containerSubs.length > 0 && (
                      <SubStepRow>
                        {containerSubs.map((sub, i) => (
                          <React.Fragment key={i}>
                            <SubStepContainer completed={!!sub.date} hasDate={!!sub.date}>
                              {sub.date ? (
                                <>
                                  <SubStepContent>{sub.label}</SubStepContent>
                                  <SubStepMeta>
                                    <span>{format(sub.date)}</span>
                                    {sub.view && <ViewButton onClick={sub.view}>View</ViewButton>}
                                  </SubStepMeta>
                                </>
                              ) : (
                                <SubStepContent>{sub.label}</SubStepContent>
                              )}
                            </SubStepContainer>
                            {i < containerSubs.length - 1 && (
                              <FaChevronRight style={{ color: 'var(--color-primary, #3B82F6)', fontSize: '1.2em' }} />
                            )}
                          </React.Fragment>
                        ))}
                      </SubStepRow>
                    )}
                    {nonContainerSubs.map((sub, i) => (
                      <SubStep key={i}>
                        {sub.label} <span style={{ fontWeight: 500 }}>{format(sub.date)}</span>
                        {sub.view && <ViewButton onClick={sub.view}>View</ViewButton>}
                      </SubStep>
                    ))}
                  </>
                );
              })()}
            </ContentWrapper>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
      {allDone && <CompleteText>Complete: Credentials created, file updated.</CompleteText>}
    </BreadcrumbContainer>
  );
};

export default OnboardingPipeline; 