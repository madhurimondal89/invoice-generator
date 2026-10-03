import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertInvoiceSchema, insertInvoiceLineItemSchema } from "@shared/schema";
import { z } from "zod";
import * as fs from 'fs';
import * as path from 'path';

function logErrorToFile(error: any, context: string) {
  const logPath = path.join(process.cwd(), 'server_error.log');
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : '';
  const logEntry = `[${timestamp}] [${context}] ${errorMessage}\n${stack}\n-------------------\n`;

  try {
    fs.appendFileSync(logPath, logEntry);
  } catch (e) {
    console.error("Failed to write to log file:", e);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Coolify, Docker, and uptime monitoring
  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      app: "Invoice Genius",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development"
    });
  });

  // Dynamic robots.txt
  app.get("/robots.txt", (req, res) => {
    const host = req.get("host") || "invoicegenius.com";
    const protocol = req.protocol === "https" || req.get("x-forwarded-proto") === "https" ? "https" : "http";
    const robots = [
      "User-agent: *",
      "Allow: /",
      "Allow: /templates",
      "Allow: /invoice/new",
      "Allow: /tax-invoice/new",
      "Allow: /proforma-invoice/new",
      "Allow: /quote/new",
      "Allow: /receipt/new",
      "Allow: /purchase-order/new",
      "Allow: /credit-note/new",
      "Allow: /llms.txt",
      "Allow: /llms-full.txt",
      "Allow: /sitemap.xml",
      "Disallow: /api/auth/",
      "Disallow: /api/invoices/",
      "Disallow: /invoices",
      "",
      "# Generative Engine Optimization (GEO) & Answer Engine Optimization (AEO)",
      "User-agent: GPTBot",
      "Allow: /",
      "User-agent: ChatGPT-User",
      "Allow: /",
      "User-agent: PerplexityBot",
      "Allow: /",
      "User-agent: Claude-Web",
      "Allow: /",
      "User-agent: anthropic-ai",
      "Allow: /",
      "User-agent: Google-Extended",
      "Allow: /",
      "User-agent: Applebot-Extended",
      "Allow: /",
      "User-agent: cohere-ai",
      "Allow: /",
      "",
      `Sitemap: ${protocol}://${host}/sitemap.xml`
    ].join("\n");
    res.type("text/plain").send(robots);
  });

  // Dynamic sitemap.xml resolving to the exact live domain connected in Coolify
  app.get("/sitemap.xml", (req, res) => {
    const host = req.get("host") || "invoicegenius.com";
    const protocol = req.protocol === "https" || req.get("x-forwarded-proto") === "https" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;
    const today = new Date().toISOString().split("T")[0];

    const routes = [
      { path: "/", priority: "1.0", changefreq: "daily" },
      { path: "/templates", priority: "0.9", changefreq: "weekly" },
      { path: "/invoice/new", priority: "0.9", changefreq: "weekly" },
      { path: "/tax-invoice/new", priority: "0.9", changefreq: "weekly" },
      { path: "/proforma-invoice/new", priority: "0.8", changefreq: "weekly" },
      { path: "/quote/new", priority: "0.8", changefreq: "weekly" },
      { path: "/receipt/new", priority: "0.8", changefreq: "weekly" },
      { path: "/sales-receipt/new", priority: "0.7", changefreq: "weekly" },
      { path: "/cash-receipt/new", priority: "0.7", changefreq: "weekly" },
      { path: "/purchase-order/new", priority: "0.8", changefreq: "weekly" },
      { path: "/credit-note/new", priority: "0.7", changefreq: "weekly" }
    ];

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...routes.map(r => `  <url>\n    <loc>${baseUrl}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`),
      '</urlset>'
    ].join("\n");

    res.type("application/xml").send(xml);
  });

  // Auth middleware
  await setupAuth(app);

  // Auth routes with development bypass
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // In development, create a mock user if not authenticated
      if (process.env.NODE_ENV === 'development' && !req.isAuthenticated()) {
        const mockUser = {
          id: "dev-user",
          email: "dev@example.com",
          firstName: "Guest",
          lastName: "User",
          profileImageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return res.json(mockUser);
      }

      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Templates route (public for development)
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Invoice routes with development bypass
  app.get("/api/invoices", async (req: any, res) => {
    try {
      let userId = "dev-user";

      if (req.isAuthenticated() && req.user?.claims?.sub) {
        userId = req.user.claims.sub;
      }

      const invoices = await storage.getInvoices(userId);
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      logErrorToFile(error, "GET /api/invoices");
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.get("/api/invoices/:id", async (req: any, res) => {
    try {
      let userId = "dev-user";
      if (req.isAuthenticated() && req.user?.claims?.sub) {
        userId = req.user.claims.sub;
      }
      const invoiceId = parseInt(req.params.id);
      const invoice = await storage.getInvoice(invoiceId, userId);

      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      const lineItems = await storage.getInvoiceLineItems(invoiceId);
      res.json({ ...invoice, lineItems });
    } catch (error) {
      console.error("Error fetching invoice:", error);
      logErrorToFile(error, `GET /api/invoices/${req.params.id}`);
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });

  app.post("/api/invoices", async (req: any, res) => {
    try {
      let userId = "dev-user";
      if (req.isAuthenticated() && req.user?.claims?.sub) {
        userId = req.user.claims.sub;
      }
      const invoiceData = insertInvoiceSchema.parse({
        ...req.body,
        userId,
        invoiceNumber: req.body.invoiceNumber || `INV-${Date.now()}`,
      });

      const invoice = await storage.createInvoice(invoiceData);

      // Create line items if provided
      if (req.body.lineItems && Array.isArray(req.body.lineItems)) {
        for (const lineItem of req.body.lineItems) {
          const lineItemData = insertInvoiceLineItemSchema.parse({
            ...lineItem,
            invoiceId: invoice.id,
          });
          await storage.createInvoiceLineItem(lineItemData);
        }
      }

      res.json(invoice);
    } catch (error) {
      console.error("Error creating invoice:", error);
      logErrorToFile(error, "POST /api/invoices");
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid invoice data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });

  app.put("/api/invoices/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const invoiceId = parseInt(req.params.id);

      // Check if invoice exists and belongs to user
      const existingInvoice = await storage.getInvoice(invoiceId, userId);
      if (!existingInvoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      const invoiceData = insertInvoiceSchema.partial().parse(req.body);
      const updatedInvoice = await storage.updateInvoice(invoiceId, invoiceData);

      res.json(updatedInvoice);
    } catch (error) {
      console.error("Error updating invoice:", error);
      logErrorToFile(error, `PUT /api/invoices/${req.params.id}`);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid invoice data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });

  app.delete("/api/invoices/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const invoiceId = parseInt(req.params.id);

      const success = await storage.deleteInvoice(invoiceId, userId);
      if (!success) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      res.json({ message: "Invoice deleted successfully" });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      res.status(500).json({ message: "Failed to delete invoice" });
    }
  });

  // Line item routes
  app.post("/api/invoices/:id/line-items", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const invoiceId = parseInt(req.params.id);

      // Check if invoice exists and belongs to user
      const invoice = await storage.getInvoice(invoiceId, userId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      const lineItemData = insertInvoiceLineItemSchema.parse({
        ...req.body,
        invoiceId,
      });

      const lineItem = await storage.createInvoiceLineItem(lineItemData);
      res.json(lineItem);
    } catch (error) {
      console.error("Error creating line item:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid line item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create line item" });
    }
  });

  app.put("/api/line-items/:id", isAuthenticated, async (req: any, res) => {
    try {
      const lineItemId = parseInt(req.params.id);
      const lineItemData = insertInvoiceLineItemSchema.partial().parse(req.body);

      const updatedLineItem = await storage.updateInvoiceLineItem(lineItemId, lineItemData);
      res.json(updatedLineItem);
    } catch (error) {
      console.error("Error updating line item:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid line item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update line item" });
    }
  });

  app.delete("/api/line-items/:id", isAuthenticated, async (req: any, res) => {
    try {
      const lineItemId = parseInt(req.params.id);
      const success = await storage.deleteInvoiceLineItem(lineItemId);

      if (!success) {
        return res.status(404).json({ message: "Line item not found" });
      }

      res.json({ message: "Line item deleted successfully" });
    } catch (error) {
      console.error("Error deleting line item:", error);
      res.status(500).json({ message: "Failed to delete line item" });
    }
  });

  // Template routes
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getInvoiceTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const template = await storage.getInvoiceTemplate(templateId);

      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Email invoice route (specific invoice)
  app.post("/api/invoices/:id/email", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const invoiceId = parseInt(req.params.id);

      const invoice = await storage.getInvoice(invoiceId, userId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      const { to, subject, message } = req.body;

      // Import email service 
      const { sendEmail } = await import("./ses-email");

      // Create HTML email content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Invoice ${invoice.invoiceNumber}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Invoice ${invoice.invoiceNumber}</h2>
            <p>Dear ${invoice.clientName},</p>
            <p>${message}</p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Invoice Details:</h3>
              <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
              <p><strong>Total Amount:</strong> $${(Number(invoice.total) || 0).toFixed(2)}</p>
              ${invoice.dueDate ? `<p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>` : ''}
            </div>
            
            <p>Best regards,<br>${invoice.companyName}</p>
          </div>
        </body>
        </html>
      `;

      const emailSuccess = await sendEmail({
        to,
        from: process.env.SES_FROM_EMAIL || invoice.companyEmail || 'noreply@invoicegenius.com',
        subject,
        text: message,
        html: htmlContent
      });

      if (!emailSuccess) {
        return res.status(500).json({ message: "Failed to send email via Amazon SES" });
      }

      res.json({
        success: true,
        message: "Invoice email sent successfully via Amazon SES"
      });
    } catch (error) {
      console.error("Error sending invoice email:", error);
      res.status(500).json({ message: "Failed to send invoice email: " + (error instanceof Error ? error.message : 'Unknown error') });
    }
  });

  // General email sending endpoint
  app.post("/api/invoices/send-email", isAuthenticated, async (req, res) => {
    try {
      const { to, subject, message, invoice, attachPDF } = req.body;

      if (!to || !subject) {
        return res.status(400).json({ message: "Missing required email fields" });
      }

      // Import email service 
      const { sendEmail } = await import("./ses-email");

      // Create HTML email content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Invoice ${invoice?.invoiceNumber || ''}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Invoice ${invoice?.invoiceNumber || ''}</h2>
            <p>Dear ${invoice?.clientName || 'Customer'},</p>
            <p>${message}</p>
            
            ${invoice ? `
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Invoice Details:</h3>
              <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
              <p><strong>Total Amount:</strong> $${invoice.total?.toFixed(2) || '0.00'}</p>
              ${invoice.dueDate ? `<p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>` : ''}
            </div>
            ` : ''}
            
            <p>Best regards,<br>${invoice?.companyName || 'Your Company'}</p>
          </div>
        </body>
        </html>
      `;

      const emailSuccess = await sendEmail({
        to,
        from: process.env.SES_FROM_EMAIL || invoice?.companyEmail || 'noreply@invoicegenius.com',
        subject,
        text: message,
        html: htmlContent
      });

      if (!emailSuccess) {
        return res.status(500).json({ message: "Failed to send email via Amazon SES" });
      }

      res.json({
        success: true,
        message: "Invoice email sent successfully via Amazon SES",
        emailId: `ses_${Date.now()}`
      });
    } catch (error) {
      console.error("Error sending invoice email:", error);
      res.status(500).json({ message: "Failed to send invoice email: " + (error instanceof Error ? error.message : 'Unknown error') });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
