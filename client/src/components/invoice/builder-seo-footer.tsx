import { Link } from "wouter";
import { HelpCircle, Sparkles, ShieldCheck, QrCode, FileText, BookOpen, Layers } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface BuilderSeoFooterProps {
  documentType: string;
}

const seoContentMap: Record<
  string,
  {
    title: string;
    description: string;
    guideLink?: { title: string; href: string };
    faqs: Array<{ question: string; answer: string }>;
  }
> = {
  tax_invoice: {
    title: "About GST Tax Invoices in India",
    description:
      "A GST tax invoice is a mandatory legal document issued by registered businesses for taxable supplies under the Indian Goods and Services Tax act. It itemizes GSTIN details, state codes, HSN/SAC codes, and calculates CGST, SGST, or IGST based on the place of supply.",
    guideLink: {
      title: "Read complete Indian GST Invoice Rules & Format Guide",
      href: "/guides/gst-invoice-format",
    },
    faqs: [
      {
        question: "When should I issue a GST Tax Invoice?",
        answer:
          "You must issue a GST tax invoice on or before supplying taxable goods, or within 30 days of rendering taxable services to a client.",
      },
      {
        question: "What is the difference between CGST, SGST, and IGST on an invoice?",
        answer:
          "Intra-state transactions (within the same state) are split equally into CGST (Central GST) and SGST (State GST). Inter-state transactions (between different states) are charged as single IGST (Integrated GST).",
      },
      {
        question: "Can clients use this invoice to claim Input Tax Credit (ITC)?",
        answer:
          "Yes. Invoices generated with Invoice Genius contain your GSTIN, client GSTIN, valid invoice serial number, and itemized tax breakdowns, fulfilling all Section 31 CGST Act requirements for ITC claims.",
      },
      {
        question: "How do dynamic UPI QR payments work on GST invoices?",
        answer:
          "You can enter your UPI ID in the invoice settings. Invoice Genius renders an instant scannable UPI QR code on the PDF. Clients scan it with Google Pay, PhonePe, or Paytm for 0% fee settlement.",
      },
    ],
  },
  proforma_invoice: {
    title: "About Proforma Invoices",
    description:
      "A Proforma Invoice is a preliminary bill of sale delivered to international or domestic buyers in advance of goods shipment or service delivery. It outlines estimated pricing, scope, and payment terms without creating an immediate tax liability.",
    guideLink: {
      title: "Compare Proforma Invoice vs Tax Invoice vs Quotation",
      href: "/guides/proforma-vs-tax-invoice",
    },
    faqs: [
      {
        question: "Is a Proforma Invoice legally binding?",
        answer:
          "No. A proforma invoice is a good-faith estimate and request for advance payment. It does not create an accounting accounts-receivable entry or GST tax liability until the final tax invoice is issued.",
      },
      {
        question: "When should I send a Proforma Invoice?",
        answer:
          "Send a proforma invoice when requesting advance deposits, establishing commercial agreement on project scope, or helping international clients arrange import customs clearance.",
      },
      {
        question: "Can a client claim Input Tax Credit (ITC) on a Proforma Invoice?",
        answer:
          "No. ITC can only be claimed on official commercial Tax Invoices after goods or services are delivered.",
      },
    ],
  },
  quote: {
    title: "About Price Quotations & Estimates",
    description:
      "A Price Quotation or Estimate provides clients with a clear, itemized proposal of costs, service terms, and validity windows before commencing work.",
    guideLink: {
      title: "Learn how to price projects in our Freelance Invoicing Guide",
      href: "/guides/freelance-invoice-guide",
    },
    faqs: [
      {
        question: "What should be included in a professional quotation?",
        answer:
          "Include a clear description of services/deliverables, itemized unit rates, estimated timeline, payment milestones, and an expiry/validity date.",
      },
      {
        question: "Can I convert a quotation to an invoice later?",
        answer:
          "Yes. Once the client approves your quotation, you can easily issue a matching standard invoice or GST tax invoice with the agreed figures.",
      },
    ],
  },
  receipt: {
    title: "About Payment Receipts & Cash Vouchers",
    description:
      "A payment receipt is an official commercial acknowledgement confirming that payment (full or partial) has been received for services or goods rendered.",
    faqs: [
      {
        question: "What details make a payment receipt valid?",
        answer:
          "A valid receipt specifies the payer's name, payment date, exact amount received in words and numbers, payment method (UPI, Bank Transfer, Cash), and reference transaction ID.",
      },
      {
        question: "Can I share payment receipts on WhatsApp directly?",
        answer:
          "Yes. Invoice Genius provides 1-click WhatsApp sharing and instant vector PDF downloads for all generated receipts.",
      },
    ],
  },
  invoice: {
    title: "About Standard Invoices with Dynamic UPI QR Code",
    description:
      "Standard invoices provide a crisp, corporate billing document formatted for contractors, consultants, and service providers. Features automatic UPI QR payments, multi-currency conversion, and watermark-free PDF export.",
    guideLink: {
      title: "How to add UPI QR codes to invoices for 0% transaction fee",
      href: "/guides/upi-qr-code-invoice",
    },
    faqs: [
      {
        question: "How does the UPI QR Code payment feature work on invoices?",
        answer:
          "Enter your UPI VPA (e.g. name@okhdfcbank). Invoice Genius encodes your VPA and the exact invoice total into a scannable QR code. Clients scan and pay with PhonePe, GPay, or Paytm directly to your bank account with zero gateway fees.",
      },
      {
        question: "Can I generate invoices in international currencies?",
        answer:
          "Yes. Invoice Genius supports USD ($), EUR (€), GBP (£), INR (₹), BDT (৳), AED, and 160+ world currencies with native decimal formatting.",
      },
      {
        question: "Do generated invoices contain any company watermarks?",
        answer:
          "No. All exported PDFs are 100% clean, professional, and free from any third-party logos or watermark text.",
      },
    ],
  },
};

export default function BuilderSeoFooter({ documentType }: BuilderSeoFooterProps) {
  const content = seoContentMap[documentType] || seoContentMap.invoice;

  return (
    <div className="mt-16 pt-12 border-t border-slate-200 no-print space-y-8 max-w-4xl mx-auto px-4">
      {/* Overview Card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
          <BookOpen className="w-4 h-4" />
          <span>Knowledge &amp; Compliance Notes</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {content.title}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {content.description}
        </p>

        {content.guideLink && (
          <div className="pt-2">
            <Link
              href={content.guideLink.href}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 underline"
            >
              <span>{content.guideLink.title}</span>
              <span>&rarr;</span>
            </Link>
          </div>
        )}
      </div>

      {/* Accordion FAQs for Answer Engines */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <span>Frequently Asked Questions</span>
        </h3>
        <Accordion type="single" collapsible className="w-full space-y-2">
          {content.faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="border border-slate-200 rounded-xl px-4 bg-white shadow-2xs"
            >
              <AccordionTrigger className="text-left font-semibold text-sm text-slate-900 hover:text-blue-600 py-3.5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-slate-600 leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Related Tools Links */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-4 border-t border-slate-100">
        <span className="font-semibold text-slate-700">Other Free Builders:</span>
        <div className="flex flex-wrap gap-3">
          <Link href="/tax-invoice/new" className="hover:text-blue-600 underline">GST Tax Invoice</Link>
          <Link href="/quote/new" className="hover:text-blue-600 underline">Price Quote</Link>
          <Link href="/receipt/new" className="hover:text-blue-600 underline">Payment Receipt</Link>
          <Link href="/proforma-invoice/new" className="hover:text-blue-600 underline">Proforma Invoice</Link>
          <Link href="/templates" className="hover:text-blue-600 underline">Templates Gallery</Link>
        </div>
      </div>
    </div>
  );
}
