import { Sparkles, AlertCircle } from "lucide-react";

export default function AIInsightCard() {
  return (
    <div
      id="ai-insight-card"
      className="bg-white rounded-xl border border-blue-100 overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-3.5 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
          AI Insight
        </span>
        <span className="ml-auto text-[10px] text-blue-400 font-medium">
          Powered by AI
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-4 flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <p className="text-sm text-slate-700 leading-relaxed">
            Your upcoming{" "}
            <span className="font-semibold text-slate-900">
              Acme Technologies
            </span>{" "}
            payment is{" "}
            <span className="text-amber-700 font-medium">
              significantly higher
            </span>{" "}
            than your typical payment volume. Consider preparing your invoice,
            SOW, and client confirmation before requesting payment.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              id="ai-insight-prepare"
              className="text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              Prepare now
            </button>
            <button
              id="ai-insight-dismiss"
              className="text-xs font-medium text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
