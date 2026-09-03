import { ArrowUpRight } from "lucide-react";

type PaymentStatus = "Needs Review" | "Ready" | "Missing Documents";

interface Payment {
  id: string;
  client: string;
  amount: string;
  service: string;
  status: PaymentStatus;
  readiness: number;
}

const payments: Payment[] = [
  {
    id: "payment-acme",
    client: "Acme Technologies",
    amount: "₹2,50,000",
    service: "Website Development",
    status: "Needs Review",
    readiness: 72,
  },
  {
    id: "payment-nova",
    client: "Nova Labs",
    amount: "₹85,000",
    service: "UI/UX Consulting",
    status: "Ready",
    readiness: 96,
  },
  {
    id: "payment-brightpath",
    client: "BrightPath",
    amount: "₹1,20,000",
    service: "Software Development",
    status: "Missing Documents",
    readiness: 64,
  },
];

const statusConfig: Record<
  PaymentStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  "Needs Review": {
    label: "Needs Review",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  Ready: {
    label: "Ready",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  "Missing Documents": {
    label: "Missing Documents",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

function ReadinessBar({ value }: { value: number }) {
  const color =
    value >= 90
      ? "bg-green-500"
      : value >= 70
        ? "bg-amber-400"
        : "bg-red-400";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-600 w-8 text-right">
        {value}%
      </span>
    </div>
  );
}

export default function PaymentsTable() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Payments Requiring Attention
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {payments.length} payments need action
          </p>
        </div>
        <button className="text-xs font-medium text-blue-700 hover:text-blue-800 transition-colors">
          View all
        </button>
      </div>

      {/* Table */}
      <div className="divide-y divide-slate-50">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_120px_160px_140px_80px] gap-4 px-6 py-3 bg-slate-50/50">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Client / Service
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Amount
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Status
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Readiness
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Action
          </span>
        </div>

        {/* Rows */}
        {payments.map((payment) => {
          const status = statusConfig[payment.status];
          return (
            <div
              key={payment.id}
              id={payment.id}
              className="grid grid-cols-[1fr_120px_160px_140px_80px] gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors"
            >
              {/* Client */}
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {payment.client}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{payment.service}</p>
              </div>

              {/* Amount */}
              <div>
                <span className="text-sm font-semibold text-slate-900">
                  {payment.amount}
                </span>
              </div>

              {/* Status badge */}
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>

              {/* Readiness */}
              <div>
                <ReadinessBar value={payment.readiness} />
              </div>

              {/* Action */}
              <div>
                <button
                  id={`review-${payment.id}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Review
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
