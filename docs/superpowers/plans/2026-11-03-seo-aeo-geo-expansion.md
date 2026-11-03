# SEO, AEO & GEO Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement comprehensive SEO, AEO, and GEO enhancements: create high-ranking keyword guides (GST Invoice Rules, UPI QR Invoicing, Proforma vs Tax Invoice), add BreadcrumbList schema, add PWA Web App Manifest, embed contextual FAQ accordions and data comparison tables into builder pages, and update sitemaps and llms.txt.

**Architecture:**
1. **Guides System:** Create high-quality, citations-optimized guide pages under `/guides` with rich typography, comparison tables, step-by-step instructions, and Article/FAQ JSON-LD schemas.
2. **BreadcrumbList & Per-page Structured Data:** Inject BreadcrumbList schema on all pages so Google SERP renders rich hierarchy breadcrumbs.
3. **Builder FAQ & AEO Enhancements:** Add accordion FAQs and comparison tables at the bottom of the invoice generator tool screens so crawlers and answer engines (ChatGPT, Perplexity) cite them.
4. **PWA Web App Manifest:** Create `client/public/manifest.json` and link it in `client/index.html` with theme color `#2563eb` and standalone display.
5. **Route SEO & Sitemap Registry:** Update `server/seo.ts`, `server/routes.ts`, `client/public/sitemap.xml`, and `llms.txt` to include the new guides.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide icons, Express, Schema.org JSON-LD

---

### Task 1: PWA Web App Manifest & App Icons

**Files:**
- Create: `client/public/manifest.json`
- Modify: `client/index.html`

**Steps:**
- [ ] Create `client/public/manifest.json` with name "Invoice Genius", short_name "InvoiceGenius", start_url "/", display "standalone", background_color "#0f172a", theme_color "#2563eb", and icons.
- [ ] In `client/index.html`, add `<link rel="manifest" href="/manifest.json" />`.
- [ ] Add `<meta name="mobile-web-app-capable" content="yes" />`.

---

### Task 2: BreadcrumbList Schema & Page Structured Data

**Files:**
- Modify: `server/seo.ts`

**Steps:**
- [ ] Update `injectSeo` in `server/seo.ts` to inject dynamic `BreadcrumbList` schema JSON-LD for each route (e.g. `Home > Templates`, `Home > Tools > GST Tax Invoice Generator`, `Home > Guides > ...`).
- [ ] Verify that Google Rich Results Test valid BreadcrumbList schema is returned.

---

### Task 3: Comprehensive SEO/AEO Guides Hub & Articles

**Files:**
- Create: `client/src/pages/guides/index.tsx` (Guides directory hub)
- Create: `client/src/pages/guides/gst-invoice-rules.tsx` (Complete Indian GST guide with HSN codes & rules)
- Create: `client/src/pages/guides/upi-qr-invoice-guide.tsx` (How UPI QR code payments work on invoices)
- Create: `client/src/pages/guides/proforma-vs-tax-invoice.tsx` (Comparison guide with structured data table)
- Modify: `client/src/App.tsx` (Register new routes)

**Steps:**
- [ ] Build `/guides` hub showcasing all invoicing guides with category badges and reading times.
- [ ] Build `/guides/gst-invoice-format` with HSN/SAC breakdown, CGST/SGST/IGST rules, and mandatory invoice fields.
- [ ] Build `/guides/upi-qr-code-invoice` with step-by-step NPCI UPI payment flow, PhonePe/GPay instructions, and 0% gateway fee benefits.
- [ ] Build `/guides/proforma-vs-tax-invoice` with comparison matrix, legal validity table, and when to use each.
- [ ] Register routes in `client/src/App.tsx` using `React.lazy`.

---

### Task 4: Contextual FAQs & Comparison Data in Invoice Builders

**Files:**
- Create: `client/src/components/invoice/builder-seo-footer.tsx`
- Modify: `client/src/pages/invoice-builder.tsx`

**Steps:**
- [ ] Create `BuilderSeoFooter` component rendering purpose-built FAQ accordions, document definitions, and comparison tables tailored to the active `documentType` (invoice, tax_invoice, proforma_invoice, quote, receipt, purchase_order, credit_note).
- [ ] Mount `BuilderSeoFooter` below the builder form and preview cards in `invoice-builder.tsx`.

---

### Task 5: Update Server SEO Registry, Sitemaps & llms.txt

**Files:**
- Modify: `server/seo.ts`
- Modify: `server/routes.ts`
- Modify: `client/public/sitemap.xml`
- Modify: `client/public/llms.txt`
- Modify: `client/src/components/navigation.tsx`
- Modify: `client/src/components/layout/footer.tsx`

**Steps:**
- [ ] Add all guide paths to `server/seo.ts` with custom titles and meta descriptions.
- [ ] Add guide URLs to `server/routes.ts` dynamic sitemap and `client/public/sitemap.xml`.
- [ ] Update `llms.txt` with guide links so AI models can cite the informational resources.
- [ ] Add "Guides" link to header navigation and footer.

---

### Task 6: Build Verification & Git Push

**Files:**
- Test and build all components.

**Steps:**
- [ ] Run `npm run build` to confirm zero TypeScript or bundler errors.
- [ ] Verify HTTP 200 and schema tags on `/guides`, `/guides/gst-invoice-format`, `/guides/upi-qr-code-invoice`, `/guides/proforma-vs-tax-invoice`.
- [ ] Commit and push changes to GitHub.
