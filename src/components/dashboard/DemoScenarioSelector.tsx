"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_SCENARIOS, applyScenario } from "@/lib/demo-scenarios";
import { CheckCircle2, AlertCircle, AlertTriangle, Loader2 } from "lucide-react";

interface DemoScenarioSelectorProps {
  currentScenarioId?: string;
  onScenarioChange?: (scenarioId: string) => void;
  redirectToAnalysis?: boolean;
}

export default function DemoScenarioSelector({
  currentScenarioId = "ready-payment",
  onScenarioChange,
  redirectToAnalysis = false,
}: DemoScenarioSelectorProps) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string>(currentScenarioId);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [transitionStep, setTransitionStep] = useState<string>("");

  const handleSelect = async (id: "ready-payment" | "missing-documents" | "invoice-mismatch") => {
    if (transitioning) return;
    setActiveId(id);
    setTransitioning(true);

    // Fast, crisp evaluation sequence (approx 500ms total)
    setTransitionStep("Loading payment records…");
    await new Promise((r) => setTimeout(r, 160));

    setTransitionStep("Evaluating readiness & documents…");
    await new Promise((r) => setTimeout(r, 180));

    setTransitionStep("Checking document consistency…");
    await new Promise((r) => setTimeout(r, 160));

    applyScenario(id);

    setTransitioning(false);
    setTransitionStep("");

    if (onScenarioChange) {
      onScenarioChange(id);
    }

    if (redirectToAnalysis) {
      const scenario = DEMO_SCENARIOS[id];
      const params = new URLSearchParams({
        client: scenario.payment.clientName || "",
        amount: String(scenario.payment.amount || ""),
        service: scenario.payment.serviceType || "",
        purpose: scenario.payment.purpose || "",
        paymentType: scenario.payment.paymentType || "",
      });
      router.push(`/payments/analysis?${params.toString()}`);
    }
  };

  return (
    <div className="bg-[#0e1626] border border-[#1a2438] rounded-xl p-3.5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
            TRY A SCENARIO
          </span>
          <span className="text-xs text-slate-400">
            Select a live demo to test how PaymentShield evaluates different risk signals
          </span>
        </div>

        {transitioning && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 animate-pulse font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{transitionStep}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Scenario 1 */}
        <button
          type="button"
          id="scenario-btn-ready"
          disabled={transitioning}
          onClick={() => handleSelect("ready-payment")}
          className={`px-3 py-2 rounded-lg text-left transition-all border flex items-center justify-between ${
            activeId === "ready-payment"
              ? "bg-[#14233a] border-emerald-500/60 text-white shadow-sm ring-1 ring-emerald-500/30"
              : "bg-[#0a101d] border-[#1a2438] text-slate-300 hover:border-slate-700 hover:bg-[#0f1729]"
          }`}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <p className="text-xs font-semibold truncate">Ready Payment</p>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Acme Tech • ₹2,50,000
            </p>
          </div>
          <CheckCircle2
            className={`w-4 h-4 flex-shrink-0 ${
              activeId === "ready-payment" ? "text-emerald-400" : "text-slate-600"
            }`}
          />
        </button>

        {/* Scenario 2 */}
        <button
          type="button"
          id="scenario-btn-missing"
          disabled={transitioning}
          onClick={() => handleSelect("missing-documents")}
          className={`px-3 py-2 rounded-lg text-left transition-all border flex items-center justify-between ${
            activeId === "missing-documents"
              ? "bg-[#1e1c14] border-amber-500/60 text-white shadow-sm ring-1 ring-amber-500/30"
              : "bg-[#0a101d] border-[#1a2438] text-slate-300 hover:border-slate-700 hover:bg-[#0f1729]"
          }`}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <p className="text-xs font-semibold truncate">Missing Documents</p>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Nova Labs • ₹85,000
            </p>
          </div>
          <AlertCircle
            className={`w-4 h-4 flex-shrink-0 ${
              activeId === "missing-documents" ? "text-amber-400" : "text-slate-600"
            }`}
          />
        </button>

        {/* Scenario 3 */}
        <button
          type="button"
          id="scenario-btn-mismatch"
          disabled={transitioning}
          onClick={() => handleSelect("invoice-mismatch")}
          className={`px-3 py-2 rounded-lg text-left transition-all border flex items-center justify-between ${
            activeId === "invoice-mismatch"
              ? "bg-[#241318] border-red-500/60 text-white shadow-sm ring-1 ring-red-500/30"
              : "bg-[#0a101d] border-[#1a2438] text-slate-300 hover:border-slate-700 hover:bg-[#0f1729]"
          }`}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <p className="text-xs font-semibold truncate">Invoice Mismatch</p>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              BrightPath • ₹1.2L vs ₹1.0L
            </p>
          </div>
          <AlertTriangle
            className={`w-4 h-4 flex-shrink-0 ${
              activeId === "invoice-mismatch" ? "text-red-400" : "text-slate-600"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
