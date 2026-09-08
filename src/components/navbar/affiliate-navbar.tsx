"use client";

import { useState } from "react";
import { Bell, ChevronDown, LogOut, UserCircle, Copy } from "lucide-react";

export function AffiliateNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-[13px] text-slate-600">
        রেফারেল কোড: <span className="font-semibold text-[#12233F]">AFF1023</span>
        <button className="text-slate-400 hover:text-[#12233F]">
          <Copy size={14} />
        </button>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative text-slate-500 hover:text-slate-700">
          <Bell size={19} />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D64545] text-[9px] font-semibold text-white">
            1
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#12233F] text-[13px] font-semibold text-white">
              N
            </div>
            <div className="text-left leading-tight">
              <div className="text-[13px] font-medium text-slate-800">
                Nadia Islam
              </div>
              <div className="text-[11px] text-slate-500">Affiliate</div>
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