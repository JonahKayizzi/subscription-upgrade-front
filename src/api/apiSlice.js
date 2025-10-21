import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      // Optionally add auth token here later
      const token = getState().auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    // Subscribers
    getSubscribers: builder.query({
      query: () => '/subscribers',
    }),
    searchSubscribers: builder.query({
      query: (query) => `/subscribers/search?query=${encodeURIComponent(query)}`,
    }),
    getSubscriber: builder.query({
      query: (id) => `/subscribers/${id}`,
    }),
    addSubscriber: builder.mutation({
      query: (data) => ({
        url: '/subscribers',
        method: 'POST',
        body: data,
      }),
    }),
    updateSubscriber: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subscribers/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteSubscriber: builder.mutation({
      query: (id) => ({
        url: `/subscribers/${id}`,
        method: 'DELETE',
      }),
    }),
    // Subscriptions
    getSubscriptions: builder.query({
      query: (subscriber_id) =>
        subscriber_id ? `/subscriptions?subscriber_id=${subscriber_id}` : '/subscriptions',
    }),
    getSubscription: builder.query({
      query: (id) => `/subscriptions/${id}`,
    }),
    addSubscription: builder.mutation({
      query: (data) => ({
        url: '/subscriptions',
        method: 'POST',
        body: data,
      }),
    }),
    updateSubscription: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subscriptions/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteSubscription: builder.mutation({
      query: (id) => ({
        url: `/subscriptions/${id}`,
        method: 'DELETE',
      }),
    }),
    // Dashboard stats
    getDashboardStats: builder.query({
      query: (params) => ({
        url: '/dashboard/stats',
        params
      })
    }),
    // Annual subscription report
    getAnnualSubscriptionReport: builder.query({
      query: () => '/reports/annual-subscription'
    }),
    // Subscriber dashboard
    getSubscriberDashboard: builder.query({
      query: () => ({
        url: '/subscriber/dashboard'
      })
    }),
    // Request invoice
    requestInvoice: builder.mutation({
      query: (subscriptionId) => ({
        url: '/subscriber/request-invoice',
        method: 'POST',
        body: { subscriptionId }
      })
    }),
    // Mark invoice as not required
    markInvoiceNotRequired: builder.mutation({
      query: (subscriptionId) => ({
        url: '/subscriber/mark-invoice-not-required',
        method: 'POST',
        body: { subscriptionId }
      })
    }),
    // Upload invoice (admin)
    uploadInvoice: builder.mutation({
      query: ({ subscriptionId, invoiceFile, invoiceNumber }) => {
        const formData = new FormData();
        formData.append('subscriptionId', subscriptionId);
        formData.append('invoiceFile', invoiceFile);
        formData.append('invoiceNumber', invoiceNumber);
        
        return {
          url: '/admin/upload-invoice',
          method: 'POST',
          body: formData
        };
      }
    }),
    // Verify receipt and activate subscription (admin)
    verifyReceipt: builder.mutation({
      query: ({ subscriptionId, receiptVerified, subscriptionDetails }) => ({
        url: '/admin/verify-receipt',
        method: 'POST',
        body: { subscriptionId, receiptVerified, subscriptionDetails }
      })
    }),
    // Upload receipt
    uploadReceipt: builder.mutation({
      query: ({ subscriptionId, receiptFile, receiptNumber }) => {
        const formData = new FormData();
        formData.append('subscriptionId', subscriptionId);
        formData.append('receiptFile', receiptFile);
        if (receiptNumber) {
          formData.append('receiptNumber', receiptNumber);
        }
        
        return {
          url: '/subscriber/upload-receipt',
          method: 'POST',
          body: formData
        };
      }
    }),
    // Submit subscription order
    submitSubscriptionOrder: builder.mutation({
      query: ({ subscriptionData, orderFormFile }) => {
        const formData = new FormData();
        formData.append('subscriptionData', JSON.stringify(subscriptionData));
        if (orderFormFile) {
          formData.append('orderFormFile', orderFormFile);
        }
        
        return {
          url: '/subscriber/submit-order',
          method: 'POST',
          body: formData
        };
      }
    }),
    // Update subscriber information
    updateSubscriberInfo: builder.mutation({
      query: (updateData) => ({
        url: '/subscriber/update-info',
        method: 'PUT',
        body: updateData
      })
    }),
      // Create renewal subscription
  createRenewalSubscription: builder.mutation({
    query: (renewalData) => ({
      url: '/subscriber/create-renewal',
      method: 'POST',
      body: renewalData
    })
  }),

  // Create admin subscription request
  createAdminSubscription: builder.mutation({
    query: (requestData) => ({
      url: '/admin/create-subscription',
      method: 'POST',
      body: requestData
    })
  }),
    
    // Admin: set invoice request date (offline)
    setInvoiceRequestDateAdmin: builder.mutation({
      query: ({ subscriptionId, requestDate }) => ({
        url: '/admin/set-invoice-request-date',
        method: 'POST',
        body: { subscriptionId, requestDate }
      })
    }),

    // Get notifications
    getNotifications: builder.query({
      query: () => '/notifications'
    }),

  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetSubscribersQuery,
  useSearchSubscribersQuery,
  useGetSubscriberQuery,
  useAddSubscriberMutation,
  useUpdateSubscriberMutation,
  useDeleteSubscriberMutation,
  useGetSubscriptionsQuery,
  useGetSubscriptionQuery,
  useAddSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetDashboardStatsQuery,
  useGetAnnualSubscriptionReportQuery,
  useGetSubscriberDashboardQuery,
  useRequestInvoiceMutation,
  useMarkInvoiceNotRequiredMutation,
  useUploadInvoiceMutation,
  useVerifyReceiptMutation,
  useUploadReceiptMutation,
  useSubmitSubscriptionOrderMutation,
  useUpdateSubscriberInfoMutation,
  useCreateRenewalSubscriptionMutation,
  useCreateAdminSubscriptionMutation,
  useSetInvoiceRequestDateAdminMutation,
  useGetNotificationsQuery,
} = apiSlice; 