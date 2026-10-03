import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@shared/currencies";
import { getDocumentConfig } from "@/lib/document-config";

interface TemplatePreviewProps {
  template: any;
  className?: string;
}

export default function TemplatePreview({ template, className = "" }: TemplatePreviewProps) {
  const docConfig = getDocumentConfig(template.documentType);
  const data = template.templateData || {};
  const primaryColor = data.primaryColor || "#2563eb";
  const accentColor = data.accentColor || "#60a5fa";
  const currency = data.currency || "USD";
  const companyName = data.companyName || "Acme Digital Studio";
  const clientName = data.clientName || "Apex Enterprises";
  const industry = data.industry || "General Business";
  const items = data.sampleItems && data.sampleItems.length > 0
    ? data.sampleItems
    : [
        { description: "Consulting & Professional Services", quantity: 1, rate: 850, amount: 850 },
        { description: "Implementation & Technical Setup", quantity: 1, rate: 250, amount: 250 }
      ];

  const subtotal = items.reduce((sum: number, it: any) => sum + (it.amount || ((it.quantity || 1) * (it.rate || 0))), 0);
  const taxRate = data.taxRate || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const docLabel = docConfig.title;

  return (
    <Card className={`${className} shadow-sm overflow-hidden border border-gray-200/80 bg-white`}>
      <CardContent className="p-0">
        <div className="bg-white text-xs scale-[0.62] origin-top-left transform w-[162%] h-[162%] font-sans select-none pointer-events-none">
          {/* Header Banner */}
          <div
            className="p-5 text-white flex justify-between items-center"
            style={{ backgroundColor: primaryColor }}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center font-bold text-[11px] text-white">
                  {companyName.charAt(0)}
                </div>
                <span className="font-bold text-sm tracking-tight text-white">{companyName}</span>
              </div>
              <span className="text-[10px] text-white/80 uppercase tracking-wider font-semibold block">
                {industry}
              </span>
            </div>

            <div className="text-right">
              <span className="text-base font-black tracking-wider uppercase block text-white">
                {docLabel}
              </span>
              <span className="text-[10px] text-white/80 font-mono">
                #{docLabel.slice(0, 3)}-2026
              </span>
            </div>
          </div>

          {/* Subheader / Parties Info */}
          <div className="p-4 bg-slate-50/70 border-b border-gray-200/60 grid grid-cols-2 gap-4 text-[11px]">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5 truncate">
                {docConfig.partyHeaders.to}:
              </span>
              <p className="font-semibold text-gray-800 truncate">{clientName}</p>
              <p className="text-gray-500 text-[10px]">{data.clientEmail || 'client@business.com'}</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                Payment Info:
              </span>
              <span
                className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold text-white uppercase"
                style={{ backgroundColor: primaryColor }}
              >
                {currency} • {taxRate > 0 ? `${taxRate}% Tax` : 'Direct'}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-4 pt-2">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-[9px] uppercase font-bold tracking-wider">
                  <th className="text-left py-1.5">Description</th>
                  <th className="text-center py-1.5 w-12">Qty</th>
                  <th className="text-right py-1.5 w-20">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.slice(0, 3).map((item: any, idx: number) => (
                  <tr key={idx} className="text-gray-700">
                    <td className="py-1.5 font-medium truncate max-w-[140px]">
                      {item.description}
                    </td>
                    <td className="py-1.5 text-center text-gray-500">
                      {item.quantity || 1}
                    </td>
                    <td className="py-1.5 text-right font-mono font-semibold text-gray-900">
                      {formatCurrency(item.amount || ((item.quantity || 1) * (item.rate || 0)), currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Bar */}
          <div className="px-4 py-3 bg-gray-50/90 border-t border-gray-200 flex justify-between items-center text-[11px]">
            <span className="text-gray-500 text-[10px] italic truncate max-w-[150px]">
              {data.notes || "Professional auto-calculated document"}
            </span>
            <div className="text-right">
              <span className="text-[10px] text-gray-500 mr-2 uppercase font-bold">Total:</span>
              <span className="text-sm font-black font-mono text-gray-900" style={{ color: primaryColor }}>
                {formatCurrency(total, currency)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}