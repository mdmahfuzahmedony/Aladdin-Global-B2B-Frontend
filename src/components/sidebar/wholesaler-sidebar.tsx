"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Tags,
  PackagePlus,
  CreditCard,
  History,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Business profile", href: "/wholesaler", icon: Building2 },
  { label: "Bulk pricing", href: "/wholesaler/pricing", icon: Tags },
  { label: "Bulk order", href: "/wholesaler/bulk-order", icon: PackagePlus },
  { label: "Credit/Due", href: "/wholesaler/credit", icon: CreditCard },
  { label: "Order history", href: "/wholesaler/order-history", icon: History },
];

export function WholesalerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col bg-[#12233F] text-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#F1C453] to-[#D6A419] text-lg">
          📦
        </div>
        <div className="leading-tight">
          <div className="font-semibold text-[15px]">Wholesaler Panel</div>
          <div className="text-[10px] tracking-wide text-[#F1C453]">
            BULK BUYER
          </div>
        </div>
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
  );
}