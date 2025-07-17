import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES } from "@shared/currencies";

interface SimpleCurrencySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function SimpleCurrencySelector({
  value,
  onValueChange,
  label = "Currency",
  placeholder = "Select currency...",
  className,
}: SimpleCurrencySelectorProps) {
  // Group currencies by major and others
  const majorCurrencies = CURRENCIES.filter(c => 
    ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'CHF'].includes(c.code)
  );
  
  const otherCurrencies = CURRENCIES.filter(c => 
    !['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'CHF'].includes(c.code)
  );

  const selectedCurrency = CURRENCIES.find((currency) => currency.code === value);

  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder}>
            {selectedCurrency ? (
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm">{selectedCurrency.symbol}</span>
                <span>{selectedCurrency.code}</span>
                <span className="text-muted-foreground">- {selectedCurrency.name}</span>
              </div>
            ) : (
              placeholder
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {/* Major Currencies */}
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Major Currencies</div>
          {majorCurrencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center space-x-3 w-full">
                <span className="font-mono text-sm w-8">{currency.symbol}</span>
                <span className="font-medium">{currency.code}</span>
                <span className="text-muted-foreground">{currency.name}</span>
              </div>
            </SelectItem>
          ))}
          
          {/* Other Currencies */}
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">All Currencies</div>
          {otherCurrencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center space-x-3 w-full">
                <span className="font-mono text-sm w-8">{currency.symbol}</span>
                <span className="font-medium">{currency.code}</span>
                <span className="text-muted-foreground">{currency.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}