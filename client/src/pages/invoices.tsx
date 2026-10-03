import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Search,
  Download,
  Mail,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  HardDrive,
  Cloud
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLocalInvoices, deleteLocalInvoice, type StoredInvoice } from "@/lib/browserStorage";
import { generateInvoicePDF } from "@/lib/pdf-generator";
import { formatCurrency } from "@shared/currencies";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

export default function Invoices() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [localInvoices, setLocalInvoices] = useState<StoredInvoice[]>([]);

  // Load local invoices from browser storage on mount
  useEffect(() => {
    setLocalInvoices(getLocalInvoices());
  }, []);

  const { data: serverInvoices, isLoading: serverLoading } = useQuery({
    queryKey: ["/api/invoices"],
    enabled: !!isAuthenticated,
    retry: false,
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: number) => {
      await apiRequest("DELETE", `/api/invoices/${invoiceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete invoice from server",
        variant: "destructive",
      });
    },
  });

  // Combine local and server invoices (deduplicating by ID or invoiceNumber)
  const combinedInvoices: any[] = [...localInvoices];
  if (Array.isArray(serverInvoices)) {
    serverInvoices.forEach((sInv: any) => {
      if (!combinedInvoices.some(lInv => String(lInv.id) === String(sInv.id) || lInv.invoiceNumber === sInv.invoiceNumber)) {
        combinedInvoices.push({ ...sInv, isCloud: true });
      }
    });
  }

  const filteredInvoices = combinedInvoices.filter((invoice: any) => {
    const matchesSearch =
      (invoice.invoiceNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.clientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.clientEmail || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteInvoice = (invoice: any) => {
    if (invoice.isLocalOnly || String(invoice.id).startsWith('local_')) {
      deleteLocalInvoice(invoice.id);
      setLocalInvoices(getLocalInvoices());
      toast({
        title: "Deleted",
        description: "Document removed from browser storage.",
      });
    } else {
      deleteInvoiceMutation.mutate(invoice.id);
      deleteLocalInvoice(invoice.id);
      setLocalInvoices(getLocalInvoices());
    }
  };

  const handleDownloadPDF = async (invoice: any) => {
    try {
      toast({
        title: "Generating PDF",
        description: "Preparing your high-resolution document...",
      });
      await generateInvoicePDF({
        ...invoice,
        lineItems: invoice.lineItems || [],
        total: parseFloat(invoice.total) || 0,
        subtotal: parseFloat(invoice.subtotal) || 0,
      });
      toast({
        title: "Downloaded",
        description: "PDF saved to your Downloads folder.",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Download Error",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "sent":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "overdue":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "overdue":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200/80">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Documents & Invoices</h1>
                <Badge variant="outline" className="gap-1.5 py-1 px-2.5 bg-indigo-50/80 text-indigo-700 border-indigo-200 text-xs font-semibold">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-600" /> Browser Database Active
                </Badge>
              </div>
              <p className="text-gray-600 mt-1 text-sm">
                Manage, view, download, and track all your locally saved and cloud invoices
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setLocation("/invoice/new")}
                className="btn-accent shadow-sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Document
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        {/* Filters */}
        <Card className="mb-6 shadow-sm border-slate-200/80">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by invoice #, client name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>

              {/* Status filter */}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={statusFilter === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(option.value)}
                    className="text-xs h-9 px-3"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing <strong>{filteredInvoices.length}</strong> of <strong>{combinedInvoices.length}</strong> saved document(s)
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <HardDrive className="w-3.5 h-3.5 text-indigo-500" /> Auto-saved in browser local storage
          </span>
        </div>

        {/* Invoices List */}
        {filteredInvoices.length > 0 ? (
          <div className="space-y-3.5">
            {filteredInvoices.map((invoice: any) => (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow border-slate-200/80 bg-white">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono font-bold text-base text-gray-900">
                          {invoice.invoiceNumber || "Draft Document"}
                        </span>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status || "draft"}
                        </Badge>
                        <Badge className={getPaymentStatusColor(invoice.paymentStatus)}>
                          {invoice.paymentStatus || "pending"}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] text-slate-500 bg-slate-50 border-slate-200 uppercase">
                          {invoice.documentType ? invoice.documentType.replace('_', ' ') : 'Invoice'}
                        </Badge>
                        {invoice.isLocalOnly || String(invoice.id).startsWith('local_') ? (
                          <Badge variant="outline" className="text-[10px] text-indigo-600 bg-indigo-50/60 border-indigo-200 gap-1">
                            <HardDrive className="w-2.5 h-2.5" /> Browser Local
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-sky-600 bg-sky-50/60 border-sky-200 gap-1">
                            <Cloud className="w-2.5 h-2.5" /> Cloud
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-600">
                        <div>
                          <p className="text-gray-400 font-medium">Client</p>
                          <p className="font-semibold text-gray-800 truncate">{invoice.clientName || "—"}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-medium">Amount</p>
                          <p className="text-sm font-bold text-emerald-700">
                            {formatCurrency(parseFloat(invoice.total) || 0, invoice.currency || 'USD')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-medium">Issue Date</p>
                          <p className="text-gray-700 font-medium">
                            {invoice.issueDate
                              ? new Date(invoice.issueDate).toLocaleDateString()
                              : "—"
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-medium">Due Date</p>
                          <p className="text-gray-700 font-medium">
                            {invoice.dueDate
                              ? new Date(invoice.dueDate).toLocaleDateString()
                              : "—"
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF(invoice)}
                        className="text-xs h-9 gap-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200"
                      >
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/invoice/${invoice.id}`)}
                        className="text-xs h-9 gap-1.5"
                      >
                        <Edit className="h-3.5 w-3.5 text-gray-600" />
                        Edit
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setLocation(`/invoice/${invoice.id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Open / Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadPDF(invoice)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download High-Res PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteInvoice(invoice)}
                            className="text-red-600 hover:text-red-700 focus:text-red-700"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Document
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-slate-200/80 bg-white">
            <CardContent className="p-12">
              <div className="text-center max-w-md mx-auto">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                  <FileText className="h-7 w-7 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {searchTerm || statusFilter !== "all" ? "No matching documents found" : "No saved documents yet"}
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search query or filter criteria"
                    : "Create and save your first invoice or receipt. All data stays 100% private in your browser!"
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => setLocation("/invoice/new")}
                    className="btn-accent"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Document
                  </Button>
                  {(searchTerm || statusFilter !== "all") && (
                    <Button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                      }}
                      variant="outline"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
