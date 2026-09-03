import Sidebar from "@/components/layout/Sidebar";
import SummaryCards from "@/components/dashboard/SummaryCards";
import PaymentsTable from "@/components/dashboard/PaymentsTable";
import AIInsightCard from "@/components/dashboard/AIInsightCard";
import { Bell } from "lucide-react";

export const metadata = {
  title: "Dashboard — PaymentShield",
  description: "Manage your payment readiness with PaymentShield.",
};

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100 px-8 h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="notifications-btn"
              className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            </button>
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
              F
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="px-8 py-8 space-y-8 max-w-6xl">
          {/* Greeting */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Good afternoon 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Stay prepared for your next payment.
            </p>
          </div>

          {/* Summary cards */}
          <SummaryCards />

          {/* Two-column layout */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
            {/* Payments table */}
            <PaymentsTable />

            {/* AI Insight */}
            <div className="space-y-4">
              <AIInsightCard />

              {/* Quick tips card */}
              <div className="bg-white rounded-xl border border-slate-100 p-5">
                <p className="text-xs font-semibold text-slate-900 mb-3">
                  Quick Checklist
                </p>
                <ul className="space-y-2.5">
                  {[
                    { label: "Invoice prepared", done: true },
                    { label: "Statement of Work attached", done: true },
                    { label: "Client email confirmation", done: false },
                    { label: "Bank account verified", done: true },
                  ].map((item) => (
                    <li key={item.label} className="flex items-center gap-2.5">
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                          item.done
                            ? "bg-green-100 text-green-600"
                            : "bg-slate-100 text-slate-300"
                        }`}
                      >
                        {item.done ? (
                          <svg
                            className="w-2.5 h-2.5"
                            fill="none"
                            viewBox="0 0 12 12"
                          >
                            <path
                              d="M2 6l3 3 5-5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        )}
                      </span>
                      <span
                        className={`text-xs ${
                          item.done ? "text-slate-700" : "text-slate-400"
                        }`}
                      >
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
