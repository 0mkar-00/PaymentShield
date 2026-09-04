import Link from "next/link";
import { AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function AIInsightCard() {
  return (
    <div
      id="ai-insight-card"
      className="bg-[#0e1626] rounded-xl border border-[#1a2438] overflow-hidden shadow-xs"
    >
      {/* Header */}
      <div className="px-5 py-3 bg-[#0a101d] border-b border-[#1a2438] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Preparation Priority
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono bg-[#141e33] px-2 py-0.5 rounded border border-[#1f2d47]">
          Signal Evaluation
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3.5">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-800/60 flex items-center justify-center flex-shrink-0 text-amber-400 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">
              Action Required: BrightPath Solutions Discrepancy
            </p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Payment request is <span className="text-slate-200 font-semibold font-mono">₹1,20,000</span>, but the indexed invoice reflects <span className="text-amber-400 font-semibold font-mono">₹1,00,000</span>. Review the invoice figure before requesting payout.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#162238] flex items-center justify-between">
          <Link
            id="ai-insight-prepare"
            href="/payments/analysis"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors"
          >
            Inspect consistency findings
            <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            href="/ai-advisor"
            className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            View Advisor Roadmap →
          </Link>
        </div>
      </div>
    </div>
  );
}
