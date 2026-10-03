import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { getCurrencyByCode } from '@shared/currencies';
import { getDocumentConfig } from './document-config';

export interface InvoiceData {
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyPhone?: string;
  companyGst?: string;
  companyLogo?: string;
  logoPreview?: string;

  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientPhone?: string;
  clientGst?: string;

  shipToName?: string;
  shipToAddress?: string;
  shipToCity?: string;
  shipToState?: string;
  shipToZip?: string;
  shipToCountry?: string;
  shipToEmail?: string;

  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  poNumber?: string;

  currency?: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    rate: number;
    taxRate?: number;
    taxAmount?: number;
    amount: number;
    hsn?: string;
  }>;
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  discount?: number;
  shippingCost?: number;
  total: number;

  includePaymentDetails?: boolean;
  paymentMethod?: string;
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  routingNumber?: string;
  ifscCode?: string;
  swiftCode?: string;
  ibanNumber?: string;
  upiId?: string;
  paymentQrImage?: string;
  paymentInstructions?: string;
  paymentLink?: string;

  notes?: string;
  terms?: string;

  documentType?: string;
  metadata?: any;
  primaryColor?: string;
  accentColor?: string;
}

// Helper to convert hex to RGB
function hexToRgb(hex?: string): [number, number, number] | null {
  if (!hex) return null;
  const clean = hex.replace('#', '').trim();
  if (clean.length === 6) {
    const num = parseInt(clean, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  return null;
}

// Helper to format currency for PDF
export function formatPdfCurrency(amount: number, currencyCode: string = 'USD'): string {
  const num = (amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const curr = getCurrencyByCode(currencyCode);
  const code = (currencyCode || 'USD').toUpperCase();

  switch (code) {
    case 'USD':
      return `$${num}`;
    case 'EUR':
      return `€${num}`;
    case 'GBP':
      return `£${num}`;
    case 'INR':
      return `Rs. ${num}`;
    case 'BDT':
      return `Tk ${num}`;
    case 'JPY':
    case 'CNY':
      return `¥${num}`;
    case 'CAD':
    case 'AUD':
    case 'NZD':
    case 'SGD':
      return `${code} $${num}`;
    case 'AED':
      return `AED ${num}`;
    case 'SAR':
      return `SAR ${num}`;
    default:
      return curr ? `${curr.symbol || code} ${num}` : `${code} ${num}`;
  }
}

// Convert any image source into clean PNG data URL
async function loadAndPrepareImage(src: string): Promise<{ dataUrl: string; width: number; height: number } | null> {
  if (!src) return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const naturalWidth = img.naturalWidth || img.width || 300;
        const naturalHeight = img.naturalHeight || img.height || 200;
        canvas.width = naturalWidth;
        canvas.height = naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          resolve({
            dataUrl,
            width: naturalWidth,
            height: naturalHeight
          });
          return;
        }
      } catch (err) {
        console.warn('Canvas conversion failed, using raw data URL:', err);
      }
      resolve({ dataUrl: src, width: 300, height: 200 });
    };
    img.onerror = (e) => {
      console.warn('Failed to load image:', e);
      resolve(null);
    };
    img.src = src;
  });
}

export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    floatPrecision: 16
  });

  const currencyCode = invoiceData.currency || 'USD';

  const docConfig = getDocumentConfig(invoiceData.documentType);
  const customRgb = hexToRgb(invoiceData.primaryColor);
  const customAccentRgb = hexToRgb(invoiceData.accentColor);
  const colors = docConfig.pdfColors;
  const primaryColor: [number, number, number] = customRgb || colors.primary;
  const accentColor: [number, number, number] = customAccentRgb || (customRgb
    ? [Math.min(255, Math.round(customRgb[0] * 0.12 + 225)), Math.min(255, Math.round(customRgb[1] * 0.12 + 225)), Math.min(255, Math.round(customRgb[2] * 0.12 + 225))]
    : colors.accent);
  const darkColor: [number, number, number] = [30, 41, 59];
  const lightGray: [number, number, number] = [100, 116, 139];

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 18;

  // Helper text function
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 9, options: any = {}) => {
    doc.setFontSize(fontSize);
    if (options.bold) doc.setFont('helvetica', 'bold');
    else doc.setFont('helvetica', 'normal');

    if (options.color) {
      doc.setTextColor(options.color[0], options.color[1], options.color[2]);
    } else {
      doc.setTextColor(...darkColor);
    }

    const lines = doc.splitTextToSize(text || '', maxWidth);
    doc.text(lines, x, y, options);
    return y + (lines.length * (fontSize * 0.38) + 2);
  };

  // Section Banner Header Helper
  const addSectionHeader = (title: string, x: number, y: number, width: number) => {
    doc.setFillColor(...accentColor);
    doc.roundedRect(x, y - 4, width, 7, 1, 1, 'F');
    doc.setTextColor(...primaryColor);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), x + 3, y + 1);
    doc.setTextColor(...darkColor);
    return y + 9;
  };

  // 1. TOP BRAND HEADER
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent thin line
  doc.setFillColor(...colors.light);
  doc.rect(0, 41, pageWidth, 1.5, 'F');

  // Embed Company Logo
  const rawLogo = invoiceData.logoPreview || invoiceData.companyLogo;
  if (rawLogo) {
    try {
      const prepared = await loadAndPrepareImage(rawLogo);
      if (prepared) {
        const maxBoxW = 38;
        const maxBoxH = 26;
        const aspect = (prepared.width || 1) / (prepared.height || 1);

        let drawW = maxBoxW;
        let drawH = drawW / aspect;
        if (drawH > maxBoxH) {
          drawH = maxBoxH;
          drawW = drawH * aspect;
        }

        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, 7, 40, 28, 2, 2, 'F');

        const posX = margin + (40 - drawW) / 2;
        const posY = 7 + (28 - drawH) / 2;

        doc.addImage(prepared.dataUrl, 'PNG', posX, posY, drawW, drawH, undefined, 'FAST');
      }
    } catch (error) {
      console.warn('Logo processing error in PDF:', error);
    }
  }

  // Document Title & Invoice Number
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(docConfig.title, pageWidth - margin, 18, { align: 'right' });

  // Official PAID Stamp Badge for Receipts
  if (invoiceData.documentType?.includes('receipt')) {
    doc.setFillColor(16, 185, 129); // Emerald
    doc.roundedRect(pageWidth - margin - 85, 11, 18, 6, 1, 1, 'F');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('PAID', pageWidth - margin - 76, 15.5, { align: 'center' });
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`# ${invoiceData.invoiceNumber || `${docConfig.prefix}-001`}`, pageWidth - margin, 27, { align: 'right' });

  doc.setFontSize(8.5);
  doc.text(`${docConfig.dateLabels.issue}: ${invoiceData.issueDate ? new Date(invoiceData.issueDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}`, pageWidth - margin, 35, { align: 'right' });

  // Reset text color
  doc.setTextColor(...darkColor);

  let currentY = 52;
  const colWidth = (pageWidth - 2 * margin - 10) / 2;

  // 2. FROM & BILL TO COLUMNS (Dynamic Party Headers)
  let fromY = currentY;
  fromY = addSectionHeader(docConfig.partyHeaders.from, margin, fromY, colWidth);
  fromY = addText(invoiceData.companyName || 'Your Business Name', margin + 2, fromY, colWidth - 4, 10, { bold: true });
  if (invoiceData.companyAddress) fromY = addText(invoiceData.companyAddress, margin + 2, fromY, colWidth - 4, 8.5);
  if (invoiceData.companyEmail) fromY = addText(`Email: ${invoiceData.companyEmail}`, margin + 2, fromY, colWidth - 4, 8.5);
  if (invoiceData.companyPhone) fromY = addText(`Phone: ${invoiceData.companyPhone}`, margin + 2, fromY, colWidth - 4, 8.5);
  if (invoiceData.companyGst) fromY = addText(`GSTIN: ${invoiceData.companyGst}`, margin + 2, fromY, colWidth - 4, 8.5, { bold: true });

  let toY = currentY;
  const toX = margin + colWidth + 10;
  toY = addSectionHeader(docConfig.partyHeaders.to, toX, toY, colWidth);
  toY = addText(invoiceData.clientName || 'Client / Customer Name', toX + 2, toY, colWidth - 4, 10, { bold: true });
  if (invoiceData.clientAddress) toY = addText(invoiceData.clientAddress, toX + 2, toY, colWidth - 4, 8.5);
  if (invoiceData.clientEmail) toY = addText(`Email: ${invoiceData.clientEmail}`, toX + 2, toY, colWidth - 4, 8.5);
  if (invoiceData.clientPhone) toY = addText(`Phone: ${invoiceData.clientPhone}`, toX + 2, toY, colWidth - 4, 8.5);
  if (invoiceData.clientGst) toY = addText(`GSTIN: ${invoiceData.clientGst}`, toX + 2, toY, colWidth - 4, 8.5, { bold: true });

  currentY = Math.max(fromY, toY) + 6;

  // Ship To (if present)
  const hasShipping = invoiceData.shipToName || invoiceData.shipToAddress;
  if (hasShipping) {
    let shipY = currentY;
    shipY = addSectionHeader('SHIP TO', margin, shipY, pageWidth - 2 * margin);
    const shipDetails = [
      invoiceData.shipToName,
      invoiceData.shipToAddress,
      [invoiceData.shipToCity, invoiceData.shipToState, invoiceData.shipToZip].filter(Boolean).join(', '),
      invoiceData.shipToCountry,
      invoiceData.shipToEmail ? `Email: ${invoiceData.shipToEmail}` : ''
    ].filter(Boolean).join(' | ');
    currentY = addText(shipDetails, margin + 2, shipY, pageWidth - 2 * margin - 4, 8.5) + 4;
  }

  // 3. KEY DATES & METADATA BAR
  doc.setFillColor(...accentColor);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 11, 1, 1, 'F');
  doc.setFontSize(8.5);
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${docConfig.dateLabels.issue}:`, margin + 4, currentY + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceData.issueDate ? new Date(invoiceData.issueDate).toLocaleDateString('en-GB') : '-', margin + 28, currentY + 7);

  doc.setFont('helvetica', 'bold');
  doc.text(`${docConfig.dateLabels.due}:`, margin + 62, currentY + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceData.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString('en-GB') : '-', margin + 86, currentY + 7);

  if (invoiceData.poNumber) {
    doc.setFont('helvetica', 'bold');
    doc.text('PO Number:', margin + 115, currentY + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.poNumber, margin + 135, currentY + 7);
  }

  doc.setFont('helvetica', 'bold');
  doc.text('Currency:', pageWidth - margin - 30, currentY + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(currencyCode, pageWidth - margin - 12, currentY + 7);

  // Specialized Reference Info in PDF (Receipt, Credit Note, Purchase Order)
  const meta = invoiceData.metadata || {};
  const hasMeta = meta.originalInvoiceRef || meta.reason || meta.deliveryDate || meta.shippingMethod || meta.paymentMode || meta.transactionRef || meta.paymentStatus;
  if (hasMeta) {
    currentY += 13;
    doc.setFillColor(...accentColor);
    doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 9, 1, 1, 'F');
    doc.setFontSize(7.5);
    let metaX = margin + 4;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    const metaTitle = invoiceData.documentType?.includes('receipt') ? 'RECEIPT PARTICULARS:' : 'REFERENCE:';
    doc.text(metaTitle, metaX, currentY + 6);
    metaX += invoiceData.documentType?.includes('receipt') ? 34 : 22;
    doc.setTextColor(...darkColor);

    if (meta.originalInvoiceRef) {
      doc.setFont('helvetica', 'bold');
      doc.text('Against Inv:', metaX, currentY + 6);
      metaX += 17;
      doc.setFont('helvetica', 'normal');
      doc.text(String(meta.originalInvoiceRef), metaX, currentY + 6);
      metaX += 26;
    }
    if (meta.paymentMode) {
      doc.setFont('helvetica', 'bold');
      doc.text('Mode:', metaX, currentY + 6);
      metaX += 10;
      doc.setFont('helvetica', 'normal');
      doc.text(String(meta.paymentMode), metaX, currentY + 6);
      metaX += 26;
    }
    if (meta.transactionRef) {
      doc.setFont('helvetica', 'bold');
      doc.text('Txn/UTR:', metaX, currentY + 6);
      metaX += 14;
      doc.setFont('helvetica', 'normal');
      doc.text(String(meta.transactionRef), metaX, currentY + 6);
      metaX += 26;
    }
    if (meta.paymentStatus) {
      doc.setFont('helvetica', 'bold');
      doc.text('Status:', metaX, currentY + 6);
      metaX += 11;
      doc.setFont('helvetica', 'normal');
      doc.text(String(meta.paymentStatus), metaX, currentY + 6);
      metaX += 24;
    }
    if (meta.reason) {
      doc.setFont('helvetica', 'bold');
      doc.text('Reason:', metaX, currentY + 6);
      metaX += 13;
      doc.setFont('helvetica', 'normal');
      doc.text(String(meta.reason), metaX, currentY + 6);
      metaX += 30;
    }
    if (meta.deliveryDate) {
      doc.setFont('helvetica', 'bold');
      doc.text('Expected Delivery:', metaX, currentY + 6);
      metaX += 26;
      doc.setFont('helvetica', 'normal');
      doc.text(new Date(meta.deliveryDate).toLocaleDateString('en-GB'), metaX, currentY + 6);
      metaX += 24;
    }
    if (meta.shippingMethod) {
      doc.setFont('helvetica', 'bold');
      doc.text('Ship Via:', metaX, currentY + 6);
      metaX += 14;
      doc.setFont('helvetica', 'normal');
      doc.text(String(meta.shippingMethod), metaX, currentY + 6);
    }
    currentY += 12;
  } else {
    currentY += 18;
  }

  // 4. ITEMS TABLE
  const tableStartY = currentY;
  const hasItemTax = invoiceData.lineItems.some(item => (item.taxRate && item.taxRate > 0) || (item.taxAmount && item.taxAmount > 0));

  doc.setFillColor(...primaryColor);
  doc.rect(margin, tableStartY, pageWidth - 2 * margin, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');

  const colPos = {
    desc: margin + 4,
    qty: pageWidth - (hasItemTax ? 92 : 65),
    rate: pageWidth - (hasItemTax ? 68 : 42),
    tax: pageWidth - 46,
    amount: pageWidth - margin - 4
  };

  doc.text('ITEM DESCRIPTION', colPos.desc, tableStartY + 6);
  doc.text('QTY', colPos.qty, tableStartY + 6, { align: 'center' });
  doc.text('RATE', colPos.rate, tableStartY + 6, { align: 'right' });
  if (hasItemTax) {
    doc.text('TAX', colPos.tax, tableStartY + 6, { align: 'center' });
  }
  doc.text('AMOUNT', colPos.amount, tableStartY + 6, { align: 'right' });

  currentY = tableStartY + 12;
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'normal');

  invoiceData.lineItems.forEach((item, index) => {
    if (currentY > pageHeight - 65) {
      doc.addPage();
      currentY = margin + 15;

      doc.setFillColor(...primaryColor);
      doc.rect(margin, currentY - 8, pageWidth - 2 * margin, 9, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('ITEM DESCRIPTION', colPos.desc, currentY - 2);
      doc.text('QTY', colPos.qty, currentY - 2, { align: 'center' });
      doc.text('RATE', colPos.rate, currentY - 2, { align: 'right' });
      if (hasItemTax) doc.text('TAX', colPos.tax, currentY - 2, { align: 'center' });
      doc.text('AMOUNT', colPos.amount, currentY - 2, { align: 'right' });

      doc.setTextColor(...darkColor);
      doc.setFont('helvetica', 'normal');
      currentY += 4;
    }

    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, currentY - 3, pageWidth - 2 * margin, 9, 'F');
    }

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, currentY + 6, pageWidth - margin, currentY + 6);

    doc.setFontSize(8.5);
    const maxDescWidth = colPos.qty - colPos.desc - 10;
    const descLines = doc.splitTextToSize(item.description || 'Item description', maxDescWidth);
    doc.text(descLines, colPos.desc, currentY + 2);

    doc.text(String(item.quantity || 1), colPos.qty, currentY + 2, { align: 'center' });
    doc.text(formatPdfCurrency(item.rate || 0, currencyCode), colPos.rate, currentY + 2, { align: 'right' });
    
    if (hasItemTax) {
      const taxLabel = item.taxRate ? `${item.taxRate}%` : formatPdfCurrency(item.taxAmount || 0, currencyCode);
      doc.text(taxLabel, colPos.tax, currentY + 2, { align: 'center' });
    }

    doc.text(formatPdfCurrency(item.amount || 0, currencyCode), colPos.amount, currentY + 2, { align: 'right' });

    currentY += Math.max(9, descLines.length * 3.5 + 4);
  });

  currentY += 8;

  // 5. TOTALS SECTION
  let totalEntriesCount = 2;
  if (invoiceData.taxRate && invoiceData.taxRate > 0) totalEntriesCount++;
  if (invoiceData.discount && invoiceData.discount > 0) totalEntriesCount++;
  if (invoiceData.shippingCost && invoiceData.shippingCost > 0) totalEntriesCount++;
  const totalsBoxHeight = totalEntriesCount * 6.5 + 14;

  if (currentY + totalsBoxHeight > pageHeight - 45) {
    doc.addPage();
    currentY = margin + 10;
  }

  const totalsBoxWidth = 85;
  const totalsX = pageWidth - margin - totalsBoxWidth;

  doc.setFillColor(...accentColor);
  doc.roundedRect(totalsX, currentY - 2, totalsBoxWidth, totalsBoxHeight, 2, 2, 'F');
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.3);
  doc.roundedRect(totalsX, currentY - 2, totalsBoxWidth, totalsBoxHeight, 2, 2, 'D');

  let curTotalY = currentY + 4;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkColor);

  doc.text('Subtotal:', totalsX + 5, curTotalY);
  doc.text(formatPdfCurrency(invoiceData.subtotal || 0, currencyCode), pageWidth - margin - 5, curTotalY, { align: 'right' });
  curTotalY += 6;

  if (invoiceData.taxRate && invoiceData.taxRate > 0) {
    doc.text(`Tax (${invoiceData.taxRate}%):`, totalsX + 5, curTotalY);
    doc.text(formatPdfCurrency(invoiceData.taxAmount || 0, currencyCode), pageWidth - margin - 5, curTotalY, { align: 'right' });
    curTotalY += 6;
  }

  if (invoiceData.discount && invoiceData.discount > 0) {
    doc.setTextColor(220, 38, 38);
    doc.text('Discount:', totalsX + 5, curTotalY);
    doc.text(`-${formatPdfCurrency(invoiceData.discount, currencyCode)}`, pageWidth - margin - 5, curTotalY, { align: 'right' });
    doc.setTextColor(...darkColor);
    curTotalY += 6;
  }

  if (invoiceData.shippingCost && invoiceData.shippingCost > 0) {
    doc.text('Shipping:', totalsX + 5, curTotalY);
    doc.text(formatPdfCurrency(invoiceData.shippingCost, currencyCode), pageWidth - margin - 5, curTotalY, { align: 'right' });
    curTotalY += 6;
  }

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.6);
  doc.line(totalsX + 4, curTotalY - 1, pageWidth - margin - 4, curTotalY - 1);
  curTotalY += 4;

  const totalLabel = docConfig.totalLabel;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text(totalLabel, totalsX + 5, curTotalY);
  doc.text(formatPdfCurrency(invoiceData.total || 0, currencyCode), pageWidth - margin - 5, curTotalY, { align: 'right' });

  // 6. PAYMENT INFORMATION & QR CODE (Custom Uploaded Scanner Pic OR Generated UPI QR)
  const paymentBoxWidth = totalsX - margin - 6;
  let payY = currentY;

  const showPayment = invoiceData.includePaymentDetails !== false && !(docConfig.hidePaymentByDefault && invoiceData.includePaymentDetails === undefined);
  const hasBankOrQr = showPayment && (
    invoiceData.bankName ||
    invoiceData.accountNumber ||
    invoiceData.accountHolderName ||
    invoiceData.swiftCode ||
    invoiceData.ibanNumber ||
    invoiceData.paymentQrImage ||
    invoiceData.upiId ||
    invoiceData.paymentInstructions ||
    invoiceData.paymentLink
  );

  if (invoiceData.documentType?.includes('receipt')) {
    addSectionHeader('PAYMENT ACKNOWLEDGMENT', margin, payY, paymentBoxWidth);
    payY += 7;

    doc.setFillColor(...accentColor);
    doc.roundedRect(margin, payY, paymentBoxWidth, 24, 1.5, 1.5, 'F');
    doc.setDrawColor(...colors.light);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, payY, paymentBoxWidth, 24, 1.5, 1.5, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...primaryColor);
    doc.text('PAYMENT RECEIVED & SETTLED', margin + 3.5, payY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...darkColor);
    doc.text(`Received From: ${invoiceData.clientName || 'Payer / Customer'}`, margin + 3.5, payY + 9.5);
    doc.text(`Payment Mode: ${meta.paymentMode || invoiceData.paymentMethod || 'UPI / Cash'}`, margin + 3.5, payY + 13.5);
    if (meta.originalInvoiceRef) {
      doc.text(`In Respect Of Invoice: #${meta.originalInvoiceRef}`, margin + 3.5, payY + 17.5);
    }
    if (meta.transactionRef) {
      doc.text(`Transaction / UTR #: ${meta.transactionRef}`, margin + 3.5, payY + (meta.originalInvoiceRef ? 21.5 : 17.5));
    }
    payY += 28;
  } else if (hasBankOrQr) {
    addSectionHeader('PAYMENT INSTRUCTIONS', margin, payY, paymentBoxWidth);
    payY += 9;

    // QR Code / UPI Section (Left side)
    const hasQrImage = invoiceData.paymentQrImage || invoiceData.upiId;
    if (hasQrImage) {
      try {
        let qrDataUrl = '';
        let qrAspect = 1;
        if (invoiceData.paymentQrImage) {
          const preparedQr = await loadAndPrepareImage(invoiceData.paymentQrImage);
          if (preparedQr) {
            qrDataUrl = preparedQr.dataUrl;
            qrAspect = (preparedQr.width || 1) / (preparedQr.height || 1);
          }
        } else if (invoiceData.upiId) {
          const upiUri = `upi://pay?pa=${encodeURIComponent(invoiceData.upiId.trim())}&pn=${encodeURIComponent(invoiceData.companyName || 'Merchant')}&am=${(invoiceData.total || 0).toFixed(2)}&cu=${currencyCode === 'INR' ? 'INR' : 'INR'}&tn=${encodeURIComponent('Invoice ' + invoiceData.invoiceNumber)}`;
          qrDataUrl = await QRCode.toDataURL(upiUri, { margin: 1, width: 140 });
          qrAspect = 1;
        }

        if (qrDataUrl) {
          doc.setFillColor(255, 255, 255);
          doc.roundedRect(margin + 1, payY, 28, 28, 1.5, 1.5, 'F');
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.2);
          doc.roundedRect(margin + 1, payY, 28, 28, 1.5, 1.5, 'D');

          // Preserve aspect ratio without stretching
          let qrW = 25;
          let qrH = 25;
          if (qrAspect > 1) {
            qrH = Math.min(25, 25 / qrAspect);
          } else {
            qrW = Math.min(25, 25 * qrAspect);
          }
          const qrX = margin + 2.5 + (25 - qrW) / 2;
          const qrY = payY + 1.5 + (25 - qrH) / 2;

          doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrW, qrH, undefined, 'FAST');
          
          const isDemoQr = !invoiceData.paymentQrImage;
          if (isDemoQr) {
            // Draw amber DEMO badge on top of QR code in PDF
            doc.setFillColor(245, 158, 11);
            doc.roundedRect(qrX + 1, qrY + 1, 13, 4, 0.5, 0.5, 'F');
            doc.setFontSize(6);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text('DEMO', qrX + 7.5, qrY + 3.8, { align: 'center' });
          }

          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...primaryColor);
          doc.text(
            isDemoQr 
              ? 'Scan & Pay (DEMO QR):' 
              : (invoiceData.paymentQrImage ? 'Uploaded Payment QR:' : 'Scan & Pay via UPI:'),
            margin + 32, 
            payY + 6
          );
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...darkColor);
          if (invoiceData.upiId && invoiceData.upiId.trim().length > 0) {
            doc.text(`UPI ID: ${invoiceData.upiId}${isDemoQr ? ' (Sample)' : ''}`, margin + 32, payY + 12);
            doc.setFontSize(7.5);
            const noteColor: [number, number, number] = isDemoQr ? [217, 119, 6] : lightGray;
            doc.setTextColor(...noteColor);
            doc.text(
              isDemoQr 
                ? 'Demo QR placeholder. Upload scanner photo.' 
                : 'GPay, PhonePe, Paytm, BHIM or any UPI app', 
              margin + 32, 
              payY + 18
            );
          } else {
            doc.setFontSize(7.5);
            doc.setTextColor(...lightGray);
            doc.text('Scan using PhonePe, GooglePay,', margin + 32, payY + 12);
            doc.text('Paytm, BHIM or any UPI app', margin + 32, payY + 17);
          }

          payY += 31;
        }
      } catch (e) {
        console.warn('QR Code embedding error:', e);
      }
    }

    const hasBank = invoiceData.bankName || invoiceData.accountNumber || invoiceData.accountHolderName || invoiceData.swiftCode || invoiceData.ibanNumber;
    if (hasBank) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...darkColor);
      if (invoiceData.accountHolderName) {
        doc.text(`A/C Holder: ${invoiceData.accountHolderName}`, margin + 2, payY + 2);
        payY += 5;
      }
      if (invoiceData.bankName) {
        doc.text(`Bank: ${invoiceData.bankName}`, margin + 2, payY + 2);
        payY += 5;
      }
      if (invoiceData.accountNumber) {
        doc.text(`Account No: ${invoiceData.accountNumber}`, margin + 2, payY + 2);
        payY += 5;
      }
      if (invoiceData.ifscCode || invoiceData.routingNumber) {
        doc.text(`IFSC / Routing: ${invoiceData.ifscCode || invoiceData.routingNumber}`, margin + 2, payY + 2);
        payY += 5;
      }
      if (invoiceData.swiftCode) {
        doc.text(`SWIFT / BIC: ${invoiceData.swiftCode}`, margin + 2, payY + 2);
        payY += 5;
      }
      if (invoiceData.ibanNumber) {
        doc.text(`IBAN: ${invoiceData.ibanNumber}`, margin + 2, payY + 2);
        payY += 5;
      }
      payY += 2;
    }

    if (invoiceData.paymentLink) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235); // Blue
      doc.text(`Pay Online: ${invoiceData.paymentLink}`, margin + 2, payY + 2);
      doc.setFont('helvetica', 'normal');
      payY += 7;
    }

    if (invoiceData.paymentInstructions) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(...lightGray);
      const instLines = doc.splitTextToSize(invoiceData.paymentInstructions, paymentBoxWidth - 4);
      doc.text(instLines, margin + 2, payY + 2);
      payY += instLines.length * 3.5 + 4;
    }
  }

  currentY = Math.max(currentY + totalsBoxHeight + 6, payY + 4);

  // 7. NOTES & TERMS
  if (invoiceData.notes || invoiceData.terms) {
    if (currentY > pageHeight - 35) {
      doc.addPage();
      currentY = margin + 10;
    }

    if (invoiceData.notes) {
      addSectionHeader('NOTES', margin, currentY, pageWidth - 2 * margin);
      currentY = addText(invoiceData.notes, margin + 2, currentY + 8, pageWidth - 2 * margin - 4, 8, { color: lightGray }) + 3;
    }

    if (invoiceData.terms) {
      addSectionHeader('TERMS & CONDITIONS', margin, currentY, pageWidth - 2 * margin);
      currentY = addText(invoiceData.terms, margin + 2, currentY + 8, pageWidth - 2 * margin - 4, 8, { color: lightGray });
    }
  }

  // 8. PROFESSIONAL FOOTER & PAGE NUMBERING
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

    doc.setFontSize(7.5);
    doc.setTextColor(...lightGray);
    doc.setFont('helvetica', 'normal');

    doc.text('Thank you for your business!', margin, pageHeight - 10);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });

    // Colored bottom footer accent bar matching chosen colors
    doc.setFillColor(...(customAccentRgb || primaryColor));
    doc.rect(0, pageHeight - 3, pageWidth, 3, 'F');
  }

  const safeFilename = `${invoiceData.documentType || 'invoice'}-${(invoiceData.invoiceNumber || 'document').replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`;
  doc.save(safeFilename);
}

export async function generatePDFFromElement(elementId: string, fileName: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF from element:', error);
    throw error;
  }
}
