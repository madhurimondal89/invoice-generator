import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import InvoiceForm from "@/components/invoice/invoice-form";
import InvoicePreview from "@/components/invoice/invoice-preview";
import { useToast } from "@/hooks/use-toast";

export default function PurchaseOrderBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [purchaseOrderData, setPurchaseOrderData] = useState<any>({
    documentType: 'purchase_order',
    invoiceNumber: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
      setPurchaseOrderData((prev: any) => ({
        ...prev,
        ...template.templateData,
        documentType: 'purchase_order',
        primaryColor: template.templateData.primaryColor
      }));
    }
  }, [template]);

  const handleDownload = async () => {
    try {
      const { generateInvoicePDF } = await import("@/lib/pdf-generator");
      await generateInvoicePDF({
        ...purchaseOrderData,
        documentType: 'purchase_order',
        primaryColor: purchaseOrderData.primaryColor || template?.templateData?.primaryColor
      });
      toast({
        title: "PO PDF Generated",
        description: "Your purchase order has been downloaded successfully",
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
                <h1 className="text-2xl font-bold text-gray-900">Purchase Order Maker</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                  <Sparkles className="w-3 h-3" /> Free Mode
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-0.5">
                Generate official vendor purchase orders and procurement requests
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Split Layout (Full Width Workspace) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
          <div className="lg:col-span-6 xl:col-span-6 no-print">
            <Card className="border-0 shadow-sm ring-1 ring-gray-200">
              <CardHeader className="bg-gray-50/50 border-b pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Purchase Order Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <InvoiceForm
                  template={template}
                  documentType="purchase_order"
                  onDataChange={(data) => setPurchaseOrderData((prev: any) => ({ ...prev, ...data }))}
                  onLineItemsChange={(items) => setPurchaseOrderData((prev: any) => ({ ...prev, lineItems: items }))}
                  onLogoChange={(logo) => setPurchaseOrderData((prev: any) => ({ ...prev, logoPreview: logo }))}
                  onDownload={handleDownload}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-6 xl:col-span-6 lg:sticky lg:top-6 w-full">
            <InvoicePreview
              formData={purchaseOrderData}
              lineItems={purchaseOrderData.lineItems || []}
              logoPreview={purchaseOrderData.logoPreview}
              template={template}
              documentType="purchase_order"
            />
          </div>
        </div>
      </div>
    </div>
  );
}