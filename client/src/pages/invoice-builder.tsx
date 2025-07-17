import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import InvoiceForm from "@/components/invoice/invoice-form";
import InvoicePreview from "@/components/invoice/invoice-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InvoiceBuilder() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const params = useParams();
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState("form");

  // Shared state for live preview
  const [formData, setFormData] = useState<any>({});
  const [lineItems, setLineItems] = useState<any[]>([]);
  const [logoPreview, setLogoPreview] = useState<string>("");
  
  // Debug logging to track state changes
  console.log("Invoice Builder State:", { formData, lineItems, logoPreview });

  // Check if we're editing an existing invoice
  const invoiceId = params.id ? parseInt(params.id) : null;
  const isEditing = invoiceId !== null;

  // Check for template parameter
  const urlParams = new URLSearchParams(location.split('?')[1]);
  const templateId = urlParams.get('template');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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
  }, [isAuthenticated, authLoading, toast]);

  // Fetch invoice data if editing
  const { data: invoice, isLoading: invoiceLoading } = useQuery({
    queryKey: ["/api/invoices", invoiceId],
    enabled: isAuthenticated && isEditing,
    retry: false,
  });

  // Fetch template data if using template
  const { data: template, isLoading: templateLoading } = useQuery({
    queryKey: ["/api/templates", templateId],
    enabled: isAuthenticated && !!templateId,
    retry: false,
  });

  if (authLoading || invoiceLoading || templateLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? "Edit Invoice" : "Create Invoice"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing 
                  ? `Editing invoice ${invoice?.invoiceNumber}`
                  : templateId 
                    ? `Using template: ${template?.name}`
                    : "Create a new invoice from scratch"
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Tabs */}
        <div className="lg:hidden mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form">Form</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form" className="mt-6">
              <InvoiceForm
                invoice={invoice}
                template={template}
                onPreview={() => setActiveTab("preview")}
                onDataChange={setFormData}
                onLineItemsChange={setLineItems}
                onLogoChange={setLogoPreview}
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
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Invoice Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent>
                <InvoiceForm
                  invoice={invoice}
                  template={template}
                  onDataChange={setFormData}
                  onLineItemsChange={setLineItems}
                  onLogoChange={setLogoPreview}
                />
              </CardContent>
            </Card>
          </div>

          {/* Live Preview */}
          <div className="lg:sticky lg:top-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <InvoicePreview
                  invoice={invoice}
                  formData={formData}
                  lineItems={lineItems}
                  logoPreview={logoPreview}
                  template={template}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
