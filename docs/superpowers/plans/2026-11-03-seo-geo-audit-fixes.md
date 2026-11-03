# SEO, AEO & GEO Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve all 12 critical, high, and medium issues identified in the SEO/AEO/GEO audit for `invoicegenius.in` to maximize search ranking, crawler citability, and prevent Google manual penalties.

**Architecture:** 
1. Fix metadata, social preview assets, and remove deceptive schema ratings in `client/index.html`.
2. Configure correct crawler directives in `robots.txt` and clean up `sitemap.xml`.
3. Add a server-side route metadata & SEO injection layer (`server/seo.ts`) to serve distinct titles, meta descriptions, and accurate canonical tags per route, plus return proper HTTP 404 for unknown URLs (preventing Soft 404s).
4. Provide semantic fallback HTML inside `#root` in `client/index.html` containing H1 headings, feature summaries, FAQs, and navigation links (`<nav>`) so search crawlers and AI bots reading raw HTML see rich content and internal links before React hydration.
5. Add production Cache-Control headers for hashed assets and static files in `server/vite.ts`.

**Tech Stack:** Express, Node.js, TypeScript, Vite, React, Schema.org JSON-LD

**Spec:** The 12-point audit report for `invoicegenius.in` covering robots.txt, sitemap, duplicate HTML, canonical tags, server content, internal links, soft 404, title/description length, og:image format, and schema ratings.

## Global Constraints

- Do not break existing React/Wouter client-side routing.
- Valid routes must load the interactive SPA seamlessly.
- Invalid URLs must respond with HTTP 404 status code (no soft 404).
- OpenGraph image must be a valid PNG/JPEG image (not SVG).
- Schema.org must be compliant with Google Search Central guidelines (no fake aggregateRating without user-visible reviews).
- Title must be <= 60 characters; Meta description must be <= 160 characters.

## Review Focus

1. *Route with query params or subpaths:* Correct canonical URL generation (`https://invoicegenius.in/path`).
2. *Unknown routes (e.g. `/nonexistent`):* Must return HTTP 404 status code while still displaying a friendly error UI.
3. *Bots without JavaScript:* Must receive meaningful H1, body content, and internal links in raw server response.
4. *Social platforms (WhatsApp, Twitter, LinkedIn):* Must parse a valid PNG `og:image` instead of an SVG.
5. *Build integrity:* `npm run build` must succeed without TypeScript or bundler errors.

---

### Task 1: Fix Title, Meta Description, OpenGraph Image & Schema in `client/index.html`

**Files:**
- Create: `client/public/og-image.png`
- Modify: `client/index.html:1-180`

**Steps:**
- [ ] Generate or place a high-resolution 1200x630 `og-image.png` in `client/public/` representing Invoice Genius branding.
- [ ] Update `<title>` to 58 characters: `Invoice Genius - Free GST Invoice & Receipt Generator`.
- [ ] Update `<meta name="description">` to 155 characters: `Create 100% free GST invoices, quotes, receipts, and purchase orders in seconds. Includes instant UPI QR codes, multi-currency support, and vector PDF export.`.
- [ ] Change `og:image` and `twitter:image` to point to `/og-image.png` (absolute URL `https://invoicegenius.in/og-image.png`).
- [ ] Remove `aggregateRating` (4.9 / 1840) from the WebApplication schema in `client/index.html` to eliminate penalty risk.
- [ ] Verify character lengths of `<title>` (<= 60) and `<meta name="description">` (<= 160).

---

### Task 2: Fix `robots.txt` & Optimize `sitemap.xml`

**Files:**
- Modify: `client/public/robots.txt`
- Modify: `client/public/sitemap.xml`

**Steps:**
- [ ] Add `User-agent: ClaudeBot` with `Allow: /` in `client/public/robots.txt`.
- [ ] Ensure official crawler names are present: `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`.
- [ ] In `client/public/sitemap.xml`, ensure high-priority landing/content pages have appropriate priority (1.0 for `/`, 0.9 for `/templates`, 0.8 for `/invoice/new`, `/about`, `/contact`, etc.) and verified lastmod timestamps.

---

### Task 3: Create Server-Side SEO & Route Metadata Service (`server/seo.ts`)

**Files:**
- Create: `server/seo.ts`

**Steps:**
- [ ] Define route metadata dictionary mapping known paths (`/`, `/templates`, `/about`, `/contact`, `/privacy`, `/terms`, `/invoice/new`, `/tax-invoice/new`, `/proforma-invoice/new`, `/quote/new`, `/receipt/new`, `/purchase-order/new`, `/credit-note/new`) to custom title, description, and canonical URL.
- [ ] Create helper `getRouteSeo(path: string): { title: string; description: string; canonical: string; isNotFound: boolean }`.
- [ ] Create helper `injectSeo(html: string, path: string): { html: string; status: number }` that replaces `<title>`, meta description, `og:title`, `og:description`, and `<link rel="canonical">` with route-specific values.

---

### Task 4: Integrate SEO & Soft 404 Fix into Server Serving (`server/vite.ts`)

**Files:**
- Modify: `server/vite.ts`

**Steps:**
- [ ] In `setupVite` (development), use `injectSeo` to inject route-specific metadata and set status 404 when `isNotFound` is true.
- [ ] In `serveStatic` (production), read `dist/public/index.html`, run `injectSeo`, and return proper HTTP status (200 for recognized routes, 404 for unknown routes).
- [ ] Configure Cache-Control headers in `express.static`:
  - 1 year (`max-age=31536000, immutable`) for hashed assets in `/assets`.
  - 1 day (`max-age=86400`) for static public files (`favicon.svg`, `og-image.png`, `robots.txt`, `sitemap.xml`).
  - `no-cache` for HTML responses so updates propagate immediately.

---

### Task 5: Pre-render Semantic Content & Internal Links in Raw HTML

**Files:**
- Modify: `client/index.html`

**Steps:**
- [ ] Inside `<div id="root">`, add semantic pre-rendered HTML that contains:
  - Header with Logo and `<nav>` containing internal links: `/templates`, `/invoice/new`, `/tax-invoice/new`, `/quote/new`, `/receipt/new`, `/about`, `/contact`.
  - Main H1 tag: `Free Online Invoice & Billing Generator with UPI QR Code`.
  - Summary descriptions of features, tax calculation (CGST, SGST, IGST), and vector PDF export.
  - FAQ list section using standard `<details>` or article format.
- [ ] Verify that React hydration on client mount cleanly overwrites `#root` without visual jitter or React errors.

---

### Task 6: Build and End-to-End Verification

**Files:**
- Test via terminal build and curl/node checks.

**Steps:**
- [ ] Run `npm run build` to confirm TypeScript and client build succeed cleanly.
- [ ] Verify that fetching `/` returns status 200, title "Invoice Genius - Free GST Invoice & Receipt Generator", and canonical `https://invoicegenius.in/`.
- [ ] Verify that fetching `/templates` returns status 200, title containing "Templates", and canonical `https://invoicegenius.in/templates`.
- [ ] Verify that fetching `/invalid-url-xyz` returns HTTP status 404.
- [ ] Confirm `og:image` is PNG and accessible.

