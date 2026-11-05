"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Tags,
  PackagePlus,
  CreditCard,
  History,
  X,
} from "lucide-react";
import { useDashboardNavigation } from "@/components/dashboard/dashboard-navigation";

const NAV_ITEMS = [
  { label: "Business profile", href: "/wholesaler", icon: Building2 },
  { label: "Bulk pricing", href: "/wholesaler/pricing", icon: Tags },
  { label: "Bulk order", href: "/wholesaler/bulk-order", icon: PackagePlus },
  { label: "Credit/Due", href: "/wholesaler/credit", icon: CreditCard },
  { label: "Order history", href: "/wholesaler/order-history", icon: History },
];

export function WholesalerSidebar() {
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
        className={`z-[101] flex-col bg-[#12233F] text-white ${
          isMenuOpen
            ? "fixed inset-y-0 left-0 flex h-dvh w-[min(18rem,88vw)]"
            : "hidden md:flex md:h-screen md:w-60"
        }`}
      >
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#F1C453] to-[#D6A419] text-lg">
          📦
        </div>
        <div className="flex-1 leading-tight">
          <div className="font-semibold text-[15px]">Wholesaler Panel</div>
          <div className="text-[10px] tracking-wide text-[#F1C453]">
            BULK BUYER
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

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/wholesaler"
              ? pathname === href
              : pathname?.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-[#D6A419] text-[#12233F]"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4 text-[11px] text-slate-400">
        © 2024–2025 Aladdin Global B2B
      </div>
      </aside>
    </>
  );
}