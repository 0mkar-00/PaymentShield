import { TrendingUp, AlertTriangle, FileText, Package } from "lucide-react";

const cards = [
  {
    id: "card-readiness",
    title: "Payment Readiness",
    value: "87%",
    change: "+8% this month",
    changePositive: true,
    icon: TrendingUp,
    iconBg: "bg-green-50",
    iconColor: "text-green-700",
    valueColor: "text-green-700",
  },
  {
    id: "card-at-risk",
    title: "At-Risk Revenue",
    value: "₹2,50,000",
    change: "1 payment",
    changePositive: false,
    icon: AlertTriangle,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    valueColor: "text-slate-900",
  },
  {
    id: "card-documents",
    title: "Documents",
    value: "12",
    change: "2 need attention",
    changePositive: false,
    icon: FileText,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
    valueColor: "text-slate-900",
  },
  {
    id: "card-evidence-packs",
    title: "Evidence Packs",
    value: "8",
    change: "Ready to download",
    changePositive: true,
    icon: Package,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-700",
    valueColor: "text-slate-900",
  },
];

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            className="bg-white rounded-xl border border-slate-100 p-5 hover:border-slate-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-slate-500">{card.title}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                <Icon className={`w-4 h-4 ${card.iconColor}`} strokeWidth={2} />
              </div>
            </div>
            <p className={`text-2xl font-bold tracking-tight ${card.valueColor}`}>
              {card.value}
            </p>
            <p
              className={`text-xs mt-1 font-medium ${
                card.changePositive ? "text-green-600" : "text-amber-600"
              }`}
            >
              {card.change}
            </p>
          </div>
        );
      })}
    </div>
  );
}
