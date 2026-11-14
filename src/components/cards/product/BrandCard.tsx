
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
  const brandImg = brand.logo || (brand as any)?.image || "";

  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group block text-center"
    >
      {/* Full Circle Brand Image */}
      <div
        className="
          relative mx-auto
          h-16 w-16
          sm:h-20 sm:w-20
          lg:h-24 lg:w-24
          overflow-hidden
          rounded-full
          border border-slate-200
          bg-white
          shadow-sm
          transition-all duration-300
          group-hover:scale-105
          group-hover:border-[#d6a419]
          group-hover:shadow-md
        "
      >
        {brandImg ? (
          <img
            src={brandImg}
            alt={brand.name}
            loading="lazy"
            className="
              absolute inset-0
              h-full w-full
              rounded-full
              object-cover
              object-center
            "
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span
            aria-hidden="true"
            className="
              flex h-full w-full
              items-center justify-center
              rounded-full
              bg-gradient-to-br from-slate-100 to-slate-200
              font-bold text-slate-400
              text-sm sm:text-base lg:text-lg
            "
          >
            {brand.name?.charAt(0).toUpperCase() || "B"}
          </span>
        )}
      </div>

      {/* Brand Name */}
      <h3
        className="
          mt-1.5 line-clamp-2
          text-[11px] font-bold leading-tight
          text-[#12233F]
          transition-colors
          group-hover:text-[#d6a419]
          sm:mt-2.5 sm:text-xs
          lg:text-sm
        "
      >
        {brand.name}
      </h3>
    </Link>
  );
}
