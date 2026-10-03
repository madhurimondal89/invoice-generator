// Centralized document configuration & styling engine for InvoiceGenius
// Ensures 100% consistency across Forms, Live Preview, and PDF Generator

export interface DocumentPartyHeaders {
  from: string;
  to: string;
}

export interface DocumentDateLabels {
  issue: string;
  due: string;
}

export interface DocumentConfig {
  type: string;
  title: string;
  prefix: string;
  partyHeaders: DocumentPartyHeaders;
  dateLabels: DocumentDateLabels;
  totalLabel: string;
  pdfColors: {
    primary: [number, number, number];
    accent: [number, number, number];
    dark: [number, number, number];
    light: [number, number, number];
  };
  uiStyles: {
    headerBg: string;
    accentText: string;
    accentBg: string;
    accentBorder: string;
    tableHeaderBg: string;
  };
  hidePaymentByDefault?: boolean;
}

export function getDocumentConfig(rawType?: string): DocumentConfig {
  const type = (rawType || 'invoice').toLowerCase();

  switch (type) {
    case 'tax_invoice':
      return {
        type: 'tax_invoice',
        title: 'TAX INVOICE',
        prefix: 'TAX',
        partyHeaders: {
          from: 'SUPPLIER / SELLER',
          to: 'BUYER / RECIPIENT'
        },
        dateLabels: {
          issue: 'Invoice Date',
          due: 'Due Date'
        },
        totalLabel: 'TOTAL DUE (INC. GST):',
        pdfColors: {
          primary: [30, 58, 138],    // Deep Navy
          accent: [238, 242, 255],
          dark: [17, 24, 39],
          light: [199, 210, 254]
        },
        uiStyles: {
          headerBg: 'bg-gradient-to-r from-blue-900 to-indigo-950 text-white',
          accentText: 'text-indigo-900',
          accentBg: 'bg-indigo-50',
          accentBorder: 'border-indigo-200',
          tableHeaderBg: 'bg-indigo-900 text-white'
        }
      };

    case 'proforma_invoice':
      return {
        type: 'proforma_invoice',
        title: 'PROFORMA INVOICE',
        prefix: 'PRO',
        partyHeaders: {
          from: 'ISSUED BY (SELLER)',
          to: 'PROFORMA TO'
        },
        dateLabels: {
          issue: 'Proforma Date',
          due: 'Valid Until'
        },
        totalLabel: 'ESTIMATED DUE:',
        pdfColors: {
          primary: [51, 65, 85],     // Slate 700
          accent: [248, 250, 252],
          dark: [15, 23, 42],
          light: [203, 213, 225]
        },
        uiStyles: {
          headerBg: 'bg-gradient-to-r from-slate-700 to-slate-900 text-white',
          accentText: 'text-slate-800',
          accentBg: 'bg-slate-50',
          accentBorder: 'border-slate-300',
          tableHeaderBg: 'bg-slate-800 text-white'
        }
      };

    case 'receipt':
      return {
        type: 'receipt',
        title: 'PAYMENT RECEIPT',
        prefix: 'RCPT',
        partyHeaders: {
          from: 'ISSUED BY (MERCHANT / SELLER)',
          to: 'RECEIVED FROM (PAYER)'
        },
        dateLabels: {
          issue: 'Receipt Date',
          due: 'Payment Date'
        },
        totalLabel: 'TOTAL PAID:',
        pdfColors: {
          primary: [14, 165, 233],   // Sky Blue
          accent: [240, 249, 255],
          dark: [12, 74, 110],
          light: [186, 230, 253]
        },
        uiStyles: {
          headerBg: 'bg-gradient-to-r from-sky-600 to-cyan-700 text-white',
          accentText: 'text-sky-700',
          accentBg: 'bg-sky-50',
          accentBorder: 'border-sky-200',
          tableHeaderBg: 'bg-sky-600 text-white'
        }
      };

    case 'sales_receipt':
      return {
        type: 'sales_receipt',
        title: 'SALES RECEIPT',
        prefix: 'SR',
        partyHeaders: {
          from: 'ISSUED BY (STORE / MERCHANT)',
          to: 'SOLD TO (CUSTOMER)'
        },
        dateLabels: {
          issue: 'Receipt Date',
          due: 'Sale Date'
        },
        totalLabel: 'TOTAL PAID:',
        pdfColors: {
          primary: [2, 132, 199],
          accent: [240, 249, 255],
          dark: [12, 74, 110],
          light: [186, 230, 253]
        },
        uiStyles: {
          headerBg: 'bg-gradient-to-r from-sky-700 to-blue-800 text-white',
          accentText: 'text-sky-700',
          accentBg: 'bg-sky-50',
          accentBorder: 'border-sky-200',
          tableHeaderBg: 'bg-sky-700 text-white'
        }
      };

    case 'cash_receipt':
      return {
        type: 'cash_receipt',
        title: 'CASH RECEIPT',
        prefix: 'CR',
        partyHeaders: {
          from: 'CASH RECEIVED BY',
          to: 'RECEIVED FROM (PAYER)'
        },
        dateLabels: {
          issue: 'Receipt Date',
          due: 'Payment Date'
        },
        totalLabel: 'CASH RECEIVED:',
        pdfColors: {
          primary: [13, 148, 136],   // Teal
          accent: [240, 253, 250],
          dark: [19, 78, 74],
          light: [153, 246, 228]
        },
        uiStyles: {
          headerBg: 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white',
          accentText: 'text-teal-700',
          accentBg: 'bg-teal-50',
          accentBorder: 'border-teal-200',
          tableHeaderBg: 'bg-teal-600 text-white'
        }
      };

    case 'quote':
      return {
        type: 'quote',
        title: 'QUOTATION',
        prefix: 'QUO',
        partyHeaders: {
          from: 'PREPARED BY (SERVICE PROVIDER)',
          to: 'QUOTED TO (CLIENT)'
        },
        dateLabels: {
          issue: 'Quote Date',
          due: 'Valid Until'
        },
        totalLabel: 'TOTAL ESTIMATED:',
        pdfColors: {
          primary: [16, 185, 129],   // Emerald
          accent: [236, 253, 245],
          dark: [6, 78, 59],
          light: [167, 243, 208]
        },
        uiStyles: {
          headerBg: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white',
          accentText: 'text-emerald-700',
          accentBg: 'bg-emerald-50',
          accentBorder: 'border-emerald-200',
          tableHeaderBg: 'bg-emerald-600 text-white'
        }
      };

    case 'estimate':
      return {
        type: 'estimate',
        title: 'PROJECT ESTIMATE',
        prefix: 'EST',
        partyHeaders: {
          from: 'ESTIMATED BY',
          to: 'ESTIMATED FOR (CLIENT)'
        },
        dateLabels: {
          issue: 'Estimate Date',
          due: 'Valid Until'
        },
        totalLabel: 'TOTAL ESTIMATE:',
        pdfColors: {
          primary: [5, 150, 105],
          accent: [236, 253, 245],
          dark: [6, 78, 59],
          light: [167, 243, 208]
        },
        uiStyles: {
          headerBg: 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white',
          accentText: 'text-emerald-700',
          accentBg: 'bg-emerald-50',
          accentBorder: 'border-emerald-200',
          tableHeaderBg: 'bg-emerald-700 text-white'
        }
      };

    case 'credit_note':
      return {
        type: 'credit_note',
        title: 'CREDIT NOTE',
        prefix: 'CN',
        partyHeaders: {
          from: 'ISSUED BY (SELLER)',
          to: 'CREDIT TO (ACCOUNT / CLIENT)'
        },
        dateLabels: {
          issue: 'Credit Date',
          due: 'Original Ref Date'
        },
        totalLabel: 'TOTAL CREDITED:',
        pdfColors: {
          primary: [239, 68, 68],    // Rose/Red
          accent: [254, 242, 242],
          dark: [153, 27, 27],
          light: [254, 202, 202]
        },
        uiStyles: {
          headerBg: 'bg-gradient-to-r from-red-600 to-rose-700 text-white',
          accentText: 'text-red-600',
          accentBg: 'bg-red-50',
          accentBorder: 'border-red-200',
          tableHeaderBg: 'bg-red-600 text-white'
        }
      };

    case 'credit_memo':
      return {
        type: 'credit_memo',
        title: 'CREDIT MEMO',
        prefix: 'CM',
        partyHeaders: {
          from: 'ISSUED BY (COMPANY)',
          to: 'CREDIT TO (CLIENT)'
        },
        dateLabels: {
          issue: 'Memo Date',
          due: 'Ref Date'
        },
        totalLabel: 'TOTAL CREDITED:',
        pdfColors: {
          primary: [225, 29, 72],
          accent: [254, 242, 242],
          dark: [153, 27, 27],
          light: [254, 202, 202]
        },
        uiStyles: {
          headerBg: 'bg-gradient-to-r from-rose-600 to-pink-700 text-white',
          accentText: 'text-rose-600',
          accentBg: 'bg-rose-50',
          accentBorder: 'border-rose-200',
          tableHeaderBg: 'bg-rose-600 text-white'
        }
      };

    case 'purchase_order':
      return {
        type: 'purchase_order',
        title: 'PURCHASE ORDER',
        prefix: 'PO',
        partyHeaders: {
          from: 'BUYER (ORDER ISSUED BY)',
          to: 'VENDOR (SUPPLIER)'
        },
        dateLabels: {
          issue: 'Order Date',
          due: 'Required By'
        },
        totalLabel: 'TOTAL ORDER VALUE:',
        pdfColors: {
          primary: [124, 58, 237],   // Purple/Violet
          accent: [245, 243, 255],
          dark: [91, 33, 182],
          light: [221, 214, 254]
        },
        uiStyles: {
          headerBg: 'bg-gradient-to-r from-purple-600 to-violet-700 text-white',
          accentText: 'text-purple-600',
          accentBg: 'bg-purple-50',
          accentBorder: 'border-purple-200',
          tableHeaderBg: 'bg-purple-600 text-white'
        },
        hidePaymentByDefault: true
      };

    case 'delivery_note':
      return {
        type: 'delivery_note',
        title: 'DELIVERY NOTE / CHALLAN',
        prefix: 'DN',
        partyHeaders: {
          from: 'DISPATCHED FROM (SUPPLIER)',
          to: 'DELIVER TO / SHIP TO'
        },
        dateLabels: {
          issue: 'Dispatch Date',
          due: 'Expected Delivery'
        },
        totalLabel: 'DECLARED VALUE:',
        pdfColors: {
          primary: [217, 119, 6],    // Amber
          accent: [255, 251, 235],
          dark: [120, 53, 15],
          light: [253, 230, 138]
        },
        uiStyles: {
          headerBg: 'bg-gradient-to-r from-amber-600 to-yellow-700 text-white',
          accentText: 'text-amber-700',
          accentBg: 'bg-amber-50',
          accentBorder: 'border-amber-200',
          tableHeaderBg: 'bg-amber-600 text-white'
        },
        hidePaymentByDefault: true
      };

    case 'invoice':
    default:
      return {
        type: 'invoice',
        title: 'INVOICE',
        prefix: 'INV',
        partyHeaders: {
          from: 'FROM (SELLER)',
          to: 'BILL TO (CLIENT)'
        },
        dateLabels: {
          issue: 'Invoice Date',
          due: 'Due Date'
        },
        totalLabel: 'TOTAL DUE:',
        pdfColors: {
          primary: [37, 99, 235],    // Royal Blue
          accent: [239, 246, 255],
          dark: [30, 41, 59],
          light: [191, 219, 254]
        },
        uiStyles: {
          headerBg: 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white',
          accentText: 'text-blue-600',
          accentBg: 'bg-blue-50',
          accentBorder: 'border-blue-200',
          tableHeaderBg: 'bg-blue-600 text-white'
        }
      };
  }
}
