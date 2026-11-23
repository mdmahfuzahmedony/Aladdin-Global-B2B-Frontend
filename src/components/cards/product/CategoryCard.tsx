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
      <div className="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:border-[#d6a419] group-hover:shadow-sm sm:h-16 sm:w-16 md:h-18 md:w-18 lg:h-20 lg:w-20">
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
      <h3 className="mt-1.5 line-clamp-2 text-[10.5px] font-semibold leading-tight text-[#12233F] transition-colors group-hover:text-[#d6a419] sm:text-xs lg:text-[12.5px]">
        {category.name}
      </h3>
    </Link>
  );
}