import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  File, 
  Receipt, 
  ShoppingCart, 
  Plus, 
  ChevronDown, 
  Home, 
  List,
  LogOut 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <button
              onClick={() => setLocation("/")}
              className="text-xl font-bold text-primary hover:text-primary/80"
            >Invoice Pro</button>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="flex items-center"
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setLocation("/invoices")}
              className="flex items-center"
            >
              <List className="mr-2 h-4 w-4" />
              Invoices
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setLocation("/templates")}
              className="flex items-center"
            >
              <FileText className="mr-2 h-4 w-4" />
              Templates
            </Button>

            {/* Create Document Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="btn-accent">
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setLocation("/invoice/new")}>
                  <FileText className="mr-2 h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">Invoice</div>
                    <div className="text-sm text-gray-500">Bill your clients</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/quote/new")}>
                  <File className="mr-2 h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-medium">Quote</div>
                    <div className="text-sm text-gray-500">Send estimates</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/credit-note/new")}>
                  <Receipt className="mr-2 h-4 w-4 text-red-600" />
                  <div>
                    <div className="font-medium">Credit Note</div>
                    <div className="text-sm text-gray-500">Issue refunds</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/purchase-order/new")}>
                  <ShoppingCart className="mr-2 h-4 w-4 text-purple-600" />
                  <div>
                    <div className="font-medium">Purchase Order</div>
                    <div className="text-sm text-gray-500">Order supplies</div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <span className="text-sm text-gray-700">
                {user?.firstName || user?.email}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = "/api/logout"}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className="md:hidden border-t">
        <div className="px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/invoice/new")}
              className="flex items-center justify-center"
            >
              <FileText className="mr-2 h-4 w-4 text-blue-600" />
              Invoice
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/quote/new")}
              className="flex items-center justify-center"
            >
              <File className="mr-2 h-4 w-4 text-green-600" />
              Quote
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/credit-note/new")}
              className="flex items-center justify-center"
            >
              <Receipt className="mr-2 h-4 w-4 text-red-600" />
              Credit Note
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/purchase-order/new")}
              className="flex items-center justify-center"
            >
              <ShoppingCart className="mr-2 h-4 w-4 text-purple-600" />
              Purchase Order
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}