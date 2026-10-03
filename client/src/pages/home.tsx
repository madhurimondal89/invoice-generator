import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, DollarSign, Clock, CheckCircle, File, Receipt, ShoppingCart, Layout, ArrowRight, Sparkles, Zap, Globe, Users, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Animation trigger
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // In development, skip authentication redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated && process.env.NODE_ENV !== 'development') {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ["/api/invoices"],
    enabled: true, // Always enabled for development
  });

  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/templates"],
    enabled: true, // Always enabled for development
  });

  if (isLoading || invoicesLoading || templatesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const invoicesList = Array.isArray(invoices) ? invoices : [];
  const recentInvoices = invoicesList.slice(0, 5);
  const totalInvoices = invoicesList.length;
  const paidInvoices = invoicesList.filter((inv: any) => inv.paymentStatus === 'paid').length;
  const pendingInvoices = invoicesList.filter((inv: any) => inv.paymentStatus === 'pending').length;
  const totalRevenue = invoicesList.reduce((sum: number, inv: any) => sum + parseFloat(inv.total || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="text-center">


            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
              Professional Documents
              <br />
              <span className="text-4xl md:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Made Simple</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Create stunning invoices, quotes, credit notes, and purchase orders with
              <span className="font-semibold text-blue-600"> world-class templates</span> and
              <span className="font-semibold text-purple-600"> lightning-fast generation</span>
            </p>



            {/* Live Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{totalInvoices}+</div>
                <div className="text-sm text-gray-600">Documents Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{Array.isArray(templates) ? templates.length : 13}</div>
                <div className="text-sm text-gray-600">Curated Templates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Document Types - Ultra Modern Cards */}
        <div className="mb-16">
          <div className={`text-center mb-12 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
              Choose Your Document Type
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Professional templates designed for modern businesses. Each document type is carefully crafted
              for maximum impact and seamless workflow integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              // Invoice Group (Blue)
              {
                type: 'invoice',
                icon: FileText,
                title: 'Invoice',
                gradient: 'from-blue-500 to-blue-600',
                bgGradient: 'from-blue-50 to-blue-100',
                description: 'Professional billing documents for completed work or services',
                features: ['Payment requests', 'Due dates', 'Tax calculations'],
                btnText: 'Create Invoice',
                route: '/invoice/new'
              },
              {
                type: 'tax_invoice',
                icon: FileText,
                title: 'Tax Invoice',
                gradient: 'from-blue-500 to-blue-600',
                bgGradient: 'from-blue-50 to-blue-100',
                description: 'Tax-compliant invoices for registered businesses',
                features: ['GST/VAT details', 'Tax breakdown', 'Legal compliance'],
                btnText: 'Create Tax Invoice',
                route: '/tax-invoice/new'
              },
              {
                type: 'proforma_invoice',
                icon: FileText,
                title: 'Proforma Invoice',
                gradient: 'from-blue-500 to-blue-600',
                bgGradient: 'from-blue-50 to-blue-100',
                description: 'Preliminary bill of sale sent to buyers in advance',
                features: ['Draft invoice', 'Customs declaration', 'Pre-payment'],
                btnText: 'Create Proforma',
                route: '/proforma-invoice/new'
              },

              // Estimate Group (Green)
              {
                type: 'quote',
                icon: File,
                title: 'Quote',
                gradient: 'from-green-500 to-green-600',
                bgGradient: 'from-green-50 to-green-100',
                description: 'Fixed price offers for a specific project or order',
                features: ['Price fixing', 'Validity period', 'Terms & conditions'],
                btnText: 'Create Quote',
                route: '/quote/new'
              },
              {
                type: 'estimate',
                icon: File,
                title: 'Estimate',
                gradient: 'from-green-500 to-green-600',
                bgGradient: 'from-green-50 to-green-100',
                description: 'Approximate calculation of costs for a project',
                features: ['Cost approximation', 'Flexible pricing', 'Project scope'],
                btnText: 'Create Estimate',
                route: '/estimate/new'
              },

              // Receipt Group (Emerald)
              {
                type: 'receipt',
                icon: Receipt,
                title: 'Receipt',
                gradient: 'from-emerald-500 to-emerald-600',
                bgGradient: 'from-emerald-50 to-emerald-100',
                description: 'Written acknowledgment of having received payment',
                features: ['Payment proof', 'Date recording', 'Transaction ID'],
                btnText: 'Create Receipt',
                route: '/receipt/new'
              },
              {
                type: 'sales_receipt',
                icon: Receipt,
                title: 'Sales Receipt',
                gradient: 'from-emerald-500 to-emerald-600',
                bgGradient: 'from-emerald-50 to-emerald-100',
                description: 'Record of a sale and payment made at point of sale',
                features: ['Instant payment', 'Itemized list', 'Sales record'],
                btnText: 'Create Sales Receipt',
                route: '/sales-receipt/new'
              },
              {
                type: 'cash_receipt',
                icon: Receipt,
                title: 'Cash Receipt',
                gradient: 'from-emerald-500 to-emerald-600',
                bgGradient: 'from-emerald-50 to-emerald-100',
                description: 'Proof of cash payment received from a customer',
                features: ['Cash tracking', 'Signature line', 'Amount verification'],
                btnText: 'Create Cash Receipt',
                route: '/cash-receipt/new'
              },

              // Credit Group (Red)
              {
                type: 'credit_note',
                icon: Receipt,
                title: 'Credit Note',
                gradient: 'from-red-500 to-red-600',
                bgGradient: 'from-red-50 to-red-100',
                description: 'Document issued to refund or credit a customer',
                features: ['Return processing', 'Billing error fix', 'Account credit'],
                btnText: 'Create Credit Note',
                route: '/credit-note/new'
              },
              {
                type: 'credit_memo',
                icon: Receipt,
                title: 'Credit Memo',
                gradient: 'from-red-500 to-red-600',
                bgGradient: 'from-red-50 to-red-100',
                description: 'Internal document for price adjustments or refunds',
                features: ['Internal record', 'Adjustment tracking', 'Balance update'],
                btnText: 'Create Credit Memo',
                route: '/credit-memo/new'
              },

              // Order Group (Purple/Orange)
              {
                type: 'purchase_order',
                icon: ShoppingCart,
                title: 'Purchase Order',
                gradient: 'from-purple-500 to-purple-600',
                bgGradient: 'from-purple-50 to-purple-100',
                description: 'Commercial document issued by a buyer to a seller',
                features: ['Order placement', 'Agreed prices', 'Delivery terms'],
                btnText: 'Create Purchase Order',
                route: '/purchase-order/new'
              },
              {
                type: 'delivery_note',
                icon: ShoppingCart,
                title: 'Delivery Note',
                gradient: 'from-orange-500 to-orange-600',
                bgGradient: 'from-orange-50 to-orange-100',
                description: 'Document accompanying a shipment of goods',
                features: ['Goods checklist', 'Receiver signature', 'Shipment detail'],
                btnText: 'Create Delivery Note',
                route: '/delivery-note/new'
              }
            ].map((doc, index) => (
              <div
                key={doc.type}
                className={`group cursor-pointer transition-all duration-500 delay-${(index % 4) * 100} transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                onMouseEnter={() => setHoveredCard(doc.type)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setLocation(doc.route)}
              >
                <Card className={`h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white relative overflow-hidden`}>
                  {/* Top Color Bar */}
                  <div className={`h-2 w-full bg-gradient-to-r ${doc.gradient}`}></div>

                  <CardContent className="p-6 flex flex-col h-full relative z-10 pt-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${doc.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <doc.icon className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{doc.title}</h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed flex-grow">{doc.description}</p>

                    <div className="space-y-2 mb-6">
                      {doc.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-500">
                          <div className={`w-1.5 h-1.5 bg-gradient-to-r ${doc.gradient} rounded-full mr-2`}></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Button
                      className={`w-full bg-gradient-to-r ${doc.gradient} hover:shadow-lg text-white border-0 mt-auto`}
                      size="sm"
                    >
                      {doc.btnText}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Features Overview - Modern Glass Design */}
        <div className="mb-16">
          <div className={`bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-12 transition-all duration-1000 delay-600 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-12">
              Why Choose Invoice Genius?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: Zap,
                  title: 'Curated Pro Templates',
                  description: 'Choose from a curated library of professionally designed templates for all document types',
                  gradient: 'from-yellow-500 to-orange-500'
                },
                {
                  icon: Globe,
                  title: 'Global Tax & Currency Support',
                  description: 'Built-in tax calculations, multiple currencies, and international shipping addresses',
                  gradient: 'from-green-500 to-emerald-500'
                },
                {
                  icon: Users,
                  title: 'Team Collaboration',
                  description: 'Share templates, collaborate on documents, and manage client relationships seamlessly',
                  gradient: 'from-blue-500 to-cyan-500'
                }
              ].map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Stats Dashboard */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 transition-all duration-1000 delay-800 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {[
            {
              title: 'Total Documents',
              value: totalInvoices.toString(),
              icon: FileText,
              gradient: 'from-blue-500 to-blue-600',
              bgGradient: 'from-blue-50 to-blue-100',
              trend: '+12%'
            },
            {
              title: 'Total Revenue',
              value: `$${totalRevenue.toFixed(2)}`,
              icon: DollarSign,
              gradient: 'from-green-500 to-green-600',
              bgGradient: 'from-green-50 to-green-100',
              trend: '+18%'
            },
            {
              title: 'Active Documents',
              value: paidInvoices.toString(),
              icon: TrendingUp,
              gradient: 'from-purple-500 to-purple-600',
              bgGradient: 'from-purple-50 to-purple-100',
              trend: '+8%'
            },
            {
              title: 'Templates Available',
              value: `${Array.isArray(templates) ? templates.length : 13}`,
              icon: Layout,
              gradient: 'from-orange-500 to-orange-600',
              bgGradient: 'from-orange-50 to-orange-100',
              trend: 'Curated'
            }
          ].map((stat, index) => (
            <Card key={index} className={`group hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br ${stat.bgGradient} border-0 shadow-md`}>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 bg-gradient-to-r ${stat.gradient} text-white rounded-full`}>
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Document Guide - Modern Glass Card */}
          <Card className="bg-white shadow-md border rounded-2xl overflow-hidden">
            <CardHeader className="bg-gray-50/80 border-b pb-6">
              <CardTitle className="text-xl font-bold text-gray-900">
                Document Types Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  {
                    title: 'Invoice',
                    description: 'Use when requesting payment for completed work or delivered goods',
                    gradient: 'from-blue-500 to-blue-600',
                    bgGradient: 'from-blue-50 to-blue-100'
                  },
                  {
                    title: 'Quote',
                    description: 'Use when providing price estimates for potential projects',
                    gradient: 'from-green-500 to-green-600',
                    bgGradient: 'from-green-50 to-green-100'
                  },
                  {
                    title: 'Credit Note',
                    description: 'Use when issuing refunds, returns, or billing corrections',
                    gradient: 'from-red-500 to-red-600',
                    bgGradient: 'from-red-50 to-red-100'
                  },
                  {
                    title: 'Purchase Order',
                    description: 'Use when ordering goods or services from suppliers',
                    gradient: 'from-purple-500 to-purple-600',
                    bgGradient: 'from-purple-50 to-purple-100'
                  }
                ].map((doc, index) => (
                  <div key={index} className={`p-4 rounded-xl bg-gradient-to-r ${doc.bgGradient} hover:shadow-sm transition-shadow`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-2.5 h-2.5 bg-gradient-to-r ${doc.gradient} rounded-full mt-2 shrink-0`}></div>
                      <div>
                        <h4 className="font-bold text-base text-gray-900 mb-1">{doc.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{doc.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Documents - Modern Design */}
          <Card className="bg-white shadow-md border rounded-2xl overflow-hidden">
            <CardHeader className="bg-gray-50/80 border-b pb-6">
              <CardTitle className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  Recent Documents
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation("/invoices")}
                  className="rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {recentInvoices.length > 0 ? (
                <div className="space-y-4">
                  {recentInvoices.map((invoice: any) => (
                    <div key={invoice.id} className="group flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{invoice.invoiceNumber}</p>
                          <p className="text-gray-600">{invoice.clientName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl text-gray-900">${invoice.total}</p>
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${invoice.paymentStatus === 'paid'
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                          : invoice.paymentStatus === 'pending'
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                            : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                          }`}>
                          {invoice.paymentStatus || 'draft'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No documents yet</h3>
                  <p className="text-gray-600 mb-6">Create your first professional document to get started</p>
                  <Button
                    onClick={() => setLocation("/invoice/new")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <Button
                  onClick={() => setLocation("/invoice/new")}
                  className="flex items-center justify-start p-4 h-auto"
                  variant="outline"
                >
                  <Plus className="mr-3 h-6 w-6" />
                  <div className="text-left">
                    <p className="font-medium">Create New Doc</p>
                    <p className="text-sm text-gray-600">Start with a blank invoice</p>
                  </div>
                </Button>

                <Button
                  onClick={() => setLocation("/templates")}
                  className="flex items-center justify-start p-4 h-auto"
                  variant="outline"
                >
                  <FileText className="mr-3 h-6 w-6" />
                  <div className="text-left">
                    <p className="font-medium">Browse Templates</p>
                    <p className="text-sm text-gray-600">Choose from curated pro designs</p>
                  </div>
                </Button>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Call-to-Action Section */}
        <div className={`text-center py-16 transition-all duration-1000 delay-1200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-50" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
            }}></div>

            <div className="relative z-10">
              <h3 className="text-4xl font-bold text-white mb-4">
                Ready to Create Professional Documents?
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses worldwide who trust Invoice Genius for their document needs
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => setLocation("/invoice/new")}
                  size="lg"
                  className="relative group overflow-hidden bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-blue-100/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                  <Plus className="mr-2 h-5 w-5" />
                  Start Creating Now
                </Button>

                <Button
                  onClick={() => setLocation("/templates")}
                  size="lg"
                  className="bg-white/15 hover:bg-white text-white hover:text-blue-700 border-2 border-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                >
                  <Layout className="mr-2 h-5 w-5" />
                  Explore Templates
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 py-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Create Professional Documents
            </h3>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Choose from our comprehensive suite of business document templates
            </p>
          </div>

          {/* Document Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Invoice */}
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2 text-center">Invoices</h4>
              <p className="text-blue-100 text-center text-sm">Professional billing documents for your clients and customers</p>
            </div>

            {/* Quote */}
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2 text-center">Quotes</h4>
              <p className="text-blue-100 text-center text-sm">Professional estimates and proposals for potential projects</p>
            </div>

            {/* Credit Note */}
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
                <Receipt className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2 text-center">Credit Notes</h4>
              <p className="text-blue-100 text-center text-sm">Professional refunds and billing adjustments for customers</p>
            </div>

            {/* Purchase Order */}
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2 text-center">Purchase Orders</h4>
              <p className="text-blue-100 text-center text-sm">Official requests to suppliers for goods and services</p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center border-t border-white/20 pt-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-2xl font-black tracking-tight text-white">Invoice</span>
              <span className="text-2xl font-black tracking-tight text-blue-400">Genius</span>
            </div>
            <p className="text-blue-100 text-sm">
              © {new Date().getFullYear()} InvoiceGenius. Professional document generation made simple.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
