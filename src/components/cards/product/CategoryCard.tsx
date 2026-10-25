"use client";

import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";

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
      {/* Circular Category Image (Mobile: 16/20px -> h-16 w-16, Desktop: h-24 w-24) */}
      <div className="mx-auto h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-[#d6a419] group-hover:shadow-md sm:h-20 sm:w-20 lg:h-24 lg:w-24">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon
              size={22}
              className="text-slate-300 sm:size-7"
            />
          </div>
        )}
      </div>

      {/* Category Name */}
      <h3 className="mt-1.5 line-clamp-2 text-[11px] font-bold leading-tight text-[#12233F] transition-colors group-hover:text-[#d6a419] sm:mt-2.5 sm:text-xs lg:text-sm">
        {category.name}
      </h3>
    </Link>
  );
}