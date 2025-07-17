import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, DollarSign, Clock, CheckCircle, File, Receipt, ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // In development, skip authentication redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated && process.env.NODE_ENV !== 'development') {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ["/api/invoices"],
    enabled: true, // Always enabled for development
  });

  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/templates"],
    enabled: true, // Always enabled for development
  });

  if (isLoading || invoicesLoading || templatesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const recentInvoices = invoices?.slice(0, 5) || [];
  const totalInvoices = invoices?.length || 0;
  const paidInvoices = invoices?.filter((inv: any) => inv.paymentStatus === 'paid').length || 0;
  const pendingInvoices = invoices?.filter((inv: any) => inv.paymentStatus === 'pending').length || 0;
  const totalRevenue = invoices?.reduce((sum: number, inv: any) => sum + parseFloat(inv.total || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName || user?.email || 'User'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your invoices and get paid faster
              </p>
            </div>

          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Document Types Overview */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Document Generation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create professional invoices, quotes, credit notes, and purchase orders with ease. 
              Choose from 100+ templates and customize to match your brand.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200" onClick={() => setLocation("/invoice/new")}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-900">Invoice</h3>
                <p className="text-gray-600 text-sm mb-3">Professional billing documents for completed work or services</p>
                <div className="text-xs text-blue-600 font-medium">
                  • Payment requests • Due dates • Tax calculations
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200" onClick={() => setLocation("/quote/new")}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <File className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-green-900">Quote</h3>
                <p className="text-gray-600 text-sm mb-3">Estimates and proposals for potential clients and projects</p>
                <div className="text-xs text-green-600 font-medium">
                  • Price estimates • Project scope • Terms & conditions
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-red-200" onClick={() => setLocation("/credit-note/new")}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-red-900">Credit Note</h3>
                <p className="text-gray-600 text-sm mb-3">Refunds, returns, and billing adjustments for customers</p>
                <div className="text-xs text-red-600 font-medium">
                  • Refund processing • Error corrections • Account credits
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200" onClick={() => setLocation("/purchase-order/new")}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-purple-900">Purchase Order</h3>
                <p className="text-gray-600 text-sm mb-3">Official requests to suppliers for goods and services</p>
                <div className="text-xs text-purple-600 font-medium">
                  • Supplier orders • Inventory management • Budget control
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Overview */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Our Document Generator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">100+ Professional Templates</h3>
                <p className="text-gray-600 text-sm">
                  Choose from a wide variety of professionally designed templates for all document types
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Tax & Shipping Support</h3>
                <p className="text-gray-600 text-sm">
                  Built-in tax calculations, shipping addresses, and payment terms for complete documents
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">PDF Export</h3>
                <p className="text-gray-600 text-sm">
                  Generate professional PDFs and send documents directly to clients via email
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                  <p className="text-3xl font-bold text-gray-900">{totalInvoices}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
                  <p className="text-3xl font-bold text-gray-900">{paidInvoices}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Payment</p>
                  <p className="text-3xl font-bold text-gray-900">{pendingInvoices}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Document Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Document Types Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-900">Invoice</h4>
                  <p className="text-sm text-gray-600">Use when requesting payment for completed work or delivered goods</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-900">Quote</h4>
                  <p className="text-sm text-gray-600">Use when providing price estimates for potential projects</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-red-900">Credit Note</h4>
                  <p className="text-sm text-gray-600">Use when issuing refunds or adjusting customer accounts</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-purple-900">Purchase Order</h4>
                  <p className="text-sm text-gray-600">Use when ordering goods or services from suppliers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Documents</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation("/invoices")}
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentInvoices.length > 0 ? (
                <div className="space-y-4">
                  {recentInvoices.map((invoice: any) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-600">{invoice.clientName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${invoice.total}</p>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          invoice.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-800'
                            : invoice.paymentStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.paymentStatus || 'draft'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No invoices yet</p>
                  <Button
                    onClick={() => setLocation("/invoice/new")}
                    className="mt-4"
                    variant="outline"
                  >Create Your First Doc</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <Button
                  onClick={() => setLocation("/invoice/new")}
                  className="flex items-center justify-start p-4 h-auto"
                  variant="outline"
                >
                  <Plus className="mr-3 h-6 w-6" />
                  <div className="text-left">
                    <p className="font-medium">Create New Doc</p>
                    <p className="text-sm text-gray-600">Start with a blank invoice</p>
                  </div>
                </Button>

                <Button
                  onClick={() => setLocation("/templates")}
                  className="flex items-center justify-start p-4 h-auto"
                  variant="outline"
                >
                  <FileText className="mr-3 h-6 w-6" />
                  <div className="text-left">
                    <p className="font-medium">Browse Templates</p>
                    <p className="text-sm text-gray-600">Choose from 100+ designs</p>
                  </div>
                </Button>

                <Button
                  onClick={() => setLocation("/invoices")}
                  className="flex items-center justify-start p-4 h-auto"
                  variant="outline"
                >
                  <DollarSign className="mr-3 h-6 w-6" />
                  <div className="text-left">
                    <p className="font-medium">Manage Doc</p>
                    <p className="text-sm text-gray-600">View and edit existing invoices</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Gallery Preview */}
        {templates && templates.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Popular Templates</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation("/templates")}
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.slice(0, 4).map((template: any) => (
                  <div key={template.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="aspect-[4/5] bg-white rounded border mb-3 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{template.category}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
