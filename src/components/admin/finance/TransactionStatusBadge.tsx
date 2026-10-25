"use client";

type Props = {
  status: string;
};

export default function TransactionStatusBadge({ status }: Props) {
  const s = String(status || "").toUpperCase();

  const styles: Record<string, string> = {
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
    CONFIRMED: "bg-cyan-50 text-cyan-700 border-cyan-200",
    FAILED: "bg-red-50 text-red-700 border-red-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
        styles[s] || "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
}
