"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import {
  ArrowLeft,
  Receipt,
  FileSignature,
  MessageSquare,
  Briefcase,
  Upload,
  CheckCircle2,
  FileCheck,
  Trash2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface DocumentItem {
  id: string;
  name: string;
  explanation: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
}

const INITIAL_DOCS: DocumentItem[] = [
  {
    id: "invoice",
    name: "Invoice",
    explanation: "Proof of the amount and payment request.",
    icon: Receipt,
  },
  {
    id: "sow_contract",
    name: "SOW / Contract",
    explanation: "Shows the agreed scope, milestones, and terms.",
    icon: FileSignature,
  },
  {
    id: "client_comm",
    name: "Client Communication",
    explanation: "Keeps relevant client emails or payment discussions available.",
    icon: MessageSquare,
  },
  {
    id: "proof_of_work",
    name: "Proof of Work",
    explanation: "Supports that the agreed service or milestone was delivered.",
    icon: Briefcase,
  },
];

export default function SupportingDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCS);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("paymentshield_documents");
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, { fileName: string; fileSize?: string; uploadedAt?: string }>;
        setDocuments((prev) =>
          prev.map((doc) => {
            if (parsed[doc.id]) {
              return {
                ...doc,
                fileName: parsed[doc.id].fileName,
                fileSize: parsed[doc.id].fileSize,
                uploadedAt: parsed[doc.id].uploadedAt,
              };
            }
            return doc;
          })
        );
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const saveDocumentsToStorage = (updatedDocs: DocumentItem[]) => {
    try {
      const payload: Record<string, { fileName: string; fileSize?: string; uploadedAt?: string }> = {};
      updatedDocs.forEach((doc) => {
        if (doc.fileName) {
          payload[doc.id] = {
            fileName: doc.fileName,
            fileSize: doc.fileSize,
            uploadedAt: doc.uploadedAt,
          };
        }
      });
      sessionStorage.setItem("paymentshield_documents", JSON.stringify(payload));
    } catch {
      // Ignore storage errors
    }
  };

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Format human readable size
    const sizeInKb = (file.size / 1024).toFixed(0);
    const formattedSize = `${sizeInKb} KB`;
    const dateStr = new Date().toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const updated = documents.map((doc) => {
      if (doc.id === id) {
        return {
          ...doc,
          fileName: file.name,
          fileSize: formattedSize,
          uploadedAt: dateStr,
        };
      }
      return doc;
    });

    setDocuments(updated);
    saveDocumentsToStorage(updated);
  };

  const handleRemoveFile = (id: string) => {
    const updated = documents.map((doc) => {
      if (doc.id === id) {
        return {
          ...doc,
          fileName: undefined,
          fileSize: undefined,
          uploadedAt: undefined,
        };
      }
      return doc;
    });
    setDocuments(updated);
    saveDocumentsToStorage(updated);

    // Reset input
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id]!.value = "";
    }
  };

  const uploadedCount = documents.filter((doc) => !!doc.fileName).length;
  const progressPercent = Math.round((uploadedCount / documents.length) * 100);

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
              href="/payments/analysis"
              className="text-slate-400 hover:text-slate-700 transition-colors text-sm"
            >
              Readiness Analysis
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-medium text-slate-700">
              Supporting Documents
            </span>
          </div>
        </div>

        {/* Page content */}
        <div className="max-w-4xl mx-auto px-8 py-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Supporting Documents
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Keep the evidence behind your payment organized and ready.
              </p>
            </div>

            {/* Quick Demo Pre-fill for reviewer ease */}
            {uploadedCount === 0 && (
              <button
                type="button"
                onClick={() => {
                  const demoDocs = documents.map((doc, idx) => {
                    if (idx < 2) {
                      return {
                        ...doc,
                        fileName: idx === 0 ? "Acme_Invoice_INV-2026-089.pdf" : "Acme_Signed_SOW_Phase1.pdf",
                        fileSize: idx === 0 ? "184 KB" : "342 KB",
                        uploadedAt: "Today, 10:30 AM",
                      };
                    }
                    return doc;
                  });
                  setDocuments(demoDocs);
                  saveDocumentsToStorage(demoDocs);
                }}
                className="text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors font-medium self-start md:self-auto"
              >
                Auto-fill Sample Docs
              </button>
            )}
          </div>

          {/* Progress Banner Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  uploadedCount > 0 ? "bg-blue-50 text-blue-800" : "bg-slate-100 text-slate-400"
                }`}>
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {uploadedCount} of {documents.length} documents ready
                  </h2>
                  <p className="text-xs text-slate-500">
                    {uploadedCount === 0
                      ? "Upload at least one document to generate your Evidence Pack."
                      : uploadedCount === documents.length
                      ? "All recommended documents uploaded! Your evidence pack is comprehensive."
                      : "Good progress. You can now generate an initial Evidence Pack or add more files."}
                  </p>
                </div>
              </div>

              {/* Top CTA button */}
              <button
                id="generate-evidence-pack-top-btn"
                type="button"
                disabled={uploadedCount === 0}
                onClick={() => router.push("/evidence-pack")}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors shadow-xs ${
                  uploadedCount > 0
                    ? "bg-blue-800 text-white hover:bg-blue-900 cursor-pointer"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                }`}
              >
                <span>Generate Evidence Pack</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-4">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  progressPercent === 100
                    ? "bg-green-600"
                    : progressPercent > 0
                    ? "bg-blue-800"
                    : "bg-transparent"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400 font-medium">
              <span>Readiness completion</span>
              <span>{progressPercent}%</span>
            </div>
          </div>

          {/* 4 Document Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {documents.map((doc) => {
              const Icon = doc.icon;
              const isUploaded = !!doc.fileName;

              return (
                <div
                  key={doc.id}
                  id={`doc-card-${doc.id}`}
                  className={`rounded-xl border p-5 transition-all flex flex-col justify-between ${
                    isUploaded
                      ? "bg-white border-green-200/90 shadow-xs"
                      : "bg-white border-slate-200/80 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  {/* Card Top */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            isUploaded
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            {doc.name}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold mt-0.5 px-2 py-0.5 rounded-full ${
                              isUploaded
                                ? "bg-green-50 text-green-700 border border-green-200/60"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {isUploaded ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-green-600" />
                                Uploaded
                              </>
                            ) : (
                              "Not uploaded"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {doc.explanation}
                    </p>

                    {/* Uploaded File Info Pill */}
                    {isUploaded && (
                      <div className="p-3 bg-green-50/50 rounded-lg border border-green-100 flex items-center justify-between gap-3 mb-4">
                        <div className="min-w-0 flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {doc.fileName}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {doc.fileSize} • {doc.uploadedAt}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(doc.id)}
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Upload Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      PDF, DOC, DOCX, PNG, JPG
                    </span>

                    <div>
                      {/* Hidden File Input */}
                      <input
                        ref={(el) => {
                          fileInputRefs.current[doc.id] = el;
                        }}
                        type="file"
                        id={`file-input-${doc.id}`}
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg"
                        onChange={(e) => handleFileChange(doc.id, e)}
                        className="hidden"
                      />

                      <button
                        type="button"
                        id={`upload-btn-${doc.id}`}
                        onClick={() => fileInputRefs.current[doc.id]?.click()}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                          isUploaded
                            ? "text-slate-700 bg-slate-100 hover:bg-slate-200"
                            : "text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80"
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {isUploaded ? "Replace file" : "Upload"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Ready to generate your Evidence Pack?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {uploadedCount > 0
                  ? "Your documentation will be bundled with the payment transaction analysis."
                  : "Upload at least one document above to enable generation."}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/payments/analysis"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Analysis
              </Link>

              <button
                id="generate-evidence-pack-btn"
                type="button"
                disabled={uploadedCount === 0}
                onClick={() => router.push("/evidence-pack")}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold transition-colors shadow-sm ${
                  uploadedCount > 0
                    ? "bg-blue-800 text-white hover:bg-blue-900 cursor-pointer"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                }`}
              >
                <span>Generate Evidence Pack</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-100 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800">Review readiness best practice:</span> Having both an invoice and contract/SOW ready addresses over 80% of routine verification inquiries when receiving advance or milestone payments.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
