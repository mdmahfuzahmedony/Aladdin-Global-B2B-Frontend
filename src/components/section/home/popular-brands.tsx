"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const firstCard = container.firstElementChild as HTMLElement | null;

    const cardWidth = firstCard?.getBoundingClientRect().width || 80;
    const gap = 8;
    const distance = (cardWidth + gap) * 2;

    container.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full min-w-0 py-5 sm:py-6">
      <div className="mx-auto w-full min-w-0 max-w-[1500px] px-3 sm:px-6 lg:px-0">
        {/* HEADER */}
        <div className="mb-3 flex items-center justify-between gap-3 sm:mb-5">
          <div className="flex min-w-0 flex-col">
    <h2 className="truncate text-base font-bold text-slate-900 sm:text-xl">
      {t("popularBrands")}
    </h2>

    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
      {t("exploreBrands")}
    </p>
  </div>

          {/* SCROLL CONTROLS */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label={t("scrollBrandsLeft")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-100 active:scale-95 sm:h-9 sm:w-9"
            >
              <ChevronLeft className="h-4 w-4 text-slate-700" />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label={t("scrollBrandsRight")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-100 active:scale-95 sm:h-9 sm:w-9"
            >
              <ChevronRight className="h-4 w-4 text-slate-700" />
            </button>
          </div>
        </div>

        {/* BRANDS SLIDER */}
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
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-20 w-[calc((100%-24px)/4)] shrink-0 animate-pulse rounded-xl bg-slate-100 sm:h-28 sm:w-[150px]"
                />
              ))}
            </div>
          ) : brands.length === 0 ? (
            <div className="py-8 text-xs text-slate-500 sm:text-sm">
              {t("noBrands")}
            </div>
          ) : (
            brands.map((brand) => (
              <div
                key={brand.id}
                className="w-[calc((100%-24px)/4)] shrink-0 snap-start sm:w-[150px] md:w-[160px] lg:w-[170px]"
              >
                <BrandCard brand={brand} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}