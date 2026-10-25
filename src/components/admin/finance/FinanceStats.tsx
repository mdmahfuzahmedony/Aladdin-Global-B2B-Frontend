"use client";

import { Banknote, Clock3, Percent, TrendingUp } from "lucide-react";

import AdminStatCard from "@/components/cards/AdminStatCard";

type Props = {
  totalPaidOut?: number;
  pendingPayouts?: number;
  platformCommission?: number;
  totalRevenue?: number;
  loading?: boolean;
};

export default function FinanceStats({
  totalPaidOut = 0,
  pendingPayouts = 0,
  platformCommission = 0,
  totalRevenue = 0,
  loading = false,
}: Props) {
  const formatMoney = (val: number) =>
    `৳${Number(val || 0).toLocaleString("en-BD")}`;

  const stats = [
    {
      label: "Total Paid Out",
      value: loading ? "..." : formatMoney(totalPaidOut),
      icon: Banknote,
      variant: "blue" as const,
      description: "মোট ক্লিয়ার করা vendor payout",
    },
    {
      label: "Pending Payouts",
      value: loading ? "..." : formatMoney(pendingPayouts),
      icon: Clock3,
      variant: "orange" as const,
      description: "উত্তোলনের জন্য অপেক্ষমাণ",
    },
    {
      label: "Platform Commission",
      value: loading ? "..." : formatMoney(platformCommission),
      icon: Percent,
      variant: "green" as const,
      description: "প্ল্যাটফর্মের অর্জিত নিট কমিশন",
    },
    {
      label: "Total Revenue (GMV)",
      value: loading ? "..." : formatMoney(totalRevenue),
      icon: TrendingUp,
      variant: "purple" as const,
      description: "সর্বমোট ডেলিভার্ড বিক্রয় পরিমাণ",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <AdminStatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          variant={stat.variant}
          description={stat.description}
        />
      ))}
    </div>
  );
}
