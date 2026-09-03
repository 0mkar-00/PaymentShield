import { ShieldCheck, FileSearch, Package } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
    title: "Payment Readiness",
    description:
      "Identify missing information before it becomes a problem.",
    id: "feature-readiness",
  },
  {
    icon: FileSearch,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-700",
    title: "Document Intelligence",
    description:
      "Let AI review invoices, SOWs, and supporting documents.",
    id: "feature-documents",
  },
  {
    icon: Package,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
    title: "Evidence Pack",
    description:
      "Organize the information you may need for a payment review.",
    id: "feature-evidence",
  },
];

export default function FeatureCards() {
  return (
    <section id="features" className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Everything you need to stay prepared
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                id={feature.id}
                className="bg-white rounded-2xl border border-slate-100 p-6 hover:border-slate-200 hover:shadow-sm transition-all duration-200"
              >
                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${feature.iconBg}`}
                >
                  <Icon className={`w-5 h-5 ${feature.iconColor}`} strokeWidth={2} />
                </div>

                {/* Text */}
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
