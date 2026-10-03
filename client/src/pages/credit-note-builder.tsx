import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import InvoiceForm from "@/components/invoice/invoice-form";
import InvoicePreview from "@/components/invoice/invoice-preview";
import { useToast } from "@/hooks/use-toast";

export default function CreditNoteBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [creditNoteData, setCreditNoteData] = useState<any>({
    documentType: 'credit_note',
    invoiceNumber: `CN-${Math.floor(1000 + Math.random() * 9000)}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
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
      setCreditNoteData((prev: any) => ({
        ...prev,
        ...template.templateData,
        documentType: 'credit_note',
        primaryColor: template.templateData.primaryColor
      }));
    }
  }, [template]);

  const handleDownload = async () => {
    try {
      const { generateInvoicePDF } = await import("@/lib/pdf-generator");
      await generateInvoicePDF({
        ...creditNoteData,
        documentType: 'credit_note',
        primaryColor: creditNoteData.primaryColor || template?.templateData?.primaryColor
      });
      toast({
        title: "Credit Note PDF Generated",
        description: "Your credit note has been downloaded successfully",
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
                <h1 className="text-2xl font-bold text-gray-900">Credit Note Maker</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                  <Sparkles className="w-3 h-3" /> Free Mode
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-0.5">
                Generate credit notes and adjustment receipts in high-resolution PDF
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Split Layout (Full Width Workspace) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
          <div className="lg:col-span-6 xl:col-span-6 no-print">
            <Card className="border-0 shadow-sm ring-1 ring-gray-200">
              <CardHeader className="bg-gray-50/50 border-b pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Credit Note Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <InvoiceForm
                  template={template}
                  documentType="credit_note"
                  onDataChange={(data) => setCreditNoteData((prev: any) => ({ ...prev, ...data }))}
                  onLineItemsChange={(items) => setCreditNoteData((prev: any) => ({ ...prev, lineItems: items }))}
                  onLogoChange={(logo) => setCreditNoteData((prev: any) => ({ ...prev, logoPreview: logo }))}
                  onDownload={handleDownload}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-6 xl:col-span-6 lg:sticky lg:top-6 w-full">
            <InvoicePreview
              formData={creditNoteData}
              lineItems={creditNoteData.lineItems || []}
              logoPreview={creditNoteData.logoPreview}
              template={template}
              documentType="credit_note"
            />
          </div>
        </div>
      </div>
    </div>
  );
}