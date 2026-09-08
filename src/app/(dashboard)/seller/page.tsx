import { TrendingUp, AlertTriangle, Star } from "lucide-react";

function StatCard({
  label,
  value,
  trend,
  accent = "default",
}: {
  label: string;
  value: string;
  trend?: string;
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
      <div className="text-[12.5px] text-slate-500">{label}</div>
      <div className={`mt-1.5 text-2xl font-semibold ${valueColor}`}>
        {value}
      </div>
      {trend && (
        <div className="mt-1.5 flex items-center gap-1 text-[11.5px] font-medium text-[#1F7A4D]">
          <TrendingUp size={13} />
          {trend}
        </div>
      )}
    </div>
  );
}

export default function SellerOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-[#12233F]">Overview</h1>
        <span className="text-[13px] text-slate-500">আজ, ৮ সেপ্টেম্বর ২০২৬</span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="আজকের Sales" value="৳12,400" trend="+6% গতকাল থেকে" />
        <StatCard label="Pending Orders" value="9" accent="warning" />
        <StatCard label="মোট Products" value="86" />
        <StatCard label="Low Stock" value="4" accent="warning" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-[14px] font-semibold text-[#12233F]">
            সাম্প্রতিক Orders
          </h2>
          <div className="divide-y divide-slate-100 text-[13px]">
            {[
              { id: "#A1023", item: "Wireless Earbuds — Carton of 50", status: "Processing" },
              { id: "#A1022", item: "Fast Charger 65W — Box of 100", status: "Shipped" },
              { id: "#A1021", item: "Skincare Combo Set — Case of 30", status: "Delivered" },
            ].map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2.5">
                <div>
                  <div className="font-medium text-slate-800">{o.id}</div>
                  <div className="text-slate-500">{o.item}</div>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11.5px] text-slate-600">
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-[14px] font-semibold text-[#12233F]">
            <Star size={15} className="text-[#D6A419]" /> Store Rating
          </h2>
          <div className="text-3xl font-semibold text-[#12233F]">4.6</div>
          <div className="text-[12px] text-slate-500">১২৮টা রিভিউ থেকে</div>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-[#FCF3D9] px-4 py-3 text-[13px] text-[#8A6D1A]">
        <AlertTriangle size={16} />
        ৪টা প্রোডাক্টের stock কমে গেছে — এখনই রিস্টক করুন
      </div>
    </div>
  );
}