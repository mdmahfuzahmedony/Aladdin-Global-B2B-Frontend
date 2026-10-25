"use client";

import { Heart, Star } from "lucide-react";

// Original type unchanged
type FlashSaleProduct = {
  id: string;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  reviewsCount: number;
  soldPercentage: number;
};

export default function FlashCard({
  product,
}: {
  product: FlashSaleProduct;
}) {
  return (
    <div className="group relative flex h-full min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-2 transition hover:border-amber-400 hover:shadow-md sm:rounded-2xl sm:p-3">
      <div>
        {/* Discount Badge & Favorite */}
        <div className="mb-2 flex items-center justify-between sm:mb-2.5">
          <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm sm:text-[10px]">
            {product.discount}
          </span>

          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400 transition hover:text-rose-500 sm:h-7 sm:w-7"
          >
            <Heart size={13} />
          </button>
        </div>

        {/* Product Image / Emoji */}
        <div className="mb-2 flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-50 text-3xl transition group-hover:scale-[1.02] sm:mb-2.5 sm:h-28 sm:text-4xl lg:h-32">
          {product.image &&
          (product.image.startsWith("http") ||
            product.image.startsWith("/")) ? (
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <span>{product.image || "⚡"}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 min-h-[30px] break-words text-[11px] font-bold leading-snug text-[#12233F] sm:min-h-[34px] sm:text-xs">
          {product.title}
        </h3>

        {/* Rating & Reviews */}
        <div className="mt-1.5 flex items-center gap-0.5 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} fill="currentColor" />
          ))}

          <span className="ml-1 text-[9px] text-slate-400 sm:text-[10px]">
            ({product.reviewsCount})
          </span>
        </div>
      </div>

      {/* Price & Sold Progress Bar */}
      <div className="mt-2.5 border-t border-slate-100 pt-2 sm:mt-3 sm:pt-2.5">
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <div className="text-xs font-extrabold text-rose-600 sm:text-sm">
            ৳{product.price.toLocaleString()}
          </div>

          <div className="text-[10px] text-slate-400 line-through sm:text-[11px]">
            ৳{product.originalPrice.toLocaleString()}
          </div>
        </div>

        {/* Stock Progress */}
        <div className="mt-2">
          <div className="mb-1 flex items-center justify-between gap-1 text-[9px] font-semibold text-slate-500 sm:text-[10px]">
            <span>Sold: {product.soldPercentage}%</span>
            <span className="text-rose-600">Hot Deal</span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-600"
              style={{ width: `${product.soldPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}