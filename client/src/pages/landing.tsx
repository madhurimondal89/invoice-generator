import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Palette,
  Calculator,
  QrCode,
  Share2,
  Download,
  CheckCircle,
  ShieldCheck,
  Zap,
  Globe2,
  ArrowRight,
  Receipt,
  Sparkles,
  Layers,
  Printer,
  HelpCircle
} from "lucide-react";
import { useLocation } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const templates = [
  {
    id: 1,
    name: "Classic Minimalist",
    category: "classic",
    description: "Crisp and corporate layout designed for consultants and freelancers",
    previewImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
  },
  {
    id: 2,
    name: "Modern Executive",
    category: "modern",
    description: "Contemporary blue gradient accents with scannable UPI QR box",
    previewImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
  },
  {
    id: 3,
    name: "Creative Agency Pro",
    category: "creative",
    description: "Vibrant emerald styling for studios, agencies, and creatives",
    previewImage: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
  },
  {
    id: 4,
    name: "Tax & GST Invoice",
    category: "tax_invoice",
    description: "Official format with GSTIN, HSN codes, and itemized tax breakdowns",
    previewImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
  },
];

const features = [
  {
    icon: QrCode,
    title: "Instant UPI QR Code",
    description: "Automatically generates scannable GPay, PhonePe, and Paytm QR codes directly on invoices.",
  },
  {
    icon: Download,
    title: "1-Click PDF & Print",
    description: "Export high-resolution, vector-crisp PDF documents ready for printing or digital sending.",
  },
  {
    icon: Share2,
    title: "WhatsApp Direct Share",
    description: "Send pre-formatted invoice summaries directly to your clients on WhatsApp in one click.",
  },
  {
    icon: Globe2,
    title: "Multi-Currency Ready",
    description: "Full native support for INR (₹), USD ($), EUR (€), GBP (£), BDT (৳), AED, and 160+ world currencies.",
  },
  {
    icon: Calculator,
    title: "Automatic GST & Discounts",
    description: "Zero manual math. Auto-calculates tax rates, line item taxes, custom discounts, and shipping.",
  },
  {
    icon: Zap,
    title: "Zero Sign-up Friction",
    description: "Create, live preview, and download professional bills immediately without mandatory signups.",
  },
];

const documentTypes = [
  {
    title: "Standard Invoices",
    path: "/invoice/new",
    desc: "For general billing, freelance work, and service delivery.",
    color: "bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400",
    icon: FileText
  },
  {
    title: "GST Tax Invoices",
    path: "/tax-invoice/new",
    desc: "With GSTIN numbers, state codes, and itemized tax rows.",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-400",
    icon: Layers
  },
  {
    title: "Quotes & Estimates",
    path: "/quote/new",
    desc: "Send price estimates and project proposals to win clients.",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400",
    icon: Sparkles
  },
  {
    title: "Payment Receipts",
    path: "/receipt/new",
    desc: "Acknowledge received payments and cash transactions instantly.",
    color: "bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-400",
    icon: Receipt
  },
  {
    title: "Credit Notes",
    path: "/credit-note/new",
    desc: "Handle returns, adjustments, and refunds effortlessly.",
    color: "bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-400",
    icon: FileText
  },
  {
    title: "Purchase Orders",
    path: "/purchase-order/new",
    desc: "Vendor procurement orders and item quantity tracking.",
    color: "bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400",
    icon: FileText
  },
];

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b15_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-primary/20 text-primary-foreground border-primary/30 px-3.5 py-1 text-xs sm:text-sm font-semibold mb-6 inline-flex items-center gap-1.5 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            100% Free Professional Invoice & Billing Generator
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Create Stunning Invoices with{" "}
            <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
              UPI QR Codes & Instant PDF
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Generate professional GST invoices, quotes, receipts, and purchase orders in seconds. Zero signup required. Download high-resolution PDFs or share directly on WhatsApp.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => setLocation("/invoice/new")}
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold text-base px-8 py-6 rounded-xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all gap-2"
            >
              <FileText className="h-5 w-5" />
              Create Free Invoice Now
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              onClick={() => setLocation("/templates")}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-white text-base px-8 py-6 rounded-xl backdrop-blur-sm"
            >
              Explore 100+ Templates
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> No Account Needed
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="h-4 w-4 text-teal-400" /> Dynamic UPI QR Code
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-blue-400" /> WhatsApp Direct Share
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-400" /> 100% Free & Secure
            </div>
          </div>
        </div>
      </section>

      {/* Quick Document Creators Grid */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Pick a Document to Create Instantly
            </h2>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Select any document type below to open the dedicated builder with instant live preview.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentTypes.map((doc, idx) => (
              <div
                key={idx}
                onClick={() => setLocation(doc.path)}
                className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 bg-white ${doc.color}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-white shadow-sm border border-inherit">
                    <doc.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-base text-gray-900">{doc.title}</h3>
                </div>
                <p className="text-xs text-gray-600 mb-4">{doc.desc}</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  Create now <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="text-primary border-primary/30 mb-3">
              Powerful Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Built for Modern Businesses & Freelancers
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Everything you need to create, customize, and deliver polished financial documents to clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, index) => (
              <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary">
                    <feat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{feat.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Templates Showcase */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Popular Invoice Templates</h2>
              <p className="text-gray-600 text-sm mt-1">Choose from 100+ curated formats crafted for all industries</p>
            </div>
            <Button
              onClick={() => setLocation("/templates")}
              variant="outline"
              className="gap-1.5"
            >
              Browse All Templates <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((tpl) => (
              <Card
                key={tpl.id}
                onClick={() => setLocation(`/invoice/new?template=${tpl.id}`)}
                className="group cursor-pointer overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white"
              >
                <div className="aspect-[4/5] overflow-hidden bg-slate-100 relative">
                  <img
                    src={tpl.previewImage}
                    alt={tpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-lg">
                      Use Template
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-bold text-sm text-gray-900">{tpl.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{tpl.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Step-by-Step Guide for Users & AI Overview */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="mb-3 px-3 py-1 border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold">
              Instant 4-Step Process
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              How to Create & Download an Invoice in 60 Seconds
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              No account required. Fast, free, and compliant billing ready for clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto text-sm">
                1
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Select Document Type</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Choose standard invoice, GST tax bill, quotation, receipt, or an industry-specific template.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto text-sm">
                2
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Enter Business Details</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Input your company name, client info, invoice date, currency, and customized line items with rates.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto text-sm">
                3
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Add UPI ID / QR Code</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Enable scannable UPI QR codes for instant direct bank payment with 0% gateway commission.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center mx-auto text-sm">
                4
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Download PDF & Share</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Export high-resolution vector PDF in 1 click or send directly via WhatsApp or email to your customer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (AEO & GEO Knowledge Accordion) */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold mb-3">
              <HelpCircle className="h-3.5 w-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Everything You Need to Know About Invoice Genius
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Clear, transparent answers designed for clients, business owners, and automated search systems.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-2">
              <AccordionItem value="item-1" className="border-b border-gray-100 pb-2">
                <AccordionTrigger className="text-sm sm:text-base font-bold text-gray-900 hover:no-underline text-left">
                  Is Invoice Genius really 100% free to use?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Yes, absolutely. There are no trial periods, hidden subscription fees, or limits on the number of invoices you can create. Generated PDF documents are completely clean and free of watermarks or forced platform logos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b border-gray-100 pb-2">
                <AccordionTrigger className="text-sm sm:text-base font-bold text-gray-900 hover:no-underline text-left">
                  How does the UPI QR Code payment feature work?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  When creating an invoice, you can simply type in your Virtual Payment Address (e.g., yourname@okhdfcbank or phone@paytm). Our system dynamically encodes this into an NPCI-compliant payment QR code embedded on the bill. Clients can scan it with Google Pay, PhonePe, Paytm, or BHIM to send money directly to your bank account with zero payment gateway processing fees.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b border-gray-100 pb-2">
                <AccordionTrigger className="text-sm sm:text-base font-bold text-gray-900 hover:no-underline text-left">
                  Can I create GST-compliant tax invoices with HSN/SAC codes?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Yes. Invoice Genius includes a specialized GST Invoice format that supports supplier GSTIN, recipient GSTIN, state code, place of supply, HSN/SAC classification, and calculates split CGST, SGST, or IGST tax breakdowns automatically.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-gray-100 pb-2">
                <AccordionTrigger className="text-sm sm:text-base font-bold text-gray-900 hover:no-underline text-left">
                  What other documents besides invoices can I generate?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  In addition to standard and tax invoices, you can generate Price Quotations / Estimates, Payment Receipts, Cash Vouchers, Purchase Orders (PO), and Credit Notes / Memos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-b border-gray-100 pb-2">
                <AccordionTrigger className="text-sm sm:text-base font-bold text-gray-900 hover:no-underline text-left">
                  Do I have to register an account to download my bills?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  No registration is required. You can jump directly into the builder, customize your bill, and click Download PDF or Print. Creating a free account is entirely optional and allows you to save drafts and document history in your personal dashboard.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-none">
                <AccordionTrigger className="text-sm sm:text-base font-bold text-gray-900 hover:no-underline text-left">
                  Which currencies and custom branding options are available?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  We support Indian Rupee (INR ₹), US Dollar (USD $), Euro (EUR €), British Pound (GBP £), Bangladeshi Taka (BDT ৳), UAE Dirham (AED), and other major currencies. You can also customize the header banner color and footer/accent color using our built-in palette and custom hex color pickers.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Generate Your First Invoice?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Join thousands of freelancers, agencies, and small businesses who bill clients faster with InvoiceGenius.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => setLocation("/invoice/new")}
              size="lg"
              className="bg-white text-blue-700 hover:bg-slate-100 font-bold px-8 py-6 rounded-xl shadow-lg hover:scale-105 transition-all text-base gap-2"
            >
              <Sparkles className="h-5 w-5 text-blue-600" /> Start Generating for Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
