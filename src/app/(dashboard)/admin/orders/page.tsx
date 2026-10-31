"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ShoppingCart,
  Clock3,
  PackageCheck,
  CheckCircle2,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  X,
} from "lucide-react";

import AdminStatCard from "@/components/cards/AdminStatCard";
import OrderDetailsDrawer, {
  OrderDetails,
} from "./components/OrderDetailsDrawer";
import { createClient } from "../../../../../lib/supabase-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | string;

type PaymentStatus = string;

type ApiOrderItem = {
  id: string;
  productTitle?: string;
  productName?: string;
  quantity: number;
  unitPrice: number | string;
  totalPrice: number | string;
  productImage?: string | null;
};

type ApiVendorOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number | string;
  vendor?: {
    id: string;
    storeName: string;
  };
  items: ApiOrderItem[];
};

type ApiOrder = OrderDetails & {
  vendorOrders: ApiVendorOrder[];
};

type Order = {
  id: string;
  orderNumber: string;
  customer: string;
  customerEmail: string;
  product: string;
  seller: string;
  amount: number;
  payment: PaymentStatus;
  status: OrderStatus;
  date: string;
  vendorOrders: ApiVendorOrder[];
};

type ApiResponse = {
  success: boolean;
  data: ApiOrder[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats?: {
    status: string;
    count: number;
  }[];
  message?: string;
  error?: string;
};

function money(value: number | string | undefined) {
  return Number(value ?? 0).toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  });
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PROCESSING: "Processing",
    PACKED: "Packed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  return labels[status?.toUpperCase()] ?? status;
}

function statusClass(status: string) {
  const classes: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 ring-amber-100",
    CONFIRMED: "bg-blue-50 text-blue-700 ring-blue-100",
    PROCESSING: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    PACKED: "bg-violet-50 text-violet-700 ring-violet-100",
    SHIPPED: "bg-cyan-50 text-cyan-700 ring-cyan-100",
    DELIVERED: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    CANCELLED: "bg-red-50 text-red-700 ring-red-100",
  };

  return (
    classes[status?.toUpperCase()] ??
    "bg-slate-50 text-slate-600 ring-slate-100"
  );
}

function paymentClass(status: string) {
  const value = status?.toUpperCase();

  if (["PAID", "COMPLETED", "SUCCESS"].includes(value)) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }

  if (["FAILED", "CANCELLED", "REFUNDED"].includes(value)) {
    return "bg-red-50 text-red-700 ring-red-100";
  }

  return "bg-amber-50 text-amber-700 ring-amber-100";
}

function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-semibold ring-1 ring-inset ${statusClass(
        status,
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-semibold ring-1 ring-inset ${paymentClass(
        status,
      )}`}
    >
      {status || "UNKNOWN"}
    </span>
  );
}

function mapOrder(order: ApiOrder): Order {
  const items =
    order.items?.length > 0
      ? order.items
      : (order.vendorOrders ?? []).flatMap(
          (vendorOrder) => vendorOrder.items ?? [],
        );

  const productNames = [
    ...new Set(
      items
        .map((item) => item.productTitle || item.productName)
        .filter(Boolean),
    ),
  ];

  const sellers = [
    ...new Set(
      (order.vendorOrders ?? [])
        .map((item) => item.vendor?.storeName)
        .filter(Boolean),
    ),
  ];

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customer:
      order.customer?.fullName || order.shippingName || "Unknown Customer",
    customerEmail: order.customer?.email || "—",
    product:
      productNames.length > 0
        ? `${productNames.slice(0, 2).join(", ")}${
            productNames.length > 2 ? ` +${productNames.length - 2} more` : ""
          }`
        : "No products",
    seller: sellers.length > 0 ? sellers.join(", ") : "—",
    amount: Number(order.totalAmount ?? 0),
    payment: order.paymentStatus,
    status: order.status,
    date: order.createdAt,
    vendorOrders: order.vendorOrders ?? [],
  };
}

export default function OrdersPage() {
  const [supabase] = useState(() => createClient());

  const [orders, setOrders] = useState<Order[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<Record<string, number>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session?.access_token) {
        throw new Error("Please log in again to view orders.");
      }

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search) params.set("search", search);
      if (statusFilter !== "ALL") {
        params.set("status", statusFilter);
      }
      if (paymentFilter !== "ALL") {
        params.set("paymentStatus", paymentFilter);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/orders?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        },
      );

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || result.error || "Failed to load orders.",
        );
      }

      setOrders((result.data ?? []).map(mapOrder));
      setTotal(result.pagination?.total ?? result.data?.length ?? 0);
      setTotalPages(Math.max(1, result.pagination?.totalPages ?? 1));

      const nextStats: Record<string, number> = {};

      for (const stat of result.stats ?? []) {
        nextStats[stat.status.toUpperCase()] = stat.count;
      }

      setStats(nextStats);
    } catch (err) {
      setOrders([]);
      setError(err instanceof Error ? err.message : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [supabase, page, limit, search, statusFilter, paymentFilter, refreshKey]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const openOrderDetails = useCallback(
    async (orderId: string) => {
      setSelectedOrder(null);
      setDetailsError("");
      setDetailsLoading(true);

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.access_token) {
          throw new Error("Please log in again.");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/admin/orders/${encodeURIComponent(orderId)}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            cache: "no-store",
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || result.error || "Could not load order details.",
          );
        }

        setSelectedOrder(result.data as OrderDetails);
      } catch (err) {
        setDetailsError(
          err instanceof Error ? err.message : "Could not load order details.",
        );
      } finally {
        setDetailsLoading(false);
      }
    },
    [supabase],
  );

  const toggleSelected = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const toggleAll = () => {
    const visibleIds = orders.map((order) => order.id);
    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedIds.includes(id));

    setSelectedIds((current) =>
      allSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : [...new Set([...current, ...visibleIds])],
    );
  };

  const allVisibleSelected =
    orders.length > 0 &&
    orders.every((order) => selectedIds.includes(order.id));

  const totalOrders = total;
  const pendingOrders = stats.PENDING ?? 0;
  const processingOrders =
    (stats.PROCESSING ?? 0) +
    (stats.CONFIRMED ?? 0) +
    (stats.PACKED ?? 0) +
    (stats.SHIPPED ?? 0);
  const completedOrders = (stats.COMPLETED ?? 0) + (stats.DELIVERED ?? 0);

  const pagination = useMemo(() => {
    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return { start, end };
  }, [page, limit, total]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-[#12233F]">
            Orders Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and track all platform orders.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((value) => value + 1)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Orders"
          value={totalOrders}
          icon={ShoppingCart}
          variant="blue"
          description="All platform orders"
        />
        <AdminStatCard
          label="Pending Orders"
          value={pendingOrders}
          icon={Clock3}
          variant="orange"
          description="Waiting for processing"
        />
        <AdminStatCard
          label="Processing Orders"
          value={processingOrders}
          icon={PackageCheck}
          variant="purple"
          description="Currently processing"
        />
        <AdminStatCard
          label="Completed Orders"
          value={completedOrders}
          icon={CheckCircle2}
          variant="green"
          description="Successfully completed"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#12233F]">All Orders</h2>
            <p className="mt-1 text-xs text-slate-500">{total} orders found</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search orders..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-[#D6A419] sm:w-56"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-[#D6A419]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="PACKED">Packed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(event) => {
                setPaymentFilter(event.target.value);
                setPage(1);
              }}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-[#D6A419]"
            >
              <option value="ALL">All Payments</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="m-4 flex items-start justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-600">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setRefreshKey((value) => value + 1)}
              className="shrink-0 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAll}
                    aria-label="Select all visible orders"
                    className="h-3.5 w-3.5 cursor-pointer accent-[#12233F]"
                  />
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Order
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Customer
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Product
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Seller
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Amount
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Payment
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Date
                </th>
                <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-14 text-center text-xs text-slate-400"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-14 text-center text-xs text-slate-400"
                  >
                    {error ? "Orders could not be loaded." : "No orders found."}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => void openOrderDetails(order.id)}
                    className="cursor-pointer transition hover:bg-slate-50/70"
                  >
                    <td
                      className="px-4 py-3"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(order.id)}
                        onChange={() => toggleSelected(order.id)}
                        aria-label={`Select order ${order.orderNumber}`}
                        className="h-3.5 w-3.5 cursor-pointer accent-[#12233F]"
                      />
                    </td>

                    <td className="px-3 py-3">
                      <p className="whitespace-nowrap text-xs font-bold text-[#12233F]">
                        #{order.orderNumber}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {order.vendorOrders.length} seller order
                        {order.vendorOrders.length === 1 ? "" : "s"}
                      </p>
                    </td>

                    <td className="px-3 py-3">
                      <p className="max-w-[160px] truncate text-xs font-semibold text-slate-700">
                        {order.customer}
                      </p>
                      <p className="mt-1 max-w-[160px] truncate text-[10px] text-slate-400">
                        {order.customerEmail}
                      </p>
                    </td>

                    <td className="px-3 py-3">
                      <p className="max-w-[190px] truncate text-xs text-slate-600">
                        {order.product}
                      </p>
                    </td>

                    <td className="px-3 py-3">
                      <p className="max-w-[150px] truncate text-xs text-slate-600">
                        {order.seller}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 text-xs font-bold text-[#12233F]">
                      ৳{money(order.amount)}
                    </td>

                    <td className="px-3 py-3">
                      <PaymentBadge status={order.payment} />
                    </td>

                    <td className="px-3 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-500">
                      {formatDate(order.date)}
                    </td>

                    <td
                      className="px-3 py-3 text-right"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        title="View order details"
                        aria-label={`View order ${order.orderNumber}`}
                        onClick={() => void openOrderDetails(order.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-[#12233F]"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        type="button"
                        title="More actions"
                        aria-label={`More actions for ${order.orderNumber}`}
                        onClick={() => void openOrderDetails(order.id)}
                        className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-[#12233F]"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {pagination.start}-{pagination.end}
            </span>{" "}
            of <span className="font-semibold text-slate-700">{total}</span>{" "}
            orders
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            <span className="min-w-16 text-center text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs text-slate-600">
            <span className="font-bold text-[#12233F]">
              {selectedIds.length}
            </span>{" "}
            order(s) selected
          </p>

          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#12233F]"
          >
            <X size={14} />
            Clear selection
          </button>
        </div>
      )}

      <OrderDetailsDrawer
        order={selectedOrder}
        loading={detailsLoading}
        error={detailsError}
        onClose={() => {
          setSelectedOrder(null);
          setDetailsError("");
        }}
      />
    </div>
  );
}
