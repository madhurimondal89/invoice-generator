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
  HelpCircle,
  Check,
  Eye,
  Star,
  Clock
} from "lucide-react";
import { useLocation } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const templates = [
  {
    id: 1,
    name: "Classic Minimalist",
    category: "classic",
    industry: "Consulting & Services",
    description: "Crisp and corporate layout designed for consultants and freelancers",
    previewImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
  },
  {
    id: 2,
    name: "Modern Executive",
    category: "modern",
    industry: "Tech & SaaS",
    description: "Contemporary blue gradient accents with scannable UPI QR box",
    previewImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
  },
  {
    id: 3,
    name: "Creative Agency Pro",
    category: "creative",
    industry: "Design & Marketing",
    description: "Vibrant emerald styling for studios, agencies, and creatives",
    previewImage: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
  },
  {
    id: 4,
    name: "Tax & GST Invoice",
    category: "tax_invoice",
    industry: "Retail & Manufacturing",
    description: "Official format with GSTIN, HSN codes, and itemized tax breakdowns",
    previewImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
  },
];

const features = [
  {
    icon: QrCode,
    title: "Instant UPI QR Code",
    description: "Automatically generates scannable GPay, PhonePe, and Paytm QR codes directly on invoices for instant zero-fee bank settlements.",
    gradient: "from-blue-500/10 to-indigo-500/10",
    accent: "text-blue-600",
  },
  {
    icon: Download,
    title: "1-Click PDF & Print",
    description: "Export high-resolution, vector-crisp PDF documents formatted for standard A4 printing or digital sending.",
    gradient: "from-emerald-500/10 to-teal-500/10",
    accent: "text-emerald-600",
  },
  {
    icon: Share2,
    title: "WhatsApp Direct Share",
    description: "Send pre-formatted invoice summaries directly to your clients on WhatsApp in one click.",
    gradient: "from-teal-500/10 to-green-500/10",
    accent: "text-teal-600",
  },
  {
    icon: Globe2,
    title: "Multi-Currency Ready",
    description: "Full native support for INR (₹), USD ($), EUR (€), GBP (£), BDT (৳), AED, and 160+ world currencies.",
    gradient: "from-purple-500/10 to-pink-500/10",
    accent: "text-purple-600",
  },
  {
    icon: Calculator,
    title: "Automatic GST & Discounts",
    description: "Zero manual math. Auto-calculates CGST, SGST, IGST, custom tax percentages, line item subtotals, and discounts.",
    gradient: "from-amber-500/10 to-orange-500/10",
    accent: "text-amber-600",
  },
  {
    icon: Zap,
    title: "Zero Sign-up Friction",
    description: "Create, live preview, and download professional bills immediately in guest mode without mandatory account barriers.",
    gradient: "from-rose-500/10 to-red-500/10",
    accent: "text-rose-600",
  },
];

const documentTypes = [
  {
    title: "Standard Invoices",
    path: "/invoice/new",
    desc: "For general billing, freelance work, and consulting projects.",
    gradient: "from-blue-600 to-indigo-600",
    badgeColor: "bg-blue-100 text-blue-700",
    icon: FileText
  },
  {
    title: "GST Tax Invoices",
    path: "/tax-invoice/new",
    desc: "With GSTIN numbers, state codes, and itemized HSN tax breakdown.",
    gradient: "from-indigo-600 to-purple-600",
    badgeColor: "bg-indigo-100 text-indigo-700",
    icon: Layers
  },
  {
    title: "Quotes & Estimates",
    path: "/quote/new",
    desc: "Send price estimates and project proposals to win clients.",
    gradient: "from-emerald-600 to-teal-600",
    badgeColor: "bg-emerald-100 text-emerald-700",
    icon: Sparkles
  },
  {
    title: "Payment Receipts",
    path: "/receipt/new",
    desc: "Acknowledge received payments and cash transactions instantly.",
    gradient: "from-sky-600 to-blue-600",
    badgeColor: "bg-sky-100 text-sky-700",
    icon: Receipt
  },
  {
    title: "Purchase Orders",
    path: "/purchase-order/new",
    desc: "Vendor procurement orders and item quantity tracking.",
    gradient: "from-purple-600 to-pink-600",
    badgeColor: "bg-purple-100 text-purple-700",
    icon: FileText
  },
  {
    title: "Credit Notes",
    path: "/credit-note/new",
    desc: "Handle returns, adjustments, and refunds effortlessly.",
    gradient: "from-rose-600 to-orange-600",
    badgeColor: "bg-rose-100 text-rose-700",
    icon: FileText
  },
];

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-blue-500 selection:text-white">
      {/* 21st.dev Style Ultra-Modern Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-white pt-20 pb-28 lg:pt-28 lg:pb-36">
        {/* Ambient Glow Lights (21st.dev Mesh Gradient Orbs) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-600/30 via-indigo-500/25 to-purple-600/30 blur-[130px] rounded-full pointer-events-none -z-0"></div>
        <div className="absolute -top-10 left-10 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        {/* Subtle Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Top Pill / Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-semibold mb-8 backdrop-blur-md shadow-inner transition-colors cursor-default"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-blue-200">100% Free Professional Billing Suite</span>
            <span className="text-white/40">•</span>
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <Check className="h-3 w-3" /> Zero Watermarks
            </span>
          </motion.div>

          {/* Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] sm:leading-[1.1]"
          >
            Create Polished Bills with{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              UPI QR Payments & Instant PDF
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Fast, compliant invoices, GST bills, price quotations, and payment receipts. Ready in 60 seconds with no account required and 1-click WhatsApp sharing.
          </motion.p>

          {/* CTA Buttons with 21st.dev Shimmer Beam Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={() => setLocation("/invoice/new")}
              size="lg"
              className="relative group overflow-hidden w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base px-9 py-6 rounded-2xl shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 gap-2 border border-blue-400/30"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
              <FileText className="h-5 w-5" />
              <span>Create Free Invoice</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              onClick={() => setLocation("/templates")}
              size="lg"
              className="w-full sm:w-auto bg-white/10 hover:bg-white text-white hover:text-blue-700 border-2 border-white/40 hover:border-white text-base font-bold px-8 py-6 rounded-2xl backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Explore Curated Templates
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400 font-medium"
          >
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> No Account Needed
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <QrCode className="h-4 w-4 text-cyan-400" /> Dynamic UPI QR Code
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <Share2 className="h-4 w-4 text-blue-400" /> WhatsApp Direct Share
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <ShieldCheck className="h-4 w-4 text-purple-400" /> 100% Free & Secure
            </div>
          </motion.div>

          {/* Interactive Floating Invoice Mockup (UI/UX Pro Max Showcase) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="mt-16 max-w-4xl mx-auto relative"
          >
            {/* Ambient Backlight for the card */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-2xl -z-10 rounded-3xl transform scale-95"></div>

            <div className="bg-slate-900/90 border border-white/15 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl text-left text-slate-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/10 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      Invoice #IG-2026-089
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        PAID VIA UPI
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">Issued by CloudNova Systems Inc. • GST Registered</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-400/30 text-xs py-1">
                    INR (₹) Standard
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => setLocation("/invoice/new")}
                    className="bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/20 text-xs h-8 px-3 rounded-lg transition-all"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> Try Live Demo
                  </Button>
                </div>
              </div>

              {/* Mockup Line Items Preview */}
              <div className="py-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="sm:col-span-2 space-y-3">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Line Items</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-200 font-medium">Full-Stack Web Application Architecture</span>
                      <span className="font-bold text-white">₹35,000.00</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-200 font-medium">UPI QR Code & Gateway Webhook Setup</span>
                      <span className="font-bold text-white">₹10,000.00</span>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-between items-center text-sm font-bold text-white">
                    <span>Total Amount (Incl. 18% GST):</span>
                    <span className="text-lg bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">₹53,100.00</span>
                  </div>
                </div>

                {/* Scannable Mockup QR Box */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center space-y-2">
                  <div className="w-20 h-20 bg-white rounded-xl p-1.5 shadow-md flex items-center justify-center">
                    <QrCode className="w-full h-full text-slate-900" />
                  </div>
                  <div className="text-[11px] font-bold text-white flex items-center gap-1 justify-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Instant UPI QR
                  </div>
                  <div className="text-[10px] text-slate-400">Scan via GPay / PhonePe / Paytm</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Document Creators Grid (Framer Motion Staggered Cards) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="outline" className="mb-3 px-3 py-1 border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold">
              Instant Generation Suite
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Pick a Document to Create Instantly
            </h2>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Select any document type below to open the dedicated builder with instant real-time vector preview.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentTypes.map((doc, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                onClick={() => setLocation(doc.path)}
                className="group relative p-6 rounded-2xl border border-gray-200/80 hover:border-blue-400/80 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-blue-500/10 bg-white overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full pointer-events-none"></div>

                <div className="flex items-center gap-3.5 mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${doc.gradient} flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform`}>
                    <doc.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition-colors">{doc.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${doc.badgeColor}`}>
                      Fast Builder
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-5 leading-relaxed">{doc.desc}</p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-bold text-blue-600 group-hover:text-blue-700">
                  <span>Start with fresh blank</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section with 21st.dev Style Spotlight Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200 mb-3 px-3 py-1 font-semibold text-xs">
              Engineered for Speed
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Built for Modern Businesses & Freelancers
            </h2>
            <p className="mt-3 text-base sm:text-lg text-gray-600">
              Everything you need to create, customize, and deliver polished financial documents to clients worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="group relative p-7 rounded-3xl border border-gray-100/90 shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center ${feat.accent} mb-5 group-hover:scale-110 transition-transform shadow-inner`}>
                  <feat.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Templates Showcase with Interactive Hover Reveals */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <Badge variant="outline" className="mb-2 px-3 py-1 border-purple-200 bg-purple-50 text-purple-700 text-xs font-semibold">
                Curated Gallery
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Popular Invoice Templates</h2>
              <p className="text-gray-600 text-sm mt-1">Choose from curated formats crafted for all industries</p>
            </div>
            <Button
              onClick={() => setLocation("/templates")}
              variant="outline"
              className="gap-2 font-bold text-xs h-10 px-4 rounded-xl border-gray-300 hover:bg-white hover:border-blue-500 hover:text-blue-600 transition-all"
            >
              Browse All Templates <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((tpl) => (
              <motion.div
                key={tpl.id}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                onClick={() => setLocation(`/invoice/new?template=${tpl.id}`)}
                className="group cursor-pointer overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 rounded-3xl bg-white"
              >
                <div className="aspect-[4/5] overflow-hidden bg-slate-100 relative">
                  <img
                    src={tpl.previewImage}
                    alt={tpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                    <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-xl rounded-xl">
                      Use Template
                    </Button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md">
                      {tpl.industry}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">{tpl.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{tpl.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Step-by-Step Guide for Users & AI Overview */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
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
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-3"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center mx-auto text-sm shadow-md shadow-blue-500/30">
                1
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Select Document Type</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Choose standard invoice, GST tax bill, quotation, receipt, or an industry-specific template.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-3"
            >
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto text-sm shadow-md shadow-indigo-500/30">
                2
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Enter Business Details</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Input your company name, client info, invoice date, currency, and customized line items with rates.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-3"
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto text-sm shadow-md shadow-emerald-500/30">
                3
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Add UPI ID / QR Code</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Enable scannable UPI QR codes for instant direct bank payment with 0% gateway commission.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-3"
            >
              <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white font-bold flex items-center justify-center mx-auto text-sm shadow-md shadow-purple-500/30">
                4
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Download PDF & Share</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Export high-resolution vector PDF in 1 click or send directly via WhatsApp or email to your customer.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (AEO & GEO Knowledge Accordion) */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
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

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-10">
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-3">
              <AccordionItem value="item-1" className="border-b border-gray-100 pb-3">
                <AccordionTrigger className="text-sm sm:text-base font-bold text-gray-900 hover:no-underline text-left">
                  Is Invoice Genius really 100% free to use?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Yes, absolutely. There are no trial periods, hidden subscription fees, or limits on the number of invoices you can create. Generated PDF documents are completely clean and free of watermarks or forced platform logos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b border-gray-100 pb-3">
                <AccordionTrigger className="text-sm sm:text-base font-bold text-gray-900 hover:no-underline text-left">
                  How does the UPI QR Code payment feature work?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  When creating an invoice, you can simply type in your Virtual Payment Address (e.g., yourname@okhdfcbank or phone@paytm). Our system dynamically encodes this into an NPCI-compliant payment QR code embedded on the bill. Clients can scan it with Google Pay, PhonePe, Paytm, or BHIM to send money directly to your bank account with zero payment gateway processing fees.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b border-gray-100 pb-3">
                <AccordionTrigger className="text-sm sm:text-base font-bold text-gray-900 hover:no-underline text-left">
                  Can I create GST-compliant tax invoices with HSN/SAC codes?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Yes. Invoice Genius includes a specialized GST Invoice format that supports supplier GSTIN, recipient GSTIN, state code, place of supply, HSN/SAC classification, and calculates split CGST, SGST, or IGST tax breakdowns automatically.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-gray-100 pb-3">
                <AccordionTrigger className="text-sm sm:text-base font-bold text-gray-900 hover:no-underline text-left">
                  What other documents besides invoices can I generate?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  In addition to standard and tax invoices, you can generate Price Quotations / Estimates, Payment Receipts, Cash Vouchers, Purchase Orders (PO), and Credit Notes / Memos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-b border-gray-100 pb-3">
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

      {/* Call to Action Banner (21st.dev Gradient Card with Ambient Glow) */}
      <section className="py-24 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to Generate Your First Invoice?
            </h2>
            <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto mt-4 font-normal">
              Join thousands of freelancers, agencies, and small businesses who bill clients faster with Invoice Genius.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => setLocation("/invoice/new")}
                size="lg"
                className="relative group overflow-hidden bg-white text-blue-700 hover:bg-slate-100 font-extrabold px-9 py-6 rounded-2xl shadow-2xl hover:scale-105 transition-all text-base gap-2"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-blue-100/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                <Sparkles className="h-5 w-5 text-blue-600" /> Start Generating for Free
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
