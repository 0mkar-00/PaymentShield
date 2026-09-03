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
  ArrowLeft,
  Download,
  CheckCircle2,
  AlertTriangle,
  Building2,
  CreditCard,
  Briefcase,
  FileText,
  FileSignature,
  Sparkles,
  Shield,
  Clock,
  Printer,
  FileUp,
} from "lucide-react";

interface StoredDoc {
  fileName: string;
  fileSize?: string;
  uploadedAt?: string;
}

const DEFAULT_PAYMENT: PaymentInput = {
  clientName: "Acme Technologies",
  amount: "₹2,50,000",
  serviceType: "Website Development",
  purpose: "50% advance payment for website development",
  paymentType: "Advance Payment",
  clientEmail: "finance@acmetech.example",
  paymentDate: "2026-09-15",
};

const CHECKLIST_ITEMS = [
  { id: "invoice", name: "Invoice", required: true },
  { id: "sow_contract", name: "SOW / Contract", required: true },
  { id: "client_comm", name: "Client Communication", required: false },
  { id: "proof_of_work", name: "Proof of Work", required: false },
];

export default function EvidencePackPage() {
  const [payment, setPayment] = useState<PaymentInput>(DEFAULT_PAYMENT);
  const [documents, setDocuments] = useState<Record<string, StoredDoc>>({});
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    try {
      const storedPayment = sessionStorage.getItem("paymentshield_payment");
      if (storedPayment) {
        const parsed = JSON.parse(storedPayment);
        let formattedAmount = parsed.amount || DEFAULT_PAYMENT.amount;
        if (formattedAmount && typeof formattedAmount === "string" && !formattedAmount.includes("₹")) {
          const num = Number(formattedAmount);
          if (!isNaN(num)) {
            formattedAmount = `₹${num.toLocaleString("en-IN")}`;
          }
        }
        setPayment({
          clientName: parsed.clientName || DEFAULT_PAYMENT.clientName,
          amount: formattedAmount,
          serviceType: parsed.serviceType || DEFAULT_PAYMENT.serviceType,
          purpose: parsed.purpose || DEFAULT_PAYMENT.purpose,
          paymentType: parsed.paymentType || DEFAULT_PAYMENT.paymentType,
          clientEmail: parsed.clientEmail || DEFAULT_PAYMENT.clientEmail,
          paymentDate: parsed.paymentDate || DEFAULT_PAYMENT.paymentDate,
        });
      }

      const storedDocs = sessionStorage.getItem("paymentshield_documents");
      if (storedDocs) {
        const parsedDocs = JSON.parse(storedDocs);
        if (Object.keys(parsedDocs).length > 0) {
          setDocuments(parsedDocs);
        } else {
          // If empty in storage, populate sample docs so user sees an active pack
          const sampleDocs = {
            invoice: {
              fileName: "Acme_Invoice_INV-2026-089.pdf",
              fileSize: "184 KB",
              uploadedAt: "Uploaded",
            },
            sow_contract: {
              fileName: "Acme_Signed_SOW_Phase1.pdf",
              fileSize: "342 KB",
              uploadedAt: "Uploaded",
            },
          };
          setDocuments(sampleDocs);
        }
      } else {
        const sampleDocs = {
          invoice: {
            fileName: "Acme_Invoice_INV-2026-089.pdf",
            fileSize: "184 KB",
            uploadedAt: "Uploaded",
          },
          sow_contract: {
            fileName: "Acme_Signed_SOW_Phase1.pdf",
            fileSize: "342 KB",
            uploadedAt: "Uploaded",
          },
        };
        setDocuments(sampleDocs);
      }
    } catch {
      // Use demo defaults
    }
  }, []);

  const readiness: ReadinessResult = calculateReadiness(payment, documents as DocumentState);

  const handleDownload = () => {
    setDownloading(true);

    const generatedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const checklistHtml = CHECKLIST_ITEMS.map((item) => {
      const doc = documents[item.id];
      const isReady = !!doc;
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f1f5f9; background: ${
          isReady ? "#f8fafc" : "#ffffff"
        };">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 16px; color: ${
              isReady ? "#16a34a" : "#94a3b8"
            };">
              ${isReady ? "&#10003;" : "&#9675;"}
            </span>
            <div>
              <strong style="color: #0f172a; font-size: 13px;">${
                item.name
              }</strong>
              ${
                doc
                  ? `<span style="display: block; font-size: 11px; color: #64748b; font-family: monospace;">${
                      doc.fileName
                    } (${doc.fileSize || "Attached"})</span>`
                  : ""
              }
            </div>
          </div>
          <span style="font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 9999px; background: ${
            isReady ? "#dcfce7" : "#f1f5f9"
          }; color: ${isReady ? "#15803d" : "#64748b"};">
            ${isReady ? "Ready & Attached" : "Missing"}
          </span>
        </div>
      `;
    }).join("");

    const recsHtml = readiness.recommendations
      .map(
        (rec) =>
          `<li style="margin-bottom: 8px;"><strong>Action:</strong> ${rec}</li>`
      )
      .join("");

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PaymentShield Evidence Pack — ${payment.clientName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 40px;
      background-color: #f8fafc;
      color: #0f172a;
      line-height: 1.5;
    }
    .container {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #1e40af;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .logo-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #1e40af;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: -0.02em;
    }
    .meta-text {
      font-size: 12px;
      color: #64748b;
      text-align: right;
    }
    .score-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #fafafa;
      border: 1px solid #e2e8f0;
      color: #0f172a;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #475569;
      margin-top: 28px;
      margin-bottom: 12px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .data-row {
      background: #f8fafc;
      padding: 10px 14px;
      border-radius: 6px;
      border: 1px solid #f1f5f9;
    }
    .data-label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      display: block;
      margin-bottom: 4px;
    }
    .data-val {
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
    }
    .ai-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
      font-size: 13px;
      color: #1e3a8a;
      line-height: 1.6;
    }
    .checklist {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      margin: 16px 0;
    }
    .recommendations-list {
      margin: 12px 0 24px 0;
      padding-left: 20px;
      font-size: 13px;
      color: #334155;
    }
    .disclaimer {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
      margin-top: 32px;
      font-size: 11px;
      color: #64748b;
      line-height: 1.5;
    }
    @media print {
      body {
        padding: 0;
        background: #ffffff;
      }
      .container {
        border: none;
        box-shadow: none;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="logo-badge">
          <span>PaymentShield</span>
        </div>
        <h1 style="margin: 10px 0 4px 0; font-size: 22px; color: #0f172a;">Payment Evidence Pack</h1>
        <p style="margin: 0; font-size: 13px; color: #64748b;">Verification Dossier &amp; Transaction Readiness Record</p>
      </div>
      <div class="meta-text">
        <strong>Generated:</strong> ${generatedDate}<br>
        <strong>Dossier ID:</strong> PS-EP-${Math.floor(100000 + Math.random() * 900000)}<br>
        <strong>Reference:</strong> ${payment.paymentType || "Payment"}
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; background: #fafafa; padding: 16px 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 24px;">
      <div>
        <span style="font-size: 12px; color: #64748b; font-weight: 500;">Payment Readiness Score</span>
        <div style="font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-top: 2px;">
          ${readiness.score}<span style="font-size: 14px; font-weight: 500; color: #94a3b8;">/100</span>
        </div>
      </div>
      <div class="score-badge">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: ${
          readiness.levelColor.ringColor
        };"></span>
        Status: ${readiness.level}
      </div>
    </div>

    <div class="section-title">Payment Details</div>
    <div class="grid">
      <div class="data-row">
        <span class="data-label">Client Name</span>
        <span class="data-val">${payment.clientName}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Payment Amount</span>
        <span class="data-val" style="color: #1e40af;">${payment.amount}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Service Type</span>
        <span class="data-val">${payment.serviceType}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Payment Type</span>
        <span class="data-val">${payment.paymentType}</span>
      </div>
      <div class="data-row" style="grid-column: span 2;">
        <span class="data-label">Payment Purpose</span>
        <span class="data-val">${payment.purpose}</span>
      </div>
    </div>

    <div class="section-title">Documentation Checklist</div>
    <div class="checklist">
      ${checklistHtml}
    </div>

    <div class="section-title">AI Readiness Summary</div>
    <div class="ai-box">
      <strong>Readiness Assessment:</strong><br>
      &ldquo;${readiness.aiExplanation}&rdquo;
    </div>

    <div class="section-title">Recommended Actions</div>
    <ul class="recommendations-list">
      ${recsHtml}
    </ul>

    <div class="disclaimer">
      <strong>Disclaimer:</strong> PaymentShield provides preparation guidance and evidence-record organization for freelancers. PaymentShield does not make or guarantee payment-provider decisions, prevent account suspension, predict internal processor rules, or bypass risk systems.
    </div>
  </div>
</body>
</html>`;

    // Trigger download
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PaymentShield-Evidence-Pack.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloading(false);
    }, 800);
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
            <Link
              href="/documents"
              className="text-slate-400 hover:text-slate-700 transition-colors text-sm"
            >
              Documents
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-medium text-slate-700">
              Evidence Pack
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              id="download-evidence-pack-top-btn"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              {downloading ? "Preparing download…" : "Download Evidence Pack"}
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-4xl mx-auto px-8 py-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 text-xs font-semibold mb-2">
                  <Shield className="w-3.5 h-3.5 text-blue-700" />
                  Verified Evidence Pack
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Evidence Pack Preview
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Consolidated payment readiness record ready for documentation review.
                </p>
              </div>

              {/* Dynamic Status and Score */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/60 p-4 rounded-xl">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Readiness
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900">
                    {readiness.score}
                    <span className="text-sm font-medium text-slate-400">/100</span>
                  </span>
                </div>
                <div className="h-9 w-px bg-slate-200" />
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Status
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-0.5 ${readiness.levelColor.badgeBg} ${readiness.levelColor.badgeText} border ${readiness.levelColor.border}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${readiness.levelColor.dotBg}`}
                    />
                    {readiness.level}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Payment Details */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-700" />
                Payment Details
              </h2>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Active Record
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 uppercase flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Client
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  {payment.clientName}
                </p>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 uppercase flex items-center gap-1.5 mb-1">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  Amount
                </span>
                <p className="text-base font-bold text-blue-900">
                  {payment.amount}
                </p>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 uppercase flex items-center gap-1.5 mb-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  Service
                </span>
                <p className="text-sm font-semibold text-slate-800">
                  {payment.serviceType}
                </p>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 uppercase flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Payment Type
                </span>
                <p className="text-xs font-semibold text-slate-800">
                  {payment.paymentType}
                </p>
              </div>

              <div className="sm:col-span-2 bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 uppercase flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Payment Purpose
                </span>
                <p className="text-xs text-slate-700">{payment.purpose}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Documentation Checklist */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileSignature className="w-4 h-4 text-blue-700" />
                Documentation Checklist
              </h2>
              <Link
                href="/documents"
                className="text-xs text-blue-700 hover:text-blue-800 font-medium inline-flex items-center gap-1"
              >
                <FileUp className="w-3.5 h-3.5" />
                Manage documents →
              </Link>
            </div>

            <div className="divide-y divide-slate-100 rounded-lg border border-slate-200/80 overflow-hidden">
              {CHECKLIST_ITEMS.map((item) => {
                const doc = documents[item.id];
                const isReady = !!doc;
                return (
                  <div
                    key={item.id}
                    className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isReady ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {item.name}
                        </p>
                        {doc && (
                          <p className="text-[10px] text-slate-500 font-mono">
                            {doc.fileName} {doc.fileSize && `(${doc.fileSize})`}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      {isReady ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200/60">
                          Ready &amp; Attached
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          Missing
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: AI Summary */}
          <div className="bg-white rounded-xl border border-blue-100 p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-700 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-1">
                  AI Summary
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed bg-blue-50/50 p-3.5 rounded-lg border border-blue-100/60">
                  &ldquo;{readiness.aiExplanation}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Recommended Actions */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Recommended Actions
            </h2>

            <ul className="space-y-2.5 text-xs text-slate-700">
              {readiness.recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>Action:</strong> {rec}
                  </span>
                </li>
              ))}
            </ul>

            {/* Action Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                id="back-to-dashboard-btn"
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Dashboard
              </Link>

              <button
                id="download-evidence-pack-bottom-btn"
                onClick={handleDownload}
                disabled={downloading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                {downloading ? "Preparing file…" : "Download Evidence Pack"}
              </button>
            </div>
          </div>

          {/* Regulatory Disclaimer */}
          <p className="text-[11px] text-slate-400 text-center leading-relaxed max-w-2xl mx-auto">
            PaymentShield provides preparation guidance and record organization. PaymentShield does not predict, control, or guarantee payment-provider risk, compliance, or release decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
