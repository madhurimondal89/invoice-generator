import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import InvoiceBuilder from "@/pages/invoice-builder";
import QuoteBuilder from "@/pages/quote-builder";
import CreditNoteBuilder from "@/pages/credit-note-builder";
import PurchaseOrderBuilder from "@/pages/purchase-order-builder";
import Templates from "@/pages/templates";
import Invoices from "@/pages/invoices";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import PrivacyPolicy from "@/pages/privacy";
import TermsOfService from "@/pages/terms";
import NotFound from "@/pages/not-found";
import Navigation from "@/components/navigation";
import FloatingActionButton from "@/components/floating-action-button";
import Footer from "@/components/layout/footer";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const isUserAuthenticated = isAuthenticated || (user && user.id === 'dev-user');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch>
          {/* Home / Landing */}
          <Route path="/" component={isUserAuthenticated ? Home : Landing} />

          {/* Public & Instant Builders (Accessible to all guests & logged-in users) */}
          <Route path="/invoice/new" component={() => <InvoiceBuilder documentType="invoice" />} />
          <Route path="/invoice/:id" component={InvoiceBuilder} />

          <Route path="/tax-invoice/new" component={() => <InvoiceBuilder documentType="tax_invoice" />} />
          <Route path="/tax-invoice/:id" component={InvoiceBuilder} />

          <Route path="/proforma-invoice/new" component={() => <InvoiceBuilder documentType="proforma_invoice" />} />
          <Route path="/proforma-invoice/:id" component={InvoiceBuilder} />

          <Route path="/receipt/new" component={() => <InvoiceBuilder documentType="receipt" />} />
          <Route path="/receipt/:id" component={InvoiceBuilder} />

          <Route path="/sales-receipt/new" component={() => <InvoiceBuilder documentType="sales_receipt" />} />
          <Route path="/sales-receipt/:id" component={InvoiceBuilder} />

          <Route path="/cash-receipt/new" component={() => <InvoiceBuilder documentType="cash_receipt" />} />
          <Route path="/cash-receipt/:id" component={InvoiceBuilder} />

          <Route path="/quote/new" component={QuoteBuilder} />
          <Route path="/quote/:id" component={QuoteBuilder} />

          <Route path="/estimate/new" component={() => <InvoiceBuilder documentType="estimate" />} />
          <Route path="/estimate/:id" component={InvoiceBuilder} />

          <Route path="/credit-note/new" component={CreditNoteBuilder} />
          <Route path="/credit-note/:id" component={CreditNoteBuilder} />

          <Route path="/credit-memo/new" component={() => <InvoiceBuilder documentType="credit_memo" />} />
          <Route path="/credit-memo/:id" component={InvoiceBuilder} />

          <Route path="/purchase-order/new" component={PurchaseOrderBuilder} />
          <Route path="/purchase-order/:id" component={PurchaseOrderBuilder} />

          <Route path="/delivery-note/new" component={() => <InvoiceBuilder documentType="delivery_note" />} />
          <Route path="/delivery-note/:id" component={InvoiceBuilder} />

          {/* Templates Gallery */}
          <Route path="/templates" component={Templates} />

          {/* User Saved Documents Dashboard */}
          <Route path="/invoices" component={Invoices} />

          {/* AdSense & Legal Pages */}
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/terms" component={TermsOfService} />

          <Route component={NotFound} />
        </Switch>
      </main>
      <FloatingActionButton />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
