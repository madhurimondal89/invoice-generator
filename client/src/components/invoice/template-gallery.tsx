import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const defaultTemplates = [
  {
    id: 1,
    name: "Classic White",
    category: "classic",
    description: "Clean and professional design perfect for any business",
    previewImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
    templateData: {
      colors: { primary: "#2563eb", accent: "#f59e0b" },
      fonts: { heading: "Inter", body: "Inter" },
      layout: "classic"
    }
  },
  {
    id: 2,
    name: "Modern Blue",
    category: "modern",
    description: "Contemporary design with blue accents and modern typography",
    previewImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
    templateData: {
      colors: { primary: "#3b82f6", accent: "#06b6d4" },
      fonts: { heading: "Inter", body: "Inter" },
      layout: "modern"
    }
  },
  {
    id: 3,
    name: "Creative Pro",
    category: "creative",
    description: "Bold design for creative professionals and agencies",
    previewImage: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
    templateData: {
      colors: { primary: "#8b5cf6", accent: "#f59e0b" },
      fonts: { heading: "Inter", body: "Inter" },
      layout: "creative"
    }
  },
  {
    id: 4,
    name: "Minimal Clean",
    category: "minimal",
    description: "Simple and elegant design focusing on essential information",
    previewImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
    templateData: {
      colors: { primary: "#374151", accent: "#6b7280" },
      fonts: { heading: "Inter", body: "Inter" },
      layout: "minimal"
    }
  },
  {
    id: 5,
    name: "Business Pro",
    category: "classic",
    description: "Corporate design ideal for established businesses",
    previewImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
    templateData: {
      colors: { primary: "#1f2937", accent: "#059669" },
      fonts: { heading: "Inter", body: "Inter" },
      layout: "business"
    }
  },
  {
    id: 6,
    name: "Tech Gradient",
    category: "modern",
    description: "Modern gradient design perfect for tech companies",
    previewImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
    templateData: {
      colors: { primary: "#6366f1", accent: "#8b5cf6" },
      fonts: { heading: "Inter", body: "Inter" },
      layout: "tech"
    }
  }
];

const categories = [
  { value: "all", label: "All Templates" },
  { value: "classic", label: "Classic" },
  { value: "modern", label: "Modern" },
  { value: "creative", label: "Creative" },
  { value: "minimal", label: "Minimal" },
];

interface TemplateGalleryProps {
  onSelectTemplate: (template: any) => void;
  selectedTemplateId?: number;
}

export default function TemplateGallery({ onSelectTemplate, selectedTemplateId }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/templates"],
    retry: false,
  });

  // Use default templates if API fails or returns empty
  const allTemplates = templates && templates.length > 0 ? templates : defaultTemplates;

  const filteredTemplates = allTemplates.filter((template: any) => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Template</h2>
        <p className="text-gray-600">Select a professional template to get started</p>
      </div>

      {/* Filters */}
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
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template: any) => (
          <Card 
            key={template.id} 
            className={`template-card cursor-pointer transition-all ${
              selectedTemplateId === template.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={template.previewImage}
                  alt={`${template.name} template`}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Button
                    size="sm"
                    className="bg-white text-gray-900 hover:bg-gray-100"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Select Template
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {template.category}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-800">
                    Free
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplate(template);
                    }}
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
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
