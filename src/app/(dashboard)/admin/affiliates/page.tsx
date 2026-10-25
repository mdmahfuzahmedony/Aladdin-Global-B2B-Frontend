"use client";


import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  Clock,
  UserCheck,
  AlertTriangle,
  Ban,
  Search,
  Eye,
  RefreshCw,
  Copy,
  X,
  ExternalLink,
  Wallet,
} from "lucide-react";

import AdminStatCard from "@/components/cards/AdminStatCard";
import { createClient } from "../../../../../lib/supabase-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

type AffiliateStatus =
  | "PENDING"
  | "TRIAL"
  | "ACTIVE"
  | "WARNING"
  | "SUSPENDED";

type Affiliate = {
  id: string;
  userId: string;
  referralCode: string;
  couponCode: string | null;
  socialPlatform: string;
  socialMediaLink: string;
  followerCount: number | null;
  status: AffiliateStatus;
  payoutMethod: string | null;
  payoutAccountName: string | null;
  payoutAccountNumber: string | null;
  payoutMobileNumber: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    status: string;
    createdAt: string;
  };
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  TRIAL: "bg-blue-50 text-blue-700",
  ACTIVE: "bg-emerald-50 text-emerald-700",
  WARNING: "bg-orange-50 text-orange-700",
  SUSPENDED: "bg-rose-50 text-rose-700",
};

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<Affiliate | null>(null);

  const fetchAffiliates = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      if (!session) throw new Error("Please sign in to continue.");

      const response = await fetch(
        `${API_BASE_URL}/api/affiliates/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load affiliates.");
      }

      setAffiliates(data.affiliates ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAffiliates();
  }, [fetchAffiliates]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return affiliates.filter((affiliate) => {
      const user = affiliate.user;

      const matchesSearch = [
        user?.fullName,
        user?.email,
        user?.phone,
        affiliate.referralCode,
        affiliate.couponCode,
        affiliate.socialPlatform,
      ].some((value) => String(value ?? "").toLowerCase().includes(term));

      return (
        matchesSearch &&
        (statusFilter === "ALL" || affiliate.status === statusFilter)
      );
    });
  }, [affiliates, search, statusFilter]);

  const count = (status: AffiliateStatus) =>
    affiliates.filter((item) => item.status === status).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#12233F]">
            Affiliate Management
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Manage affiliate accounts, referrals and payout information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchAffiliates()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1b3154] disabled:opacity-50"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <AdminStatCard
          label="Total Affiliates"
          value={affiliates.length}
          icon={Users}
          variant="blue"
          description="All registered affiliates"
        />
        <AdminStatCard
          label="Pending"
          value={count("PENDING")}
          icon={Clock}
          variant="yellow"
          description="Awaiting review"
        />
        <AdminStatCard
          label="Trial"
          value={count("TRIAL")}
          icon={UserCheck}
          variant="purple"
          description="Trial accounts"
        />
        <AdminStatCard
          label="Active"
          value={count("ACTIVE")}
          icon={UserCheck}
          variant="green"
          description="Active affiliates"
        />
        <AdminStatCard
          label="Warning"
          value={count("WARNING")}
          icon={AlertTriangle}
          variant="orange"
          description="Accounts under warning"
        />
        <AdminStatCard
          label="Suspended"
          value={count("SUSPENDED")}
          icon={Ban}
          variant="pink"
          description="Suspended accounts"
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-[#12233F]">
              All Affiliates
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {filtered.length} affiliates found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
              <Search size={16} className="text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, code..."
                className="min-w-0 bg-transparent text-sm outline-none sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="TRIAL">Trial</option>
              <option value="ACTIVE">Active</option>
              <option value="WARNING">Warning</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="m-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
            <button
              type="button"
              onClick={() => void fetchAffiliates()}
              className="ml-3 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">
            Loading affiliates...
          </div>
        ) : !error && filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            No affiliates found.
          </div>
        ) : !error ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-slate-50">
                <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">Affiliate</th>
                  <th className="px-5 py-4">Referral code</th>
                  <th className="px-5 py-4">Platform</th>
                  <th className="px-5 py-4">Followers</th>
                  <th className="px-5 py-4">Payout</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((affiliate) => (
                  <tr key={affiliate.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#12233F]">
                        {affiliate.user?.fullName || "Unnamed affiliate"}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {affiliate.user?.email || "—"}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        {affiliate.user?.phone || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => void navigator.clipboard.writeText(affiliate.referralCode)}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#12233F]"
                        title="Copy referral code"
                      >
                        {affiliate.referralCode}
                        <Copy size={13} />
                      </button>
                      <div className="mt-1 text-xs text-slate-400">
                        Coupon: {affiliate.couponCode || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium text-slate-700">
                        {affiliate.socialPlatform}
                      </div>
                      <a
                        href={affiliate.socialMediaLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                      >
                        View profile <ExternalLink size={12} />
                      </a>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {affiliate.followerCount?.toLocaleString() ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {affiliate.payoutMethod || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[affiliate.status] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {affiliate.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {new Date(affiliate.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelected(affiliate)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#12233F] hover:bg-slate-100"
                      >
                        <Eye size={14} />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="border-t border-slate-100 px-4 py-4 text-xs text-slate-500 sm:px-5">
          Showing {filtered.length} of {affiliates.length} affiliates
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40">
          <button
            type="button"
            aria-label="Close details"
            onClick={() => setSelected(null)}
            className="absolute inset-0 cursor-default"
          />

          <aside className="relative z-10 h-full w-full max-w-lg overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white p-5">
              <div>
                <h2 className="text-lg font-bold text-[#12233F]">
                  Affiliate Details
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Full registration information
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 p-5">
              <section>
                <h3 className="mb-3 text-sm font-bold text-[#12233F]">
                  Personal Information
                </h3>
                <Detail label="Full name" value={selected.user?.fullName} />
                <Detail label="Email" value={selected.user?.email} />
                <Detail label="Phone" value={selected.user?.phone} />
                <Detail label="User status" value={selected.user?.status} />
                <Detail label="User ID" value={selected.userId} />
              </section>

              <section>
                <h3 className="mb-3 text-sm font-bold text-[#12233F]">
                  Referral Information
                </h3>
                <Detail label="Referral code" value={selected.referralCode} />
                <Detail label="Coupon code" value={selected.couponCode} />
                <Detail label="Affiliate status" value={selected.status} />
                <Detail
                  label="Joined"
                  value={new Date(selected.createdAt).toLocaleString()}
                />
              </section>

              <section>
                <h3 className="mb-3 text-sm font-bold text-[#12233F]">
                  Social Media Information
                </h3>
                <Detail label="Platform" value={selected.socialPlatform} />
                <Detail
                  label="Followers"
                  value={selected.followerCount?.toLocaleString()}
                />
                <Detail
                  label="Profile link"
                  value={selected.socialMediaLink}
                />
              </section>

              <section>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#12233F]">
                  <Wallet size={16} />
                  Payout Information
                </h3>
                <Detail label="Method" value={selected.payoutMethod} />
                <Detail
                  label="Account holder"
                  value={selected.payoutAccountName}
                />
                <Detail
                  label="Account number"
                  value={selected.payoutAccountNumber}
                />
                <Detail
                  label="Mobile banking number"
                  value={selected.payoutMobileNumber}
                />
              </section>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="shrink-0 text-xs text-slate-500">{label}</span>
      <span className="break-all text-sm font-medium text-slate-800 sm:max-w-[65%] sm:text-right">
        {value === null || value === undefined || value === ""
          ? "—"
          : String(value)}
      </span>
    </div>
  );
}
