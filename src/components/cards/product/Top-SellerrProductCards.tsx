"use client";


import { useState, useEffect, useRef } from "react";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  Trophy,
} from "lucide-react";
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

// বেস্ট সেলারের ফলব্যাক ডেটা
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
  const [products, setProducts] =
    useState<BestSellerProduct[]>(defaultBestSellers);
  const [loading, setLoading] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchBestSellers() {
      try {
        setLoading(true);

        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

        const response = await fetch(
          `${API_URL}/api/products/best-sellers`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch best sellers");
        }

        const result = await response.json();

        const data = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        if (!cancelled && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch best sellers, using default:",
          error,
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    // Backend থেকে data আনতে চাইলে নিচের লাইনটি uncomment করো।
    // void fetchBestSellers();

    return () => {
      cancelled = true;
    };
  }, []);

  const scrollProducts = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;

    const firstCard =
      slider.querySelector<HTMLElement>("[data-best-seller-card]");

    const gap = 12;
    const distance = firstCard
      ? (firstCard.offsetWidth + gap) * 2
      : slider.clientWidth;

    slider.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-7 sm:py-9">
      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">
        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between gap-2 sm:mb-5">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm sm:h-10 sm:w-10">
              <Trophy size={19} />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-extrabold text-[#12233F] sm:text-xl">
                Best Sellers
              </h2>

              <p className="line-clamp-1 text-[10px] text-slate-500 sm:text-xs">
                Most popular products chosen by businesses
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/products/best-sellers"
              className="text-[10px] font-semibold text-slate-600 transition hover:text-blue-600 sm:text-xs"
            >
              View all &gt;
            </Link>

            {/* Slider controls: mobile/tablet only */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                type="button"
                onClick={() => scrollProducts("left")}
                aria-label="Previous best sellers"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 sm:h-8 sm:w-8"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={() => scrollProducts("right")}
                aria-label="Next best sellers"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 sm:h-8 sm:w-8"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* PRODUCTS */}
        <div
          ref={sliderRef}
          className="
            grid grid-flow-col auto-cols-[calc((100%-12px)/2)]
            gap-3 overflow-x-auto pb-2
            snap-x snap-mandatory overscroll-x-contain
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            lg:grid-flow-row lg:grid-cols-5 lg:auto-cols-auto
            lg:gap-4 lg:overflow-x-visible
          "
        >
          {loading ? (
            <div className="col-span-full py-8 text-center text-sm text-slate-500">
              Loading best sellers...
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full py-8 text-center text-sm text-slate-500">
              No best sellers found.
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                data-best-seller-card
                className="flex min-w-0 snap-start"
              >
                <div className="group relative flex h-full min-w-0 w-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-2 transition hover:border-amber-300 hover:shadow-md sm:rounded-2xl sm:p-3">
                  <div>
                    {/* BADGE & FAVORITE */}
                    <div className="mb-1.5 flex min-h-7 items-center justify-between gap-1">
                      <span className="max-w-[75%] truncate rounded-md bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm sm:px-2 sm:text-[10px]">
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

                    {/* PRODUCT IMAGE */}
                    <div className="mb-2 flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-50 text-3xl transition duration-300 group-hover:scale-[1.02] sm:h-28 sm:text-4xl lg:h-32">
                      {typeof product.image === "string" &&
                      (product.image.startsWith("http") ||
                        product.image.startsWith("/")) ? (
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
                        <span>{product.image || "📦"}</span>
                      )}
                    </div>

                    {/* PRODUCT TITLE */}
                    <h3 className="min-h-[32px] line-clamp-2 break-words text-[11px] font-bold leading-4 text-[#12233F] sm:text-xs">
                      {product.title}
                    </h3>

                    {/* RATING */}
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

                      <span className="shrink-0 text-[10px] font-bold text-slate-700">
                        {product.rating}
                      </span>

                      <span className="truncate text-[9px] text-slate-400 sm:text-[10px]">
                        ({product.reviewsCount})
                      </span>
                    </div>
                  </div>

                  {/* PRICE & SOLD COUNT */}
                  <div className="mt-2 border-t border-slate-100 pt-2 sm:mt-3 sm:pt-3">
                    <div className="break-words text-xs font-extrabold text-[#12233F] sm:text-sm">
                      ৳{product.price.toLocaleString("en-BD")}
                    </div>

                    <div className="mt-1 inline-block max-w-full truncate rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600 sm:px-2 sm:text-[10px]">
                      {product.soldCount}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
