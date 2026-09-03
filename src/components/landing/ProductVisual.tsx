import { CheckCircle2, ArrowDown } from "lucide-react";

const steps = [
  {
    label: "Payment",
    sublabel: "High-value or unusual transaction",
    color: "bg-slate-100 border-slate-200",
    textColor: "text-slate-700",
    icon: "₹",
    iconBg: "bg-slate-200",
  },
  {
    label: "AI Readiness Check",
    sublabel: "Documents, context, and risk signals",
    color: "bg-blue-50 border-blue-100",
    textColor: "text-blue-800",
    icon: "⚡",
    iconBg: "bg-blue-100",
  },
  {
    label: "Evidence Ready",
    sublabel: "Invoice, SOW, and confirmation prepared",
    color: "bg-green-50 border-green-100",
    textColor: "text-green-800",
    icon: "✓",
    iconBg: "bg-green-100",
  },
];

export default function ProductVisual() {
  return (
    <section id="how-it-works" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Three steps to payment confidence
          </h2>
          <p className="mt-3 text-slate-500 text-base max-w-lg mx-auto">
            PaymentShield walks you through each step so you&apos;re never
            caught unprepared.
          </p>
        </div>

        {/* Flow diagram */}
        <div className="flex flex-col items-center gap-0 max-w-sm mx-auto">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center w-full">
              {/* Step card */}
              <div
                className={`w-full border rounded-xl p-5 flex items-center gap-4 ${step.color}`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${step.iconBg} ${step.textColor} flex-shrink-0`}
                >
                  {step.icon}
                </div>
                <div>
                  <p className={`font-semibold text-sm ${step.textColor}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {step.sublabel}
                  </p>
                </div>
                {i === 2 && (
                  <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto flex-shrink-0" />
                )}
              </div>

              {/* Connector arrow */}
              {i < steps.length - 1 && (
                <div className="flex flex-col items-center py-2">
                  <div className="w-px h-4 bg-slate-200"></div>
                  <ArrowDown className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { value: "2 min", label: "Average readiness check" },
            { value: "94%", label: "Documentation accuracy" },
            { value: "₹0", label: "Cost to get started" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl border border-slate-100"
            >
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
