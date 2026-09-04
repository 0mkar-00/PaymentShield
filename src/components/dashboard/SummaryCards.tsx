import Link from "next/link";
import { TrendingUp, AlertTriangle, FileText, Package } from "lucide-react";

const cards = [
  {
    id: "card-readiness",
    title: "Payment Readiness",
    value: "88%",
    change: "+6% portfolio average",
    changePositive: true,
    icon: TrendingUp,
    iconBg: "bg-emerald-950/70 border border-emerald-800/60",
    iconColor: "text-emerald-400",
    valueColor: "text-emerald-400",
    href: "/payments/analysis",
  },
  {
    id: "card-at-risk",
    title: "At-Risk Revenue",
    value: "₹1,20,000",
    change: "1 payment has invoice mismatch",
    changePositive: false,
    icon: AlertTriangle,
    iconBg: "bg-amber-950/70 border border-amber-800/60",
    iconColor: "text-amber-400",
    valueColor: "text-amber-400",
    href: "/payments/analysis",
  },
  {
    id: "card-documents",
    title: "Document Evidence",
    value: "7 / 12",
    change: "3 documents needed",
    changePositive: false,
    icon: FileText,
    iconBg: "bg-blue-950/70 border border-blue-800/60",
    iconColor: "text-blue-400",
    valueColor: "text-white",
    href: "/documents",
  },
  {
    id: "card-evidence-packs",
    title: "Evidence Packs",
    value: "3 Ready",
    change: "Consolidated dossiers",
    changePositive: true,
    icon: Package,
    iconBg: "bg-purple-950/70 border border-purple-800/60",
    iconColor: "text-purple-400",
    valueColor: "text-white",
    href: "/evidence-pack",
  },
];

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.id}
            id={card.id}
            href={card.href}
            className="bg-[#0e1626] rounded-xl border border-[#1a2438] p-5 hover:border-slate-700 hover:bg-[#121c30] transition-all block group shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                {card.title}
              </p>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconBg}`}
              >
                <Icon className={`w-4 h-4 ${card.iconColor}`} strokeWidth={2} />
              </div>
            </div>
            <p className={`text-2xl font-extrabold tracking-tight font-mono ${card.valueColor}`}>
              {card.value}
            </p>
            <p
              className={`text-[11px] mt-1.5 font-medium ${
                card.changePositive ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {card.change}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
