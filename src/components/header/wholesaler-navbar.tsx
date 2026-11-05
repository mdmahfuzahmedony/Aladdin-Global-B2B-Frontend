"use client";

import { useState } from "react";
import { Bell, ChevronDown, LogOut, UserCircle, BadgeCheck, Menu } from "lucide-react";
import { useDashboardNavigation } from "@/components/dashboard/dashboard-navigation";

export function WholesalerNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMenuOpen, toggleMenu } = useDashboardNavigation();

  return (
    <header className="flex h-16 items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          aria-label="Toggle dashboard menu"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 md:hidden"
        >
          <Menu size={21} />
        </button>
        <div className="flex min-w-0 items-center gap-2 rounded-lg bg-[#EAF5EE] px-2 py-2 text-[11px] text-[#1F7A4D] sm:px-3 sm:text-[13px]">
          <BadgeCheck size={15} className="shrink-0" />
          <span className="truncate">Verified Business Buyer</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-5">
        <button className="relative text-slate-500 hover:text-slate-700">
          <Bell size={19} />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#12233F] text-[13px] font-semibold text-white">
              K
            </div>
            <div className="text-left leading-tight">
              <div className="text-[13px] font-medium text-slate-800">
                Karim Traders
              </div>
              <div className="text-[11px] text-slate-500">Wholesaler</div>
            </div>
            <ChevronDown size={15} className="text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-slate-700 hover:bg-slate-50">
                <UserCircle size={15} /> প্রোফাইল
              </button>
              <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-[#D64545] hover:bg-slate-50">
                <LogOut size={15} /> সাইন আউট
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}