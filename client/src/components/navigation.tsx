import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Receipt,
  Plus,
  ChevronDown,
  Home,
  LayoutGrid,
  Sparkles,
  QrCode,
  LogIn,
  Globe,
  Activity,
  TrendingUp,
  Cpu,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100 no-print">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black tracking-tight text-gray-900">Invoice</span>
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Genius</span>
              </div>
            </button>

            <div className="hidden lg:flex items-center gap-1 pl-4 border-l border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/invoice/new")}
                className="text-xs text-gray-600 hover:text-primary font-medium"
              >
                Instant Invoice
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/tax-invoice/new")}
                className="text-xs text-gray-600 hover:text-primary font-medium"
              >
                GST Invoice
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/quote/new")}
                className="text-xs text-gray-600 hover:text-primary font-medium"
              >
                Quote Maker
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/receipt/new")}
                className="text-xs text-gray-600 hover:text-primary font-medium"
              >
                Receipt
              </Button>

              {/* Web Tools Dropdown (Desktop) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-700 bg-blue-50/70 hover:bg-blue-100/80 font-semibold flex items-center gap-1.5 ml-1 px-2.5 py-1.5 rounded-lg border border-blue-200/50 shadow-2xs transition-all"
                  >
                    <Globe className="h-3.5 w-3.5 text-blue-600" />
                    <span>Web Tools</span>
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72 p-2 rounded-2xl shadow-2xl border border-gray-100 bg-white/95 backdrop-blur-md z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Our Web Tools Network</span>
                    <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded-full">Free Suite</span>
                  </div>
                  
                  <DropdownMenuItem asChild>
                    <a
                      href="https://health-hub.calculatorfree.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-rose-50/80 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Activity className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 group-hover:text-rose-600 flex items-center gap-1">
                            Health Hub
                            <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                          </div>
                          <div className="text-[11px] text-gray-500">BMI, Calorie, Water & Vitals Hub</div>
                        </div>
                      </div>
                    </a>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <a
                      href="https://financialhub.calculatorfree.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-emerald-50/80 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 group-hover:text-emerald-600 flex items-center gap-1">
                            Financial Hub
                            <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                          </div>
                          <div className="text-[11px] text-gray-500">SIP, EMI, GST, Tax & Salary Tools</div>
                        </div>
                      </div>
                    </a>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <a
                      href="https://engineering.calculatorfree.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-blue-50/80 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Cpu className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 group-hover:text-blue-600 flex items-center gap-1">
                            Engg Hub
                            <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                          </div>
                          <div className="text-[11px] text-gray-500">Engineering Formulas & Visualizers</div>
                        </div>
                      </div>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Main Actions */}
          <div className="flex items-center space-x-3">
            {/* Web Tools Dropdown (Tablet & Mobile) */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-700 bg-blue-50/80 hover:bg-blue-100 font-semibold flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200/60"
                  >
                    <Globe className="h-3.5 w-3.5 text-blue-600" />
                    <span className="hidden sm:inline">Web Tools</span>
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 p-2 rounded-2xl shadow-2xl border border-gray-100 bg-white/95 backdrop-blur-md z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Our Web Tools Network</span>
                    <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded-full">Free Suite</span>
                  </div>
                  
                  <DropdownMenuItem asChild>
                    <a
                      href="https://health-hub.calculatorfree.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-rose-50/80 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                          <Activity className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 group-hover:text-rose-600 flex items-center gap-1">
                            Health Hub
                            <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                          </div>
                          <div className="text-[11px] text-gray-500">BMI, Calorie, Water & Vitals Hub</div>
                        </div>
                      </div>
                    </a>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <a
                      href="https://financialhub.calculatorfree.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-emerald-50/80 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 group-hover:text-emerald-600 flex items-center gap-1">
                            Financial Hub
                            <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                          </div>
                          <div className="text-[11px] text-gray-500">SIP, EMI, GST, Tax & Salary Tools</div>
                        </div>
                      </div>
                    </a>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <a
                      href="https://engineering.calculatorfree.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-blue-50/80 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Cpu className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 group-hover:text-blue-600 flex items-center gap-1">
                            Engg Hub
                            <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                          </div>
                          <div className="text-[11px] text-gray-500">Engineering Formulas & Visualizers</div>
                        </div>
                      </div>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/templates")}
              className="hidden sm:flex items-center text-gray-700 hover:text-primary gap-1.5 text-xs font-medium"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Templates
            </Button>

            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/invoices")}
                className="flex items-center text-gray-700 gap-1.5 text-xs font-medium"
              >
                <Home className="h-3.5 w-3.5" />
                My Invoices
              </Button>
            ) : null}

            {/* Create Document Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white text-xs h-9 px-3.5 font-medium shadow-sm gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create Bill</span>
                  <ChevronDown className="h-3 w-3 opacity-80" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl border border-gray-100">
                <div className="px-2 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Invoices & Tax</div>
                <DropdownMenuItem onClick={() => setLocation("/invoice/new")} className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Standard Invoice</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/tax-invoice/new")} className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4 text-indigo-600" />
                  <span>GST Tax Invoice</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/proforma-invoice/new")} className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4 text-slate-600" />
                  <span>Proforma Invoice</span>
                </DropdownMenuItem>

                <div className="px-2 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-2">Quotes & Receipts</div>
                <DropdownMenuItem onClick={() => setLocation("/quote/new")} className="cursor-pointer">
                  <Sparkles className="mr-2 h-4 w-4 text-emerald-600" />
                  <span>Quotation / Estimate</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/receipt/new")} className="cursor-pointer">
                  <Receipt className="mr-2 h-4 w-4 text-sky-600" />
                  <span>Payment Receipt</span>
                </DropdownMenuItem>

                <div className="px-2 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-2">Orders & Credits</div>
                <DropdownMenuItem onClick={() => setLocation("/purchase-order/new")} className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4 text-purple-600" />
                  <span>Purchase Order</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/credit-note/new")} className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4 text-rose-600" />
                  <span>Credit Note</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}