"use client";

import { useState, useRef, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight, Star, Trophy } from "lucide-react";
import Link from "next/link";

type BestSellerProduct = {
  id: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  reviewsCount: number;
  soldCount: string;
  badge?: string;
};

const defaultBestSellers: BestSellerProduct[] = [
  {
    id: "1",
    title: "Commercial Grade Espresso Machine",
    image: "☕",
    price: 45000,
    rating: 5,
    reviewsCount: 142,
    soldCount: "1.2k+ sold",
    badge: "TOP SELLER",
  },
  {
    id: "2",
    title: "Industrial Heavy Duty Standing Fan",
    image: "🌀",
    price: 6500,
    rating: 5,
    reviewsCount: 98,
    soldCount: "850+ sold",
    badge: "POPULAR",
  },
  {
    id: "3",
    title: "Bulk Pack Stainless Steel Cookware",
    image: "🍳",
    price: 12500,
    rating: 5,
    reviewsCount: 230,
    soldCount: "2.5k+ sold",
    badge: "TOP SELLER",
  },
  {
    id: "4",
    title: "Ergonomic Mesh Office Chair",
    image: "🪑",
    price: 8900,
    rating: 5,
    reviewsCount: 76,
    soldCount: "600+ sold",
    badge: "TRENDING",
  },
  {
    id: "5",
    title: "Smart LED Bulb Wholesale Pack",
    image: "💡",
    price: 2400,
    rating: 5,
    reviewsCount: 310,
    soldCount: "4.1k+ sold",
    badge: "BEST VALUE",
  },
];

export default function BestSellersSection() {
  const [products] = useState<BestSellerProduct[]>(defaultBestSellers);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // স্লাইডার ডানে বা বামে স্ক্রোল করার ফাংশন
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const offset = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      scrollContainerRef.current.scrollTo({
        left: scrollLeft + offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-[1500px] px-4">
        
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md">
              
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#12233F]">
                Best Sellers
              </h2>
              <p className="text-xs text-slate-500">
                Most popular products chosen by businesses
              </p>
            </div>
          </div>

          <Link
            href="/products/best-sellers"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            View all &gt;
          </Link>
        </div>

        {/* PRODUCTS CARDS CONTAINER WITH SLIDER ARROWS */}
        <div className="relative flex items-center">
          
          {/* LEFT ARROW */}
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute -left-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-slate-50"
          >
            <ChevronLeft size={18} />
          </button>

          {/* PRODUCTS GRID / SCROLLER */}
          <div
            ref={scrollContainerRef}
            className="grid grid-flow-col auto-cols-[260px] gap-4 w-full overflow-x-auto pb-2 scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-amber-400 hover:shadow-md"
              >
                {/* TOP BADGE & FAVORITE */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                      {product.badge}
                    </span>
                    <button
                      type="button"
                      className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400 hover:text-rose-500 transition"
                    >
                      <Heart size={14} />
                    </button>
                  </div>

                  {/* PRODUCT IMAGE / EMOJI BOX */}
                  <div className="flex h-28 w-full items-center justify-center rounded-xl bg-slate-50 text-4xl mb-4 group-hover:scale-105 transition">
                    {product.image.startsWith("http") || product.image.startsWith("/") ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <span>{product.image}</span>
                    )}
                  </div>

                  {/* TITLE */}
                  <h3 className="line-clamp-2 text-xs font-bold text-[#12233F] min-h-[32px]">
                    {product.title}
                  </h3>

                  {/* RATING */}
                  <div className="mt-2 flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                    <span className="text-[10px] text-slate-400 ml-1">
                      ({product.reviewsCount})
                    </span>
                  </div>
                </div>

                {/* PRICE & SOLD COUNT */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-sm font-extrabold text-[#12233F]">
                    ৳{product.price.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {product.soldCount}
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* RIGHT ARROW */}
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute -right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-slate-50"
          >
            <ChevronRight size={18} />
          </button>

        </div>

      </div>
    </section>
  );
}