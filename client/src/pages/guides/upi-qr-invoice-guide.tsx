import { Link } from "wouter";
import { useEffect } from "react";
import { QrCode, ArrowRight, CheckCircle2, ShieldCheck, Zap, Smartphone, DollarSign, Calendar, Clock } from "lucide-react";

export default function UpiQrInvoiceGuide() {
  useEffect(() => {
    document.title = "How to Add Dynamic UPI QR Code to Invoices (0% Fees) | Invoice Genius";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-blue-600">Guides</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">UPI QR Code Invoicing</span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <QrCode className="w-3.5 h-3.5" />
            <span>Digital Payments &amp; Invoicing (2026 Guide)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            How to Add Dynamic UPI QR Code to Invoices for Instant 0% Fee Payments
          </h1>
          <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-200">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 5 min read</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Updated for 2026</span>
          </div>
        </header>

        {/* Content Body */}
        <article className="prose prose-slate max-w-none text-slate-700 space-y-8 leading-relaxed">
          <section className="space-y-4">
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              For freelancers, consultants, and small agencies in India, chasing late payments is one of the biggest friction points. Traditional bank transfers (NEFT/RTGS/IMPS) require adding beneficiaries and waiting for cool-off periods, while card gateways deduct <strong>2% to 3% transaction fees</strong>.
            </p>
            <p className="text-sm text-slate-600">
              Adding a <strong>Dynamic UPI QR code</strong> directly on your invoice PDF solves both problems: your client simply scans the code using PhonePe, Google Pay, or Paytm, and money deposits directly into your bank account with <strong>0% fee deductions</strong>.
            </p>
          </section>

          {/* Traditional Gateways vs UPI QR Comparison Table */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              UPI QR Code vs Payment Gateway Comparison
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-900 font-bold">
                    <th className="p-3.5">Feature</th>
                    <th className="p-3.5">Dynamic UPI QR (Invoice Genius)</th>
                    <th className="p-3.5">Payment Gateway Links (Razorpay/Stripe)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">Transaction Fee</td>
                    <td className="p-3.5 text-emerald-600 font-bold">0% (Completely Free)</td>
                    <td className="p-3.5 text-rose-600">2.0% - 3.5% + GST per transaction</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">Settlement Time</td>
                    <td className="p-3.5 text-indigo-700 font-semibold">Instant (Direct to Bank)</td>
                    <td className="p-3.5 text-slate-600">T+2 or T+3 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">Setup Requirement</td>
                    <td className="p-3.5 text-slate-600">Just your UPI ID (VPA)</td>
                    <td className="p-3.5 text-slate-600">Merchant KYC, business registration &amp; bank review</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">Client Convenience</td>
                    <td className="p-3.5 text-slate-600">1-Scan with PhonePe, GPay, Paytm</td>
                    <td className="p-3.5 text-slate-600">Opens external web browser gateway page</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Step by step guide */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              How Dynamic UPI QR Code Generation Works
            </h2>
            <div className="space-y-3 text-sm">
              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Enter Your UPI ID (VPA)</h3>
                  <p className="text-slate-600 text-xs">Enter your personal or business UPI ID (e.g. <code>yourname@okhdfcbank</code> or <code>business@upi</code>) in the invoice form.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Automated NPCI Intent Encoding</h3>
                  <p className="text-slate-600 text-xs">Invoice Genius encodes your UPI VPA, the exact invoice total amount, and your business payee name into a standard NPCI UPI payload.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Download Vector PDF</h3>
                  <p className="text-slate-600 text-xs">Export a razor-sharp vector PDF. The client scans the QR code directly from their mobile screen or printed paper, and payment is credited to your bank account immediately.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive CTA */}
          <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl space-y-4 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Generate an Invoice with UPI QR Right Now</h2>
            <p className="text-slate-300 text-sm max-w-xl">
              100% Free with zero company watermarks. Compatible with all Indian UPI applications including PhonePe, Google Pay, Paytm, and BHIM.
            </p>
            <div className="pt-2">
              <Link
                href="/invoice/new"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg"
              >
                <span>Create Free UPI Invoice Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}

