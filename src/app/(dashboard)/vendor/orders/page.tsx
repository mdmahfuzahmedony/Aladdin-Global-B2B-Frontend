"use client";
import { toast } from "react-toastify";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ShoppingCart,
  Clock3,
  PackageCheck,
  CheckCircle2,
  XCircle,
  Search,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  UserRound,
  Boxes,
  X,
  AlertTriangle,
} from "lucide-react";

import AdminStatCard from "@/components/cards/AdminStatCard";
import { createClient } from "../../../../../lib/supabase-client";
import OrderDetailsDrawer from "./components/OrderDetailsDrawer";

type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
type PaymentStatus = "PAID" | "PENDING" | "FAILED";

type Order = {
  id: string;
  orderNumber: string;
  customer: string;
  customerEmail: string;
  product: string;
  quantity: number;
  amount: number;
  payment: PaymentStatus;
  status: OrderStatus;
  date: string;
};

type ApiOrder = {
  id: string;
  orderNumber?: string | null;
  customer?: {
    id?: string;
    fullName?: string | null;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
  customerName?: string | null;
  customerEmail?: string | null;
  items?: Array<{
    id?: string;
    productName?: string | null;
    productTitle?: string | null;
    quantity?: number | null;
    unitPrice?: number | string | null;
    totalPrice?: number | string | null;
    productImage?: string | null;
    product?: {
      name?: string | null;
      title?: string | null;
      image?: string | null;
      price?: number | string | null;
    } | null;
  }> | null;
  status?: string | null;
  paymentStatus?: string | null;
  totalAmount?: number | string | null;
  subtotal?: number | string | null;
  deliveryCharge?: number | string | null;
  createdAt?: string | null;
  shippingName?: string | null;
  shippingPhone?: string | null;
  shippingDivision?: string | null;
  shippingDistrict?: string | null;
  shippingUpazila?: string | null;
  shippingArea?: string | null;
  shippingAddress?: string | null;
  courierShipment?: {
    id?: string;
    consignmentId?: string | null;
    trackingCode?: string | null;
    deliveryStatus?: string;
    bookingStatus?: string;
    codAmount?: number | string | null;
    deliveryCharge?: number | string | null;
    bookedAt?: string | null;
  } | null;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  data?:
    | ApiOrder[]
    | {
        orders?: ApiOrder[];
        order?: ApiOrder;
      }
    | ApiOrder;
  orders?: ApiOrder[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const VENDOR_ORDERS_URL = `${API_BASE_URL}/api/vendor/orders`;
const supabase = createClient();

function mapOrderStatus(status?: string | null): OrderStatus {
  switch (status?.toUpperCase()) {
    case "DELIVERED":
    case "COMPLETED":
      return "COMPLETED";

    case "CONFIRMED":
    case "PROCESSING":
    case "PACKED":
    case "SHIPPED":
      return "PROCESSING";

    case "CANCELLED":
    case "CANCELED":
    case "RETURNED":
    case "REFUNDED":
      return "CANCELLED";

    default:
      return "PENDING";
  }
}

function mapPaymentStatus(status?: string | null): PaymentStatus {
  switch (status?.toUpperCase()) {
    case "PAID":
      return "PAID";

    case "FAILED":
    case "REFUNDED":
      return "FAILED";

    default:
      return "PENDING";
  }
}

function formatOrderDate(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function normalizeOrder(order: ApiOrder): Order {
  const items = Array.isArray(order.items) ? order.items : [];

  const productNames = items
    .map(
      (item) =>
        item.productName ||
        item.productTitle ||
        item.product?.name ||
        item.product?.title,
    )
    .filter(
      (name): name is string =>
        typeof name === "string" && name.trim().length > 0,
    );

  const quantity = items.reduce(
    (sum, item) => sum + Math.max(0, Number(item.quantity) || 0),
    0,
  );

  const amount = Number(order.totalAmount);

  return {
    id: order.id,
    orderNumber: order.orderNumber
      ? order.orderNumber.startsWith("#")
        ? order.orderNumber
        : `#${order.orderNumber}`
      : `#${order.id.slice(0, 8).toUpperCase()}`,
    customer:
      order.customer?.fullName ||
      order.customer?.name ||
      order.customerName ||
      "Customer",
    customerEmail: order.customer?.email || order.customerEmail || "—",
    product:
      productNames.length > 0
        ? productNames.join(", ")
        : "Product details unavailable",
    quantity,
    amount: Number.isFinite(amount) ? amount : 0,
    payment: mapPaymentStatus(order.paymentStatus),
    status: mapOrderStatus(order.status),
    date: formatOrderDate(order.createdAt),
  };
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  if (status === "COMPLETED") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-600">
        <CheckCircle2 size={14} />
        Completed
      </span>
    );
  }

  if (status === "PROCESSING") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-blue-600">
        <PackageCheck size={14} />
        Processing
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
    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-red-600">
      <XCircle size={14} />
      Cancelled
    </span>
  );
}

function PaymentBadge({ payment }: { payment: PaymentStatus }) {
  if (payment === "PAID") {
    return (
      <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10.5px] font-semibold text-emerald-600">
        Paid
      </span>
    );
  }

  if (payment === "PENDING") {
    return (
      <span className="rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[10.5px] font-semibold text-amber-600">
        Pending
      </span>
    );
  }

  return (
    <span className="rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-[10.5px] font-semibold text-red-600">
      Failed
    </span>
  );
}

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<"ALL" | PaymentStatus>(
    "ALL",
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const pageSize = 10;

  const fetchVendorOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const token = data.session?.access_token;

      if (!token) {
        throw new Error("আপনার সেশন পাওয়া যায়নি। আবার লগইন করুন।");
      }

      const response = await fetch(VENDOR_ORDERS_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const payload = (await response
        .json()
        .catch(() => null)) as ApiResponse | null;

      if (!response.ok) {
        throw new Error(
          payload?.message ||
            payload?.error ||
            `অর্ডার লোড করা যায়নি। HTTP ${response.status}`,
        );
      }

      if (!payload || payload.success === false) {
        throw new Error(
          payload?.message ||
            payload?.error ||
            "Backend থেকে অর্ডারের তথ্য পাওয়া যায়নি।",
        );
      }

      let result: ApiOrder[] | null = null;

      if (Array.isArray(payload.data)) {
        result = payload.data;
      } else if (
        payload.data &&
        !Array.isArray(payload.data) &&
        "orders" in payload.data &&
        Array.isArray(payload.data.orders)
      ) {
        result = payload.data.orders;
      } else if (Array.isArray(payload.orders)) {
        result = payload.orders;
      }

      if (!result) {
        throw new Error(
          "API response format ঠিক নেই। Backend response যাচাই করুন।",
        );
      }

      setOrders(
        result.filter((order) => Boolean(order?.id)).map(normalizeOrder),
      );

      setSelectedIds([]);
      setPage(1);
    } catch (err) {
      console.error("fetchVendorOrders:", err);
      setError(err instanceof Error ? err.message : "অর্ডার লোড করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchVendorOrders();
  }, [fetchVendorOrders]);

  const openOrderDetails = useCallback(async (orderId: string) => {
    setDrawerOpen(true);
    setSelectedOrder(null);
    setDetailsLoading(true);
    setDetailsError("");

    try {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const token = data.session?.access_token;

      if (!token) {
        throw new Error("আবার লগইন করুন।");
      }

      const response = await fetch(
        `${VENDOR_ORDERS_URL}/${encodeURIComponent(orderId)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        },
      );

      const payload = (await response
        .json()
        .catch(() => null)) as ApiResponse | null;

      if (!response.ok) {
        throw new Error(
          payload?.message ||
            payload?.error ||
            `অর্ডারের বিস্তারিত পাওয়া যায়নি। HTTP ${response.status}`,
        );
      }

      if (!payload || payload.success === false) {
        throw new Error(
          payload?.message ||
            payload?.error ||
            "অর্ডারের বিস্তারিত পাওয়া যায়নি।",
        );
      }

      let rawOrder: ApiOrder | null = null;

      if (
        payload.data &&
        !Array.isArray(payload.data) &&
        "order" in payload.data &&
        payload.data.order
      ) {
        rawOrder = payload.data.order;
      } else if (
        payload.data &&
        !Array.isArray(payload.data) &&
        "id" in payload.data
      ) {
        rawOrder = payload.data as ApiOrder;
      }

      if (!rawOrder?.id) {
        throw new Error("API response-এ order details পাওয়া যায়নি।");
      }

      setSelectedOrder(rawOrder);
    } catch (err) {
      console.error("openOrderDetails:", err);
      setDetailsError(
        err instanceof Error
          ? err.message
          : "অর্ডারের বিস্তারিত লোড করা যায়নি।",
      );
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const closeOrderDetails = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING",
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "PROCESSING",
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "COMPLETED",
  ).length;

  const filteredOrders = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return orders.filter((order) => {
      const searchMatch =
        order.orderNumber.toLowerCase().includes(searchText) ||
        order.customer.toLowerCase().includes(searchText) ||
        order.customerEmail.toLowerCase().includes(searchText) ||
        order.product.toLowerCase().includes(searchText);

      const statusMatch =
        statusFilter === "ALL" || order.status === statusFilter;

      const paymentMatch =
        paymentFilter === "ALL" || order.payment === paymentFilter;

      return searchMatch && statusMatch && paymentMatch;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  const visibleOrders = filteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const allVisibleSelected =
    visibleOrders.length > 0 &&
    visibleOrders.every((order) => selectedIds.includes(order.id));

  function toggleSelectAll() {
    if (allVisibleSelected) {
      setSelectedIds((previous) =>
        previous.filter(
          (id) => !visibleOrders.some((order) => order.id === id),
        ),
      );
    } else {
      setSelectedIds((previous) => [
        ...new Set([...previous, ...visibleOrders.map((order) => order.id)]),
      ]);
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  }

  function requestOrderDelete(order: Order) {
    setDeleteError("");
    setDeleteTarget(order);
  }

  function closeDeleteModal() {
    if (deleteLoading) return;
    setDeleteTarget(null);
    setDeleteError("");
  }

  // নিরাপত্তার জন্য: DELETE API না থাকা পর্যন্ত কোনো অর্ডার মুছবে না।
  function confirmOrderDelete() {
    setDeleteError(
      "Backend-এর order deletion API এখনো যুক্ত করা হয়নি। কোনো অর্ডার মুছে ফেলা হয়নি।",
    );
  }

  function requestBulkDelete() {
    toast.info("Bulk order deletion API এখনো যুক্ত করা হয়নি। কোনো অর্ডার মুছে ফেলা হয়নি।",);
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-[#12233F]">My Orders</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Manage and monitor orders for your store
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="My Orders"
            value={totalOrders}
            icon={ShoppingCart}
            variant="blue"
            description="All orders for your store"
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
            description="Currently being processed"
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
          <div className="border-b border-slate-100 p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-[#12233F]">
                  My Orders
                </h2>
                <p className="mt-1 text-[11.5px] text-slate-400">
                  {filteredOrders.length} orders found
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
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search orders..."
                    className="w-64 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-[12px] outline-none transition focus:border-[#D6A419] focus:bg-white"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as "ALL" | OrderStatus)
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[12px] text-slate-600 outline-none focus:border-[#D6A419]"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                  value={paymentFilter}
                  onChange={(event) =>
                    setPaymentFilter(
                      event.target.value as "ALL" | PaymentStatus,
                    )
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[12px] text-slate-600 outline-none focus:border-[#D6A419]"
                >
                  <option value="ALL">All Payments</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>

                <button
                  type="button"
                  onClick={() => void fetchVendorOrders()}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between border-b border-rose-100 bg-rose-50 px-5 py-3">
              <p className="text-[12px] font-semibold text-rose-700">
                {selectedIds.length} order
                {selectedIds.length > 1 ? "s" : ""} selected
              </p>

              <button
                type="button"
                onClick={requestBulkDelete}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-3.5 py-2 text-[11.5px] font-bold text-white transition hover:bg-red-700"
              >
                <Trash2 size={14} />
                Delete Selected
              </button>
            </div>
          )}

          {error && (
            <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                Could not load orders
              </p>
              <p className="mt-1 text-xs text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => void fetchVendorOrders()}
                disabled={loading}
                className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                Try again
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="w-12 px-5 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      disabled={loading || visibleOrders.length === 0}
                      className="h-4 w-4 rounded border-slate-300 accent-[#D6A419]"
                      onClick={(event) => event.stopPropagation()}
                      aria-label="Select all visible orders"
                    />
                  </th>

                  {[
                    "Order",
                    "Customer",
                    "Product",
                    "Quantity",
                    "Amount",
                    "Payment",
                    "Status",
                    "Date",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className={`px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400 ${
                        heading === "Action" ? "px-5 text-right" : ""
                      }`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-5 py-14 text-center text-[13px] text-slate-400"
                    >
                      Loading your orders...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-5 py-10 text-center text-[13px] text-slate-400"
                    >
                      Fix the API error above to load orders.
                    </td>
                  </tr>
                ) : visibleOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-5 py-14 text-center text-[13px] text-slate-400"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  visibleOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => void openOrderDetails(order.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          void openOrderDetails(order.id);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View order ${order.orderNumber}`}
                      className="cursor-pointer transition hover:bg-slate-50/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D6A419]"
                    >
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(order.id)}
                          onClick={(event) => event.stopPropagation()}
                          onChange={() => toggleSelect(order.id)}
                          className="h-4 w-4 rounded border-slate-300 accent-[#D6A419]"
                          aria-label={`Select order ${order.orderNumber}`}
                        />
                      </td>

                      <td className="px-3 py-4">
                        <p className="text-[12.5px] font-bold text-[#12233F]">
                          {order.orderNumber}
                        </p>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <UserRound size={15} />
                          </div>
                          <div>
                            <p className="text-[12px] font-semibold text-[#12233F]">
                              {order.customer}
                            </p>
                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {order.customerEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                            <Boxes size={14} />
                          </div>
                          <p className="max-w-[180px] truncate text-[12px] font-medium text-slate-600">
                            {order.product}
                          </p>
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        <span className="text-[12px] font-semibold text-slate-600">
                          ×{order.quantity}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <span className="text-[12.5px] font-bold text-[#12233F]">
                          ৳{order.amount.toLocaleString("en-BD")}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <PaymentBadge payment={order.payment} />
                      </td>

                      <td className="px-3 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>

                      <td className="px-3 py-4 text-[11.5px] text-slate-500">
                        {order.date}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            title="View order details"
                            aria-label={`View order ${order.orderNumber}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              void openOrderDetails(order.id);
                            }}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#12233F]"
                          >
                            <MoreHorizontal size={17} />
                          </button>

                          <button
                            type="button"
                            title="Delete"
                            aria-label={`Delete order ${order.orderNumber}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              requestOrderDelete(order);
                            }}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <p className="text-[11.5px] text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-600">
                {filteredOrders.length === 0 ? 0 : (page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, filteredOrders.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-600">
                {filteredOrders.length}
              </span>{" "}
              orders
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>

              <span className="px-3 py-1.5 text-[11px] font-semibold text-[#12233F]">
                {page} / {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
                className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleteLoading) {
              closeDeleteModal();
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && !deleteLoading) {
              closeDeleteModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-order-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle size={23} />
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                aria-label="Close delete confirmation"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <h2
              id="delete-order-title"
              className="mt-4 text-lg font-bold text-[#12233F]"
            >
              Delete this order?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              তুমি কি অর্ডার{" "}
              <span className="font-bold text-[#12233F]">
                {deleteTarget.orderNumber}
              </span>{" "}
              মুছে ফেলতে চাও?
            </p>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              অর্ডারের ইতিহাস ও হিসাব সংরক্ষণ করা গুরুত্বপূর্ণ। Backend-এর
              নিরাপদ Delete API তৈরি না হওয়া পর্যন্ত কোনো অর্ডার মুছে ফেলা হবে
              না।
            </div>

            {deleteError && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
              >
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={closeDeleteModal}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteLoading}
                onClick={confirmOrderDelete}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={15} />
                {deleteLoading ? "Deleting..." : "Delete Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      <OrderDetailsDrawer
        order={selectedOrder as any}
        loading={detailsLoading}
        error={detailsError}
        open={drawerOpen}
        onClose={closeOrderDetails}
        onCourierBooked={() => fetchVendorOrders()}
      />
    </>
  );
}
