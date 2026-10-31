"use client";

import Link from "next/link";

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  icon: string | null;
  productCount: number;
};

export default function CategoryCard({
  category,
}: {
  category: CategoryItem;
}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-[#d6a419] group-hover:shadow-md sm:h-20 sm:w-20 lg:h-24 lg:w-24">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200"
          />
        )}
      </div>

      {/* Category Name */}
      <h3 className="mt-1.5 line-clamp-2 text-[11px] font-bold leading-tight text-[#12233F] transition-colors group-hover:text-[#d6a419] sm:mt-2.5 sm:text-xs lg:text-sm">
        {category.name}
      </h3>
    </Link>
  );
}