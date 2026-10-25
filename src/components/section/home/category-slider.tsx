"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import CategoryCard from "@/components/cards/product/CategoryCard";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  icon: string | null;
  productCount: number;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CategorySlider() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const firstCard = container.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard?.getBoundingClientRect().width || 80;
    const gap = 8;

    const distance = (cardWidth + gap) * 2;

    container.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  useEffect(() => {
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

        const list = Array.isArray(result?.data) ? (result.data as CategoryItem[]) : [];
        list.sort((a: CategoryItem, b: CategoryItem) => {
          const aIsGrocery = /grocer|মুদি/i.test(a.name);
          const bIsGrocery = /grocer|মুদি/i.test(b.name);
          if (aIsGrocery && !bIsGrocery) return -1;
          if (!aIsGrocery && bIsGrocery) return 1;
          return a.name.localeCompare(b.name);
        });
        setCategories(list);
      } catch (error: unknown) {
        console.error("Category fetch error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Categories fetch করা যায়নি"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <section className="w-full min-w-0 bg-[#f5f6fa] py-5 sm:py-8">
      <div className="mx-auto w-full min-w-0 max-w-[1500px] px-3 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-3 flex items-center justify-between gap-2 sm:mb-5">
          <div className="min-w-0">
            <h2 className="font-[var(--font-poppins)] text-base font-bold leading-tight text-[#12233F] sm:text-xl">
              Shop by Category
            </h2>

            <p className="mt-0.5 text-[11px] leading-4 text-slate-500 sm:mt-1 sm:text-sm">
              Find products for your business faster
            </p>
          </div>

          <Link
            href="/categories"
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#12233F] transition hover:text-blue-600 sm:text-sm"
          >
            View All
            <ArrowRight size={14} className="sm:h-4 sm:w-4" />
          </Link>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex gap-2 overflow-hidden sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-[100px] w-[calc((100%-24px)/4)] shrink-0 animate-pulse rounded-full bg-white sm:h-[160px] sm:w-[130px] lg:w-[150px]"
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
          <div className="relative flex min-w-0 items-center">
            {/* LEFT ARROW */}
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll categories left"
              className="absolute -left-3 z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-slate-50 md:flex sm:h-9 sm:w-9 lg:-left-4"
            >
              <ChevronLeft size={18} />
            </button>

            {/* SCROLLABLE CATEGORIES */}
            <div
              ref={scrollContainerRef}
              className="
                flex w-full min-w-0
                gap-2 sm:gap-4
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
                  className="w-[calc((100%-24px)/4)] shrink-0 snap-start sm:w-[120px] lg:w-[140px]"
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>

            {/* RIGHT ARROW */}
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll categories right"
              className="absolute -right-3 z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-slate-50 md:flex sm:h-9 sm:w-9 lg:-right-4"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && categories.length === 0 && (
          <div className="rounded-lg bg-white p-5 text-center text-xs text-slate-500 sm:rounded-xl sm:p-6 sm:text-sm">
            কোনো category পাওয়া যায়নি।
          </div>
        )}
      </div>
    </section>
  );
}