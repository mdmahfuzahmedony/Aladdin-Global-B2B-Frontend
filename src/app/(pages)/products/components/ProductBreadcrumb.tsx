"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type Props = {
  category: string;
  subcategory?: string;
  productName: string;
};

export default function ProductBreadcrumb({
  category,
  subcategory,
  productName,
}: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 text-xs sm:text-sm text-slate-500 whitespace-nowrap"
    >
      <Link
        href="/"
        className="flex shrink-0 items-center gap-1 font-medium transition hover:text-[#12233f]"
      >
        <Home size={14} className="shrink-0 text-slate-400" />
        <span>Home</span>
      </Link>

      <ChevronRight size={13} className="shrink-0 text-slate-300" />

      <Link
        href={`/products?category=${encodeURIComponent(category)}`}
        className="shrink-0 font-medium transition hover:text-[#12233f]"
      >
        {category}
      </Link>

      {subcategory && (
        <>
          <ChevronRight size={13} className="shrink-0 text-slate-300" />
          <span className="shrink-0 font-medium text-slate-600">{subcategory}</span>
        </>
      )}

      <ChevronRight size={13} className="shrink-0 text-slate-300" />

      <span className="truncate max-w-[180px] sm:max-w-[320px] font-semibold text-slate-800">
        {productName}
      </span>
    </nav>
  );
}
