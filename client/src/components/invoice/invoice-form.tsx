import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";
import { Upload, Plus, Save, FileText, Download } from "lucide-react";
import LineItemManager, { type LineItem } from "./line-item-manager";
import { generateInvoicePDF } from "@/lib/pdf-generator";
import SimpleCurrencySelector from "@/components/ui/simple-currency-selector";
import { formatCurrency } from "@shared/currencies";

// Helper function to get document prefix based on type
const getDocumentPrefix = (documentType: string) => {
  switch (documentType) {
    case 'quote': return 'QUO';
    case 'credit_note': return 'CN';
    case 'purchase_order': return 'PO';
    default: return 'INV';
  }
};

// Helper function to get document labels
const getDocumentLabels = (documentType: string) => {
  switch (documentType) {
    case 'quote': return {
      number: 'Quote Number',
      date: 'Quote Date',
      due: 'Valid Until',
      title: 'Quote'
    };
    case 'credit_note': return {
      number: 'Credit Note Number',
      date: 'Credit Date',
      due: 'Reference Date',
      title: 'Credit Note'
    };
    case 'purchase_order': return {
      number: 'PO Number',
      date: 'Order Date',
      due: 'Required By',
      title: 'Purchase Order'
    };
    default: return {
      number: 'Invoice Number',
      date: 'Invoice Date',
      due: 'Due Date',
      title: 'Invoice'
    };
  }
};

const invoiceFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.string().email("Valid email is required"),
  companyAddress: z.string().min(1, "Company address is required"),
  companyLogo: z.string().optional(),
  
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Valid client email is required"),
  clientAddress: z.string().min(1, "Client address is required"),
  
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
  
  // Financial information
  currency: z.string().min(3).max(3).default("USD"),
  taxRate: z.number().min(0).max(100),
  discount: z.number().min(0),
  shippingCost: z.number().min(0),
  
  // Payment information
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  paymentInstructions: z.string().optional(),
  
  notes: z.string().optional(),
  terms: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

interface LineItem {
  id?: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceFormProps {
  invoice?: any;
  template?: any;
  onPreview?: () => void;
  onDataChange?: (data: any) => void;
  documentType?: 'invoice' | 'quote' | 'credit_note' | 'purchase_order';
  onLineItemsChange?: (items: any[]) => void;
  onLogoChange?: (logo: string) => void;
}

export default function InvoiceForm({ 
  invoice, 
  template, 
  onPreview,
  onDataChange,
  documentType = 'invoice',
  onLineItemsChange,
  onLogoChange
}: InvoiceFormProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  // Get document-specific labels
  const labels = getDocumentLabels(documentType);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, rate: 0, taxRate: 0, taxAmount: 0, amount: 0 }
  ]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    mode: "onChange",
    defaultValues: {
      companyName: invoice?.companyName || "",
      companyEmail: invoice?.companyEmail || "",
      companyAddress: invoice?.companyAddress || "",
      companyLogo: invoice?.companyLogo || "",
      
      clientName: invoice?.clientName || "",
      clientEmail: invoice?.clientEmail || "",
      clientAddress: invoice?.clientAddress || "",
      
      // Shipping defaults
      shipToName: invoice?.shipToName || "",
      shipToAddress: invoice?.shipToAddress || "",
      shipToCity: invoice?.shipToCity || "",
      shipToState: invoice?.shipToState || "",
      shipToZip: invoice?.shipToZip || "",
      shipToCountry: invoice?.shipToCountry || "",
      shipToEmail: invoice?.shipToEmail || "",
      
      invoiceNumber: invoice?.invoiceNumber || `${getDocumentPrefix(documentType)}-${Date.now()}`,
      issueDate: invoice?.issueDate ? new Date(invoice.issueDate).toISOString().split('T')[0] : 
                 new Date().toISOString().split('T')[0],
      dueDate: invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : 
               new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      
      taxRate: invoice?.taxRate ? parseFloat(invoice.taxRate) : 0,
      discount: invoice?.discount ? parseFloat(invoice.discount) : 0,
      shippingCost: invoice?.shippingCost ? parseFloat(invoice.shippingCost) : 0,
      
      // Currency default
      currency: invoice?.currency || "USD",
      
      // Payment defaults
      bankName: invoice?.bankName || "",
      accountNumber: invoice?.accountNumber || "",
      routingNumber: invoice?.routingNumber || "",
      paymentInstructions: invoice?.paymentInstructions || "",
      
      notes: invoice?.notes || "",
      terms: invoice?.terms || "Payment is due within 30 days",
    },
  });

  // Apply template data when template is selected
  useEffect(() => {
    if (template && !invoice) {
      // Apply template styling/defaults based on template data
      const templateData = template.templateData || {};
      
      // Set default terms based on template category
      let defaultTerms = "Payment is due within 30 days";
      if (template.category === "creative") {
        defaultTerms = "Payment is due within 15 days of invoice date";
      } else if (template.category === "modern") {
        defaultTerms = "Payment is due within 30 days. Thank you for your business!";
      } else if (template.category === "classic") {
        defaultTerms = "Payment is due within 30 days from invoice date";
      }
      
      form.setValue("terms", defaultTerms);
    }
  }, [template, invoice, form]);

  // Load line items if editing
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
    }
  }, [invoice]);

  // Update shared state when form data changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form data changed:", value);
      onDataChange?.(value);
    });
    return () => subscription.unsubscribe();
  }, [form, onDataChange]);

  // Update shared state when line items change
  useEffect(() => {
    onLineItemsChange?.(lineItems);
  }, [lineItems, onLineItemsChange]);

  // Initialize shared state with default values
  useEffect(() => {
    const initialData = form.getValues();
    console.log("Initializing form data:", initialData);
    onDataChange?.(initialData);
  }, [form, onDataChange]);
  
  // Force update on mount with all current values
  useEffect(() => {
    const currentValues = form.getValues();
    console.log("Form mounted with values:", currentValues);
    onDataChange?.(currentValues);
  }, []);

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxRate = form.watch("taxRate") || 0;
  const discount = form.watch("discount") || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount - discount;
  const selectedCurrency = form.watch("currency") || "USD";

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        setLogoPreview(logoUrl);
        onLogoChange?.(logoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveInvoiceMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = invoice?.id ? `/api/invoices/${invoice.id}` : "/api/invoices";
      const method = invoice?.id ? "PUT" : "POST";
      
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: (savedInvoice) => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: "Success",
        description: invoice?.id ? "Invoice updated successfully" : "Invoice created successfully",
      });
      setLocation("/invoices");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save invoice",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InvoiceFormData) => {
    const invoiceData = {
      ...data,
      templateId: template?.id,
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2),
      status: "draft",
      paymentStatus: "pending",
      lineItems: lineItems.filter(item => item.description.trim() !== ""),
    };

    saveInvoiceMutation.mutate(invoiceData);
  };

  const handleGeneratePDF = async () => {
    const formData = form.getValues();
    const invoiceData = {
      ...formData,
      lineItems,
      subtotal,
      taxAmount,
      total,
      logoPreview,
    };

    try {
      await generateInvoicePDF(invoiceData);
      toast({
        title: "Success",
        description: "PDF generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };



  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Logo Upload */}
            <div>
              <Label htmlFor="logo">Company Logo</Label>
              <div className="mt-2">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain rounded" />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("logo")?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  {...form.register("companyName")}
                  placeholder="Your Company Name"
                />
                {form.formState.errors.companyName && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.companyName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="companyEmail">Email *</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  {...form.register("companyEmail")}
                  placeholder="your@company.com"
                />
                {form.formState.errors.companyEmail && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.companyEmail.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="companyAddress">Address *</Label>
              <Textarea
                id="companyAddress"
                {...form.register("companyAddress")}
                placeholder="Your business address"
                rows={3}
              />
              {form.formState.errors.companyAddress && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.companyAddress.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Bill To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  {...form.register("clientName")}
                  placeholder="Client Name"
                />
                {form.formState.errors.clientName && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.clientName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="clientEmail">Email *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  {...form.register("clientEmail")}
                  placeholder="client@company.com"
                />
                {form.formState.errors.clientEmail && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.clientEmail.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="clientAddress">Address *</Label>
              <Textarea
                id="clientAddress"
                {...form.register("clientAddress")}
                placeholder="Client address"
                rows={3}
              />
              {form.formState.errors.clientAddress && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.clientAddress.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card>
          <CardHeader>
            <CardTitle>Ship To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shipToName">Name</Label>
                <Input
                  id="shipToName"
                  {...form.register("shipToName")}
                  placeholder="Shipping contact name"
                />
              </div>
              <div>
                <Label htmlFor="shipToEmail">Email</Label>
                <Input
                  id="shipToEmail"
                  type="email"
                  {...form.register("shipToEmail")}
                  placeholder="shipping@company.com"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="shipToAddress">Address</Label>
              <Textarea
                id="shipToAddress"
                {...form.register("shipToAddress")}
                placeholder="Shipping address"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shipToCity">City</Label>
                <Input
                  id="shipToCity"
                  {...form.register("shipToCity")}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="shipToState">State</Label>
                <Input
                  id="shipToState"
                  {...form.register("shipToState")}
                  placeholder="State"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shipToZip">ZIP Code</Label>
                <Input
                  id="shipToZip"
                  {...form.register("shipToZip")}
                  placeholder="ZIP Code"
                />
              </div>
              <div>
                <Label htmlFor="shipToCountry">Country</Label>
                <Input
                  id="shipToCountry"
                  {...form.register("shipToCountry")}
                  placeholder="Country"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Details */}
        <Card>
          <CardHeader>
            <CardTitle>{labels.title} Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">{labels.number} *</Label>
                <Input
                  id="invoiceNumber"
                  {...form.register("invoiceNumber")}
                  placeholder={`${getDocumentPrefix(documentType)}-001`}
                />
                {form.formState.errors.invoiceNumber && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.invoiceNumber.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="issueDate">{labels.date} *</Label>
                <Input
                  id="issueDate"
                  type="date"
                  {...form.register("issueDate")}
                />
                {form.formState.errors.issueDate && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.issueDate.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="dueDate">{labels.due} *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  {...form.register("dueDate")}
                />
                {form.formState.errors.dueDate && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.dueDate.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <LineItemManager
              lineItems={lineItems}
              onLineItemsChange={setLineItems}
            />
          </CardContent>
        </Card>

        {/* Totals */}
        <Card>
          <CardHeader>
            <CardTitle>Totals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <SimpleCurrencySelector
                  value={form.watch("currency") || "USD"}
                  onValueChange={(value) => {
                    console.log("Currency changed to:", value);
                    form.setValue("currency", value);
                    form.trigger("currency");
                  }}
                  label="Currency"
                />
              </div>
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  {...form.register("taxRate", { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount</Label>
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  {...form.register("discount", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="shippingCost">Shipping Cost</Label>
                <Input
                  id="shippingCost"
                  type="number"
                  step="0.01"
                  {...form.register("shippingCost", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal, selectedCurrency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax ({taxRate}%):</span>
                <span>{formatCurrency(taxAmount, selectedCurrency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span>-{formatCurrency(discount, selectedCurrency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>{formatCurrency(form.watch("shippingCost") || 0, selectedCurrency)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(subtotal + taxAmount - discount + (form.watch("shippingCost") || 0), selectedCurrency)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes and Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...form.register("notes")}
                placeholder="Any additional notes or comments"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="paymentDetails">Payment Details</Label>
              <Textarea
                id="paymentDetails"
                {...form.register("paymentDetails")}
                placeholder="Bank account details, payment instructions, etc."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="terms">Payment Terms</Label>
              <Textarea
                id="terms"
                {...form.register("terms")}
                placeholder="Payment terms (e.g., Net 30)"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="termsConditions">Terms & Conditions</Label>
              <Textarea
                id="termsConditions"
                {...form.register("termsConditions")}
                placeholder="Terms and conditions for this transaction"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            className="btn-primary flex-1"
            disabled={saveInvoiceMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {saveInvoiceMutation.isPending ? "Saving..." : "Save Invoice"}
          </Button>
          
          <Button
            type="button"
            onClick={handleGeneratePDF}
            className="btn-accent flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          

          
          {onPreview && (
            <Button
              type="button"
              onClick={onPreview}
              variant="outline"
              className="flex-1"
            >
              Preview
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
