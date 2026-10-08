import { useState, useEffect } from "react";
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles,
  ShieldCheck,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Contact Support & Help Desk | InvoiceGenius";
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Fields",
        description: "Please fill in your name, email, and message.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate swift submission feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for reaching out. Our support team will get back to you shortly.",
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200">
            <Mail className="w-3.5 h-3.5" />
            <span>Dedicated Support & Inquiry Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Can We Help You?
          </h1>
          <p className="text-slate-600 text-sm">
            Have a question about InvoiceGenius, template customization, or partnership opportunities? Send us a message and our team will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information & Channels */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-slate-900">Direct Contact</h2>
              
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Support Email</p>
                  <a href="mailto:support@invoicegenius.in" className="text-sm font-semibold text-blue-600 hover:underline">
                    support@invoicegenius.in
                  </a>
                  <p className="text-[11px] text-slate-400 mt-0.5">Average response: &lt; 24 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Operating Hours</p>
                  <p className="text-sm font-medium text-slate-800">Monday - Saturday</p>
                  <p className="text-xs text-slate-500">09:00 AM – 07:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Privacy Assurance</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We never share your email address or query details with unauthorized third parties.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-300" />
                Instant FAQ Quick-Check
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Looking for invoice generation answers? You can create and download standard, GST, quote, or receipt documents without waiting for registration confirmation.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm">
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Thank You!</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Your inquiry has been received. Our team will review your message and reply to <strong>{formData.email}</strong> as soon as possible.
                  </p>
                  <Button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", category: "general", message: "" });
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-bold text-slate-900">Send Us an Inquiry</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Please provide as much context as possible so we can assist you quickly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Your Full Name *</label>
                      <Input
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-10 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                      <Input
                        required
                        type="email"
                        placeholder="e.g. rahul@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Inquiry Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="feature">Feature Suggestion</option>
                        <option value="bug">Bug Report / Technical Issue</option>
                        <option value="partnership">Advertising & Partnerships</option>
                        <option value="billing">GST / Accounting Query</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Subject</label>
                      <Input
                        placeholder="e.g. Question about UPI QR Codes"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Your Message *</label>
                    <Textarea
                      required
                      rows={5}
                      placeholder="Write your question, suggestion, or feedback here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="text-sm resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      "Sending Message..."
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Frequently Asked Questions (FAQ)
            </h3>
            <p className="text-xs text-slate-500 mt-1">Quick answers to common questions about InvoiceGenius.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900">Is InvoiceGenius completely free to use?</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Yes! All core templates, instant invoice generators, GST calculation sheets, and PDF export tools are 100% free with no watermarks.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900">Are my invoices stored securely or shared?</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Your invoices are rendered on client-side technology. We do not sell or monetize your sensitive customer data or invoice amounts.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900">How does the UPI QR payment feature work?</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                When you input your UPI ID (VPA) and payee name, our system encodes standard NPCI UPI parameters into a high-res QR code right on the invoice so your clients can scan and pay instantly.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900">Can I generate GST Tax Invoices?</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Yes, our GST Tax Invoice builder supports HSN/SAC codes, CGST, SGST, IGST breakdown, and state code parameters compliant with Indian tax standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
