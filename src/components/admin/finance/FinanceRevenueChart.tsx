"use client";

import { BarChart3 } from "lucide-react";

type RevenuePoint = {
  month: string;
  revenue: number;
  commission: number;
};

type Props = {
  data?: RevenuePoint[];
};

const defaultData: RevenuePoint[] = [
  { month: "Jan", revenue: 420000, commission: 21000 },
  { month: "Feb", revenue: 510000, commission: 25500 },
  { month: "Mar", revenue: 620000, commission: 31000 },
  { month: "Apr", revenue: 580000, commission: 29000 },
  { month: "May", revenue: 760000, commission: 38000 },
  { month: "Jun", revenue: 820000, commission: 41000 },
  { month: "Jul", revenue: 910000, commission: 45500 },
];

export default function FinanceRevenueChart({ data }: Props) {
  const chartData = data && data.length > 0 ? data : defaultData;
  const maxRevenue = Math.max(...chartData.map((item) => item.revenue), 1);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={19} className="text-[#12233F]" />
            <h2 className="text-lg font-bold text-[#12233F]">
              Revenue & Commission Trend
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            মাস অনুযায়ী গ্রস বিক্রয় (GMV) এবং প্ল্যাটফর্মের অর্জিত কমিশন
          </p>
        </div>

        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
          Last 7 Months Tracking
        </span>
      </div>

      <div className="flex h-72 items-end gap-3 overflow-x-auto border-b border-slate-200 pb-2">
        {chartData.map((item) => {
          const revenueHeight = Math.max(
            (item.revenue / maxRevenue) * 210,
            item.revenue > 0 ? 12 : 4,
          );

          const commHeight = Math.max(
            (item.commission / maxRevenue) * 210,
            item.commission > 0 ? 8 : 4,
          );

          return (
            <div
              key={item.month}
              className="flex min-w-[55px] flex-1 flex-col items-center justify-end gap-2"
            >
              <div className="flex h-[220px] items-end gap-1">
                <div
                  title={`Revenue: ৳${Number(item.revenue || 0).toLocaleString("en-BD")}`}
                  className="w-5 rounded-t-md bg-[#12233F] transition-all hover:opacity-80"
                  style={{ height: `${revenueHeight}px` }}
                />

                <div
                  title={`Commission: ৳${Number(item.commission || 0).toLocaleString("en-BD")}`}
                  className="w-5 rounded-t-md bg-amber-400 transition-all hover:opacity-80"
                  style={{ height: `${commHeight}px` }}
                />
              </div>

              <span className="text-xs font-medium text-slate-500">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-5 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-xs bg-[#12233F]" />
          Gross Merchandise Value (GMV)
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-xs bg-amber-400" />
          Platform Commission (৳)
        </div>
      </div>
    </section>
  );
}
