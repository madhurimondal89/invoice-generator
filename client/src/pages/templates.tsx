import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Search, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import TemplatePreview from "@/components/template/template-preview";

const defaultTemplates = [
  {
    id: 1,
    name: "Classic White",
    category: "classic",
    description: "Clean and professional design perfect for any business",
    previewImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
    isActive: true,
  },
  {
    id: 2,
    name: "Modern Blue",
    category: "modern",
    description: "Contemporary design with blue accents and modern typography",
    previewImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
    isActive: true,
  },
  {
    id: 3,
    name: "Creative Pro",
    category: "creative",
    description: "Bold design for creative professionals and agencies",
    previewImage: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
    isActive: true,
  },
  {
    id: 4,
    name: "Minimal Clean",
    category: "minimal",
    description: "Simple and elegant design focusing on essential information",
    previewImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
    isActive: true,
  },
  {
    id: 5,
    name: "Business Pro",
    category: "classic",
    description: "Corporate design ideal for established businesses",
    previewImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
    isActive: true,
  },
  {
    id: 6,
    name: "Tech Gradient",
    category: "modern",
    description: "Modern gradient design perfect for tech companies",
    previewImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
    isActive: true,
  },
  {
    id: 7,
    name: "Creative Studio",
    category: "creative",
    description: "Artistic design for designers and creative agencies",
    previewImage: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
    isActive: true,
  },
  {
    id: 8,
    name: "Elegant Minimal",
    category: "minimal",
    description: "Refined minimalist design with elegant typography",
    previewImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
    isActive: true,
  },
];

const industries = [
  { value: "all", label: "All Industries" },
  { value: "Tech & SaaS", label: "💻 Tech & SaaS" },
  { value: "Freelance & Dev", label: "⚡ Freelance & Dev" },
  { value: "Creative & Design", label: "🎨 Creative & Design" },
  { value: "Legal & CA", label: "⚖️ Legal & CA" },
  { value: "Construction & Trades", label: "🏗️ Construction & Trades" },
  { value: "Retail & POS", label: "🛍️ Retail & POS" },
  { value: "Medical & Healthcare", label: "🩺 Medical & Clinic" },
  { value: "Logistics & Cargo", label: "📦 Logistics & Cargo" },
  { value: "Photography & Media", label: "📸 Photo & Media" },
  { value: "Education & Courses", label: "🎓 Education & Courses" },
];

const documentTypes = [
  { value: "all", label: "🌟 All Documents", desc: "View all document templates" },
  { value: "invoice", label: "📄 Standard Invoices", desc: "For general client billing" },
  { value: "tax_invoice", label: "🏛️ GST Tax Invoices", desc: "Compliant with HSN & GST" },
  { value: "proforma_invoice", label: "💼 Proforma Invoices", desc: "Preliminary estimates & terms" },
  { value: "quote", label: "💬 Price Quotes", desc: "Client proposals & rate cards" },
  { value: "estimate", label: "📊 Project Estimates", desc: "Budget & milestone forecasts" },
  { value: "purchase_order", label: "📦 Purchase Orders (PO)", desc: "Vendor orders & procurement" },
  { value: "delivery_note", label: "🚚 Delivery Challans", desc: "Packing & item dispatch without payment" },
  { value: "receipt", label: "🧾 Payment Receipts", desc: "Payment proof & acknowledgment" },
  { value: "sales_receipt", label: "🛍️ Sales Receipts", desc: "Point of sale & counter receipts" },
  { value: "cash_receipt", label: "💵 Cash Receipts", desc: "Instant cash payment vouchers" },
  { value: "credit_note", label: "💳 Credit Notes", desc: "Returns, refunds & adjustments" },
  { value: "credit_memo", label: "📝 Credit Memos", desc: "Account credit adjustments" },
];

export default function Templates() {
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedDocumentType, setSelectedDocumentType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/templates"],
    retry: false,
  });

  // Use templates from API
  const allTemplates: any[] = Array.isArray(templates) ? templates : [];

  const handleDocumentTypeClick = (docTypeValue: string) => {
    if (selectedDocumentType === docTypeValue) {
      setSelectedDocumentType("all");
    } else {
      setSelectedDocumentType(docTypeValue);
      // Auto-clear conflicting industry filter so results are always shown
      if (selectedIndustry !== "all") {
        const matchesBoth = allTemplates.some(
          (t: any) =>
            (docTypeValue === "all" || t.documentType === docTypeValue) &&
            t.templateData?.industry === selectedIndustry
        );
        if (!matchesBoth) {
          setSelectedIndustry("all");
        }
      }
    }
  };

  const handleIndustryClick = (industryValue: string) => {
    if (selectedIndustry === industryValue) {
      setSelectedIndustry("all");
    } else {
      setSelectedIndustry(industryValue);
      // Auto-clear conflicting document type filter so results are always shown
      if (selectedDocumentType !== "all") {
        const matchesBoth = allTemplates.some(
          (t: any) =>
            t.documentType === selectedDocumentType &&
            (industryValue === "all" || t.templateData?.industry === industryValue)
        );
        if (!matchesBoth) {
          setSelectedDocumentType("all");
        }
      }
    }
  };

  const getIndustryCount = (indValue: string) => {
    if (indValue === "all") return allTemplates.length;
    return allTemplates.filter((t: any) => t.templateData?.industry === indValue).length;
  };

  const filteredTemplates = allTemplates.filter((template: any) => {
    const td = template.templateData || {};
    const matchesIndustry = selectedIndustry === "all" || td.industry === selectedIndustry;
    const matchesDocumentType = selectedDocumentType === "all" || template.documentType === selectedDocumentType;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (td.industry || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (td.companyName || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesIndustry && matchesDocumentType && matchesSearch;
  });

  const handleUseTemplate = (templateId: number, documentType: string) => {
    // Route to appropriate document builder based on document type
    const routes: Record<string, string> = {
      'invoice': '/invoice/new',
      'tax_invoice': '/tax-invoice/new',
      'proforma_invoice': '/proforma-invoice/new',
      'quote': '/quote/new',
      'estimate': '/estimate/new',
      'receipt': '/receipt/new',
      'sales_receipt': '/sales-receipt/new',
      'cash_receipt': '/cash-receipt/new',
      'credit_note': '/credit-note/new',
      'credit_memo': '/credit-memo/new',
      'purchase_order': '/purchase-order/new',
      'delivery_note': '/delivery-note/new'
    };
    const route = routes[documentType] || '/invoice/new';
    setLocation(`${route}?template=${templateId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 gap-1 text-xs">
              Curated Pro Templates
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Industry-Tailored Document Templates
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Pick from 12+ industries (Tech, Freelancers, CA & Legal, Construction, Medical, Retail). Pre-configured with realistic line items, taxes, and instant UPI QR payments.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-6">
        {/* Filters */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-5">
          {/* Top Row: Search & Count */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by industry, item name, or layout style..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-slate-50/50 border-slate-200"
              />
            </div>
            <div className="text-xs text-gray-500 font-medium self-end sm:self-center">
              Total <strong>{allTemplates.length}</strong> Templates available across <strong>12 Document Types</strong>
            </div>
          </div>

          {/* Document Type Selector (Primary Tabs) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                1. Select Document Type:
              </span>
              {selectedDocumentType !== 'all' && (
                <span className="text-xs text-indigo-600 font-medium">
                  {documentTypes.find(d => d.value === selectedDocumentType)?.desc}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {documentTypes.map((docType) => {
                const count = docType.value === 'all' 
                  ? allTemplates.length 
                  : allTemplates.filter((t: any) => t.documentType === docType.value).length;
                const isSelected = selectedDocumentType === docType.value;
                return (
                  <button
                    key={docType.value}
                    onClick={() => handleDocumentTypeClick(docType.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
                    }`}
                  >
                    <span>{docType.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-600"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Industry Filter Pills (Secondary) */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                2. Filter by Industry / Profession (Optional):
              </span>
              {selectedIndustry !== 'all' && (
                <button
                  onClick={() => setSelectedIndustry('all')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  Show All Industries
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {industries.map((ind) => {
                const count = getIndustryCount(ind.value);
                const isSelected = selectedIndustry === ind.value;
                return (
                  <button
                    key={ind.value}
                    onClick={() => handleIndustryClick(ind.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70"
                    }`}
                  >
                    <span>{ind.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-600"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600 font-medium">
            Showing <strong className="text-gray-900">{(filteredTemplates as any[]).length}</strong> templates
          </p>
          {(selectedIndustry !== 'all' || selectedDocumentType !== 'all' || searchTerm) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedIndustry('all');
                setSelectedDocumentType('all');
                setSearchTerm('');
              }}
              className="text-xs text-blue-600 hover:text-blue-700 h-7"
            >
              Reset Filters
            </Button>
          )}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template: any) => {
            const td = template.templateData || {};
            return (
              <Card key={template.id} className="group overflow-hidden rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col bg-white">
                <CardContent className="p-0 flex-1 flex flex-col">
                  {/* Miniature Interactive Preview */}
                  <div className="relative overflow-hidden h-52 bg-slate-50 border-b border-gray-100">
                    <TemplatePreview
                      template={template}
                      className="w-full h-full border-0 rounded-none shadow-none"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                      <Button
                        onClick={() => handleUseTemplate(template.id, template.documentType)}
                        className="bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-lg text-xs gap-1.5 h-9 rounded-xl"
                      >
                        <FileText className="h-4 w-4 text-blue-600" />
                        Use This Template
                      </Button>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                          {template.documentType ? template.documentType.replace(/_/g, ' ') : 'Invoice'}
                        </span>
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {td.industry || 'Business'}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug">
                        {template.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {template.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        {td.currency === 'INR' ? '₹ INR GST Ready' : `${td.currency || 'USD'} Multi-Currency`}
                      </span>
                      <Button
                        onClick={() => handleUseTemplate(template.id, template.documentType)}
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7 px-3 rounded-lg font-medium shadow-sm"
                      >
                        Use Template →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedIndustry("all");
                setSelectedDocumentType("all");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-blue-500/15 border border-blue-500/20">
            {/* Ambient decorative glow */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">Ready to Create Your Invoice?</h2>
              <p className="text-blue-100 text-sm sm:text-base mb-6 font-medium">
                Choose a template above or start with a blank invoice in seconds
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => handleUseTemplate(1, 'invoice')}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 h-11 rounded-xl shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Start with Template
                </Button>
                <Button
                  onClick={() => {
                    if (isAuthenticated) {
                      setLocation("/invoice/new");
                    } else {
                      window.location.href = "/api/login";
                    }
                  }}
                  className="bg-white hover:bg-slate-100 text-blue-700 font-bold px-6 py-2.5 h-11 rounded-xl shadow-md border border-white hover:border-slate-200 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4 text-blue-700" />
                  Start from Scratch
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
