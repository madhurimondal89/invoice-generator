export interface RouteSeoData {
  title: string;
  description: string;
  canonical: string;
  isNotFound?: boolean;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

const BASE_URL = "https://invoicegenius.in";

const routesSeoMap: Record<
  string,
  {
    title: string;
    description: string;
    breadcrumbs?: Array<{ name: string; url: string }>;
  }
> = {
  "/": {
    title: "Invoice Genius - Free GST Invoice & Receipt Generator",
    description:
      "Create 100% free GST invoices, quotes, receipts, and purchase orders in seconds. Includes instant UPI QR codes, multi-currency support, and vector PDF export.",
    breadcrumbs: [{ name: "Home", url: `${BASE_URL}/` }],
  },
  "/templates": {
    title: "Curated Invoice Templates Gallery | Invoice Genius",
    description:
      "Browse 13+ professional invoice templates for SaaS, freelancers, agencies, consulting, healthcare, and retail. 100% customizable and free.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Templates", url: `${BASE_URL}/templates` },
    ],
  },
  "/invoice/new": {
    title: "Free Standard Invoice Generator Online | Invoice Genius",
    description:
      "Create professional standard invoices with custom branding, line items, multi-currency support, dynamic UPI QR codes, and instant PDF download.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Tools", url: `${BASE_URL}/templates` },
      { name: "Standard Invoice", url: `${BASE_URL}/invoice/new` },
    ],
  },
  "/tax-invoice/new": {
    title: "Free GST Tax Invoice Generator Online | Invoice Genius",
    description:
      "Generate Indian GST-compliant invoices with GSTIN, HSN/SAC codes, state codes, CGST, SGST, IGST calculations, and vector PDF export.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Tools", url: `${BASE_URL}/templates` },
      { name: "GST Tax Invoice", url: `${BASE_URL}/tax-invoice/new` },
    ],
  },
  "/proforma-invoice/new": {
    title: "Free Proforma Invoice Generator Online | Invoice Genius",
    description:
      "Create professional proforma invoices for domestic and international client agreements with estimated pricing and payment terms.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Tools", url: `${BASE_URL}/templates` },
      { name: "Proforma Invoice", url: `${BASE_URL}/proforma-invoice/new` },
    ],
  },
  "/quote/new": {
    title: "Free Price Quote & Estimate Maker | Invoice Genius",
    description:
      "Generate clean price quotations and project cost estimates with itemized services, tax rates, validity periods, and PDF download.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Tools", url: `${BASE_URL}/templates` },
      { name: "Quote Maker", url: `${BASE_URL}/quote/new` },
    ],
  },
  "/receipt/new": {
    title: "Free Payment Receipt Maker Online | Invoice Genius",
    description:
      "Generate official payment acknowledgment receipts with transaction IDs, payment methods, and instant WhatsApp or PDF sharing.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Tools", url: `${BASE_URL}/templates` },
      { name: "Payment Receipt", url: `${BASE_URL}/receipt/new` },
    ],
  },
  "/sales-receipt/new": {
    title: "Free Sales Receipt Maker Online | Invoice Genius",
    description:
      "Create clean itemized sales receipts for point-of-sale transactions, retail purchases, and customer order fulfillment.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Tools", url: `${BASE_URL}/templates` },
      { name: "Sales Receipt", url: `${BASE_URL}/sales-receipt/new` },
    ],
  },
  "/cash-receipt/new": {
    title: "Free Cash Voucher & Payment Receipt Maker | Invoice Genius",
    description:
      "Issue printable cash vouchers and payment acknowledgment slips with recipient details and authorization signatures.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Tools", url: `${BASE_URL}/templates` },
      { name: "Cash Receipt", url: `${BASE_URL}/cash-receipt/new` },
    ],
  },
  "/purchase-order/new": {
    title: "Free Purchase Order Generator Online | Invoice Genius",
    description:
      "Draft official procurement purchase orders with vendor contacts, shipping terms, delivery schedules, and payment terms.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Tools", url: `${BASE_URL}/templates` },
      { name: "Purchase Order", url: `${BASE_URL}/purchase-order/new` },
    ],
  },
  "/credit-note/new": {
    title: "Free Credit Note & Memo Generator | Invoice Genius",
    description:
      "Issue accounting credit notes and credit memos for sales returns, invoice discounts, pricing adjustments, and corrections.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Tools", url: `${BASE_URL}/templates` },
      { name: "Credit Note", url: `${BASE_URL}/credit-note/new` },
    ],
  },
  "/about": {
    title: "About Invoice Genius - Free Billing & Invoicing Platform",
    description:
      "Learn about Invoice Genius, our mission to provide free, watermark-free invoicing tools with UPI payments for freelancers and businesses.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "About Us", url: `${BASE_URL}/about` },
    ],
  },
  "/contact": {
    title: "Contact & Support | Invoice Genius",
    description:
      "Get in touch with the Invoice Genius team for customer support, feature requests, feedback, or business inquiries.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Contact", url: `${BASE_URL}/contact` },
    ],
  },
  "/privacy": {
    title: "Privacy Policy | Invoice Genius",
    description:
      "Review the privacy practices, data handling, GDPR, and cookie policies for Invoice Genius.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Privacy Policy", url: `${BASE_URL}/privacy` },
    ],
  },
  "/terms": {
    title: "Terms of Service | Invoice Genius",
    description:
      "Read the terms of service and acceptable use conditions for using Invoice Genius billing and invoice generators.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Terms of Service", url: `${BASE_URL}/terms` },
    ],
  },
  "/invoices": {
    title: "My Invoices & Documents Dashboard | Invoice Genius",
    description:
      "Manage, preview, and export your saved invoices, quotations, receipts, and purchase orders.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "My Invoices", url: `${BASE_URL}/invoices` },
    ],
  },
  "/guides": {
    title: "Invoicing Guides, GST Compliance & Financial Resources | Invoice Genius",
    description:
      "Practical, in-depth guides for freelancers and business owners on Indian GST rules, HSN codes, UPI QR payments, and invoicing best practices.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Guides", url: `${BASE_URL}/guides` },
    ],
  },
  "/guides/gst-invoice-format": {
    title: "Indian GST Invoice Rules, Formats & HSN Guide | Invoice Genius",
    description:
      "Complete guide to Indian GST invoice formats, mandatory GSTIN fields, HSN/SAC codes, CGST, SGST, IGST tax calculation rules, and free generator.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Guides", url: `${BASE_URL}/guides` },
      { name: "GST Invoice Guide", url: `${BASE_URL}/guides/gst-invoice-format` },
    ],
  },
  "/guides/upi-qr-code-invoice": {
    title: "How to Add Dynamic UPI QR Code to Invoices (0% Fees) | Invoice Genius",
    description:
      "Learn how to add scannable GPay, PhonePe, and Paytm UPI QR codes directly onto your PDF invoices for instant bank settlement with zero transaction fees.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Guides", url: `${BASE_URL}/guides` },
      { name: "UPI QR Invoicing", url: `${BASE_URL}/guides/upi-qr-code-invoice` },
    ],
  },
  "/guides/proforma-vs-tax-invoice": {
    title: "Proforma Invoice vs Tax Invoice vs Quotation: Differences | Invoice Genius",
    description:
      "Comprehensive comparison matrix between Proforma Invoices, Tax Invoices, and Quotations. Learn when to issue each document legally.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Guides", url: `${BASE_URL}/guides` },
      { name: "Proforma vs Tax Invoice", url: `${BASE_URL}/guides/proforma-vs-tax-invoice` },
    ],
  },
  "/guides/freelance-invoice-guide": {
    title: "Freelance Invoicing Guide: Templates, Payment Terms & Tips | Invoice Genius",
    description:
      "Essential invoicing guide for Indian and global freelancers. Learn how to draft payment terms, prevent late payments, and bill international clients.",
    breadcrumbs: [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Guides", url: `${BASE_URL}/guides` },
      { name: "Freelance Invoicing", url: `${BASE_URL}/guides/freelance-invoice-guide` },
    ],
  },
};

export function getRouteSeo(rawPath: string): RouteSeoData {
  const cleanPath = rawPath.split("?")[0].replace(/\/$/, "") || "/";

  if (routesSeoMap[cleanPath]) {
    return {
      title: routesSeoMap[cleanPath].title,
      description: routesSeoMap[cleanPath].description,
      canonical: `${BASE_URL}${cleanPath === "/" ? "/" : cleanPath}`,
      breadcrumbs: routesSeoMap[cleanPath].breadcrumbs,
      isNotFound: false,
    };
  }

  const dynamicPattern = /^\/(invoice|tax-invoice|proforma-invoice|quote|receipt|sales-receipt|cash-receipt|purchase-order|credit-note)\/([a-zA-Z0-9_-]+)$/;
  const match = cleanPath.match(dynamicPattern);
  if (match) {
    const docType = match[1].replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: `Edit ${docType} | Invoice Genius`,
      description: `Edit, preview, and download your ${docType} document with Invoice Genius.`,
      canonical: `${BASE_URL}${cleanPath}`,
      breadcrumbs: [
        { name: "Home", url: `${BASE_URL}/` },
        { name: "Tools", url: `${BASE_URL}/templates` },
        { name: docType, url: `${BASE_URL}${cleanPath}` },
      ],
      isNotFound: false,
    };
  }

  return {
    title: "Page Not Found | Invoice Genius",
    description: "The page you are looking for does not exist on Invoice Genius.",
    canonical: `${BASE_URL}/404`,
    isNotFound: true,
  };
}

function generateBreadcrumbSchema(breadcrumbs?: Array<{ name: string; url: string }>): string {
  if (!breadcrumbs || breadcrumbs.length <= 1) return "";

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": crumb.name,
      "item": crumb.url,
    })),
  };

  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

export function injectSeo(html: string, rawPath: string): { html: string; status: number } {
  const seo = getRouteSeo(rawPath);

  let updated = html;

  updated = updated.replace(/<title>.*?<\/title>/i, `<title>${seo.title}</title>`);
  updated = updated.replace(/<meta\s+name="title"\s+content=".*?"\s*\/?>/i, `<meta name="title" content="${seo.title}" />`);
  updated = updated.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${seo.description}" />`);
  updated = updated.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${seo.canonical}" />`);
  updated = updated.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${seo.title}" />`);
  updated = updated.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${seo.description}" />`);
  updated = updated.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${seo.canonical}" />`);
  updated = updated.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${seo.title}" />`);
  updated = updated.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${seo.description}" />`);
  updated = updated.replace(/<meta\s+name="twitter:url"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:url" content="${seo.canonical}" />`);

  // Inject BreadcrumbList JSON-LD right before </head>
  const breadcrumbTag = generateBreadcrumbSchema(seo.breadcrumbs);
  if (breadcrumbTag) {
    updated = updated.replace("</head>", `${breadcrumbTag}\n  </head>`);
  }

  return {
    html: updated,
    status: seo.isNotFound ? 404 : 200,
  };
}
