"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  Store,
  Star,
  BarChart3,
  User,
  Mail,
} from "lucide-react";
import { createClient } from "@/lib/supabase-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const NAV_ITEMS = [
  { label: "Overview", href: "/vendor/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/vendor/products", icon: Package },
  { label: "Orders", href: "/vendor/orders", icon: ShoppingCart },
  { label: "Earnings/Payout", href: "/vendor/earnings", icon: Wallet },
  { label: "Store settings", href: "/vendor/store", icon: Store },
  { label: "Reviews", href: "/vendor/reviews", icon: Star },
  { label: "Reports", href: "/vendor/reports", icon: BarChart3 },
];

export function SellerSidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const [storeName, setStoreName] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [email, setEmail] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) return;

        const metadata = session.user.user_metadata ?? {};
        const metaName =
          (typeof metadata.fullName === "string" && metadata.fullName) ||
          (typeof metadata.full_name === "string" && metadata.full_name) ||
          (typeof metadata.name === "string" && metadata.name) ||
          "";

        const userEmail = session.user.email ?? "";

        if (isMounted) {
          if (metaName) setVendorName(metaName);
          if (userEmail) setEmail(userEmail);
        }

        const res = await fetch(`${API_BASE_URL}/api/vendors/store/settings`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (res.ok) {
          const payload = await res.json().catch(() => null);
          const data = payload?.data;
          if (isMounted && data) {
            if (data.storeName) setStoreName(data.storeName);
            const resolvedName = data.vendorName || data.fullName || metaName;
            if (resolvedName) setVendorName(resolvedName);
            if (data.email) setEmail(data.email);
          }
        }
      } catch (err) {
        console.error("Seller sidebar profile load error:", err);
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <aside className="flex h-screen w-[68px] shrink-0 flex-col bg-[#12233F] text-white md:w-64">
      {/* Header */}
      <div className="flex min-h-[76px] shrink-0 items-center gap-3 border-b border-white/10 px-3.5 py-3 md:px-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F1C453] to-[#D6A419] text-xl shadow-md">
          🏪
        </div>

        <div className="hidden min-w-0 flex-1 leading-snug md:block">
          {/* Store Name */}
          <div
            className="truncate text-sm font-bold text-white tracking-tight"
            title={storeName || "My Store"}
          >
            {storeName || (loadingProfile ? "লোড হচ্ছে..." : "Seller Store")}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-x-visible overflow-y-auto px-2 py-3 md:px-3 md:py-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname?.startsWith(href);
          const isHovered = hoveredItem === href;

          return (
            <div
              key={href}
              className="relative"
              onMouseEnter={() => setHoveredItem(href)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                href={href}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                onFocus={() => setHoveredItem(href)}
                onBlur={() => setHoveredItem(null)}
                className={`
                  flex h-11 items-center gap-3 rounded-lg
                  px-[14px] text-[13px] font-medium
                  transition-colors
                  ${
                    isActive
                      ? "bg-[#D6A419] text-[#12233F]"
                      : "text-slate-200 hover:bg-white/10"
                  }
                `}
              >
                <Icon size={19} strokeWidth={2} className="shrink-0" />

                <span className="hidden whitespace-nowrap md:inline">
                  {label}
                </span>
              </Link>

              {/* Mobile tooltip: sidebar width stays unchanged */}
              {isHovered && (
                <div className="pointer-events-none absolute left-[58px] top-1/2 z-[60] -translate-y-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#1D3559] px-3 py-2 text-xs font-medium text-white shadow-lg md:hidden">
                  {label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="shrink-0 overflow-hidden border-t border-white/10 px-5 py-4 text-[11px] text-slate-400">
        <div className="hidden whitespace-nowrap md:block">
          © 2024–2025 Aladdin Global B2B
        </div>
        <div className="md:hidden" aria-hidden="true">
          ©
        </div>
      </div>
    </aside>
  );
}
