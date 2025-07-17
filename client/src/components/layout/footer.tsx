import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import { useLocation } from "wouter";

export default function Footer() {
  const [, setLocation] = useLocation();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-primary">invoice</span>
              <span className="text-2xl font-bold text-white px-2 py-1 rounded ml-1 bg-[#5b33c6]">Pro</span>
            </div>
            <p className="text-gray-300 mb-4">
              The world's most popular free invoice generator. Create professional invoices in minutes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setLocation("/templates")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Invoice Templates
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors">Quotes</button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors">Credit Notes</button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors">Purchese Orders</button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors">
                  Invoice Examples
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors">
                  Free Logos
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 InvoiceHome Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button className="text-gray-400 hover:text-white text-sm">
              Privacy
            </button>
            <button className="text-gray-400 hover:text-white text-sm">
              Terms
            </button>
            <button className="text-gray-400 hover:text-white text-sm">
              Sitemap
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
