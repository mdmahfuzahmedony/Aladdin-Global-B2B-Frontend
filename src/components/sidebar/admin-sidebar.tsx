"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Megaphone,
  Wallet,
  BarChart3,
  Image as ImageIcon,
  Settings,
  Store,
  Link2,
  Truck,
  LifeBuoy,
  X,
} from "lucide-react";
import { useDashboardNavigation } from "@/components/dashboard/dashboard-navigation";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
  { label: "Finance", href: "/admin/finance", icon: Wallet },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  {
    label: "Media library",
    href: "/admin/media-library",
    icon: ImageIcon,
  },
  { label: "Vendors", href: "/admin/vendors", icon: Store },
  { label: "Affiliates", href: "/admin/affiliates", icon: Link2 },
  { label: "Logistics", href: "/admin/logistics", icon: Truck },
  { label: "Support", href: "/admin/support", icon: LifeBuoy },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { isMenuOpen, closeMenu } = useDashboardNavigation();

  return (
    <>
      {isMenuOpen && (
        <button
          type="button"
          aria-label="Close dashboard menu"
          onClick={closeMenu}
          className="fixed inset-0 z-[100] bg-black/50 md:hidden"
        />
      )}
      <aside
        className={`z-[101] shrink-0 flex-col bg-[#12233F] text-white ${
          isMenuOpen
            ? "fixed inset-y-0 left-0 flex h-dvh w-[min(18rem,88vw)]"
            : "hidden md:flex md:h-screen md:w-16 lg:w-60"
        }`}
      >
      {/* ================= LOGO ================= */}

      <div
        className={`flex items-center px-2 py-5 ${
          isMenuOpen
            ? "justify-between"
            : "justify-center md:justify-center lg:justify-start"
        } lg:gap-2 lg:px-5`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#F1C453] to-[#D6A419] text-lg">
          🧞‍♂️
        </div>

        <div className={`${isMenuOpen ? "block" : "hidden lg:block"} leading-tight`}>
          <div className="font-semibold text-[15px]">
            Aladdin Admin
          </div>

          <div className="text-[10px] tracking-wide text-[#F1C453]">
            CONTROL PANEL
          </div>
        </div>
        <button
          type="button"
          aria-label="Close dashboard menu"
          onClick={closeMenu}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10 md:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* ================= NAVIGATION ================= */}

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-2 lg:px-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === href
              : pathname?.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              title={label}
              onClick={closeMenu}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                isMenuOpen
                  ? "justify-start"
                  : "justify-center md:justify-center lg:justify-start lg:px-3"
              } ${
                isActive
                  ? "bg-[#D6A419] text-[#12233F]"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <Icon
                size={17}
                strokeWidth={2}
                className="shrink-0"
              />

              <span className={isMenuOpen ? "inline" : "hidden lg:inline"}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ================= FOOTER ================= */}

      <div className={`border-t border-white/10 px-2 py-4 text-[11px] text-slate-400 lg:px-5 ${
        isMenuOpen ? "text-left" : "text-center lg:text-left"
      }`}>
        <span className={isMenuOpen ? "inline" : "hidden lg:inline"}>
          © 2024–2025 Aladdin Global B2B
        </span>

        {!isMenuOpen && <span className="hidden md:inline lg:hidden">©</span>}
      </div>
      </aside>
    </>
  );
}