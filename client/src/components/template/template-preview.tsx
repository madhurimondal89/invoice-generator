import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TemplatePreviewProps {
  template: any;
  className?: string;
}

export default function TemplatePreview({ template, className = "" }: TemplatePreviewProps) {
  const templateData = template.templateData || {};
  
  // Get styling based on template category and document type
  const getPreviewStyles = () => {
    const baseStyles = {
      headerBg: "bg-white",
      headerText: "text-gray-900",
      accentColor: "text-blue-600",
      borderColor: "border-gray-200",
      primaryFont: "font-sans",
      cardBg: "bg-white",
      tableHeaderBg: "bg-gray-50"
    };
    
    // Document type specific styling first
    if (template.documentType === 'credit_note') {
      const creditStyles = {
        ...baseStyles,
        headerBg: "bg-gradient-to-r from-red-50 to-red-100",
        accentColor: "text-red-600",
        borderColor: "border-red-200",
        tableHeaderBg: "bg-red-50"
      };
      
      // Combine with category styling
      if (template.category === "modern") {
        return { ...creditStyles, headerBg: "bg-gradient-to-br from-red-100 to-red-200" };
      } else if (template.category === "creative") {
        return { ...creditStyles, headerBg: "bg-gradient-to-r from-red-100 via-pink-50 to-red-100", primaryFont: "font-serif" };
      } else if (template.category === "minimal") {
        return { ...creditStyles, headerBg: "bg-red-50", borderColor: "border-red-100" };
      }
      return creditStyles;
      
    } else if (template.documentType === 'quote') {
      const quoteStyles = {
        ...baseStyles,
        headerBg: "bg-gradient-to-r from-green-50 to-green-100",
        accentColor: "text-green-600",
        borderColor: "border-green-200",
        tableHeaderBg: "bg-green-50"
      };
      
      if (template.category === "modern") {
        return { ...quoteStyles, headerBg: "bg-gradient-to-br from-green-100 to-green-200" };
      } else if (template.category === "creative") {
        return { ...quoteStyles, headerBg: "bg-gradient-to-r from-green-100 via-emerald-50 to-green-100", primaryFont: "font-serif" };
      } else if (template.category === "minimal") {
        return { ...quoteStyles, headerBg: "bg-green-50", borderColor: "border-green-100" };
      }
      return quoteStyles;
      
    } else if (template.documentType === 'purchase_order') {
      const poStyles = {
        ...baseStyles,
        headerBg: "bg-gradient-to-r from-purple-50 to-purple-100",
        accentColor: "text-purple-600",
        borderColor: "border-purple-200",
        tableHeaderBg: "bg-purple-50"
      };
      
      if (template.category === "modern") {
        return { ...poStyles, headerBg: "bg-gradient-to-br from-purple-100 to-purple-200" };
      } else if (template.category === "creative") {
        return { ...poStyles, headerBg: "bg-gradient-to-r from-purple-100 via-pink-50 to-purple-100", primaryFont: "font-serif" };
      } else if (template.category === "minimal") {
        return { ...poStyles, headerBg: "bg-purple-50", borderColor: "border-purple-100" };
      }
      return poStyles;
    }
    
    // Category specific styling for invoices
    if (template.category === "modern") {
      return {
        ...baseStyles,
        headerBg: "bg-gradient-to-br from-blue-100 to-blue-200",
        accentColor: "text-blue-600",
        borderColor: "border-blue-200",
        tableHeaderBg: "bg-blue-50"
      };
    } else if (template.category === "creative") {
      return {
        ...baseStyles,
        headerBg: "bg-gradient-to-r from-purple-100 via-pink-50 to-purple-100",
        accentColor: "text-purple-600",
        borderColor: "border-purple-200",
        primaryFont: "font-serif",
        tableHeaderBg: "bg-purple-50"
      };
    } else if (template.category === "minimal") {
      return {
        ...baseStyles,
        headerBg: "bg-gray-50",
        accentColor: "text-gray-600",
        borderColor: "border-gray-100",
        tableHeaderBg: "bg-gray-50"
      };
    }
    
    return baseStyles;
  };
  
  const styles = getPreviewStyles();
  const documentLabel = templateData.documentLabel || 'INVOICE';
  
  return (
    <Card className={`${className} shadow-sm`}>
      <CardContent className="p-0">
        <div className="bg-white text-xs scale-[0.6] origin-top-left transform w-[167%] h-[167%]">
          {/* Header */}
          <div className={`${styles.headerBg} p-6 ${styles.borderColor} border-b`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="w-12 h-12 bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center mb-3">
                  <span className="text-[10px] text-gray-500">LOGO</span>
                </div>
                <h1 className={`text-lg font-bold ${styles.headerText} ${styles.primaryFont}`}>
                  Your Company Name
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  123 Business Street<br />
                  City, State 12345<br />
                  contact@company.com
                </p>
              </div>
              <div className="text-right">
                <h2 className={`text-xl font-bold ${styles.accentColor} mb-2 ${styles.primaryFont}`}>
                  {documentLabel}
                </h2>
                <div className="text-sm text-gray-600">
                  <div><strong>#{documentLabel.slice(0,3)}-001</strong></div>
                  <div>Date: Jan 15, 2024</div>
                  <div>Due: Feb 14, 2024</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Client Info */}
          <div className="p-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className={`text-sm font-medium ${styles.accentColor} mb-2`}>From:</h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium">Your Company Name</p>
                <p>123 Business Street</p>
                <p>your@company.com</p>
              </div>
            </div>
            <div>
              <h3 className={`text-sm font-medium ${styles.accentColor} mb-2`}>To:</h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium">Client Company Inc.</p>
                <p>456 Client Avenue</p>
                <p>client@company.com</p>
              </div>
            </div>
          </div>
          
          {/* Items Table */}
          <div className="p-6 pt-0">
            <table className="w-full text-sm">
              <thead>
                <tr className={`${styles.tableHeaderBg} ${styles.borderColor} border-b`}>
                  <th className="text-left py-2 text-gray-600 font-medium">Description</th>
                  <th className="text-right py-2 text-gray-600 font-medium">Qty</th>
                  <th className="text-right py-2 text-gray-600 font-medium">Rate</th>
                  <th className="text-right py-2 text-gray-600 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className={`${styles.borderColor} border-b`}>
                  <td className="py-2">Web Design Service</td>
                  <td className="text-right py-2">1</td>
                  <td className="text-right py-2">$500.00</td>
                  <td className="text-right py-2">$500.00</td>
                </tr>
                <tr className={`${styles.borderColor} border-b`}>
                  <td className="py-2">Development Hours</td>
                  <td className="text-right py-2">10</td>
                  <td className="text-right py-2">$75.00</td>
                  <td className="text-right py-2">$750.00</td>
                </tr>
                <tr className={`${styles.borderColor} border-b`}>
                  <td className="py-2">Consultation</td>
                  <td className="text-right py-2">2</td>
                  <td className="text-right py-2">$100.00</td>
                  <td className="text-right py-2">$200.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Total */}
          <div className="p-6 pt-0">
            <div className="text-right space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>$1,450.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>$145.00</span>
              </div>
              <div className={`flex justify-between font-bold ${styles.accentColor} text-base border-t ${styles.borderColor} pt-2`}>
                <span>Total:</span>
                <span>$1,595.00</span>
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-4 text-xs text-gray-500">
              <p>Payment is due within 30 days of invoice date</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}