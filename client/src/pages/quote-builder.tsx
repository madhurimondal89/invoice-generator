import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Eye, Sparkles } from "lucide-react";
import InvoiceForm from "@/components/invoice/invoice-form";
import InvoicePreview from "@/components/invoice/invoice-preview";
import { useToast } from "@/hooks/use-toast";

export default function QuoteBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [quoteData, setQuoteData] = useState<any>({
    documentType: 'quote',
    invoiceNumber: `QUO-${Math.floor(1000 + Math.random() * 9000)}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyName: '',
    companyEmail: '',
    companyAddress: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    lineItems: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
    notes: '',
    logoPreview: ''
  });

  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get('template');

  const { data: template, isLoading: templateLoading } = useQuery<any>({
    queryKey: ['/api/templates', templateId],
    enabled: !!templateId,
  });

  useEffect(() => {
    if (template && template.templateData) {
      setQuoteData((prev: any) => ({
        ...prev,
        ...template.templateData,
        documentType: 'quote',
        primaryColor: template.templateData.primaryColor
      }));
    }
  }, [template]);

  const handleDownload = async () => {
    try {
      const { generateInvoicePDF } = await import("@/lib/pdf-generator");
      await generateInvoicePDF({
        ...quoteData,
        documentType: 'quote',
        primaryColor: quoteData.primaryColor || template?.templateData?.primaryColor
      });
      toast({
        title: "Quote PDF Generated",
        description: "Your quote has been downloaded successfully",
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

  if (templateLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 no-print">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/templates')}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Quotation & Estimate Maker</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <Sparkles className="w-3 h-3" /> Free Mode
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-0.5">
                Generate professional price quotes and project estimates in PDF
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Split Layout (Full Width Workspace) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
          <div className="lg:col-span-6 xl:col-span-6 no-print">
            <Card className="border-0 shadow-sm ring-1 ring-gray-200">
              <CardHeader className="bg-gray-50/50 border-b pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Quote Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <InvoiceForm
                  template={template}
                  documentType="quote"
                  onDataChange={(data) => setQuoteData((prev: any) => ({ ...prev, ...data }))}
                  onLineItemsChange={(items) => setQuoteData((prev: any) => ({ ...prev, lineItems: items }))}
                  onLogoChange={(logo) => setQuoteData((prev: any) => ({ ...prev, logoPreview: logo }))}
                  onDownload={handleDownload}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-6 xl:col-span-6 lg:sticky lg:top-6 w-full">
            <InvoicePreview
              formData={quoteData}
              lineItems={quoteData.lineItems || []}
              logoPreview={quoteData.logoPreview}
              template={template}
              documentType="quote"
            />
          </div>
        </div>
      </div>
    </div>
  );
}