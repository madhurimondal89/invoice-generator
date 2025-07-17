import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import InvoiceBuilder from "@/pages/invoice-builder";
import Templates from "@/pages/templates";
import Invoices from "@/pages/invoices";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function Router() {
  const { isAuthenticated, isLoading, error } = useAuth();

  // Show loading only for a short period, then show unauthenticated state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          {!isAuthenticated ? (
            <>
              <Route path="/" component={Landing} />
              <Route path="/templates" component={Templates} />
            </>
          ) : (
            <>
              <Route path="/" component={Home} />
              <Route path="/invoices" component={Invoices} />
              <Route path="/invoice/new" component={InvoiceBuilder} />
              <Route path="/invoice/:id" component={InvoiceBuilder} />
              <Route path="/templates" component={Templates} />
            </>
          )}
          <Route component={NotFound} />
        </Switch>
      </main>
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
