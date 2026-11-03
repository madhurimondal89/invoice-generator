import { Link } from "wouter";
import { useEffect } from "react";
import { FileText, ArrowRight, CheckCircle2, ShieldCheck, Scale, Calendar, Clock } from "lucide-react";

export default function ProformaVsTaxInvoiceGuide() {
  useEffect(() => {
    document.title = "Proforma Invoice vs Tax Invoice vs Quotation: Differences | Invoice Genius";
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
          <span className="text-slate-900 font-semibold">Proforma vs Tax Invoice</span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>Commercial Accounting Guide</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Proforma Invoice vs. Tax Invoice vs. Quotation: Key Differences Explained
          </h1>
          <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-200">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 7 min read</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Updated for 2026</span>
          </div>
        </header>

        {/* Content Body */}
        <article className="prose prose-slate max-w-none text-slate-700 space-y-8 leading-relaxed">
          <section className="space-y-4">
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Many freelancers and business owners confuse <strong>Quotations</strong>, <strong>Proforma Invoices</strong>, and <strong>Tax Invoices</strong>. Issuing the wrong document at the wrong stage can lead to premature tax liabilities or delayed client approvals.
            </p>
          </section>

          {/* Quick Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Step 1</span>
              <h2 className="text-lg font-bold text-slate-900">Quotation / Estimate</h2>
              <p className="text-xs text-slate-600">
                A non-binding proposal stating estimated costs and timelines before client agreement.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 2</span>
              <h2 className="text-lg font-bold text-slate-900">Proforma Invoice</h2>
              <p className="text-xs text-slate-600">
                A preliminary bill sent to request advance payment or arrange customs clearance.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Step 3</span>
              <h2 className="text-lg font-bold text-slate-900">Tax Invoice</h2>
              <p className="text-xs text-slate-600">
                A legally binding demand for payment issued after delivery, used to claim Input Tax Credit.
              </p>
            </div>
          </section>

          {/* Detailed Side-by-side Comparison Matrix */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Side-by-Side Comparison Matrix
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-900 font-bold">
                    <th className="p-3.5">Comparison Point</th>
                    <th className="p-3.5">Quotation / Estimate</th>
                    <th className="p-3.5">Proforma Invoice</th>
                    <th className="p-3.5">Tax Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">When to Issue</td>
                    <td className="p-3.5 text-slate-600">Before project starts or order placed</td>
                    <td className="p-3.5 text-slate-600">Before delivery / for advance payment</td>
                    <td className="p-3.5 text-slate-600">After goods/services are delivered</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">Legal Binding</td>
                    <td className="p-3.5 text-slate-600">No (Subject to acceptance)</td>
                    <td className="p-3.5 text-slate-600">No (Good-faith estimate)</td>
                    <td className="p-3.5 text-indigo-700 font-bold">Yes (Legal commercial contract)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">GST / Tax Liability</td>
                    <td className="p-3.5 text-slate-600">No tax obligation created</td>
                    <td className="p-3.5 text-slate-600">No tax obligation created</td>
                    <td className="p-3.5 text-rose-600 font-semibold">Creates immediate GST tax liability</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">Can Buyer Claim ITC?</td>
                    <td className="p-3.5 text-slate-600">No</td>
                    <td className="p-3.5 text-slate-600">No (Cannot claim ITC)</td>
                    <td className="p-3.5 text-emerald-700 font-bold">Yes (Legally valid for ITC)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900">Accounting Entry</td>
                    <td className="p-3.5 text-slate-600">Not recorded in financial books</td>
                    <td className="p-3.5 text-slate-600">Not recorded as accounts receivable</td>
                    <td className="p-3.5 text-slate-600">Recorded as Accounts Receivable</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Interactive Generator CTAs */}
          <section className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl space-y-4 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Generate Any Document in Seconds</h2>
            <p className="text-slate-300 text-sm max-w-xl">
              Invoice Genius lets you create and switch between Quotations, Proforma Invoices, and Official Tax Invoices instantly with 0% watermark.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/proforma-invoice/new"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md"
              >
                <span>Make Proforma Invoice</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quote/new"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all border border-white/20"
              >
                <span>Make Quotation</span>
              </Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
