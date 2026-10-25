"use client";

import { Search, SlidersHorizontal } from "lucide-react";

type TransactionFiltersProps = {
  search: string;
  setSearch: (value: string) => void;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
};

export default function TransactionFilters({
  search,
  setSearch,
  paymentMethod,
  setPaymentMethod,
  status,
  setStatus,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:flex-row">
      <div className="relative flex-1">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Transaction ID, Order ID বা Vendor search..."
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#12233F]"
        />
      </div>

      <div className="relative">
        <SlidersHorizontal
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="h-10 min-w-[170px] appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-sm outline-none"
        >
          <option value="ALL">All Payment Methods</option>
          <option value="BANK">Bank</option>
          <option value="BKASH">bKash</option>
          <option value="NAGAD">Nagad</option>
          <option value="CASH">Cash</option>
        </select>
      </div>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="h-10 min-w-[150px] rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
      >
        <option value="ALL">All Status</option>
        <option value="COMPLETED">Completed</option>
        <option value="PENDING">Pending</option>
        <option value="FAILED">Failed</option>
        <option value="REFUNDED">Refunded</option>
      </select>
    </div>
  );
}