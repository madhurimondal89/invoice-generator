interface EmailInvoiceData {
  // Invoice data
  invoiceNumber: string;
  companyName: string;
  companyEmail: string;
  clientName: string;
  clientEmail: string;
  total: number;
  
  // Additional fields
  lineItems?: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal?: number;
  taxAmount?: number;
  discount?: number;
  issueDate?: string;
  dueDate?: string;
  notes?: string;
  terms?: string;
  logoPreview?: string;
}

interface EmailOptions {
  to: string;
  subject?: string;
  message?: string;
  attachPDF?: boolean;
}

export async function sendInvoiceEmail(
  invoiceData: EmailInvoiceData,
  options?: EmailOptions
): Promise<void> {
  const defaultSubject = `Invoice ${invoiceData.invoiceNumber} from ${invoiceData.companyName}`;
  const defaultMessage = `
Dear ${invoiceData.clientName},

Please find attached your invoice ${invoiceData.invoiceNumber} for $${invoiceData.total.toFixed(2)}.

${invoiceData.terms || 'Payment is due within 30 days.'}

If you have any questions, please don't hesitate to contact us.

Best regards,
${invoiceData.companyName}
  `.trim();

  const emailPayload = {
    to: options?.to || invoiceData.clientEmail,
    subject: options?.subject || defaultSubject,
    message: options?.message || defaultMessage,
    invoice: {
      invoiceNumber: invoiceData.invoiceNumber,
      companyName: invoiceData.companyName,
      companyEmail: invoiceData.companyEmail,
      clientName: invoiceData.clientName,
      total: invoiceData.total,
      issueDate: invoiceData.issueDate,
      dueDate: invoiceData.dueDate,
      lineItems: invoiceData.lineItems || [],
      subtotal: invoiceData.subtotal || 0,
      taxAmount: invoiceData.taxAmount || 0,
      discount: invoiceData.discount || 0,
      notes: invoiceData.notes,
      terms: invoiceData.terms,
    },
    attachPDF: options?.attachPDF !== false, // Default to true
  };

  try {
    const response = await fetch('/api/invoices/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send email');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending invoice email:', error);
    throw error;
  }
}

// Helper function to validate email format
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to generate email preview
export function generateEmailPreview(invoiceData: EmailInvoiceData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoiceData.invoiceNumber}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: #2563eb;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: white;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
        }
        .invoice-details {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .total {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Invoice ${invoiceData.invoiceNumber}</h1>
        <p>From ${invoiceData.companyName}</p>
    </div>
    
    <div class="content">
        <p>Dear ${invoiceData.clientName},</p>
        
        <p>Please find your invoice details below:</p>
        
        <div class="invoice-details">
            <table width="100%">
                <tr>
                    <td><strong>Invoice Number:</strong></td>
                    <td>${invoiceData.invoiceNumber}</td>
                </tr>
                <tr>
                    <td><strong>Issue Date:</strong></td>
                    <td>${invoiceData.issueDate ? new Date(invoiceData.issueDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
                <tr>
                    <td><strong>Due Date:</strong></td>
                    <td>${invoiceData.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
                <tr>
                    <td><strong>Total Amount:</strong></td>
                    <td class="total">$${invoiceData.total.toFixed(2)}</td>
                </tr>
            </table>
        </div>
        
        ${invoiceData.lineItems && invoiceData.lineItems.length > 0 ? `
        <h3>Items:</h3>
        <table width="100%" style="border-collapse: collapse; margin-bottom: 20px;">
            <thead>
                <tr style="background: #f3f4f6;">
                    <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">Description</th>
                    <th style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">Qty</th>
                    <th style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">Rate</th>
                    <th style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${invoiceData.lineItems.map(item => `
                <tr>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.description}</td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">${item.quantity}</td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">$${item.rate.toFixed(2)}</td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">$${item.amount.toFixed(2)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        ` : ''}
        
        <p>${invoiceData.terms || 'Payment is due within 30 days.'}</p>
        
        ${invoiceData.notes ? `<p><strong>Notes:</strong> ${invoiceData.notes}</p>` : ''}
        
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br>
        ${invoiceData.companyName}</p>
    </div>
    
    <div class="footer">
        <p>Thank you for your business.</p>
    </div>
</body>
</html>
  `.trim();
}
