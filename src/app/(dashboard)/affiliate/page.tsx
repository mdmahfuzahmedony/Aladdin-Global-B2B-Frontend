import { MousePointerClick, ShoppingBag, Wallet, Clock } from "lucide-react";

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

export default function AffiliateOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-[#12233F]">Overview</h1>
        <span className="text-[13px] text-slate-500">আজ, ৮ সেপ্টেম্বর ২০২৬</span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="মোট Click" value="1,240" icon={MousePointerClick} />
        <StatCard label="মোট Conversion" value="38" icon={ShoppingBag} accent="success" />
        <StatCard label="Pending Commission" value="৳2,150" icon={Clock} accent="warning" />
        <StatCard label="মোট Paid" value="৳9,800" icon={Wallet} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-[14px] font-semibold text-[#12233F]">
          সাম্প্রতিক Referral Sale
        </h2>
        <div className="divide-y divide-slate-100 text-[13px]">
          {[
            { product: "Wireless Earbuds — Carton of 50", source: "Link", amount: "৳125" },
            { product: "Skincare Combo Set — Case of 30", source: "Coupon", amount: "৳65" },
            { product: "Smart Watch Pro — Carton of 40", source: "Link", amount: "৳210" },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <div>
                <div className="font-medium text-slate-800">{row.product}</div>
                <div className="text-slate-500">সোর্স: {row.source}</div>
              </div>
              <span className="font-semibold text-[#1F7A4D]">{row.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}