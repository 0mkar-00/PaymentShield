import { Info } from "lucide-react";

export default function TrustBanner() {
  return (
    <section className="py-10 px-6 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start md:items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
          <div className="flex-shrink-0 mt-0.5 md:mt-0">
            <Info className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="font-medium text-slate-700">Disclaimer: </span>
            PaymentShield provides preparation assistance and does not determine
            or guarantee Razorpay account or transaction decisions.
          </p>
        </div>
      </div>
    </section>
  );
}
