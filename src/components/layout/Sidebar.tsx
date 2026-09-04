"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import {
  Shield,
  LayoutDashboard,
  CreditCard,
  FileText,
  Package,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    id: "nav-dashboard",
  },
  {
    label: "Check a Payment",
    href: "/payments/new",
    icon: CreditCard,
    id: "nav-payments",
  },
  {
    label: "Documents",
    href: "/documents",
    icon: FileText,
    id: "nav-documents",
  },
  {
    label: "Evidence Pack",
    href: "/evidence-pack",
    icon: Package,
    id: "nav-evidence-pack",
  },
  {
    label: "AI Advisor",
    href: "/ai-advisor",
    icon: Sparkles,
    id: "nav-ai-advisor",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-60 flex-shrink-0 bg-[#0a0f1d] border-r border-[#1a2438] flex flex-col h-screen sticky top-0 select-none">
      {/* Logo & Identity */}
      <div className="px-5 h-16 flex items-center border-b border-[#1a2438]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-xs transition-colors group-hover:bg-emerald-500">
            <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm tracking-tight">
              PaymentShield
            </span>
            <span className="text-[10px] text-slate-400 leading-tight">
              Payment Readiness
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Label */}
      <div className="px-5 pt-6 pb-2">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
          Navigation
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              id={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#14233a] text-emerald-400 border border-emerald-500/40 shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-[#111c30]"
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? "text-emerald-400" : "text-slate-500"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Area & Theme Toggle */}
      <div className="p-3 border-t border-[#1a2438] bg-[#070b14] space-y-2">
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[#0e1729] border border-[#1a2438]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-xs font-bold text-emerald-300">
              F
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Freelancer</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-400">Shield Active</span>
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#16223a] transition-colors"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
