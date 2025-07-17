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
import NotFound from "@/pages/not-found";
import Navigation from "@/components/navigation";
import FloatingActionButton from "@/components/floating-action-button";
import Footer from "@/components/layout/footer";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Always show the authenticated routes in development since we have a mock user
  const showAuthenticatedRoutes = isAuthenticated || (user && user.id === 'dev-user');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch>
          {showAuthenticatedRoutes ? (
            <>
              <Route path="/" component={Home} />
              <Route path="/invoices" component={Invoices} />
              <Route path="/invoice/new" component={InvoiceBuilder} />
              <Route path="/invoice/:id" component={InvoiceBuilder} />
              <Route path="/quote/new" component={QuoteBuilder} />
              <Route path="/quote/:id" component={QuoteBuilder} />
              <Route path="/credit-note/new" component={CreditNoteBuilder} />
              <Route path="/credit-note/:id" component={CreditNoteBuilder} />
              <Route path="/purchase-order/new" component={PurchaseOrderBuilder} />
              <Route path="/purchase-order/:id" component={PurchaseOrderBuilder} />
              <Route path="/templates" component={Templates} />
            </>
          ) : (
            <>
              <Route path="/" component={Landing} />
              <Route path="/templates" component={Templates} />
            </>
          )}
          <Route component={NotFound} />
        </Switch>
      </main>
      {showAuthenticatedRoutes && <FloatingActionButton />}
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
