import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const isActiveSubscriber = (subscriber) => {
  if (!subscriber) return false;
  return !(
    subscriber.deleted_at != null ||
    subscriber.deletedAt != null ||
    subscriber.sub_deleted === 1 ||
    subscriber.sub_deleted === true ||
    subscriber.is_deleted === 1 ||
    subscriber.is_deleted === true ||
    subscriber.isDeleted === 1 ||
    subscriber.isDeleted === true ||
    subscriber.removed === 1 ||
    subscriber.removed === true
  );
};

const filterDeletedSubscribersFromPayload = (payload = {}) => {
  const subscribers = Array.isArray(payload.subscribers) ? payload.subscribers : [];
  const activeSubscribers = subscribers.filter(isActiveSubscriber);
  const activeSubscriberIds = new Set(activeSubscribers.map((subscriber) => subscriber.sub_id));
  const lags = Array.isArray(payload.lags)
    ? payload.lags.filter((lag) => activeSubscriberIds.has(lag.sub_id))
    : [];

  return {
    ...payload,
    subscribers: activeSubscribers,
    lags,
  };
};

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
    changePassword: builder.mutation({
      query: (payload) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: payload,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    // Subscribers
    getSubscribers: builder.query({
      query: () => '/subscribers',
      transformResponse: (response) => filterDeletedSubscribersFromPayload(response),
    }),
    searchSubscribers: builder.query({
      query: (query) => `/subscribers/search?query=${encodeURIComponent(query)}`,
      transformResponse: (response) => filterDeletedSubscribersFromPayload(response),
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
    // Upload invoice (admin). Pass either subscriptionId or chartOrderId.
    uploadInvoice: builder.mutation({
      query: ({ subscriptionId, chartOrderId, invoiceFile, invoiceNumber }) => {
        const formData = new FormData();
        if (subscriptionId != null && subscriptionId !== '') formData.append('subscriptionId', String(subscriptionId));
        if (chartOrderId != null && chartOrderId !== '') formData.append('chartOrderId', String(chartOrderId));
        formData.append('invoiceFile', invoiceFile);
        if (invoiceNumber != null) formData.append('invoiceNumber', invoiceNumber);
        
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
      query: ({ subscriptionId, receiptFile }) => {
        const formData = new FormData();
        formData.append('subscriptionId', subscriptionId);
        formData.append('receiptFile', receiptFile);
        
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
    
    // Get paper subscriptions for mailing labels
    getPaperSubscriptionsForMailingLabels: builder.query({
      query: (days = 30) => `/mailing-labels/paper-subscriptions?days=${days}`
    }),

    // Invoice requests (admin): list where invoice_requested = true
    getInvoiceRequests: builder.query({
      query: (filter = 'all') => `/admin/invoice-requests?filter=${filter}`
    }),

    // Subscriber: my invoices (subscriptions where invoice_requested = true)
    getMyInvoices: builder.query({
      query: () => '/subscriber/invoices'
    }),
    // Subscriber: download subscription invoice PDF (returns blob)
    getInvoiceDownload: builder.query({
      query: (subscriptionId) => ({
        url: `/subscriber/invoices/${subscriptionId}/download`,
        // Use responseHandler so fetchBaseQuery returns a Blob
        responseHandler: (response) => response.blob(),
      })
    }),
    // Subscriber: download chart order invoice PDF (returns blob)
    getChartOrderInvoiceDownload: builder.query({
      query: (chartOrderId) => ({
        url: `/subscriber/invoices/chart-order/${chartOrderId}/download`,
        // Use responseHandler so fetchBaseQuery returns a Blob
        responseHandler: (response) => response.blob(),
      })
    }),

    // Chart orders
    addChartOrder: builder.mutation({
      query: (data) => ({
        url: '/subscriber/submit-chart-order',
        method: 'POST',
        body: data,
      }),
    }),
    getChartOrders: builder.query({
      query: () => '/subscriber/chart-orders',
    }),
    getAllChartOrders: builder.query({
      query: () => '/admin/chart-orders',
    }),
    getChartOrderDetails: builder.query({
      query: (orderId) => `/admin/chart-orders/${orderId}`,
    }),
    updateChartOrderStatus: builder.mutation({
      query: ({ orderId, status, admin_notes }) => ({
        url: `/admin/chart-orders/${orderId}/status`,
        method: 'PUT',
        body: { status, admin_notes },
      }),
    }),
    createChartOrderAdmin: builder.mutation({
      query: (data) => ({
        url: '/admin/chart-orders',
        method: 'POST',
        body: data,
      }),
    }),

    // Chart catalog
    getCharts: builder.query({
      query: (params = {}) => ({
        url: '/charts',
        params: {
          type: params.type,
          search: params.search,
          page: params.page || 1,
          limit: params.limit || 50,
          active_only: params.active_only !== false
        }
      }),
    }),
    getChart: builder.query({
      query: (id) => `/charts/${id}`,
    }),
    getChartTypes: builder.query({
      query: () => '/charts/types/list',
    }),
    createChart: builder.mutation({
      query: (data) => ({
        url: '/admin/charts',
        method: 'POST',
        body: data,
      }),
    }),
    updateChart: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/charts/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteChart: builder.mutation({
      query: (id) => ({
        url: `/admin/charts/${id}`,
        method: 'DELETE',
      }),
    }),
    // Generate dispatch list PDF
    generateDispatchList: builder.mutation({
      query: (days = 30) => ({
        url: `/dispatch-list?days=${days}`,
        // Return blob for PDF generation endpoint
        responseHandler: (response) => response.blob(),
      })
    }),

  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
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
  useGetPaperSubscriptionsForMailingLabelsQuery,
  useGetInvoiceRequestsQuery,
  useGetMyInvoicesQuery,
  useLazyGetInvoiceDownloadQuery,
  useLazyGetChartOrderInvoiceDownloadQuery,
  useAddChartOrderMutation,
  useGetChartOrdersQuery,
  useGetAllChartOrdersQuery,
  useGetChartOrderDetailsQuery,
  useUpdateChartOrderStatusMutation,
  useCreateChartOrderAdminMutation,
  useGetChartsQuery,
  useGetChartQuery,
  useGetChartTypesQuery,
  useCreateChartMutation,
  useUpdateChartMutation,
  useDeleteChartMutation,
} = apiSlice;
