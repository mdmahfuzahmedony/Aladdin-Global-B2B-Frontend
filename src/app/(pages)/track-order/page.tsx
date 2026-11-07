
"use client";

import { useState } from "react";
import {
  Search,
  Package,
  CheckCircle2,
  Clock3,
  Truck,
  MapPin,
  CalendarDays,
  ShoppingBag,
  AlertCircle,
  Loader2,
  XCircle,
  ArrowRight,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:2001";

type OrderItem = {
  id?: string;
  name?: string;
  productName?: string;
  quantity: number;
  price?: number;
  image?: string;
};

type OrderTimeline = {
  status: string;
  description?: string;
  date?: string;
  completed?: boolean;
};

type Order = {
  id: string;
  orderNumber?: string;
  status: string;
  createdAt?: string;
  estimatedDelivery?: string;
  totalAmount?: number;
  items?: OrderItem[];
  shippingAddress?: string;
  trackingNumber?: string;
  timeline?: OrderTimeline[];
};

const ORDER_STEPS = [
  {
    status: "PENDING",
    title: "Order Placed",
    description: "Your order has been received.",
    icon: ShoppingBag,
  },
  {
    status: "CONFIRMED",
    title: "Order Confirmed",
    description: "Your order has been confirmed.",
    icon: CheckCircle2,
  },
  {
    status: "PROCESSING",
    title: "Processing",
    description: "Your order is being prepared.",
    icon: Package,
  },
  {
    status: "SHIPPED",
    title: "Shipped",
    description: "Your order is on its way.",
    icon: Truck,
  },
  {
    status: "OUT_FOR_DELIVERY",
    title: "Out for Delivery",
    description: "Your order is out for delivery.",
    icon: MapPin,
  },
  {
    status: "DELIVERED",
    title: "Delivered",
    description: "Your order has been delivered.",
    icon: CheckCircle2,
  },
];

function formatDate(date?: string) {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Not available";

  return parsedDate.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPrice(amount?: number) {
  if (amount === undefined || amount === null) return "—";

  return `৳${Number(amount).toLocaleString("en-BD")}`;
}

function normalizeStatus(status: string) {
  return status.toUpperCase().replaceAll(" ", "_");
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = orderId.trim();

    if (!id) {
      setError("Please enter your Order ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOrder(null);

      const response = await fetch(
        `${API_BASE_URL}/api/orders/track/${encodeURIComponent(id)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order not found.");
      }

      const orderData = data.order ?? data.data ?? data;

      if (!orderData?.id && !orderData?.orderNumber) {
        throw new Error("Invalid order information received.");
      }

      setOrder(orderData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to find your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = order
    ? normalizeStatus(order.status)
    : "";

  const isCancelled = currentStatus === "CANCELLED";

  const currentStepIndex = ORDER_STEPS.findIndex(
    (step) => step.status === currentStatus
  );

  const getStepCompleted = (index: number) => {
    if (currentStatus === "DELIVERED") return true;

    if (currentStepIndex === -1) return false;

    return index <= currentStepIndex;
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-[#12233F] px-4 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
            <Truck size={32} className="text-[#D6A419]" />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-[#D6A419]">
            Order Tracking
          </p>

          <h1 className="text-3xl font-bold sm:text-5xl">
            Track Your Order
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            Enter your Order ID below to check your order status and
            follow your delivery progress.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative z-10 mx-auto -mt-8 max-w-3xl px-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xl sm:p-8">
          <form onSubmit={handleTrackOrder}>
            <label
              htmlFor="orderId"
              className="mb-3 block text-sm font-bold text-[#12233F]"
            >
              Enter Your Order ID
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Package
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="orderId"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Example: ORD-123456"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-[#12233F] outline-none transition focus:border-[#D6A419] focus:bg-white focus:ring-2 focus:ring-[#D6A419]/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#D6A419] px-7 text-sm font-bold text-[#12233F] transition hover:bg-[#c49712] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Track Order
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle size={18} />
                {error}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Order Details */}
      {order && (
        <section className="mx-auto max-w-5xl px-4 py-10">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-500">Order Number</p>
              <h2 className="mt-1 break-all text-xl font-bold text-[#12233F]">
                {order.orderNumber || order.id}
              </h2>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${
                isCancelled
                  ? "bg-red-100 text-red-700"
                  : currentStatus === "DELIVERED"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-800"
              }`}
            >
              {currentStatus.replaceAll("_", " ")}
            </span>
          </div>

          {/* Summary Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <CalendarDays className="mb-3 text-[#D6A419]" size={23} />
              <p className="text-xs text-slate-500">Order Date</p>
              <p className="mt-1 font-bold text-[#12233F]">
                {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <Truck className="mb-3 text-[#D6A419]" size={23} />
              <p className="text-xs text-slate-500">Estimated Delivery</p>
              <p className="mt-1 font-bold text-[#12233F]">
                {formatDate(order.estimatedDelivery)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <ShoppingBag className="mb-3 text-[#D6A419]" size={23} />
              <p className="text-xs text-slate-500">Total Amount</p>
              <p className="mt-1 font-bold text-[#12233F]">
                {formatPrice(order.totalAmount)}
              </p>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
            <h3 className="mb-7 text-lg font-bold text-[#12233F]">
              Order Tracking Progress
            </h3>

            {isCancelled ? (
              <div className="flex items-center gap-4 rounded-xl bg-red-50 p-5 text-red-700">
                <XCircle size={30} />
                <div>
                  <p className="font-bold">Order Cancelled</p>
                  <p className="mt-1 text-sm">
                    This order has been cancelled.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {ORDER_STEPS.map((step, index) => {
                  const completed = getStepCompleted(index);
                  const active = index === currentStepIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
                      {index !== ORDER_STEPS.length - 1 && (
                        <div
                          className={`absolute left-[17px] top-9 h-full w-0.5 ${
                            completed ? "bg-[#D6A419]" : "bg-slate-200"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          completed
                            ? "bg-[#D6A419] text-[#12233F]"
                            : "border-2 border-slate-200 bg-white text-slate-400"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 size={19} />
                        ) : (
                          <Icon size={18} />
                        )}
                      </div>

                      <div className="min-w-0 pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4
                            className={`text-sm font-bold ${
                              completed ? "text-[#12233F]" : "text-slate-400"
                            }`}
                          >
                            {step.title}
                          </h4>

                          {active && (
                            <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800">
                              CURRENT STATUS
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Shipping Information */}
          <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            <h3 className="mb-4 text-lg font-bold text-[#12233F]">
              Delivery Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">Shipping Address</p>
                <p className="mt-1 text-sm font-medium text-[#12233F]">
                  {order.shippingAddress || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Tracking Number</p>
                <p className="mt-1 break-all text-sm font-medium text-[#12233F]">
                  {order.trackingNumber || "Not assigned yet"}
                </p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            <h3 className="mb-5 text-lg font-bold text-[#12233F]">
              Ordered Products
            </h3>

            <div className="space-y-4">
              {order.items?.length ? (
                order.items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || item.productName || "Product"}
                          className="h-14 w-14 rounded-xl border border-slate-100 object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <Package size={23} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#12233F]">
                          {item.name || item.productName || "Product"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-[#12233F]">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  Product details are not available.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="px-4 pb-16 pt-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 rounded-2xl bg-[#12233F] p-6 text-center text-white sm:flex-row sm:text-left">
          <div>
            <h3 className="text-lg font-bold">Need Help With Your Order?</h3>
            <p className="mt-1 text-sm text-slate-300">
              Contact our support team for assistance.
            </p>
          </div>

          <a
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#D6A419] px-5 py-3 text-sm font-bold text-[#12233F] transition hover:bg-[#c49712]"
          >
            Contact Support
            <ArrowRight size={17} />
          </a>
        </div>
      </section>
    </main>
  );
}
