"use client";

import { useState, useEffect, useRef } from "react";
import { Zap, Clock, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

import ProductCard from "@/components/cards/product/New-Arrivals-ProductCartd";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

type FlashProduct = {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  flashSalePrice: number;
  discountBadge: string;
  rating: number;
  reviewsCount: number;
  moq: string;
  flashSaleStock: number;
};

export default function FlashSaleSection() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<FlashProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [saleEndTime, setSaleEndTime] = useState<Date | null>(null);

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

  // Auto slider setup (মাউস হোভার থাকলে থামবে, অন্যথায় প্রতি ৩.৫ সেকেন্ড পর স্লাইড হবে)
  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      const slider = sliderRef.current;
      if (!slider || isHoveredRef.current) return;

      const card = slider.querySelector<HTMLElement>("[data-product-card]");
      const gap = 12;
      const scrollAmount = card ? card.offsetWidth + gap : 260;

      // একদম শেষে পৌঁছে গেলে শুরুতে ফিরে যাবে
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

  // Fetch flash sale products
  useEffect(() => {
    let cancelled = false;

    async function fetchFlashSale() {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/products/home/flash-sale`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const mappedProducts: FlashProduct[] = result.data.map(
            (item: any) => {
              const flashPrice = Number(
                item.flashSaleAttribute?.flashSalePrice ?? 0
              );

              const originalPrice = Number(
                item.pricing?.customerRegularPrice ?? 0
              );

              const discountValue =
                originalPrice > 0 && flashPrice > 0
                  ? Math.round(
                      ((originalPrice - flashPrice) / originalPrice) * 100
                    )
                  : 0;

              const imageUrl =
                item.attributes?.colors?.[0]?.images?.[0] ||
                (Array.isArray(item.images) ? item.images[0] : null) ||
                item.image ||
                "📦";

              return {
                id: String(item.id),
                slug: item.slug ?? String(item.id),
                title: item.title ?? "Untitled product",
                image: imageUrl,
                price: originalPrice,
                flashSalePrice: flashPrice,
                discountBadge:
                  item.flashSaleAttribute?.discountBadge ||
                  `${discountValue}% OFF`,
                rating: 0,
                reviewsCount: 0,
                moq:
                  item.attributes?.moq !== undefined &&
                  item.attributes?.moq !== null
                    ? String(item.attributes.moq)
                    : "1 pcs",
                flashSaleStock: Number(
                  item.flashSaleAttribute?.stockRemaining ?? 0
                ),
              };
            }
          );

          if (!cancelled) {
            setProducts(mappedProducts);

            const endTimes = result.data
              .map((item: any) => item.flashSaleAttribute?.endTime)
              .filter(Boolean)
              .map((value: string) => new Date(value))
              .filter((date: Date) => !Number.isNaN(date.getTime()));

            if (endTimes.length > 0) {
              const earliestEndTime = endTimes.reduce(
                (earliest: Date, current: Date) =>
                  current.getTime() < earliest.getTime()
                    ? current
                    : earliest
              );

              setSaleEndTime(earliestEndTime);
            } else {
              setSaleEndTime(null);
            }
          }
        } else {
          if (!cancelled) {
            setProducts([]);
            setSaleEndTime(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch flash sale products:", error);
        if (!cancelled) {
          setProducts([]);
          setSaleEndTime(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchFlashSale();

    return () => {
      cancelled = true;
    };
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!saleEndTime) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const updateCountdown = () => {
      const difference = saleEndTime.getTime() - Date.now();

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const totalSeconds = Math.floor(difference / 1000);

      setTimeLeft({
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      });
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [saleEndTime]);

  return (
    <section className="relative mx-auto my-5 w-full min-w-0 max-w-[1500px] rounded-2xl border border-slate-100 bg-slate-50 px-3 py-5 shadow-sm sm:my-6 sm:rounded-3xl sm:px-6 sm:py-7 lg:px-8">
      {/* HEADER SECTION: Clean Title + Live Badge + Timer Box */}
      <div className="mb-4 flex flex-col gap-2.5 sm:mb-5">
        <div className="flex items-center justify-between gap-2">
          {/* Title & Live Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 shrink-0 animate-pulse items-center justify-center rounded-lg bg-rose-600 text-white shadow-sm sm:h-10 sm:w-10 sm:rounded-xl">
              <Zap size={18} className="sm:size-5" />
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="font-[var(--font-poppins)] text-base font-bold text-[#12233F] sm:text-xl">
                {t("flashSale") || "Flash Sale"}
              </h2>
              <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600 sm:px-2 sm:text-xs">
                {t("liveNow") || "Live Now"}
              </span>
            </div>
          </div>

          {/* Ending In Timer Box */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1 shadow-sm sm:gap-2 sm:rounded-xl sm:px-3 sm:py-1.5">
            <Clock size={13} className="shrink-0 text-rose-600 sm:size-4" />
            <span className="text-[10px] font-medium text-slate-600 sm:text-xs">
              {t("endingIn") || "Ending in"}
            </span>
            <div className="flex items-center gap-0.5 font-mono text-[10px] font-bold text-rose-600 sm:gap-1 sm:text-xs">
              <span className="rounded bg-rose-50 px-1 py-0.5 sm:px-1.5">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              :
              <span className="rounded bg-rose-50 px-1 py-0.5 sm:px-1.5">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              :
              <span className="rounded bg-rose-50 px-1 py-0.5 sm:px-1.5">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-slate-500 sm:text-sm">
          {t("limitedDeals") || "Grab these limited deals before they run out!"}
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
        {/* Left Arrow Button (Slider এর মাঝখানে) */}
        {products.length > 0 && !loading && (
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute -left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white hover:text-rose-600 active:scale-95 sm:-left-4 sm:h-11 sm:w-11"
            aria-label={t("previousProducts") || "Previous"}
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Right Arrow Button (Slider এর মাঝখানে) */}
        {products.length > 0 && !loading && (
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute -right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white hover:text-rose-600 active:scale-95 sm:-right-4 sm:h-11 sm:w-11"
            aria-label={t("nextProducts") || "Next"}
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Product Cards Slider */}
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
              {t("loadingFlashSale") || "Loading flash sale..."}
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full py-12 text-center text-sm text-slate-500">
              {t("noFlashSale") || "No active flash sale products."}
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                data-product-card
                className="min-w-0 snap-start"
              >
                <ProductCard
                  id={product.id}
                  slug={product.slug}
                  title={product.title}
                  image={product.image}
                  price={product.price}
                  rating={product.rating}
                  reviewsCount={product.reviewsCount}
                  moq={product.moq}
                  isFlashSale={true}
                  flashSalePrice={product.flashSalePrice}
                  flashSaleStock={product.flashSaleStock}
                  discountBadge={product.discountBadge}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* BOTTOM SECTION: VIEW ALL BUTTON */}
      <div className="mt-5 flex justify-center">
        <Link
          href="/products?type=flash-sale"
          className="group inline-flex items-center gap-2   px-5 py-2 text-xs font-semibold text-[#12233F] "
        >
          {t("viewAll") || "View all Product"}
          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}