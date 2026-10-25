"use client";

import { CheckCircle2, Clock3, CreditCard, XCircle } from "lucide-react";

type Props = {
  pendingAmount?: number;
  processingAmount?: number;
  paidAmount?: number;
  rejectedAmount?: number;
};

export default function PayoutSummary({
  pendingAmount = 0,
  processingAmount = 0,
  paidAmount = 0,
  rejectedAmount = 0,
}: Props) {
  const formatMoney = (val: number) =>
    `৳${Number(val || 0).toLocaleString("en-BD")}`;

  const items = [
    {
      label: "Pending Review",
      value: formatMoney(pendingAmount),
      icon: Clock3,
      iconClass: "bg-orange-100 text-orange-600",
    },
    {
      label: "Processing",
      value: formatMoney(processingAmount),
      icon: CreditCard,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      label: "Completed & Paid",
      value: formatMoney(paidAmount),
      icon: CheckCircle2,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Rejected / Cancelled",
      value: formatMoney(rejectedAmount),
      icon: XCircle,
      iconClass: "bg-red-100 text-red-600",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[#12233F]">Payout Overview</h2>
        <p className="mt-1 text-sm text-slate-500">
          Vendor payout-এর বর্তমান financial অবস্থার সারাংশ
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-xl font-bold text-[#12233F]">
                    {item.value}
                  </p>
                </div>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconClass}`}
                >
                  <Icon size={19} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
