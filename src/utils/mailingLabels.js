/**
 * Utility functions for generating and printing mailing labels
 */

/**
 * Generate mailing label HTML for a single subscriber
 * @param {Object} subscription - The subscription data with subscriber details
 * @returns {string} HTML string for the mailing label
 */
export const generateMailingLabelHTML = (subscription) => {
  const {
    sub_name,
    phy_address,
    sub_box_number,
    sub_contact_per,
    sub_other_contact_info,
    sub_delivery
  } = subscription;

  // Format the address
  let addressLines = [];
  
  if (phy_address) {
    addressLines.push(phy_address);
  }
  
  if (sub_box_number) {
    addressLines.push(`P.O. Box ${sub_box_number}`);
  }
  
  if (sub_contact_per) {
    addressLines.push(`Attn: ${sub_contact_per}`);
  }
  
  if (sub_other_contact_info) {
    addressLines.push(sub_other_contact_info);
  }

  // Add delivery method if specified
  if (sub_delivery) {
    addressLines.push(`Delivery: ${sub_delivery}`);
  }

  return `
    <div class="mailing-label" style="
      width: 4in;
      height: 2.5in;
      padding: 0.2in;
      margin: 0.1in;
      border: 1px solid #ccc;
      font-family: Arial, sans-serif;
      font-size: 12px;
      line-height: 1.3;
      display: inline-block;
      vertical-align: top;
      page-break-inside: avoid;
      box-sizing: border-box;
    ">
      <div style="font-weight: bold; margin-bottom: 0.1in; font-size: 14px;">
        ${sub_name}
      </div>
      <div style="margin-bottom: 0.1in;">
        ${addressLines.join('<br>')}
      </div>
      <div style="font-size: 10px; color: #666; margin-top: 0.1in;">
        Paper AIP Subscription
      </div>
    </div>
  `;
};

/**
 * Generate mailing labels HTML for multiple subscribers
 * @param {Array} subscriptions - Array of subscription data
 * @returns {string} Complete HTML document with all mailing labels
 */
export const generateMailingLabelsHTML = (subscriptions) => {
  const labelsHTML = subscriptions
    .map(subscription => generateMailingLabelHTML(subscription))
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Mailing Labels - Paper AIP Subscriptions</title>
      <style>
        @page {
          size: 8.5in 11in;
          margin: 0.5in;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
        }
        
        .labels-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.1in;
          justify-content: flex-start;
        }
        
        .mailing-label {
          width: 4in;
          height: 2.5in;
          padding: 0.2in;
          margin: 0.1in;
          border: 1px solid #ccc;
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.3;
          display: inline-block;
          vertical-align: top;
          page-break-inside: avoid;
          box-sizing: border-box;
        }
        
        .label-header {
          font-weight: bold;
          margin-bottom: 0.1in;
          font-size: 14px;
        }
        
        .label-address {
          margin-bottom: 0.1in;
        }
        
        .label-footer {
          font-size: 10px;
          color: #666;
          margin-top: 0.1in;
        }
        
        @media print {
          .no-print {
            display: none;
          }
          
          .mailing-label {
            border: 1px solid #000;
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
        ">Print Labels</button>
        <button onclick="window.close()" style="
          background: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        ">Close</button>
      </div>
      
      <div class="labels-container">
        ${labelsHTML}
      </div>
      
      <div class="no-print" style="
        margin-top: 20px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 5px;
      ">
        <h3>Mailing Labels Summary</h3>
        <p><strong>Total Labels:</strong> ${subscriptions.length}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Paper AIP Subscriptions</strong></p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Open mailing labels in a new window for printing
 * @param {Array} subscriptions - Array of subscription data
 */
export const printMailingLabels = (subscriptions) => {
  if (!subscriptions || subscriptions.length === 0) {
    alert('No paper subscriptions found for mailing labels.');
    return;
  }

  const html = generateMailingLabelsHTML(subscriptions);
  
  // Create a new window
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (!printWindow) {
    alert('Please allow popups for this site to print mailing labels.');
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
 * Download mailing labels as HTML file
 * @param {Array} subscriptions - Array of subscription data
 * @param {string} filename - Optional filename (default: mailing-labels.html)
 */
export const downloadMailingLabels = (subscriptions, filename = 'mailing-labels.html') => {
  if (!subscriptions || subscriptions.length === 0) {
    alert('No paper subscriptions found for mailing labels.');
    return;
  }

  const html = generateMailingLabelsHTML(subscriptions);
  
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
