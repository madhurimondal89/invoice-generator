import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    currencySymbol?: string;
    onValueChange?: (value: number) => void;
    error?: string;
    containerClassName?: string;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ label, currencySymbol = "$", onValueChange, error, className, containerClassName, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && onValueChange) {
                onValueChange(value);
            }
            if (props.onChange) {
                props.onChange(e);
            }
        };

        return (
            <div className={cn("space-y-2", containerClassName)}>
                <Label
                    htmlFor={props.id}
                    className={cn(
                        "text-xs font-medium uppercase tracking-wider text-gray-500",
                        error && "text-red-500"
                    )}
                >
                    {label} {props.required && <span className="text-red-500">*</span>}
                </Label>
                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium group-focus-within:text-primary transition-colors duration-200 pointer-events-none">
                        {currencySymbol}
                    </div>
                    <Input
                        ref={ref}
                        type="number"
                        step="0.01"
                        onChange={handleChange}
                        className={cn(
                            "h-11 pl-8 transition-all duration-200 font-mono",
                            error
                                ? "border-red-300 focus-visible:ring-red-200 bg-red-50/50"
                                : "border-gray-200 bg-gray-50/30 focus-visible:border-primary focus-visible:ring-primary/20",
                            "hover:border-gray-300 hover:bg-white",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-[10px] font-medium text-red-500 animate-in slide-in-from-top-1 fade-in">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

CurrencyInput.displayName = "CurrencyInput";

export default CurrencyInput;
