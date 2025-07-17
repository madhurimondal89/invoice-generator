import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Palette, Calculator, Mail, CreditCard, BarChart3, Check } from "lucide-react";
import { useLocation } from "wouter";

const templates = [
  {
    id: 1,
    name: "Classic White",
    category: "classic",
    description: "Clean and professional design perfect for any business",
    previewImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
  },
  {
    id: 2,
    name: "Modern Blue",
    category: "modern",
    description: "Contemporary design with blue accents and modern typography",
    previewImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
  },
  {
    id: 3,
    name: "Creative Pro",
    category: "creative",
    description: "Bold design for creative professionals and agencies",
    previewImage: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
  },
  {
    id: 4,
    name: "Minimal Clean",
    category: "minimal",
    description: "Simple and elegant design focusing on essential information",
    previewImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
  },
];

const features = [
  {
    icon: Palette,
    title: "Custom Branding",
    description: "Upload your logo and customize colors to match your brand identity perfectly",
  },
  {
    icon: Calculator,
    title: "Auto Calculations",
    description: "Automatic tax calculations, discounts, and totals with support for multiple currencies",
  },
  {
    icon: FileText,
    title: "PDF Generation",
    description: "Generate high-quality PDF invoices for printing or digital distribution",
  },
  {
    icon: Mail,
    title: "Email Delivery",
    description: "Send invoices directly to clients via email with delivery tracking",
  },
  {
    icon: CreditCard,
    title: "Online Payments",
    description: "Accept payments via PayPal, Stripe, and major credit cards",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track payment status, revenue trends, and client insights",
  },
];

const steps = [
  {
    number: 1,
    title: "Choose Template",
    description: "Select from 100+ professionally designed invoice templates that match your brand",
    icon: Palette,
  },
  {
    number: 2,
    title: "Customize Details",
    description: "Add your logo, client information, line items, and payment terms with our easy editor",
    icon: FileText,
  },
  {
    number: 3,
    title: "Send & Get Paid",
    description: "Email your invoice as PDF or get paid instantly with integrated payment options",
    icon: Mail,
  },
];

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleCreateInvoice = () => {
    window.location.href = "/api/login";
  };

  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-grid">
            <div>
              <h1 className="hero-title">
                100 Free Invoice Templates
              </h1>
              <p className="hero-description">
                Create professional invoices in minutes. Choose from 100+ beautiful templates, 
                customize with your brand, and get paid faster with integrated payment options.
              </p>
              
              <div className="hero-actions">
                <Button
                  onClick={handleCreateInvoice}
                  className="btn-accent text-lg px-8 py-4"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Create Invoice Now
                </Button>
                <Button
                  onClick={() => setLocation("/templates")}
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4"
                >
                  View Templates
                </Button>
              </div>

              <div className="hero-features">
                <div className="hero-feature">
                  <Check className="mr-2 h-5 w-5" />
                  <span>100% Free</span>
                </div>
                <div className="hero-feature">
                  <Check className="mr-2 h-5 w-5" />
                  <span>PDF Download</span>
                </div>
                <div className="hero-feature">
                  <Check className="mr-2 h-5 w-5" />
                  <span>Email Delivery</span>
                </div>
              </div>
            </div>

            <div className="hero-image">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800"
                alt="Professional invoice creation interface"
                className="w-full h-auto"
              />
              <div className="hero-badge">
                <FileText className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Create professional invoices in just 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {step.number}
                </div>
                <div className="mb-4">
                  <step.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Gallery Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Invoice Template</h2>
            <p className="text-xl text-gray-600">Professional designs for every business type</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="template-card">
                <CardContent className="p-4">
                  <img
                    src={template.previewImage}
                    alt={`${template.name} invoice template`}
                    className="template-preview mb-4"
                  />
                  <h3 className="template-name">{template.name}</h3>
                  <p className="template-description">{template.description}</p>
                  <div className="template-actions">
                    <Badge className="template-price">Free</Badge>
                    <Button
                      onClick={handleCreateInvoice}
                      variant="ghost"
                      className="template-use-btn"
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => setLocation("/templates")}
              className="btn-primary"
            >
              View All 100+ Templates
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features for Professional Invoicing</h2>
            <p className="text-xl text-gray-600">Everything you need to create, send, and manage invoices</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Gateways Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Supported Payment Gateways</h3>
            <p className="text-gray-600">Accept payments from clients worldwide</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="text-blue-600 font-bold text-xl">PayPal</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="text-purple-600 font-bold text-xl">Stripe</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="text-red-600 font-bold text-xl">Square</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="text-green-600 font-bold text-xl">Razorpay</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Invoicing on the go!</h2>
              <p className="text-xl text-blue-100 mb-8">
                Create and send invoices from anywhere with our mobile apps. Available on iOS and Android.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-accent" />
                  <span>Create invoices on mobile</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-accent" />
                  <span>Sync with desktop account</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-accent" />
                  <span>Offline access</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-accent" />
                  <span>Cloud backup</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="secondary" className="btn-secondary">
                  Download on App Store
                </Button>
                <Button variant="secondary" className="btn-secondary">
                  Get it on Google Play
                </Button>
              </div>
            </div>

            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=700"
                alt="Mobile app screenshots"
                className="rounded-2xl shadow-2xl mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Create Your First Invoice?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of businesses using InvoiceHome to get paid faster
          </p>
          <Button
            onClick={handleCreateInvoice}
            className="btn-accent text-lg px-8 py-4"
          >
            <FileText className="mr-2 h-5 w-5" />
            Create Invoice Now - It's Free!
          </Button>
        </div>
      </section>
    </div>
  );
}
