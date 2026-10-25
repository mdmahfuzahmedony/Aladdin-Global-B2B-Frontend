"use client";

import { Star } from "lucide-react";
import Link from "next/link";

export type JustForYouProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
};

export default function JustForYouCard({
  product,
}: {
  product: JustForYouProduct;
}) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:border-amber-400 hover:shadow-md sm:rounded-2xl"
    >
      {/* Product Image */}
      <div className="mb-1 flex h-20 w-full items-center justify-center overflow-hidden bg-slate-50 p-2 sm:h-28 sm:p-3 lg:h-32">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col border-t border-slate-100 p-2 sm:p-3">
        <h3 className="line-clamp-2 min-h-[30px] break-words text-[11px] font-bold leading-snug text-[#12233F] transition group-hover:text-blue-600 sm:min-h-[34px] sm:text-xs">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-1.5 flex items-center gap-1 text-[10px] sm:text-xs">
          <Star
            size={12}
            className="shrink-0 fill-[#d6a419] text-[#d6a419]"
          />
          <span className="font-semibold text-slate-700">
            {product.rating}
          </span>
        </div>

        {/* Price */}
        <p className="mt-2 border-t border-slate-100 pt-1.5 text-xs font-extrabold text-[#12233F] sm:text-sm">
          ৳{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}