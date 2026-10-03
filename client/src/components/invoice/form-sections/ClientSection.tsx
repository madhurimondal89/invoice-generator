import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedInput from "@/components/ui/enhanced-input";
import { User, Mail, MapPin, Briefcase, Phone, ShieldCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ClientSectionProps {
    form: UseFormReturn<any>;
    labels: any;
    documentType: string;
}

export default function ClientSection({ form, labels, documentType }: ClientSectionProps) {
    const { register, formState: { errors } } = form;

    const HeaderIcon = documentType === 'purchase_order' ? Briefcase : User;

    return (
        <Card className="border-0 shadow-sm ring-1 ring-gray-200 h-full">
            <CardHeader className="bg-gray-50/50 border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <HeaderIcon className="h-5 w-5 text-blue-600" />
                    {labels.toHeader}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
                <EnhancedInput
                    id="clientName"
                    label={labels.clientLabel}
                    icon={User}
                    placeholder={documentType === 'purchase_order' ? "e.g. Apex Innovations Corp" : "e.g. Client / Customer Name"}
                    {...register("clientName")}
                    error={errors.clientName?.message as string}
                    required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <EnhancedInput
                        id="clientEmail"
                        label="Email Address"
                        icon={Mail}
                        type="email"
                        placeholder="client@company.com"
                        {...register("clientEmail")}
                        error={errors.clientEmail?.message as string}
                        required
                    />

                    <EnhancedInput
                        id="clientPhone"
                        label="Phone (Optional)"
                        icon={Phone}
                        placeholder="+1 (555) 123-4567"
                        {...register("clientPhone")}
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="clientAddress" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Client Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Textarea
                            id="clientAddress"
                            {...register("clientAddress")}
                            placeholder="Street address, City, Country"
                            rows={2}
                            className={`pl-9 resize-none text-sm transition-all bg-gray-50/30 border-gray-200 focus:border-primary focus:ring-primary/20 hover:bg-white ${errors.clientAddress ? "border-red-300 bg-red-50/50" : ""}`}
                        />
                    </div>
                    {errors.clientAddress && (
                        <p className="text-[10px] font-medium text-red-500">
                            {errors.clientAddress.message as string}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
