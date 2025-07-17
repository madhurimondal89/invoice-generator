import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, File, Receipt, ShoppingCart, Plus, X } from "lucide-react";

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();

  const actions = [
    {
      icon: FileText,
      label: "Invoice",
      color: "text-blue-600",
      bg: "bg-blue-50 hover:bg-blue-100",
      action: () => setLocation("/invoice/new")
    },
    {
      icon: File,
      label: "Quote",
      color: "text-green-600",
      bg: "bg-green-50 hover:bg-green-100",
      action: () => setLocation("/quote/new")
    },
    {
      icon: Receipt,
      label: "Credit Note",
      color: "text-red-600",
      bg: "bg-red-50 hover:bg-red-100",
      action: () => setLocation("/credit-note/new")
    },
    {
      icon: ShoppingCart,
      label: "Purchase Order",
      color: "text-purple-600",
      bg: "bg-purple-50 hover:bg-purple-100",
      action: () => setLocation("/purchase-order/new")
    }
  ];

  const handleActionClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      {/* Action buttons */}
      {isOpen && (
        <div className="mb-4 space-y-2">
          {actions.map((action, index) => (
            <div
              key={index}
              className="flex items-center justify-end space-x-2 animate-in slide-in-from-bottom-1 duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card className="shadow-lg">
                <CardContent className="p-2">
                  <span className="text-sm font-medium text-gray-700">
                    {action.label}
                  </span>
                </CardContent>
              </Card>
              <Button
                size="sm"
                variant="outline"
                className={`h-12 w-12 rounded-full shadow-lg ${action.bg} border-0`}
                onClick={() => handleActionClick(action.action)}
              >
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg btn-accent"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}