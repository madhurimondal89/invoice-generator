import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();

  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  const handleSignOut = () => {
    window.location.href = "/api/logout";
  };

  const handleCreateInvoice = () => {
    if (isAuthenticated) {
      setLocation("/invoice/new");
    } else {
      window.location.href = "/api/login";
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-nav">
          <div className="logo">
            <button onClick={() => setLocation("/")} className="flex items-center">
              <span className="logo-text">invoice</span>
              <span className="logo-accent">home</span>
            </button>
          </div>

          <nav className="nav-links">
            <button
              onClick={() => setLocation("/templates")}
              className="nav-link"
            >
              Templates
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setLocation("/invoices")}
                className="nav-link"
              >
                My Invoices
              </button>
            )}
            <button className="nav-link">Features</button>
            <button className="nav-link">Support</button>
          </nav>

          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-4">

                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="sm"
                  >
                    Sign Out
                  </Button>
                </div>
                <Button
                  onClick={handleCreateInvoice}
                  className="btn-accent"
                  size="sm"
                >
                  Create Invoice
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleSignIn}
                  variant="ghost"
                  size="sm"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleCreateInvoice}
                  className="btn-accent"
                  size="sm"
                >
                  Create Invoice
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <button
              onClick={() => {
                setLocation("/templates");
                setIsMobileMenuOpen(false);
              }}
              className="block text-gray-700 hover:text-primary"
            >
              Templates
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  setLocation("/invoices");
                  setIsMobileMenuOpen(false);
                }}
                className="block text-gray-700 hover:text-primary"
              >
                My Invoices
              </button>
            )}
            <button className="block text-gray-700 hover:text-primary">
              Features
            </button>
            <button className="block text-gray-700 hover:text-primary">
              Support
            </button>
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="block text-gray-700 hover:text-primary"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="block text-gray-700 hover:text-primary"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
