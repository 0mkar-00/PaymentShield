import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import SummaryCards from "@/components/dashboard/SummaryCards";
import PaymentsTable from "@/components/dashboard/PaymentsTable";
import AIInsightCard from "@/components/dashboard/AIInsightCard";
import DemoScenarioSelector from "@/components/dashboard/DemoScenarioSelector";
import { Plus, ShieldAlert, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Dashboard — PaymentShield",
  description: "Payment readiness overview and document verification for freelancers.",
};

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#090d16] text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#090d16]/95 backdrop-blur-md border-b border-[#1a2438] px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Payment Readiness Overview
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              id="btn-check-payment-nav"
              href="/payments/new"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              Check a Payment
            </Link>
          </div>
        </div>

        {/* Page content */}
        <div className="px-8 py-8 space-y-7 max-w-6xl">
          {/* Greeting & Primary CTA Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Payment Operations
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">All systems normal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Payment readiness overview
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-xl leading-relaxed">
                Review verified supporting documentation, evaluate agreement consistency, and prepare audit-ready evidence packs before payment reviews.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                id="btn-check-payment"
                href="/payments/new"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-sm ring-1 ring-emerald-400/40"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Check a Payment
              </Link>
            </div>
          </div>

          {/* Demo Scenario Switcher Strip */}
          <DemoScenarioSelector currentScenarioId="ready-payment" redirectToAnalysis={true} />

          {/* Metrics summary cards */}
          <SummaryCards />

          {/* Two-column layout: Payments Table + AI Insights & Checklist */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_330px] gap-6">
            {/* Payments table */}
            <PaymentsTable />

            {/* AI Insight & Quick Checklist */}
            <div className="space-y-5">
              <AIInsightCard />

              {/* Quick Readiness Checklist card */}
              <div className="bg-[#0e1626] rounded-xl border border-[#1a2438] p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3.5">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    Readiness Standard
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Audit Baseline
                  </span>
                </div>
                <ul className="space-y-3">
                  {[
                    { label: "Itemized tax invoice indexed", done: true },
                    { label: "Signed SOW or agreement attached", done: true },
                    { label: "Payment amount consistency verified", done: false },
                    { label: "Client communication trail available", done: true },
                    { label: "Deliverable proof-of-work archived", done: true },
                  ].map((item) => (
                    <li key={item.label} className="flex items-start gap-2.5">
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          item.done
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800/80"
                            : "bg-[#141e33] text-slate-500 border border-[#1f2d47]"
                        }`}
                      >
                        {item.done ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        )}
                      </span>
                      <span
                        className={`text-xs leading-tight ${
                          item.done ? "text-slate-300" : "text-slate-400"
                        }`}
                      >
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Regulatory preparation disclaimer */}
              <div className="p-3.5 rounded-xl bg-[#090e1a] border border-[#162033] flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  PaymentShield assists in preparing records for freelancer transactions. It does not predict or guarantee gateway compliance decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
