import { jsPDF } from 'jspdf';

interface InvoiceData {
  // Company information
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyLogo?: string;
  
  // Client information
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  
  // Shipping information
  shipToName?: string;
  shipToAddress?: string;
  shipToCity?: string;
  shipToState?: string;
  shipToZip?: string;
  shipToCountry?: string;
  shipToEmail?: string;
  
  // Invoice details
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  
  // Financial information
  lineItems: Array<{
    description: string;
    quantity: number;
    rate: number;
    taxRate?: number;
    taxAmount?: number;
    amount: number;
  }>;
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  discount?: number;
  shippingCost?: number;
  total: number;
  
  // Payment information
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  paymentInstructions?: string;
  
  // Additional information
  notes?: string;
  terms?: string;
  
  // Logo and styling
  logoPreview?: string;
  documentType?: string;
}

export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    floatPrecision: 16
  });
  
  // Enhanced color scheme based on document type
  const getDocumentColors = () => {
    switch (invoiceData.documentType) {
      case 'quote':
        return {
          primary: [34, 197, 94], // Green
          accent: [220, 252, 231],
          dark: [22, 101, 52],
          light: [134, 239, 172]
        };
      case 'credit_note':
        return {
          primary: [239, 68, 68], // Red
          accent: [254, 226, 226],
          dark: [153, 27, 27],
          light: [252, 165, 165]
        };
      case 'purchase_order':
        return {
          primary: [147, 51, 234], // Purple
          accent: [243, 232, 255],
          dark: [88, 28, 135],
          light: [196, 181, 253]
        };
      default: // invoice
        return {
          primary: [59, 130, 246], // Blue
          accent: [219, 234, 254],
          dark: [30, 64, 175],
          light: [147, 197, 253]
        };
    }
  };
  
  const colors = getDocumentColors();
  const primaryColor = colors.primary;
  const accentColor = colors.accent;
  const darkColor = [31, 41, 55]; // Dark gray for text
  const lightGray = [107, 114, 128];
  
  // Page dimensions
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  
  // Enhanced helper functions
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10, options: any = {}) => {
    doc.setFontSize(fontSize);
    if (options.bold) doc.setFont('helvetica', 'bold');
    else doc.setFont('helvetica', 'normal');
    
    const lines = doc.splitTextToSize(text || '', maxWidth);
    doc.text(lines, x, y, options);
    return y + (lines.length * (fontSize * 0.35) + 2);
  };
  
  const addSection = (title: string, x: number, y: number, width: number) => {
    doc.setFillColor(...accentColor);
    doc.rect(x, y - 5, width, 8, 'F');
    doc.setTextColor(...darkColor);
    addText(title, x + 2, y + 1, width - 4, 10, { bold: true });
    return y + 12;
  };
  
  // Professional header with gradient effect simulation
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Add subtle accent strip
  doc.setFillColor(...accentColor);
  doc.rect(0, 45, pageWidth, 5, 'F');
  
  // Company logo with better positioning and error handling
  if (invoiceData.logoPreview) {
    try {
      // Determine image type from data URL
      const imageFormat = invoiceData.logoPreview.includes('data:image/png') ? 'PNG' : 
                         invoiceData.logoPreview.includes('data:image/jpeg') ? 'JPEG' : 'JPEG';
      doc.addImage(invoiceData.logoPreview, imageFormat, margin, 8, 35, 25, undefined, 'FAST');
    } catch (error) {
      console.log('Logo processing error:', error);
      // Add placeholder if logo fails
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, 8, 35, 25, 'F');
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text('LOGO', margin + 17.5, 22, { align: 'center' });
    }
  }
  
  // Document title with enhanced typography
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  const docTitle = invoiceData.documentType?.toUpperCase() || 'INVOICE';
  doc.text(docTitle, pageWidth - margin, 20, { align: 'right' });
  
  // Document number with professional styling
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`# ${invoiceData.invoiceNumber}`, pageWidth - margin, 32, { align: 'right' });
  
  // Date information in header
  doc.setFontSize(10);
  doc.text(`Date: ${new Date(invoiceData.issueDate).toLocaleDateString()}`, pageWidth - margin, 40, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(...darkColor);
  
  let currentY = 65;
  
  // Company and client information with enhanced sections
  const sectionWidth = (pageWidth - 3 * margin) / 2;
  
  // From section
  currentY = addSection('FROM', margin, currentY, sectionWidth);
  currentY = addText(invoiceData.companyName, margin + 2, currentY, sectionWidth - 4, 11, { bold: true });
  currentY = addText(invoiceData.companyAddress, margin + 2, currentY, sectionWidth - 4, 10);
  currentY = addText(invoiceData.companyEmail, margin + 2, currentY, sectionWidth - 4, 10);
  
  // To section (positioned parallel to From)
  let toY = 65; // Reset to start position for parallel layout
  toY = addSection('BILL TO', pageWidth / 2 + 5, toY, sectionWidth);
  toY = addText(invoiceData.clientName, pageWidth / 2 + 7, toY, sectionWidth - 4, 11, { bold: true });
  toY = addText(invoiceData.clientAddress, pageWidth / 2 + 7, toY, sectionWidth - 4, 10);
  toY = addText(invoiceData.clientEmail, pageWidth / 2 + 7, toY, sectionWidth - 4, 10);
  
  currentY = Math.max(currentY, toY) + 10;
  
  // Ship To section (if shipping info exists)
  const hasShippingInfo = invoiceData.shipToName || invoiceData.shipToAddress || 
                         invoiceData.shipToCity || invoiceData.shipToState;
  
  if (hasShippingInfo) {
    currentY = addSection('SHIP TO', margin, currentY, sectionWidth);
    if (invoiceData.shipToName) {
      currentY = addText(invoiceData.shipToName, margin + 2, currentY, sectionWidth - 4, 11, { bold: true });
    }
    if (invoiceData.shipToAddress) {
      currentY = addText(invoiceData.shipToAddress, margin + 2, currentY, sectionWidth - 4, 10);
    }
    
    // Construct city/state line
    const cityStateLine = [invoiceData.shipToCity, invoiceData.shipToState].filter(Boolean).join(', ');
    if (cityStateLine) {
      currentY = addText(cityStateLine, margin + 2, currentY, sectionWidth - 4, 10);
    }
    
    // Zip and country
    const zipCountryLine = [invoiceData.shipToZip, invoiceData.shipToCountry].filter(Boolean).join(' ');
    if (zipCountryLine) {
      currentY = addText(zipCountryLine, margin + 2, currentY, sectionWidth - 4, 10);
    }
    
    if (invoiceData.shipToEmail) {
      currentY = addText(invoiceData.shipToEmail, margin + 2, currentY, sectionWidth - 4, 10);
    }
    
    currentY += 10;
  }
  
  // Professional date section with enhanced styling
  doc.setFillColor(...accentColor);
  doc.rect(margin, currentY - 2, pageWidth - 2 * margin, 18, 'F');
  
  doc.setTextColor(...darkColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  // Left side dates
  doc.text('Issue Date:', margin + 5, currentY + 6);
  doc.text('Due Date:', margin + 5, currentY + 12);
  
  // Right side values
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(invoiceData.issueDate).toLocaleDateString(), margin + 35, currentY + 6);
  doc.text(new Date(invoiceData.dueDate).toLocaleDateString(), margin + 35, currentY + 12);
  
  // Additional info on right side if available
  if (invoiceData.documentType !== 'invoice') {
    const docType = invoiceData.documentType?.replace('_', ' ').toUpperCase() || '';
    doc.setFont('helvetica', 'bold');
    doc.text('Document Type:', pageWidth - 80, currentY + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(docType, pageWidth - 80, currentY + 12);
  }
  
  currentY += 25;
  
  // Enhanced line items table with tax columns
  const tableStartY = currentY;
  
  // Table header with professional styling
  doc.setFillColor(...primaryColor);
  doc.rect(margin, tableStartY, pageWidth - 2 * margin, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  
  // Enhanced column headers with tax support
  const colPositions = {
    description: margin + 3,
    qty: pageWidth - 120,
    rate: pageWidth - 95,
    taxRate: pageWidth - 70,
    taxAmount: pageWidth - 50,
    amount: pageWidth - margin - 3
  };
  
  doc.text('DESCRIPTION', colPositions.description, tableStartY + 8);
  doc.text('QTY', colPositions.qty, tableStartY + 8, { align: 'center' });
  doc.text('RATE', colPositions.rate, tableStartY + 8, { align: 'center' });
  doc.text('TAX%', colPositions.taxRate, tableStartY + 8, { align: 'center' });
  doc.text('TAX', colPositions.taxAmount, tableStartY + 8, { align: 'center' });
  doc.text('AMOUNT', colPositions.amount, tableStartY + 8, { align: 'right' });
  
  currentY = tableStartY + 18;
  
  // Reset text color for table body
  doc.setTextColor(...darkColor);
  
  // Enhanced table rows with better formatting
  doc.setFont('helvetica', 'normal');
  invoiceData.lineItems.forEach((item, index) => {
    // Check for page break
    if (currentY > pageHeight - 60) {
      doc.addPage();
      currentY = margin + 20;
      
      // Redraw header on new page
      doc.setFillColor(...primaryColor);
      doc.rect(margin, currentY - 18, pageWidth - 2 * margin, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('DESCRIPTION', colPositions.description, currentY - 10);
      doc.text('QTY', colPositions.qty, currentY - 10, { align: 'center' });
      doc.text('RATE', colPositions.rate, currentY - 10, { align: 'center' });
      doc.text('TAX%', colPositions.taxRate, currentY - 10, { align: 'center' });
      doc.text('TAX', colPositions.taxAmount, currentY - 10, { align: 'center' });
      doc.text('AMOUNT', colPositions.amount, currentY - 10, { align: 'right' });
      doc.setTextColor(...darkColor);
      doc.setFont('helvetica', 'normal');
    }
    
    // Alternate row colors for better readability
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, currentY - 4, pageWidth - 2 * margin, 12, 'F');
    }
    
    // Add subtle row border
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, currentY + 8, pageWidth - margin, currentY + 8);
    
    // Row content with proper alignment
    doc.setFontSize(9);
    
    // Description with word wrapping
    const maxDescWidth = colPositions.qty - colPositions.description - 5;
    const descLines = doc.splitTextToSize(item.description || '', maxDescWidth);
    doc.text(descLines, colPositions.description, currentY + 2);
    
    // Numeric values with proper formatting
    doc.text((item.quantity || 0).toString(), colPositions.qty, currentY + 2, { align: 'center' });
    doc.text(`$${(item.rate || 0).toFixed(2)}`, colPositions.rate, currentY + 2, { align: 'center' });
    doc.text(`${(item.taxRate || 0).toFixed(1)}%`, colPositions.taxRate, currentY + 2, { align: 'center' });
    doc.text(`$${(item.taxAmount || 0).toFixed(2)}`, colPositions.taxAmount, currentY + 2, { align: 'center' });
    doc.text(`$${(item.amount || 0).toFixed(2)}`, colPositions.amount, currentY + 2, { align: 'right' });
    
    currentY += Math.max(12, descLines.length * 3 + 8);
  });
  
  // Professional totals section with enhanced styling
  currentY += 15;
  
  // Totals background box
  const totalsBoxStart = currentY;
  const totalsBoxWidth = 80;
  const totalsBoxX = pageWidth - margin - totalsBoxWidth;
  
  // Calculate total height needed for all totals
  let totalLines = 1; // Subtotal
  if (invoiceData.taxRate && invoiceData.taxRate > 0) totalLines++;
  if (invoiceData.discount && invoiceData.discount > 0) totalLines++;
  if (invoiceData.shippingCost && invoiceData.shippingCost > 0) totalLines++;
  totalLines++; // Final total
  
  const totalsBoxHeight = totalLines * 8 + 10;
  
  // Draw totals box with subtle background
  doc.setFillColor(...accentColor);
  doc.rect(totalsBoxX - 5, totalsBoxStart - 5, totalsBoxWidth + 10, totalsBoxHeight, 'F');
  
  // Add border
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.rect(totalsBoxX - 5, totalsBoxStart - 5, totalsBoxWidth + 10, totalsBoxHeight);
  
  doc.setTextColor(...darkColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Subtotal
  doc.text('Subtotal:', totalsBoxX, currentY);
  doc.text(`$${invoiceData.subtotal.toFixed(2)}`, pageWidth - margin - 10, currentY, { align: 'right' });
  currentY += 8;
  
  // Item-level taxes (if any)
  const itemTaxTotal = invoiceData.lineItems.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
  if (itemTaxTotal > 0) {
    doc.text('Item Tax:', totalsBoxX, currentY);
    doc.text(`$${itemTaxTotal.toFixed(2)}`, pageWidth - margin - 10, currentY, { align: 'right' });
    currentY += 8;
  }
  
  // Global tax
  if (invoiceData.taxRate && invoiceData.taxRate > 0) {
    doc.text(`Tax (${invoiceData.taxRate}%):`, totalsBoxX, currentY);
    doc.text(`$${(invoiceData.taxAmount || 0).toFixed(2)}`, pageWidth - margin - 10, currentY, { align: 'right' });
    currentY += 8;
  }
  
  // Discount
  if (invoiceData.discount && invoiceData.discount > 0) {
    doc.text('Discount:', totalsBoxX, currentY);
    doc.text(`-$${invoiceData.discount.toFixed(2)}`, pageWidth - margin - 10, currentY, { align: 'right' });
    currentY += 8;
  }
  
  // Shipping
  if (invoiceData.shippingCost && invoiceData.shippingCost > 0) {
    doc.text('Shipping:', totalsBoxX, currentY);
    doc.text(`$${invoiceData.shippingCost.toFixed(2)}`, pageWidth - margin - 10, currentY, { align: 'right' });
    currentY += 8;
  }
  
  // Final total with emphasis
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.line(totalsBoxX, currentY - 2, pageWidth - margin - 10, currentY - 2);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('TOTAL:', totalsBoxX, currentY + 5);
  doc.text(`$${invoiceData.total.toFixed(2)}`, pageWidth - margin - 10, currentY + 5, { align: 'right' });
  
  currentY += 25;
  
  // Payment Information Section
  if (invoiceData.bankName || invoiceData.accountNumber || invoiceData.paymentInstructions) {
    currentY += 20;
    currentY = addSection('PAYMENT INFORMATION', margin, currentY, pageWidth - 2 * margin);
    
    if (invoiceData.bankName || invoiceData.accountNumber || invoiceData.routingNumber) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      currentY = addText('Bank Details:', margin + 2, currentY, pageWidth - 2 * margin - 4, 10, { bold: true });
      doc.setFont('helvetica', 'normal');
      
      if (invoiceData.bankName) {
        currentY = addText(`Bank: ${invoiceData.bankName}`, margin + 2, currentY, pageWidth - 2 * margin - 4, 9);
      }
      if (invoiceData.accountNumber) {
        currentY = addText(`Account: ${invoiceData.accountNumber}`, margin + 2, currentY, pageWidth - 2 * margin - 4, 9);
      }
      if (invoiceData.routingNumber) {
        currentY = addText(`Routing: ${invoiceData.routingNumber}`, margin + 2, currentY, pageWidth - 2 * margin - 4, 9);
      }
      currentY += 5;
    }
    
    if (invoiceData.paymentInstructions) {
      doc.setFont('helvetica', 'bold');
      currentY = addText('Payment Instructions:', margin + 2, currentY, pageWidth - 2 * margin - 4, 10, { bold: true });
      doc.setFont('helvetica', 'normal');
      currentY = addText(invoiceData.paymentInstructions, margin + 2, currentY, pageWidth - 2 * margin - 4, 9);
    }
  }
  
  // Notes and Terms with enhanced styling
  if (invoiceData.notes || invoiceData.terms) {
    currentY += 15;
    
    if (invoiceData.notes) {
      currentY = addSection('NOTES', margin, currentY, pageWidth - 2 * margin);
      doc.setFont('helvetica', 'normal');
      currentY = addText(invoiceData.notes, margin + 2, currentY, pageWidth - 2 * margin - 4, 9);
      currentY += 5;
    }
    
    if (invoiceData.terms) {
      currentY = addSection('TERMS & CONDITIONS', margin, currentY, pageWidth - 2 * margin);
      doc.setFont('helvetica', 'normal');
      currentY = addText(invoiceData.terms, margin + 2, currentY, pageWidth - 2 * margin - 4, 9);
    }
  }
  
  // Professional Footer
  const footerY = pageHeight - 25;
  
  // Footer separator line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  // Footer content
  doc.setTextColor(...lightGray);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  // Left side - document info
  doc.text(`${docTitle} #${invoiceData.invoiceNumber}`, margin, footerY + 8);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, footerY + 14);
  
  // Right side - branding
  doc.text('Created with InvoiceHome', pageWidth - margin, footerY + 8, { align: 'right' });
  doc.text('Professional Document Generation', pageWidth - margin, footerY + 14, { align: 'right' });
  
  // Enhanced file naming based on document type
  const filePrefix = invoiceData.documentType === 'quote' ? 'quote' :
                    invoiceData.documentType === 'credit_note' ? 'credit-note' :
                    invoiceData.documentType === 'purchase_order' ? 'purchase-order' : 'invoice';
  
  // Save the PDF with enhanced quality settings
  doc.save(`${filePrefix}-${invoiceData.invoiceNumber}.pdf`);
}
