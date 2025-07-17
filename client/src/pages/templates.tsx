import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

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

const categories = [
  { value: "all", label: "All Templates" },
  { value: "classic", label: "Classic" },
  { value: "modern", label: "Modern" },
  { value: "creative", label: "Creative" },
  { value: "minimal", label: "Minimal" },
];

const documentTypes = [
  { value: "all", label: "All Documents" },
  { value: "invoice", label: "Invoice Templates" },
  { value: "quote", label: "Quote Templates" },
  { value: "credit_note", label: "Credit Note Templates" },
  { value: "purchase_order", label: "Purchase Order Templates" },
];

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDocumentType, setSelectedDocumentType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/templates"],
    retry: false,
  });

  // Use templates from API (they're now properly loaded)
  const allTemplates = templates || [];

  const filteredTemplates = allTemplates.filter((template: any) => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesDocumentType = selectedDocumentType === "all" || template.documentType === selectedDocumentType;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesDocumentType && matchesSearch;
  });

  const handleUseTemplate = (templateId: number, documentType: string) => {
    if (isAuthenticated) {
      // Route to appropriate document builder based on document type
      const routes = {
        'invoice': '/invoice/new',
        'quote': '/quote/new',
        'credit_note': '/credit-note/new',
        'purchase_order': '/purchase-order/new'
      };
      const route = routes[documentType as keyof typeof routes] || '/invoice/new';
      setLocation(`${route}?template=${templateId}`);
    } else {
      window.location.href = "/api/login";
    }
  };

  if (isLoading) {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Document Templates
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our collection of professional templates for invoices, quotes, credit notes, and purchase orders
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={selectedCategory === category.value ? "bg-primary text-white" : ""}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Document Type filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            {documentTypes.map((docType) => (
              <Button
                key={docType.value}
                variant={selectedDocumentType === docType.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDocumentType(docType.value)}
                className={selectedDocumentType === docType.value ? "bg-blue-600 text-white" : ""}
              >
                {docType.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredTemplates.length} of {allTemplates.length} templates
          </p>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template: any) => (
            <Card key={template.id} className="template-card group">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={template.previewImage}
                    alt={`${template.name} invoice template`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Button
                      onClick={() => handleUseTemplate(template.id, template.documentType)}
                      className="bg-white text-gray-900 hover:bg-gray-100"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Use Template
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {template.category}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          template.documentType === 'invoice' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          template.documentType === 'quote' ? 'bg-green-50 text-green-600 border-green-200' :
                          template.documentType === 'credit_note' ? 'bg-red-50 text-red-600 border-red-200' :
                          'bg-purple-50 text-purple-600 border-purple-200'
                        }`}
                      >
                        {template.documentType?.replace('_', ' ').toUpperCase() || 'INVOICE'}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-800">
                      Free
                    </Badge>
                    <Button
                      onClick={() => handleUseTemplate(template.id, template.documentType)}
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-blue-700"
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                setSelectedCategory("all");
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
          <div className="bg-primary text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Create Your Invoice?</h2>
            <p className="text-blue-100 mb-6">
              Choose a template above or start with a blank invoice
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => handleUseTemplate(1)}
                className="bg-accent text-white hover:bg-yellow-600"
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
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Start from Scratch
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
