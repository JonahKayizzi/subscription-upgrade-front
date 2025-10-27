/**
 * Utility functions for generating and printing dispatch list
 */

/**
 * Generate dispatch list HTML for printing
 * @param {Array} subscriptions - Array of subscription data
 * @returns {string} Complete HTML document with dispatch list
 */
export const generateDispatchListHTML = (subscriptions) => {
  // NON-PAYMENT CLIENTS data (constant)
  const nonPaymentClients = [
    {
      sub_name: 'THE DIRECTOR OPERATIONS',
      phy_address: 'UPDF-AF Headquarters,\nP.O Box 105\nEntebbe',
      sub_email: 'doaf@updf.go.ug',
      sub_contact_per: 'Major David Rusoke',
      state_company: 'Entebbe',
      no_of_aips: '5 PAPER',
      annual_subscription: 'N/A',
      receipt_no: 'N/A',
      date_sent_out: '17/09/2025',
      sent_by: 'UPDF-AF officer'
    }
  ];

  // UCAA Internal Clients data (constant)
  const internalClients = [
    {
      sub_name: 'BRIEFING OFFICE-AIS',
      phy_address: 'Soroti Airfield',
      sub_contact_per: 'Ms. Tabitha Nyafwono',
      state_company: 'Soroti Airfield',
      no_of_aips: '2 PAPER',
      annual_subscription: 'N/A',
      receipt_no: 'N/A',
      date_sent_out: '17/09/2025',
      sent_by: 'AIM Officer'
    },
    {
      sub_name: 'BRIEFING OFFICE-AIS',
      phy_address: 'Arua Airfield',
      sub_contact_per: 'Mr. Olum Patrick',
      state_company: 'Arua Airfield',
      no_of_aips: '1 PAPER',
      annual_subscription: 'N/A',
      receipt_no: 'N/A',
      date_sent_out: '17/09/2025',
      sent_by: 'AIM Officer'
    },
    {
      sub_name: 'BRIEFING OFFICE-AIS',
      phy_address: 'Gulu Airfield',
      sub_contact_per: 'Mr. Basamba Ali',
      state_company: 'Gulu Airfield',
      no_of_aips: '3 PAPER',
      annual_subscription: 'N/A',
      receipt_no: 'N/A',
      date_sent_out: '17/09/2025',
      sent_by: 'AIM Officer'
    },
    {
      sub_name: 'BRIEFING OFFICE-AIS',
      phy_address: 'Kisoro Airfield',
      sub_contact_per: 'Mr. Mayanja Stephen',
      state_company: 'Kisoro Airfield',
      no_of_aips: '1 PAPER',
      annual_subscription: 'N/A',
      receipt_no: 'N/A',
      date_sent_out: '17/09/2025',
      sent_by: 'AIM Officer'
    },
    {
      sub_name: 'BRIEFING OFFICE-AIS',
      phy_address: 'Kasese Airfield',
      sub_contact_per: 'Mr. Kizito Dennis',
      state_company: 'Kasese Airfield',
      no_of_aips: '1 PAPER',
      annual_subscription: 'N/A',
      receipt_no: 'N/A',
      date_sent_out: '17/09/2025',
      sent_by: 'AIM Officer'
    },
    {
      sub_name: 'BRIEFING OFFICE-AIS',
      phy_address: 'Mbarara Airfield',
      sub_contact_per: 'Mr. Emmanuel Balikuddembe',
      state_company: 'Mbarara Airfield',
      no_of_aips: '1 PAPER',
      annual_subscription: 'N/A',
      receipt_no: 'N/A',
      date_sent_out: '17/09/2025',
      sent_by: 'AIM Officer'
    }
  ];

  // Combine all data
  const allData = [...subscriptions, ...internalClients];

  // Generate table rows for Payment Clients only
  const paymentClientsRows = subscriptions.map((item, index) => {
    const publicationDetails = formatPublicationDetails(item);
    const rowNumber = index + 1; // Auto-increment starting from 1
    
    return `
      <tr>
        <td class="row-number">${rowNumber}.</td>
        <td class="publication-details">${publicationDetails}</td>
        <td class="state-company">${item.state_company || 'UGANDA'}</td>
        <td class="no-of-aips">${item.no_of_aips || '1 PAPER'}</td>
        <td class="annual-subscription">$${item.annual_subscription || '0'}</td>
        <td class="receipt-no">${item.receipt_no || ''}</td>
        <td class="date-sent-out">${item.date_sent_out || new Date().toLocaleDateString('en-GB')}</td>
        <td class="sent-by">${item.sent_by || 'UCAA Registry'}</td>
      </tr>
    `;
  }).join('');

  // Generate table rows for NON-PAYMENT CLIENTS
  const nonPaymentClientsRows = nonPaymentClients.map((item, index) => {
    const publicationDetails = formatPublicationDetails(item);
    const rowNumber = subscriptions.length + index + 1; // Continue numbering from Payment Clients
    
    return `
      <tr>
        <td class="row-number">${rowNumber}.</td>
        <td class="publication-details">${publicationDetails}</td>
        <td class="state-company">${item.state_company}</td>
        <td class="no-of-aips">${item.no_of_aips}</td>
        <td class="annual-subscription">${item.annual_subscription}</td>
        <td class="receipt-no">${item.receipt_no}</td>
        <td class="date-sent-out">${item.date_sent_out}</td>
        <td class="sent-by">${item.sent_by}</td>
      </tr>
    `;
  }).join('');

  // Generate table rows for UCAA Internal Clients
  const internalClientsRows = internalClients.map((item, index) => {
    const publicationDetails = formatPublicationDetails(item);
    const rowNumber = subscriptions.length + nonPaymentClients.length + index + 1; // Continue numbering from NON-PAYMENT CLIENTS
    
    return `
      <tr>
        <td class="row-number">${rowNumber}.</td>
        <td class="publication-details">${publicationDetails}</td>
        <td class="state-company">${item.state_company}</td>
        <td class="no-of-aips">${item.no_of_aips}</td>
        <td class="annual-subscription">${item.annual_subscription}</td>
        <td class="receipt-no">${item.receipt_no}</td>
        <td class="date-sent-out">${item.date_sent_out}</td>
        <td class="sent-by">${item.sent_by}</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Dispatch List - AIP Holders</title>
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          font-size: 8pt;
          line-height: 1.2;
        }
        
        .header {
          margin-bottom: 20px;
        }
        
        .title-section {
          display: block;
          width: 100%;
        }
        
        .main-title {
          font-size: 14pt;
          font-weight: bold;
          margin: 0;
          margin-bottom: 5mm;
        }
        
        .subtitle {
          font-size: 12pt;
          text-align: center;
          margin: 0;
          margin-bottom: 10mm;
        }
        
        .payment-clients-header {
          font-size: 10pt;
          font-weight: bold;
          text-align: center;
          margin-bottom: 5mm;
        }
        
        .dispatch-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20mm;
        }
        
        .dispatch-table th {
          background-color: #f0f0f0;
          border: 1px solid #000;
          padding: 2mm;
          font-weight: bold;
          font-size: 8pt;
          text-align: left;
        }
        
        .dispatch-table td {
          border: 1px solid #000;
          padding: 2mm;
          vertical-align: top;
          font-size: 8pt;
        }
        
        .row-number {
          width: 8mm;
          text-align: center;
        }
        
        .publication-details {
          width: 85mm;
          white-space: pre-line;
        }
        
        .state-company {
          width: 18mm;
        }
        
        .no-of-aips {
          width: 12mm;
        }
        
        .annual-subscription {
          width: 18mm;
        }
        
        .receipt-no {
          width: 12mm;
        }
        
        .date-sent-out {
          width: 12mm;
        }
        
        .sent-by {
          width: 15mm;
        }
        
        .non-payment-clients-header {
          font-size: 10pt;
          font-weight: bold;
          margin: 15mm 0 5mm 0;
          text-align: left;
          border-top: 1px solid #000;
          padding-top: 5mm;
        }
        
        .internal-clients-header {
          font-size: 10pt;
          font-weight: bold;
          margin: 15mm 0 5mm 0;
          text-align: left;
          border-top: 1px solid #000;
          padding-top: 5mm;
        }
        
        .page-number {
          text-align: center;
          font-size: 10pt;
          margin-top: 20mm;
        }
        
        @media print {
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="
        position: fixed;
        top: 10px;
        right: 10px;
        background: #f0f0f0;
        padding: 10px;
        border-radius: 5px;
        z-index: 1000;
      ">
        <button onclick="window.print()" style="
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 10px;
        ">Print Dispatch List</button>
        <button onclick="window.close()" style="
          background: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        ">Close</button>
      </div>
      
      <div class="header">
        <div class="title-section">
          <h1 class="main-title">MANSOPS PART III - AIS/MAP Appendix 4</h1>
          <p class="subtitle">LIST OF AIP HOLDERS POSTAL ADDRESSES (MAILING LABELS)</p>
          <p class="payment-clients-header">PAYMENT CLIENTS</p>
        </div>
      </div>
      
      <table class="dispatch-table">
        <thead>
          <tr>
            <th>NO.</th>
            <th>PUBLICATIONS TO BE DISTRIBUTED: AIP UGANDA</th>
            <th>STATE / COMPANY</th>
            <th>NO. OF AIPS</th>
            <th>ANNUAL SUBSCRIPTION</th>
            <th>RECEIPT No.</th>
            <th>DATE SENT OUT</th>
            <th>SENT BY/ TRACKING NUMBER</th>
          </tr>
        </thead>
        <tbody>
          ${paymentClientsRows}
        </tbody>
      </table>
      
      <div class="non-payment-clients-header">
        NON-PAYMENT CLIENTS
      </div>
      
      <table class="dispatch-table">
        <tbody>
          ${nonPaymentClientsRows}
        </tbody>
      </table>
      
      <div class="internal-clients-header">
        UCAA INTERNAL CLIENTS - hand delivered by UCAA Registry/UCAA Transport office/AIM officer
      </div>
      
      <table class="dispatch-table">
        <tbody>
          ${internalClientsRows}
        </tbody>
      </table>
      
      <div class="page-number">1</div>
      
      <div class="no-print" style="
        margin-top: 20px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 5px;
      ">
        <h3>Dispatch List Summary</h3>
        <p><strong>Payment Clients:</strong> ${subscriptions.length}</p>
        <p><strong>Non-Payment Clients:</strong> ${nonPaymentClients.length}</p>
        <p><strong>UCAA Internal Clients:</strong> ${internalClients.length}</p>
        <p><strong>Total Entries:</strong> ${subscriptions.length + nonPaymentClients.length + internalClients.length}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Format publication details for display
 * @param {Object} item - The subscription/client data
 * @returns {string} Formatted publication details
 */
const formatPublicationDetails = (item) => {
  const details = [];
  
  if (item.sub_name) {
    details.push(item.sub_name);
  }
  
  if (item.phy_address) {
    details.push(item.phy_address);
  }
  
  if (item.sub_telephone) {
    details.push(`Tel: ${item.sub_telephone}`);
  }
  
  if (item.sub_email) {
    details.push(`Email: ${item.sub_email}`);
  }
  
  if (item.sub_contact_per) {
    details.push(`C/O ${item.sub_contact_per}`);
  }
  
  if (item.sub_box_number) {
    details.push(`P.O Box ${item.sub_box_number}`);
  }
  
  if (item.sub_other_contact_info) {
    details.push(item.sub_other_contact_info);
  }
  
  return details.join('\n');
};

/**
 * Open dispatch list in a new window for printing
 * @param {Array} subscriptions - Array of subscription data
 */
export const printDispatchList = (subscriptions) => {
  // Use sample data if no subscriptions provided
  const sampleData = subscriptions && subscriptions.length > 0 ? subscriptions : [
    {
      sub_name: 'EAST AFRICAN CIVIL AVIATION ACADEMY',
      phy_address: 'P.O BOX 333 SOROTI',
      sub_telephone: '0702 574221/ 0704665785',
      sub_email: 'rtur20002000wyahoo.co.uk; wabwireandrew@gmail.com',
      sub_contact_per: 'Ms. Tabitha Nyafwono',
      sub_box_number: '333',
      sub_other_contact_info: 'Briefing Office-AIS\nSoroti Airfield',
      state_company: 'UGANDA/EACAA',
      no_of_aips: '4 PAPER',
      annual_subscription: '283.2',
      receipt_no: 'AS/33240',
      date_sent_out: '17/09/2025',
      sent_by: 'AIM Officer'
    },
    {
      sub_name: 'EAGLE AIR LIMITED',
      phy_address: 'EAGLE AIR HANGAR 7\nP.O.BOX 7392 KAMPALA, UGANDA',
      sub_telephone: '0772777335',
      sub_email: 'bridget.mailing@eagleair-ug.com',
      state_company: 'UGANDA',
      no_of_aips: '1 PAPER',
      annual_subscription: '70.80',
      receipt_no: 'RRI/1000130',
      date_sent_out: '17/09/2025',
      sent_by: 'UCAA Registry'
    },
    {
      sub_name: 'AIR SERV LIMITED',
      phy_address: 'Hangar one Entebbe International Airport\nP.O.BOX 74548, Kampala',
      sub_telephone: '+256 414 321 251',
      sub_email: 'info@airserv.co.ug',
      state_company: 'UGANDA',
      no_of_aips: '1 PAPER',
      annual_subscription: '271.40',
      receipt_no: 'RAS/90555',
      date_sent_out: '17/09/2025',
      sent_by: 'UCAA Registry'
    },
    {
      sub_name: 'BAR AVIATION ACADEMY LIMITED',
      phy_address: 'Kajjansi Gate 3\nP.O Box 27210',
      sub_telephone: '+256772706105',
      sub_email: 'academy@baraviationug.com',
      state_company: 'UGANDA',
      no_of_aips: '2 PAPER',
      annual_subscription: '141.6',
      receipt_no: 'RRI/1011156',
      date_sent_out: '17/09/2025',
      sent_by: 'UCAA Registry'
    },
    {
      sub_name: 'AEROLINK UGANDA LTD',
      phy_address: 'Second floor, Departure Terminal\nEntebbe International Airport\nP.O. Box 689 Entebbe',
      sub_telephone: '+256 317 333 000',
      state_company: 'UGANDA',
      no_of_aips: '1 PAPER',
      annual_subscription: '271.40',
      receipt_no: 'RRI/1021820',
      date_sent_out: '17/09/2025',
      sent_by: 'UCAA Registry'
    },
    {
      sub_name: 'TRANSAFRIK INTERNATIONAL LIMITED',
      phy_address: 'P.O Box 708 Entebbe',
      sub_telephone: '+256 705803367, +256 778300670',
      state_company: 'UGANDA',
      no_of_aips: '1 PAPER',
      annual_subscription: '71',
      receipt_no: 'RAS/98126',
      date_sent_out: '17/09/2025',
      sent_by: 'UCAA Registry'
    }
  ];

  const html = generateDispatchListHTML(sampleData);
  
  // Create a new window
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (!printWindow) {
    alert('Please allow popups for this site to print dispatch list.');
    return;
  }
  
  // Write the HTML to the new window
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Focus the window
  printWindow.focus();
  
  // Auto-print after a short delay to ensure content is loaded
  setTimeout(() => {
    printWindow.print();
  }, 500);
};

/**
 * Download dispatch list as HTML file
 * @param {Array} subscriptions - Array of subscription data
 * @param {string} filename - Optional filename (default: dispatch-list.html)
 */
export const downloadDispatchList = (subscriptions, filename = 'dispatch-list.html') => {
  const html = generateDispatchListHTML(subscriptions);
  
  // Create a blob and download
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};
