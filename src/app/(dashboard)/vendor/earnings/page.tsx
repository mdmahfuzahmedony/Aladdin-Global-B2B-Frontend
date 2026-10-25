"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Wallet,
  DollarSign,
  Clock3,
  ArrowDownToLine,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";

import AdminStatCard from "@/components/cards/AdminStatCard";
import { createClient } from "../../../../../lib/supabase-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type EarningStatus = "AVAILABLE" | "PENDING" | "PAID";
type StatusFilter = "ALL" | EarningStatus;

type Earning = {
  id: string;
  orderNumber: string;
  product: string;
  customer: string;
  grossAmount: number;
  commission: number;
  earning: number;
  status: EarningStatus;
  date: string;
};

type PayoutAccount = {
  method?: string;
  bankName?: string | null;
  accountHolder?: string | null;
};

type EarningsSummary = {
  totalEarnings: number;
  availableBalance: number;
  pendingEarnings: number;
  withdrawnAmount: number;
  payoutAccount?: PayoutAccount | null;
  hasPayoutAccount?: boolean;
};

type ApiObject = Record<string, unknown>;

const EMPTY_SUMMARY: EarningsSummary = {
  totalEarnings: 0,
  availableBalance: 0,
  pendingEarnings: 0,
  withdrawnAmount: 0,
  payoutAccount: null,
  hasPayoutAccount: false,
};

function asObject(value: unknown): ApiObject {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as ApiObject)
    : {};
}

function asNumber(value: unknown): number {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
}

function asString(value: unknown, fallback = "—"): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function normalizeStatus(value: unknown): EarningStatus {
  const status = String(value ?? "").toUpperCase();

  if (status === "PAYABLE" || status === "AVAILABLE") {
    return "AVAILABLE";
  }

  if (status === "PAID") {
    return "PAID";
  }

  return "PENDING";
}

function formatDate(value: unknown): string {
  if (!value) return "—";

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getTransactions(payload: unknown): unknown[] {
  const root = asObject(payload);
  const data = asObject(root.data);

  if (Array.isArray(root.transactions)) return root.transactions;
  if (Array.isArray(root.earnings)) return root.earnings;
  if (Array.isArray(data.transactions)) return data.transactions;
  if (Array.isArray(data.earnings)) return data.earnings;
  if (Array.isArray(root.data)) return root.data;

  return [];
}

function mapEarning(value: unknown): Earning {
  const item = asObject(value);

  const order = asObject(item.vendorOrder);
  const customerObject = asObject(item.customer);
  const customerOrder = asObject(item.customerOrder);
  const customerOrderCustomer = asObject(customerOrder.customer);
  const items = Array.isArray(order.items) ? order.items : [];
  const firstItem = asObject(items[0]);

  const dateValue = item.date ?? item.createdAt ?? item.requestedAt;

  return {
    id: asString(item.id, crypto.randomUUID()),
    orderNumber: asString(
      item.orderNumber ?? order.orderNumber ?? item.vendorOrderId,
    ),
    product: asString(
      item.product ??
        firstItem.productName ??
        firstItem.name ??
        item.productName,
    ),
    customer: asString(
      item.customerName ??
        (typeof item.customer === "string" ? item.customer : undefined) ??
        customerObject.fullName ??
        customerObject.name ??
        customerOrderCustomer.fullName ??
        customerOrderCustomer.name,
    ),
    grossAmount: asNumber(
      item.grossAmount ?? item.subtotal ?? item.totalAmount,
    ),
    commission: asNumber(item.commission ?? item.commissionAmount),
    earning: asNumber(item.earning ?? item.netAmount),
    status: normalizeStatus(item.status),
    date: formatDate(dateValue),
  };
}

function EarningStatusBadge({ status }: { status: EarningStatus }) {
  if (status === "AVAILABLE") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-600">
        <CheckCircle2 size={14} />
        Available
      </span>
    );
  }

  if (status === "PENDING") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-amber-600">
        <Clock3 size={14} />
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-blue-600">
      <ArrowDownToLine size={14} />
      Paid
    </span>
  );
}

export default function VendorEarningsPage() {
  const [supabase] = useState(() => createClient());

  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [summary, setSummary] = useState<EarningsSummary>(EMPTY_SUMMARY);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [notice, setNotice] = useState("");

  const formatMoney = useCallback((value: number) => {
    return `৳${value.toLocaleString("en-BD", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }, []);

  const fetchEarnings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error("লগইন সেশন পাওয়া যায়নি। আবার লগইন করো।");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        search: search.trim(),
        status: statusFilter,
      });

      const [summaryResponse, transactionsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/vendors/earnings/summary`, {
          headers,
          cache: "no-store",
        }),
        fetch(
          `${API_BASE_URL}/api/vendors/earnings/transactions?${params.toString()}`,
          {
            headers,
            cache: "no-store",
          },
        ),
      ]);

      const summaryJson: unknown = await summaryResponse.json();
      const transactionsJson: unknown = await transactionsResponse.json();

      const summaryRoot = asObject(summaryJson);
      const transactionRoot = asObject(transactionsJson);

      if (!summaryResponse.ok) {
        throw new Error(
          asString(summaryRoot.message, "Earnings summary লোড করা যায়নি।"),
        );
      }

      if (!transactionsResponse.ok) {
        throw new Error(
          asString(transactionRoot.message, "Transactions লোড করা যায়নি।"),
        );
      }

      const summaryData = asObject(summaryRoot.data ?? summaryJson);

      const payoutAccount = asObject(summaryData.payoutAccount);

      setSummary({
        totalEarnings: asNumber(summaryData.totalEarnings),
        availableBalance: asNumber(summaryData.availableBalance),
        pendingEarnings: asNumber(summaryData.pendingEarnings),
        withdrawnAmount: asNumber(summaryData.withdrawnAmount),
        payoutAccount:
          summaryData.payoutAccount &&
          typeof summaryData.payoutAccount === "object"
            ? {
                method: asString(payoutAccount.method, ""),
                bankName:
                  typeof payoutAccount.bankName === "string"
                    ? payoutAccount.bankName
                    : null,
                accountHolder:
                  typeof payoutAccount.accountHolder === "string"
                    ? payoutAccount.accountHolder
                    : null,
              }
            : null,
        hasPayoutAccount: Boolean(summaryData.hasPayoutAccount),
      });

      const transactions = getTransactions(transactionsJson);
      const mapped = transactions.map(mapEarning);

      setEarnings(mapped);

      const pagination = asObject(
        transactionRoot.pagination ?? asObject(transactionRoot.data).pagination,
      );

      setTotalPages(Math.max(1, asNumber(pagination.totalPages) || 1));

      setTotalTransactions(asNumber(pagination.total) || mapped.length);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ডেটা লোড করতে সমস্যা হয়েছে।",
      );

      setEarnings([]);
      setSummary(EMPTY_SUMMARY);
      setTotalPages(1);
      setTotalTransactions(0);
    } finally {
      setLoading(false);
    }
  }, [supabase, page, search, statusFilter]);

  useEffect(() => {
    void fetchEarnings();
  }, [fetchEarnings]);

  const filteredEarnings = useMemo(() => earnings, [earnings]);

  const withdrawEarnings = async () => {
    if (withdrawing || summary.availableBalance <= 0) return;

    if (!summary.hasPayoutAccount) {
      setNotice("Withdraw করার আগে payout account যুক্ত করো।");
      return;
    }

    const amountInput = window.prompt(
      `সর্বোচ্চ উত্তোলনযোগ্য ব্যালেন্স: ${formatMoney(summary.availableBalance)}\nকত টাকা উত্তোলন করতে চাও?`,
    );

    if (amountInput === null) return;

    const amount = Number(amountInput);

    if (!Number.isFinite(amount) || amount <= 0) {
      setNotice("সঠিক উত্তোলনের পরিমাণ লিখো।");
      return;
    }

    if (amount > summary.availableBalance) {
      setNotice("উত্তোলনের পরিমাণ available balance-এর চেয়ে বেশি।");
      return;
    }

    setWithdrawing(true);
    setNotice("");

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error("লগইন সেশন পাওয়া যায়নি।");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/vendors/earnings/payouts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        },
      );

      const result: unknown = await response.json();
      const resultObject = asObject(result);

      if (!response.ok) {
        throw new Error(
          asString(resultObject.message, "Payout request তৈরি করা যায়নি।"),
        );
      }

      setNotice(
        asString(
          resultObject.message,
          "Payout request জমা হয়েছে। এটি এখনো payment সম্পন্ন হওয়ার নিশ্চয়তা নয়।",
        ),
      );

      await fetchEarnings();
    } catch (err) {
      setNotice(
        err instanceof Error ? err.message : "Payout request পাঠানো যায়নি।",
      );
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#12233F]">Earnings</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Track your store earnings, balance and payouts
          </p>
        </div>

        <button
          type="button"
          onClick={withdrawEarnings}
          disabled={loading || withdrawing || summary.availableBalance <= 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#1b3153] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowDownToLine size={15} />
          {withdrawing ? "Processing..." : "Withdraw Earnings"}
        </button>
      </div>

      {notice && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-[12px] text-slate-600">
          {notice}
        </div>
      )}

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-600">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void fetchEarnings()}
            className="font-semibold underline"
          >
            আবার চেষ্টা করো
          </button>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Earnings"
          value={loading ? "—" : formatMoney(summary.totalEarnings)}
          icon={DollarSign}
          variant="blue"
          description="Total earnings from orders"
        />

        <AdminStatCard
          label="Available Balance"
          value={loading ? "—" : formatMoney(summary.availableBalance)}
          icon={Wallet}
          variant="green"
          description="Available for withdrawal"
        />

        <AdminStatCard
          label="Pending Earnings"
          value={loading ? "—" : formatMoney(summary.pendingEarnings)}
          icon={Clock3}
          variant="orange"
          description="Waiting for completion"
        />

        <AdminStatCard
          label="Withdrawn Amount"
          value={loading ? "—" : formatMoney(summary.withdrawnAmount)}
          icon={ArrowDownToLine}
          variant="purple"
          description="Previously paid out"
        />
      </div>

      {/* EARNING SUMMARY */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-medium text-slate-500">
                Available for withdrawal
              </p>

              <p className="mt-1 text-[26px] font-bold text-[#12233F]">
                {loading ? "—" : formatMoney(summary.availableBalance)}
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-600">
                <TrendingUp size={14} />
                Earnings from your completed orders
              </div>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet size={21} />
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-[11.5px] text-slate-400">Pending</p>
              <p className="text-[12px] font-semibold text-amber-600">
                {loading ? "—" : formatMoney(summary.pendingEarnings)}
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: `${
                    summary.totalEarnings > 0
                      ? Math.min(
                          100,
                          (summary.availableBalance / summary.totalEarnings) *
                            100,
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* PAYOUT INFO */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-medium text-slate-500">
                Payout Information
              </p>
              <p className="mt-1 text-[15px] font-bold text-[#12233F]">
                {summary.payoutAccount?.method || "Payout account"}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {summary.payoutAccount?.bankName ||
                  summary.payoutAccount?.accountHolder ||
                  (summary.hasPayoutAccount
                    ? "Payout account যুক্ত আছে"
                    : "Payout account যুক্ত করা হয়নি")}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Wallet size={19} />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] text-slate-400">Withdrawable</span>
              <span className="text-[12px] font-semibold text-slate-700">
                {loading ? "—" : formatMoney(summary.availableBalance)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11.5px] text-slate-400">Pending</span>
              <span className="text-[12px] font-semibold text-amber-600">
                {loading ? "—" : formatMoney(summary.pendingEarnings)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11.5px] text-slate-400">Paid out</span>
              <span className="text-[12px] font-semibold text-emerald-600">
                {loading ? "—" : formatMoney(summary.withdrawnAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-[#12233F]">
                Earnings Transactions
              </h2>
              <p className="mt-1 text-[11.5px] text-slate-400">
                {loading
                  ? "Transactions লোড হচ্ছে..."
                  : `${totalTransactions} transactions found`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search earnings..."
                  className="w-64 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-[12px] outline-none transition focus:border-[#D6A419] focus:bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as StatusFilter);
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[12px] text-slate-600 outline-none focus:border-[#D6A419]"
              >
                <option value="ALL">All Earnings</option>
                <option value="AVAILABLE">Available</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Order
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Customer
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Product
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Gross
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Commission
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Your Earning
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Date
                </th>
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-14 text-center text-[13px] text-slate-400"
                  >
                    Earnings লোড হচ্ছে...
                  </td>
                </tr>
              ) : filteredEarnings.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-14 text-center text-[13px] text-slate-400"
                  >
                    No earnings found.
                  </td>
                </tr>
              ) : (
                filteredEarnings.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="text-[12.5px] font-bold text-[#12233F]">
                        {item.orderNumber}
                      </p>
                    </td>

                    <td className="px-3 py-4">
                      <p className="text-[12px] font-semibold text-[#12233F]">
                        {item.customer}
                      </p>
                    </td>

                    <td className="px-3 py-4">
                      <p className="max-w-[180px] truncate text-[12px] font-medium text-slate-600">
                        {item.product}
                      </p>
                    </td>

                    <td className="px-3 py-4">
                      <span className="text-[12px] font-semibold text-slate-600">
                        {formatMoney(item.grossAmount)}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      <span className="text-[12px] font-medium text-red-500">
                        -{formatMoney(item.commission)}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      <span className="text-[12.5px] font-bold text-emerald-600">
                        {formatMoney(item.earning)}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      <EarningStatusBadge status={item.status} />
                    </td>

                    <td className="px-3 py-4 text-[11.5px] text-slate-500">
                      {item.date}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          title="More"
                          onClick={() => {
                            setNotice(
                              `Order: ${item.orderNumber} · Status: ${item.status}`,
                            );
                          }}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#12233F]"
                        >
                          <MoreHorizontal size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
          <p className="text-[11.5px] text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-600">
              {loading ? 0 : filteredEarnings.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-600">
              {totalTransactions}
            </span>{" "}
            transactions
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>

            <span className="rounded-lg bg-[#12233F] px-3 py-1.5 text-[11px] font-semibold text-white">
              {page} / {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
