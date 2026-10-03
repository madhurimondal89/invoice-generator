import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: LucideIcon;
    error?: string;
    containerClassName?: string;
}

const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
    ({ label, icon: Icon, error, className, containerClassName, ...props }, ref) => {
        return (
            <div className={cn("space-y-1.5 w-full", containerClassName)}>
                <Label
                    htmlFor={props.id}
                    className={cn(
                        "text-xs font-semibold uppercase tracking-wider text-gray-500",
                        error && "text-red-500"
                    )}
                >
                    {label} {props.required && <span className="text-red-500">*</span>}
                </Label>
                <div className="relative group w-full">
                    {Icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-200 pointer-events-none">
                            <Icon className="h-4 w-4" />
                        </div>
                    )}
                    <Input
                        ref={ref}
                        className={cn(
                            "h-11 transition-all duration-200 text-sm",
                            Icon ? "pl-9" : "px-3",
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

EnhancedInput.displayName = "EnhancedInput";

export default EnhancedInput;
