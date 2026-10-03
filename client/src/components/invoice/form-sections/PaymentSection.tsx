import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Scale,
  QrCode,
  Building,
  FileCheck,
  Upload,
  Trash2,
  Image as ImageIcon,
  Globe,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Sparkles,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface PaymentSectionProps {
  form: UseFormReturn<any>;
}

export default function PaymentSection({ form }: PaymentSectionProps) {
  const { register, watch, setValue } = form;
  const includePaymentDetails = watch("includePaymentDetails") ?? true;
  const upiId = watch("upiId");
  const paymentQrImage = watch("paymentQrImage");
  const paymentLink = watch("paymentLink");

  const [activeTab, setActiveTab] = useState<"upi" | "bank" | "online">("upi");
  const [qrMode, setQrMode] = useState<"id" | "upload">(paymentQrImage ? "upload" : "id");

  const handleQrImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const qrUrl = e.target?.result as string;
        setValue("paymentQrImage", qrUrl, { shouldDirty: true, shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveQrImage = () => {
    setValue("paymentQrImage", "", { shouldDirty: true, shouldValidate: true });
  };

  const termsPresets = [
    { label: "Due on Receipt", text: "Payment is due immediately upon receipt of this invoice." },
    { label: "Net 7 Days", text: "Payment is due within 7 calendar days from the invoice issue date." },
    { label: "Net 15 Days", text: "Payment is due within 15 calendar days from the invoice issue date." },
    { label: "Net 30 Days", text: "Payment is due within 30 days. 1.5% late fee per month on overdue invoices." },
    { label: "50% Advance", text: "50% advance payment required prior to work, remaining 50% upon delivery." }
  ];

  return (
    <Card className="border-0 shadow-sm ring-1 ring-gray-200 overflow-hidden">
      <CardHeader className="bg-gray-50/50 border-b pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-lg font-semibold text-gray-900">
              Payment Details & Terms
            </CardTitle>
          </div>

          {/* Master Show/Hide Toggle */}
          <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs">
            <Label
              htmlFor="includePaymentDetails"
              className="text-xs font-semibold text-gray-700 cursor-pointer flex items-center gap-1.5"
            >
              {includePaymentDetails ? (
                <>
                  <Eye className="h-3.5 w-3.5 text-emerald-600" />
                  Show on Document
                </>
              ) : (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-gray-400" />
                  Hidden on Document
                </>
              )}
            </Label>
            <Switch
              id="includePaymentDetails"
              checked={includePaymentDetails}
              onCheckedChange={(checked) => setValue("includePaymentDetails", checked, { shouldDirty: true })}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* If disabled, show clean message banner */}
        {!includePaymentDetails ? (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-center space-y-1.5">
            <p className="text-xs font-semibold text-amber-900">
              Payment Details are currently hidden on this document.
            </p>
            <p className="text-[11px] text-amber-700">
              Ideal for Delivery Notes, Vendor Purchase Orders, or Non-payable Estimates. Toggle the switch above anytime to show payment options.
            </p>
          </div>
        ) : (
          <>
            {/* Payment Method Tabs */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1">
                  Payment Channels:
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("upi")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === "upi"
                      ? "bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-600/20"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <QrCode className="h-3.5 w-3.5" />
                  UPI & QR Code (India / Instant)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("bank")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === "bank"
                      ? "bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/20"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <Building className="h-3.5 w-3.5" />
                  Bank Wire / IBAN / SWIFT
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("online")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === "online"
                      ? "bg-purple-600 text-white shadow-xs ring-2 ring-purple-600/20"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  PayPal / Stripe / Web Link
                </button>
              </div>

              {/* Tab 1: UPI & QR Code Configuration */}
              {activeTab === "upi" && (
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/70 pb-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                        <QrCode className="h-4 w-4 text-emerald-700" />
                        UPI Payment QR Code (Scan & Pay)
                      </span>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        PhonePe, GooglePay, Paytm, AmazonPay, BHIM UPI
                      </p>
                    </div>

                    <div className="flex bg-white/90 p-1 rounded-xl border border-emerald-200 shadow-2xs self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setQrMode("id")}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                          qrMode === "id"
                            ? "bg-emerald-600 text-white shadow-2xs"
                            : "text-emerald-800 hover:text-emerald-900"
                        }`}
                      >
                        Enter UPI ID
                      </button>
                      <button
                        type="button"
                        onClick={() => setQrMode("upload")}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                          qrMode === "upload"
                            ? "bg-emerald-600 text-white shadow-2xs"
                            : "text-emerald-800 hover:text-emerald-900"
                        }`}
                      >
                        Upload Scanner Pic
                      </button>
                    </div>
                  </div>

                  {qrMode === "id" && (
                    <div className="space-y-2">
                      <Label htmlFor="upiId" className="text-xs font-medium text-emerald-900">
                        UPI ID / VPA
                      </Label>
                      <Input
                        id="upiId"
                        {...register("upiId")}
                        placeholder="e.g. yourbusiness@okhdfcbank or merchant@upi"
                        className="bg-white border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                      />
                      <p className="text-[11px] text-emerald-700">
                        Automatically generates a scannable QR code matching the exact invoice total amount.
                      </p>
                    </div>
                  )}

                  {qrMode === "upload" && (
                    <div className="space-y-3">
                      <Label className="text-xs font-medium text-emerald-900 block">
                        Upload Your Store Scanner QR Image (PhonePe / Paytm / GPay / BHIM)
                      </Label>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/80 p-3.5 rounded-xl border border-emerald-200">
                        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex items-center justify-center overflow-hidden shrink-0">
                          {paymentQrImage ? (
                            <img src={paymentQrImage} alt="Payment QR preview" className="w-full h-full object-contain p-1" />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-emerald-300" />
                          )}
                        </div>

                        <div className="space-y-2">
                          <Input
                            id="qrUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleQrImageUpload}
                            className="hidden"
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => document.getElementById("qrUpload")?.click()}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 h-8"
                            >
                              <Upload className="h-3.5 w-3.5" />
                              {paymentQrImage ? "Change QR Photo" : "Upload QR Scanner Photo"}
                            </Button>

                            {paymentQrImage && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleRemoveQrImage}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 text-xs gap-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Remove
                              </Button>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500">
                            Upload a photo or screenshot of your store QR scanner. It will be embedded directly in the invoice and PDF.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Bank Details (Domestic & International Wire) */}
              {activeTab === "bank" && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-200">
                    <Building className="h-4 w-4 text-blue-600" />
                    Bank Account & International Wire Details
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="bankName" className="text-xs font-semibold text-gray-700">
                        Bank Name
                      </Label>
                      <Input
                        id="bankName"
                        {...register("bankName")}
                        placeholder="e.g. HDFC Bank / Chase / Barclays"
                        className="bg-white border-gray-200 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="accountHolderName" className="text-xs font-semibold text-gray-700">
                        Account Holder / Beneficiary Name
                      </Label>
                      <Input
                        id="accountHolderName"
                        {...register("accountHolderName")}
                        placeholder="e.g. Acme Solutions Pvt Ltd"
                        className="bg-white border-gray-200 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="accountNumber" className="text-xs font-semibold text-gray-700">
                        Account Number
                      </Label>
                      <Input
                        id="accountNumber"
                        {...register("accountNumber")}
                        placeholder="e.g. 50200012345678"
                        className="bg-white border-gray-200 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="ifscCode" className="text-xs font-semibold text-gray-700">
                        IFSC Code / Routing / Sort Code
                      </Label>
                      <Input
                        id="ifscCode"
                        {...register("ifscCode")}
                        placeholder="e.g. HDFC0001234 or 021000021"
                        className="bg-white border-gray-200 text-xs font-mono uppercase"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="swiftCode" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <Globe className="h-3 w-3 text-blue-600" /> SWIFT / BIC Code (Global)
                      </Label>
                      <Input
                        id="swiftCode"
                        {...register("swiftCode")}
                        placeholder="e.g. HDFCINBBXXX"
                        className="bg-white border-gray-200 text-xs font-mono uppercase"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="ibanNumber" className="text-xs font-semibold text-gray-700">
                        IBAN Number (EU / UK / Middle East)
                      </Label>
                      <Input
                        id="ibanNumber"
                        {...register("ibanNumber")}
                        placeholder="e.g. GB29NWBK60161331926819"
                        className="bg-white border-gray-200 text-xs font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Online Payment Link (PayPal, Stripe, Razorpay) */}
              {activeTab === "online" && (
                <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-5 space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                      <LinkIcon className="h-4 w-4 text-purple-700" />
                      Online Payment Link (PayPal, Stripe, Razorpay)
                    </span>
                    <p className="text-[11px] text-purple-700 mt-0.5">
                      Allow your clients to click and pay directly via Credit Card, Debit Card, or PayPal.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentLink" className="text-xs font-medium text-purple-900">
                      Payment URL / Link
                    </Label>
                    <Input
                      id="paymentLink"
                      {...register("paymentLink")}
                      placeholder="e.g. https://paypal.me/yourname or https://buy.stripe.com/..."
                      className="bg-white border-purple-300 focus:border-purple-500 text-xs font-mono"
                    />
                    <p className="text-[11px] text-purple-600">
                      This link will be rendered as a clickable link and scanned in the PDF for 1-click client checkout.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Payment Instructions */}
            <div className="space-y-2 pt-2">
              <Label htmlFor="paymentInstructions" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-gray-500" />
                Additional Payment Instructions
              </Label>
              <Textarea
                id="paymentInstructions"
                {...register("paymentInstructions")}
                placeholder="e.g. Please quote the invoice number on your payment reference. Transfer receipt can be emailed to billing@company.com"
                rows={2}
                className="resize-none bg-white border-gray-200 text-xs"
              />
            </div>
          </>
        )}

        {/* Terms & Conditions (With 1-Click Presets) */}
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Label htmlFor="terms" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-gray-500" />
              Terms & Conditions
            </Label>

            {/* Presets Pills */}
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-[10px] text-gray-400 font-medium mr-1">1-Click Presets:</span>
              {termsPresets.map((tp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setValue("terms", tp.text, { shouldDirty: true })}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-[10px] font-semibold text-slate-700 transition-colors"
                >
                  {tp.label}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            id="terms"
            {...register("terms")}
            placeholder="Payment is due within 15/30 days. Goods once sold are subject to standard warranty."
            rows={2}
            className="resize-none bg-white border-gray-200 text-xs"
          />
        </div>

        {/* Customer Notes */}
        <div className="space-y-2 pt-2">
          <Label htmlFor="notes" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Customer Notes / Thank You Note
          </Label>
          <Textarea
            id="notes"
            {...register("notes")}
            placeholder="Thank you for partnering with us! We appreciate your business."
            rows={2}
            className="resize-none bg-white border-gray-200 text-xs"
          />
        </div>
      </CardContent>
    </Card>
  );
}
