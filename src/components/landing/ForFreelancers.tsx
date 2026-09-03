import { Shield } from "lucide-react";

export default function ForFreelancers() {
  return (
    <section id="for-freelancers" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-br from-blue-800 to-blue-950 p-12 text-white">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-blue-300" />
              <span className="text-blue-300 text-sm font-medium">
                For Freelancers
              </span>
            </div>
            <h2 className="text-3xl font-bold leading-tight mb-4 tracking-tight">
              Stop worrying about payment holds.
            </h2>
            <p className="text-blue-100 text-base leading-relaxed mb-8">
              High-value payments can trigger additional reviews. PaymentShield
              helps you prepare the right documentation so you&apos;re never
              caught off-guard.
            </p>
            <ul className="space-y-3">
              {[
                "Know which documents to prepare before requesting payment",
                "Get AI analysis of your invoices and SOWs",
                "Build an evidence pack in minutes, not hours",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                  <span className="text-blue-100 text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
