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
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
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

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
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
    return await db
      .select()
      .from(invoices)
      .where(eq(invoices.userId, userId))
      .orderBy(desc(invoices.createdAt));
  }

  async getInvoice(id: number, userId: string): Promise<Invoice | undefined> {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, userId)));
    return invoice;
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db
      .insert(invoices)
      .values(invoice)
      .returning();
    return newInvoice;
  }

  async updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice> {
    const [updatedInvoice] = await db
      .update(invoices)
      .set({ ...invoice, updatedAt: new Date() })
      .where(eq(invoices.id, id))
      .returning();
    return updatedInvoice;
  }

  async deleteInvoice(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Invoice line item operations
  async getInvoiceLineItems(invoiceId: number): Promise<InvoiceLineItem[]> {
    return await db
      .select()
      .from(invoiceLineItems)
      .where(eq(invoiceLineItems.invoiceId, invoiceId));
  }

  async createInvoiceLineItem(lineItem: InsertInvoiceLineItem): Promise<InvoiceLineItem> {
    const [newLineItem] = await db
      .insert(invoiceLineItems)
      .values(lineItem)
      .returning();
    return newLineItem;
  }

  async updateInvoiceLineItem(id: number, lineItem: Partial<InsertInvoiceLineItem>): Promise<InvoiceLineItem> {
    const [updatedLineItem] = await db
      .update(invoiceLineItems)
      .set(lineItem)
      .where(eq(invoiceLineItems.id, id))
      .returning();
    return updatedLineItem;
  }

  async deleteInvoiceLineItem(id: number): Promise<boolean> {
    const result = await db
      .delete(invoiceLineItems)
      .where(eq(invoiceLineItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Template operations
  async getTemplates(): Promise<InvoiceTemplate[]> {
    return await this.getInvoiceTemplates();
  }

  async getInvoiceTemplates(): Promise<InvoiceTemplate[]> {
    const existingTemplates = await db.select().from(invoiceTemplates);
    
    // If no templates exist, create default ones
    if (existingTemplates.length === 0) {
      await this.createDefaultTemplates();
      return await db.select().from(invoiceTemplates);
    }
    
    return existingTemplates;
  }

  private async createDefaultTemplates(): Promise<void> {
    const defaultTemplates = [
      {
        name: "Classic White",
        description: "Clean and professional design",
        category: "classic",
        documentType: "invoice",
        templateData: { primaryColor: "#1f2937", bgColor: "#ffffff" }
      },
      {
        name: "Modern Blue", 
        description: "Contemporary blue theme",
        category: "modern",
        documentType: "invoice", 
        templateData: { primaryColor: "#2563eb", bgColor: "#f8fafc" }
      },
      {
        name: "Green Quote",
        description: "Professional quote template",
        category: "modern",
        documentType: "quote",
        templateData: { primaryColor: "#059669", bgColor: "#f0fdf4" }
      },
      {
        name: "Red Credit Note",
        description: "Credit note template", 
        category: "modern",
        documentType: "credit_note",
        templateData: { primaryColor: "#dc2626", bgColor: "#fef2f2" }
      },
      {
        name: "Purple Purchase Order",
        description: "Purchase order template",
        category: "modern",
        documentType: "purchase_order", 
        templateData: { primaryColor: "#7c3aed", bgColor: "#faf5ff" }
      }
    ];

    for (const template of defaultTemplates) {
      await db.insert(invoiceTemplates).values(template);
    }
  }

  async getInvoiceTemplate(id: number): Promise<InvoiceTemplate | undefined> {
    const [template] = await db
      .select()
      .from(invoiceTemplates)
      .where(eq(invoiceTemplates.id, id));
    return template;
  }

  async createInvoiceTemplate(template: InsertInvoiceTemplate): Promise<InvoiceTemplate> {
    const [newTemplate] = await db
      .insert(invoiceTemplates)
      .values(template)
      .returning();
    return newTemplate;
  }

  async updateInvoiceTemplate(id: number, template: Partial<InsertInvoiceTemplate>): Promise<InvoiceTemplate> {
    const [updatedTemplate] = await db
      .update(invoiceTemplates)
      .set({ ...template, updatedAt: new Date() })
      .where(eq(invoiceTemplates.id, id))
      .returning();
    return updatedTemplate;
  }
}

export const storage = new DatabaseStorage();
