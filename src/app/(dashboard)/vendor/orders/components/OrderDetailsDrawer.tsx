"use client";

import { useEffect, useState } from "react";
import {
  X,
  Package,
  UserRound,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  CalendarDays,
  Hash,
  Truck,
  LoaderCircle,
  AlertCircle,
  ShoppingBag,
  Send,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { createClient } from "../../../../../../lib/supabase-client";
import { getValidImageUrl } from "../../../../../../lib/image-util";


/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export type VendorOrderDetails = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  subtotal: number;
  deliveryCharge: number;
  deliveryFee?: number;
  discount?: number;
  note?: string | null;
  createdAt: string;

  customer?: {
    fullName?: string;
    name?: string;
    email?: string;
    phone?: string;
  } | null;

  customerName?: string;
  customerEmail?: string;

  shippingName?: string;
  shippingPhone?: string;
  shippingDivision?: string;
  shippingDistrict?: string;
  shippingUpazila?: string;
  shippingArea?: string;
  shippingAddress?: string;

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

  items: {
    id?: string;
    productName?: string;
    productTitle?: string;
    quantity?: number;
    unitPrice?: number;
    totalPrice?: number;
    productImage?: string;
  }[];
};

type OrderDetailsDrawerProps = {
  order: VendorOrderDetails | null;
  loading: boolean;
  error: string;
  open: boolean;
  onClose: () => void;
  onCourierBooked?: (orderId: string) => void;
};

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

function formatCurrency(amount?: number | null): string {
  return `৳${Number(amount || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date?: string): string {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function getStatusStyle(status: string): string {
  const value = status.toUpperCase();

  if (["DELIVERED", "COMPLETED"].includes(value)) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (["PROCESSING", "CONFIRMED", "PACKED", "SHIPPED"].includes(value)) {
    return "bg-blue-50 text-blue-700 ring-blue-200";
  }

  if (["CANCELLED", "CANCELED", "RETURNED", "REFUNDED"].includes(value)) {
    return "bg-red-50 text-red-700 ring-red-200";
  }

  return "bg-amber-50 text-amber-700 ring-amber-200";
}

function getPaymentStyle(status: string): string {
  const value = status.toUpperCase();

  if (value === "PAID") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (["FAILED", "REFUNDED"].includes(value)) {
    return "bg-red-50 text-red-700 ring-red-200";
  }

  return "bg-amber-50 text-amber-700 ring-amber-200";
}

function getCustomerName(order: VendorOrderDetails): string {
  return (
    order.customer?.fullName ||
    order.customer?.name ||
    order.shippingName ||
    order.customerName ||
    "Unknown Customer"
  );
}

function getCustomerEmail(order: VendorOrderDetails): string {
  return order.customer?.email || order.customerEmail || "";
}

function getCustomerPhone(order: VendorOrderDetails): string {
  return order.customer?.phone || order.shippingPhone || "";
}

function getItemName(item: VendorOrderDetails["items"][number]): string {
  return item.productName || item.productTitle || "Product";
}

/* -------------------------------------------------------------------------- */
/*                              REUSABLE COMPONENTS                           */
/* -------------------------------------------------------------------------- */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0 text-slate-400">{icon}</div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>

        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-[#D6A419]">{icon}</span>

      <h3 className="text-sm font-bold text-[#12233F]">{title}</h3>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             DRAWER COMPONENT                               */
/* -------------------------------------------------------------------------- */

export default function OrderDetailsDrawer({
  order,
  loading,
  error,
  open,
  onClose,
  onCourierBooked,
}: OrderDetailsDrawerProps) {
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [courierBooked, setCourierBooked] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [consignmentId, setConsignmentId] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  // Sync courier shipment details from the selected order
  useEffect(() => {
    setBookingLoading(false);
    setBookingError("");
    setTrackingLoading(false);

    if (
      order?.courierShipment &&
      order.courierShipment.bookingStatus === "SUCCESS"
    ) {
      setCourierBooked(true);
      setBookingMessage("অর্ডারটি ইতিমধ্যে Steadfast কুরিয়ারে বুক করা হয়েছে।");
      setTrackingCode(order.courierShipment.trackingCode || "");
      setConsignmentId(order.courierShipment.consignmentId || "");
      setDeliveryStatus(order.courierShipment.deliveryStatus || "PENDING");
    } else {
      setCourierBooked(false);
      setBookingMessage("");
      setTrackingCode("");
      setConsignmentId("");
      setDeliveryStatus("");
    }
  }, [order]);

  const handleSendToCourier = async () => {
    if (!order?.id || bookingLoading) return;

    setBookingLoading(true);
    setBookingMessage("");
    setBookingError("");

    try {
      const supabase = createClient();
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error("লগইন সেশন পাওয়া যায়নি। অনুগ্রহ করে পুনরায় লগইন করুন।");
      }

      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      const response = await fetch(
        `${apiBaseUrl}/api/courier/vendor-orders/${encodeURIComponent(
          order.id,
        )}/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || `Courier booking failed (${response.status})`,
        );
      }

      setCourierBooked(true);
      setBookingMessage(
        data.message || "Steadfast courier-এ সফলভাবে অর্ডার বুক করা হয়েছে!",
      );

      const shipment = data.shipment;
      setTrackingCode(shipment?.trackingCode || "");
      setConsignmentId(shipment?.consignmentId || "");
      setDeliveryStatus(shipment?.deliveryStatus || "PENDING");

      onCourierBooked?.(order.id);
    } catch (err) {
      setBookingError(
        err instanceof Error
          ? err.message
          : "কুরিয়ার বুকিং করতে সমস্যা হয়েছে।",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const handleRefreshTracking = async () => {
    if (!order?.id || trackingLoading) return;

    setTrackingLoading(true);
    setBookingError("");

    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error("লগইন সেশন পাওয়া যায়নি।");
      }

      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      const response = await fetch(
        `${apiBaseUrl}/api/courier/vendor-orders/${encodeURIComponent(
          order.id,
        )}/tracking`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "ট্র্যাকিং স্ট্যাটাস রিফ্রেশ করা যায়নি।",
        );
      }

      if (data?.shipment?.deliveryStatus) {
        setDeliveryStatus(data.shipment.deliveryStatus);
        setBookingMessage(
          `সর্বশেষ কুরিয়ার স্ট্যাটাস: ${data.shipment.deliveryStatus}`,
        );
      }
    } catch (err) {
      setBookingError(
        err instanceof Error
          ? err.message
          : "ট্র্যাকিং স্ট্যাটাস পেতে সমস্যা হয়েছে।",
      );
    } finally {
      setTrackingLoading(false);
    }
  };

  if (!open) return null;

  const items = order?.items || [];

  const calculatedSubtotal = items.reduce((sum, item) => {
    if (item.totalPrice !== undefined) {
      return sum + Number(item.totalPrice || 0);
    }

    return sum + Number(item.unitPrice || 0) * Number(item.quantity || 1);
  }, 0);

  const subtotal =
    order?.subtotal !== undefined && order.subtotal !== null
      ? order.subtotal
      : calculatedSubtotal;

  const customerName = order ? getCustomerName(order) : "";
  const customerEmail = order ? getCustomerEmail(order) : "";
  const customerPhone = order ? getCustomerPhone(order) : "";

  const addressParts = order
    ? [
        order.shippingAddress,
        order.shippingArea,
        order.shippingUpazila,
        order.shippingDistrict,
        order.shippingDivision,
      ].filter(Boolean)
    : [];

  const fullAddress = addressParts.length
    ? addressParts.join(", ")
    : "Shipping address not provided";

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end"
      aria-label="Order details"
    >
      {/* Background overlay */}
      <button
        type="button"
        aria-label="Close order details"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-drawer-title"
        className="relative z-10 flex h-full w-full max-w-[620px] flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#12233F] text-white">
              <ShoppingBag size={21} />
            </div>

            <div className="min-w-0">
              <h2
                id="order-drawer-title"
                className="text-lg font-bold text-[#12233F]"
              >
                Order Details
              </h2>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                {order ? `Order #${order.orderNumber}` : "Order information"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6">
          {/* Loading */}
          {loading && (
            <div className="flex min-h-[350px] flex-col items-center justify-center gap-4">
              <LoaderCircle size={38} className="animate-spin text-[#D6A419]" />

              <div className="text-center">
                <p className="font-semibold text-[#12233F]">
                  Loading order details
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Please wait a moment...
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                <AlertCircle size={28} />
              </div>

              <h3 className="mt-4 font-bold text-slate-800">
                Unable to load order
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-5 rounded-xl bg-[#12233F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1b355c]"
              >
                Close
              </button>
            </div>
          )}

          {/* Order content */}
          {!loading && !error && order && (
            <div className="space-y-5">
              {/* Order summary */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Order number
                    </p>

                    <h3 className="mt-1 break-all text-xl font-bold text-[#12233F]">
                      #{order.orderNumber}
                    </h3>

                    <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays size={14} />
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(
                        order.status,
                      )}`}
                    >
                      {order.status.replaceAll("_", " ")}
                    </span>

                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getPaymentStyle(
                        order.paymentStatus,
                      )}`}
                    >
                      {order.paymentStatus.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-sm text-slate-500">Total order amount (COD)</p>

                  <p className="mt-1 text-3xl font-bold text-[#12233F]">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
              </section>

              {/* Steadfast Courier Booking Section */}
              <section className="rounded-2xl border-2 border-emerald-500/30 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                      <Truck size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#12233F]">
                        Steadfast Courier Integration
                      </h3>
                      <p className="text-xs text-slate-500">
                        সরাসরি Steadfast Courier-এ অর্ডার কনসাইনমেন্ট তৈরি করুন
                      </p>
                    </div>
                  </div>

                  {courierBooked && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      <CheckCircle2 size={13} />
                      Booked
                    </span>
                  )}
                </div>

                {courierBooked ? (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                        <div className="min-w-0 flex-1 space-y-1.5 text-xs text-slate-700">
                          <p className="font-semibold text-emerald-800">
                            {bookingMessage || "Steadfast Courier-এ সফলভাবে বুক করা হয়েছে"}
                          </p>

                          {consignmentId && (
                            <p className="flex items-center gap-1.5">
                              <span className="font-medium text-slate-500">Consignment ID:</span>
                              <span className="font-mono font-bold text-slate-900">
                                {consignmentId}
                              </span>
                            </p>
                          )}

                          {trackingCode && (
                            <p className="flex items-center gap-1.5">
                              <span className="font-medium text-slate-500">Tracking Code:</span>
                              <span className="font-mono font-bold text-emerald-700">
                                {trackingCode}
                              </span>
                            </p>
                          )}

                          {deliveryStatus && (
                            <p className="flex items-center gap-1.5">
                              <span className="font-medium text-slate-500">Status:</span>
                              <span className="inline-block uppercase font-bold text-slate-800">
                                {deliveryStatus}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleRefreshTracking}
                        disabled={trackingLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        <RefreshCw
                          size={14}
                          className={trackingLoading ? "animate-spin text-emerald-600" : ""}
                        />
                        {trackingLoading ? "যাচাই হচ্ছে..." : "Track / Status Refresh"}
                      </button>

                      {trackingCode && (
                        <a
                          href={`https://steadfast.com.bd/t/${encodeURIComponent(trackingCode)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-200"
                        >
                          Steadfast-এ ট্র্যাক করুন ↗
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="mb-4 text-xs leading-5 text-slate-600">
                      এই অর্ডারের জন্য Steadfast কুরিয়ারে বুকিং নিশ্চিত করতে নিচের বাটনে ক্লিক করুন। স্বয়ংক্রিয়ভাবে Consignment তৈরি হবে ও Tracking Code পাওয়া যাবে।
                    </p>

                    <div className="mb-4 rounded-xl bg-slate-50 p-3.5 text-xs space-y-1.5 border border-slate-200">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Recipient Name:</span>
                        <span className="font-semibold text-slate-800">
                          {order.shippingName || customerName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Recipient Phone:</span>
                        <span className="font-mono font-semibold text-slate-800">
                          {order.shippingPhone || customerPhone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">COD Collection:</span>
                        <span className="font-bold text-emerald-700">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                      <div className="pt-1 border-t border-slate-200">
                        <span className="text-slate-500">Address: </span>
                        <span className="text-slate-700 font-medium">{fullAddress}</span>
                      </div>
                    </div>

                    {bookingError && (
                      <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
                        <div className="flex items-start gap-2.5">
                          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
                          <div className="space-y-1">
                            <p className="font-bold text-red-900">
                              বুকিং করা সম্ভব হয়নি:
                            </p>
                            <p className="leading-relaxed text-red-800">
                              {bookingError}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSendToCourier}
                      disabled={bookingLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {bookingLoading ? (
                        <>
                          <LoaderCircle size={18} className="animate-spin" />
                          Steadfast-এ পাঠানো হচ্ছে...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send to Steadfast Courier
                        </>
                      )}
                    </button>
                  </div>
                )}
              </section>

              {/* Customer */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <SectionTitle
                  icon={<UserRound size={19} />}
                  title="Customer Information"
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <InfoRow
                    icon={<UserRound size={17} />}
                    label="Customer name"
                    value={customerName}
                  />

                  <InfoRow
                    icon={<Mail size={17} />}
                    label="Email address"
                    value={customerEmail}
                  />

                  <InfoRow
                    icon={<Phone size={17} />}
                    label="Phone number"
                    value={customerPhone}
                  />

                  <InfoRow
                    icon={<Hash size={17} />}
                    label="Order ID"
                    value={order.id}
                  />
                </div>
              </section>

              {/* Shipping address */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <SectionTitle
                  icon={<MapPin size={19} />}
                  title="Shipping Information"
                />

                <div className="space-y-4">
                  <InfoRow
                    icon={<UserRound size={17} />}
                    label="Recipient"
                    value={order.shippingName || customerName}
                  />

                  <InfoRow
                    icon={<Phone size={17} />}
                    label="Contact number"
                    value={order.shippingPhone || customerPhone}
                  />

                  <InfoRow
                    icon={<MapPin size={17} />}
                    label="Delivery address"
                    value={fullAddress}
                  />
                </div>
              </section>

              {/* Products */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <SectionTitle
                  icon={<Package size={19} />}
                  title={`Ordered Products (${items.length})`}
                />

                {items.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 px-4 py-8 text-center">
                    <Package size={28} className="mx-auto text-slate-400" />

                    <p className="mt-2 text-sm text-slate-500">
                      No product details are available for this order.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => {
                      const quantity = Number(item.quantity || 1);
                      const unitPrice = Number(item.unitPrice || 0);

                      const itemTotal =
                        item.totalPrice !== undefined
                          ? Number(item.totalPrice || 0)
                          : unitPrice * quantity;

                      return (
                        <div
                          key={item.id || `${order.id}-item-${index}`}
                          className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                            {getValidImageUrl(item.productImage || (item as any).product?.images?.[0]) ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={getValidImageUrl(item.productImage || (item as any).product?.images?.[0])}
                                alt={getItemName(item)}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                  const fallback = event.currentTarget.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className="items-center justify-center text-slate-300"
                              style={{ display: getValidImageUrl(item.productImage || (item as any).product?.images?.[0]) ? "none" : "flex" }}
                            >
                              <Package size={26} />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-semibold text-[#12233F]">
                              {getItemName(item)}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Quantity: {quantity}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Unit price: {formatCurrency(unitPrice)}
                            </p>
                          </div>

                          <div className="shrink-0 self-center text-right">
                            <p className="text-sm font-bold text-[#12233F]">
                              {formatCurrency(itemTotal)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Payment summary */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <SectionTitle
                  icon={<CreditCard size={19} />}
                  title="Payment Summary"
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-500">Subtotal</span>

                    <span className="font-medium text-slate-800">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Truck size={15} />
                      Delivery charge
                    </span>

                    <span className="font-medium text-slate-800">
                      {formatCurrency(order.deliveryCharge ?? (order as any).deliveryFee ?? 0)}
                    </span>
                  </div>

                  {Number((order as any)?.discount ?? 0) > 0 && (
                    <div className="flex items-center justify-between gap-4 text-sm text-emerald-600">
                      <span className="font-medium">
                        Coupon discount {(order as any)?.note ? `(${(order as any).note})` : ""}
                      </span>
                      <span className="font-semibold">
                        -{formatCurrency((order as any).discount)}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-dashed border-slate-200 pt-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-bold text-[#12233F]">Total</span>

                      <span className="text-xl font-bold text-[#12233F]">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {!loading && !error && !order && (
            <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">
              No order selected.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
          <p className="hidden text-xs text-slate-400 sm:block">
            Order details
          </p>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-xl bg-[#12233F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1b355c]"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
}
