"use client";

import { Heart, Star } from "lucide-react";

export type FeaturedProduct = {
  id: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  category: string;
};

export default function FeaturedCard({
  product,
}: {
  product: FeaturedProduct;
}) {
  return (
    <div className="group relative flex h-full w-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-amber-400 hover:shadow-md">
      <div>
        {/* Top Badge & Favorite */}
        <div className="mb-3 flex items-center justify-between">
          <span className="truncate rounded-md bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm sm:text-xs">
            {product.badge || "FEATURED"}
          </span>

          <button
            type="button"
            className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400 transition hover:text-rose-500"
          >
            <Heart size={14} />
          </button>
        </div>

        {/* Product Image / Emoji */}
        <div className="mb-3 flex h-28 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 text-4xl transition group-hover:scale-105 sm:h-32">
          {product.image.startsWith("http") ||
          product.image.startsWith("/") ? (
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <span>{product.image}</span>
          )}
        </div>

        {/* Category & Title */}
        <span className="block truncate text-[10px] font-semibold uppercase tracking-wide text-blue-600 sm:text-[11px]">
          {product.category}
        </span>

        <h3 className="mt-1 line-clamp-2 min-h-[32px] break-words text-xs font-bold leading-snug text-[#12233F] sm:text-sm">
          {product.title}
        </h3>

        {/* Rating & Reviews */}
        <div className="mt-2 flex items-center gap-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill="currentColor" />
          ))}

          <span className="ml-1 text-[10px] text-slate-400 sm:text-xs">
            ({product.reviewsCount})
          </span>
        </div>
      </div>

      {/* Price Section */}
      <div className="mt-3 flex items-baseline justify-between gap-1 border-t border-slate-100 pt-3">
        <div className="text-sm font-extrabold text-[#12233F] sm:text-base">
          ৳{product.price.toLocaleString()}
        </div>

        {product.originalPrice && (
          <div className="text-xs text-slate-400 line-through">
            ৳{product.originalPrice.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}