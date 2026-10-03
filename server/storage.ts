import {
  users,
  invoices,
  invoiceLineItems,
  invoiceTemplates,
  type User,
  type UpsertUser,
  type Invoice,
  type InsertInvoice,
  type InvoiceLineItem,
  type InsertInvoiceLineItem,
  type InvoiceTemplate,
  type InsertInvoiceTemplate,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations

  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Invoice operations
  getInvoices(userId: string): Promise<Invoice[]>;
  getInvoice(id: number, userId: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  deleteInvoice(id: number, userId: string): Promise<boolean>;

  // Invoice line item operations
  getInvoiceLineItems(invoiceId: number): Promise<InvoiceLineItem[]>;
  createInvoiceLineItem(lineItem: InsertInvoiceLineItem): Promise<InvoiceLineItem>;
  updateInvoiceLineItem(id: number, lineItem: Partial<InsertInvoiceLineItem>): Promise<InvoiceLineItem>;
  deleteInvoiceLineItem(id: number): Promise<boolean>;

  // Template operations
  getTemplates(): Promise<InvoiceTemplate[]>;
  getInvoiceTemplates(): Promise<InvoiceTemplate[]>;
  getInvoiceTemplate(id: number): Promise<InvoiceTemplate | undefined>;
  createInvoiceTemplate(template: InsertInvoiceTemplate): Promise<InvoiceTemplate>;
  updateInvoiceTemplate(id: number, template: Partial<InsertInvoiceTemplate>): Promise<InvoiceTemplate>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private invoices: Map<number, Invoice>;
  private invoiceLineItems: Map<number, InvoiceLineItem>;
  private invoiceTemplates: Map<number, InvoiceTemplate>;

  private currentInvoiceId: number;
  private currentLineItemId: number;
  private currentTemplateId: number;

  constructor() {
    this.users = new Map();
    this.invoices = new Map();
    this.invoiceLineItems = new Map();
    this.invoiceTemplates = new Map();

    this.currentInvoiceId = 1;
    this.currentLineItemId = 1;
    // Start with higher ID to avoid conflict with default templates
    this.currentTemplateId = 100;

    this.createDefaultTemplates();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const defaultUser: User = {
      id: userData.id || "unknown", // Provide default if undefined
      email: userData.email || "",
      firstName: userData.firstName || null, // Assuming Schema allows null
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const existing = this.users.get(userData.id || "");
    const updated: User = {
      ...defaultUser,
      ...(existing || {}),
      ...userData,
      updatedAt: new Date()
    } as User;

    // Ensure id is set if it wasn't
    if (userData.id) {
      this.users.set(userData.id, updated);
      return updated;
    }
    // Should generally not happen with valid auth flows
    throw new Error("User ID required for upsert");
  }

  // Invoice operations
  async getInvoices(userId: string): Promise<Invoice[]> {
    return Array.from(this.invoices.values())
      .filter(invoice => invoice.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getInvoice(id: number, userId: string): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (invoice && invoice.userId === userId) {
      return invoice;
    }
    return undefined;
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const id = this.currentInvoiceId++;
    const newInvoice: Invoice = {
      ...invoice,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: invoice.userId || "anonymous", // Handle potentially undefined userId
      invoiceNumber: invoice.invoiceNumber || `INV-${Date.now()}`,
      issueDate: invoice.issueDate ? new Date(invoice.issueDate) : new Date(),
      dueDate: invoice.dueDate ? new Date(invoice.dueDate) : null,
      companyLogo: invoice.companyLogo || null,
      notes: invoice.notes || null,
      terms: invoice.terms || null,
      termsConditions: invoice.termsConditions || null,
      companyAddress: invoice.companyAddress || null,
      companyEmail: invoice.companyEmail || null,
      clientAddress: invoice.clientAddress || null,
      clientEmail: invoice.clientEmail || null,
      taxRate: invoice.taxRate || null,
      taxAmount: invoice.taxAmount || null,
      currency: invoice.currency || 'USD',
      documentType: invoice.documentType || "invoice",
      status: invoice.status || "draft",
      paymentStatus: "pending",
      paymentMethod: null,
      paymentDate: null,
      paymentDetails: null,
      templateId: invoice.templateId || null,
      companyName: invoice.companyName || null,
      clientName: invoice.clientName || null,
      shipToName: invoice.shipToName || null,
      shipToEmail: invoice.shipToEmail || null,
      shipToAddress: invoice.shipToAddress || null,
      shipToCity: invoice.shipToCity || null,
      shipToState: invoice.shipToState || null,
      shipToZip: invoice.shipToZip || null,
      shipToCountry: invoice.shipToCountry || null,
      subtotal: invoice.subtotal || null,
      shippingCost: invoice.shippingCost || null,
      discount: invoice.discount || null,
      total: invoice.total || null,
      metadata: invoice.metadata || null
    };
    this.invoices.set(id, newInvoice);
    return newInvoice;
  }

  async updateInvoice(id: number, invoiceUpdate: Partial<InsertInvoice>): Promise<Invoice> {
    const existing = this.invoices.get(id);
    if (!existing) throw new Error("Invoice not found");

    const updated: Invoice = {
      ...existing,
      ...invoiceUpdate,
      updatedAt: new Date(),
      // Ensure date strings are converted to Date objects if passed
      issueDate: invoiceUpdate.issueDate ? new Date(invoiceUpdate.issueDate) : existing.issueDate,
      dueDate: invoiceUpdate.dueDate !== undefined ? (invoiceUpdate.dueDate ? new Date(invoiceUpdate.dueDate) : null) : existing.dueDate,
    };

    this.invoices.set(id, updated);
    return updated;
  }

  async deleteInvoice(id: number, userId: string): Promise<boolean> {
    const invoice = this.invoices.get(id);
    if (invoice && invoice.userId === userId) {
      return this.invoices.delete(id);
    }
    return false;
  }

  // Invoice line item operations
  async getInvoiceLineItems(invoiceId: number): Promise<InvoiceLineItem[]> {
    return Array.from(this.invoiceLineItems.values())
      .filter(item => item.invoiceId === invoiceId);
  }

  async createInvoiceLineItem(lineItem: InsertInvoiceLineItem): Promise<InvoiceLineItem> {
    const id = this.currentLineItemId++;
    // Ensure invoiceId is present
    if (!lineItem.invoiceId) throw new Error("Invoice ID required for line item");

    const newLineItem: InvoiceLineItem = {
      ...lineItem,
      id,
      createdAt: new Date(),
      description: lineItem.description || "",
      invoiceId: lineItem.invoiceId,
      quantity: lineItem.quantity || null,
      rate: lineItem.rate || null,
      amount: lineItem.amount || null,
      taxRate: lineItem.taxRate || null,
      taxAmount: lineItem.taxAmount || null
    };
    this.invoiceLineItems.set(id, newLineItem);
    return newLineItem;
  }

  async updateInvoiceLineItem(id: number, lineItemUpdate: Partial<InsertInvoiceLineItem>): Promise<InvoiceLineItem> {
    const existing = this.invoiceLineItems.get(id);
    if (!existing) throw new Error("Line item not found");

    const updated: InvoiceLineItem = {
      ...existing,
      ...lineItemUpdate
    };
    this.invoiceLineItems.set(id, updated);
    return updated;
  }

  async deleteInvoiceLineItem(id: number): Promise<boolean> {
    return this.invoiceLineItems.delete(id);
  }

  // Template operations
  async getTemplates(): Promise<InvoiceTemplate[]> {
    return this.getInvoiceTemplates();
  }

  async getInvoiceTemplates(): Promise<InvoiceTemplate[]> {
    return Array.from(this.invoiceTemplates.values());
  }

  async getInvoiceTemplate(id: number): Promise<InvoiceTemplate | undefined> {
    return this.invoiceTemplates.get(id);
  }

  async createInvoiceTemplate(template: InsertInvoiceTemplate): Promise<InvoiceTemplate> {
    const id = this.currentTemplateId++;
    const newTemplate: InvoiceTemplate = {
      ...template,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: template.description || null,
      previewImage: template.previewImage || null,
      documentType: template.documentType || "invoice",
      isActive: template.isActive ?? true
    };
    this.invoiceTemplates.set(id, newTemplate);
    return newTemplate;
  }

  async updateInvoiceTemplate(id: number, templateUpdate: Partial<InsertInvoiceTemplate>): Promise<InvoiceTemplate> {
    const existing = this.invoiceTemplates.get(id);
    if (!existing) throw new Error("Template not found");

    const updated: InvoiceTemplate = {
      ...existing,
      ...templateUpdate,
      updatedAt: new Date()
    };
    this.invoiceTemplates.set(id, updated);
    return updated;
  }

  private createDefaultTemplates() {
    console.log("Starting template generation...");
    const defaultTemplates = generateDefaultTemplates();
    console.log(`Generated ${defaultTemplates.length} templates to seed.`);

    let id = 1;
    for (const template of defaultTemplates) {
      // Check if template with this name already exists to avoid duplicates
      const exists = Array.from(this.invoiceTemplates.values()).some(t => t.name === template.name);
      if (!exists) {
        const storedTemplate: InvoiceTemplate = {
          ...template,
          id: id++,
          createdAt: new Date(),
          updatedAt: new Date(),
          description: template.description || null,
          previewImage: template.previewImage || null,
          documentType: template.documentType || "invoice",
          isActive: template.isActive ?? true
        };
        this.invoiceTemplates.set(storedTemplate.id, storedTemplate);
      }
    }
    // Update current ID to be after the defaults
    this.currentTemplateId = Math.max(this.currentTemplateId, id);
    console.log(`Finished seeding. Total templates in memory: ${this.invoiceTemplates.size}`);
  }
}

export class DatabaseStorage implements IStorage {
  // Use db! to assert non-null since this class should only be instantiated when db exists
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db!
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Invoice operations
  async getInvoices(userId: string): Promise<Invoice[]> {
    return await db!
      .select()
      .from(invoices)
      .where(eq(invoices.userId, userId))
      .orderBy(desc(invoices.createdAt));
  }

  async getInvoice(id: number, userId: string): Promise<Invoice | undefined> {
    const [invoice] = await db!
      .select()
      .from(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, userId)));
    return invoice;
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db!
      .insert(invoices)
      .values(invoice)
      .returning();
    return newInvoice;
  }

  async updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice> {
    const [updatedInvoice] = await db!
      .update(invoices)
      .set({ ...invoice, updatedAt: new Date() })
      .where(eq(invoices.id, id))
      .returning();
    return updatedInvoice;
  }

  async deleteInvoice(id: number, userId: string): Promise<boolean> {
    const result = await db!
      .delete(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Invoice line item operations
  async getInvoiceLineItems(invoiceId: number): Promise<InvoiceLineItem[]> {
    return await db!
      .select()
      .from(invoiceLineItems)
      .where(eq(invoiceLineItems.invoiceId, invoiceId));
  }

  async createInvoiceLineItem(lineItem: InsertInvoiceLineItem): Promise<InvoiceLineItem> {
    const [newLineItem] = await db!
      .insert(invoiceLineItems)
      .values(lineItem)
      .returning();
    return newLineItem;
  }

  async updateInvoiceLineItem(id: number, lineItem: Partial<InsertInvoiceLineItem>): Promise<InvoiceLineItem> {
    const [updatedLineItem] = await db!
      .update(invoiceLineItems)
      .set(lineItem)
      .where(eq(invoiceLineItems.id, id))
      .returning();
    return updatedLineItem;
  }

  async deleteInvoiceLineItem(id: number): Promise<boolean> {
    const result = await db!
      .delete(invoiceLineItems)
      .where(eq(invoiceLineItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Template operations
  async getTemplates(): Promise<InvoiceTemplate[]> {
    return await this.getInvoiceTemplates();
  }

  async getInvoiceTemplates(): Promise<InvoiceTemplate[]> {
    const existingTemplates = await db!.select().from(invoiceTemplates);

    // If no templates exist, create default ones
    if (existingTemplates.length === 0) {
      await this.createDefaultTemplates();
      return await db!.select().from(invoiceTemplates);
    }

    return existingTemplates;
  }

  private async createDefaultTemplates(): Promise<void> {
    const defaultTemplates = generateDefaultTemplates();

    for (const template of defaultTemplates) {
      // Check for existence specifically by name to avoid duplicates on re-runs
      const [existing] = await db!
        .select()
        .from(invoiceTemplates)
        .where(eq(invoiceTemplates.name, template.name));

      if (!existing) {
        await db!.insert(invoiceTemplates).values(template);
      }
    }
  }

  async getInvoiceTemplate(id: number): Promise<InvoiceTemplate | undefined> {
    const [template] = await db!
      .select()
      .from(invoiceTemplates)
      .where(eq(invoiceTemplates.id, id));
    return template;
  }

  async createInvoiceTemplate(template: InsertInvoiceTemplate): Promise<InvoiceTemplate> {
    const [newTemplate] = await db!
      .insert(invoiceTemplates)
      .values(template)
      .returning();
    return newTemplate;
  }

  async updateInvoiceTemplate(id: number, template: Partial<InsertInvoiceTemplate>): Promise<InvoiceTemplate> {
    const [updatedTemplate] = await db!
      .update(invoiceTemplates)
      .set({ ...template, updatedAt: new Date() })
      .where(eq(invoiceTemplates.id, id))
      .returning();
    return updatedTemplate;
  }
}

export const storage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();

// Helper to generate 100+ rich, diverse, industry-tailored templates
function generateDefaultTemplates(): InsertInvoiceTemplate[] {
  const industries = [
    {
      industry: 'Tech & SaaS',
      category: 'tech',
      primary: '#4f46e5', // Indigo
      accent: '#818cf8',
      bg: '#eef2ff',
      docType: 'invoice',
      nameSuffix: 'SaaS & Cloud Services',
      company: 'CloudNova Systems Inc.',
      companyEmail: 'billing@cloudnovasystems.io',
      companyAddress: '500 Tech Boulevard, Silicon Valley, CA 94025',
      client: 'ScaleUp Ventures LLC',
      clientEmail: 'finance@scaleupventures.co',
      clientAddress: '101 Hudson St, Floor 22, Jersey City, NJ 07302',
      currency: 'USD',
      taxRate: 0,
      items: [
        { description: 'Enterprise Cloud Platform License (Annual)', quantity: 1, rate: 2400, taxRate: 0, taxAmount: 0, amount: 2400 },
        { description: 'Dedicated Kubernetes Cluster Management (Monthly)', quantity: 1, rate: 650, taxRate: 0, taxAmount: 0, amount: 650 },
        { description: 'Premium 24/7 SLA Technical Support Tier', quantity: 1, rate: 350, taxRate: 0, taxAmount: 0, amount: 350 }
      ],
      notes: 'Thank you for choosing CloudNova as your cloud infrastructure partner.',
      terms: 'Payment due within 30 days. Auto-renews unless canceled 15 days prior.'
    },
    {
      industry: 'Freelance & Dev',
      category: 'freelance',
      primary: '#059669', // Emerald
      accent: '#34d399',
      bg: '#ecfdf5',
      docType: 'invoice',
      nameSuffix: 'Full-Stack Developer Sprint',
      company: 'DevCraft Studio',
      companyEmail: 'alex@devcraftstudio.dev',
      companyAddress: 'Block 4B, Koramangala 5th Block, Bengaluru 560095',
      client: 'Nexar Retail Solutions',
      clientEmail: 'accounts@nexartech.in',
      clientAddress: 'Plot 78, Cyber City, Gurugram 122002',
      currency: 'INR',
      taxRate: 18,
      items: [
        { description: 'Full-Stack React & Node.js Web App Development (Sprint 1)', quantity: 1, rate: 45000, taxRate: 18, taxAmount: 8100, amount: 45000 },
        { description: 'Payment Gateway Integration & Webhook Security', quantity: 1, rate: 12000, taxRate: 18, taxAmount: 2160, amount: 12000 },
        { description: 'UI Performance Optimization & Mobile Responsiveness', quantity: 1, rate: 8000, taxRate: 18, taxAmount: 1440, amount: 8000 }
      ],
      notes: 'Scan the UPI QR code on this bill for instant 0% fee payment via PhonePe, GPay, or Paytm.',
      terms: '50% advance received, balance due within 7 days of milestone signoff.'
    },
    {
      industry: 'Creative & Design',
      category: 'creative',
      primary: '#9333ea', // Purple
      accent: '#c084fc',
      bg: '#faf5ff',
      docType: 'quote',
      nameSuffix: 'Brand Identity & UI/UX Quote',
      company: 'Lumina Design Lab',
      companyEmail: 'hello@luminadesign.co',
      companyAddress: 'Studio 12, Soho Arts District, London W1D 3NE',
      client: 'Aura Lifestyle Brands',
      clientEmail: 'creative@auralifestyle.co.uk',
      clientAddress: '24 Kingsway, Covent Garden, London WC2B 6EY',
      currency: 'GBP',
      taxRate: 20,
      items: [
        { description: 'Complete Brand Identity Suite (Logo, Typography, Guidelines)', quantity: 1, rate: 1850, taxRate: 20, taxAmount: 370, amount: 1850 },
        { description: 'Mobile App High-Fidelity UI/UX & Interactive Prototype', quantity: 1, rate: 2200, taxRate: 20, taxAmount: 440, amount: 2200 },
        { description: 'Custom Vector Iconography & Social Media Kit (15 Assets)', quantity: 1, rate: 600, taxRate: 20, taxAmount: 120, amount: 600 }
      ],
      notes: 'We look forward to transforming your brand visual identity.',
      terms: 'Quotation valid for 30 days. 50% deposit required upon project commencement.'
    },
    {
      industry: 'Legal & CA',
      category: 'corporate',
      primary: '#0f172a', // Navy / Slate
      accent: '#64748b',
      bg: '#f8fafc',
      docType: 'tax_invoice',
      nameSuffix: 'Corporate Legal & Tax Audit',
      company: 'Apex Legal & Chartered Associates',
      companyEmail: 'tax@apexlegalassociates.com',
      companyAddress: 'Level 18, World Trade Tower, Barakhamba Rd, New Delhi 110001',
      client: 'Vanguard Global Holdings',
      clientEmail: 'legal@vanguardglobal.com',
      clientAddress: 'Bandra Kurla Complex, Bandra East, Mumbai 400051',
      currency: 'INR',
      taxRate: 18,
      items: [
        { description: 'Annual Corporate Tax Audit & Statutory Filing (FY 2025-26)', quantity: 1, rate: 55000, taxRate: 18, taxAmount: 9900, amount: 55000 },
        { description: 'Cross-Border Intellectual Property Assignment Agreement', quantity: 1, rate: 25000, taxRate: 18, taxAmount: 4500, amount: 25000 },
        { description: 'Regulatory Compliance & Board Meeting Documentation', quantity: 1, rate: 15000, taxRate: 18, taxAmount: 2700, amount: 15000 }
      ],
      notes: 'Please quote Tax Invoice # on wire transfers. GST input credit available.',
      terms: 'Payment due within 15 calendar days from date of invoice.'
    },
    {
      industry: 'Construction & Trades',
      category: 'corporate',
      primary: '#d97706', // Amber / Construction
      accent: '#fbbf24',
      bg: '#fffbeb',
      docType: 'purchase_order',
      nameSuffix: 'Building Materials & Procurement',
      company: 'Zenith Infra & Construction Ltd',
      companyEmail: 'procurement@zenithinfra.com',
      companyAddress: 'Industrial Area Phase 2, Peenya, Bengaluru 560058',
      client: 'Metro Cement & Steel Suppliers',
      clientEmail: 'orders@metrocementsteel.com',
      clientAddress: 'Plot 14, Outer Ring Road Logistics Park, Pune 411019',
      currency: 'INR',
      taxRate: 18,
      items: [
        { description: 'Grade 53 OPC Cement Bags (50kg each)', quantity: 200, rate: 380, taxRate: 18, taxAmount: 13680, amount: 76000 },
        { description: 'TMT Steel Rebars Fe-550D (12mm Diameter - Tonnes)', quantity: 3, rate: 58000, taxRate: 18, taxAmount: 31320, amount: 174000 },
        { description: 'Pre-mixed Ready Mix Concrete M25 Grade (Cubic Metres)', quantity: 15, rate: 4200, taxRate: 18, taxAmount: 11340, amount: 63000 }
      ],
      notes: 'Delivery required at Site #4 (Green Valley Township) by 25th of this month.',
      terms: 'Official Purchase Order. Payment released after material quality inspection.'
    },
    {
      industry: 'Retail & POS',
      category: 'retail',
      primary: '#ea580c', // Orange
      accent: '#fb923c',
      bg: '#fff7ed',
      docType: 'receipt',
      nameSuffix: 'Retail Store Sales Receipt',
      company: 'UrbanStyle MegaStore & Apparel',
      companyEmail: 'store@urbanstyleapparel.com',
      companyAddress: 'Shop 104-106, High Street Mall, South Extension, New Delhi',
      client: 'Walk-in Customer (Rahul Sharma)',
      clientEmail: 'rahul.sharma88@gmail.com',
      clientAddress: 'Flat 202, Palm Grove Apts, Saket, New Delhi',
      currency: 'INR',
      taxRate: 12,
      items: [
        { description: 'Premium Cotton Slim-Fit Formal Shirt (Navy Blue)', quantity: 2, rate: 1899, taxRate: 12, taxAmount: 455.76, amount: 3798 },
        { description: 'Classic Denim Stretch Jeans (Dark Indigo)', quantity: 1, rate: 2499, taxRate: 12, taxAmount: 299.88, amount: 2499 },
        { description: 'Genuine Leather Formal Belt (Brown)', quantity: 1, rate: 999, taxRate: 12, taxAmount: 119.88, amount: 999 }
      ],
      notes: 'Thank you for shopping at UrbanStyle! Exchange within 14 days with original bill.',
      terms: 'Items bought on clearance discount cannot be returned.'
    },
    {
      industry: 'Medical & Healthcare',
      category: 'medical',
      primary: '#0d9488', // Teal
      accent: '#2dd4bf',
      bg: '#f0fdfa',
      docType: 'invoice',
      nameSuffix: 'Clinic Consultation & Diagnostics',
      company: 'CarePlus Multispeciality Clinic',
      companyEmail: 'billing@careplusclinic.org',
      companyAddress: '42 Medical Enclave, Health City, Chennai 600006',
      client: 'Arun Kumar (Patient ID #CP-8492)',
      clientEmail: 'arun.k@outlook.com',
      clientAddress: '15 Lake View Road, Nungambakkam, Chennai 600034',
      currency: 'INR',
      taxRate: 0,
      items: [
        { description: 'Senior Consultant Cardiology Comprehensive Examination', quantity: 1, rate: 1500, taxRate: 0, taxAmount: 0, amount: 1500 },
        { description: '12-Lead ECG & 2D Color Doppler Echocardiogram Test', quantity: 1, rate: 2800, taxRate: 0, taxAmount: 0, amount: 2800 },
        { description: 'Comprehensive Lipid & Metabolic Profile Blood Panel', quantity: 1, rate: 1200, taxRate: 0, taxAmount: 0, amount: 1200 }
      ],
      notes: 'Keep this medical invoice for health insurance tax exemption under Sec 80D.',
      terms: 'All lab reports delivered online within 24 hours.'
    },
    {
      industry: 'Logistics & Cargo',
      category: 'logistics',
      primary: '#2563eb', // Royal Blue
      accent: '#60a5fa',
      bg: '#eff6ff',
      docType: 'delivery_note',
      nameSuffix: 'Air Cargo & Freight Dispatch',
      company: 'GlobalLogix Freight & Express',
      companyEmail: 'dispatch@globallogixcargo.com',
      companyAddress: 'Cargo Complex Terminal 3, IGI Airport, New Delhi 110037',
      client: 'Apex Electronics Manufacturing',
      clientEmail: 'inbound@apexelectronics.com',
      clientAddress: 'Plot 55, Ecotech Industrial Park, Greater Noida 201306',
      currency: 'INR',
      taxRate: 18,
      items: [
        { description: 'Air Freight Cargo Consignment (5 Boxes - 120 kg Total Weight)', quantity: 1, rate: 18500, taxRate: 18, taxAmount: 3330, amount: 18500 },
        { description: 'Customs Clearance, Documentation & Port Handling Fee', quantity: 1, rate: 4500, taxRate: 18, taxAmount: 810, amount: 4500 },
        { description: 'Comprehensive Transit Insurance Coverage (Value ₹5,00,000)', quantity: 1, rate: 2500, taxRate: 18, taxAmount: 450, amount: 2500 }
      ],
      notes: 'Consignment Airway Bill # AWB-84920482. Signed delivery proof attached.',
      terms: 'Recipient must verify package seal integrity prior to receiving acknowledgement.'
    },
    {
      industry: 'Photography & Media',
      category: 'creative',
      primary: '#1e293b', // Slate Dark with Gold Accent
      accent: '#eab308',
      bg: '#f8fafc',
      docType: 'estimate',
      nameSuffix: 'Commercial Shoot & Video Production',
      company: 'Velox Media & Film Studios',
      companyEmail: 'projects@veloxstudios.tv',
      companyAddress: 'Studio 4, Film City, Goregaon East, Mumbai 400065',
      client: 'GlowCosmetics International',
      clientEmail: 'marketing@glowcosmetics.com',
      clientAddress: '14 Fashion Avenue, Juhu, Mumbai 400049',
      currency: 'INR',
      taxRate: 18,
      items: [
        { description: 'Full-Day Studio Product Shoot with Cinema 4K Cameras', quantity: 1, rate: 35000, taxRate: 18, taxAmount: 6300, amount: 35000 },
        { description: '4K Drone Aerial Shots & Creative Lighting Technician', quantity: 1, rate: 15000, taxRate: 18, taxAmount: 2700, amount: 15000 },
        { description: 'High-End Color Grading, Skin Retouching & Master Export', quantity: 1, rate: 20000, taxRate: 18, taxAmount: 3600, amount: 20000 }
      ],
      notes: 'Estimate covers all pre-production, equipment rentals, and master delivery.',
      terms: '50% advance booking fee, 50% upon final master video delivery.'
    },
    {
      industry: 'Education & Courses',
      category: 'modern',
      primary: '#0284c7', // Sky Blue
      accent: '#38bdf8',
      bg: '#f0f9ff',
      docType: 'receipt',
      nameSuffix: 'Course Tuition & Mentorship Fee',
      company: 'NextGen Academy & Coding Institute',
      companyEmail: 'admissions@nextgenacademy.edu',
      companyAddress: 'Tech Tower, Hitech City, Hyderabad 500081',
      client: 'Pooja Verma (Student ID #NA-2026)',
      clientEmail: 'pooja.verma@gmail.com',
      clientAddress: 'Flat 401, Cyber Heights, Madhapur, Hyderabad',
      currency: 'INR',
      taxRate: 18,
      items: [
        { description: 'Advanced Full-Stack Web Architecture Bootcamp (16 Weeks)', quantity: 1, rate: 38000, taxRate: 18, taxAmount: 6840, amount: 38000 },
        { description: '1-on-1 Weekly Industry Expert Mentorship & Mock Interviews', quantity: 1, rate: 8000, taxRate: 18, taxAmount: 1440, amount: 8000 },
        { description: 'Cloud Lab Environment & Official Certification Exam Voucher', quantity: 1, rate: 4000, taxRate: 18, taxAmount: 720, amount: 4000 }
      ],
      notes: 'Official fee receipt. Includes lifetime access to alumni portal and LMS.',
      terms: 'Tuition fees are non-refundable after commencement of course batch.'
    }
  ];

  const styleVariants = [
    { name: 'Modern Studio', variant: 'modern-studio', font: 'sans-serif' },
    { name: 'Executive Minimal', variant: 'minimal-swiss', font: 'sans-serif' },
    { name: 'Classic Corporate', variant: 'corporate-banner', font: 'serif' },
    { name: 'Creative Gradient', variant: 'creative-gradient', font: 'sans-serif' },
    { name: 'Clean Edge', variant: 'clean-edge', font: 'sans-serif' },
    { name: 'Swiss Bold', variant: 'swiss-bold', font: 'sans-serif' },
    { name: 'High Contrast', variant: 'high-contrast', font: 'sans-serif' },
    { name: 'Emerald Pay', variant: 'emerald-pay', font: 'sans-serif' },
    { name: 'Royal Border', variant: 'royal-border', font: 'serif' },
    { name: 'Tech Monochrome', variant: 'tech-mono', font: 'monospace' }
  ];

  const curatedTemplates = [
    {
      docType: 'invoice',
      name: 'Modern Studio SaaS Invoice',
      category: 'tech',
      industry: 'Tech & SaaS',
      styleName: 'Modern Studio',
      font: 'sans-serif',
      variant: 'modern-studio',
      primary: '#4f46e5',
      accent: '#818cf8',
      bg: '#eef2ff',
      company: 'CloudNova Systems Inc.',
      companyEmail: 'billing@cloudnovasystems.io',
      companyAddress: '500 Tech Boulevard, Silicon Valley, CA 94025',
      client: 'ScaleUp Ventures LLC',
      clientEmail: 'finance@scaleupventures.co',
      clientAddress: '101 Hudson St, Floor 22, Jersey City, NJ 07302',
      currency: 'USD',
      taxRate: 0,
      items: [
        { description: 'Enterprise Cloud Platform License (Annual)', quantity: 1, rate: 2400, taxRate: 0, taxAmount: 0, amount: 2400 },
        { description: 'Dedicated Kubernetes Cluster Management (Monthly)', quantity: 1, rate: 650, taxRate: 0, taxAmount: 0, amount: 650 },
        { description: 'Premium 24/7 SLA Technical Support Tier', quantity: 1, rate: 350, taxRate: 0, taxAmount: 0, amount: 350 }
      ],
      notes: 'Thank you for choosing CloudNova as your cloud infrastructure partner.',
      terms: 'Payment due within 30 days. Auto-renews unless canceled 15 days prior.'
    },
    {
      docType: 'tax_invoice',
      name: 'Corporate Legal & Tax Audit GST Invoice',
      category: 'corporate',
      industry: 'Legal & CA',
      styleName: 'Classic Corporate',
      font: 'serif',
      variant: 'corporate-banner',
      primary: '#0f172a',
      accent: '#64748b',
      bg: '#f8fafc',
      company: 'Apex Legal & Chartered Associates',
      companyEmail: 'tax@apexlegalassociates.com',
      companyAddress: 'Level 18, World Trade Tower, Barakhamba Rd, New Delhi 110001',
      client: 'Vanguard Global Holdings',
      clientEmail: 'legal@vanguardglobal.com',
      clientAddress: 'Bandra Kurla Complex, Bandra East, Mumbai 400051',
      currency: 'INR',
      taxRate: 18,
      items: [
        { description: 'Annual Corporate Tax Audit & Statutory Filing (FY 2025-26)', quantity: 1, rate: 55000, taxRate: 18, taxAmount: 9900, amount: 55000 },
        { description: 'Cross-Border Intellectual Property Assignment Agreement', quantity: 1, rate: 25000, taxRate: 18, taxAmount: 4500, amount: 25000 },
        { description: 'Regulatory Compliance & Board Meeting Documentation', quantity: 1, rate: 15000, taxRate: 18, taxAmount: 2700, amount: 15000 }
      ],
      notes: 'Please quote Tax Invoice # on wire transfers. GST input credit available.',
      terms: 'Payment due within 15 calendar days from date of invoice.'
    },
    {
      docType: 'proforma_invoice',
      name: 'Enterprise Logistics Proforma Invoice',
      category: 'logistics',
      industry: 'Logistics & Cargo',
      styleName: 'Royal Border',
      font: 'sans-serif',
      variant: 'royal-border',
      primary: '#1e40af',
      accent: '#60a5fa',
      bg: '#eff6ff',
      company: 'GlobalLogix Freight & Express',
      companyEmail: 'dispatch@globallogixcargo.com',
      companyAddress: 'Cargo Complex Terminal 3, IGI Airport, New Delhi 110037',
      client: 'Apex Electronics Manufacturing',
      clientEmail: 'inbound@apexelectronics.com',
      clientAddress: 'Plot 55, Ecotech Industrial Park, Greater Noida 201306',
      currency: 'INR',
      taxRate: 18,
      items: [
        { description: 'Air Freight Cargo Consignment (5 Boxes - 120 kg Total Weight)', quantity: 1, rate: 18500, taxRate: 18, taxAmount: 3330, amount: 18500 },
        { description: 'Customs Clearance, Documentation & Port Handling Fee', quantity: 1, rate: 4500, taxRate: 18, taxAmount: 810, amount: 4500 },
        { description: 'Comprehensive Transit Insurance Coverage (Value ₹5,00,000)', quantity: 1, rate: 2500, taxRate: 18, taxAmount: 450, amount: 2500 }
      ],
      notes: 'Proforma invoice for advance customs clearance and flight booking.',
      terms: '100% advance payment required prior to dispatch.'
    },
    {
      docType: 'quote',
      name: 'Brand Identity & UI/UX Quote',
      category: 'creative',
      industry: 'Creative & Design',
      styleName: 'Creative Gradient',
      font: 'sans-serif',
      variant: 'creative-gradient',
      primary: '#7c3aed',
      accent: '#c084fc',
      bg: '#faf5ff',
      company: 'Lumina Design Lab',
      companyEmail: 'hello@luminadesign.co',
      companyAddress: 'Studio 12, Soho Arts District, London W1D 3NE',
      client: 'Aura Lifestyle Brands',
      clientEmail: 'creative@auralifestyle.co.uk',
      clientAddress: '24 Kingsway, Covent Garden, London WC2B 6EY',
      currency: 'GBP',
      taxRate: 20,
      items: [
        { description: 'Complete Brand Identity Suite (Logo, Typography, Guidelines)', quantity: 1, rate: 1850, taxRate: 20, taxAmount: 370, amount: 1850 },
        { description: 'Mobile App High-Fidelity UI/UX & Interactive Prototype', quantity: 1, rate: 2200, taxRate: 20, taxAmount: 440, amount: 2200 },
        { description: 'Custom Vector Iconography & Social Media Kit (15 Assets)', quantity: 1, rate: 600, taxRate: 20, taxAmount: 120, amount: 600 }
      ],
      notes: 'We look forward to transforming your brand visual identity.',
      terms: 'Quotation valid for 30 days. 50% deposit required upon project commencement.'
    },
    {
      docType: 'estimate',
      name: 'Commercial Shoot & Media Production Estimate',
      category: 'creative',
      industry: 'Photography & Media',
      styleName: 'Executive Minimal',
      font: 'sans-serif',
      variant: 'minimal-swiss',
      primary: '#1e293b',
      accent: '#eab308',
      bg: '#f8fafc',
      company: 'Velox Media & Film Studios',
      companyEmail: 'projects@veloxstudios.tv',
      companyAddress: 'Studio 4, Film City, Goregaon East, Mumbai 400065',
      client: 'GlowCosmetics International',
      clientEmail: 'marketing@glowcosmetics.com',
      clientAddress: '14 Fashion Avenue, Juhu, Mumbai 400049',
      currency: 'INR',
      taxRate: 18,
      items: [
        { description: 'Full-Day Studio Product Shoot with Cinema 4K Cameras', quantity: 1, rate: 35000, taxRate: 18, taxAmount: 6300, amount: 35000 },
        { description: '4K Drone Aerial Shots & Creative Lighting Technician', quantity: 1, rate: 15000, taxRate: 18, taxAmount: 2700, amount: 15000 },
        { description: 'High-End Color Grading, Skin Retouching & Master Export', quantity: 1, rate: 20000, taxRate: 18, taxAmount: 3600, amount: 20000 }
      ],
      notes: 'Estimate covers all pre-production, equipment rentals, and master delivery.',
      terms: '50% advance booking fee, 50% upon final master video delivery.'
    },
    {
      docType: 'purchase_order',
      name: 'Building Materials & Procurement PO',
      category: 'corporate',
      industry: 'Construction & Trades',
      styleName: 'High Contrast',
      font: 'sans-serif',
      variant: 'high-contrast',
      primary: '#d97706',
      accent: '#fbbf24',
      bg: '#fffbeb',
      company: 'Zenith Infra & Construction Ltd',
      companyEmail: 'procurement@zenithinfra.com',
      companyAddress: 'Industrial Area Phase 2, Peenya, Bengaluru 560058',
      client: 'Metro Cement & Steel Suppliers',
      clientEmail: 'orders@metrocementsteel.com',
      clientAddress: 'Plot 14, Outer Ring Road Logistics Park, Pune 411019',
      currency: 'INR',
      taxRate: 18,
      items: [
        { description: 'Grade 53 OPC Cement Bags (50kg each)', quantity: 200, rate: 380, taxRate: 18, taxAmount: 13680, amount: 76000 },
        { description: 'TMT Steel Rebars Fe-550D (12mm Diameter - Tonnes)', quantity: 3, rate: 58000, taxRate: 18, taxAmount: 31320, amount: 174000 },
        { description: 'Pre-mixed Ready Mix Concrete M25 Grade (Cubic Metres)', quantity: 15, rate: 4200, taxRate: 18, taxAmount: 11340, amount: 63000 }
      ],
      notes: 'Delivery required at Site #4 (Green Valley Township) by 25th of this month.',
      terms: 'Official Purchase Order. Payment released after material quality inspection.'
    },
    {
      docType: 'receipt',
      name: 'Payment Settlement Acknowledgment Receipt',
      category: 'freelance',
      industry: 'Freelance & Dev',
      styleName: 'Emerald Pay',
      font: 'sans-serif',
      variant: 'emerald-pay',
      primary: '#059669',
      accent: '#34d399',
      bg: '#ecfdf5',
      company: 'DevCraft Studio',
      companyEmail: 'alex@devcraftstudio.dev',
      companyAddress: 'Block 4B, Koramangala 5th Block, Bengaluru 560095',
      client: 'Nexar Retail Solutions',
      clientEmail: 'accounts@nexartech.in',
      clientAddress: 'Plot 78, Cyber City, Gurugram 122002',
      currency: 'INR',
      taxRate: 18,
      items: [
        { description: 'Full-Stack React & Node.js Web App Development (Sprint 1)', quantity: 1, rate: 45000, taxRate: 18, taxAmount: 8100, amount: 45000 },
        { description: 'Payment Gateway Integration & Webhook Security', quantity: 1, rate: 12000, taxRate: 18, taxAmount: 2160, amount: 12000 },
        { description: 'UI Performance Optimization & Mobile Responsiveness', quantity: 1, rate: 8000, taxRate: 18, taxAmount: 1440, amount: 8000 }
      ],
      notes: 'Official payment settlement receipt. Full payment received with thanks.',
      terms: 'Retain this official receipt for tax write-off and accounting records.'
    },
    {
      docType: 'sales_receipt',
      name: 'Retail Store Counter Sales Receipt',
      category: 'retail',
      industry: 'Retail & POS',
      styleName: 'Clean Edge',
      font: 'sans-serif',
      variant: 'clean-edge',
      primary: '#ea580c',
      accent: '#fb923c',
      bg: '#fff7ed',
      company: 'UrbanStyle MegaStore & Apparel',
      companyEmail: 'store@urbanstyleapparel.com',
      companyAddress: 'Shop 104-106, High Street Mall, South Extension, New Delhi',
      client: 'Walk-in Customer (Rahul Sharma)',
      clientEmail: 'rahul.sharma88@gmail.com',
      clientAddress: 'Flat 202, Palm Grove Apts, Saket, New Delhi',
      currency: 'INR',
      taxRate: 12,
      items: [
        { description: 'Premium Cotton Slim-Fit Formal Shirt (Navy Blue)', quantity: 2, rate: 1899, taxRate: 12, taxAmount: 455.76, amount: 3798 },
        { description: 'Classic Denim Stretch Jeans (Dark Indigo)', quantity: 1, rate: 2499, taxRate: 12, taxAmount: 299.88, amount: 2499 },
        { description: 'Genuine Leather Formal Belt (Brown)', quantity: 1, rate: 999, taxRate: 12, taxAmount: 119.88, amount: 999 }
      ],
      notes: 'Thank you for shopping at UrbanStyle! Exchange within 14 days with original bill.',
      terms: 'Items bought on clearance discount cannot be returned.'
    },
    {
      docType: 'cash_receipt',
      name: 'Healthcare Clinic Cash Voucher Receipt',
      category: 'medical',
      industry: 'Medical & Healthcare',
      styleName: 'Swiss Bold',
      font: 'sans-serif',
      variant: 'swiss-bold',
      primary: '#0d9488',
      accent: '#2dd4bf',
      bg: '#f0fdfa',
      company: 'CarePlus Multispeciality Clinic',
      companyEmail: 'billing@careplusclinic.org',
      companyAddress: '42 Medical Enclave, Health City, Chennai 600006',
      client: 'Arun Kumar (Patient ID #CP-8492)',
      clientEmail: 'arun.k@outlook.com',
      clientAddress: '15 Lake View Road, Nungambakkam, Chennai 600034',
      currency: 'INR',
      taxRate: 0,
      items: [
        { description: 'Senior Consultant Cardiology Comprehensive Examination', quantity: 1, rate: 1500, taxRate: 0, taxAmount: 0, amount: 1500 },
        { description: '12-Lead ECG & 2D Color Doppler Echocardiogram Test', quantity: 1, rate: 2800, taxRate: 0, taxAmount: 0, amount: 2800 },
        { description: 'Comprehensive Lipid & Metabolic Profile Blood Panel', quantity: 1, rate: 1200, taxRate: 0, taxAmount: 0, amount: 1200 }
      ],
      notes: 'Cash received in full. Eligible for tax deduction under Section 80D.',
      terms: 'All diagnostic reports available on patient portal.'
    },
    {
      docType: 'delivery_note',
      name: 'Cargo Dispatch & Delivery Challan',
      category: 'logistics',
      industry: 'Logistics & Cargo',
      styleName: 'Modern Studio',
      font: 'sans-serif',
      variant: 'modern-studio',
      primary: '#0284c7',
      accent: '#38bdf8',
      bg: '#f0f9ff',
      company: 'GlobalLogix Freight & Express',
      companyEmail: 'dispatch@globallogixcargo.com',
      companyAddress: 'Cargo Complex Terminal 3, IGI Airport, New Delhi 110037',
      client: 'Apex Electronics Manufacturing',
      clientEmail: 'inbound@apexelectronics.com',
      clientAddress: 'Plot 55, Ecotech Industrial Park, Greater Noida 201306',
      currency: 'INR',
      taxRate: 0,
      items: [
        { description: 'Industrial Semiconductor ICs (Tray of 500 units)', quantity: 10, rate: 0, taxRate: 0, taxAmount: 0, amount: 0 },
        { description: 'Precision Aluminum Heat Sinks (Batch #HS-882)', quantity: 200, rate: 0, taxRate: 0, taxAmount: 0, amount: 0 }
      ],
      notes: 'Delivery Challan / Gate Pass. Goods dispatched for fabrication only, not for commercial sale.',
      terms: 'Consignee verification and signature required upon receipt of goods.'
    },
    {
      docType: 'credit_note',
      name: 'Merchandise Return Credit Note',
      category: 'retail',
      industry: 'Retail & POS',
      styleName: 'Creative Gradient',
      font: 'sans-serif',
      variant: 'creative-gradient',
      primary: '#be123c',
      accent: '#fb7185',
      bg: '#fff1f2',
      company: 'UrbanStyle MegaStore & Apparel',
      companyEmail: 'returns@urbanstyleapparel.com',
      companyAddress: 'Shop 104-106, High Street Mall, South Extension, New Delhi',
      client: 'Rahul Sharma',
      clientEmail: 'rahul.sharma88@gmail.com',
      clientAddress: 'Flat 202, Palm Grove Apts, Saket, New Delhi',
      currency: 'INR',
      taxRate: 12,
      items: [
        { description: 'Returned Item: Classic Denim Stretch Jeans (Size M - Fit Mismatch)', quantity: 1, rate: 2499, taxRate: 12, taxAmount: 299.88, amount: 2499 }
      ],
      notes: 'Credit balance adjusted against customer account. Store credit valid for 12 months.',
      terms: 'Credit note can be redeemed at any UrbanStyle retail outlet or online.'
    },
    {
      docType: 'credit_memo',
      name: 'Corporate Account Credit Adjustment Memo',
      category: 'corporate',
      industry: 'Legal & CA',
      styleName: 'Tech Monochrome',
      font: 'monospace',
      variant: 'tech-mono',
      primary: '#18181b',
      accent: '#71717a',
      bg: '#fafafa',
      company: 'Apex Legal & Chartered Associates',
      companyEmail: 'tax@apexlegalassociates.com',
      companyAddress: 'Level 18, World Trade Tower, Barakhamba Rd, New Delhi 110001',
      client: 'Vanguard Global Holdings',
      clientEmail: 'legal@vanguardglobal.com',
      clientAddress: 'Bandra Kurla Complex, Bandra East, Mumbai 400051',
      currency: 'INR',
      taxRate: 18,
      items: [
        { description: 'Billing Adjustment: Milestone 2 Hours Reconciliation Credit', quantity: 1, rate: 12000, taxRate: 18, taxAmount: 2160, amount: 12000 }
      ],
      notes: 'Credit memorandum applied directly to customer open balance.',
      terms: 'Adjustment will be reflected on next monthly consolidated statement.'
    }
  ];

  return curatedTemplates.map(t => ({
    name: t.name,
    description: `Professional ${t.styleName} layout tailored for ${t.industry} with pre-filled line items and tax calculations.`,
    category: t.category,
    documentType: t.docType,
    templateData: {
      primaryColor: t.primary,
      accentColor: t.accent,
      bgColor: t.bg,
      fontFamily: t.font,
      layoutVariant: t.variant,
      industry: t.industry,
      companyName: t.company,
      companyEmail: t.companyEmail,
      companyAddress: t.companyAddress,
      clientName: t.client,
      clientEmail: t.clientEmail,
      clientAddress: t.clientAddress,
      currency: t.currency,
      taxRate: t.taxRate,
      sampleItems: t.items,
      notes: t.notes,
      terms: t.terms
    }
  }));
}
