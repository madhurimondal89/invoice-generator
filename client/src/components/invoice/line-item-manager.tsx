import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Package } from "lucide-react";
import { formatCurrency } from "@shared/currencies";

interface LineItem {
  id?: number;
  description: string;
  quantity: number;
  rate: number;
  taxRate?: number;
  taxAmount?: number;
  amount: number;
  hsn?: string;
}

interface LineItemManagerProps {
  lineItems: LineItem[];
  onLineItemsChange: (items: LineItem[]) => void;
  currency?: string;
  hideHeader?: boolean;
}

export { type LineItem };

export default function LineItemManager({
  lineItems,
  onLineItemsChange,
  currency = "USD",
  hideHeader = false
}: LineItemManagerProps) {
  const addLineItem = () => {
    const newItem: LineItem = {
      description: "",
      quantity: 1,
      rate: 0,
      taxRate: 0,
      taxAmount: 0,
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

        // Recalculate amount when quantity, rate, or tax rate changes
        if (field === 'quantity' || field === 'rate' || field === 'taxRate') {
          const qty = Number(updatedItem.quantity) || 0;
          const rate = Number(updatedItem.rate) || 0;
          const taxRate = Number(updatedItem.taxRate) || 0;
          const baseAmount = qty * rate;
          const taxAmount = (baseAmount * taxRate) / 100;
          updatedItem.taxAmount = taxAmount;
          updatedItem.amount = baseAmount + taxAmount;
        }

        return updatedItem;
      }
      return item;
    });
    onLineItemsChange(updatedItems);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.amount || ((item.quantity || 1) * (item.rate || 0))), 0);
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {/* Optional Standalone Header */}
      {!hideHeader && (
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-semibold text-gray-900">Line Items & Products</h3>
            <span className="text-xs text-gray-500 font-medium">({lineItems.length})</span>
          </div>
          <Button
            type="button"
            onClick={addLineItem}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 gap-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Add Item
          </Button>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-2xs">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50/80">
                <th className="py-3 px-4 font-bold text-gray-700 text-xs uppercase tracking-wider">
                  Item Description
                </th>
                <th className="py-3 px-3 font-bold text-gray-700 text-xs uppercase tracking-wider text-center w-24">
                  Qty
                </th>
                <th className="py-3 px-3 font-bold text-gray-700 text-xs uppercase tracking-wider text-right w-32">
                  Rate
                </th>
                <th className="py-3 px-3 font-bold text-gray-700 text-xs uppercase tracking-wider text-center w-24">
                  Tax %
                </th>
                <th className="py-3 px-3 font-bold text-gray-700 text-xs uppercase tracking-wider text-right w-28">
                  Tax
                </th>
                <th className="py-3 px-4 font-bold text-gray-700 text-xs uppercase tracking-wider text-right w-32">
                  Amount
                </th>
                <th className="py-3 px-3 text-center w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {lineItems.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3">
                    <Input
                      placeholder="e.g. Website Development, Consulting Services..."
                      value={item.description}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 h-9 px-3 text-xs w-full font-medium"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <Input
                      type="number"
                      min="0.01"
                      step="any"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 h-9 px-2 text-center text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      value={item.rate}
                      onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 h-9 px-2 text-right text-xs font-mono"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={item.taxRate || 0}
                      onChange={(e) => updateLineItem(index, 'taxRate', parseFloat(e.target.value) || 0)}
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 h-9 px-2 text-center text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-right text-xs font-mono text-gray-600">
                    {formatCurrency(item.taxAmount || 0, currency)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-xs font-bold font-mono text-gray-900">
                    {formatCurrency(item.amount || ((item.quantity || 1) * (item.rate || 0)), currency)}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLineItem(index)}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-lg transition-colors"
                      title="Remove item"
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
      <div className="md:hidden space-y-3">
        {lineItems.map((item, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Item #{index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeLineItem(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0 rounded-lg"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Item Description
              </label>
              <Input
                placeholder="Description of service or product"
                value={item.description}
                onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Quantity
                </label>
                <Input
                  type="number"
                  min="0.01"
                  step="any"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  className="h-9 text-xs text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Rate ({currency})
                </label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={item.rate}
                  onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
                  className="h-9 text-xs text-right font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Tax Rate (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={item.taxRate || 0}
                  onChange={(e) => updateLineItem(index, 'taxRate', parseFloat(e.target.value) || 0)}
                  className="h-9 text-xs text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Item Total
                </label>
                <div className="h-9 px-3 bg-slate-50 border border-gray-200 rounded-lg flex items-center justify-end font-bold font-mono text-xs text-gray-900">
                  {formatCurrency(item.amount || ((item.quantity || 1) * (item.rate || 0)), currency)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer & Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
        <Button
          type="button"
          onClick={addLineItem}
          variant="outline"
          size="sm"
          className="bg-blue-50/50 hover:bg-blue-50 text-blue-700 border-blue-200 h-9 gap-1.5 text-xs font-semibold"
        >
          <Plus className="h-3.5 w-3.5 text-blue-600" /> Add Another Line Item
        </Button>

        <div className="flex items-center justify-end gap-2 text-right">
          <span className="text-xs text-gray-500 font-medium">Subtotal ({lineItems.length} {lineItems.length === 1 ? 'item' : 'items'}):</span>
          <span className="text-base font-black font-mono text-gray-900">
            {formatCurrency(calculateSubtotal(), currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
