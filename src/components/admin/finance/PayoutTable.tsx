"use client";

import { Check, Eye, X } from "lucide-react";

import PayoutStatusBadge from "./PayoutStatusBadge";

export type Payout = {
  id: string;
  vendor: string;
  shop: string;
  walletBalance: number;
  requestedAmount: number;
  method: string;
  date: string;
  status: string;
};

type Props = {
  payouts: Payout[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export default function PayoutTable({
  payouts,
  onApprove,
  onReject,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {[
              "Payout ID",
              "Vendor",
              "Wallet Balance",
              "Requested",
              "Method",
              "Date",
              "Status",
              "Action",
            ].map((heading) => (
              <th
                key={heading}
                className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {payouts.map((payout) => (
            <tr
              key={payout.id}
              className="border-b border-slate-100 hover:bg-slate-50/70"
            >
              <td className="px-4 py-4 text-sm font-semibold text-[#12233F]">
                {payout.id}
              </td>

              <td className="px-4 py-4">
                <p className="text-sm font-semibold text-slate-700">
                  {payout.vendor}
                </p>
                <p className="text-xs text-slate-400">{payout.shop}</p>
              </td>

              <td className="px-4 py-4 text-sm font-medium text-slate-600">
                ৳{payout.walletBalance.toLocaleString()}
              </td>

              <td className="px-4 py-4 text-sm font-bold text-[#12233F]">
                ৳{payout.requestedAmount.toLocaleString()}
              </td>

              <td className="px-4 py-4">
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                  {payout.method}
                </span>
              </td>

              <td className="px-4 py-4 text-xs text-slate-500">
                {payout.date}
              </td>

              <td className="px-4 py-4">
                <PayoutStatusBadge status={payout.status} />
              </td>

              <td className="px-4 py-4">
                <div className="flex items-center gap-1">
                  <button
                    title="View"
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  >
                    <Eye size={16} />
                  </button>

                  {payout.status === "PENDING" && (
                    <>
                      <button
                        title="Approve"
                        onClick={() => onApprove(payout.id)}
                        className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                      >
                        <Check size={16} />
                      </button>

                      <button
                        title="Reject"
                        onClick={() => onReject(payout.id)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {payouts.length === 0 && (
        <div className="py-12 text-center text-sm text-slate-500">
          কোনো payout request পাওয়া যায়নি।
        </div>
      )}
    </div>
  );
}