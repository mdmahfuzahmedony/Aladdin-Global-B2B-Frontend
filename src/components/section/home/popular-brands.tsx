"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import BrandCard, {
  type BrandItem,
} from "@/components/cards/product/BrandCard";
import { useLanguage } from "@/context/LanguageContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export default function PopularBrands() {
  const { t } = useLanguage();
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  // Manual scroll function
  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const firstCard = container.firstElementChild as HTMLElement | null;

    const cardWidth = firstCard?.getBoundingClientRect().width || 120;
    const gap = 16;
    const distance = (cardWidth + gap) * 2;

    container.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  // Auto slider setup (মাউস আনলে থামবে, প্রতি ৩.৫ সেকেন্ড পর পর স্লাইড হবে)
  useEffect(() => {
    if (brands.length <= 1) return;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container || isHoveredRef.current) return;

      const firstCard = container.firstElementChild as HTMLElement | null;
      const gap = 16;
      const scrollAmount = firstCard
        ? firstCard.getBoundingClientRect().width + gap
        : 160;

      const isAtEnd =
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 10;

      if (isAtEnd) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [brands]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/brands`);

        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }

        const result = await response.json();

        if (result?.success && Array.isArray(result?.data)) {
          setBrands(result.data);
        } else {
          setBrands([]);
        }
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <section className="w-full min-w-0 py-6 sm:py-8">
      <div className="mx-auto w-full min-w-0 max-w-[1500px] px-3 sm:px-6 lg:px-0">
        
        {/* HEADER */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {t("popularBrands")}
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {t("exploreBrands")}
          </p>
        </div>

        {/* BRANDS SLIDER WITH FLOATING CONTROLS IN THE MIDDLE */}
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
          {brands.length > 0 && !loading && (
            <button
              type="button"
              onClick={() => scroll("left")}
              className="absolute -left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white hover:text-[#D6A419] active:scale-95 sm:-left-4 sm:h-11 sm:w-11"
              aria-label={t("scrollBrandsLeft") || "Previous Brands"}
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* ডানপাশের অ্যারো বাটন (কার্ডের মাঝামাঝি দুই পাশে) */}
          {brands.length > 0 && !loading && (
            <button
              type="button"
              onClick={() => scroll("right")}
              className="absolute -right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white hover:text-[#D6A419] active:scale-95 sm:-right-4 sm:h-11 sm:w-11"
              aria-label={t("scrollBrandsRight") || "Next Brands"}
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* ব্র্যান্ড কার্ড কন্টেইনার */}
          <div
            ref={scrollContainerRef}
            className="
              flex w-full min-w-0
              gap-2 sm:gap-4 lg:gap-6
              overflow-x-auto overflow-y-hidden
              scroll-smooth
              pb-2 pt-1
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
              snap-x snap-mandatory
              touch-pan-x
            "
          >
            {loading ? (
              <div className="flex w-full gap-2 sm:gap-4 lg:gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-20 w-[calc((100%-24px)/4)] shrink-0 animate-pulse rounded-xl bg-slate-100 sm:h-28 sm:w-[150px]"
                  />
                ))}
              </div>
            ) : brands.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 sm:text-sm">
                {t("noBrands")}
              </div>
            ) : (
              brands.map((brand) => (
                <div
                  key={brand.id}
                  data-brand-card
                  className="w-[calc((100%-24px)/4)] shrink-0 snap-start sm:w-[150px] md:w-[160px] lg:w-[170px]"
                >
                  <BrandCard brand={brand} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* BOTTOM: VIEW ALL BUTTON */}
        <div className="mt-6 flex justify-center">
          <Link
  href="/brands"
  className="group inline-flex items-center gap-2 rounded-xl border border-[#D6A419] bg-[#D6A419] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:border-[#c3940f] hover:bg-[#c3940f] sm:text-sm"
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