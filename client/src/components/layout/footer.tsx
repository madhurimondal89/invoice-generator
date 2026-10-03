import { Facebook, Twitter, Linkedin, Instagram, Youtube, FileText, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";

export default function Footer() {
  const [, setLocation] = useLocation();

  return (
    <footer className="bg-gray-950 text-white py-12 border-t border-gray-800">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2.5 mb-4 cursor-pointer" onClick={() => setLocation("/")}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black tracking-tight text-white">Invoice</span>
                <span className="text-2xl font-black tracking-tight text-blue-400">Genius</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-4 leading-relaxed">
              The modern, instant business document generator. Create compliant invoices, quotes, receipts, and purchase orders in seconds with UPI QR code payments.
            </p>
            <div className="flex space-x-3.5">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Document Generators */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">Document Generators</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => setLocation("/invoice/new")}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >Standard Invoices</button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/tax-invoice/new")}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >GST Tax Invoices</button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/quote/new")}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >Price Quotes & Estimates</button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/receipt/new")}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >Payment Receipts</button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/purchase-order/new")}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >Purchase Orders</button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/credit-note/new")}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >Credit Notes & Memos</button>
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
                <button 
                  onClick={() => setLocation("/templates")}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Curated Pro Templates
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/invoices")}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Saved Documents
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/templates")}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  UPI QR Payment Setup
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/templates")}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Multi-Currency Support
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">Company</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button className="text-gray-400 hover:text-white transition-colors text-left">
                  About InvoiceGenius
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors text-left">
                  Contact Support
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors text-left">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>
            © {new Date().getFullYear()} InvoiceGenius. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <button className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button className="hover:text-white transition-colors">
              Terms of Use
            </button>
            <button className="hover:text-white transition-colors">
              Free Invoice Generator
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
