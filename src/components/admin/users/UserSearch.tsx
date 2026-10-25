"use client";

import { Search } from "lucide-react";

import type { UserRole, UserStatus } from "./UserTable";

type UserSearchProps = {
  search: string;
  setSearch: (val: string) => void;
  roleFilter: "ALL" | UserRole | string;
  setRoleFilter: (val: any) => void;
  statusFilter: "ALL" | UserStatus | string;
  setStatusFilter: (val: any) => void;
};

export default function UserSearch({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
}: UserSearchProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search
          size={16}
          className="
            absolute left-3 top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="
            w-64
            rounded-xl
            border border-slate-200
            bg-slate-50
            py-2.5 pl-9 pr-3
            text-[12px]
            outline-none
            transition
            focus:border-[#D6A419]
            focus:bg-white
          "
        />
      </div>

      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value as "ALL" | UserRole)}
        className="
          rounded-xl
          border border-slate-200
          bg-slate-50
          px-3 py-2.5
          text-[12px] text-slate-600
          outline-none
          focus:border-[#D6A419]
        "
      >
        <option value="ALL">All Roles</option>
        <option value="CUSTOMER">Customer</option>
        <option value="SELLER">Seller</option>
        <option value="WHOLESALER">Wholesaler</option>
        <option value="MANAGER">Manager</option>
        <option value="AFFILIATE">Affiliate</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as "ALL" | UserStatus)}
        className="
          rounded-xl
          border border-slate-200
          bg-slate-50
          px-3 py-2.5
          text-[12px] text-slate-600
          outline-none
          focus:border-[#D6A419]
        "
      >
        <option value="ALL">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="PENDING">Pending</option>
        <option value="SUSPENDED">Suspended</option>
      </select>
    </div>
  );
}