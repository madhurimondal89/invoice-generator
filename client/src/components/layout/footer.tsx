import { Facebook, Twitter, Linkedin, Instagram, Youtube, FileText, ExternalLink } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Footer() {
  const [, setLocation] = useLocation();

  return (
    <footer className="bg-gray-950 text-white py-12 border-t border-gray-800">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2.5 mb-4 hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black tracking-tight text-white">Invoice</span>
                <span className="text-2xl font-black tracking-tight text-blue-400">Genius</span>
              </div>
            </Link>
            <p className="text-gray-400 text-xs mb-4 leading-relaxed">
              The modern, instant business document generator. Create compliant invoices, quotes, receipts, and purchase orders in seconds with UPI QR code payments.
            </p>
            <div className="flex space-x-3.5">
              <a
                href="https://twitter.com/intent/tweet?text=Create%20free%20professional%20invoices%20with%20InvoiceGenius&url=https://invoicegenius.in"
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Twitter"
                aria-label="Share on Twitter"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/sharing/share-offsite/?url=https://invoicegenius.in"
                target="_blank"
                rel="noopener noreferrer"
                title="Share on LinkedIn"
                aria-label="Share on LinkedIn"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https://invoicegenius.in"
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Facebook"
                aria-label="Share on Facebook"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="mailto:madhurimondal89@gmail.com"
                title="Email Support (madhurimondal89@gmail.com)"
                aria-label="Email Support"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <button
                onClick={() => setLocation("/contact")}
                title="Support Desk"
                aria-label="Support Desk"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Document Generators */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">Document Generators</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link 
                  href="/invoice/new"
                  className="text-gray-400 hover:text-white transition-colors block text-left"
                >Standard Invoices</Link>
              </li>
              <li>
                <Link 
                  href="/tax-invoice/new"
                  className="text-gray-400 hover:text-white transition-colors block text-left"
                >GST Tax Invoices</Link>
              </li>
              <li>
                <Link 
                  href="/quote/new"
                  className="text-gray-400 hover:text-white transition-colors block text-left"
                >Price Quotes & Estimates</Link>
              </li>
              <li>
                <Link 
                  href="/receipt/new"
                  className="text-gray-400 hover:text-white transition-colors block text-left"
                >Payment Receipts</Link>
              </li>
              <li>
                <Link 
                  href="/purchase-order/new"
                  className="text-gray-400 hover:text-white transition-colors block text-left"
                >Purchase Orders</Link>
              </li>
              <li>
                <Link 
                  href="/credit-note/new"
                  className="text-gray-400 hover:text-white transition-colors block text-left"
                >Credit Notes & Memos</Link>
              </li>
            </ul>
          </div>

          {/* Free Web Tools (Requested by User) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4 flex items-center gap-1.5">
              <span>Free Web Tools</span>
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="https://snowdaycalculatorfree.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Snow Day Calculator</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://imagecompress.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Image Tools</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://mytempmails.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Temp Mail</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://freeyoutubetools.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>YouTube Tools</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://rannabanna.co.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Bengali Recipes</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://health-hub.calculatorfree.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Health Hub</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://financialhub.calculatorfree.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Financial Hub</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://engineering.calculatorfree.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Engineering Hub</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Templates & Features */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">Templates & Features</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link 
                  href="/templates"
                  className="text-gray-400 hover:text-white transition-colors block text-left"
                >
                  Curated Pro Templates
                </Link>
              </li>
              <li>
                <Link 
                  href="/invoices"
                  className="text-gray-400 hover:text-white transition-colors block text-left"
                >
                  Saved Documents
                </Link>
              </li>
              <li>
                <Link 
                  href="/tax-invoice/new"
                  className="text-gray-400 hover:text-white transition-colors block text-left"
                >
                  UPI QR Payment Setup
                </Link>
              </li>
              <li>
                <Link 
                  href="/templates"
                  className="text-gray-400 hover:text-white transition-colors block text-left"
                >
                  Multi-Currency Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">Company</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link 
                  href="/guides"
                  className="text-gray-400 hover:text-white transition-colors block text-left"
                >
                  Invoicing Guides &amp; GST
                </Link>
              </li>
              <li>
                <Link 
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors block text-left"
                >
                  About InvoiceGenius
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors block text-left"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors block text-left"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors block text-left"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>
            © {new Date().getFullYear()} InvoiceGenius. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link 
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms"
              className="hover:text-white transition-colors"
            >
              Terms of Use
            </Link>
            <Link 
              href="/invoice/new"
              className="hover:text-white transition-colors"
            >
              Free Invoice Generator
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
