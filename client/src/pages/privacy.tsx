import { useEffect } from "react";
import { ShieldCheck, Lock, Eye, FileText, Globe, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | InvoiceGenius - Modern Billing & Invoicing";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 sm:p-12">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4 border border-blue-100">
            <ShieldCheck className="w-4 h-4" />
            <span>GDPR, CCPA & Google AdSense Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last Updated: October 8, 2026 • Effective Date: January 1, 2026
          </p>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            At <strong>InvoiceGenius</strong> (accessible from{" "}
            <a href="https://invoicegenius.in" className="text-blue-600 underline font-medium">
              https://invoicegenius.in
            </a>
            ), one of our core priorities is the privacy of our visitors and users. This Privacy Policy document outlines the types of information that is collected and recorded by InvoiceGenius and how we use, safeguard, and disclose that data.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">1</span>
              Information We Collect
            </h2>
            <p className="mb-3">
              We collect information in the following ways depending on how you interact with InvoiceGenius:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Document Data (Client-Side Privacy):</strong> Invoices, quotes, estimates, and receipts generated on our platform are primarily rendered on your device. We do not sell, rent, or monetize the proprietary business details or customer lists you enter into your invoices.
              </li>
              <li>
                <strong>Account Information (If registered):</strong> When you create an account to save invoices, we may collect your email address, name, and authentication credentials.
              </li>
              <li>
                <strong>Log Files & Technical Data:</strong> Like many standard web services, InvoiceGenius logs visitors when they browse the website. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and number of clicks. These are not linked to personally identifiable information.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">2</span>
              Cookies and Web Beacons
            </h2>
            <p className="mb-3">
              Like any other website, InvoiceGenius uses "cookies". These cookies are used to store information including visitors' preferences, user interface settings, and pages on the website that the visitor accessed or visited.
            </p>
            <p>
              The information is used to optimize the user experience by customizing our web page content based on visitors' browser type and other session preferences.
            </p>
          </section>

          {/* Section 3 - Google AdSense & Third Party Advertising */}
          <section className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">3</span>
              Google DoubleClick DART Cookies & Third-Party Advertising
            </h2>
            <p className="mb-3">
              Google is one of our third-party advertising vendors. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.invoicegenius.in and other sites on the internet.
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-3">
              <li>
                Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.
              </li>
              <li>
                Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to your sites and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting{" "}
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-medium"
                >
                  Google Ads Settings
                </a>
                .
              </li>
              <li>
                Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting{" "}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-medium"
                >
                  www.aboutads.info
                </a>
                .
              </li>
            </ul>
            <p className="text-xs text-slate-600">
              For more information on how Google manages advertising and data privacy, please review Google’s Privacy & Terms at{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                https://policies.google.com/technologies/partner-sites
              </a>
              .
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">4</span>
              How We Use Your Information
            </h2>
            <p className="mb-2">We use the information we collect in various ways, including to:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>Provide, operate, and maintain our web applications</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>Improve, personalize, and expand our template tools</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>Understand and analyze how you interact with our generator</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>Prevent unauthorized access, abuse, and fraudulent activity</span>
              </div>
            </div>
          </section>

          {/* Section 5 - GDPR Rights */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">5</span>
              GDPR Data Protection Rights (EEA Visitors)
            </h2>
            <p className="mb-3">
              We would like to make sure you are fully aware of all of your data protection rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
              <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
              <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data under certain conditions.</li>
              <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
              <li><strong>The right to data portability:</strong> You have the right to request that we transfer data that we have collected directly to you.</li>
            </ul>
          </section>

          {/* Section 6 - CCPA Rights */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">6</span>
              CCPA/CPRA Privacy Rights (California Consumers)
            </h2>
            <p className="mb-2">
              Under the California Consumer Privacy Act (CCPA), California consumers have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Request disclosure of categories and specific pieces of personal data collected.</li>
              <li>Request the deletion of personal data collected by the business.</li>
              <li><strong>Do Not Sell My Personal Information:</strong> We do not sell consumer personal information to third parties.</li>
            </ul>
          </section>

          {/* Section 7 - Children's Information */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">7</span>
              Children's Privacy Protection
            </h2>
            <p>
              Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. InvoiceGenius does not knowingly collect any Personal Identifiable Information from children under the age of 13.
            </p>
          </section>

          {/* Section 8 - Contact */}
          <section className="border-t border-slate-200 pt-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">8</span>
              Contact Us Regarding Privacy
            </h2>
            <p className="mb-4">
              If you have any questions, inquiries, or requests regarding this Privacy Policy, please contact our Data Protection Team:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">InvoiceGenius Support & Privacy Desk</p>
                <p className="text-slate-600 text-xs">Email: <a href="mailto:madhurimondal89@gmail.com" className="text-blue-600 underline font-medium">madhurimondal89@gmail.com</a></p>
              </div>
              <Link href="/contact" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm">
                Contact Page
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
