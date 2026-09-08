import { Wallet, ShoppingCart, CalendarClock } from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  accent = "default",
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent?: "default" | "warning" | "success";
}) {
  const valueColor =
    accent === "warning"
      ? "text-[#D6A419]"
      : accent === "success"
      ? "text-[#1F7A4D]"
      : "text-[#12233F]";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
        <Icon size={14} />
        {label}
      </div>
      <div className={`mt-1.5 text-2xl font-semibold ${valueColor}`}>
        {value}
      </div>
    </div>
  );
}

export default function WholesalerOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-[#12233F]">
          Business Profile
        </h1>
        <span className="text-[13px] text-slate-500">আজ, ৮ সেপ্টেম্বর ২০২৬</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Credit Limit" value="৳2,00,000" icon={Wallet} />
        <StatCard label="বর্তমান Due" value="৳45,000" icon={CalendarClock} accent="warning" />
        <StatCard label="মোট Order" value="32" icon={ShoppingCart} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-[14px] font-semibold text-[#12233F]">
          Business Info
        </h2>
        <div className="grid grid-cols-2 gap-4 text-[13px]">
          <div>
            <div className="text-[11.5px] text-slate-500">Business Name</div>
            <div>Karim Traders</div>
          </div>
          <div>
            <div className="text-[11.5px] text-slate-500">Trade License No.</div>
            <div>TL-2026-04471</div>
          </div>
          <div>
            <div className="text-[11.5px] text-slate-500">Verification Status</div>
            <span className="inline-block rounded-full bg-[#EAF5EE] px-2.5 py-1 text-[11.5px] text-[#1F7A4D]">
              Approved
            </span>
          </div>
          <div>
            <div className="text-[11.5px] text-slate-500">Due Date (পরবর্তী)</div>
            <div>২০ সেপ্টেম্বর ২০২৬</div>
          </div>
        </div>
      </div>
    </div>
  );
}