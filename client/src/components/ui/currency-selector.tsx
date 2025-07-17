import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENCIES, type Currency } from "@shared/currencies";

interface CurrencySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function CurrencySelector({
  value,
  onValueChange,
  label = "Currency",
  placeholder = "Select currency...",
  className,
}: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  
  const selectedCurrency = CURRENCIES.find((currency) => currency.code === value);
  
  // Group currencies by region/category for better organization
  const majorCurrencies = CURRENCIES.filter(c => 
    ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'CHF'].includes(c.code)
  );
  
  const otherCurrencies = CURRENCIES.filter(c => 
    !['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'CHF'].includes(c.code)
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCurrency ? (
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm">{selectedCurrency.symbol}</span>
                <span>{selectedCurrency.code}</span>
                <span className="text-muted-foreground">- {selectedCurrency.name}</span>
              </div>
            ) : (
              placeholder
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search currencies..." />
            <CommandList>
              <CommandEmpty>No currency found.</CommandEmpty>
              
              <CommandGroup heading="Major Currencies">
                {majorCurrencies.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    value={`${currency.code} ${currency.name} ${currency.country}`}
                    onSelect={() => {
                      onValueChange(currency.code);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm w-8">{currency.symbol}</span>
                      <span className="font-medium">{currency.code}</span>
                      <span className="text-muted-foreground">{currency.name}</span>
                    </div>
                    {currency.country && (
                      <span className="text-xs text-muted-foreground">{currency.country}</span>
                    )}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === currency.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              
              <CommandGroup heading="All Currencies">
                {otherCurrencies.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    value={`${currency.code} ${currency.name} ${currency.country}`}
                    onSelect={() => {
                      onValueChange(currency.code);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm w-8">{currency.symbol}</span>
                      <span className="font-medium">{currency.code}</span>
                      <span className="text-muted-foreground">{currency.name}</span>
                    </div>
                    {currency.country && (
                      <span className="text-xs text-muted-foreground">{currency.country}</span>
                    )}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === currency.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}