"use client";


import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  UserCircle,
  Loader2,
  Store,
} from "lucide-react";
import { createClient } from "../../../lib/supabase-client";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type VendorProfile = {
  storeName?: string | null;
  fullName?: string | null;
  name?: string | null;
  email?: string | null;
  status?: string | null;
};

function getVendorData(payload: unknown): VendorProfile | null {
  if (!payload || typeof payload !== "object") return null;

  const root = payload as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : null;

  const candidates = [
    root.vendor,
    root.profile,
    root.user,
    root,
    data?.vendor,
    data?.profile,
    data?.user,
    data,
  ];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;

    const item = candidate as Record<string, unknown>;

    const storeName =
      typeof item.storeName === "string"
        ? item.storeName
        : typeof item.store_name === "string"
          ? item.store_name
          : null;

    const fullName =
      typeof item.vendorName === "string"
        ? item.vendorName
        : typeof item.fullName === "string"
        ? item.fullName
        : typeof item.full_name === "string"
          ? item.full_name
          : typeof item.name === "string"
            ? item.name
            : null;

    const email =
      typeof item.email === "string" ? item.email : null;

    const status =
      typeof item.status === "string" ? item.status : null;

    if (storeName || fullName || email) {
      return {
        storeName,
        fullName,
        name: fullName,
        email,
        status,
      };
    }
  }

  return null;
}

export function SellerNavbar() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  const [storeName, setStoreName] = useState("আমার স্টোর");
  const [vendorName, setVendorName] = useState("ভেন্ডর");
  const [email, setEmail] = useState("");
  const [loadError, setLoadError] = useState("");

  const loadVendorInfo = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const supabase = createClient();

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session?.access_token) {
        router.replace("/login");
        return;
      }

      const metadata = session.user.user_metadata ?? {};

      const metadataName =
        (typeof metadata.fullName === "string" &&
          metadata.fullName) ||
        (typeof metadata.full_name === "string" &&
          metadata.full_name) ||
        (typeof metadata.name === "string" &&
          metadata.name) ||
        "";

      const userEmail = session.user.email ?? "";

      setEmail(userEmail);

      if (metadataName) {
        setVendorName(metadataName);
      } else if (userEmail) {
        setVendorName(userEmail.split("@")[0]);
      }

      const response = await fetch(
        `${API_URL}/api/vendors/store/settings`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        },
      );

      const payload = await response.json().catch(() => null);

      if (response.ok) {
        const vendor = getVendorData(payload);

        if (vendor?.storeName?.trim()) {
          setStoreName(vendor.storeName.trim());
        }

        const apiName =
          vendor?.fullName?.trim() ||
          vendor?.name?.trim();

        if (apiName) setVendorName(apiName);
        if (vendor?.email) setEmail(vendor.email);
      } else if (response.status === 401) {
        await supabase.auth.signOut();
        router.replace("/login");
      } else {
        setLoadError("স্টোরের তথ্য এখন লোড করা যাচ্ছে না।");
      }
    } catch (error) {
      console.error("Seller navbar profile load error:", error);
      setLoadError("প্রোফাইলের তথ্য লোড করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadVendorInfo();
  }, [loadVendorInfo]);

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      setLoadError("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setSigningOut(false);
      setMenuOpen(false);
    }
  }

  const initials =
    (storeName !== "আমার স্টোর" ? storeName : vendorName)
      .trim()
      .charAt(0)
      .toLocaleUpperCase() || "ভ";

  return (
    <header className="relative z-40 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 sm:px-6">
      {/* Search */}
      <div className="flex min-w-0 w-full max-w-sm items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
        <Search
          size={16}
          className="shrink-0 text-slate-400"
        />

        <input
          type="text"
          placeholder="নিজের প্রোডাক্ট/অর্ডার খুঁজুন..."
          aria-label="প্রোডাক্ট বা অর্ডার খুঁজুন"
          className="w-full min-w-0 bg-transparent text-[13px] outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Right section */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-5">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <Bell size={19} />

          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D64545] text-[9px] font-semibold text-white">
            2
          </span>
        </button>

        {/* Vendor dropdown */}
        <div className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex max-w-[min(260px,55vw)] items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-slate-100"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#12233F] text-[13px] font-semibold text-white">
              {loading ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : (
                initials
              )}
            </div>

            <div className="min-w-0 leading-tight">
              <div className="max-w-40 truncate text-[12px] font-semibold text-slate-800 sm:max-w-48 sm:text-[13px]">
                {loading ? "তথ্য লোড হচ্ছে..." : storeName}
              </div>

              <div className="max-w-40 truncate text-[11px] text-slate-500 sm:max-w-48">
                {vendorName}
              </div>
            </div>

            <ChevronDown
              size={15}
              className={`shrink-0 text-slate-400 transition-transform ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                aria-label="Close profile menu"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setMenuOpen(false)}
              />

              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
              >
                <div className="border-b border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Store
                      size={15}
                      className="shrink-0 text-slate-400"
                    />

                    <p className="truncate text-[12px] font-semibold text-slate-800">
                      {storeName}
                    </p>
                  </div>

                  <p className="mt-1 truncate text-[11px] text-slate-500">
                    {vendorName}
                  </p>

                  {email && (
                    <p className="mt-1 truncate text-[11px] text-slate-400">
                      {email}
                    </p>
                  )}

                  {loadError && (
                    <p
                      role="status"
                      className="mt-2 text-[11px] text-red-600"
                    >
                      {loadError}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/vendor/profile");
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] text-slate-700 hover:bg-slate-50"
                >
                  <UserCircle size={15} />
                  প্রোফাইল
                </button>

                <button
                  type="button"
                  role="menuitem"
                  disabled={signingOut}
                  onClick={() => void handleSignOut()}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] text-[#D64545] hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {signingOut ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <LogOut size={15} />
                  )}

                  {signingOut
                    ? "সাইন আউট হচ্ছে..."
                    : "সাইন আউট"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
