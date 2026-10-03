import { useState } from "react";
import { generateInvoicePDF } from "@/lib/pdf-generator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import InvoiceForm from "@/components/invoice/invoice-form";
import InvoicePreview from "@/components/invoice/invoice-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";

export default function InvoiceBuilder({ documentType = 'invoice', ...props }: { documentType?: string } & Record<string, any>) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const params = useParams();
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState("form");

  // Shared state for live preview
  const [formData, setFormData] = useState<any>({});
  const [lineItems, setLineItems] = useState<any[]>([]);
  const [logoPreview, setLogoPreview] = useState<string>("");

  // Check if editing an existing invoice
  const invoiceId = params.id ? parseInt(params.id) : null;
  const isEditing = invoiceId !== null;

  // Check for template parameter from window.location.search
  const urlParams = new URLSearchParams(window.location.search || location.split('?')[1] || "");
  const templateId = urlParams.get('template');

  // Fetch invoice data if editing and authenticated
  const { data: invoice, isLoading: invoiceLoading } = useQuery<any>({
    queryKey: ["/api/invoices", invoiceId],
    enabled: isAuthenticated && isEditing,
    retry: false,
  });

  // Fetch template data if template selected
  const { data: template, isLoading: templateLoading } = useQuery<any>({
    queryKey: ["/api/templates", templateId],
    enabled: !!templateId,
    retry: false,
  });

  const handleDownloadPDF = async () => {
    try {
      const subtotal = lineItems.reduce((sum, it) => sum + (it.amount || ((it.quantity || 1) * (it.rate || 0))), 0);
      const taxRate = parseFloat(formData.taxRate) || 0;
      const discount = parseFloat(formData.discount) || 0;
      const shippingCost = parseFloat(formData.shippingCost) || 0;
      const taxAmount = (subtotal * taxRate) / 100;
      const total = subtotal + taxAmount + shippingCost - discount;

      const pdfData = {
        ...formData,
        currency: formData.currency || "USD",
        lineItems,
        subtotal,
        taxAmount,
        total,
        logoPreview: logoPreview || formData.companyLogo,
        companyLogo: logoPreview || formData.companyLogo,
        documentType: template?.documentType || documentType,
        primaryColor: template?.templateData?.primaryColor || formData?.primaryColor,
      };

      await generateInvoicePDF(pdfData);
      toast({
        title: "PDF Downloaded",
        description: `Downloaded ${formData.invoiceNumber || 'invoice'}.pdf`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  if ((authLoading && isEditing) || invoiceLoading || templateLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Use template document type if available, otherwise route param
  const activeDocumentType = template?.documentType || documentType;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b no-print">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {isEditing ? "Edit Document" : `Create ${activeDocumentType.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}`}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <Sparkles className="w-3 h-3" /> Free Instant Mode
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                {isEditing
                  ? `Editing ${activeDocumentType.replace(/_/g, ' ')} #${invoice?.invoiceNumber}`
                  : templateId
                    ? `Template: ${template?.name}`
                    : `Customize details and download high-resolution PDF with UPI QR code instantly.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        {/* Mobile Tabs */}
        <div className="lg:hidden mb-6 no-print">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form">Edit Details</TabsTrigger>
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="form" className="mt-6">
              <InvoiceForm
                invoice={invoice}
                template={template}
                onPreview={() => setActiveTab("preview")}
                onDataChange={setFormData}
                documentType={activeDocumentType as any}
                onLineItemsChange={setLineItems}
                onLogoChange={setLogoPreview}
                onDownload={handleDownloadPDF}
              />
            </TabsContent>

            <TabsContent value="preview" className="mt-6">
              <InvoicePreview
                invoice={invoice}
                formData={formData}
                lineItems={lineItems}
                logoPreview={logoPreview}
                template={template}
                onEdit={() => setActiveTab("form")}
                documentType={activeDocumentType as any}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Split View Layout (Full Width Workspace) */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-10 items-start">
          {/* Invoice Form */}
          <div className="lg:col-span-6 xl:col-span-6 no-print">
            <Card className="border-0 shadow-sm ring-1 ring-gray-200">
              <CardHeader className="bg-gray-50/50 border-b pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Document Editor</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <InvoiceForm
                  invoice={invoice}
                  template={template}
                  documentType={activeDocumentType as any}
                  onDataChange={setFormData}
                  onLineItemsChange={setLineItems}
                  onLogoChange={setLogoPreview}
                  onDownload={handleDownloadPDF}
                />
              </CardContent>
            </Card>
          </div>

          {/* Live Sticky Preview */}
          <div className="lg:col-span-6 xl:col-span-6 lg:sticky lg:top-6 w-full">
            <InvoicePreview
              invoice={invoice}
              formData={formData}
              lineItems={lineItems}
              logoPreview={logoPreview}
              template={template}
              documentType={activeDocumentType as any}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
