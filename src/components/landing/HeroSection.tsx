import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
            AI-Powered Payment Readiness
          </div>

          {/* Headline */}
          <h1 className="text-[48px] md:text-[56px] font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
            Be ready before your{" "}
            <span className="text-blue-800">payment gets reviewed.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-2xl">
            PaymentShield helps freelancers prepare, verify, and organize the
            documentation behind high-value payments with AI.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/payments/new"
              id="cta-check-payment"
              className="inline-flex items-center gap-2 bg-blue-800 text-white font-medium text-sm px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
            >
              Check a Payment
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              id="cta-see-how"
              className="inline-flex items-center gap-2 text-slate-600 font-medium text-sm px-6 py-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
