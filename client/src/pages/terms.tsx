import { useEffect } from "react";
import { FileCheck, ShieldAlert, CheckCircle, Scale, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfService() {
  useEffect(() => {
    document.title = "Terms of Service | InvoiceGenius - Modern Billing & Invoicing";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 sm:p-12">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-4 border border-slate-200">
            <Scale className="w-4 h-4 text-blue-600" />
            <span>Legal Agreement & User Responsibilities</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last Updated: October 8, 2026 • Effective Date: January 1, 2026
          </p>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Welcome to <strong>InvoiceGenius</strong> ("we", "us", or "our"), accessible at{" "}
            <a href="https://invoicegenius.in" className="text-blue-600 underline font-medium">
              https://invoicegenius.in
            </a>
            . By accessing or using our website, document generation tools, invoice editors, and related services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use our services.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">1</span>
              Description of Service
            </h2>
            <p className="mb-3">
              InvoiceGenius provides an online browser-based suite of document generation tools enabling businesses, freelancers, and contractors to create, customize, preview, and download invoices, GST tax invoices, proforma invoices, price quotes, estimates, delivery notes, and purchase orders.
            </p>
            <p>
              The basic generation tools are provided free of charge for legitimate business and professional purposes.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">2</span>
              User Responsibilities & Acceptable Use
            </h2>
            <p className="mb-2">When using InvoiceGenius, you agree not to:</p>
            <ul className="list-disc pl-5 space-y-2 mb-3">
              <li>Generate fraudulent, deceitful, or misleading billing documents or illegal tax evasive statements.</li>
              <li>Impersonate any person, registered business entity, or government agency without explicit authorization.</li>
              <li>Use the service to distribute malicious code, spam, or engage in automated web scraping that impairs service performance.</li>
              <li>Violate applicable regional, national, or international tax and financial regulations (including GST / VAT rules).</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">3</span>
              Ownership of Generated Content
            </h2>
            <p className="mb-2">
              You retain all ownership, copyright, and title to the specific business data, logos, customer records, and numerical figures you input into invoices and receipts generated on InvoiceGenius.
            </p>
            <p>
              InvoiceGenius claims no ownership rights over your customized document content or transactions conducted between you and your clients.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">4</span>
              Intellectual Property Rights
            </h2>
            <p>
              The underlying software, UI designs, logos, CSS styling, document layouts, trademarks, and code of InvoiceGenius are the exclusive intellectual property of InvoiceGenius and its licensors. You may not copy, reverse engineer, or sell our source code or website layout without express written consent.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-amber-50/60 p-6 rounded-xl border border-amber-200">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Tax & Legal Disclaimer
            </h2>
            <p className="text-slate-700 mb-2">
              InvoiceGenius is a calculation and formatting aid. We are not a certified accounting firm, tax advisor, or legal authority. While our templates follow standard GST and international invoice guidelines:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>You are solely responsible for ensuring that all tax calculations (such as CGST, SGST, IGST, VAT), HSN/SAC codes, and legal declarations comply with your local jurisdiction's laws.</li>
              <li>We do not guarantee that generated documents will prevent audits, tax penalties, or payment disputes with your counterparties.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">5</span>
              Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, InvoiceGenius and its operators shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or business interruptions arising from your use or inability to use the service.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">6</span>
              Third-Party Links & Advertisements
            </h2>
            <p>
              Our website may contain links to third-party websites or services (including partner calculators, free web utilities, and Google advertisements) that are not owned or controlled by InvoiceGenius. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites.
            </p>
          </section>

          {/* Section 8 */}
          <section className="border-t border-slate-200 pt-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">7</span>
              Modifications and Contact
            </h2>
            <p className="mb-4">
              We reserve the right to revise or replace these Terms at any time. Continued use of InvoiceGenius following notice of changes will constitute acceptance of the revised Terms.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">Legal & Support Queries</p>
                <p className="text-slate-600 text-xs">Email: <a href="mailto:support@invoicegenius.in" className="text-blue-600 underline font-medium">support@invoicegenius.in</a></p>
              </div>
              <Link href="/contact" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm">
                Contact Support
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
