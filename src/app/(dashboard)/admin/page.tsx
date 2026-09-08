import {
  TrendingUp,
  TrendingDown,
  Package,
  UserCheck,
  BadgeCheck,
  Wallet,
  AlertTriangle,
} from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  trend?: { value: string; positive: boolean };
  accent?: "default" | "warning" | "success";
};

function StatCard({ label, value, trend, accent = "default" }: StatCardProps) {
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
        <div
          className={`mt-1.5 flex items-center gap-1 text-[11.5px] font-medium ${
            trend.positive ? "text-[#1F7A4D]" : "text-[#D64545]"
          }`}
        >
          {trend.positive ? (
            <TrendingUp size={13} />
          ) : (
            <TrendingDown size={13} />
          )}
          {trend.value}
        </div>
      )}
    </div>
  );
}

const ACTION_ITEMS = [
  { label: "Product approval বাকি", count: 8, icon: Package },
  { label: "Seller approval বাকি", count: 3, icon: UserCheck },
  { label: "Wholesaler verification বাকি", count: 2, icon: BadgeCheck },
  { label: "Payout request বাকি", count: 1, icon: Wallet },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-[#12233F]">Overview</h1>
        <span className="text-[13px] text-slate-500">আজ, ৮ সেপ্টেম্বর ২০২৬</span>
      </div>

      {/* Row 1 — primary */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="আজকের Sales" value="৳48,200" trend={{ value: "+12% গতকাল থেকে", positive: true }} />
        <StatCard label="এই মাসের Sales" value="৳6,42,000" trend={{ value: "+8% গত মাস থেকে", positive: true }} />
        <StatCard label="মোট Order (আজ)" value="126" />
        <StatCard label="Pending Approvals" value="14" accent="warning" />
      </div>

      {/* Row 2 — secondary */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="কমিশন Income" value="৳6,300" accent="success" />
        <StatCard label="Active Sellers" value="214" trend={{ value: "+5 এই সপ্তাহে", positive: true }} />
        <StatCard label="Wholesaler Due" value="৳1,12,400" accent="warning" />
        <StatCard label="Low Stock Products" value="5" accent="warning" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Action needed */}
        <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-[14px] font-semibold text-[#12233F]">
            Action needed
          </h2>
          <div className="divide-y divide-slate-100">
            {ACTION_ITEMS.map(({ label, count, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2.5"
              >
                <div className="flex items-center gap-2 text-[13px] text-slate-700">
                  <Icon size={16} className="text-[#D6A419]" />
                  {label}
                </div>
                <span className="text-[13px] font-semibold text-[#12233F]">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top performers */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-[14px] font-semibold text-[#12233F]">
            Top performers
          </h2>
          <div className="space-y-3 text-[13px]">
            <div>
              <div className="text-[11.5px] text-slate-500">
                Best-selling product
              </div>
              <div>Wireless earbuds — carton</div>
            </div>
            <div>
              <div className="text-[11.5px] text-slate-500">Top seller</div>
              <div>Rahman Electronics</div>
            </div>
            <div>
              <div className="text-[11.5px] text-slate-500">Top affiliate</div>
              <div>Nadia Islam</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert */}
      <div className="flex items-center gap-2 rounded-xl bg-[#FCF3D9] px-4 py-3 text-[13px] text-[#8A6D1A]">
        <AlertTriangle size={16} />
        ৫টা প্রোডাক্টের stock কম আছে — রিভিউ করুন
      </div>
    </div>
  );
}