"use client";

import Link from "next/link";
import { Shield } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-900 transition-colors">
            <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-slate-900 font-semibold text-[15px] tracking-tight">
            PaymentShield
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            How it works
          </a>
          <a
            href="#features"
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            Features
          </a>
          <a
            href="#for-freelancers"
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            For Freelancers
          </a>
        </div>

        {/* CTA button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
        >
          Open Dashboard
        </Link>
      </div>
    </nav>
  );
}
