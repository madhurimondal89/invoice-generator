import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Download, Printer, Share2, QrCode, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@shared/currencies";
import { generateInvoicePDF } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";

import { getDocumentConfig } from "@/lib/document-config";

interface InvoicePreviewProps {
  invoice?: any;
  onEdit?: () => void;
  formData?: any;
  lineItems?: any[];
  logoPreview?: string;
  template?: any;
  documentType?: string;
}

export default function InvoicePreview({
  invoice,
  onEdit,
  formData,
  lineItems = [],
  logoPreview,
  template,
  documentType = 'invoice'
}: InvoicePreviewProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [upiQrUrl, setUpiQrUrl] = useState<string>("");

  const data = formData || invoice || {};
  const items = lineItems.length > 0 ? lineItems : (invoice?.lineItems || []);
  const currency = data.currency || "USD";

  // Calculate totals
  const subtotal = items.reduce((sum: number, item: any) => {
    const baseAmount = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
    return sum + baseAmount;
  }, 0);
  const itemTaxTotal = items.reduce((sum: number, item: any) => sum + (parseFloat(item.taxAmount) || 0), 0);
  const taxRate = parseFloat(data.taxRate) || 0;
  const discount = parseFloat(data.discount) || 0;
  const shippingCost = parseFloat(data.shippingCost) || 0;
  const globalTaxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + itemTaxTotal + globalTaxAmount + shippingCost - discount;

  // Generate UPI QR Code if UPI ID is present or use uploaded custom QR image
  useEffect(() => {
    if (data.paymentQrImage) {
      setUpiQrUrl(data.paymentQrImage);
    } else if (data.upiId && data.upiId.trim().length > 0) {
      const upiUri = `upi://pay?pa=${encodeURIComponent(data.upiId.trim())}&pn=${encodeURIComponent(data.companyName || 'Merchant')}&am=${total.toFixed(2)}&cu=${currency === 'INR' ? 'INR' : 'INR'}&tn=${encodeURIComponent('Invoice ' + (data.invoiceNumber || ''))}`;
      QRCode.toDataURL(upiUri, { margin: 1, width: 160 })
        .then(url => setUpiQrUrl(url))
        .catch(err => console.warn('QR code generation error:', err));
    } else {
      setUpiQrUrl("");
    }
  }, [data.paymentQrImage, data.upiId, data.companyName, total, currency, data.invoiceNumber]);

  // Handle direct high-quality PDF download
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const pdfInvoiceData = {
        companyName: data.companyName || "Your Company Name",
        companyEmail: data.companyEmail || "",
        companyAddress: data.companyAddress || "",
        companyPhone: data.companyPhone || "",
        companyGst: data.companyGst || "",
        companyLogo: data.companyLogo,
        logoPreview: logoPreview || data.companyLogo,

        clientName: data.clientName || "Client Name",
        clientEmail: data.clientEmail || "",
        clientAddress: data.clientAddress || "",
        clientPhone: data.clientPhone || "",
        clientGst: data.clientGst || "",

        shipToName: data.shipToName,
        shipToAddress: data.shipToAddress,
        shipToCity: data.shipToCity,
        shipToState: data.shipToState,
        shipToZip: data.shipToZip,
        shipToCountry: data.shipToCountry,
        shipToEmail: data.shipToEmail,

        invoiceNumber: data.invoiceNumber || "INV-001",
        issueDate: data.issueDate || new Date().toISOString(),
        dueDate: data.dueDate || new Date().toISOString(),
        poNumber: data.poNumber,

        currency: currency,
        lineItems: items.map((it: any) => ({
          description: it.description || "Item",
          quantity: parseFloat(it.quantity) || 1,
          rate: parseFloat(it.rate) || 0,
          taxRate: parseFloat(it.taxRate) || 0,
          taxAmount: parseFloat(it.taxAmount) || 0,
          amount: parseFloat(it.amount) || ((parseFloat(it.quantity) || 1) * (parseFloat(it.rate) || 0))
        })),
        subtotal: subtotal,
        taxRate: taxRate,
        taxAmount: globalTaxAmount,
        discount: discount,
        shippingCost: shippingCost,
        total: total,

        includePaymentDetails: data.includePaymentDetails ?? true,
        paymentMethod: data.paymentMethod,
        bankName: data.bankName,
        accountHolderName: data.accountHolderName,
        accountNumber: data.accountNumber,
        routingNumber: data.routingNumber,
        ifscCode: data.ifscCode || data.routingNumber,
        swiftCode: data.swiftCode,
        ibanNumber: data.ibanNumber,
        paymentLink: data.paymentLink,
        upiId: data.upiId,
        paymentQrImage: data.paymentQrImage,
        paymentInstructions: data.paymentInstructions,

        notes: data.notes,
        terms: data.terms,
        documentType: documentType || data.documentType || "invoice",
        metadata: data.metadata,
        primaryColor: data?.primaryColor || template?.templateData?.primaryColor,
        accentColor: data?.accentColor || template?.templateData?.accentColor,
      };

      await generateInvoicePDF(pdfInvoiceData);
      toast({
        title: "PDF Downloaded",
        description: `Successfully generated ${data.invoiceNumber || 'invoice'}.pdf`,
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast({
        title: "Download Failed",
        description: "There was an issue generating your PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Direct Print
  const handlePrint = () => {
    window.print();
  };

  const docConfig = getDocumentConfig(documentType);
  const templatePrimaryColor = data?.primaryColor || template?.templateData?.primaryColor;
  const templateAccentColor = data?.accentColor || template?.templateData?.accentColor;

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    const text = `*${docConfig.title} from ${data.companyName || 'Us'}*\n` +
      `Number: #${data.invoiceNumber || 'INV-001'}\n` +
      `${docConfig.partyHeaders.to}: ${data.clientName || 'Client'}\n` +
      `${docConfig.totalLabel} ${formatCurrency(total, currency)}\n` +
      `${docConfig.dateLabels.due}: ${data.dueDate ? new Date(data.dueDate).toLocaleDateString() : 'Immediate'}\n\n` +
      `Thank you for your business!`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const styles = docConfig.uiStyles;

  return (
    <div className="space-y-4">
      {/* Quick Action Bar (Hidden during print) */}
      <div className="no-print bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs px-2.5 py-1">
            Live Preview
          </Badge>
          <span className="text-xs text-gray-500 font-medium">
            {currency} • {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onEdit && (
            <Button onClick={onEdit} variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Edit className="h-3.5 w-3.5" /> Edit
            </Button>
          )}

          <Button
            onClick={handleWhatsAppShare}
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
          >
            <Share2 className="h-3.5 w-3.5 text-emerald-600" /> WhatsApp
          </Button>

          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
          >
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>

          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            size="sm"
            className="h-8 gap-1.5 text-xs shadow-sm bg-primary hover:bg-primary/90"
          >
            <Download className="h-3.5 w-3.5" />
            {isDownloading ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      {/* Invoice Document Preview Card */}
      <Card className="invoice-preview-card border shadow-lg bg-white overflow-hidden text-gray-800">
        <CardContent className="p-0">
          {/* Top Colored Header Banner */}
          <div
            className={`${templatePrimaryColor ? '' : styles.headerBg} p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white transition-colors`}
            style={templatePrimaryColor ? { backgroundColor: templatePrimaryColor, backgroundImage: 'none', color: '#ffffff' } : undefined}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="text-2xl font-bold tracking-tight uppercase">
                  {docConfig.title}
                </div>
                {documentType?.includes('receipt') && (
                  <span className="bg-emerald-400 text-emerald-950 font-black text-[11px] uppercase px-2.5 py-0.5 rounded shadow-sm tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                  </span>
                )}
              </div>
              <div className="text-sm font-medium opacity-90">
                # {data.invoiceNumber || `${docConfig.prefix}-001`}
              </div>
              <div className="text-xs opacity-75">
                {docConfig.dateLabels.issue}: {data.issueDate ? new Date(data.issueDate).toLocaleDateString() : new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Logo */}
            <div className="bg-white rounded-xl p-2 shadow-sm min-w-[80px] h-20 flex items-center justify-center border border-white/20">
              {logoPreview || data.companyLogo ? (
                <img
                  src={logoPreview || data.companyLogo}
                  alt="Company Logo"
                  className="max-h-16 max-w-[120px] object-contain"
                />
              ) : (
                <span className="text-xs font-bold text-gray-400 px-3">LOGO</span>
              )}
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* From & Bill To Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  {docConfig.partyHeaders.from}
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {data.companyName || "Your Company Name"}
                </p>
                {data.companyAddress && (
                  <p className="text-xs text-gray-600 whitespace-pre-line">{data.companyAddress}</p>
                )}
                {data.companyEmail && (
                  <p className="text-xs text-gray-500">Email: {data.companyEmail}</p>
                )}
                {data.companyPhone && (
                  <p className="text-xs text-gray-500">Phone: {data.companyPhone}</p>
                )}
                {data.companyGst && (
                  <p className="text-xs font-medium text-gray-700">GSTIN: {data.companyGst}</p>
                )}
              </div>

              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  {docConfig.partyHeaders.to}
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {data.clientName || "Client / Customer Name"}
                </p>
                {data.clientAddress && (
                  <p className="text-xs text-gray-600 whitespace-pre-line">{data.clientAddress}</p>
                )}
                {data.clientEmail && (
                  <p className="text-xs text-gray-500">Email: {data.clientEmail}</p>
                )}
                {data.clientPhone && (
                  <p className="text-xs text-gray-500">Phone: {data.clientPhone}</p>
                )}
                {data.clientGst && (
                  <p className="text-xs font-medium text-gray-700">GSTIN: {data.clientGst}</p>
                )}
              </div>
            </div>

            {/* Dates & Reference Bar */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-4 py-2.5 px-4 bg-slate-50 border border-slate-200/60 rounded-lg text-xs">
                <div>
                  <span className="text-gray-500 font-medium mr-1.5">{docConfig.dateLabels.issue}:</span>
                  <span className="font-semibold text-gray-800">
                    {data.issueDate ? new Date(data.issueDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="text-gray-300">|</div>
                <div>
                  <span className="text-gray-500 font-medium mr-1.5">{docConfig.dateLabels.due}:</span>
                  <span className="font-semibold text-gray-800">
                    {data.dueDate ? new Date(data.dueDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                {data.poNumber && (
                  <>
                    <div className="text-gray-300">|</div>
                    <div>
                      <span className="text-gray-500 font-medium mr-1.5">PO #:</span>
                      <span className="font-semibold text-gray-800">{data.poNumber}</span>
                    </div>
                  </>
                )}
                <div className="ml-auto font-medium text-gray-600">
                  Currency: <span className="font-bold text-gray-900">{currency}</span>
                </div>
              </div>

              {/* Specialized Document Metadata (Receipt, Credit Note & Purchase Order) */}
              {(data.metadata?.originalInvoiceRef || data.metadata?.reason || data.metadata?.deliveryDate || data.metadata?.shippingMethod || data.metadata?.paymentMode || data.metadata?.transactionRef || data.metadata?.paymentStatus) && (
                <div className={`flex flex-wrap items-center gap-3.5 py-2.5 px-4 rounded-lg text-xs border ${
                  documentType?.includes('receipt')
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-blue-50/60 border-blue-200/70 text-slate-900'
                }`}>
                  <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 opacity-90">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {documentType?.includes('receipt') ? 'Payment Receipt Details:' : 'Reference Info:'}
                  </span>
                  {data.metadata?.originalInvoiceRef && (
                    <div>
                      <span className="text-gray-500 font-medium mr-1.5">Against Invoice:</span>
                      <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-2xs">
                        {data.metadata.originalInvoiceRef}
                      </span>
                    </div>
                  )}
                  {data.metadata?.paymentMode && (
                    <div>
                      <span className="text-gray-500 font-medium mr-1.5">Mode of Payment:</span>
                      <span className="font-semibold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded">
                        {data.metadata.paymentMode}
                      </span>
                    </div>
                  )}
                  {data.metadata?.transactionRef && (
                    <div>
                      <span className="text-gray-500 font-medium mr-1.5">Txn / UTR / Cheque #:</span>
                      <span className="font-mono font-medium text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                        {data.metadata.transactionRef}
                      </span>
                    </div>
                  )}
                  {data.metadata?.paymentStatus && (
                    <div>
                      <span className="text-gray-500 font-medium mr-1.5">Status:</span>
                      <span className="font-bold text-emerald-800 uppercase text-[10px] bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        {data.metadata.paymentStatus}
                      </span>
                    </div>
                  )}
                  {data.metadata?.reason && (
                    <div>
                      <span className="text-gray-500 font-medium mr-1.5">Reason:</span>
                      <span className="font-medium text-gray-800">{data.metadata.reason}</span>
                    </div>
                  )}
                  {data.metadata?.deliveryDate && (
                    <div>
                      <span className="text-gray-500 font-medium mr-1.5">Expected Delivery:</span>
                      <span className="font-semibold text-blue-950 bg-white px-2 py-0.5 rounded border border-blue-200">
                        {new Date(data.metadata.deliveryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {data.metadata?.shippingMethod && (
                    <div>
                      <span className="text-gray-500 font-medium mr-1.5">Shipping Method:</span>
                      <span className="font-medium text-gray-800">{data.metadata.shippingMethod}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-xs text-left">
                <thead
                  className={`${templatePrimaryColor ? '' : styles.tableHeaderBg} text-[11px] font-semibold uppercase tracking-wider text-white transition-colors`}
                  style={templatePrimaryColor ? { backgroundColor: templatePrimaryColor, backgroundImage: 'none', color: '#ffffff' } : undefined}
                >
                  <tr>
                    <th className="py-3 px-4">Item Description</th>
                    <th className="py-3 px-3 text-center w-16">Qty</th>
                    <th className="py-3 px-3 text-right w-24">Rate</th>
                    {itemTaxTotal > 0 && <th className="py-3 px-3 text-center w-16">Tax</th>}
                    <th className="py-3 px-4 text-right w-28">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.length > 0 ? (
                    items.map((item: any, idx: number) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {item.description || "Service / Product"}
                        </td>
                        <td className="py-3 px-3 text-center text-gray-600">
                          {item.quantity || 1}
                        </td>
                        <td className="py-3 px-3 text-right text-gray-600">
                          {formatCurrency(item.rate || 0, currency)}
                        </td>
                        {itemTaxTotal > 0 && (
                          <td className="py-3 px-3 text-center text-gray-500">
                            {item.taxRate ? `${item.taxRate}%` : formatCurrency(item.taxAmount || 0, currency)}
                          </td>
                        )}
                        <td className="py-3 px-4 text-right font-semibold text-gray-900">
                          {formatCurrency(item.amount || ((item.quantity || 1) * (item.rate || 0)), currency)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-400 italic">
                        No items added yet. Click &apos;Add Item&apos; to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals & Payment (UPI QR) Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Payment Details & UPI QR Code */}
              <div className="space-y-4">
                {documentType?.includes('receipt') ? (
                  <div className="bg-emerald-50/80 rounded-xl p-4 border border-emerald-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Payment Settlement Acknowledgment
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                        {data.metadata?.paymentStatus || 'PAID IN FULL'}
                      </span>
                    </div>
                    <div className="text-xs space-y-1.5 text-gray-700 bg-white/90 p-3 rounded-lg border border-emerald-100">
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-gray-400 block font-medium text-[10px]">Payment Mode</span>
                          <span className="font-semibold text-gray-900">{data.metadata?.paymentMode || 'UPI / Cash / Bank'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-medium text-[10px]">Amount Received</span>
                          <span className="font-bold text-emerald-700">{formatCurrency(total, currency)}</span>
                        </div>
                        {data.metadata?.originalInvoiceRef && (
                          <div>
                            <span className="text-gray-400 block font-medium text-[10px]">Against Invoice #</span>
                            <span className="font-mono font-bold text-gray-900">{data.metadata.originalInvoiceRef}</span>
                          </div>
                        )}
                        {data.metadata?.transactionRef && (
                          <div>
                            <span className="text-gray-400 block font-medium text-[10px]">Transaction / UTR #</span>
                            <span className="font-mono text-gray-800">{data.metadata.transactionRef}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-emerald-800 pt-1.5 border-t border-emerald-50 italic">
                        This document confirms that payment has been received in full and credited against the referenced billing record.
                      </p>
                    </div>
                  </div>
                ) : data.includePaymentDetails !== false && (data.upiId || data.bankName || data.accountNumber || data.accountHolderName || data.swiftCode || data.ibanNumber || data.paymentInstructions || data.paymentLink || data.paymentQrImage) && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block">
                        Payment Details
                      </span>
                      {data.paymentMethod && (
                        <span className="text-[10px] font-medium bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded uppercase">
                          {data.paymentMethod === 'upi_qr' ? 'UPI / QR Code' : data.paymentMethod === 'bank_wire' ? 'Bank Wire' : data.paymentMethod === 'link' ? 'Online Payment' : data.paymentMethod}
                        </span>
                      )}
                    </div>

                    {/* Dynamic UPI QR Code or Uploaded Scanner Image */}
                    {upiQrUrl && (() => {
                      const isDemoQr = !data.paymentQrImage;
                      return (
                        <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          isDemoQr 
                            ? 'bg-amber-50/80 border-amber-300/80 shadow-xs' 
                            : 'bg-emerald-50/80 border-emerald-200 shadow-xs'
                        }`}>
                          <div className="relative shrink-0">
                            <img
                              src={upiQrUrl}
                              alt={isDemoQr ? "Demo QR Code" : "Uploaded Payment QR"}
                              className="w-20 h-20 rounded bg-white p-1 shadow-sm object-contain"
                            />
                            {isDemoQr && (
                              <span className="absolute top-1 left-1 bg-amber-500 text-white font-black text-[9px] uppercase px-1.5 py-0.5 rounded shadow tracking-wider border border-amber-600">
                                DEMO
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className={`flex items-center gap-1.5 font-bold text-xs ${
                              isDemoQr ? 'text-amber-900' : 'text-emerald-800'
                            }`}>
                              <QrCode className={`h-3.5 w-3.5 ${isDemoQr ? 'text-amber-600' : 'text-emerald-600'}`} />
                              {isDemoQr ? (
                                <span className="flex items-center gap-1.5">
                                  <span className="bg-amber-200 text-amber-950 text-[10px] px-1.5 py-0.5 rounded font-black border border-amber-300">
                                    DEMO
                                  </span>
                                  <span>Scan & Pay (Demo)</span>
                                </span>
                              ) : (
                                <span>{data.paymentQrImage ? 'Uploaded Payment QR' : 'Scan & Pay (UPI)'}</span>
                              )}
                            </div>
                            {data.upiId && (
                              <p className="text-[11px] text-gray-700 font-mono font-medium">
                                {data.upiId} {isDemoQr ? '(Sample)' : ''}
                              </p>
                            )}
                            <p className={`text-[10px] ${isDemoQr ? 'text-amber-700 font-medium' : 'text-emerald-600'}`}>
                              {isDemoQr 
                                ? '⚠️ Demo QR code. Upload your payment scanner photo to display yours.' 
                                : 'GPay, PhonePe, Paytm, BHIM or any UPI App'
                              }
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                    {(data.accountHolderName || data.bankName || data.accountNumber || data.ifscCode || data.routingNumber || data.swiftCode || data.ibanNumber) && (
                      <div className="text-xs space-y-1 text-gray-600 bg-white/80 p-2.5 rounded-lg border border-slate-200/60">
                        {data.accountHolderName && <p><span className="font-medium text-gray-800">Account Holder:</span> {data.accountHolderName}</p>}
                        {data.bankName && <p><span className="font-medium text-gray-800">Bank:</span> {data.bankName}</p>}
                        {data.accountNumber && <p><span className="font-medium text-gray-800">Account No:</span> <span className="font-mono">{data.accountNumber}</span></p>}
                        {(data.ifscCode || data.routingNumber) && (
                          <p><span className="font-medium text-gray-800">IFSC / Routing:</span> <span className="font-mono">{data.ifscCode || data.routingNumber}</span></p>
                        )}
                        {data.swiftCode && <p><span className="font-medium text-gray-800">SWIFT / BIC:</span> <span className="font-mono font-semibold text-slate-800">{data.swiftCode}</span></p>}
                        {data.ibanNumber && <p><span className="font-medium text-gray-800">IBAN:</span> <span className="font-mono font-semibold text-slate-800">{data.ibanNumber}</span></p>}
                      </div>
                    )}

                    {data.paymentLink && (
                      <div className="text-xs bg-blue-50/80 p-2.5 rounded-lg border border-blue-200/80">
                        <span className="font-semibold text-blue-900 block mb-0.5">Pay Online:</span>
                        <a 
                          href={data.paymentLink.startsWith('http') ? data.paymentLink : `https://${data.paymentLink}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 underline font-mono text-[11px] break-all hover:text-blue-800"
                        >
                          {data.paymentLink}
                        </a>
                      </div>
                    )}

                    {data.paymentInstructions && (
                      <p className="text-xs text-gray-500 italic whitespace-pre-wrap">{data.paymentInstructions}</p>
                    )}
                  </div>
                )}

                {data.notes && (
                  <div className="text-xs text-gray-600 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                    <span className="font-semibold text-gray-800 block mb-1">Notes:</span>
                    <p className="whitespace-pre-line">{data.notes}</p>
                  </div>
                )}
              </div>

              {/* Totals Box */}
              <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200 space-y-2.5 h-fit">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(subtotal, currency)}</span>
                </div>

                {itemTaxTotal > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Item Taxes:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(itemTaxTotal, currency)}</span>
                  </div>
                )}

                {taxRate > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Tax ({taxRate}%):</span>
                    <span className="font-medium text-gray-900">{formatCurrency(globalTaxAmount, currency)}</span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-xs text-red-600">
                    <span>Discount:</span>
                    <span className="font-medium">-{formatCurrency(discount, currency)}</span>
                  </div>
                )}

                {shippingCost > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Shipping:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(shippingCost, currency)}</span>
                  </div>
                )}

                <div className="pt-2.5 border-t border-gray-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">
                    {docConfig.totalLabel}
                  </span>
                  <span className="text-lg font-bold" style={{ color: templatePrimaryColor || undefined }}>
                    {formatCurrency(total, currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms & Footer */}
            {data.terms && (
              <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-500">
                <span className="font-semibold text-gray-700 mr-1">Terms:</span>
                {data.terms}
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 flex items-center justify-center text-[11px] text-gray-400">
              <span>Thank you for your business!</span>
            </div>
          </div>

          {/* Bottom Footer Accent Stripe */}
          <div
            className="h-2.5 w-full transition-colors"
            style={{
              backgroundColor: templateAccentColor || templatePrimaryColor || '#2563eb'
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
