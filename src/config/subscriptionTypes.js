import { FaGlobe, FaFileAlt, FaCompactDisc } from 'react-icons/fa';

// Centralized subscription type configuration
export const SUBSCRIPTION_TYPES = [
  {
    id: 'eAIP',
    label: 'eAIP',
    displayName: 'Electronic AIP',
    icon: FaGlobe,
    description: 'Electronic Aeronautical Information Publication',
    color: '#a259f7',
    hasCredentials: true,
    hasDelivery: false,
    fields: ['eaip_user_name', 'eaip_password'],
    pricing: {
      base: 'Cost of web based AIP',
      options: [
        'Cost of web based AIP'
      ]
    }
  },
  {
    id: 'paper',
    label: 'paper',
    displayName: 'Paper AIP',
    icon: FaFileAlt,
    description: 'Physical Paper Publications',
    color: '#43e97b',
    hasCredentials: false,
    hasDelivery: true,
    fields: ['sub_delivery'],
    pricing: {
      base: 'Purchase of Paper copy of the AIP (Includes AICs and Amendment service for the first year)',
      options: [
        'Purchase of Paper copy of the AIP (Includes AICs and Amendment service for the first year)',
        'Cost of Paper AIP (hand delivery)',
        'Cost of Paper AIP (postage within country)',
        'Cost of Paper AIP (postage within Africa)',
        'Cost of Paper AIP (postage to the rest of the world)',
        'Annual Subscription of Paper copy of the AIP',
        'Annual subscription for Paper AIP Amendments (hand delivery)',
        'Annual subscription for Paper AIP Amendments (postage within country)',
        'Annual subscription for Paper AIP Amendments (postage within Africa)',
        'Annual subscription for Paper AIP Amendments (postage to the rest of the world)'
      ]
    }
  },
  {
    id: 'CD',
    label: 'CD',
    displayName: 'CD AIP',
    icon: FaCompactDisc,
    description: 'CD-ROM Publications',
    color: '#f7b801',
    hasCredentials: false,
    hasDelivery: true,
    fields: ['sub_delivery'],
    pricing: {
      base: 'Purchase of CD copy of the AIP (Includes AICs)',
      options: [
        'Purchase of CD copy of the AIP (Includes AICs)',
        'Cost of CD AIP (hand delivery)',
        'Cost of CD AIP (postage within country)',
        'Cost of CD AIP (postage within Africa)',
        'Cost of CD AIP (postage to the rest of the world)',
        'Annual subscription of CD copy of the AIP',
        'Annual subscription for CD (hand delivery)',
        'Annual subscription for CD (postage within country)',
        'Annual subscription for CD (postage within Africa)',
        'Annual subscription for CD (postage to the rest of the world)'
      ]
    }
  }
];

// Helper functions
export const getSubscriptionType = (id) => {
  return SUBSCRIPTION_TYPES.find(type => type.id === id);
};

export const getSubscriptionTypeById = (id) => {
  return SUBSCRIPTION_TYPES.find(type => type.id === id);
};

export const getSubscriptionTypeByLabel = (label) => {
  return SUBSCRIPTION_TYPES.find(type => type.label === label);
};

export const getSubscriptionTypeIds = () => {
  return SUBSCRIPTION_TYPES.map(type => type.id);
};

export const getSubscriptionTypeLabels = () => {
  return SUBSCRIPTION_TYPES.map(type => type.label);
};

export const getSubscriptionTypeDisplayNames = () => {
  return SUBSCRIPTION_TYPES.map(type => type.displayName);
};

export const getSubscriptionTypeColors = () => {
  return SUBSCRIPTION_TYPES.reduce((acc, type) => {
    acc[type.id] = type.color;
    return acc;
  }, {});
};

export const getSubscriptionTypeFields = (id) => {
  const type = getSubscriptionType(id);
  return type ? type.fields : [];
};

export const getSubscriptionTypePricing = (id) => {
  const type = getSubscriptionType(id);
  return type ? type.pricing : { base: '', options: [] };
};

export const hasCredentials = (id) => {
  const type = getSubscriptionType(id);
  return type ? type.hasCredentials : false;
};

export const hasDelivery = (id) => {
  const type = getSubscriptionType(id);
  return type ? type.hasDelivery : false;
};
