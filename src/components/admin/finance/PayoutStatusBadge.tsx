"use client";

type Props = {
  status: string;
};

export default function PayoutStatusBadge({ status }: Props) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
    PROCESSING: "bg-blue-50 text-blue-700 border-blue-100",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    REJECTED: "bg-red-50 text-red-700 border-red-100",
    PAID: "bg-green-50 text-green-700 border-green-100",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        styles[status] || "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
}