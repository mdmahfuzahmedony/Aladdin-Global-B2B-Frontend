"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  UserCheck,
  BadgeCheck,
  Wallet,
  AlertTriangle,
  ShoppingCart,
  Users,
  CreditCard,
  Box,
  Store,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import AdminStatCard from "@/components/cards/AdminStatCard";
import { createClient } from "../../../../lib/supabase-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

type Activity = {
  id: string;
  action: string;
  title: string;
  description: string | null;
  entityId: string | null;
  entityType: string | null;
  createdAt: string;
  user?: {
    id: string;
    fullName: string | null;
    email: string | null;
    role: string;
  } | null;
};

type OverviewData = {
  stats: {
    todaySales: string;
    todaySalesRaw: number;
    todaySalesTrend: {
      value: string;
      positive: boolean;
    };
    monthSales: string;
    monthSalesRaw: number;
    monthSalesTrend: {
      value: string;
      positive: boolean;
    };
    todayOrdersCount: number;
    totalOrdersCount: number;
    pendingApprovalsCount: number;
    commissionIncome: string;
    activeSellersCount: number;
    newSellersThisWeekCount: number;
    wholesalerDue: string;
    lowStockProductsCount: number;
    totalPlatformSales: string;
  };
  actionItems: {
    label: string;
    count: number;
    link: string;
  }[];
  topPerformers: {
    bestSellingProduct: {
      title: string;
      count: number;
      revenue: string;
      image: string | null;
    } | null;
    topSeller: {
      storeName: string;
      total: string;
      count: number;
    } | null;
    topAffiliate: {
      name: string;
      totalEarnings: number;
    } | null;
  };
  revenueTrend: {
    month: string;
    value: string;
    height: string;
    rawValue: number;
  }[];
  orderStatusBreakdown: {
    name: string;
    count: number;
    percent: string;
    color: string;
  }[];
  salesByCategory: {
    name: string;
    percent: string;
    color: string;
    sales: number;
  }[];
  revenueSplit: {
    total: string;
    sellerSalesPercent: number;
    wholesalerSalesPercent: number;
    affiliateSalesPercent: number;
  };
  recentActivities: Activity[];
};

export default function AdminOverviewPage() {
  const supabase = createClient();

  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // FETCH ADMIN OVERVIEW DATA
  // =====================================================
  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const accessToken = session?.access_token;
      if (!accessToken) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/overview`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to fetch overview data");
      }

      if (result?.data) {
        setOverview(result.data);
      }
    } catch (err: any) {
      console.error("GET ADMIN OVERVIEW ERROR:", err);
      setError(err?.message || "Failed to load overview data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  // Format current date in Bengali
  const getFormattedDate = () => {
    const d = new Date();
    const months = [
      "জানুয়ারি",
      "ফেব্রুয়ারি",
      "মার্চ",
      "এপ্রিল",
      "মে",
      "জুন",
      "জুলাই",
      "আগস্ট",
      "সেপ্টেম্বর",
      "অক্টোবর",
      "নভেম্বর",
      "ডিসেম্বর",
    ];
    return `আজ, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Format activity timestamp
  const formatActivityTime = (createdAt: string) => {
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "";

    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day ago`;

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Activity Icon & Style
  const getActivityIcon = (activity: Activity) => {
    const type = activity.entityType?.toUpperCase();
    const action = activity.action?.toUpperCase();

    if (type === "VENDOR" || action === "APPROVE" || action === "REJECT") {
      return UserCheck;
    }
    if (type === "PRODUCT") {
      return Package;
    }
    if (type === "BRAND") {
      return BadgeCheck;
    }
    if (type === "BANNER") {
      return Store;
    }
    if (type === "SETTINGS") {
      return CreditCard;
    }
    if (type === "ORDER") {
      return ShoppingCart;
    }
    return TrendingUp;
  };

  const getActivityIconStyle = (activity: Activity) => {
    const type = activity.entityType?.toUpperCase();

    if (type === "VENDOR") {
      return { bg: "bg-emerald-50", iconColor: "text-emerald-600" };
    }
    if (type === "PRODUCT") {
      return { bg: "bg-orange-50", iconColor: "text-orange-600" };
    }
    if (type === "BRAND") {
      return { bg: "bg-violet-50", iconColor: "text-violet-600" };
    }
    if (type === "BANNER") {
      return { bg: "bg-blue-50", iconColor: "text-blue-600" };
    }
    if (type === "SETTINGS") {
      return { bg: "bg-amber-50", iconColor: "text-amber-600" };
    }
    return { bg: "bg-slate-100", iconColor: "text-slate-600" };
  };

  const getActionItemMeta = (label: string) => {
    if (label.includes("Seller")) {
      return { icon: UserCheck, bg: "bg-blue-50", iconColor: "text-blue-600" };
    }
    if (label.includes("Wholesaler")) {
      return {
        icon: BadgeCheck,
        bg: "bg-violet-50",
        iconColor: "text-violet-600",
      };
    }
    if (label.includes("Payout")) {
      return {
        icon: Wallet,
        bg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      };
    }
    return { icon: Package, bg: "bg-orange-50", iconColor: "text-orange-600" };
  };

  const activities = overview?.recentActivities || [];

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#12233F]">Overview</h1>
          <p className="mt-0.5 text-[12px] text-slate-500">
            Platform performance and business summary
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[12px] text-slate-500">
            {getFormattedDate()}
          </span>

          <button
            onClick={fetchOverview}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50"
            title="Reload overview data"
          >
            <RefreshCw
              size={12}
              className={loading ? "animate-spin text-blue-600" : ""}
            />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-600">
          তথ্য লোড করার সময় সমস্যা হয়েছে: {error}
        </div>
      )}

      {/* =====================================================
          FIRST ROW STAT CARDS
      ===================================================== */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <AdminStatCard
          label="আজকের Sales"
          value={overview?.stats?.todaySales ?? "৳0"}
          icon={CreditCard}
          accent="blue"
          trend={{
            value: overview?.stats?.todaySalesTrend?.value ?? "+0% গতকাল থেকে",
            positive: overview?.stats?.todaySalesTrend?.positive ?? true,
          }}
        />

        <AdminStatCard
          label="এই মাসের Sales"
          value={overview?.stats?.monthSales ?? "৳0"}
          icon={TrendingUp}
          accent="green"
          trend={{
            value: overview?.stats?.monthSalesTrend?.value ?? "+0% গত মাস থেকে",
            positive: overview?.stats?.monthSalesTrend?.positive ?? true,
          }}
        />

        <AdminStatCard
          label="মোট Order (আজ)"
          value={String(overview?.stats?.todayOrdersCount ?? 0)}
          icon={ShoppingCart}
          accent="purple"
          subtitle={`সর্বমোট ${overview?.stats?.totalOrdersCount ?? 0} টি অর্ডার`}
        />

        <AdminStatCard
          label="Pending Approvals"
          value={String(overview?.stats?.pendingApprovalsCount ?? 0)}
          icon={AlertTriangle}
          accent="orange"
          subtitle="Admin review প্রয়োজন"
        />
      </div>

      {/* =====================================================
          SECOND ROW STAT CARDS
      ===================================================== */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <AdminStatCard
          label="কমিশন Income"
          value={overview?.stats?.commissionIncome ?? "৳0"}
          icon={Wallet}
          accent="green"
          subtitle="প্ল্যাটফর্ম কমিশন"
        />

        <AdminStatCard
          label="Active Sellers"
          value={String(overview?.stats?.activeSellersCount ?? 0)}
          icon={Users}
          accent="pink"
          trend={{
            value: `+${overview?.stats?.newSellersThisWeekCount ?? 0} এই সপ্তাহে`,
            positive: true,
          }}
        />

        <AdminStatCard
          label="Wholesaler Due"
          value={overview?.stats?.wholesalerDue ?? "৳0"}
          icon={CreditCard}
          accent="blue"
          subtitle="ক্রেডিট / পেমেন্ট বাকি"
        />

        <AdminStatCard
          label="Low Stock Products"
          value={String(overview?.stats?.lowStockProductsCount ?? 0)}
          icon={Box}
          accent="yellow"
          subtitle="Stock review প্রয়োজন"
        />
      </div>

      {/* =====================================================
          ACTION NEEDED + TOP PERFORMERS
      ===================================================== */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Action Needed */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-[14px] font-bold text-[#12233F]">
                Action needed
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-400">
                যে বিষয়গুলোতে আপনার সিদ্ধান্ত প্রয়োজন
              </p>
            </div>

            <Link
              href="/admin/vendors"
              className="shrink-0 text-[11px] font-semibold text-blue-600 hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-2">
            {(overview?.actionItems || []).map((item) => {
              const {
                icon: Icon,
                bg,
                iconColor,
              } = getActionItemMeta(item.label);
              return (
                <Link
                  key={item.label}
                  href={item.link}
                  className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/60 px-2 py-2.5 transition-all hover:bg-white hover:shadow-sm sm:px-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg}`}
                    >
                      <Icon size={15} className={iconColor} />
                    </div>

                    <span className="min-w-0 break-words text-xs font-medium text-slate-700">
                      {item.label}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-[11px] font-bold text-[#12233F] shadow-sm">
                      {item.count}
                    </span>

                    <span className="text-slate-400">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Top Performers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-[14px] font-bold text-[#12233F]">
                Top performers
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-400">
                প্ল্যাটফর্মের সেরা পারফর্মার
              </p>
            </div>

            <Link
              href="/admin/products"
              className="shrink-0 text-[11px] font-semibold text-blue-600 hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {/* Best selling Product */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50">
                {overview?.topPerformers?.bestSellingProduct?.image ? (
                  <img
                    src={overview.topPerformers.bestSellingProduct.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package size={18} className="text-orange-500" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-slate-400">
                  Best-selling product
                </div>
                <div className="truncate text-[12px] font-semibold text-[#12233F]">
                  {overview?.topPerformers?.bestSellingProduct?.title ??
                    "No product sold yet"}
                </div>
                {overview?.topPerformers?.bestSellingProduct?.count ? (
                  <div className="text-[10px] font-medium text-emerald-600">
                    {overview.topPerformers.bestSellingProduct.count} units sold
                    ({overview.topPerformers.bestSellingProduct.revenue})
                  </div>
                ) : null}
              </div>
            </div>

            {/* Top Seller */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <Store size={18} className="text-emerald-600" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-slate-400">Top seller</div>
                <div className="truncate text-[12px] font-semibold text-[#12233F]">
                  {overview?.topPerformers?.topSeller?.storeName ??
                    "No seller yet"}
                </div>
                {overview?.topPerformers?.topSeller?.total ? (
                  <div className="text-[10px] font-medium text-emerald-600">
                    {overview.topPerformers.topSeller.total} total sales
                  </div>
                ) : null}
              </div>
            </div>

            {/* Top Affiliate */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                <Users size={18} className="text-violet-600" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-slate-400">Top affiliate</div>
                <div className="truncate text-[12px] font-semibold text-[#12233F]">
                  {overview?.topPerformers?.topAffiliate?.name ??
                    "No affiliate yet"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          REVENUE TREND
      ===================================================== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[14px] font-bold text-[#12233F]">
              Revenue Trend
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-400">
              গত ৭ মাসের মোট বিক্রয় পরিসংখ্যান
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-600">
              Last 7 Months
            </span>

            <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-600">
              {overview?.stats?.monthSalesTrend?.value ?? "+0%"}
            </span>
          </div>
        </div>

        <div className="flex h-56 items-end gap-2 overflow-hidden border-b border-slate-100 px-1 sm:gap-4 sm:px-4 lg:gap-5">
          {(overview?.revenueTrend || []).map((item) => (
            <div
              key={item.month}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="text-[10px] font-semibold text-slate-500">
                {item.value}
              </span>

              <div
                className="w-full max-w-[42px] rounded-t-lg bg-[#D6A419] transition-all hover:bg-[#E6B52D]"
                style={{
                  height: item.height,
                }}
                title={`${item.month}: ${item.value}`}
              />

              <span className="pb-2 text-[10px] text-slate-400">
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          THREE STATS CARDS: Status, Category, Revenue Split
      ===================================================== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Order Status Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[#12233F]">
            Order Status Breakdown
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            বর্তমান অর্ডারসমূহের স্ট্যাটাস
          </p>

          <div className="mt-5 space-y-4">
            {(overview?.orderStatusBreakdown || []).map(
              ({ name, count, percent, color }) => (
                <div key={name}>
                  <div className="mb-1 flex justify-between gap-2 text-[11px]">
                    <span className="font-medium text-slate-600">{name}</span>
                    <span className="shrink-0 text-slate-400">
                      {count} &nbsp; ({percent})
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{
                        width: percent,
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[#12233F]">
            Sales by Category
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            ক্যাটাগরি অনুযায়ী বিক্রয় অনুপাত
          </p>

          <div className="mt-5 space-y-4">
            {(overview?.salesByCategory || []).map(
              ({ name, percent, color }) => (
                <div key={name}>
                  <div className="mb-1 flex justify-between gap-2 text-[11px]">
                    <span className="font-medium text-slate-600">{name}</span>
                    <span className="shrink-0 text-slate-400">{percent}</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{
                        width: percent,
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Revenue Split */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[#12233F]">
            Revenue Split
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            উৎস অনুযায়ী প্ল্যাটফর্ম রেভিনিউ
          </p>

          <div className="mt-5 flex items-center justify-center">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#f5b82e_0_100%,#173f8f_100%_100%,#19a98a_100%_100%)]">
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-[10px] text-slate-400">Total Sales</span>
                <span className="text-base font-bold text-[#12233F]">
                  {overview?.revenueSplit?.total ?? "৳0"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600">Seller Sales</span>
              <b>{overview?.revenueSplit?.sellerSalesPercent ?? 100}%</b>
            </div>

            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600">Wholesaler Sales</span>
              <b>{overview?.revenueSplit?.wholesalerSalesPercent ?? 0}%</b>
            </div>

            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600">Affiliate Sales</span>
              <b>{overview?.revenueSplit?.affiliateSalesPercent ?? 0}%</b>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          RECENT ACTIVITY
      ===================================================== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-[14px] font-bold text-[#12233F]">
              Recent Activity
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-400">
              প্ল্যাটফর্মে হওয়া সাম্প্রতিক পরিবর্তন ও কার্যক্রম
            </p>
          </div>

          <button
            onClick={fetchOverview}
            className="shrink-0 text-[11px] font-semibold text-blue-600 hover:underline"
          >
            Refresh activity →
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-8 text-center text-[12px] text-slate-400">
            Loading recent activity...
          </div>
        ) : activities.length === 0 ? (
          /* Empty */
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 text-center">
            <TrendingUp size={22} className="mx-auto text-slate-300" />
            <p className="mt-2 text-[12px] font-medium text-slate-500">
              কোনো সাম্প্রতিক কার্যক্রম নেই
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              ভেন্ডর বা অ্যাডমিন পণ্য যোগ বা আপডেট করলে এখানে স্বয়ংক্রিয়ভাবে
              দেখাবে।
            </p>
          </div>
        ) : (
          /* Activity List */
          <div className="space-y-2">
            {activities.slice(0, 8).map((activity) => {
              const Icon = getActivityIcon(activity);
              const { bg, iconColor } = getActivityIconStyle(activity);

              return (
                <div
                  key={activity.id}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-3 transition-all hover:bg-white hover:shadow-sm"
                >
                  {/* Icon */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${bg}`}
                  >
                    <Icon size={16} className={iconColor} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-semibold text-[#12233F]">
                      {activity.title}
                    </div>

                    {activity.description && (
                      <div className="mt-0.5 truncate text-[11px] text-slate-400">
                        {activity.description}
                      </div>
                    )}
                  </div>

                  {/* User info if available */}
                  {activity.user && (
                    <span className="hidden text-[11px] text-slate-400 sm:inline-block">
                      {activity.user.fullName || activity.user.email} (
                      {activity.user.role})
                    </span>
                  )}

                  {/* Time */}
                  <span className="shrink-0 text-[10px] text-slate-400">
                    {formatActivityTime(activity.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =====================================================
          LOW STOCK ALERT
      ===================================================== */}
      {(overview?.stats?.lowStockProductsCount ?? 0) > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <AlertTriangle size={17} className="shrink-0 text-amber-600" />
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-amber-800">
                Low stock alert
              </div>
              <div className="text-[11px] text-amber-700">
                {overview?.stats?.lowStockProductsCount} টা প্রোডাক্টের stock কম
                আছে (১০ বা তার কম) — review করুন
              </div>
            </div>
          </div>

          <Link
            href="/admin/products"
            className="self-start rounded-lg bg-amber-100 px-3 py-1.5 text-[11px] font-bold text-amber-700 hover:bg-amber-200 sm:self-auto"
          >
            Review Products →
          </Link>
        </div>
      )}
    </div>
  );
}
