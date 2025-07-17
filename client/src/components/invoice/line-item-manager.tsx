import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface LineItem {
  id?: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface LineItemManagerProps {
  lineItems: LineItem[];
  onLineItemsChange: (items: LineItem[]) => void;
}

export default function LineItemManager({ lineItems, onLineItemsChange }: LineItemManagerProps) {
  const addLineItem = () => {
    const newItem: LineItem = {
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    onLineItemsChange([...lineItems, newItem]);
  };

  const removeLineItem = (index: number) => {
    const updatedItems = lineItems.filter((_, i) => i !== index);
    onLineItemsChange(updatedItems);
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updatedItems = lineItems.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate amount when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.rate);
        }
        
        return updatedItem;
      }
      return item;
    });
    onLineItemsChange(updatedItems);
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
        <Button
          type="button"
          onClick={addLineItem}
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-900">Description</th>
                <th className="text-right py-3 px-2 font-medium text-gray-900 w-24">Quantity</th>
                <th className="text-right py-3 px-2 font-medium text-gray-900 w-28">Rate ($)</th>
                <th className="text-right py-3 px-2 font-medium text-gray-900 w-32">Amount ($)</th>
                <th className="py-3 px-2 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-2">
                    <Input
                      placeholder="Description of service or product"
                      value={item.description}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      className="border-0 focus:ring-0 p-0"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="border-0 focus:ring-0 p-0 text-right"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      className="border-0 focus:ring-0 p-0 text-right"
                    />
                  </td>
                  <td className="py-3 px-2 text-right font-medium">
                    ${item.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLineItem(index)}
                      className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {lineItems.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeLineItem(index)}
                className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Input
                placeholder="Description of service or product"
                value={item.description}
                onChange={(e) => updateLineItem(index, 'description', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate ($)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.rate}
                  onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm font-medium text-gray-700">Amount:</span>
              <span className="text-lg font-bold text-gray-900">${item.amount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Button (Mobile) */}
      <div className="md:hidden">
        <Button
          type="button"
          onClick={addLineItem}
          variant="outline"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Empty State */}
      {lineItems.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <Plus className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No line items</h3>
          <p className="text-gray-600 mb-4">Add your first line item to get started</p>
          <Button onClick={addLineItem} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add First Item
          </Button>
        </div>
      )}

      {/* Subtotal */}
      {lineItems.length > 0 && (
        <div className="flex justify-end pt-4 border-t">
          <div className="text-right">
            <p className="text-sm text-gray-600">Subtotal:</p>
            <p className="text-xl font-bold text-gray-900">${calculateTotal().toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
