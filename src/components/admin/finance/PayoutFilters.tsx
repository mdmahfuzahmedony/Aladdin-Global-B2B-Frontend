"use client";

import { Search } from "lucide-react";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  method: string;
  setMethod: (value: string) => void;
};

export default function PayoutFilters({
  search,
  setSearch,
  status,
  setStatus,
  method,
  setMethod,
}: Props) {
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
          placeholder="Vendor বা Shop search..."
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#12233F]"
        />
      </div>

      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="h-10 min-w-[150px] rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
      >
        <option value="ALL">All Methods</option>
        <option value="BANK">Bank</option>
        <option value="BKASH">bKash</option>
        <option value="NAGAD">Nagad</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="h-10 min-w-[150px] rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
      >
        <option value="ALL">All Status</option>
        <option value="PENDING">Pending</option>
        <option value="PROCESSING">Processing</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
        <option value="PAID">Paid</option>
      </select>
    </div>
  );
}