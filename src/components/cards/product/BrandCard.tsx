"use client";

import Link from "next/link";

export type BrandItem = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  status?: string;
  productCount?: number;
};

export default function BrandCard({ brand }: { brand: BrandItem }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group block text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white p-2 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-[#d6a419] group-hover:shadow-md sm:h-20 sm:w-20 sm:p-2.5 lg:h-24 lg:w-24 lg:p-3">
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={brand.name}
            loading="lazy"
            className="h-full w-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-bold text-slate-400 text-sm sm:text-base lg:text-lg">
            {brand.name ? brand.name.charAt(0).toUpperCase() : "B"}
          </span>
        )}
      </div>

      {/* Brand Name */}
      <h3 className="mt-1.5 line-clamp-2 text-[11px] font-bold leading-tight text-[#12233F] transition-colors group-hover:text-[#d6a419] sm:mt-2.5 sm:text-xs lg:text-sm">
        {brand.name}
      </h3>
    </Link>
  );
}
