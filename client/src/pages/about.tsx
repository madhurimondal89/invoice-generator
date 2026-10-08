import { useEffect } from "react";
import { 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  QrCode, 
  Zap, 
  Users, 
  Globe2, 
  CheckCircle2, 
  ArrowRight,
  Receipt,
  Layers,
  HeartHandshake
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "About Us | InvoiceGenius - Modern Free Business Invoicing";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/70 text-blue-800 text-xs font-semibold border border-blue-200">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Empowering Freelancers & Businesses Worldwide</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            About <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">InvoiceGenius</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            InvoiceGenius is a modern, high-speed document generation suite engineered to simplify billing for small business owners, freelancers, digital agencies, and independent professionals worldwide.
          </p>
        </div>

        {/* Story & Mission Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">
                Our Mission: Seamless, Instant & Compliant Billing
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Billing clients should not require bloated software, recurring subscription walls, or complex setup manuals. We built InvoiceGenius with a simple philosophy: <strong>open your browser, fill in your details, and download a beautiful, tax-compliant invoice in under 60 seconds.</strong>
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Whether you need a GST-compliant tax invoice for Indian businesses, an international multi-currency quotation, or an instant payment receipt with custom UPI QR codes, InvoiceGenius delivers print-ready vector PDFs directly in your web browser.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white rounded-2xl p-8 space-y-6 shadow-md">
              <h3 className="text-lg font-bold">Why InvoiceGenius Stands Apart</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>100% Client-Side Privacy:</strong> Your sensitive financial details stay in your browser.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Instant UPI QR Code:</strong> Get paid faster with automatic Indian UPI payment codes.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Multi-Document Suite:</strong> Invoices, quotes, delivery notes, and purchase orders in one place.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>No Watermarks:</strong> Clean, professional PDFs ready to send to clients immediately.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Instant Document Creation</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Generate invoices without forced logins. Open the template, adjust your quantities and taxes, and download in real-time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">UPI & Dynamic QR Integration</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Embed dynamic UPI QR codes directly onto your invoices so your clients can scan and pay instantly via Google Pay, PhonePe, or Paytm.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Bank-Grade Privacy Focus</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              We never sell or inspect your transaction content. Your client lists and product pricing remain your confidential trade secrets.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Multi-Currency & Regional Taxes</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Support for INR (₹), USD ($), EUR (€), GBP (£), and global currencies with flexible GST, VAT, and custom sales tax rates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Designer Pro Templates</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Select between Classic White, Modern Blue, Creative Pro, Minimalist, Corporate Navy, and Gradient designs for any industry.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Free Web Utility Ecosystem</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Committed to supporting digital entrepreneurs with free tools for image compression, document conversions, and financial calculators.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">Ready to create your next invoice?</h3>
            <p className="text-blue-200 text-sm max-w-lg">
              Start now for free. No credit card required, no watermark, and ready in seconds.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setLocation("/invoice/new")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 shadow-md"
            >
              Generate Invoice
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/contact")}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
