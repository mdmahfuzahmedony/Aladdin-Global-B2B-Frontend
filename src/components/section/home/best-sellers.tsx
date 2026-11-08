"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import ProductCard from "@/components/cards/product/New-Arrivals-ProductCartd";
import { useLanguage } from "@/context/LanguageContext";

type Product = {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  reviewsCount: number;
  moq: string;
  discountBadge?: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export default function BestSellers() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  // Manual scroll function
  const scroll = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.querySelector<HTMLElement>("[data-product-card]");
    const gap = 12;
    const scrollAmount = card
      ? (card.offsetWidth + gap) * 2
      : slider.clientWidth * 0.8;

    slider.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Auto slider setup (মাউস আনলে থামবে, প্রতি ৩.৫ সেকেন্ড পর পর স্লাইড হবে)
  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      const slider = sliderRef.current;
      if (!slider || isHoveredRef.current) return;

      const card = slider.querySelector<HTMLElement>("[data-product-card]");
      const gap = 12;
      const scrollAmount = card ? card.offsetWidth + gap : 260;

      const isAtEnd =
        slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10;

      if (isAtEnd) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [products]);

  useEffect(() => {
    let cancelled = false;

    async function fetchBestSellers() {
      try {
        const response = await fetch(
          `${API_URL}/api/products/home/best-sellers`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        if (!result?.success || !Array.isArray(result?.data)) {
          throw new Error("Best sellers data পাওয়া যায়নি।");
        }

        const mappedProducts: Product[] = result.data.map((item: any) => ({
          id: String(item.id),
          slug: item.slug ?? String(item.id),
          title: item.title ?? "Untitled product",
          image:
            item.attributes?.colors?.[0]?.images?.[0] ||
            (Array.isArray(item.images) ? item.images[0] : null) ||
            item.image ||
            "📦",
          price: Number(
            item.pricing?.customerSalePrice ??
              item.pricing?.customerRegularPrice ??
              0,
          ),
          rating: 0,
          reviewsCount: 0,
          moq:
            item.attributes?.moq !== undefined && item.attributes?.moq !== null
              ? String(item.attributes.moq)
              : "1 pcs",
          discountBadge: item.topSellerAttribute?.salesBadge || "TOP SELLER",
        }));

        if (!cancelled) {
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchBestSellers();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-[1500px] px-3 sm:px-6 lg:px-0">
        
        {/* HEADER: কেবল টাইটেল এবং সাব-টাইটেল (উপরে কোনো অ্যারো বা বাটন নেই) */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {t("bestSellers")}
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {t("customerFavorites")}
          </p>
        </div>

        {/* PRODUCTS SLIDER WITH FLOATING CONTROLS IN THE MIDDLE */}
        <div
          className="group relative"
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
        >
          {/* বামপাশের অ্যারো বাটন (কার্ডের মাঝামাঝি দুই পাশে) */}
          {products.length > 0 && !loading && (
            <button
              type="button"
              onClick={() => scroll("left")}
              className="absolute -left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white hover:text-[#D6A419] active:scale-95 sm:-left-4 sm:h-11 sm:w-11"
              aria-label={t("previousProducts") || "Previous"}
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* ডানপাশের অ্যারো বাটন (কার্ডের মাঝামাঝি দুই পাশে) */}
          {products.length > 0 && !loading && (
            <button
              type="button"
              onClick={() => scroll("right")}
              className="absolute -right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white hover:text-[#D6A419] active:scale-95 sm:-right-4 sm:h-11 sm:w-11"
              aria-label={t("nextProducts") || "Next"}
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* কার্ড কন্টেইনার */}
          <div
            ref={sliderRef}
            className="
              grid grid-flow-col auto-cols-[calc((100%-12px)/2)]
              gap-3 overflow-x-auto pb-3
              snap-x snap-mandatory overscroll-x-contain
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              sm:auto-cols-[calc((100%-24px)/3)]
              md:auto-cols-[calc((100%-36px)/4)]
              lg:auto-cols-[calc((100%-48px)/5)]
              lg:gap-4
            "
          >
            {loading ? (
              <div className="col-span-full py-12 text-center text-sm text-slate-500">
                {t("loadingBestSellers")}
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full py-12 text-center text-sm text-slate-500">
                {t("noBestSellers")}
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  data-product-card
                  className="min-w-0 snap-start"
                >
                  <ProductCard {...product} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* BOTTOM: VIEW ALL BUTTON */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/products?type=best-sellers"
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-[#12233F] shadow-sm transition hover:border-[#D6A419] hover:bg-slate-50 hover:text-[#D6A419] sm:text-sm"
          >
            {t("viewAll") || "View all"}
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

      </div>
    </section>
  );
}