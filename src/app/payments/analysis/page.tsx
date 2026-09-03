"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileUp,
  Building2,
  CreditCard,
  Briefcase,
  Calendar,
  Mail,
  FileText,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

interface PaymentDetails {
  clientName: string;
  amount: string;
  serviceType: string;
  purpose: string;
  paymentType: string;
  clientEmail: string;
  paymentDate: string;
}

const DEFAULT_DEMO: PaymentDetails = {
  clientName: "Acme Technologies",
  amount: "₹2,50,000",
  serviceType: "Website Development",
  purpose: "50% advance payment for website development",
  paymentType: "Advance Payment",
  clientEmail: "finance@acmetech.example",
  paymentDate: "2026-09-15",
};

function AnalysisContent() {
  const searchParams = useSearchParams();
  const [details, setDetails] = useState<PaymentDetails>(DEFAULT_DEMO);
  const [score] = useState(82);

  useEffect(() => {
    // 1. Try URL search params
    const clientParam = searchParams.get("client") || searchParams.get("clientName");
    const amountParam = searchParams.get("amount");
    const serviceParam = searchParams.get("service") || searchParams.get("serviceType");
    const purposeParam = searchParams.get("purpose");
    const paymentTypeParam = searchParams.get("paymentType") || searchParams.get("type");
    const emailParam = searchParams.get("email") || searchParams.get("clientEmail");
    const dateParam = searchParams.get("date") || searchParams.get("paymentDate");

    if (clientParam || amountParam || serviceParam) {
      let formattedAmount = amountParam || DEFAULT_DEMO.amount;
      if (formattedAmount && !formattedAmount.includes("₹")) {
        const num = Number(formattedAmount);
        if (!isNaN(num)) {
          formattedAmount = `₹${num.toLocaleString("en-IN")}`;
        }
      }

      setDetails({
        clientName: clientParam || DEFAULT_DEMO.clientName,
        amount: formattedAmount,
        serviceType: serviceParam || DEFAULT_DEMO.serviceType,
        purpose: purposeParam || DEFAULT_DEMO.purpose,
        paymentType: paymentTypeParam || DEFAULT_DEMO.paymentType,
        clientEmail: emailParam || DEFAULT_DEMO.clientEmail,
        paymentDate: dateParam || DEFAULT_DEMO.paymentDate,
      });
      return;
    }

    // 2. Try sessionStorage
    try {
      const stored = sessionStorage.getItem("paymentshield_payment");
      if (stored) {
        const parsed = JSON.parse(stored);
        let formattedAmount = parsed.amount || DEFAULT_DEMO.amount;
        if (formattedAmount && !formattedAmount.includes("₹")) {
          const num = Number(formattedAmount);
          if (!isNaN(num)) {
            formattedAmount = `₹${num.toLocaleString("en-IN")}`;
          }
        }

        setDetails({
          clientName: parsed.clientName || DEFAULT_DEMO.clientName,
          amount: formattedAmount,
          serviceType: parsed.serviceType || DEFAULT_DEMO.serviceType,
          purpose: parsed.purpose || DEFAULT_DEMO.purpose,
          paymentType: parsed.paymentType || DEFAULT_DEMO.paymentType,
          clientEmail: parsed.clientEmail || DEFAULT_DEMO.clientEmail,
          paymentDate: parsed.paymentDate || DEFAULT_DEMO.paymentDate,
        });
      }
    } catch {
      // Fallback to default demo data
    }
  }, [searchParams]);

  // Circular progress calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm border-b border-slate-100 px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-medium text-slate-700">
              Readiness Analysis
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/documents"
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-800 text-white px-3 py-1.5 rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
            >
              <FileUp className="w-3.5 h-3.5" />
              Upload Documents
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-4xl mx-auto px-8 py-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Payment Readiness Analysis
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Here&apos;s what PaymentShield found before you receive this payment.
            </p>
          </div>

          {/* Top Grid: Score & Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Visual Score Card (5 cols) */}
            <div className="md:col-span-5 bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Readiness Score
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Needs Attention
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-slate-100"
                        fill="transparent"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-amber-500 transition-all duration-1000 ease-out"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-bold tracking-tight text-slate-900">
                        {score}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        out of 100
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-center text-slate-500 mt-4 leading-relaxed max-w-xs">
                    This payment has good core identifiers but requires supporting documentation to be fully review-ready.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Baseline Readiness: 60%</span>
                  <span className="font-semibold text-amber-600">Current: 82%</span>
                </div>
              </div>
            </div>

            {/* Payment Summary Card (7 cols) */}
            <div className="md:col-span-7 bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Payment Details
                  </span>
                  <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {details.paymentType || "Direct"}
                  </span>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      Client
                    </span>
                    <span className="text-sm font-semibold text-slate-900 text-right">
                      {details.clientName}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      Amount
                    </span>
                    <span className="text-base font-bold text-slate-900 text-right">
                      {details.amount}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      Service
                    </span>
                    <span className="text-xs font-medium text-slate-800 text-right">
                      {details.serviceType}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      Purpose
                    </span>
                    <span className="text-xs text-slate-700 text-right max-w-[280px] bg-slate-50 px-2 py-1 rounded">
                      {details.purpose}
                    </span>
                  </div>

                  {details.clientEmail && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        Client Email
                      </span>
                      <span className="text-xs text-slate-600 text-right font-mono">
                        {details.clientEmail}
                      </span>
                    </div>
                  )}

                  {details.paymentDate && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Payment Date
                      </span>
                      <span className="text-xs text-slate-600 text-right">
                        {details.paymentDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Captured in current session</span>
                <Link
                  href="/payments/new"
                  className="text-xs text-blue-700 hover:text-blue-800 font-medium"
                >
                  Edit information
                </Link>
              </div>
            </div>
          </div>

          {/* AI-Style Readiness Checks */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span>Readiness Breakdown &amp; Checks</span>
              <span className="text-xs font-normal text-slate-400">
                (4 satisfied, 2 need attention)
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 border border-green-100">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Client identified
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Verified entity name provided ({details.clientName})
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 border border-green-100">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Payment amount recorded
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Clear monetary figure documented ({details.amount})
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 border border-green-100">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Service description provided
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Categorized under {details.serviceType}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 border border-green-100">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Payment purpose provided
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Basic rationale submitted for the transaction
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/60 border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-900">
                    Supporting documentation not uploaded
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    No invoice, contract, or SOW attached yet
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/60 border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-900">
                    Payment purpose could be more specific
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Include milestone deliverables or contract reference numbers
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Recommended Actions
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Take these steps to bring your payment documentation to optimal readiness:
            </p>

            <ol className="space-y-3">
              <li className="flex items-start gap-3 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  1
                </span>
                <span className="mt-0.5 leading-relaxed">
                  <strong className="font-semibold text-slate-900">Upload invoice and signed SOW/contract.</strong> Having formal signed agreements ready substantiates the legitimacy of the payment terms.
                </span>
              </li>
              <li className="flex items-start gap-3 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  2
                </span>
                <span className="mt-0.5 leading-relaxed">
                  <strong className="font-semibold text-slate-900">Add a specific payment purpose</strong> referencing the agreed service or milestone (e.g. &ldquo;Phase 1 UI mockups delivery as per SOW #104&rdquo;).
                </span>
              </li>
              <li className="flex items-start gap-3 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  3
                </span>
                <span className="mt-0.5 leading-relaxed">
                  <strong className="font-semibold text-slate-900">Keep client communication and proof-of-work records available</strong> in case any verification question is raised during routine processing.
                </span>
              </li>
            </ol>

            {/* Action Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3 justify-between">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Dashboard
              </Link>

              <div className="w-full sm:w-auto flex items-center gap-3">
                <Link
                  id="upload-docs-btn"
                  href="/documents"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors shadow-sm"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  Upload Supporting Documents
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Why This Matters Section */}
          <div className="bg-slate-100/70 rounded-xl p-5 border border-slate-200/60">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-semibold text-slate-900">
                  Why this matters
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Payment processors and gateway compliance teams routinely inspect high-value or unusual freelancer transactions. Clear payment information and supporting evidence can make future payment review easier and help you keep your business records structured, auditable, and prompt.
                </p>
              </div>
            </div>
          </div>

          {/* Regulatory & Preparation Disclaimer */}
          <div className="p-4 rounded-lg bg-white border border-slate-200 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong>Disclaimer:</strong> PaymentShield provides preparation guidance and transaction readiness assistance only. PaymentShield does not make or guarantee payment-provider decisions, prevent account suspension, bypass automated risk systems, or predict internal gateway rules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-slate-50">
          <p className="text-sm text-slate-500">Loading analysis…</p>
        </div>
      }
    >
      <AnalysisContent />
    </Suspense>
  );
}
