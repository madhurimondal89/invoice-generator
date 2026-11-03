import { Link } from "wouter";
import { useEffect } from "react";
import { BookOpen, FileText, QrCode, Layers, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const guides = [
  {
    slug: "/guides/gst-invoice-format",
    title: "Indian GST Invoice Rules & Format: Complete 2026 Guide",
    desc: "Everything you need to know about GST tax invoices in India: mandatory GSTIN fields, state codes, HSN/SAC codes, and itemized CGST, SGST, IGST tax calculations.",
    readTime: "6 min read",
    category: "GST & Compliance",
    badgeColor: "bg-indigo-100 text-indigo-700",
    icon: Layers,
    toolLink: "/tax-invoice/new",
    toolName: "Generate GST Invoice",
  },
  {
    slug: "/guides/upi-qr-code-invoice",
    title: "How to Add Dynamic UPI QR Code to Invoices (0% Fees)",
    desc: "Step-by-step guide to generating scannable UPI QR codes on invoice PDFs. Allow clients to pay instantly via PhonePe, Google Pay, or Paytm directly to your bank account.",
    readTime: "5 min read",
    category: "Digital Payments",
    badgeColor: "bg-blue-100 text-blue-700",
    icon: QrCode,
    toolLink: "/invoice/new",
    toolName: "Create UPI Invoice",
  },
  {
    slug: "/guides/proforma-vs-tax-invoice",
    title: "Proforma Invoice vs Tax Invoice vs Quotation: Key Differences",
    desc: "Understand the legal, financial, and accounting differences between Proforma Invoices, Commercial Tax Invoices, and Price Estimates with a side-by-side comparison table.",
    readTime: "7 min read",
    category: "Business Basics",
    badgeColor: "bg-emerald-100 text-emerald-700",
    icon: FileText,
    toolLink: "/proforma-invoice/new",
    toolName: "Make Proforma Invoice",
  },
];

export default function GuidesHub() {
  useEffect(() => {
    document.title = "Invoicing Guides & GST Compliance Hub | Invoice Genius";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold border border-blue-200">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Invoice Genius Knowledge Base</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Invoicing Guides, GST Rules &amp; Best Practices
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Practical, in-depth resources created for Indian and international freelancers, consultants, contractors, and small business owners.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide, idx) => (
            <article
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:border-blue-400/80 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${guide.badgeColor}`}>
                    {guide.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {guide.readTime}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-blue-600 mb-4">
                  <guide.icon className="w-5 h-5" />
                </div>

                <h2 className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors mb-2.5 leading-snug">
                  <Link href={guide.slug}>{guide.title}</Link>
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {guide.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  href={guide.slug}
                  className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={guide.toolLink}
                  className="text-slate-500 hover:text-slate-800 underline font-medium"
                >
                  {guide.toolName}
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Quick CTA Box */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl p-8 sm:p-10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Need to generate a bill right now?</h2>
            <p className="text-blue-100 text-sm max-w-xl">
              Create and download a 100% watermark-free, GST-compliant PDF invoice with dynamic UPI QR code in under 60 seconds.
            </p>
          </div>
          <Link
            href="/invoice/new"
            className="shrink-0 bg-white text-blue-600 hover:bg-blue-50 font-bold px-6 py-3.5 rounded-xl text-sm shadow-md transition-all hover:scale-105"
          >
            Create Free Invoice
          </Link>
        </div>
      </div>
    </div>
  );
}
