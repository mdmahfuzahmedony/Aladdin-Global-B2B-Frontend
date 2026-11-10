
"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import CategoryCard from "@/components/cards/product/CategoryCard";
import { useLanguage } from "@/context/LanguageContext";
import { useAutoSlider } from "@/hooks/useAutoSlider";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  icon: string | null;
  productCount: number;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001";

export default function CategorySlider() {
  const { t } = useLanguage();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { start: autoStart, stop: autoStop } =
    useAutoSlider(scrollContainerRef);

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Manual scroll: একবারে ২টি Category
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const firstCard = container.firstElementChild as HTMLElement | null;

    const cardWidth =
      firstCard?.getBoundingClientRect().width || 80;

    const styles = window.getComputedStyle(container);
    const gap = parseFloat(styles.columnGap) || 8;

    const distance = (cardWidth + gap) * 2;

    container.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });

    // Pause auto-slide for 5 seconds
    autoStop();

    setTimeout(() => {
      autoStart();
    }, 5000);
  };

  // Fetch categories
  useEffect(() => {
    let cancelled = false;

    async function fetchCategories() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/categories/main-with-count`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error || "Categories fetch করা যায়নি"
          );
        }

        const list = Array.isArray(result?.data)
          ? (result.data as CategoryItem[])
          : [];

        // Grocery first
        list.sort((a, b) => {
          const aIsGrocery = /grocer|মুদি/i.test(a.name);
          const bIsGrocery = /grocer|মুদি/i.test(b.name);

          if (aIsGrocery && !bIsGrocery) return -1;
          if (!aIsGrocery && bIsGrocery) return 1;

          return a.name.localeCompare(b.name);
        });

        if (!cancelled) {
          setCategories(list);
        }
      } catch (error: unknown) {
        console.error("Category fetch error:", error);

        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Categories fetch করা যায়নি"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-full min-w-0 bg-[#f5f6fa] py-5 sm:py-8">
      <div className="mx-auto w-full min-w-0 max-w-[1500px] px-3 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-3 flex items-center justify-between gap-2 sm:mb-5">
          <div className="min-w-0">
            <h2 className="font-[var(--font-poppins)] text-base font-bold leading-tight text-[#12233F] sm:text-xl">
              {t("shopByCategory")}
            </h2>

            <p className="mt-0.5 text-[11px] leading-4 text-slate-500 sm:mt-1 sm:text-sm">
              {t("findBusinessProducts")}
            </p>
          </div>

         
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex gap-1.5 overflow-hidden sm:gap-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="
                  h-[100px] w-[calc((100%-18px)/4)]
                  shrink-0 animate-pulse rounded-full bg-white
                  sm:h-[150px] sm:w-[110px]
                  lg:w-[125px]
                "
              />
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-lg bg-white p-4 text-xs text-red-500 sm:rounded-xl sm:p-5 sm:text-sm">
            {error}
          </div>
        )}

        {/* CATEGORY SLIDER */}
        {!loading && !error && categories.length > 0 && (
          <div className="relative flex min-w-0 items-center px-3 sm:px-4">

            {/* LEFT ARROW */}
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label={t("scrollBrandsLeft")}
              className="
                absolute left-0 top-1/2 z-20
                flex h-7 w-6 -translate-y-1/2
                items-center justify-center rounded-md
                border border-slate-200 bg-white
                text-slate-600 shadow-md
                transition hover:bg-slate-50
                active:scale-95
                sm:h-9 sm:w-8
                lg:-left-1
              "
            >
              <ChevronLeft size={18} />
            </button>

            {/* SCROLLABLE CATEGORIES */}
            <div
              ref={scrollContainerRef}
              onMouseEnter={autoStop}
              onMouseLeave={autoStart}
              className="
                flex w-full min-w-0
                gap-1.5 sm:gap-3 lg:gap-4
                overflow-x-auto overflow-y-hidden
                pb-2 pt-1
                scroll-smooth
                snap-x snap-mandatory
                touch-pan-x
                [scrollbar-width:none]
                [-ms-overflow-style:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="
                    w-[calc((100%-18px)/4)]
                    shrink-0 snap-start
                    sm:w-[110px]
                    lg:w-[125px]
                  "
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>

            {/* RIGHT ARROW */}
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label={t("scrollBrandsRight")}
              className="
                absolute right-0 top-1/2 z-20
                flex h-7 w-6 -translate-y-1/2
                items-center justify-center rounded-md
                border border-slate-200 bg-white
                text-slate-600 shadow-md
                transition hover:bg-slate-50
                active:scale-95
                sm:h-9 sm:w-8
                lg:-right-1
              "
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && categories.length === 0 && (
          <div className="rounded-lg bg-white p-5 text-center text-xs text-slate-500 sm:rounded-xl sm:p-6 sm:text-sm">
            {t("noCategoryFound")}
          </div>
        )}
      </div>
    </section>
  );
}
