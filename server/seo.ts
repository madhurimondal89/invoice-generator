export interface RouteSeoData {
  title: string;
  description: string;
  canonical: string;
  isNotFound?: boolean;
}

const BASE_URL = "https://invoicegenius.in";

const routesSeoMap: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Invoice Genius - Free GST Invoice & Receipt Generator",
    description:
      "Create 100% free GST invoices, quotes, receipts, and purchase orders in seconds. Includes instant UPI QR codes, multi-currency support, and vector PDF export.",
  },
  "/templates": {
    title: "Curated Invoice Templates Gallery | Invoice Genius",
    description:
      "Browse 13+ professional invoice templates for SaaS, freelancers, agencies, consulting, healthcare, and retail. 100% customizable and free.",
  },
  "/invoice/new": {
    title: "Free Standard Invoice Generator Online | Invoice Genius",
    description:
      "Create professional standard invoices with custom branding, line items, multi-currency support, dynamic UPI QR codes, and instant PDF download.",
  },
  "/tax-invoice/new": {
    title: "Free GST Tax Invoice Generator Online | Invoice Genius",
    description:
      "Generate Indian GST-compliant invoices with GSTIN, HSN/SAC codes, state codes, CGST, SGST, IGST calculations, and vector PDF export.",
  },
  "/proforma-invoice/new": {
    title: "Free Proforma Invoice Generator Online | Invoice Genius",
    description:
      "Create professional proforma invoices for domestic and international client agreements with estimated pricing and payment terms.",
  },
  "/quote/new": {
    title: "Free Price Quote & Estimate Maker | Invoice Genius",
    description:
      "Generate clean price quotations and project cost estimates with itemized services, tax rates, validity periods, and PDF download.",
  },
  "/receipt/new": {
    title: "Free Payment Receipt Maker Online | Invoice Genius",
    description:
      "Generate official payment acknowledgment receipts with transaction IDs, payment methods, and instant WhatsApp or PDF sharing.",
  },
  "/sales-receipt/new": {
    title: "Free Sales Receipt Maker Online | Invoice Genius",
    description:
      "Create clean itemized sales receipts for point-of-sale transactions, retail purchases, and customer order fulfillment.",
  },
  "/cash-receipt/new": {
    title: "Free Cash Voucher & Payment Receipt Maker | Invoice Genius",
    description:
      "Issue printable cash vouchers and payment acknowledgment slips with recipient details and authorization signatures.",
  },
  "/purchase-order/new": {
    title: "Free Purchase Order Generator Online | Invoice Genius",
    description:
      "Draft official procurement purchase orders with vendor contacts, shipping terms, delivery schedules, and payment terms.",
  },
  "/credit-note/new": {
    title: "Free Credit Note & Memo Generator | Invoice Genius",
    description:
      "Issue accounting credit notes and credit memos for sales returns, invoice discounts, pricing adjustments, and corrections.",
  },
  "/about": {
    title: "About Invoice Genius - Free Billing & Invoicing Platform",
    description:
      "Learn about Invoice Genius, our mission to provide free, watermark-free invoicing tools with UPI payments for freelancers and businesses.",
  },
  "/contact": {
    title: "Contact & Support | Invoice Genius",
    description:
      "Get in touch with the Invoice Genius team for customer support, feature requests, feedback, or business inquiries.",
  },
  "/privacy": {
    title: "Privacy Policy | Invoice Genius",
    description:
      "Review the privacy practices, data handling, GDPR, and cookie policies for Invoice Genius.",
  },
  "/terms": {
    title: "Terms of Service | Invoice Genius",
    description:
      "Read the terms of service and acceptable use conditions for using Invoice Genius billing and invoice generators.",
  },
  "/invoices": {
    title: "My Invoices & Documents Dashboard | Invoice Genius",
    description:
      "Manage, preview, and export your saved invoices, quotations, receipts, and purchase orders.",
  },
};

export function getRouteSeo(rawPath: string): RouteSeoData {
  // Normalize path by stripping trailing slash (except root) and query params
  const cleanPath = rawPath.split("?")[0].replace(/\/$/, "") || "/";

  // Check known static routes
  if (routesSeoMap[cleanPath]) {
    return {
      title: routesSeoMap[cleanPath].title,
      description: routesSeoMap[cleanPath].description,
      canonical: `${BASE_URL}${cleanPath === "/" ? "/" : cleanPath}`,
      isNotFound: false,
    };
  }

  // Dynamic builder edit routes: e.g. /invoice/:id, /quote/:id, etc.
  const dynamicPattern = /^\/(invoice|tax-invoice|proforma-invoice|quote|receipt|sales-receipt|cash-receipt|purchase-order|credit-note)\/([a-zA-Z0-9_-]+)$/;
  const match = cleanPath.match(dynamicPattern);
  if (match) {
    const docType = match[1].replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: `Edit ${docType} | Invoice Genius`,
      description: `Edit, preview, and download your ${docType} document with Invoice Genius.`,
      canonical: `${BASE_URL}${cleanPath}`,
      isNotFound: false,
    };
  }

  // Unknown route -> 404
  return {
    title: "Page Not Found | Invoice Genius",
    description: "The page you are looking for does not exist on Invoice Genius.",
    canonical: `${BASE_URL}/404`,
    isNotFound: true,
  };
}

export function injectSeo(html: string, rawPath: string): { html: string; status: number } {
  const seo = getRouteSeo(rawPath);

  let updated = html;

  // Replace <title>...</title>
  updated = updated.replace(
    /<title>.*?<\/title>/i,
    `<title>${seo.title}</title>`,
  );

  // Replace <meta name="title" ...>
  updated = updated.replace(
    /<meta\s+name="title"\s+content=".*?"\s*\/?>/i,
    `<meta name="title" content="${seo.title}" />`,
  );

  // Replace <meta name="description" ...>
  updated = updated.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${seo.description}" />`,
  );

  // Replace <link rel="canonical" ...>
  updated = updated.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${seo.canonical}" />`,
  );

  // Replace og:title
  updated = updated.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${seo.title}" />`,
  );

  // Replace og:description
  updated = updated.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${seo.description}" />`,
  );

  // Replace og:url
  updated = updated.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${seo.canonical}" />`,
  );

  // Replace twitter:title
  updated = updated.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${seo.title}" />`,
  );

  // Replace twitter:description
  updated = updated.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${seo.description}" />`,
  );

  // Replace twitter:url
  updated = updated.replace(
    /<meta\s+name="twitter:url"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:url" content="${seo.canonical}" />`,
  );

  return {
    html: updated,
    status: seo.isNotFound ? 404 : 200,
  };
}

