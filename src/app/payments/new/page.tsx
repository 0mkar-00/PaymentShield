"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import {
  ArrowLeft,
  Wand2,
  ChevronDown,
  Loader2,
  Info,
} from "lucide-react";

const SERVICE_OPTIONS = [
  "Website Development",
  "UI/UX Consulting",
  "Software Development",
  "Digital Marketing",
  "Consulting",
  "Other",
];

const PAYMENT_TYPE_OPTIONS = [
  "Advance Payment",
  "Milestone Payment",
  "Final Payment",
  "Other",
];

const DEMO_DATA = {
  clientName: "Acme Technologies",
  amount: "250000",
  serviceType: "Website Development",
  purpose: "50% advance payment for website development",
  paymentType: "Advance Payment",
  clientEmail: "finance@acmetech.example",
  paymentDate: "",
};

interface FormData {
  clientName: string;
  amount: string;
  serviceType: string;
  purpose: string;
  paymentType: string;
  clientEmail: string;
  paymentDate: string;
}

interface FormErrors {
  clientName?: string;
  amount?: string;
  serviceType?: string;
  purpose?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.clientName.trim()) errors.clientName = "Client name is required.";
  if (!data.amount.trim()) {
    errors.amount = "Payment amount is required.";
  } else if (isNaN(Number(data.amount)) || Number(data.amount) <= 0) {
    errors.amount = "Enter a valid positive amount.";
  }
  if (!data.serviceType) errors.serviceType = "Please select a service type.";
  if (!data.purpose.trim())
    errors.purpose = "Payment purpose is required.";
  return errors;
}

export default function NewPaymentPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    clientName: "",
    amount: "",
    serviceType: "",
    purpose: "",
    paymentType: "",
    clientEmail: "",
    paymentDate: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function setField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function fillDemo() {
    setForm(DEMO_DATA);
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    // Simulate a brief analysis delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Store form data in sessionStorage for the analysis page
    sessionStorage.setItem("paymentshield_payment", JSON.stringify(form));

    router.push("/payments/analysis");
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100 px-8 h-16 flex items-center justify-between">
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
              Check a Payment
            </span>
          </div>
        </div>

        {/* Page content */}
        <div className="max-w-2xl mx-auto px-8 py-10">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Check a Payment
            </h1>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-lg">
              Tell us about the payment so PaymentShield can identify missing
              information and documentation before you receive it.
            </p>
          </div>

          {/* Demo option */}
          <div className="mb-8 flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <Wand2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-700 flex-1">
              Want to see how it works?
            </p>
            <button
              type="button"
              id="demo-fill-btn"
              onClick={fillDemo}
              className="text-sm font-medium text-blue-700 bg-white border border-blue-200 hover:border-blue-300 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
            >
              Use Demo Payment
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Client Name */}
            <div>
              <label
                htmlFor="clientName"
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                Client / Company Name
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                id="clientName"
                type="text"
                value={form.clientName}
                onChange={(e) => setField("clientName", e.target.value)}
                placeholder="e.g. Acme Technologies"
                className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow ${
                  errors.clientName
                    ? "border-red-300 focus:ring-red-500"
                    : "border-slate-200"
                }`}
              />
              {errors.clientName && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  {errors.clientName}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                Payment Amount (INR)
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium select-none">
                  ₹
                </span>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={(e) => setField("amount", e.target.value)}
                  placeholder="250000"
                  className={`w-full pl-8 pr-4 py-2.5 text-sm rounded-lg border bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow ${
                    errors.amount
                      ? "border-red-300 focus:ring-red-500"
                      : "border-slate-200"
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Two columns: Service Type + Payment Type */}
            <div className="grid grid-cols-2 gap-4">
              {/* Service Type */}
              <div>
                <label
                  htmlFor="serviceType"
                  className="block text-sm font-medium text-slate-800 mb-1.5"
                >
                  Service Type
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <select
                    id="serviceType"
                    value={form.serviceType}
                    onChange={(e) => setField("serviceType", e.target.value)}
                    className={`w-full appearance-none px-4 py-2.5 pr-9 text-sm rounded-lg border bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow ${
                      !form.serviceType ? "text-slate-400" : ""
                    } ${
                      errors.serviceType
                        ? "border-red-300 focus:ring-red-500"
                        : "border-slate-200"
                    }`}
                  >
                    <option value="" disabled hidden>
                      Select service…
                    </option>
                    {SERVICE_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                {errors.serviceType && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {errors.serviceType}
                  </p>
                )}
              </div>

              {/* Payment Type */}
              <div>
                <label
                  htmlFor="paymentType"
                  className="block text-sm font-medium text-slate-800 mb-1.5"
                >
                  Payment Type
                </label>
                <div className="relative">
                  <select
                    id="paymentType"
                    value={form.paymentType}
                    onChange={(e) => setField("paymentType", e.target.value)}
                    className={`w-full appearance-none px-4 py-2.5 pr-9 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow ${
                      !form.paymentType ? "text-slate-400" : "text-slate-900"
                    }`}
                  >
                    <option value="" disabled hidden>
                      Select type…
                    </option>
                    {PAYMENT_TYPE_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label
                htmlFor="purpose"
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                Payment Purpose / Description
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <textarea
                id="purpose"
                rows={3}
                value={form.purpose}
                onChange={(e) => setField("purpose", e.target.value)}
                placeholder="e.g. 50% advance payment for website redesign project as per SOW dated June 2025"
                className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow resize-none ${
                  errors.purpose
                    ? "border-red-300 focus:ring-red-500"
                    : "border-slate-200"
                }`}
              />
              {errors.purpose && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  {errors.purpose}
                </p>
              )}
            </div>

            {/* Optional fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* Client Email */}
              <div>
                <label
                  htmlFor="clientEmail"
                  className="block text-sm font-medium text-slate-800 mb-1.5"
                >
                  Client Email{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  id="clientEmail"
                  type="email"
                  value={form.clientEmail}
                  onChange={(e) => setField("clientEmail", e.target.value)}
                  placeholder="finance@client.com"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                />
              </div>

              {/* Payment Date */}
              <div>
                <label
                  htmlFor="paymentDate"
                  className="block text-sm font-medium text-slate-800 mb-1.5"
                >
                  Payment Date{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  id="paymentDate"
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) => setField("paymentDate", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                id="submit-check"
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2.5 bg-blue-800 text-white font-semibold text-sm px-6 py-3.5 rounded-lg hover:bg-blue-900 disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analysing payment…
                  </>
                ) : (
                  "Check Payment Readiness"
                )}
              </button>
            </div>
          </form>

          {/* Disclaimer */}
          <p className="mt-8 text-xs text-slate-400 text-center leading-relaxed">
            PaymentShield provides preparation assistance only. It does not
            predict, control, or guarantee payment-provider risk or compliance
            decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
