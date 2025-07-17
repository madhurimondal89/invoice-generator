import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Download, Mail, Eye } from "lucide-react";
import { formatCurrency } from "@shared/currencies";

// Helper function to get document title
const getDocumentTitle = (documentType: string) => {
  switch (documentType) {
    case 'quote': return 'QUOTE';
    case 'credit_note': return 'CREDIT NOTE';
    case 'purchase_order': return 'PURCHASE ORDER';
    default: return 'INVOICE';
  }
};

interface InvoicePreviewProps {
  invoice?: any;
  onEdit?: () => void;
  formData?: any;
  lineItems?: any[];
  logoPreview?: string;
  template?: any;
  documentType?: 'invoice' | 'quote' | 'credit_note' | 'purchase_order';
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
  // Use either passed formData or invoice data
  const data = formData || invoice || {};
  const items = lineItems.length > 0 ? lineItems : (invoice?.lineItems || []);
  const currency = data.currency || "USD";
  
  // Get template styling data
  const templateData = template?.templateData || {};
  const getTemplateStyles = () => {
    const baseStyles = {
      headerBg: "bg-white",
      headerText: "text-gray-900", 
      accentColor: "text-blue-600",
      borderColor: "border-gray-200",
      primaryFont: "font-sans"
    };
    
    if (template?.category === "modern") {
      return {
        ...baseStyles,
        headerBg: "bg-gradient-to-r from-blue-50 to-blue-100",
        accentColor: "text-blue-600",
        borderColor: "border-blue-200"
      };
    } else if (template?.category === "creative") {
      return {
        ...baseStyles,
        headerBg: "bg-gradient-to-r from-purple-50 to-pink-50",
        accentColor: "text-purple-600",
        borderColor: "border-purple-200"
      };
    } else if (template?.category === "minimal") {
      return {
        ...baseStyles,
        headerBg: "bg-gray-50",
        accentColor: "text-gray-600",
        borderColor: "border-gray-100"
      };
    }
    
    // Document type specific styling
    if (template?.documentType === 'credit_note') {
      return {
        ...baseStyles,
        headerBg: "bg-gradient-to-r from-red-50 to-red-100",
        accentColor: "text-red-600",
        borderColor: "border-red-200"
      };
    } else if (template?.documentType === 'quote') {
      return {
        ...baseStyles,
        headerBg: "bg-gradient-to-r from-green-50 to-green-100",
        accentColor: "text-green-600",
        borderColor: "border-green-200"
      };
    } else if (template?.documentType === 'purchase_order') {
      return {
        ...baseStyles,
        headerBg: "bg-gradient-to-r from-purple-50 to-purple-100",
        accentColor: "text-purple-600",
        borderColor: "border-purple-200"
      };
    }
    
    return baseStyles;
  };
  
  const styles = getTemplateStyles();
  
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Preview Actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Invoice Preview</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" title="Zoom Out">
            <Eye className="h-4 w-4" />
          </Button>
          {onEdit && (
            <Button onClick={onEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Preview */}
      <Card className="invoice-preview">
        <CardContent className="p-8">
          {/* Header */}
          <div className={`invoice-header ${styles.headerBg} -m-8 p-8 mb-8 ${styles.borderColor} border-b`}>
            <div>
              <h1 className={`invoice-title ${styles.accentColor} ${styles.primaryFont}`}>
                {getDocumentTitle(documentType)}
              </h1>
              <p className={`invoice-number ${styles.accentColor}`}>
                # {data.invoiceNumber || "INV-001"}
              </p>
            </div>
            <div className="text-right">
              <div className="w-20 h-20 bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                {logoPreview || data.companyLogo ? (
                  <img 
                    src={logoPreview || data.companyLogo} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <span className="text-xs text-gray-500">LOGO</span>
                )}
              </div>
            </div>
          </div>

          {/* Company and Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="invoice-section">
              <h3 className={`invoice-section-title ${styles.accentColor} ${styles.primaryFont}`}>From:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className={`font-medium ${styles.headerText}`}>{data.companyName || "Your Company Name"}</p>
                <p>{data.companyAddress || "Your business address"}</p>
                <p>{data.companyEmail || "your@company.com"}</p>
              </div>
            </div>
            <div className="invoice-section">
              <h3 className={`invoice-section-title ${styles.accentColor} ${styles.primaryFont}`}>To:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className={`font-medium ${styles.headerText}`}>{data.clientName || "Client Name"}</p>
                <p>{data.clientAddress || "Client address"}</p>
                <p>{data.clientEmail || "client@company.com"}</p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          {(data.shipToName || data.shipToAddress || data.shipToCity) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="invoice-section">
                <h3 className={`invoice-section-title ${styles.accentColor} ${styles.primaryFont}`}>Ship To:</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className={`font-medium ${styles.headerText}`}>{data.shipToName || ""}</p>
                  <p>{data.shipToAddress || ""}</p>
                  <p>{data.shipToCity && data.shipToState ? `${data.shipToCity}, ${data.shipToState}` : ""}</p>
                  <p>{data.shipToZip || ""} {data.shipToCountry || ""}</p>
                  {data.shipToEmail && <p>{data.shipToEmail}</p>}
                </div>
              </div>
              <div></div>
            </div>
          )}

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-sm">
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Issue Date:</span>
                  <span>{formatDate(data.issueDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Due Date:</span>
                  <span>{formatDate(data.dueDate)}</span>
                </div>
              </div>
            </div>
            <div>
              {data.status && (
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Status:</span>
                  <Badge variant="outline" className="text-xs">
                    {data.status}
                  </Badge>
                </div>
              )}
              {data.paymentStatus && (
                <div className="flex justify-between">
                  <span className="font-medium">Payment:</span>
                  <Badge variant="outline" className="text-xs">
                    {data.paymentStatus}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Line Items */}
          <div className="invoice-section">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="text-right w-20">Qty</th>
                  <th className="text-right w-24">Rate</th>
                  <th className="text-right w-16">Tax %</th>
                  <th className="text-right w-20">Tax</th>
                  <th className="text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="py-3">
                        {item.description || "Service description"}
                      </td>
                      <td className="text-right py-3">
                        {item.quantity || 1}
                      </td>
                      <td className="text-right py-3">
                        {formatCurrency(item.rate || 0, currency)}
                      </td>
                      <td className="text-right py-3">
                        {(item.taxRate || 0).toFixed(1)}%
                      </td>
                      <td className="text-right py-3">
                        {formatCurrency(item.taxAmount || 0, currency)}
                      </td>
                      <td className="text-right py-3">
                        {formatCurrency(item.amount || 0, currency)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No line items added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="invoice-total-section">
            <div className="invoice-total-table">
              <div className="invoice-total-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal, currency)}</span>
              </div>
              {itemTaxTotal > 0 && (
                <div className="invoice-total-row">
                  <span>Item Tax:</span>
                  <span>{formatCurrency(itemTaxTotal, currency)}</span>
                </div>
              )}
              {taxRate > 0 && (
                <div className="invoice-total-row">
                  <span>Additional Tax ({taxRate}%):</span>
                  <span>{formatCurrency(globalTaxAmount, currency)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="invoice-total-row">
                  <span>Discount:</span>
                  <span>-{formatCurrency(discount, currency)}</span>
                </div>
              )}
              {shippingCost > 0 && (
                <div className="invoice-total-row">
                  <span>Shipping:</span>
                  <span>{formatCurrency(shippingCost, currency)}</span>
                </div>
              )}
              <div className="invoice-total-row invoice-total-final">
                <span>Total:</span>
                <span>{formatCurrency(total, currency)}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {(data.bankName || data.accountNumber || data.paymentInstructions) && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className={`font-medium ${styles.accentColor} mb-4`}>Payment Information</h3>
              {(data.bankName || data.accountNumber || data.routingNumber) && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Bank Details:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {data.bankName && <p>Bank: {data.bankName}</p>}
                    {data.accountNumber && <p>Account: {data.accountNumber}</p>}
                    {data.routingNumber && <p>Routing: {data.routingNumber}</p>}
                  </div>
                </div>
              )}
              {data.paymentInstructions && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Payment Instructions:</h4>
                  <div className="text-sm text-gray-600 whitespace-pre-wrap">
                    {data.paymentInstructions}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes and Terms */}
          {(data.notes || data.terms) && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              {data.notes && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
                  <p className="text-sm text-gray-600">{data.notes}</p>
                </div>
              )}
              {data.terms && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Terms:</h4>
                  <p className="text-sm text-gray-600">{data.terms}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
