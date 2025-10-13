// Excel export utility for annual subscription reports
import * as XLSX from 'xlsx';

/**
 * Export annual subscription data to Excel
 * @param {Object} data - Dashboard stats data from API or annual report data
 * @param {Array} subscribers - Array of subscriber data
 * @param {Array} subscriptions - Array of subscription data
 * @param {string} filename - Optional filename for the export
 */
export const exportAnnualSubscriptionReport = (data, subscribers = [], subscriptions = [], filename = null) => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Determine if we have comprehensive annual report data or dashboard data
    const isAnnualReport = data && data.summary && data.subscriptions;
    const summary = isAnnualReport ? data.summary : data;
    const reportSubscriptions = isAnnualReport ? data.subscriptions : subscriptions;
    const revenueByType = isAnnualReport ? data.revenue_by_type : data.revenue?.by_type;
    const monthlyData = isAnnualReport ? data.monthly_data : data.revenue?.monthly;

    // 1. Summary Sheet
    const summaryData = [
      ['Annual Subscription Report', ''],
      ['Generated Date', new Date().toLocaleDateString()],
      ['Report Period', `${data.year || new Date().getFullYear()}`],
      ['', ''],
      ['SUMMARY STATISTICS', ''],
      ['Total Subscriptions', summary.total_subscriptions || data.total_subscriptions || 0],
      ['Unique Subscribers', summary.unique_subscribers || data.total_subscribers || 0],
      ['Active Subscriptions', summary.active_subscriptions || data.active_subscribers || 0],
      ['Pending Subscriptions', summary.pending_subscriptions || data.pending_subscriptions || 0],
      ['Total Revenue', summary.total_revenue || data.revenue?.total || 0],
      ['Average Subscription Value', summary.average_subscription_value || 0],
      ['', ''],
      ['SUBSCRIPTION TYPES BREAKDOWN', ''],
      ...(isAnnualReport ? revenueByType : (data.subs_by_type || [])).map(item => [
        item.sub_type, 
        item.count || item.count, 
        item.revenue || 0,
        item.average_amount || 0
      ]),
      ['', ''],
      ['REVENUE BY TYPE', ''],
      ...(revenueByType || []).map(item => [item.sub_type, item.revenue]),
      ['', ''],
      ['EXPIRING SUBSCRIPTIONS', ''],
      ['Expiring in 7 days', data.expiring_buckets?.days_7 || 0],
      ['Expiring in 30 days', data.expiring_buckets?.days_30 || 0],
      ['Expiring in 90 days', data.expiring_buckets?.days_90 || 0],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // 2. Subscribers Sheet
    if (subscribers.length > 0) {
      const subscriberHeaders = [
        'ID', 'Name', 'Category', 'Email', 'Phone', 'Address', 
        'Box Number', 'Contact Person', 'eAIP Status', 'CD Status', 'Paper Status'
      ];
      
      const subscriberRows = subscribers.map(sub => [
        sub.sub_id,
        sub.sub_name,
        sub.sub_category,
        sub.sub_email,
        sub.sub_telephone,
        sub.phy_address,
        sub.sub_box_number,
        sub.sub_contact_per,
        sub.subscription_status?.eAIP || 'none',
        sub.subscription_status?.CD || 'none',
        sub.subscription_status?.Paper || 'none'
      ]);

      const subscriberData = [subscriberHeaders, ...subscriberRows];
      const subscriberSheet = XLSX.utils.aoa_to_sheet(subscriberData);
      XLSX.utils.book_append_sheet(workbook, subscriberSheet, 'Subscribers');
    }

    // 3. Subscriptions Sheet
    if (reportSubscriptions.length > 0) {
      const subscriptionHeaders = [
        'ID', 'Subscriber ID', 'Subscriber Name', 'Type', 'Status', 'Start Date', 'Expiry Date', 
        'Amount', 'Receipt No', 'Invoice No', 'Delivery Method', 'eAIP Username', 'Category'
      ];
      
      const subscriptionRows = reportSubscriptions.map(sub => [
        sub.id,
        sub.subscriber_id,
        sub.sub_name || '',
        sub.sub_type,
        sub.status || (sub.sub_status === 1 ? 'Active' : sub.sub_status === 2 ? 'Pending' : 'Inactive'),
        sub.sub_start_date ? new Date(sub.sub_start_date).toLocaleDateString() : '',
        sub.sub_exp_date ? new Date(sub.sub_exp_date).toLocaleDateString() : '',
        sub.sub_amount || 0,
        sub.receipt_no || '',
        sub.invoice_no || '',
        sub.sub_delivery || '',
        sub.eaip_user_name || '',
        sub.sub_category || ''
      ]);

      const subscriptionData = [subscriptionHeaders, ...subscriptionRows];
      const subscriptionSheet = XLSX.utils.aoa_to_sheet(subscriptionData);
      XLSX.utils.book_append_sheet(workbook, subscriptionSheet, 'Subscriptions');
    }

    // 4. Monthly Revenue Sheet
    if (monthlyData && monthlyData.length > 0) {
      const monthlyHeaders = ['Month', 'eAIP Revenue', 'CD Revenue', 'Paper Revenue', 'Total Revenue'];
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      // Process monthly data from annual report or dashboard data
      const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        eAIP: 0,
        CD: 0,
        Paper: 0
      }));

      if (isAnnualReport) {
        // Process annual report monthly data
        monthlyData.forEach(item => {
          if (monthlyRevenue[item.month - 1]) {
            monthlyRevenue[item.month - 1][item.sub_type] = parseFloat(item.revenue);
          }
        });
      } else {
        // Process dashboard monthly data
        monthlyData.forEach(month => {
          const monthIndex = month.month - 1;
          if (monthlyRevenue[monthIndex]) {
            monthlyRevenue[monthIndex].eAIP = month.eAIP || 0;
            monthlyRevenue[monthIndex].CD = month.CD || 0;
            monthlyRevenue[monthIndex].Paper = month.Paper || 0;
          }
        });
      }
      
      const monthlyRows = monthlyRevenue.map((month, index) => {
        const total = (month.eAIP || 0) + (month.CD || 0) + (month.Paper || 0);
        return [
          monthNames[index],
          month.eAIP || 0,
          month.CD || 0,
          month.Paper || 0,
          total
        ];
      });

      const monthlySheetData = [monthlyHeaders, ...monthlyRows];
      const monthlySheet = XLSX.utils.aoa_to_sheet(monthlySheetData);
      XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly Revenue');
    }

    // 5. Historical Revenue Sheet
    if (data.revenue?.historical) {
      const historicalHeaders = ['Year', 'Revenue'];
      const historicalRows = data.revenue.historical.map(item => [item.year, item.revenue]);
      const historicalData = [historicalHeaders, ...historicalRows];
      const historicalSheet = XLSX.utils.aoa_to_sheet(historicalData);
      XLSX.utils.book_append_sheet(workbook, historicalSheet, 'Historical Revenue');
    }

    // Generate filename if not provided
    const defaultFilename = `Annual_Subscription_Report_${new Date().getFullYear()}_${new Date().toISOString().split('T')[0]}.xlsx`;
    const finalFilename = filename || defaultFilename;

    // Save the file
    XLSX.writeFile(workbook, finalFilename);
    
    return {
      success: true,
      filename: finalFilename,
      message: 'Annual subscription report exported successfully'
    };

  } catch (error) {
    console.error('Error exporting Excel file:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to export annual subscription report'
    };
  }
};


/**
 * Format currency values for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'UGX')
 */
export const formatCurrency = (amount, currency = 'UGX') => {
  if (typeof amount !== 'number') return '0';
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale for formatting (default: 'en-UG')
 */
export const formatDate = (date, locale = 'en-UG') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale);
};
