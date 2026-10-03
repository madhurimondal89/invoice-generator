import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedInput from "@/components/ui/enhanced-input";
import { Calendar, Hash, FileText, CheckCircle2, CreditCard } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DocumentDetailsProps {
    form: UseFormReturn<any>;
    labels: any;
    documentType: string;
}

export default function DocumentDetails({ form, labels, documentType }: DocumentDetailsProps) {
    const { register, formState: { errors } } = form;

    return (
        <Card className="border-0 shadow-sm ring-1 ring-gray-200 h-full">
            <CardHeader className="bg-gray-50/50 border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    {labels.title} Details
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
                {/* Document / Invoice Number */}
                <EnhancedInput
                    id="invoiceNumber"
                    label={labels.number}
                    icon={Hash}
                    placeholder="INV-001"
                    {...register("invoiceNumber")}
                    error={errors.invoiceNumber?.message as string}
                    required
                    className="font-mono text-sm tracking-wide"
                />

                {/* Dates in comfortable 2-column layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="issueDate" className="text-xs font-medium uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            {labels.date} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="issueDate"
                            type="date"
                            {...register("issueDate")}
                            className="h-11 bg-gray-50/30 border-gray-200 focus-visible:border-primary focus-visible:ring-primary/20 hover:bg-white text-xs sm:text-sm font-medium"
                        />
                        {errors.issueDate && (
                            <p className="text-[10px] font-medium text-red-500">
                                {errors.issueDate?.message as string}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate" className="text-xs font-medium uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            {labels.due} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="dueDate"
                            type="date"
                            {...register("dueDate")}
                            className="h-11 bg-gray-50/30 border-gray-200 focus-visible:border-primary focus-visible:ring-primary/20 hover:bg-white text-xs sm:text-sm font-medium"
                        />
                        {errors.dueDate && (
                            <p className="text-[10px] font-medium text-red-500">
                                {errors.dueDate?.message as string}
                            </p>
                        )}
                    </div>
                </div>

                {/* Specialized Fields based on Document Type */}
                {(documentType === 'credit_note' || documentType === 'credit_memo') && (
                    <div className="pt-4 border-t border-dashed space-y-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Reference Information</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <EnhancedInput
                                id="originalInvoice"
                                label="Original Invoice Ref"
                                icon={Hash}
                                placeholder="e.g. INV-2023-001"
                                {...register("metadata.originalInvoiceRef")}
                            />
                            <EnhancedInput
                                id="reasonCode"
                                label="Reason for Credit"
                                placeholder="e.g. Return, Damaged Goods"
                                {...register("metadata.reason")}
                            />
                        </div>
                    </div>
                )}

                {documentType === 'purchase_order' && (
                    <div className="pt-4 border-t border-dashed space-y-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Order Specifics</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <EnhancedInput
                                id="deliveryDate"
                                label="Expected Delivery"
                                icon={Calendar}
                                type="date"
                                {...register("metadata.deliveryDate")}
                            />
                            <EnhancedInput
                                id="shippingMethod"
                                label="Shipping Method"
                                placeholder="e.g. FedEx / Express"
                                {...register("metadata.shippingMethod")}
                            />
                        </div>
                    </div>
                )}

                {(documentType === 'receipt' || documentType === 'sales_receipt' || documentType === 'cash_receipt') && (
                    <div className="pt-4 border-t border-dashed space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Payment Received Particulars
                            </h4>
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Receipt Record
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <EnhancedInput
                                id="originalInvoice"
                                label="Against Invoice / Bill Ref #"
                                icon={Hash}
                                placeholder="e.g. INV-2026-0089"
                                {...register("metadata.originalInvoiceRef")}
                            />
                            <div>
                                <Label htmlFor="paymentMode" className="text-xs font-medium text-gray-700 mb-1.5 block">
                                    Mode of Payment
                                </Label>
                                <select
                                    id="paymentMode"
                                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-gray-800"
                                    {...register("metadata.paymentMode")}
                                >
                                    <option value="UPI / QR Code">UPI (GPay / PhonePe / Paytm / BHIM)</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Bank Transfer (NEFT/IMPS)">Bank Transfer (NEFT / IMPS / RTGS)</option>
                                    <option value="Credit / Debit Card">Credit / Debit Card</option>
                                    <option value="Cheque / DD">Cheque / Demand Draft</option>
                                    <option value="Online Payment">Online Payment Gateway</option>
                                </select>
                            </div>
                            <EnhancedInput
                                id="transactionRef"
                                label="Transaction ID / UTR / Cheque #"
                                icon={CreditCard}
                                placeholder="e.g. UTR-491823901239 or Cheque # 001248"
                                {...register("metadata.transactionRef")}
                            />
                            <div>
                                <Label htmlFor="paymentStatus" className="text-xs font-medium text-gray-700 mb-1.5 block">
                                    Payment Status
                                </Label>
                                <select
                                    id="paymentStatus"
                                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-gray-800"
                                    {...register("metadata.paymentStatus")}
                                >
                                    <option value="Paid in Full">Paid in Full</option>
                                    <option value="Advance Payment">Advance Payment</option>
                                    <option value="Partial Payment">Partial Payment</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
