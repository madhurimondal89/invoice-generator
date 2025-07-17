import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Eye } from "lucide-react";
import InvoiceForm from "@/components/invoice/invoice-form";
import InvoicePreview from "@/components/invoice/invoice-preview";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function CreditNoteBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [creditNoteData, setCreditNoteData] = useState({
    documentType: 'credit_note',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    fromName: '',
    fromEmail: '',
    fromAddress: '',
    toName: '',
    toEmail: '',
    toAddress: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: '',
    logoUrl: ''
  });

  // Get template from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get('template');

  // Fetch template data if templateId exists
  const { data: template, isLoading: templateLoading } = useQuery({
    queryKey: ['/api/templates', templateId],
    enabled: !!templateId,
  });

  // Redirect if not authenticated
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

  // Apply template when loaded
  useEffect(() => {
    if (template && template.templateData) {
      setCreditNoteData(prev => ({
        ...prev,
        ...template.templateData,
        documentType: 'credit_note'
      }));
    }
  }, [template]);

  const handleDataChange = (newData: any) => {
    setCreditNoteData(newData);
  };

  const handleDownload = () => {
    // TODO: Implement PDF download
    toast({
      title: "Download Started",
      description: "Your credit note PDF is being generated...",
    });
  };

  if (authLoading || templateLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/templates')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Credit Note Builder</h1>
              <p className="text-gray-600">Create professional credit notes for refunds and adjustments</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button onClick={handleDownload} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className={showPreview ? "hidden lg:block" : ""}>
            <Card>
              <CardHeader>
                <CardTitle>Credit Note Details</CardTitle>
              </CardHeader>
              <CardContent>
                <InvoiceForm
                  data={creditNoteData}
                  onChange={handleDataChange}
                  documentType="credit_note"
                />
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className={showPreview ? "" : "hidden lg:block"}>
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <InvoicePreview 
                  data={creditNoteData} 
                  template={template}
                  documentType="credit_note"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}