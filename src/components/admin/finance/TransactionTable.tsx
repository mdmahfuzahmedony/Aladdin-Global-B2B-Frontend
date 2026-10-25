"use client";

import { Eye, Trash2 } from "lucide-react";
import TransactionStatusBadge from "./TransactionStatusBadge";

export type Transaction = {
  id: string;
  vendor: string;
  shop: string;
  orderId: string;
  paymentMethod: string;
  orderAmount: number;
  vendorEarnings: number;
  adminProfit: number;
  status: string;
  date: string;
};

type Props = {
  transactions: Transaction[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
};

export default function TransactionTable({
  transactions,
  selectedIds,
  setSelectedIds,
  onDelete,
  loading,
}: Props) {
  const allSelected =
    transactions.length > 0 &&
    transactions.every((transaction) => selectedIds.includes(transaction.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(transactions.map((transaction) => transaction.id));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                aria-label="Select all transactions"
                className="h-4 w-4 rounded border-slate-300 text-[#12233F]"
              />
            </th>
            {[
              "Transaction",
              "Vendor / Store",
              "Order #",
              "Payment Method",
              "Order Amount",
              "Vendor Earnings",
              "Platform Profit",
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
          {loading ? (
            <tr>
              <td
                colSpan={10}
                className="py-12 text-center text-sm text-slate-400"
              >
                Transactions লোড হচ্ছে...
              </td>
            </tr>
          ) : transactions.length === 0 ? (
            <tr>
              <td
                colSpan={10}
                className="py-12 text-center text-sm text-slate-400"
              >
                কোনো transaction পাওয়া যায়নি।
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-slate-100 transition hover:bg-slate-50/70"
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(transaction.id)}
                    onChange={() => toggleOne(transaction.id)}
                    aria-label={`Select transaction ${transaction.id}`}
                    className="h-4 w-4 rounded border-slate-300 text-[#12233F]"
                  />
                </td>

                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-[#12233F]">
                    {transaction.id}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {transaction.date}
                  </p>
                </td>

                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-slate-700">
                    {transaction.vendor}
                  </p>
                  <p className="text-xs text-slate-400">{transaction.shop}</p>
                </td>

                <td className="px-4 py-4 text-sm font-medium text-slate-600">
                  {transaction.orderId}
                </td>

                <td className="px-4 py-4">
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                    {transaction.paymentMethod}
                  </span>
                </td>

                <td className="px-4 py-4 text-sm font-bold text-[#12233F]">
                  ৳
                  {Number(transaction.orderAmount || 0).toLocaleString(
                    "en-BD",
                  )}
                </td>

                <td className="px-4 py-4 text-sm font-medium text-emerald-600">
                  ৳
                  {Number(transaction.vendorEarnings || 0).toLocaleString(
                    "en-BD",
                  )}
                </td>

                <td className="px-4 py-4 text-sm font-semibold text-blue-600">
                  +৳
                  {Number(transaction.adminProfit || 0).toLocaleString(
                    "en-BD",
                  )}
                </td>

                <td className="px-4 py-4">
                  <TransactionStatusBadge status={transaction.status} />
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    {onDelete && (
                      <button
                        title="Delete"
                        onClick={() => onDelete(transaction.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
