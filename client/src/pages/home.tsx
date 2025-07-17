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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
    enabled: isAuthenticated,
  });

  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/templates"],
    enabled: isAuthenticated,
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
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/invoice/new")}>
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Create Invoice</h3>
                <p className="text-gray-600 text-sm">Bill your clients professionally</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/quote/new")}>
              <CardContent className="p-6 text-center">
                <File className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Create Quote</h3>
                <p className="text-gray-600 text-sm">Send estimates to prospects</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/credit-note/new")}>
              <CardContent className="p-6 text-center">
                <Receipt className="h-8 w-8 text-red-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Credit Note</h3>
                <p className="text-gray-600 text-sm">Issue refunds and adjustments</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/purchase-order/new")}>
              <CardContent className="p-6 text-center">
                <ShoppingCart className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Purchase Order</h3>
                <p className="text-gray-600 text-sm">Order from suppliers</p>
              </CardContent>
            </Card>
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
          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Invoices</span>
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
                  >
                    Create Your First Invoice
                  </Button>
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
                    <p className="font-medium">Create New Invoice</p>
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
                    <p className="font-medium">Manage Invoices</p>
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
