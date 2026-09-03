"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  CreditCard,
  FileText,
  Sparkles,
  Settings,
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
    icon: Sparkles,
    id: "nav-evidence-pack",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 h-16 flex items-center border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-800 rounded-lg flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-slate-900 font-semibold text-sm tracking-tight">
            PaymentShield
          </span>
        </Link>
      </div>

      {/* Divider label */}
      <div className="px-5 pt-6 pb-2">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Navigation
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              id={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? "text-blue-700" : "text-slate-400"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user area */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
            F
          </div>
          <div>
            <p className="text-xs font-medium text-slate-800">Freelancer</p>
            <p className="text-[10px] text-slate-400">Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
