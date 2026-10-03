// Browser Local Database (LocalStorage Manager) for Offline & Privacy-First Storage

export interface StoredInvoice {
  id: string | number;
  invoiceNumber: string;
  documentType: string;
  templateId?: number;
  companyName: string;
  companyEmail?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyGst?: string;
  companyLogo?: string;
  
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  clientPhone?: string;
  clientGst?: string;

  shipToName?: string;
  shipToAddress?: string;
  shipToCity?: string;
  shipToState?: string;
  shipToZip?: string;
  shipToCountry?: string;
  shipToEmail?: string;

  issueDate: string;
  dueDate: string;
  poNumber?: string;
  currency: string;
  
  lineItems: Array<{
    description: string;
    quantity: number;
    rate: number;
    taxRate?: number;
    taxAmount?: number;
    amount: number;
    hsn?: string;
  }>;

  subtotal: number | string;
  taxRate?: number;
  taxAmount?: number | string;
  discount?: number | string;
  shippingCost?: number | string;
  total: number | string;
  
  status: 'draft' | 'sent' | 'paid' | 'overdue' | string;
  paymentStatus: 'pending' | 'paid' | 'partial' | string;

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
  createdAt: string;
  updatedAt: string;
  isLocalOnly?: boolean;
}

const STORAGE_KEY = 'invoicegenius_local_invoices';
const DRAFT_KEY_PREFIX = 'invoicegenius_draft_';

export function getLocalInvoices(): StoredInvoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load local invoices:', e);
    return [];
  }
}

export function getLocalInvoice(id: string | number): StoredInvoice | undefined {
  const invoices = getLocalInvoices();
  return invoices.find(inv => String(inv.id) === String(id));
}

export function saveLocalInvoice(data: any): StoredInvoice {
  const invoices = getLocalInvoices();
  const now = new Date().toISOString();
  
  const id = data.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  
  const record: StoredInvoice = {
    ...data,
    id,
    createdAt: data.createdAt || now,
    updatedAt: now,
    isLocalOnly: true,
  };

  const existingIdx = invoices.findIndex(inv => String(inv.id) === String(id));
  if (existingIdx >= 0) {
    invoices[existingIdx] = record;
  } else {
    invoices.unshift(record);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  } catch (e) {
    console.error('Failed to save invoice to localStorage:', e);
  }

  return record;
}

export function deleteLocalInvoice(id: string | number): boolean {
  try {
    const invoices = getLocalInvoices();
    const filtered = invoices.filter(inv => String(inv.id) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Failed to delete local invoice:', e);
    return false;
  }
}

export function saveDocumentDraft(docType: string, data: any): void {
  try {
    localStorage.setItem(`${DRAFT_KEY_PREFIX}${docType}`, JSON.stringify({
      data,
      savedAt: new Date().toISOString()
    }));
  } catch (e) {
    console.warn('Failed to save document draft:', e);
  }
}

export function getDocumentDraft(docType: string): any | null {
  try {
    const raw = localStorage.getItem(`${DRAFT_KEY_PREFIX}${docType}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.data || null;
  } catch (e) {
    return null;
  }
}

export function clearDocumentDraft(docType: string): void {
  try {
    localStorage.removeItem(`${DRAFT_KEY_PREFIX}${docType}`);
  } catch (e) {
    console.warn('Failed to clear draft:', e);
  }
}
