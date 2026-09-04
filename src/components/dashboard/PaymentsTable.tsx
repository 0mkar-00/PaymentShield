"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import { applyScenario } from "@/lib/demo-scenarios";

type PaymentStatus = "Ready" | "Needs Attention" | "Significant Mismatch";

interface PaymentRow {
  id: "payment-acme" | "payment-nova" | "payment-brightpath";
  scenarioId: "ready-payment" | "missing-documents" | "invoice-mismatch";
  client: string;
  amount: string;
  service: string;
  status: PaymentStatus;
  statusDetail: string;
  readiness: number;
}

const demoPayments: PaymentRow[] = [
  {
    id: "payment-acme",
    scenarioId: "ready-payment",
    client: "Acme Technologies",
    amount: "₹2,50,000",
    service: "Website Development",
    status: "Ready",
    statusDetail: "All records verified",
    readiness: 96,
  },
  {
    id: "payment-nova",
    scenarioId: "missing-documents",
    client: "Nova Labs",
    amount: "₹85,000",
    service: "UI/UX Consulting",
    status: "Needs Attention",
    statusDetail: "Missing SOW & proof",
    readiness: 62,
  },
  {
    id: "payment-brightpath",
    scenarioId: "invoice-mismatch",
    client: "BrightPath Solutions",
    amount: "₹1,20,000",
    service: "Software Development",
    status: "Significant Mismatch",
    statusDetail: "Invoice ₹1,00,000 vs ₹1,20,000",
    readiness: 56,
  },
];

const statusStyles: Record<
  PaymentStatus,
  { bg: string; text: string; border: string; dot: string; icon: typeof CheckCircle2 }
> = {
  Ready: {
    bg: "bg-emerald-950/60",
    text: "text-emerald-400",
    border: "border-emerald-800/60",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  "Needs Attention": {
    bg: "bg-amber-950/60",
    text: "text-amber-400",
    border: "border-amber-800/60",
    dot: "bg-amber-500",
    icon: AlertCircle,
  },
  "Significant Mismatch": {
    bg: "bg-red-950/60",
    text: "text-red-400",
    border: "border-red-800/60",
    dot: "bg-red-500",
    icon: AlertTriangle,
  },
};

function ReadinessBar({ value }: { value: number }) {
  const color =
    value >= 90
      ? "bg-emerald-500"
      : value >= 70
      ? "bg-blue-500"
      : value >= 60
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 bg-[#162238] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-300 w-8 text-right font-mono">
        {value}%
      </span>
    </div>
  );
}

export default function PaymentsTable() {
  const router = useRouter();

  const handleReview = (row: PaymentRow) => {
    applyScenario(row.scenarioId);
    const params = new URLSearchParams({
      client: row.client,
      amount: row.amount,
      service: row.service,
    });
    router.push(`/payments/analysis?${params.toString()}`);
  };

  return (
    <div className="bg-[#0e1626] rounded-xl border border-[#1a2438] overflow-hidden shadow-xs">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-[#1a2438] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            Active Payments Requiring Preparation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any payment row to inspect its readiness signals and document evidence
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 bg-[#141e33] px-2.5 py-1 rounded-md border border-[#1f2d47]">
          3 Demo Scenarios
        </span>
      </div>

      {/* Table Content */}
      <div className="divide-y divide-[#151f33]">
        {/* Column Titles */}
        <div className="hidden sm:grid grid-cols-[1.2fr_110px_160px_140px_90px] gap-4 px-6 py-3 bg-[#0a101d] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Client / Engagement</span>
          <span>Amount</span>
          <span>Readiness Status</span>
          <span>Readiness Score</span>
          <span className="text-right">Action</span>
        </div>

        {/* Rows */}
        {demoPayments.map((p) => {
          const cfg = statusStyles[p.status];
          const Icon = cfg.icon;

          return (
            <div
              key={p.id}
              id={p.id}
              onClick={() => handleReview(p)}
              className="grid grid-cols-1 sm:grid-cols-[1.2fr_110px_160px_140px_90px] gap-3 sm:gap-4 px-6 py-4 items-center hover:bg-[#121c30] transition-colors cursor-pointer group"
            >
              {/* Client & Service */}
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  {p.client}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{p.service}</p>
              </div>

              {/* Amount */}
              <div>
                <span className="text-sm font-bold text-slate-100 font-mono">
                  {p.amount}
                </span>
              </div>

              {/* Status Badge */}
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{p.status}</span>
                </span>
                <span className="block text-[10px] text-slate-400 mt-1 truncate">
                  {p.statusDetail}
                </span>
              </div>

              {/* Readiness Score Bar */}
              <div>
                <ReadinessBar value={p.readiness} />
              </div>

              {/* Action Button */}
              <div className="text-right">
                <button
                  type="button"
                  id={`review-${p.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReview(p);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-white bg-[#14233a] hover:bg-emerald-700/50 border border-emerald-500/40 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Inspect
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
