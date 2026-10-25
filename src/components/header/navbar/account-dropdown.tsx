"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Heart,
  ShieldCheck,
  Settings,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  Store,
  Users,
  Wallet,
  UsersRound,
  BadgeDollarSign,
  Coins,
} from "lucide-react";
import { createClient } from "../../../../lib/supabase-client";

type UserRole =
  | "SUPER_ADMIN"
  | "MANAGER"
  | "VENDOR"
  | "AFFILIATE"
  | "WHOLESALER"
  | "CUSTOMER";

type UserData = {
  id?: string;
  fullName: string;
  role: UserRole;
  email?: string | null;
  phone?: string | null;
  status?: string;
  points?: number;
};

type ApiUser = {
  id?: string;
  role?: string;
  email?: string | null;
  phone?: string | null;
  fullName?: string | null;
  status?: string;
  points?: number;
};

interface AccountDropdownProps {
  onClose?: () => void;
}

export const AccountDropdown: React.FC<AccountDropdownProps> = ({
  onClose,
}) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const supabase = createClient();

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          if (mounted) {
            setUserData(null);
            setLoadingUser(false);
          }
          return;
        }

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

        const response = await fetch(`${apiUrl}/api/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData?.error || "Failed to fetch user");
        }

        const data: ApiUser | undefined = responseData?.user;

        if (!data) {
          throw new Error("Backend থেকে user data পাওয়া যায়নি");
        }

        const normalizedRole = String(data.role || "CUSTOMER").toUpperCase();

        const validRoles: UserRole[] = [
          "SUPER_ADMIN",
          "MANAGER",
          "VENDOR",
          "AFFILIATE",
          "WHOLESALER",
          "CUSTOMER",
        ];

        const finalRole: UserRole = validRoles.includes(
          normalizedRole as UserRole,
        )
          ? (normalizedRole as UserRole)
          : "CUSTOMER";

        const finalUser: UserData = {
          id: data.id,
          fullName: data.fullName || data.email || "User",
          role: finalRole,
          email: data.email,
          phone: data.phone,
          status: data.status,
          points: typeof data.points === "number" ? data.points : 0,
        };

        if (mounted) {
          setUserData(finalUser);
          setLoadingUser(false);
        }
      } catch (error) {
        console.error("FETCH USER ERROR:", error);

        if (mounted) {
          setUserData(null);
          setLoadingUser(false);
        }
      }
    };

    void fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  const role = userData?.role;

  const isCustomer = role === "CUSTOMER";
  const isVendor = role === "VENDOR";
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isManager = role === "MANAGER";
  const isAffiliate = role === "AFFILIATE";
  const isWholesaler = role === "WHOLESALER";

  const handleSignOut = async () => {
    if (signingOut) return;

    try {
      setSigningOut(true);

      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setUserData(null);
      onClose?.();
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      setSigningOut(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-2 text-slate-800">
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-24 rounded bg-slate-100" />
          </div>
        </div>

        <div className="border-t border-slate-100 p-3 text-center text-xs text-slate-400">
          Loading account...
        </div>
      </div>
    );
  }

  const linkClass =
    "flex items-center gap-2 rounded-lg p-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100";

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-2 text-slate-800">
      {/* Header */}
      <div className="border-b border-slate-100 p-3">
        <p className="truncate text-sm font-bold text-slate-900">
          {userData
            ? `Hello, ${userData.fullName || "User"}`
            : "Welcome to Aladdin"}
        </p>

        <p className="mt-1 text-[11px] text-slate-400">
          {userData ? `Role: ${role}` : "Access your B2B Panel"}
        </p>

        {userData?.email && (
          <p className="mt-1 truncate text-[10px] text-slate-400">
            {userData.email}
          </p>
        )}

        {userData && (
          <Link
            href="/my-points"
            onClick={onClose}
            className="mt-2.5 flex items-center justify-between rounded-lg border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 px-2.5 py-1.5 transition hover:border-amber-300 hover:shadow-xs"
          >
            <div className="flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-[11px] font-semibold text-amber-900">
                My Points (আমার পয়েন্ট)
              </span>
            </div>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-800">
              {userData.points ?? 0} pts
            </span>
          </Link>
        )}
      </div>

      {/* Customer */}
      {userData && isCustomer && (
        <>
          <Link href="/orders" onClick={onClose} className={linkClass}>
            <Package className="h-4 w-4 text-blue-600" />
            My Orders
          </Link>

          <Link
            href="/my-points"
            onClick={onClose}
            className="flex items-center justify-between rounded-lg p-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-500" />
              <span>My Points</span>
            </div>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
              {userData.points ?? 0} pts
            </span>
          </Link>

          <Link href="/wishlist" onClick={onClose} className={linkClass}>
            <Heart className="h-4 w-4 text-rose-500" />
            Wishlist
          </Link>

          <Link
            href="/become-seller"
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg p-2.5 text-xs font-semibold text-amber-600 transition-colors hover:bg-amber-50"
          >
            <Store className="h-4 w-4" />
            Become a Seller
          </Link>
        </>
      )}

      {/* Vendor */}
      {userData && isVendor && (
        <>
          <Link
            href="/vendor/dashboard"
            onClick={onClose}
            className={linkClass}
          >
            <LayoutDashboard className="h-4 w-4 text-amber-600" />
            Seller Dashboard
          </Link>

          <Link href="/vendor/products" onClick={onClose} className={linkClass}>
            <Package className="h-4 w-4 text-blue-600" />
            Manage Products
          </Link>

          <Link href="/vendor/store" onClick={onClose} className={linkClass}>
            <Store className="h-4 w-4 text-emerald-600" />
            My Store
          </Link>

          <Link href="/vendor/orders" onClick={onClose} className={linkClass}>
            <Package className="h-4 w-4 text-purple-600" />
            Orders
          </Link>

          <Link
            href="/my-points"
            onClick={onClose}
            className="flex items-center justify-between rounded-lg p-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-500" />
              <span>My Points</span>
            </div>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
              {userData.points ?? 0} pts
            </span>
          </Link>
        </>
      )}

      {/* Wholesaler */}
      {userData && isWholesaler && (
        <>
          <Link
            href="/wholesaler/dashboard"
            onClick={onClose}
            className={linkClass}
          >
            <LayoutDashboard className="h-4 w-4 text-amber-600" />
            Wholesale Dashboard
          </Link>

          <Link
            href="/wholesaler/orders"
            onClick={onClose}
            className={linkClass}
          >
            <Package className="h-4 w-4 text-blue-600" />
            Orders
          </Link>

          <Link
            href="/wholesaler/suppliers"
            onClick={onClose}
            className={linkClass}
          >
            <UsersRound className="h-4 w-4 text-emerald-600" />
            Suppliers
          </Link>
        </>
      )}

      {/* Affiliate */}
      {userData && isAffiliate && (
        <>
          <Link
            href="/affiliate/dashboard"
            onClick={onClose}
            className={linkClass}
          >
            <LayoutDashboard className="h-4 w-4 text-amber-600" />
            Affiliate Dashboard
          </Link>

          <Link
            href="/affiliate/referrals"
            onClick={onClose}
            className={linkClass}
          >
            <Users className="h-4 w-4 text-blue-600" />
            Referrals
          </Link>

          <Link
            href="/affiliate/earnings"
            onClick={onClose}
            className={linkClass}
          >
            <BadgeDollarSign className="h-4 w-4 text-emerald-600" />
            Earnings
          </Link>
        </>
      )}

      {/* Manager */}
      {userData && isManager && (
        <>
          <Link
            href="/manager/dashboard"
            onClick={onClose}
            className={linkClass}
          >
            <LayoutDashboard className="h-4 w-4 text-amber-600" />
            Manager Dashboard
          </Link>

          <Link href="/manager/users" onClick={onClose} className={linkClass}>
            <Users className="h-4 w-4 text-blue-600" />
            Users
          </Link>

          <Link href="/manager/vendors" onClick={onClose} className={linkClass}>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Vendors
          </Link>

          <Link href="/manager/orders" onClick={onClose} className={linkClass}>
            <Package className="h-4 w-4 text-purple-600" />
            Orders
          </Link>
        </>
      )}

      {/* Super Admin */}
      {userData && isSuperAdmin && (
        <>
          <Link href="/admin" onClick={onClose} className={linkClass}>
            <LayoutDashboard className="h-4 w-4 text-amber-600" />
            Admin Dashboard
          </Link>

          <Link href="/admin/users" onClick={onClose} className={linkClass}>
            <Users className="h-4 w-4 text-blue-600" />
            Users
          </Link>

          <Link href="/admin/vendors" onClick={onClose} className={linkClass}>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Vendors
          </Link>

          <Link href="/admin/finance" onClick={onClose} className={linkClass}>
            <Wallet className="h-4 w-4 text-purple-600" />
            Finance
          </Link>
        </>
      )}

      {/* Account Settings */}
      {userData && (
        <Link
          href="/settings"
          onClick={onClose}
          className="mt-1 flex items-center gap-2 rounded-lg border-t border-slate-100 p-2.5 pt-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
        >
          <Settings className="h-4 w-4 text-slate-500" />
          Account Settings
        </Link>
      )}

      {/* Sign In / Register / Sign Out */}
      {!userData ? (
        <div className="grid grid-cols-2 gap-1.5 border-t border-slate-100 pt-2">
          <Link
            href="/sign-in"
            onClick={onClose}
            className="flex items-center justify-center gap-1 rounded-lg bg-amber-500 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-600"
          >
            <LogIn className="h-3.5 w-3.5" />
            Sign In
          </Link>

          <Link
            href="/sign-up"
            onClick={onClose}
            className="flex items-center justify-center gap-1 rounded-lg bg-slate-100 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-200"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Register
          </Link>
        </div>
      ) : (
        <div className="border-t border-slate-100 pt-2">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-rose-50 py-2 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-3.5 w-3.5" />
            {signingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
