import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedInput from "@/components/ui/enhanced-input";
import { Building2, Mail, MapPin, Upload, Phone, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CompanySectionProps {
    form: UseFormReturn<any>;
    labels: any;
    logoPreview: string;
    onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CompanySection({ form, labels, logoPreview, onLogoUpload }: CompanySectionProps) {
    const { register, setValue, formState: { errors } } = form;

    const handleRemoveLogo = () => {
        setValue("companyLogo", "");
    };

    return (
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
            <CardHeader className="bg-gray-50/50 border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Building2 className="h-5 w-5 text-primary" />
                    {labels.fromHeader}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                {/* Logo & Company Name Row */}
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                    {/* Logo Box */}
                    <div className="shrink-0">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 block">
                            Business Logo
                        </Label>
                        <div className="flex items-center gap-3">
                            <div className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative group overflow-hidden">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-1.5" />
                                ) : (
                                    <Upload className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Input
                                    id="logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={onLogoUpload}
                                    className="hidden"
                                />
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => document.getElementById("logo")?.click()}
                                        className="h-8 text-xs text-primary border-primary/30 hover:bg-primary/5 gap-1.5"
                                    >
                                        <Upload className="h-3 w-3" />
                                        {logoPreview ? "Change Logo" : "Upload Logo"}
                                    </Button>
                                    {logoPreview && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleRemoveLogo}
                                            className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5"
                                            title="Remove Logo"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-400">
                                    PNG, JPG, SVG or WebP (Max 2MB)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Company Name (Spacious) */}
                    <div className="flex-1 w-full">
                        <EnhancedInput
                            id="companyName"
                            label={labels.companyLabel}
                            icon={Building2}
                            placeholder="e.g. Acme Digital Solutions Pvt Ltd"
                            {...register("companyName")}
                            error={errors.companyName?.message as string}
                            required
                        />
                    </div>
                </div>

                {/* Email and Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <EnhancedInput
                        id="companyEmail"
                        label="Email Address"
                        icon={Mail}
                        type="email"
                        placeholder="billing@yourbusiness.com"
                        {...register("companyEmail")}
                        error={errors.companyEmail?.message as string}
                        required
                    />

                    <EnhancedInput
                        id="companyPhone"
                        label="Phone Number (Optional)"
                        icon={Phone}
                        placeholder="+1 (555) 000-0000"
                        {...register("companyPhone")}
                    />
                </div>

                {/* GSTIN / Tax ID and Business Address */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                    <div className="sm:col-span-1">
                        <EnhancedInput
                            id="companyGst"
                            label="GSTIN / Tax ID (Optional)"
                            icon={ShieldCheck}
                            placeholder="e.g. 27AAAAA0000A1Z5"
                            {...register("companyGst")}
                        />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                        <Label htmlFor="companyAddress" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Business Address <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Textarea
                                id="companyAddress"
                                {...register("companyAddress")}
                                placeholder="Street address, City, State, ZIP code"
                                rows={2}
                                className={`pl-9 resize-none text-sm transition-all bg-gray-50/30 border-gray-200 focus:border-primary focus:ring-primary/20 hover:bg-white ${errors.companyAddress ? "border-red-300 bg-red-50/50" : ""}`}
                            />
                        </div>
                        {errors.companyAddress && (
                            <p className="text-[10px] font-medium text-red-500">
                                {errors.companyAddress.message as string}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
