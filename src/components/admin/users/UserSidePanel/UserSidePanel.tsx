"use client";

import SuperAdminDetails from "./SuperAdminDetails";
import ManagerDetails from "./ManagerDetails";
import VendorDetails from "./VendorDetails";
import WholesalerDetails from "./WholesalerDetails";
import AffiliateDetails from "./AffiliateDetails";
import CustomerDetails from "./CustomerDetails";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { createClient } from "../../../../../lib/supabase-client";
import { Loader2 } from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

export type UserRole =
  | "SUPER_ADMIN"
  | "CUSTOMER"
  | "VENDOR"
  | "WHOLESALER"
  | "MANAGER"
  | "AFFILIATE";

export type VendorData = {
  id?: string;
  userId?: string;

  storeName?: string;
  businessAddress?: string;
  businessCategory?: string | null;

  status?: string;
  commissionRate?: string | number;

  nidNumber?: string;
  nidDocumentUrl?: string | null;
  nidFrontDocumentUrl?: string | null;
  nidBackDocumentUrl?: string | null;

  tradeLicenseNumber?: string | null;
  tradeLicenseDocUrl?: string | null;

  taxIdentificationNumber?: string | null;
  tinDocUrl?: string | null;

  payoutMethod?: string;

  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankAccountHolder?: string | null;
  mobileBankingNumber?: string | null;

  createdAt?: string;
  updatedAt?: string;

  location?: any;
  payout?: any;
  settings?: any;
  _count?: {
    products?: number;
    orders?: number;
  };
};

export type UserData = {
  id: string;

  name: string;
  email: string;
  phone: string;

  role: UserRole;
  status: string;

  joined: string;

  vendor?: VendorData | null;

  customer?: any;
  customerReward?: any;
  customerOrders?: any[];
  cart?: any;
  wishlist?: any;
  _count?: any;

  affiliate?: any;
  wholesaler?: any;
  managerPermissions?: any[];
};

/* =========================================================
   PROPS
========================================================= */

type UserSidePanelProps = {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (
    userId: string,
    newStatus: string,
    vendorStatus?: string,
  ) => void;
};

/* =========================================================
   COMPONENT
========================================================= */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function UserSidePanel({
  user,
  isOpen,
  onClose,
  onStatusChange,
}: UserSidePanelProps) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [richData, setRichData] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch full user details when side panel opens
  useEffect(() => {
    if (!isOpen || !user?.id) {
      setRichData(null);
      return;
    }

    let isMounted = true;
    const fetchUserDetails = async () => {
      try {
        setLoadingDetails(true);
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const response = await fetch(
          `${API_BASE_URL}/api/users/admin/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token || ""}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data && isMounted) {
            setRichData(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch rich user details:", err);
      } finally {
        if (isMounted) {
          setLoadingDetails(false);
        }
      }
    };

    fetchUserDetails();

    return () => {
      isMounted = false;
    };
  }, [isOpen, user?.id]);

  // Merge base user with fetched rich data
  const mergedUser: UserData = useMemo(() => {
    if (!user) return user as any;
    if (!richData) return user;

    return {
      ...user,
      name: richData.fullName || user.name,
      email: richData.email || user.email,
      phone: richData.phone || user.phone,
      role: richData.role || user.role,
      status: richData.status || user.status,
      joined: richData.createdAt || user.joined,
      customer: richData.customer || user.customer,
      customerReward: richData.customerReward || user.customerReward,
      customerOrders: richData.customerOrders || user.customerOrders || [],
      cart: richData.cart || user.cart,
      wishlist: richData.wishlist || user.wishlist,
      vendor: richData.vendor || user.vendor,
      affiliate: richData.affiliate || user.affiliate,
      wholesaler: richData.wholesaler || user.wholesaler,
      managerPermissions:
        richData.managerPermissions || user.managerPermissions,
      _count: richData._count || user._count,
    };
  }, [user, richData]);

  if (!isOpen || !user) {
    return null;
  }

  /* =======================================================
     STATUS UPDATE HANDLER
  ======================================================= */
  const handleUpdateUserStatus = async (
    newStatus: string,
    approveVendor: boolean,
  ) => {
    if (!mergedUser || updatingStatus) return;
    try {
      setUpdatingStatus(true);
      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session?.access_token) {
        throw new Error("লগইন করা নেই");
      }

      // 1. Update user status
      const userRes = await fetch(
        `${API_BASE_URL}/api/users/admin/${mergedUser.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const userJson = await userRes.json();
      if (!userRes.ok) {
        throw new Error(
          userJson?.error ||
            userJson?.message ||
            "ইউজার স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে",
        );
      }

      // 2. If vendor exists and approveVendor is true, update vendor status
      let newVendorStatus: string | undefined;
      if (mergedUser.vendor?.id && approveVendor) {
        const vendorStatusTarget =
          newStatus === "ACTIVE" ? "APPROVED" : "SUSPENDED";
        const vRes = await fetch(
          `${API_BASE_URL}/api/vendors/${mergedUser.vendor.id}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ status: vendorStatusTarget }),
          },
        );

        if (vRes.ok) {
          newVendorStatus = vendorStatusTarget;
        }
      }

      toast.success("ইউজারের স্ট্যাটাস সফলভাবে আপডেট হয়েছে!");
      onStatusChange?.(mergedUser.id, newStatus, newVendorStatus);

      // Update local state
      setRichData((prev: any) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              ...(newVendorStatus && prev.vendor
                ? { vendor: { ...prev.vendor, status: newVendorStatus } }
                : {}),
            }
          : prev,
      );
    } catch (err: any) {
      toast.error(err?.message || "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* =======================================================
     ROLE DETAILS RENDERER
  ======================================================= */
  const renderUserDetails = () => {
    switch (mergedUser.role) {
      case "SUPER_ADMIN":
        return <SuperAdminDetails user={mergedUser as any} />;

      case "MANAGER":
        return <ManagerDetails user={mergedUser as any} />;

      case "VENDOR":
        return <VendorDetails user={mergedUser as any} />;

      case "WHOLESALER":
        return <WholesalerDetails user={mergedUser as any} />;

      case "AFFILIATE":
        return <AffiliateDetails user={mergedUser as any} />;

      case "CUSTOMER":
        return <CustomerDetails user={mergedUser as any} />;

      default:
        return (
          <div className="p-6 text-sm text-slate-500">
            User details not available.
          </div>
        );
    }
  };

  /* =======================================================
     UI
  ======================================================= */
  return (
    <div className="fixed inset-0 z-50">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* SIDE PANEL */}
      <div
        className="
          absolute
          right-0
          top-0
          h-full
          w-[calc(100%-2rem)]
          max-w-xl
          overflow-y-auto
          bg-white
          shadow-2xl
          sm:w-full
        "
      >
        {/* CLOSE HEADER */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-4 sm:px-6">
          <div className="min-w-0 pr-3">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                User Details
              </p>
              {loadingDetails && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-blue-600 animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  ডাটা লোড হচ্ছে...
                </span>
              )}
            </div>

            <h2 className="mt-0.5 truncate text-base font-bold text-[#12233F]">
              {mergedUser.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              text-lg
              text-slate-500
              transition
              hover:bg-slate-50
              hover:text-slate-800
            "
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* DETAILS */}
        <div className="p-4 sm:p-6">{renderUserDetails()}</div>

        {/* ACCOUNT ACTIONS / APPROVAL */}
        <div className="border-t border-slate-100 bg-slate-50/70 p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Account Status
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    mergedUser.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : mergedUser.status === "PENDING"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {mergedUser.status}
                </span>
                {mergedUser.vendor?.status && (
                  <span className="text-xs text-slate-500">
                    (Vendor:{" "}
                    <b className="text-slate-700">{mergedUser.vendor.status}</b>
                    )
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {mergedUser.status === "PENDING" && (
              <>
                <button
                  type="button"
                  disabled={updatingStatus}
                  onClick={() => handleUpdateUserStatus("ACTIVE", true)}
                  className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {updatingStatus
                    ? "Processing..."
                    : "✓ Approve Account & Seller"}
                </button>
                <button
                  type="button"
                  disabled={updatingStatus}
                  onClick={() => handleUpdateUserStatus("SUSPENDED", false)}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                >
                  Reject
                </button>
              </>
            )}

            {mergedUser.status === "ACTIVE" && (
              <button
                type="button"
                disabled={updatingStatus}
                onClick={() => handleUpdateUserStatus("SUSPENDED", false)}
                className="flex-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
              >
                {updatingStatus ? "Processing..." : "Suspend Account"}
              </button>
            )}

            {(mergedUser.status === "SUSPENDED" ||
              mergedUser.status === "BANNED") && (
              <button
                type="button"
                disabled={updatingStatus}
                onClick={() => handleUpdateUserStatus("ACTIVE", true)}
                className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {updatingStatus ? "Processing..." : "Re-activate Account"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
