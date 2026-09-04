"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import {
  calculateReadiness,
  PaymentInput,
  DocumentState,
  ReadinessResult,
} from "@/lib/readiness-engine";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileUp,
  Copy,
  Check,
  ShieldAlert,
  FileCheck,
} from "lucide-react";

const DEMO_PAYMENT: PaymentInput = {
  clientName: "Acme Technologies",
  amount: "₹2,50,000",
  serviceType: "Website Development",
  purpose: "50% advance payment for website development",
  paymentType: "Advance Payment",
  clientEmail: "finance@acmetech.example",
  paymentDate: "2026-09-15",
};

export default function AIAdvisorPage() {
  const [payment, setPayment] = useState<PaymentInput>(DEMO_PAYMENT);
  const [documents, setDocuments] = useState<DocumentState>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const storedPayment = sessionStorage.getItem("paymentshield_payment");
      if (storedPayment) {
        const parsed = JSON.parse(storedPayment);
        setPayment({
          clientName: parsed.clientName || DEMO_PAYMENT.clientName,
          amount: parsed.amount || DEMO_PAYMENT.amount,
          serviceType: parsed.serviceType || DEMO_PAYMENT.serviceType,
          purpose: parsed.purpose || DEMO_PAYMENT.purpose,
          paymentType: parsed.paymentType || DEMO_PAYMENT.paymentType,
          clientEmail: parsed.clientEmail || DEMO_PAYMENT.clientEmail,
          paymentDate: parsed.paymentDate || DEMO_PAYMENT.paymentDate,
        });
      }

      const storedDocs = sessionStorage.getItem("paymentshield_documents");
      if (storedDocs) {
        setDocuments(JSON.parse(storedDocs));
      }
    } catch {
      // Default to demo
    }
  }, []);

  const result: ReadinessResult = calculateReadiness(payment, documents);
  const consistency = result.consistencyResult;

  const handleCopySuggestion = () => {
    if (result.purposeFeedback.suggestedText) {
      navigator.clipboard.writeText(result.purposeFeedback.suggestedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
              PaymentShield AI Advisor
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/payments/analysis"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200/80"
            >
              View Full Analysis
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-4xl mx-auto px-8 py-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-violet-50 text-violet-700 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                Intelligent Readiness Guidance
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                PaymentShield AI Advisor
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Actionable preparation roadmap for your payment with{" "}
                <span className="font-semibold text-slate-800">
                  {payment.clientName}
                </span>.
              </p>
            </div>

            {/* Score pill */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 p-4 rounded-xl">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Readiness
                </span>
                <span className="text-2xl font-extrabold text-slate-900">
                  {result.score}
                  <span className="text-sm font-medium text-slate-400">/100</span>
                </span>
              </div>
              <div className="h-9 w-px bg-slate-200" />
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Consistency
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-0.5 ${consistency.statusColor.badgeBg} ${consistency.statusColor.badgeText} border ${consistency.statusColor.border}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${consistency.statusColor.dotBg}`}
                  />
                  {consistency.hasInvoice || consistency.hasSOW ? `${consistency.score}/100` : "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Section: What should I fix first? */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                What should I fix first?
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Prioritized by potential impact on payment verification ease:
            </p>

            <div className="space-y-3">
              {result.prioritizedActions.map((action) => (
                <div
                  key={action.priority}
                  className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-800 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs shadow-xs">
                    {action.priority}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {action.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {action.detail}
                    </p>
                  </div>
                  {action.actionType === "consistency" && (
                    <Link
                      href="/payments/analysis#consistency-card"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                    >
                      Review Mismatch
                    </Link>
                  )}
                  {action.actionType === "docs" && (
                    <Link
                      href="/documents"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0"
                    >
                      <FileUp className="w-3.5 h-3.5" />
                      Upload
                    </Link>
                  )}
                </div>
              ))}

              {result.prioritizedActions.length === 0 && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-800 font-medium">
                    All top readiness criteria are satisfied! No critical gaps identified.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section: Invoice & Contract Consistency Findings */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-700" />
                Invoice &amp; Contract Consistency Findings
              </h2>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${consistency.statusColor.badgeBg} ${consistency.statusColor.badgeText} border ${consistency.statusColor.border}`}
              >
                {consistency.status}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {consistency.status === "Consistent"
                ? "Your payment information is consistent across the available records. No major consistency issues were detected."
                : consistency.status === "Minor Mismatch"
                ? "Minor wording differences detected between your payment submission and invoice/contract descriptions. Confirming identical wording reduces ambiguity."
                : consistency.status === "Significant Mismatch"
                ? "Discrepancy detected in core figures (e.g. payment amount or client entity). Aligning these details before review prevents routine processing holds."
                : "Consistency check requires an invoice and signed SOW/contract to compare payment amounts, client entities, and scope."}
            </p>

            {consistency.recommendations.length > 0 && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Consistency Recommendation:
                </span>
                <ul className="space-y-1">
                  {consistency.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Section: Suggested Payment-Purpose Wording */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-700" />
                Suggested Payment-Purpose Wording
              </h2>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  result.purposeSpecificity === "strong"
                    ? "bg-green-50 text-green-700 border border-green-200/60"
                    : result.purposeSpecificity === "better"
                    ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                    : "bg-amber-50 text-amber-700 border border-amber-200/60"
                }`}
              >
                Current: {result.purposeFeedback.rating}
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Clear payment descriptions referencing deliverables reduce ambiguity during review. Use this recommended wording in your invoice or transfer reference:
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs font-mono text-slate-800 font-medium leading-relaxed">
                &ldquo;{result.purposeFeedback.suggestedText}&rdquo;
              </p>
              <button
                type="button"
                onClick={handleCopySuggestion}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-green-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section: Top Readiness Gaps */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Readiness Breakdown &amp; Status
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.checks.map((check) => (
                <div
                  key={check.id}
                  className={`p-3.5 rounded-lg border flex items-start gap-3 ${
                    check.satisfied
                      ? "bg-green-50/40 border-green-100"
                      : "bg-amber-50/50 border-amber-200/70"
                  }`}
                >
                  {check.satisfied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        check.satisfied ? "text-slate-800" : "text-amber-900"
                      }`}
                    >
                      {check.title}
                    </p>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        check.satisfied ? "text-slate-500" : "text-amber-700"
                      }`}
                    >
                      {check.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/documents"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <FileUp className="w-3.5 h-3.5" />
                Upload Documents
              </Link>
              <Link
                href="/payments/analysis"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors shadow-sm"
              >
                <span>Full Readiness Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Advisory & Preparation Disclaimer */}
          <div className="p-4 rounded-lg bg-white border border-slate-200 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong>Preparation Guidance Notice:</strong> PaymentShield AI Advisor provides preparation guidance and document organization only. It does not predict, guarantee, or influence payment-provider decisions, prevent account suspensions, or bypass automated fraud/risk review mechanisms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
