import Link from "next/link";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-blue-800 rounded-lg flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-slate-900 font-semibold text-sm tracking-tight">
                PaymentShield
              </span>
            </Link>
            <p className="mt-2 text-xs text-slate-400 max-w-xs leading-relaxed">
              Payment readiness assistance for independent professionals.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <p className="text-xs font-medium text-slate-900 mb-3 uppercase tracking-wider">
                Product
              </p>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#how-it-works"
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-900 mb-3 uppercase tracking-wider">
                Company
              </p>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © 2025 PaymentShield. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 text-center max-w-md">
            PaymentShield provides preparation assistance and does not determine
            or guarantee Razorpay account or transaction decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
