"use client";


import { Heart, Star } from "lucide-react";
import Link from "next/link";

export type TopRatedProduct = {
  id: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  moq: string;
};

export default function TopRatedCard({
  product,
}: {
  product: TopRatedProduct;
}) {
  return (
    <div className="group relative flex h-full min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-2 transition hover:border-amber-300 hover:shadow-md sm:rounded-2xl sm:p-3">
      <div>
        {/* TOP BADGE & FAVORITE */}
        <div className="mb-1.5 flex min-h-7 items-center justify-between gap-1">
          <span className="max-w-[75%] truncate rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 shadow-sm sm:px-2 sm:text-[10px]">
            {product.badge}
          </span>

          <button
            type="button"
            aria-label="Add to wishlist"
            className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
          >
            <Heart size={14} />
          </button>
        </div>

        {/* PRODUCT LINK & IMAGE */}
        <Link
          href={`/products/${product.id}`}
          className="block min-w-0"
        >
          <div className="mb-2 flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-50 text-3xl transition duration-300 group-hover:scale-[1.02] sm:h-28 sm:text-4xl lg:h-32">
            {product.image.startsWith("http") ||
            product.image.startsWith("/") ? (
              <img
                src={product.image}
                alt={product.title}
                loading="lazy"
                className="h-full w-full object-contain p-1.5"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span>{product.image}</span>
            )}
          </div>

          {/* PRODUCT TITLE */}
          <h3 className="min-h-[32px] line-clamp-2 break-words text-[11px] font-bold leading-4 text-[#12233F] transition hover:text-blue-600 sm:text-xs">
            {product.title}
          </h3>
        </Link>

        {/* RATING & REVIEWS */}
        <div className="mt-1 flex min-w-0 items-center gap-1">
          <div className="flex shrink-0 items-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={11}
                fill={
                  index < Math.round(product.rating)
                    ? "currentColor"
                    : "none"
                }
              />
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-700">
            {product.rating}
          </span>

          <span className="truncate text-[9px] text-slate-400 sm:text-[10px]">
            ({product.reviewsCount})
          </span>
        </div>
      </div>

      {/* PRICE & MOQ */}
      <div className="mt-2 border-t border-slate-100 pt-2 sm:mt-3 sm:pt-3">
        <div className="break-words text-xs font-extrabold text-[#12233F] sm:text-sm">
          ৳{product.price.toLocaleString()}
        </div>

        <div className="mt-0.5 text-[9px] text-slate-500 sm:text-[10px]">
          MOQ: {product.moq}
        </div>
      </div>
    </div>
  );
}
