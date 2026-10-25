"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";
import type { RelatedProduct } from "../types";

type Props = {
  products: RelatedProduct[];
};

export default function FrequentlyBought({ products }: Props) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[#12233f] sm:text-2xl">
          Customers who bought this item also bought
        </h2>

        <Link
          href="/products"
          className="shrink-0 text-sm font-semibold text-[#12233f] transition hover:text-[#f59e0b]"
        >
          More Products →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative aspect-square overflow-hidden bg-slate-50">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105"
              />

              {product.discount && (
                <span className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
                  {product.discount}% OFF
                </span>
              )}

              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm"
              >
                <Heart size={15} className="text-slate-500" />
              </button>
            </div>

            <div className="p-3">
              <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-slate-700">
                {product.name}
              </h3>

              <div className="mt-2 flex items-center gap-1 text-xs">
                <span className="flex items-center gap-0.5 rounded bg-emerald-600 px-1.5 py-0.5 font-bold text-white">
                  {(product.rating ?? 0).toFixed(1)}
                  <Star size={10} fill="currentColor" />
                </span>

                <span className="text-slate-400">({product.reviews ?? 0})</span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#12233f]">
                  ৳{product.price.toLocaleString()}
                </span>

                {product.oldPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    ৳{product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {product.sold !== undefined && (
                <p className="mt-1 text-xs text-slate-400">
                  {product.sold.toLocaleString()} Sold
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
