"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  X,
  Store,
  User,
  MapPin,
  ShieldCheck,
  CreditCard,
  Package,
  Truck,
  Clock3,
  Globe,
  Building2,
  FileCheck2,
  ExternalLink,
  Boxes,
  CheckCircle,
  Ban,
  AlertTriangle,
  Clock,
  ArrowRight,
  Phone,
  MessageSquare,
} from "lucide-react";
import { createClient } from "../../../../../../lib/supabase-client";

// =====================================================
// TYPES
// =====================================================

type VendorDetails = {
  vendor: {
    id: string;
    storeName: string;
    businessCategory: string | null;
    status: string;
    commissionRate: number;
    createdAt: string;
    updatedAt: string;
  };

  owner: {
    id: string;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    role: string;
    status: string;
  } | null;

  location: {
    division: string | null;
    district: string | null;
    upazila: string | null;
    area: string | null;
    fullAddress: string;
    latitude: number | null;
    longitude: number | null;
  } | null;

  verification: {
    nidNumber: string;
    nidDocumentUrl: string | null;
    tradeLicenseNumber: string | null;
    tradeLicenseDocUrl: string | null;
    taxIdentificationNumber: string | null;
    tinDocUrl: string | null;
  };

  payout: {
    payoutMethod: string;
    bankName: string | null;
    bankAccountNumber: string | null;
    bankAccountHolder: string | null;
    mobileBankingNumber: string | null;
  } | null;

  settings: {
    description: string | null;
    phone: string | null;
    email: string | null;
    logoUrl: string | null;
    bannerUrl: string | null;

    deliveryAvailable: boolean;
    cityDeliveryCharge: number;
    outsideDeliveryCharge: number;
    freeDeliveryThreshold: number;
    deliveryTime: string | null;

    acceptOrders: boolean;
    autoConfirm: boolean;
    minimumOrder: number;

    cashOnDelivery: boolean;
    onlinePayment: boolean;

    storeActive: boolean;
    vacationMode: boolean;
    vacationStart: string | null;
    vacationEnd: string | null;

    showPhone: boolean;
    showEmail: boolean;
    showAddress: boolean;
  } | null;

  openingHours: {
    id: string;
    dayOfWeek: number;
    enabled: boolean;
    open: string | null;
    close: string | null;
  }[];

  products: {
    id: string;
    title: string;
    sku: string;
    slug: string;
    stockQuantity: number;
    images: string[];

    category: {
      id: string;
      name: string;
    } | null;

    brand: {
      id: string;
      name: string;
      logo: string | null;
    } | null;

    pricing: {
      customerRegularPrice: number;
      customerSalePrice: number | null;
    } | null;
  }[];

  productSummary: {
    totalProducts: number;
    totalStock: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  };

  categories: {
    id: string;
    name: string;
    productCount: number;
  }[];

  pendingChangeRequest?: {
    id: string;
    storeName: string | null;
    ownerName: string | null;
    phone: string | null;
    businessCategory: string | null;
    tradeLicenseNumber: string | null;
    nidNumber: string | null;
    taxIdentificationNumber: string | null;
    oldStoreName: string | null;
    oldOwnerName: string | null;
    oldPhone: string | null;
    oldBusinessCategory: string | null;
    oldTradeLicenseNumber: string | null;
    oldNidNumber: string | null;
    oldTaxIdNumber: string | null;
    reason: string | null;
    createdAt: string;
  } | null;

  storeChangeRequests?: any[];
};

// =====================================================
// PROPS
// =====================================================

type Props = {
  vendorId: string | null;
  onClose: () => void;
  onStatusChange?: (vendorId: string, status: string) => void;
  onVendorUpdated?: () => void;
};

// =====================================================
// DAYS
// =====================================================

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// =====================================================
// SECTION
// =====================================================

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-slate-200 px-5 py-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="text-[#D6A419]">{icon}</div>

        <h3 className="text-sm font-bold text-[#12233F]">{title}</h3>
      </div>

      {children}
    </section>
  );
}

// =====================================================
// INFO ROW
// =====================================================

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>

      <span className="break-words text-sm text-slate-700">
        {value || "â€”"}
      </span>
    </div>
  );
}

// =====================================================
// STATUS
// =====================================================

function StatusPill({ value }: { value: string }) {
  const status = value.toUpperCase();

  let className = "border-slate-200 bg-slate-50 text-slate-600";

  if (["APPROVED", "ACTIVE", "PAID"].includes(status)) {
    className = "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (["PENDING"].includes(status)) {
    className = "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (["SUSPENDED", "REJECTED", "BANNED"].includes(status)) {
    className = "border-red-200 bg-red-50 text-red-700";
  }

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      {value}
    </span>
  );
}

// =====================================================
// MONEY
// =====================================================

function formatMoney(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "à§³0";
  }

  return `à§³${Number(value).toLocaleString("en-BD")}`;
}

// =====================================================
// MASK ACCOUNT
// =====================================================

function maskAccount(value: string | null) {
  if (!value) return "â€”";

  if (value.length <= 4) {
    return value;
  }

  return `${"*".repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`;
}

// =====================================================
// COMPONENT
// =====================================================

export default function VendorDetailsSidebar({
  vendorId,
  onClose,
  onStatusChange,
  onVendorUpdated,
}: Props) {
  const [data, setData] = React.useState<VendorDetails | null>(null);

  const [loading, setLoading] = React.useState(false);

  const [error, setError] = React.useState("");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const [isReviewingChange, setIsReviewingChange] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const supabase = createClient();

  const getAccessToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error("No active session found");
    }

    return session.access_token;
  };

  const fetchVendorData = async () => {
    if (!vendorId) return;
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/vendors/${vendorId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch {
      // Ignore
    }
  };

  const handleReviewChangeRequest = async (status: "APPROVED" | "REJECTED") => {
    if (!data?.pendingChangeRequest?.id) return;
    try {
      setIsReviewingChange(true);
      const token = await getAccessToken();
      const response = await fetch(
        `${API_BASE_URL}/api/vendors/change-requests/${data.pendingChangeRequest.id}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            adminNote: status === "REJECTED" ? rejectionNote : undefined,
          }),
        },
      );
      const res = await response.json();
      if (!response.ok || !res.success) {
        throw new Error(
          res?.error || res?.message || "কার্যক্রম সম্পন্ন করা যায়নি",
        );
      }
      toast.success(
        status === "APPROVED"
          ? "দোকানের তথ্য পরিবর্তন অনুমোদিত হয়েছে!"
          : "তথ্য পরিবর্তন অনুরোধটি বাতিল করা হয়েছে।",
      );
      setShowRejectInput(false);
      setRejectionNote("");
      if (onVendorUpdated) {
        onVendorUpdated();
      }
      await fetchVendorData();
    } catch (err: any) {
      toast.error(err.message || "সমস্যা হয়েছে");
    } finally {
      setIsReviewingChange(false);
    }
  };

  // =====================================================
  // LOAD VENDOR DETAILS
  // =====================================================

  const handleUpdateStatus = async (newStatus: string) => {
    if (!vendorId || updatingStatus) return;
    try {
      setUpdatingStatus(newStatus);
      const token = await getAccessToken();

      const response = await fetch(
        `${API_BASE_URL}/api/vendors/${vendorId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const res = await response.json();
      if (!response.ok) {
        throw new Error(
          res?.message ||
            res?.error ||
            "à¦¸à§à¦Ÿà§à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦ªà¦°à¦¿à¦¬à¦°à§à¦¤à¦¨ à¦¬à§à¦¯à¦°à§à¦¥ à¦¹à§Ÿà§‡à¦›à§‡",
        );
      }

      setData((prev) =>
        prev
          ? {
              ...prev,
              vendor: {
                ...prev.vendor,
                status: newStatus,
              },
            }
          : null,
      );

      const messages: Record<string, string> = {
        APPROVED:
          "à¦­à§‡à¦¨à§à¦¡à¦° à¦¸à¦«à¦²à¦­à¦¾à¦¬à§‡ à¦…à¦¨à§à¦®à§‹à¦¦à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡!",
        REJECTED: "à¦­à§‡à¦¨à§à¦¡à¦° à¦¬à¦¾à¦¤à¦¿à¦² à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡",
        SUSPENDED:
          "à¦­à§‡à¦¨à§à¦¡à¦° à¦¸à¦¾à¦®à§Ÿà¦¿à¦•à¦­à¦¾à¦¬à§‡ à¦¸à§à¦¥à¦—à¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡",
      };
      toast.success(
        messages[newStatus] ||
          "à¦¸à§à¦Ÿà§à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦ªà¦°à¦¿à¦¬à¦°à§à¦¤à¦¨ à¦¸à¦«à¦² à¦¹à§Ÿà§‡à¦›à§‡!",
      );

      onStatusChange?.(vendorId, newStatus);
    } catch (err: any) {
      toast.error(
        err?.message ||
          "à¦¸à§à¦Ÿà§à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¤à§‡ à¦¸à¦®à¦¸à§à¦¯à¦¾ à¦¹à§Ÿà§‡à¦›à§‡",
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    if (!vendorId) {
      setData(null);
      setError("");
      return;
    }

    const controller = new AbortController();

    const loadVendor = async () => {
      try {
        setLoading(true);
        setError("");
        setData(null);

        // ---------------------------------------------
        // GET SUPABASE SESSION
        // ---------------------------------------------

        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          throw new Error(sessionError.message);
        }

        const accessToken = sessionData.session?.access_token;

        if (!accessToken) {
          throw new Error("à¦²à¦—à¦‡à¦¨ à¦•à¦°à¦¾ à¦¨à§‡à¦‡");
        }

        // ---------------------------------------------
        // API REQUEST
        // ---------------------------------------------

        const response = await fetch(
          `${API_BASE_URL}/api/vendors/${vendorId}`,
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",

              Authorization: `Bearer ${accessToken}`,
            },

            credentials: "include",

            signal: controller.signal,
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error ||
              result?.message ||
              "Failed to load vendor details.",
          );
        }

        if (!result?.success) {
          throw new Error(
            result?.error ||
              result?.message ||
              "Failed to load vendor details.",
          );
        }

        setData(result.data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error ? err.message : "Failed to load vendor details.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadVendor();

    return () => controller.abort();
  }, [vendorId]);

  // =====================================================
  // HIDE SIDEBAR
  // =====================================================

  if (!vendorId) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}

      <button
        type="button"
        aria-label="Close vendor details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
      />

      {/* Sidebar */}

      <aside className="absolute right-0 top-0 flex h-full w-[calc(100%-3rem)] max-w-[400px] flex-col bg-white shadow-2xl">
        {/* Header */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-[#12233F] px-5 py-4 text-white">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-300">
              Vendor Details
            </p>

            <h2 className="mt-1 text-lg font-bold">
              {data?.vendor?.storeName || "Vendor"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}

        <div className="flex-1 overflow-y-auto">
          {/* Loading */}

          {loading && (
            <div className="space-y-4 p-5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-xl border border-slate-200 p-4"
                >
                  <div className="mb-3 h-4 w-32 rounded bg-slate-200" />

                  <div className="h-3 w-full rounded bg-slate-100" />

                  <div className="mt-2 h-3 w-3/4 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                Unable to load vendor
              </p>

              <p className="mt-1 text-xs text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white"
              >
                Reload
              </button>
            </div>
          )}

          {/* Data */}

          {!loading && !error && data && (
            <>
              {/* PENDING STORE CHANGE REQUEST BANNER & CARD */}
              {data.pendingChangeRequest && (
                <div className="border-b border-amber-300 bg-amber-50/80 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                      <AlertTriangle size={20} className="animate-bounce" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                          পরিবর্তন অনুরোধ
                        </span>
                        <span className="text-[11px] font-medium text-amber-800">
                          {new Date(
                            data.pendingChangeRequest.createdAt,
                          ).toLocaleDateString("bn-BD")}
                        </span>
                      </div>
                      <h4 className="mt-1 text-sm font-bold text-slate-800">
                        দোকানের তথ্য পরিবর্তনের আবেদন
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-600">
                        নিচের পরিবর্তিত তথ্যগুলো যাচাই করে অনুমোদন বা বাতিল
                        করুন।
                      </p>
                    </div>
                  </div>

                  {/* Changes comparison box */}
                  <div className="mt-4 overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm">
                    <div className="border-b border-amber-100 bg-amber-100/50 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-amber-900">
                      পরিবর্তনের বিবরণ (Old → New)
                    </div>
                    <div className="divide-y divide-slate-100 p-2 text-xs">
                      {data.pendingChangeRequest.storeName && (
                        <div className="py-2 px-2">
                          <div className="text-[10px] font-semibold uppercase text-slate-400">
                            দোকানের নাম (Store Name)
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="line-through text-slate-400">
                              {data.pendingChangeRequest.oldStoreName ||
                                data.vendor?.storeName ||
                                "—"}
                            </span>
                            <ArrowRight
                              size={12}
                              className="shrink-0 text-amber-500"
                            />
                            <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700">
                              {data.pendingChangeRequest.storeName}
                            </span>
                          </div>
                        </div>
                      )}

                      {data.pendingChangeRequest.ownerName && (
                        <div className="py-2 px-2">
                          <div className="text-[10px] font-semibold uppercase text-slate-400">
                            মালিকের নাম (Owner Name)
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="line-through text-slate-400">
                              {data.pendingChangeRequest.oldOwnerName ||
                                data.owner?.fullName ||
                                "—"}
                            </span>
                            <ArrowRight
                              size={12}
                              className="shrink-0 text-amber-500"
                            />
                            <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700">
                              {data.pendingChangeRequest.ownerName}
                            </span>
                          </div>
                        </div>
                      )}

                      {data.pendingChangeRequest.phone && (
                        <div className="py-2 px-2">
                          <div className="text-[10px] font-semibold uppercase text-slate-400">
                            ফোন নাম্বার (Phone)
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="line-through text-slate-400">
                              {data.pendingChangeRequest.oldPhone ||
                                data.owner?.phone ||
                                "—"}
                            </span>
                            <ArrowRight
                              size={12}
                              className="shrink-0 text-amber-500"
                            />
                            <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700">
                              {data.pendingChangeRequest.phone}
                            </span>
                          </div>
                        </div>
                      )}

                      {data.pendingChangeRequest.businessCategory && (
                        <div className="py-2 px-2">
                          <div className="text-[10px] font-semibold uppercase text-slate-400">
                            ক্যাটাগরি (Business Category)
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="line-through text-slate-400">
                              {data.pendingChangeRequest.oldBusinessCategory ||
                                data.vendor?.businessCategory ||
                                "—"}
                            </span>
                            <ArrowRight
                              size={12}
                              className="shrink-0 text-amber-500"
                            />
                            <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700">
                              {data.pendingChangeRequest.businessCategory}
                            </span>
                          </div>
                        </div>
                      )}

                      {data.pendingChangeRequest.tradeLicenseNumber && (
                        <div className="py-2 px-2">
                          <div className="text-[10px] font-semibold uppercase text-slate-400">
                            ট্রেড লাইসেন্স (Trade License)
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="line-through text-slate-400">
                              {data.pendingChangeRequest
                                .oldTradeLicenseNumber || "—"}
                            </span>
                            <ArrowRight
                              size={12}
                              className="shrink-0 text-amber-500"
                            />
                            <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700">
                              {data.pendingChangeRequest.tradeLicenseNumber}
                            </span>
                          </div>
                        </div>
                      )}

                      {data.pendingChangeRequest.reason && (
                        <div className="rounded-b-lg bg-slate-50/80 px-2.5 py-2">
                          <div className="text-[10px] font-semibold uppercase text-slate-400">
                            আবেদনের কারণ (Reason)
                          </div>
                          <p className="mt-0.5 text-xs italic text-slate-700">
                            &ldquo;{data.pendingChangeRequest.reason}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Contact before approving */}
                  {(() => {
                    const phoneToCall =
                      data.owner?.phone ||
                      data.pendingChangeRequest.oldPhone ||
                      data.pendingChangeRequest.phone;
                    if (!phoneToCall) return null;
                    const cleanedPhone = phoneToCall.replace(/[^0-9]/g, "");
                    const internationalPhone = cleanedPhone.startsWith("88")
                      ? cleanedPhone
                      : `88${cleanedPhone}`;

                    return (
                      <div className="mt-3 flex items-center gap-2">
                        <a
                          href={`tel:${phoneToCall}`}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
                        >
                          <Phone size={13} className="text-emerald-600" />
                          সরাসরি কল করুন
                        </a>
                        <a
                          href={`https://wa.me/${internationalPhone}?text=${encodeURIComponent(
                            `আসসালামু আলাইকুম, আলাদিন গ্লোবাল প্ল্যাটফর্ম থেকে আপনার দোকানের তথ্য পরিবর্তনের আবেদনের বিষয়ে যোগাযোগ করা হয়েছে।`,
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-800 shadow-2xs transition hover:bg-emerald-100"
                        >
                          <MessageSquare
                            size={13}
                            className="text-emerald-700"
                          />
                          WhatsApp চ্যাট
                        </a>
                      </div>
                    );
                  })()}

                  {/* Actions */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleReviewChangeRequest("APPROVED")}
                        disabled={isReviewingChange}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <CheckCircle size={14} />
                        {isReviewingChange
                          ? "প্রক্রিয়াধীন..."
                          : "অনুমোদন করুন"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowRejectInput(!showRejectInput)}
                        disabled={isReviewingChange}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <Ban size={14} />
                        বাতিল করুন
                      </button>
                    </div>

                    {showRejectInput && (
                      <div className="mt-2 rounded-xl border border-red-200 bg-red-50/60 p-3">
                        <label className="block text-[11px] font-semibold text-red-800">
                          বাতিল করার কারণ (ঐচ্ছিক):
                        </label>
                        <input
                          type="text"
                          value={rejectionNote}
                          onChange={(e) => setRejectionNote(e.target.value)}
                          placeholder="ভেন্ডরের অবগতির জন্য কারণ লিখুন..."
                          className="mt-1.5 w-full rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-red-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleReviewChangeRequest("REJECTED")}
                          disabled={isReviewingChange}
                          className="mt-2 w-full rounded-lg bg-red-600 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50"
                        >
                          {isReviewingChange
                            ? "বাতিল করা হচ্ছে..."
                            : "নিশ্চিতভাবে বাতিল করুন"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Overview */}

              <Section title="Overview" icon={<Store size={17} />}>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    {data.settings?.logoUrl ? (
                      <img
                        src={data.settings.logoUrl}
                        alt={data.vendor.storeName}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl font-bold text-amber-700">
                        {data.vendor.storeName?.charAt(0).toUpperCase() || "V"}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-bold text-[#12233F]">
                        {data.vendor.storeName}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {data.vendor.businessCategory || "No category"}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <StatusPill value={data.vendor.status} />

                        {data.settings?.storeActive && (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                            Store Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <InfoRow
                    label="Commission Rate"
                    value={`${data.vendor.commissionRate}%`}
                  />

                  <InfoRow
                    label="Joined"
                    value={new Date(data.vendor.createdAt).toLocaleDateString(
                      "en-BD",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  />
                </div>
              </Section>

              {/* Owner */}

              <Section title="Owner & Contact" icon={<User size={17} />}>
                <InfoRow label="Full Name" value={data.owner?.fullName} />

                <InfoRow
                  label="Email"
                  value={
                    data.owner?.email ? (
                      <a
                        href={`mailto:${data.owner.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {data.owner.email}
                      </a>
                    ) : (
                      "â€”"
                    )
                  }
                />

                <InfoRow
                  label="Phone"
                  value={
                    data.owner?.phone ? (
                      <a
                        href={`tel:${data.owner.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {data.owner.phone}
                      </a>
                    ) : (
                      "â€”"
                    )
                  }
                />

                <InfoRow
                  label="Account Status"
                  value={
                    data.owner ? (
                      <StatusPill value={data.owner.status} />
                    ) : (
                      "â€”"
                    )
                  }
                />
              </Section>

              {/* Business */}

              <Section
                title="Business Information"
                icon={<Building2 size={17} />}
              >
                <InfoRow label="Store Name" value={data.vendor.storeName} />

                <InfoRow
                  label="Business Category"
                  value={data.vendor.businessCategory}
                />

                <InfoRow
                  label="Description"
                  value={data.settings?.description}
                />
              </Section>

              {/* Location */}

              <Section title="Location" icon={<MapPin size={17} />}>
                <InfoRow label="Division" value={data.location?.division} />

                <InfoRow label="District" value={data.location?.district} />

                <InfoRow label="Upazila" value={data.location?.upazila} />

                <InfoRow label="Area" value={data.location?.area} />

                <InfoRow
                  label="Full Address"
                  value={data.location?.fullAddress}
                />

                {data.location &&
                  (data.location.latitude !== null ||
                    data.location.longitude !== null) && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <Globe size={14} />

                      <span>
                        {data.location.latitude}, {data.location.longitude}
                      </span>
                    </div>
                  )}
              </Section>

              {/* Verification */}

              <Section title="Verification" icon={<ShieldCheck size={17} />}>
                <InfoRow
                  label="NID Number"
                  value={data.verification.nidNumber}
                />

                {data.verification.nidDocumentUrl && (
                  <a
                    href={data.verification.nidDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <FileCheck2 size={14} />
                    View NID Document
                    <ExternalLink size={12} />
                  </a>
                )}

                <InfoRow
                  label="Trade License Number"
                  value={data.verification.tradeLicenseNumber}
                />

                {data.verification.tradeLicenseDocUrl && (
                  <a
                    href={data.verification.tradeLicenseDocUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <FileCheck2 size={14} />
                    View Trade License
                    <ExternalLink size={12} />
                  </a>
                )}

                <InfoRow
                  label="TIN Number"
                  value={data.verification.taxIdentificationNumber}
                />

                {data.verification.tinDocUrl && (
                  <a
                    href={data.verification.tinDocUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <FileCheck2 size={14} />
                    View TIN Document
                    <ExternalLink size={12} />
                  </a>
                )}
              </Section>

              {/* Store Media */}

              <Section title="Store Media" icon={<Store size={17} />}>
                {data.settings?.logoUrl || data.settings?.bannerUrl ? (
                  <div className="grid grid-cols-2 gap-3">
                    {data.settings?.logoUrl && (
                      <div>
                        <p className="mb-2 text-[11px] font-semibold text-slate-400">
                          LOGO
                        </p>

                        <img
                          src={data.settings.logoUrl}
                          alt="Store logo"
                          className="h-32 w-full rounded-xl border border-slate-200 object-cover"
                        />
                      </div>
                    )}

                    {data.settings?.bannerUrl && (
                      <div>
                        <p className="mb-2 text-[11px] font-semibold text-slate-400">
                          BANNER
                        </p>

                        <img
                          src={data.settings.bannerUrl}
                          alt="Store banner"
                          className="h-32 w-full rounded-xl border border-slate-200 object-cover"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    No store media uploaded.
                  </p>
                )}
              </Section>

              {/* Products */}

              <Section
                title="Products & Inventory"
                icon={<Package size={17} />}
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] text-slate-400">Products</p>

                    <p className="mt-1 text-lg font-bold text-[#12233F]">
                      {data.productSummary.totalProducts}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] text-slate-400">Stock</p>

                    <p className="mt-1 text-lg font-bold text-[#12233F]">
                      {data.productSummary.totalStock}
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="text-[11px] text-emerald-600">In Stock</p>

                    <p className="mt-1 text-lg font-bold text-emerald-700">
                      {data.productSummary.inStock}
                    </p>
                  </div>

                  <div className="rounded-xl bg-red-50 p-3">
                    <p className="text-[11px] text-red-600">Out Stock</p>

                    <p className="mt-1 text-lg font-bold text-red-700">
                      {data.productSummary.outOfStock}
                    </p>
                  </div>
                </div>

                {data.productSummary.lowStock > 0 && (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                    {data.productSummary.lowStock} product(s) have low stock.
                  </div>
                )}

                {data.products.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {data.products.slice(0, 8).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                      >
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-11 w-11 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100">
                            <Package size={18} className="text-slate-400" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-700">
                            {product.title}
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            SKU: {product.sku}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-semibold text-slate-700">
                            {formatMoney(
                              product.pricing?.customerSalePrice ??
                                product.pricing?.customerRegularPrice,
                            )}
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Stock: {product.stockQuantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              {/* Categories */}

              <Section title="Categories" icon={<Boxes size={17} />}>
                {data.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {data.categories.map((category) => (
                      <div
                        key={category.id}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                      >
                        <span className="text-xs font-semibold text-slate-700">
                          {category.name}
                        </span>

                        <span className="ml-2 text-[11px] text-slate-400">
                          {category.productCount}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No categories found.</p>
                )}
              </Section>

              {/* Payout */}

              <Section title="Payout & Payment" icon={<CreditCard size={17} />}>
                <InfoRow
                  label="Payout Method"
                  value={data.payout?.payoutMethod}
                />

                <InfoRow label="Bank Name" value={data.payout?.bankName} />

                <InfoRow
                  label="Account Holder"
                  value={data.payout?.bankAccountHolder}
                />

                <InfoRow
                  label="Account Number"
                  value={maskAccount(data.payout?.bankAccountNumber || null)}
                />

                <InfoRow
                  label="Mobile Banking Number"
                  value={maskAccount(data.payout?.mobileBankingNumber || null)}
                />
              </Section>

              {/* Delivery */}

              <Section title="Delivery Settings" icon={<Truck size={17} />}>
                <InfoRow
                  label="Delivery Available"
                  value={data.settings?.deliveryAvailable ? "Yes" : "No"}
                />

                <InfoRow
                  label="Inside City Charge"
                  value={formatMoney(data.settings?.cityDeliveryCharge)}
                />

                <InfoRow
                  label="Outside City Charge"
                  value={formatMoney(data.settings?.outsideDeliveryCharge)}
                />

                <InfoRow
                  label="Free Delivery Threshold"
                  value={formatMoney(data.settings?.freeDeliveryThreshold)}
                />

                <InfoRow
                  label="Delivery Time"
                  value={data.settings?.deliveryTime}
                />
              </Section>

              {/* Orders */}

              <Section title="Order Settings" icon={<Package size={17} />}>
                <InfoRow
                  label="Accept Orders"
                  value={data.settings?.acceptOrders ? "Yes" : "No"}
                />

                <InfoRow
                  label="Auto Confirm"
                  value={data.settings?.autoConfirm ? "Yes" : "No"}
                />

                <InfoRow
                  label="Minimum Order"
                  value={formatMoney(data.settings?.minimumOrder)}
                />
              </Section>

              {/* Payment Settings */}

              <Section title="Payment Settings" icon={<CreditCard size={17} />}>
                <InfoRow
                  label="Cash on Delivery"
                  value={data.settings?.cashOnDelivery ? "Enabled" : "Disabled"}
                />

                <InfoRow
                  label="Online Payment"
                  value={data.settings?.onlinePayment ? "Enabled" : "Disabled"}
                />
              </Section>

              {/* Store Status */}

              <Section
                title="Store Status & Visibility"
                icon={<Store size={17} />}
              >
                <InfoRow
                  label="Store Active"
                  value={data.settings?.storeActive ? "Yes" : "No"}
                />

                <InfoRow
                  label="Vacation Mode"
                  value={data.settings?.vacationMode ? "Enabled" : "Disabled"}
                />

                <InfoRow
                  label="Show Phone"
                  value={data.settings?.showPhone ? "Yes" : "No"}
                />

                <InfoRow
                  label="Show Email"
                  value={data.settings?.showEmail ? "Yes" : "No"}
                />

                <InfoRow
                  label="Show Address"
                  value={data.settings?.showAddress ? "Yes" : "No"}
                />
              </Section>

              {/* Opening Hours */}

              <Section title="Opening Hours" icon={<Clock3 size={17} />}>
                <div className="space-y-2">
                  {data.openingHours.map((hour) => (
                    <div
                      key={hour.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5"
                    >
                      <span className="text-xs font-semibold text-slate-700">
                        {DAYS[hour.dayOfWeek] || `Day ${hour.dayOfWeek}`}
                      </span>

                      {hour.enabled ? (
                        <span className="text-xs text-slate-500">
                          {hour.open || "â€”"} - {hour.close || "â€”"}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-red-500">
                          Closed
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}
        </div>

        {/* Footer */}

        <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-3 space-y-2">
          {data?.vendor && (
            <div className="flex items-center gap-2">
              {data.vendor.status === "PENDING" && (
                <>
                  <button
                    type="button"
                    disabled={!!updatingStatus}
                    onClick={() => handleUpdateStatus("APPROVED")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <CheckCircle size={14} />
                    {updatingStatus === "APPROVED"
                      ? "à¦…à¦¨à§à¦®à§‹à¦¦à¦¨ à¦¹à¦šà§à¦›à§‡..."
                      : "Approve Seller"}
                  </button>

                  <button
                    type="button"
                    disabled={!!updatingStatus}
                    onClick={() => handleUpdateStatus("REJECTED")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                  >
                    <Ban size={14} />
                    {updatingStatus === "REJECTED"
                      ? "à¦¬à¦¾à¦¤à¦¿à¦² à¦¹à¦šà§à¦›à§‡..."
                      : "Reject"}
                  </button>
                </>
              )}

              {data.vendor.status === "APPROVED" && (
                <button
                  type="button"
                  disabled={!!updatingStatus}
                  onClick={() => handleUpdateStatus("SUSPENDED")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
                >
                  <Ban size={14} />
                  {updatingStatus === "SUSPENDED"
                    ? "à¦¸à§à¦¥à¦—à¦¿à¦¤ à¦¹à¦šà§à¦›à§‡..."
                    : "Suspend Seller"}
                </button>
              )}

              {["SUSPENDED", "REJECTED"].includes(data.vendor.status) && (
                <button
                  type="button"
                  disabled={!!updatingStatus}
                  onClick={() => handleUpdateStatus("APPROVED")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  <CheckCircle size={14} />
                  {updatingStatus === "APPROVED"
                    ? "à¦…à¦¨à§à¦®à§‹à¦¦à¦¨ à¦¹à¦šà§à¦›à§‡..."
                    : "Re-activate / Approve"}
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
}

// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
