"use client";


import { X, UserRound, CalendarDays } from "lucide-react";

type OrderItem = {
  id: string;
  productTitle?: string;
  productName?: string;
  quantity: number;
  unitPrice: number | string;
  totalPrice: number | string;
};

type VendorOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal?: number | string;
  deliveryFee?: number | string;
  discount?: number | string;
  note?: string | null;
  totalAmount: number | string;
  vendor?: {
    id: string;
    storeName: string;
  };
  items: OrderItem[];
};

export type OrderDetails = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number | string;
  deliveryCharge: number | string;
  totalAmount: number | string;
  createdAt: string;
  customer?: {
    id: string;
    fullName: string | null;
    email: string | null;
  };
  items: OrderItem[];
  vendorOrders: VendorOrder[];
  shippingName?: string | null;
  shippingPhone?: string | null;
  shippingDivision?: string | null;
  shippingDistrict?: string | null;
  shippingUpazila?: string | null;
  shippingArea?: string | null;
  shippingAddress?: string | null;
};

type Props = {
  order: OrderDetails | null;
  loading?: boolean;
  error?: string;
  onClose: () => void;
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

function label(value: string) {
  const labels: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PROCESSING: "Processing",
    PACKED: "Packed",
    SHIPPED: "Shipped",
    DELIVERED: "Completed",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    PAID: "Paid",
    FAILED: "Failed",
    REFUNDED: "Refunded",
  };

  return labels[value?.toUpperCase()] ?? value;
}

function Badge({ value }: { value: string }) {
  const status = value.toUpperCase();

  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-600",
    CONFIRMED: "bg-blue-50 text-blue-600",
    PROCESSING: "bg-blue-50 text-blue-600",
    PACKED: "bg-indigo-50 text-indigo-600",
    SHIPPED: "bg-cyan-50 text-cyan-600",
    DELIVERED: "bg-emerald-50 text-emerald-600",
    COMPLETED: "bg-emerald-50 text-emerald-600",
    PAID: "bg-emerald-50 text-emerald-600",
    CANCELLED: "bg-red-50 text-red-600",
    FAILED: "bg-red-50 text-red-600",
    REFUNDED: "bg-purple-50 text-purple-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
        styles[status] ?? "bg-slate-50 text-slate-600"
      }`}
    >
      {label(status)}
    </span>
  );
}

export default function OrderDetailsDrawer({
  order,
  loading = false,
  error = "",
  onClose,
}: Props) {
  if (!order && !loading) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/30"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Order details"
        className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="text-base font-bold text-[#12233F]">
              Order Details
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {order?.orderNumber ?? "Loading order..."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
            Loading order details...
          </div>
        ) : error ? (
          <div className="m-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        ) : order ? (
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <UserRound size={15} />
                  <span className="text-[11px]">Customer</span>
                </div>
                <p className="text-sm font-semibold text-[#12233F]">
                  {order.customer?.fullName ||
                    order.shippingName ||
                    "Unknown Customer"}
                </p>
                <p className="mt-1 break-all text-xs text-slate-500">
                  {order.customer?.email || "No email"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {order.shippingPhone || "No phone"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <CalendarDays size={15} />
                  <span className="text-[11px]">Order Date</span>
                </div>
                <p className="text-sm font-semibold text-[#12233F]">
                  {formatDate(order.createdAt)}
                </p>
                <div className="mt-2">
                  <Badge value={order.status} />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Payment: {label(order.paymentStatus)}
                </p>
              </div>
            </div>

            <section>
              <h3 className="mb-3 text-sm font-bold text-[#12233F]">
                Products
              </h3>

              <div className="space-y-3">
                {(order.items ?? []).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700">
                        {item.productTitle || item.productName || "Product"}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Qty: {item.quantity} × ৳{money(item.unitPrice)}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-[#12233F]">
                      ৳{money(item.totalPrice)}
                    </p>
                  </div>
                ))}

                {!order.items?.length && (
                  <p className="text-xs text-slate-400">
                    No product items found.
                  </p>
                )}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-bold text-[#12233F]">
                Seller Orders
              </h3>

              <div className="space-y-3">
                {(order.vendorOrders ?? []).map((vendorOrder) => (
                  <div
                    key={vendorOrder.id}
                    className="rounded-xl border border-slate-100 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[#12233F]">
                          {vendorOrder.vendor?.storeName || "Seller"}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {vendorOrder.orderNumber}
                        </p>
                      </div>
                      <Badge value={vendorOrder.status} />
                    </div>

                    {(vendorOrder.items ?? []).map((item) => (
                      <div
                        key={item.id}
                        className="mt-3 flex justify-between gap-3 border-t border-slate-100 pt-3"
                      >
                        <div>
                          <p className="text-xs font-medium text-slate-600">
                            {item.productTitle || item.productName || "Product"}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-xs font-semibold text-slate-700">
                          ৳{money(item.totalPrice)}
                        </p>
                      </div>
                    ))}

                    {vendorOrder.subtotal !== undefined && Number(vendorOrder.subtotal) > 0 && (
                      <div className="mt-3 flex justify-between border-t border-slate-100 pt-2 text-xs text-slate-500">
                        <span>Items Subtotal</span>
                        <span>৳{money(vendorOrder.subtotal)}</span>
                      </div>
                    )}
                    {vendorOrder.deliveryFee !== undefined && Number(vendorOrder.deliveryFee) > 0 && (
                      <div className="mt-1 flex justify-between text-xs text-slate-500">
                        <span>Delivery Fee</span>
                        <span>৳{money(vendorOrder.deliveryFee)}</span>
                      </div>
                    )}
                    {Number(vendorOrder.discount ?? 0) > 0 && (
                      <div className="mt-1 flex justify-between text-xs font-semibold text-emerald-600">
                        <span>Coupon Discount {vendorOrder.note ? `(${vendorOrder.note})` : ""}</span>
                        <span>-৳{money(vendorOrder.discount)}</span>
                      </div>
                    )}
                    <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 text-xs">
                      <span className="font-medium text-slate-600">Seller order total</span>
                      <span className="font-bold text-[#12233F]">
                        ৳{money(vendorOrder.totalAmount)}
                      </span>
                    </div>
                  </div>
                ))}

                {!order.vendorOrders?.length && (
                  <p className="text-xs text-slate-400">
                    No seller orders found.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-xl bg-slate-50 p-4">
              <h3 className="mb-3 text-sm font-bold text-[#12233F]">
                Shipping Address
              </h3>
              <p className="text-xs leading-6 text-slate-600">
                {[
                  order.shippingAddress,
                  order.shippingArea,
                  order.shippingUpazila,
                  order.shippingDistrict,
                  order.shippingDivision,
                ]
                  .filter(Boolean)
                  .join(", ") || "Shipping address not available."}
              </p>
            </section>

            {(() => {
              const vendorTotalDiscount = (order.vendorOrders ?? []).reduce(
                (sum, vo) => sum + Number(vo.discount || 0),
                0
              );
              const calculatedDiscount = Math.max(
                0,
                Number(
                  (
                    Number(order.subtotal || 0) +
                    Number(order.deliveryCharge || 0) -
                    Number(order.totalAmount || 0)
                  ).toFixed(2)
                )
              );
              const discount = vendorTotalDiscount > 0 ? vendorTotalDiscount : calculatedDiscount;

              return (
                <section className="rounded-xl bg-slate-50 p-4">
                  <h3 className="mb-3 text-sm font-bold text-[#12233F]">
                    Payment Summary
                  </h3>

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Subtotal</span>
                    <span>৳{money(order.subtotal)}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>Delivery Charge</span>
                    <span>৳{money(order.deliveryCharge)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="mt-2 flex justify-between text-xs font-semibold text-emerald-600">
                      <span>Coupon Discount</span>
                      <span>-৳{money(discount)}</span>
                    </div>
                  )}
                  <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-sm font-bold text-[#12233F]">
                    <span>Total</span>
                    <span>৳{money(order.totalAmount)}</span>
                  </div>
                </section>
              );
            })()}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
