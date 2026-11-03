import { Link } from "wouter";
import { useEffect } from "react";
import { Layers, ArrowRight, CheckCircle2, ShieldCheck, HelpCircle, FileText, Calendar, Clock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function GstInvoiceGuide() {
  useEffect(() => {
    document.title = "Indian GST Invoice Rules, Formats & HSN Guide | Invoice Genius";
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
          <span className="text-slate-900 font-semibold">GST Invoice Rules</span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Indian GST Compliance Guide (2026 Updated)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Indian GST Invoice Rules, Formats &amp; HSN Codes Explained
          </h1>
          <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-200">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 6 min read</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Updated for 2026</span>
          </div>
        </header>

        {/* Content Body */}
        <article className="prose prose-slate max-w-none text-slate-700 space-y-8 leading-relaxed">
          <section className="space-y-4">
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              In India, any registered business under the Goods and Services Tax (GST) regime is legally required to issue a <strong>GST Tax Invoice</strong> whenever supplying taxable goods or services. Issuing non-compliant invoices can result in penalties, audits, and rejection of <em>Input Tax Credit (ITC)</em> for your clients.
            </p>
          </section>

          {/* Key Checklist Box */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              16 Mandatory Fields Required on a Valid GST Invoice
            </h2>
            <p className="text-sm text-slate-600">
              Under Section 31 of the CGST Act, every commercial tax invoice must contain these vital details:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              {[
                "Supplier Name, Address & GSTIN",
                "Consecutive Serial Number (<= 16 digits)",
                "Invoice Issue Date",
                "Recipient Name, Address & GSTIN/UIN",
                "Place of Supply & State Name",
                "Delivery Address (if different from billing)",
                "HSN Code (Goods) or SAC Code (Services)",
                "Clear Item Description & Quantity",
                "Total Value of Goods or Services",
                "Taxable Value (after discounts)",
                "Tax Rate (CGST, SGST, IGST, Cess)",
                "Total Tax Amount Claimed",
                "Reverse Charge Mechanism (Yes/No)",
                "Digital Signature or Physical Signature",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CGST vs SGST vs IGST Table */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Understanding Tax Split: CGST, SGST, and IGST
            </h2>
            <p className="text-sm text-slate-600">
              How tax is calculated depends on whether the transaction is within the same state (Intra-state) or between different states (Inter-state):
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-900 font-bold">
                    <th className="p-3.5">Transaction Type</th>
                    <th className="p-3.5">Condition</th>
                    <th className="p-3.5">Tax Applicable</th>
                    <th className="p-3.5">Example (18% Rate)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">Intra-State Supply</td>
                    <td className="p-3.5 text-slate-600">Seller &amp; Buyer in same state (e.g. Maharashtra to Maharashtra)</td>
                    <td className="p-3.5 text-indigo-700 font-semibold">CGST + SGST (50% each)</td>
                    <td className="p-3.5 text-slate-600">9% CGST + 9% SGST</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">Inter-State Supply</td>
                    <td className="p-3.5 text-slate-600">Seller &amp; Buyer in different states (e.g. Delhi to Karnataka)</td>
                    <td className="p-3.5 text-blue-700 font-semibold">IGST (100% Integrated)</td>
                    <td className="p-3.5 text-slate-600">18% IGST</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">Export of Services</td>
                    <td className="p-3.5 text-slate-600">Recipient outside India with convertible foreign exchange</td>
                    <td className="p-3.5 text-emerald-700 font-semibold">Zero-Rated (with LUT)</td>
                    <td className="p-3.5 text-slate-600">0% IGST under LUT</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* HSN/SAC Rules */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              HSN and SAC Code Digit Requirements
            </h2>
            <p className="text-sm text-slate-600">
              The number of HSN digits required on your GST tax invoice depends on your annual aggregate turnover (AATO):
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
                <span><strong>Turnover up to ₹5 Crores:</strong> Minimum 4 digits of HSN/SAC code on B2B invoices (optional for B2C).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
                <span><strong>Turnover above ₹5 Crores:</strong> Mandatory 6 digits of HSN/SAC code on all invoices.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
                <span><strong>Export &amp; Import:</strong> Mandatory 8-digit HSN code.</span>
              </li>
            </ul>
          </section>

          {/* Interactive Tool Banner */}
          <section className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl space-y-4 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Generate a 100% Compliant GST Invoice Free</h2>
            <p className="text-slate-300 text-sm max-w-xl">
              Invoice Genius features automated CGST, SGST, IGST calculations, GSTIN validation, HSN line items, and dynamic UPI QR code payments.
            </p>
            <div className="pt-2">
              <Link
                href="/tax-invoice/new"
                className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg"
              >
                <span>Launch Free GST Invoice Builder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}

