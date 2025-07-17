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
  
  // Invoice details
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  
  // Financial information
  lineItems: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  discount?: number;
  total: number;
  
  // Additional information
  notes?: string;
  terms?: string;
  
  // Logo
  logoPreview?: string;
}

export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<void> {
  const doc = new jsPDF();
  
  // Set up colors
  const primaryColor = [37, 99, 235]; // Blue
  const accentColor = [245, 158, 11]; // Yellow
  const darkColor = [31, 41, 55]; // Dark gray
  const lightColor = [107, 114, 128]; // Light gray
  
  // Page dimensions
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  
  // Helper function to add text with word wrapping
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.4);
  };
  
  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Company logo
  if (invoiceData.logoPreview) {
    try {
      doc.addImage(invoiceData.logoPreview, 'JPEG', margin, 10, 30, 20);
    } catch (error) {
      console.log('Error adding logo:', error);
    }
  }
  
  // Invoice title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth - margin, 25, { align: 'right' });
  
  // Invoice number
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`# ${invoiceData.invoiceNumber}`, pageWidth - margin, 35, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(...darkColor);
  
  let currentY = 60;
  
  // Company and client information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('From:', margin, currentY);
  doc.text('To:', pageWidth / 2 + 10, currentY);
  
  currentY += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Company info
  let companyY = currentY;
  doc.setFont('helvetica', 'bold');
  companyY = addText(invoiceData.companyName, margin, companyY, pageWidth / 2 - 30, 10);
  doc.setFont('helvetica', 'normal');
  companyY = addText(invoiceData.companyAddress, margin, companyY, pageWidth / 2 - 30, 10);
  companyY = addText(invoiceData.companyEmail, margin, companyY, pageWidth / 2 - 30, 10);
  
  // Client info
  let clientY = currentY;
  doc.setFont('helvetica', 'bold');
  clientY = addText(invoiceData.clientName, pageWidth / 2 + 10, clientY, pageWidth / 2 - 30, 10);
  doc.setFont('helvetica', 'normal');
  clientY = addText(invoiceData.clientAddress, pageWidth / 2 + 10, clientY, pageWidth / 2 - 30, 10);
  clientY = addText(invoiceData.clientEmail, pageWidth / 2 + 10, clientY, pageWidth / 2 - 30, 10);
  
  currentY = Math.max(companyY, clientY) + 20;
  
  // Invoice dates
  doc.setFontSize(10);
  doc.text('Issue Date:', margin, currentY);
  doc.text(new Date(invoiceData.issueDate).toLocaleDateString(), margin + 30, currentY);
  doc.text('Due Date:', margin + 80, currentY);
  doc.text(new Date(invoiceData.dueDate).toLocaleDateString(), margin + 110, currentY);
  
  currentY += 20;
  
  // Line items table
  const tableStartY = currentY;
  
  // Table header
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, tableStartY, pageWidth - 2 * margin, 15, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Description', margin + 5, tableStartY + 10);
  doc.text('Qty', pageWidth - 100, tableStartY + 10, { align: 'right' });
  doc.text('Rate', pageWidth - 70, tableStartY + 10, { align: 'right' });
  doc.text('Amount', pageWidth - margin - 5, tableStartY + 10, { align: 'right' });
  
  currentY = tableStartY + 20;
  
  // Table rows
  doc.setFont('helvetica', 'normal');
  invoiceData.lineItems.forEach((item, index) => {
    if (currentY > pageHeight - 50) {
      doc.addPage();
      currentY = margin;
    }
    
    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, currentY - 5, pageWidth - 2 * margin, 15, 'F');
    }
    
    doc.text(item.description, margin + 5, currentY + 5);
    doc.text(item.quantity.toString(), pageWidth - 100, currentY + 5, { align: 'right' });
    doc.text(`$${item.rate.toFixed(2)}`, pageWidth - 70, currentY + 5, { align: 'right' });
    doc.text(`$${item.amount.toFixed(2)}`, pageWidth - margin - 5, currentY + 5, { align: 'right' });
    
    currentY += 15;
  });
  
  // Totals section
  currentY += 10;
  const totalsX = pageWidth - 100;
  
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsX - 30, currentY);
  doc.text(`$${invoiceData.subtotal.toFixed(2)}`, pageWidth - margin - 5, currentY, { align: 'right' });
  currentY += 15;
  
  if (invoiceData.taxRate && invoiceData.taxRate > 0) {
    doc.text(`Tax (${invoiceData.taxRate}%):`, totalsX - 30, currentY);
    doc.text(`$${(invoiceData.taxAmount || 0).toFixed(2)}`, pageWidth - margin - 5, currentY, { align: 'right' });
    currentY += 15;
  }
  
  if (invoiceData.discount && invoiceData.discount > 0) {
    doc.text('Discount:', totalsX - 30, currentY);
    doc.text(`-$${invoiceData.discount.toFixed(2)}`, pageWidth - margin - 5, currentY, { align: 'right' });
    currentY += 15;
  }
  
  // Total line
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.line(totalsX - 30, currentY, pageWidth - margin, currentY);
  currentY += 10;
  
  doc.text('Total:', totalsX - 30, currentY);
  doc.text(`$${invoiceData.total.toFixed(2)}`, pageWidth - margin - 5, currentY, { align: 'right' });
  
  // Notes and terms
  if (invoiceData.notes || invoiceData.terms) {
    currentY += 30;
    
    if (invoiceData.notes) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Notes:', margin, currentY);
      currentY += 10;
      
      doc.setFont('helvetica', 'normal');
      currentY = addText(invoiceData.notes, margin, currentY, pageWidth - 2 * margin, 10);
      currentY += 10;
    }
    
    if (invoiceData.terms) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Terms:', margin, currentY);
      currentY += 10;
      
      doc.setFont('helvetica', 'normal');
      currentY = addText(invoiceData.terms, margin, currentY, pageWidth - 2 * margin, 10);
    }
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...lightColor);
  doc.text('Generated by InvoiceHome', pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  // Save the PDF
  doc.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
}
