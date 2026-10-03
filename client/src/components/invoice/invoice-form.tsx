import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";
import { Save, Download, Sparkles, RefreshCw, Package, Plus } from "lucide-react";
import LineItemManager, { type LineItem } from "./line-item-manager";
import { generateInvoicePDF } from "@/lib/pdf-generator";
import SimpleCurrencySelector from "@/components/ui/simple-currency-selector";
import CurrencyInput from "@/components/ui/currency-input";
import { formatCurrency, getCurrencyByCode } from "@shared/currencies";

// Import modular sections
import CompanySection from "./form-sections/CompanySection";
import ClientSection from "./form-sections/ClientSection";
import DocumentDetails from "./form-sections/DocumentDetails";
import PaymentSection from "./form-sections/PaymentSection";
import ThemeColorSection from "./form-sections/ThemeColorSection";
import { saveLocalInvoice } from "@/lib/browserStorage";
import { getDocumentConfig } from "@/lib/document-config";

// Helper function to get document prefix based on type
const getDocumentPrefix = (documentType: string) => {
  return getDocumentConfig(documentType).prefix;
};

// Helper function to get document labels
const getDocumentLabels = (documentType: string) => {
  const cfg = getDocumentConfig(documentType);
  return {
    number: `${cfg.title} #`,
    date: cfg.dateLabels.issue,
    due: cfg.dateLabels.due,
    title: cfg.title,
    fromHeader: cfg.partyHeaders.from,
    toHeader: cfg.partyHeaders.to,
    clientLabel: documentType === 'purchase_order' 
      ? 'Vendor / Supplier Name' 
      : documentType === 'receipt' || documentType === 'sales_receipt' || documentType === 'cash_receipt' 
      ? 'Payer / Customer Name' 
      : 'Client / Customer Name',
    companyLabel: documentType === 'purchase_order' 
      ? 'Buyer / Company Name' 
      : 'Company Name'
  };
};

const invoiceFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.string().email("Valid email is required"),
  companyAddress: z.string().min(1, "Company address is required"),
  companyPhone: z.string().optional(),
  companyGst: z.string().optional(),
  companyLogo: z.string().optional(),

  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Valid client email is required"),
  clientAddress: z.string().min(1, "Client address is required"),
  clientPhone: z.string().optional(),
  clientGst: z.string().optional(),

  // Shipping information
  shipToName: z.string().optional(),
  shipToAddress: z.string().optional(),
  shipToCity: z.string().optional(),
  shipToState: z.string().optional(),
  shipToZip: z.string().optional(),
  shipToCountry: z.string().optional(),
  shipToEmail: z.string().optional(),

  invoiceNumber: z.string().min(1, "Invoice number is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  poNumber: z.string().optional(),

  // Financial information
  currency: z.string().min(3).max(3).default("USD"),
  taxRate: z.number().min(0).max(100),
  discount: z.number().min(0),
  shippingCost: z.number().min(0),

  // Payment information
  includePaymentDetails: z.boolean().optional().default(true),
  paymentMethod: z.string().optional(),
  bankName: z.string().optional(),
  accountHolderName: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  swiftCode: z.string().optional(),
  ibanNumber: z.string().optional(),
  paymentLink: z.string().optional(),
  upiId: z.string().optional(),
  paymentQrImage: z.string().optional(),
  paymentInstructions: z.string().optional(),

  notes: z.string().optional(),
  terms: z.string().optional(),

  metadata: z.record(z.any()).optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  invoice?: any;
  template?: any;
  onPreview?: () => void;
  onDataChange?: (data: any) => void;
  documentType?: 'invoice' | 'tax_invoice' | 'proforma_invoice' | 'receipt' | 'sales_receipt' | 'cash_receipt' | 'quote' | 'estimate' | 'credit_note' | 'credit_memo' | 'purchase_order' | 'delivery_note';
  onLineItemsChange?: (items: any[]) => void;
  onLogoChange?: (logo: string) => void;
  onDownload?: () => void;
}

export default function InvoiceForm({
  invoice,
  template,
  onPreview,
  onDataChange,
  documentType = 'invoice',
  onLineItemsChange,
  onLogoChange,
  onDownload
}: InvoiceFormProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const labels = getDocumentLabels(documentType);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "Website Design & Development Services", quantity: 1, rate: 850, taxRate: 0, taxAmount: 0, amount: 850 },
    { description: "Cloud Infrastructure Setup & Domain Configuration", quantity: 1, rate: 150, taxRate: 0, taxAmount: 0, amount: 150 }
  ]);
  const [, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    mode: "onBlur",
    defaultValues: {
      companyName: invoice?.companyName || "Acme Digital Solutions Pvt Ltd",
      companyEmail: invoice?.companyEmail || "billing@acmedigital.com",
      companyAddress: invoice?.companyAddress || "124 Innovation Plaza, Tech Park, Suite 400",
      companyPhone: invoice?.companyPhone || "+1 (555) 234-5678",
      companyGst: invoice?.companyGst || "GSTIN27AAAAA0000A1Z5",
      companyLogo: invoice?.companyLogo || "",

      clientName: invoice?.clientName || "Apex Innovations Corp",
      clientEmail: invoice?.clientEmail || "accounts@apexinno.com",
      clientAddress: invoice?.clientAddress || "742 Evergreen Road, Business Bay",
      clientPhone: invoice?.clientPhone || "+1 (555) 987-6543",
      clientGst: invoice?.clientGst || "",

      shipToName: invoice?.shipToName || "",
      shipToAddress: invoice?.shipToAddress || "",
      shipToCity: invoice?.shipToCity || "",
      shipToState: invoice?.shipToState || "",
      shipToZip: invoice?.shipToZip || "",
      shipToCountry: invoice?.shipToCountry || "",
      shipToEmail: invoice?.shipToEmail || "",

      invoiceNumber: invoice?.invoiceNumber || `${getDocumentPrefix(documentType)}-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: invoice?.issueDate ? new Date(invoice.issueDate).toISOString().split('T')[0] :
        new Date().toISOString().split('T')[0],
      dueDate: invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] :
        new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

      taxRate: invoice?.taxRate ? parseFloat(invoice.taxRate) : 5,
      discount: invoice?.discount ? parseFloat(invoice.discount) : 0,
      shippingCost: invoice?.shippingCost ? parseFloat(invoice.shippingCost) : 0,

      currency: invoice?.currency || "USD",

      includePaymentDetails: invoice?.includePaymentDetails ?? (documentType !== 'delivery_note' && documentType !== 'purchase_order'),
      paymentMethod: invoice?.paymentMethod || "UPI / QR Code",
      bankName: invoice?.bankName || "HDFC Bank / Global Chase",
      accountHolderName: invoice?.accountHolderName || "Acme Digital Solutions Pvt Ltd",
      accountNumber: invoice?.accountNumber || "50100456789123",
      routingNumber: invoice?.routingNumber || "HDFC0001234",
      ifscCode: invoice?.ifscCode || "HDFC0001234",
      swiftCode: invoice?.swiftCode || "HDFCINBBXXX",
      ibanNumber: invoice?.ibanNumber || "",
      paymentLink: invoice?.paymentLink || "",
      upiId: invoice?.upiId || "business@okhdfcbank",
      paymentQrImage: invoice?.paymentQrImage || "",
      paymentInstructions: invoice?.paymentInstructions || "Please quote the invoice number when making the bank or UPI transfer.",

      notes: invoice?.notes || "Thank you for partnering with us! We appreciate your business.",
      terms: invoice?.terms || "Payment is due within 15 days of invoice date.",

      metadata: invoice?.metadata || {},
      primaryColor: invoice?.primaryColor || template?.templateData?.primaryColor || "#2563eb",
      accentColor: invoice?.accentColor || template?.templateData?.accentColor || "#60a5fa",
    },
  });

  // Populate sample data function
  const handleFillSampleData = () => {
    form.reset({
      companyName: "Nexus Digital Studio",
      companyEmail: "hello@nexusstudio.io",
      companyAddress: "404 Silicon Way, Cyber City, CA 94016",
      companyPhone: "+1 (800) 555-0199",
      companyGst: "GSTIN29ABCDE1234F1Z5",
      companyLogo: "",

      clientName: "Horizon Enterprises Ltd",
      clientEmail: "billing@horizoncorp.com",
      clientAddress: "88 Market St, Level 12, New York, NY 10005",
      clientPhone: "+1 (212) 555-0144",
      clientGst: "GSTIN07XYZDE9876F1Z2",

      shipToName: "Horizon Tech Logistics",
      shipToAddress: "Warehouse 4, Port Zone",
      shipToCity: "Jersey City",
      shipToState: "NJ",
      shipToZip: "07302",
      shipToCountry: "United States",
      shipToEmail: "logistics@horizoncorp.com",

      invoiceNumber: `${getDocumentPrefix(documentType)}-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

      taxRate: 18,
      discount: 50,
      shippingCost: 0,
      currency: "INR",

      bankName: "HDFC Bank",
      accountNumber: "50200012345678",
      routingNumber: "HDFC0000456",
      ifscCode: "HDFC0000456",
      upiId: "nexusstudio@okhdfcbank",
      paymentInstructions: "Scan the UPI QR code on the bill to pay instantly via GooglePay, PhonePe or Paytm.",

      notes: "Goods and services rendered with 100% satisfaction guarantee.",
      terms: "Payment due within 15 days. 1.5% late fee per month applies on overdue invoices.",
      metadata: {},
      primaryColor: "#2563eb",
      accentColor: "#60a5fa",
    });

    setLineItems([
      { description: "Full-Stack Web Application Development (Phase 1)", quantity: 1, rate: 45000, taxRate: 18, taxAmount: 8100, amount: 45000 },
      { description: "Cloud Hosting, Domain & SSL Certificate Setup", quantity: 1, rate: 5000, taxRate: 18, taxAmount: 900, amount: 5000 },
      { description: "UI/UX Design & Brand Asset Creation", quantity: 2, rate: 12000, taxRate: 18, taxAmount: 4320, amount: 24000 }
    ]);

    toast({
      title: "Sample Data Populated",
      description: "Sample invoice data loaded with UPI QR and INR currency.",
    });
  };

  // Load line items and company/client details from template or existing invoice
  useEffect(() => {
    if (invoice?.lineItems && invoice.lineItems.length > 0) {
      setLineItems(invoice.lineItems.map((item: any) => ({
        id: item.id,
        description: item.description,
        quantity: parseFloat(item.quantity),
        rate: parseFloat(item.rate),
        taxRate: parseFloat(item.taxRate || 0),
        taxAmount: parseFloat(item.taxAmount || 0),
        amount: parseFloat(item.amount),
      })));
    } else if (template?.templateData) {
      const td = template.templateData;
      if (td.sampleItems && td.sampleItems.length > 0) {
        setLineItems(td.sampleItems.map((item: any) => ({
          description: item.description,
          quantity: item.quantity || 1,
          rate: item.rate || 0,
          taxRate: item.taxRate || td.taxRate || 0,
          taxAmount: item.taxAmount || 0,
          amount: item.amount || ((item.quantity || 1) * (item.rate || 0))
        })));
      }

      // Reset form values with tailored template defaults
      form.reset({
        ...form.getValues(),
        primaryColor: td.primaryColor || form.getValues("primaryColor") || "#2563eb",
        accentColor: td.accentColor || form.getValues("accentColor") || "#60a5fa",
        companyName: td.companyName || form.getValues("companyName"),
        companyEmail: td.companyEmail || form.getValues("companyEmail"),
        companyAddress: td.companyAddress || form.getValues("companyAddress"),
        clientName: td.clientName || form.getValues("clientName"),
        clientEmail: td.clientEmail || form.getValues("clientEmail"),
        clientAddress: td.clientAddress || form.getValues("clientAddress"),
        currency: td.currency || form.getValues("currency"),
        taxRate: td.taxRate !== undefined ? td.taxRate : form.getValues("taxRate"),
        notes: td.notes || form.getValues("notes"),
        terms: td.terms || form.getValues("terms"),
      });
    }
  }, [invoice, template]);

  // Update shared state when form data changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      onDataChange?.(value);
    });
    return () => subscription.unsubscribe();
  }, [form, onDataChange]);

  // Update shared state when line items change
  useEffect(() => {
    onLineItemsChange?.(lineItems);
  }, [lineItems, onLineItemsChange]);

  // Initial sync
  useEffect(() => {
    const currentValues = form.getValues();
    onDataChange?.(currentValues);
    onLineItemsChange?.(lineItems);
  }, []);

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const taxRate = form.watch("taxRate") || 0;
  const discount = form.watch("discount") || 0;
  const shippingCost = form.watch("shippingCost") || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount + shippingCost - discount;
  const selectedCurrency = form.watch("currency") || "USD";

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        setLogoPreview(logoUrl);
        form.setValue("companyLogo", logoUrl);
        onLogoChange?.(logoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveInvoiceMutation = useMutation({
    mutationFn: async (data: any) => {
      // Always save to browser localStorage first
      saveLocalInvoice(data);
      
      const url = invoice?.id ? `/api/invoices/${invoice.id}` : "/api/invoices";
      const method = invoice?.id ? "PUT" : "POST";

      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: "Saved Successfully",
        description: "Document saved to both browser storage and cloud.",
      });
      setLocation("/invoices");
    },
    onError: (error) => {
      toast({
        title: "Saved to Browser Storage",
        description: "Document saved securely inside your browser database.",
      });
      setLocation("/invoices");
    },
  });

  const onSubmit = (data: InvoiceFormData) => {
    const invoiceData = {
      ...data,
      id: invoice?.id || undefined,
      templateId: template?.id,
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2),
      status: "draft",
      paymentStatus: "pending",
      lineItems: lineItems.filter(item => item.description.trim() !== ""),
      documentType: documentType
    };

    // Save directly to browser database
    saveLocalInvoice(invoiceData);
    saveInvoiceMutation.mutate(invoiceData);
  };

  const handleGeneratePDF = async () => {
    if (onDownload) {
      onDownload();
      return;
    }

    const formData = form.getValues();
    const invoiceData = {
      ...formData,
      lineItems: lineItems.map((it) => ({
        description: it.description,
        quantity: it.quantity || 1,
        rate: it.rate || 0,
        taxRate: it.taxRate,
        taxAmount: it.taxAmount,
        amount: it.amount ?? ((it.quantity || 1) * (it.rate || 0)),
        hsn: it.hsn
      })),
      subtotal,
      taxAmount,
      total,
      logoPreview,
      documentType,
      primaryColor: formData.primaryColor,
      accentColor: formData.accentColor,
    };

    try {
      await generateInvoicePDF(invoiceData);
      toast({
        title: "Success",
        description: "PDF generated and downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const currentCurrencyObj = getCurrencyByCode(selectedCurrency);
  const currencySymbol = currentCurrencyObj?.symbol || "$";

  return (
    <div className="space-y-6">
      {/* Top Quick Actions */}
      <div className="flex items-center justify-between bg-blue-50/70 border border-blue-200/80 p-3.5 rounded-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-semibold text-blue-900">
            Quick Generator Mode
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleFillSampleData}
          className="h-8 gap-1.5 text-xs border-blue-300 text-blue-700 hover:bg-blue-100/80"
        >
          <RefreshCw className="h-3 w-3" /> Fill Sample Data
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Brand Theme & Colors (Header & Footer) */}
        <ThemeColorSection form={form} />

        {/* Company Section */}
        <CompanySection
          form={form}
          labels={labels}
          logoPreview={logoPreview || (invoice?.companyLogo)}
          onLogoUpload={handleLogoUpload}
        />

        {/* Client & Document Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClientSection
            form={form}
            labels={labels}
            documentType={documentType}
          />
          <DocumentDetails
            form={form}
            labels={labels}
            documentType={documentType}
          />
        </div>

        {/* Line Items Manager */}
        <Card className="border-0 shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Line Items & Products
            </CardTitle>
            <Button
              type="button"
              onClick={() => {
                setLineItems([
                  ...lineItems,
                  { description: "", quantity: 1, rate: 0, taxRate: 0, taxAmount: 0, amount: 0 }
                ]);
              }}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 gap-1.5 shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Add Item
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <LineItemManager
              lineItems={lineItems}
              onLineItemsChange={setLineItems}
              currency={selectedCurrency}
              hideHeader={true}
            />
          </CardContent>
        </Card>

        {/* Totals & Calculations */}
        <Card className="border-0 shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">Calculations & Currency</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Settings Column */}
              <div className="space-y-6">
                <SimpleCurrencySelector
                  value={selectedCurrency}
                  onValueChange={(value) => {
                    form.setValue("currency", value);
                    form.trigger("currency");
                  }}
                  label="Document Currency"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-gray-500">Tax Rate</Label>
                    <div className="relative group">
                      <Input
                        type="number"
                        step="0.01"
                        {...form.register("taxRate", { valueAsNumber: true })}
                        className="h-11 pr-8 bg-gray-50/30 border-gray-200 focus-visible:border-primary focus-visible:ring-primary/20 hover:bg-white transition-all duration-200"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
                    </div>
                  </div>

                  <CurrencyInput
                    label="Discount"
                    currencySymbol={currencySymbol}
                    {...form.register("discount", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>

                <CurrencyInput
                  label="Shipping Cost"
                  currencySymbol={currencySymbol}
                  {...form.register("shippingCost", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>

              {/* Summary Column */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment Summary</h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">{formatCurrency(subtotal, selectedCurrency)}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax ({taxRate}%)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(taxAmount, selectedCurrency)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span>Discount</span>
                      <span className="font-medium">-{formatCurrency(discount, selectedCurrency)}</span>
                    </div>
                  )}

                  {shippingCost > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span className="font-medium text-gray-900">{formatCurrency(shippingCost, selectedCurrency)}</span>
                    </div>
                  )}
                </div>

                <div className="h-px bg-gray-200 my-2"></div>

                <div className="flex justify-between items-end">
                  <span className="text-base font-semibold text-gray-700">Total Due</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(total, selectedCurrency)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment & Terms Section (with UPI QR) */}
        <PaymentSection form={form} />

        {/* Sticky Action Footer */}
        <div className="sticky bottom-4 z-10 flex justify-end gap-3 bg-white/90 backdrop-blur-md p-4 rounded-xl border shadow-lg">
          <Button type="button" variant="outline" size="lg" onClick={handleGeneratePDF} className="shadow-sm hover:bg-gray-50 transition-all">
            <Download className="w-4 h-4 mr-2 text-primary" />
            Download PDF
          </Button>
          <Button type="submit" size="lg" className="shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Document
          </Button>
        </div>
      </form>
    </div>
  );
}
