"use client";

import { useCallback, useEffect, useState } from "react";

import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  Package,
  ShoppingCart,
  Star,
  TrendingUp,
  XCircle,
  ArrowUpRight,
} from "lucide-react";

import AdminStatCard from "@/components/cards/AdminStatCard";
import { createClient } from "../../../../../lib/supabase-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const LOW_STOCK_LIMIT = 5;

/* TYPES */

type ActionItem = {
  label: string;
  count: number;
  variant: "orange" | "yellow" | "blue" | "pink";
};

type TopProduct = {
  name: string;
  category: string;
  sold: number;
  revenue: number;
};

type RevenueItem = {
  month: string;
  value: number;
};

type OrderStatusItem = {
  label: string;
  value: number;
  count?: number;
  color: string;
};

type CategorySales = {
  name: string;
  sales: number;
  percentage: number;
};

type RecentOrder = {
  id: string;
  customer: string;
  item: string;
  amount: number;
  status: string;
};

type LowStockProduct = {
  name: string;
  stock: number;
};

type DashboardOverview = {
  todaySales: number | null;
  monthlySales: number | null;
  todayOrders: number;
  pendingOrders: number;

  totalProducts: number;
  activeProducts: number | null;
  lowStockProducts: number;

  storeRating: number | null;
  totalReviews: number | null;

  salesGrowth: number | null;

  actionItems: ActionItem[];
  topProducts: TopProduct[];
  revenueTrend: RevenueItem[];
  orderStatus: OrderStatusItem[];
  salesByCategory: CategorySales[];
  recentOrders: RecentOrder[];
  lowStock: LowStockProduct[];
};

/* EMPTY DATA */

const EMPTY_DASHBOARD: DashboardOverview = {
  todaySales: null,
  monthlySales: null,
  todayOrders: 0,
  pendingOrders: 0,

  totalProducts: 0,
  activeProducts: null,
  lowStockProducts: 0,

  storeRating: null,
  totalReviews: null,

  salesGrowth: null,

  actionItems: [
    {
      label: "Pending Orders",
      count: 0,
      variant: "orange",
    },
    {
      label: "Low Stock Products",
      count: 0,
      variant: "yellow",
    },
    {
      label: "Processing Orders",
      count: 0,
      variant: "blue",
    },
    {
      label: "Cancelled Orders",
      count: 0,
      variant: "pink",
    },
  ],

  topProducts: [],
  revenueTrend: [],
  orderStatus: [],
  salesByCategory: [],
  recentOrders: [],
  lowStock: [],
};

/* HELPERS */

const formatMoney = (value: number | null | undefined) => {
  if (value == null || !Number.isFinite(Number(value))) {
    return "—";
  }

  return `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(Number(value))}`;
};

const formatCount = (value: number | null | undefined) => {
  if (value == null || !Number.isFinite(Number(value))) {
    return "—";
  }

  return new Intl.NumberFormat("en-BD").format(Number(value));
};

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PROCESSING: "Processing",
    PACKED: "Packed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  return statusMap[status.toUpperCase()] ?? status;
};

const actionIcons = {
  "Pending Orders": Clock3,
  "Low Stock Products": AlertTriangle,
  "Processing Orders": Package,
  "Cancelled Orders": XCircle,
};

const actionVariants = {
  orange: "bg-orange-50 text-orange-600",
  yellow: "bg-yellow-50 text-yellow-600",
  blue: "bg-blue-50 text-blue-600",
  pink: "bg-pink-50 text-pink-600",
};

/* SECTION HEADER */

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 min-w-0">
      <h2 className="text-sm font-semibold text-[#12233F]">{title}</h2>

      {subtitle && (
        <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}

/* ORDER STATUS BADGE */

function OrderStatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toUpperCase();

  const styles: Record<string, string> = {
    PROCESSING: "bg-blue-50 text-blue-700",
    CONFIRMED: "bg-blue-50 text-blue-700",
    PACKED: "bg-violet-50 text-violet-700",
    SHIPPED: "bg-violet-50 text-violet-700",
    DELIVERED: "bg-emerald-50 text-emerald-700",
    PENDING: "bg-orange-50 text-orange-700",
    CANCELLED: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex w-fit whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${
        styles[normalizedStatus] || "bg-slate-100 text-slate-600"
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

/* VENDOR OVERVIEW */

export default function SellerOverviewPage() {
  const [supabase] = useState(() => createClient());

  const [dashboard, setDashboard] =
    useState<DashboardOverview>(EMPTY_DASHBOARD);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setApiError("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.access_token) {
        throw new Error("আপনার login session পাওয়া যায়নি। আবার login করুন।");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/vendors/dashboard/overview`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Dashboard data load করা যায়নি।");
      }

      if (!result.data) {
        throw new Error("API response-এ dashboard data পাওয়া যায়নি।");
      }

      const apiData = result.data;

      setDashboard({
        ...EMPTY_DASHBOARD,
        ...apiData,

        todaySales: apiData.todaySales ?? null,
        monthlySales: apiData.monthlySales ?? null,
        activeProducts: apiData.activeProducts ?? null,
        storeRating: apiData.storeRating ?? null,
        totalReviews: apiData.totalReviews ?? null,
        salesGrowth: apiData.salesGrowth ?? null,

        actionItems: Array.isArray(apiData.actionItems)
          ? apiData.actionItems.map((item: ActionItem) => ({
              ...item,
              variant: item.variant ?? "blue",
            }))
          : EMPTY_DASHBOARD.actionItems,

        topProducts: Array.isArray(apiData.topProducts)
          ? apiData.topProducts
          : [],

        revenueTrend: Array.isArray(apiData.revenueTrend)
          ? apiData.revenueTrend
          : [],

        orderStatus: Array.isArray(apiData.orderStatus)
          ? apiData.orderStatus
          : [],

        salesByCategory: Array.isArray(apiData.salesByCategory)
          ? apiData.salesByCategory
          : [],

        recentOrders: Array.isArray(apiData.recentOrders)
          ? apiData.recentOrders
          : [],

        lowStock: Array.isArray(apiData.lowStock) ? apiData.lowStock : [],
      });
    } catch (error) {
      console.error("Vendor dashboard error:", error);

      setApiError(
        error instanceof Error
          ? error.message
          : "Dashboard load করার সময় সমস্যা হয়েছে।",
      );
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const data = dashboard;

  const currentDate = new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="w-full min-w-0 space-y-5 overflow-x-hidden pb-8 sm:space-y-6">
      {/* HEADER */}

      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-[#12233F] sm:text-xl">
            Overview
          </h1>

          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-[13px]">
            আপনার store-এর overall performance এক নজরে দেখুন
          </p>
        </div>

        <span className="text-xs text-slate-500 sm:text-[13px]">
          আজ, {currentDate}
        </span>
      </header>

      {/* ERROR */}

      {apiError && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-5 text-red-700 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="min-w-0 break-words">{apiError}</span>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="w-fit shrink-0 font-semibold underline"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500"
        >
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-[#12233F]" />
          Dashboard data লোড হচ্ছে...
        </div>
      )}

      {/* MAIN STAT CARDS: TWO PER ROW */}

      <section>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <AdminStatCard
            label="আজকের Sales"
            value={formatMoney(data.todaySales)}
            icon={TrendingUp}
            variant="green"
            description="আজকের completed sales"
          />

          <AdminStatCard
            label="এই মাসের Sales"
            value={formatMoney(data.monthlySales)}
            icon={BarChart3}
            variant="blue"
            description="এই মাসের completed sales"
          />

          <AdminStatCard
            label="আজকের Orders"
            value={formatCount(data.todayOrders)}
            icon={ShoppingCart}
            variant="purple"
            description="আজ পর্যন্ত মোট orders"
          />

          <AdminStatCard
            label="Pending Orders"
            value={formatCount(data.pendingOrders)}
            icon={Clock3}
            variant="orange"
            description="Action নেওয়া প্রয়োজন"
          />
        </div>
      </section>

      {/* SECOND STAT CARDS: TWO PER ROW */}

      <section>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <AdminStatCard
            label="মোট Products"
            value={formatCount(data.totalProducts)}
            icon={Package}
            variant="blue"
            description="Store-এর মোট products"
          />

          <AdminStatCard
            label="Active Products"
            value={formatCount(data.activeProducts ?? data.totalProducts)}
            icon={CheckCircle2}
            variant="green"
            description={
              data.activeProducts === null
                ? "Currently active"
                : "Currently active"
            }
          />

          <AdminStatCard
            label="Low Stock Products"
            value={formatCount(data.lowStockProducts)}
            icon={AlertTriangle}
            variant="yellow"
            description={
              data.lowStockProducts > 0
                ? "Restock প্রয়োজন"
                : "সব পণ্য পর্যাপ্ত স্টকে আছে"
            }
          />

          <AdminStatCard
            label="Store Rating"
            value={
              data.storeRating === null ? "0.0" : data.storeRating.toFixed(1)
            }
            icon={Star}
            variant="pink"
            description={
              !data.totalReviews
                ? "এখনো কোনো রিভিউ নেই"
                : `${formatCount(data.totalReviews)}টি reviews`
            }
          />
        </div>
      </section>

      {/* ACTION NEEDED */}

      <section className="min-w-0">
        <SectionHeader
          title="Action Needed"
          subtitle="যেসব বিষয়ে আপনার attention প্রয়োজন"
        />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {data.actionItems.map((item) => {
            const Icon =
              actionIcons[item.label as keyof typeof actionIcons] ??
              AlertTriangle;

            return (
              <div
                key={item.label}
                className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      actionVariants[item.variant] ??
                      "bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <span className="text-xs font-medium leading-5 text-slate-700 sm:text-[13px]">
                    {item.label}
                  </span>
                </div>

                <span className="shrink-0 text-lg font-semibold text-[#12233F]">
                  {formatCount(item.count)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* TOP PERFORMING PRODUCTS */}

      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <SectionHeader
          title="Top Performing Products"
          subtitle="আপনার সবচেয়ে বেশি বিক্রি হওয়া products"
        />

        {data.topProducts.length === 0 ? (
          <p className="py-8 text-center text-xs leading-5 text-slate-500">
            এখনো কোনো completed product sales পাওয়া যায়নি।
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.topProducts.map((product, index) => (
              <div
                key={`${product.name}-${index}`}
                className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-colors hover:border-slate-200"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-semibold text-[#12233F] shadow-sm">
                    #{index + 1}
                  </div>

                  <ArrowUpRight size={16} className="text-[#1F7A4D]" />
                </div>

                <div className="break-words text-[13px] font-semibold leading-5 text-slate-800">
                  {product.name}
                </div>

                <div className="mt-1 break-words text-xs text-slate-500">
                  {product.category}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-200/70 pt-3">
                  <div className="min-w-0">
                    <div className="text-[11px] text-slate-500">Sold</div>

                    <div className="mt-1 text-sm font-semibold text-[#12233F]">
                      {formatCount(product.sold)}
                    </div>
                  </div>

                  <div className="min-w-0 text-right">
                    <div className="text-[11px] text-slate-500">Revenue</div>

                    <div className="mt-1 break-words text-sm font-semibold text-[#1F7A4D]">
                      {formatMoney(product.revenue)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* REVENUE TREND + ORDER STATUS */}

      <section className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">
        {/* REVENUE TREND */}

        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 lg:col-span-2">
          <SectionHeader
            title="Revenue Trend"
            subtitle="গত ৬ মাসের sales performance"
          />

          {data.revenueTrend.length === 0 ? (
            <p className="py-10 text-center text-xs text-slate-500">
              এখনো revenue trend data নেই।
            </p>
          ) : (
            <div className="flex h-56 min-w-0 items-end gap-2 overflow-x-auto border-b border-slate-100 px-1 pt-4 sm:gap-4 sm:px-2">
              {data.revenueTrend.map((item, index) => {
                const max = Math.max(
                  ...data.revenueTrend.map((entry) => entry.value),
                  1,
                );

                const height = Math.max(
                  item.value > 0 ? 5 : 0,
                  (item.value / max) * 100,
                );

                return (
                  <div
                    key={`${item.month}-${index}`}
                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div className="max-w-full truncate text-[10px] font-medium text-slate-500">
                      {item.value >= 1000
                        ? `৳${Math.round(item.value / 1000)}k`
                        : formatMoney(item.value)}
                    </div>

                    <div
                      className="w-full max-w-[44px] rounded-t-md bg-[#12233F] transition-opacity hover:opacity-80"
                      style={{
                        height: `${height}%`,
                      }}
                      title={`${item.month}: ${formatMoney(item.value)}`}
                    />

                    <div className="max-w-full truncate text-[10px] text-slate-500 sm:text-[11px]">
                      {item.month}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ORDER STATUS */}

        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <SectionHeader
            title="Order Status"
            subtitle="Current order breakdown"
          />

          {data.orderStatus.length === 0 ? (
            <p className="py-8 text-center text-xs leading-5 text-slate-500">
              এখনো order status data নেই।
            </p>
          ) : (
            <div className="space-y-5">
              {data.orderStatus.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="min-w-0 break-words text-xs text-slate-600">
                      {item.label}
                    </span>

                    <span className="shrink-0 text-xs font-semibold text-[#12233F]">
                      {item.value}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{
                        width: `${Math.min(100, Math.max(0, item.value))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SALES BY CATEGORY + RECENT ORDERS */}

      <section className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-5">
        {/* SALES BY CATEGORY */}

        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 lg:col-span-2">
          <SectionHeader
            title="Sales by Category"
            subtitle="Category-wise sales contribution"
          />

          {data.salesByCategory.length === 0 ? (
            <p className="py-8 text-center text-xs leading-5 text-slate-500">
              এখনো category sales data নেই।
            </p>
          ) : (
            <div className="space-y-5">
              {data.salesByCategory.map((category) => (
                <div key={category.name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="min-w-0 break-words text-xs font-medium text-slate-700">
                      {category.name}
                    </span>

                    <span className="shrink-0 text-[11px] text-slate-500">
                      {formatMoney(category.sales)}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#12233F]"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, category.percentage),
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RECENT ORDERS */}

        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 lg:col-span-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <SectionHeader
                title="Recent Orders"
                subtitle="সর্বশেষ customer orders"
              />
            </div>

            <a
              href="/vendor/orders"
              className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#12233F] transition-colors hover:bg-slate-50"
            >
              View All
            </a>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <div className="min-w-[570px]">
              <div className="grid grid-cols-[90px_1fr_1fr_90px_100px] gap-2 bg-slate-50 px-3 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                <span>Order</span>
                <span>Customer</span>
                <span>Product</span>
                <span>Amount</span>
                <span>Status</span>
              </div>

              {data.recentOrders.length === 0 ? (
                <p className="border-t border-slate-100 px-3 py-8 text-center text-xs text-slate-500">
                  এখনো কোনো order পাওয়া যায়নি।
                </p>
              ) : (
                data.recentOrders.map((order, index) => (
                  <div
                    key={`${order.id}-${index}`}
                    className="grid grid-cols-[90px_1fr_1fr_90px_100px] items-center gap-2 border-t border-slate-100 px-3 py-3.5"
                  >
                    <span className="break-words text-[11px] font-medium text-[#12233F]">
                      {order.id}
                    </span>

                    <span className="truncate text-[11px] text-slate-600">
                      {order.customer}
                    </span>

                    <span className="truncate text-[11px] text-slate-600">
                      {order.item}
                    </span>

                    <span className="text-[11px] font-medium text-slate-700">
                      {formatMoney(order.amount)}
                    </span>

                    <OrderStatusBadge status={order.status} />
                  </div>
                ))
              )}
            </div>
          </div>

          <p className="mt-2 text-[10px] leading-4 text-slate-400 sm:hidden">
            টেবিলের বাকি তথ্য দেখতে আড়াআড়ি স্ক্রল করুন।
          </p>
        </div>
      </section>

      {/* LOW STOCK SECTION */}

      <section className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">
        {/* LOW STOCK ALERT */}

        <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[#F2DF9C] bg-[#FCF3D9] px-4 py-4 sm:items-center lg:col-span-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70">
            <AlertTriangle size={18} className="text-[#D6A419]" />
          </div>

          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-[#8A6D1A]">
              Low Stock Alert
            </div>

            <div className="mt-1 text-xs leading-5 text-[#8A6D1A]">
              {formatCount(data.lowStockProducts)}টি product-এর stock কমে গেছে।
              Restock করার জন্য Products page দেখুন।
            </div>
          </div>
        </div>

        {/* LOW STOCK PRODUCTS */}

        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0 text-[#D6A419]" />

            <span className="text-[13px] font-semibold text-[#12233F]">
              Low Stock Products
            </span>
          </div>

          {data.lowStock.length === 0 ? (
            <p className="py-5 text-xs leading-5 text-slate-500">
              কোনো low-stock product পাওয়া যায়নি।
            </p>
          ) : (
            <div className="space-y-3">
              {data.lowStock.map((product, index) => (
                <div
                  key={`${product.name}-${index}`}
                  className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                >
                  <span className="min-w-0 break-words text-xs text-slate-600">
                    {product.name}
                  </span>

                  <span
                    className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-semibold ${
                      product.stock <= 3
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-[#A47708]"
                    }`}
                  >
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
