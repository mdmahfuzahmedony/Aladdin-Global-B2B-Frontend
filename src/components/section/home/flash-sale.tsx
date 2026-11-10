
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Zap,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

import ProductCard from "@/components/cards/product/New-Arrivals-ProductCartd";
import { useLanguage } from "@/context/LanguageContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

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

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const INITIAL_TIME: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export default function FlashSaleSection() {
  const { t } = useLanguage();

  const [products, setProducts] = useState<FlashProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(INITIAL_TIME);
  const [saleEndTime, setSaleEndTime] = useState<Date | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  // Manual scroll: একবারে ২টি কার্ড
  const scroll = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.querySelector<HTMLElement>(
      "[data-product-card]"
    );

    const gap = 12;

    const scrollAmount = card
      ? (card.offsetWidth + gap) * 2
      : slider.clientWidth * 0.8;

    slider.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Auto slider
  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      const slider = sliderRef.current;

      if (!slider || isHoveredRef.current) return;

      const card = slider.querySelector<HTMLElement>(
        "[data-product-card]"
      );

      const scrollAmount = card
        ? card.offsetWidth + 12
        : 260;

      const isAtEnd =
        slider.scrollLeft + slider.clientWidth >=
        slider.scrollWidth - 10;

      if (isAtEnd) {
        slider.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        slider.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
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
                      ((originalPrice - flashPrice) /
                        originalPrice) *
                        100
                    )
                  : 0;

              const imageUrl =
                item.attributes?.colors?.[0]?.images?.[0] ||
                (Array.isArray(item.images)
                  ? item.images[0]
                  : null) ||
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

            const now = Date.now();

            const futureEndTimes = result.data
              .map(
                (item: any) =>
                  item.flashSaleAttribute?.endTime
              )
              .filter(Boolean)
              .map((value: string) => new Date(value))
              .filter(
                (date: Date) =>
                  !Number.isNaN(date.getTime()) &&
                  date.getTime() > now
              );

            if (futureEndTimes.length > 0) {
              const earliestEndTime = futureEndTimes.reduce(
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
        console.error(
          "Failed to fetch flash sale products:",
          error
        );

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

  // Countdown timer
  useEffect(() => {
    if (!saleEndTime) {
      setTimeLeft(INITIAL_TIME);
      return;
    }

    const updateCountdown = () => {
      const difference = saleEndTime.getTime() - Date.now();

      if (difference <= 0) {
        setTimeLeft(INITIAL_TIME);
        return;
      }

      const totalSeconds = Math.floor(difference / 1000);

      setTimeLeft({
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      });
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [saleEndTime]);

  const timerItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className="relative mx-auto my-5 w-full min-w-0 max-w-[1500px] rounded-2xl border border-slate-100 bg-slate-50 px-3 py-5 shadow-sm sm:my-6 sm:rounded-3xl sm:px-6 sm:py-7 lg:px-8">

      {/* HEADER */}
      <div
        className="
          mb-7 grid grid-cols-[minmax(0,1fr)_auto]
          items-center gap-2
          sm:mb-8
          lg:grid-cols-3
        "
      >
        {/* LEFT: FLASH SALE TITLE */}
        <div className="flex min-w-0 items-center justify-start gap-2 sm:gap-3">
          <div className="flex h-8 w-8 shrink-0 animate-pulse items-center justify-center rounded-lg bg-rose-600 text-white shadow-sm sm:h-10 sm:w-10 sm:rounded-xl">
            <Zap size={18} className="sm:size-5" />
          </div>

          <div className="min-w-0">
            <h2 className="whitespace-nowrap font-[var(--font-poppins)] text-xs font-bold text-[#12233F] sm:text-xl">
              {t("flashSale") || "Flash Sale"}
            </h2>

            <p className="mt-0.5 hidden text-xs text-slate-500 sm:block sm:text-sm">
              {t("limitedDeals") ||
                "Grab these limited deals before they run out!"}
            </p>
          </div>
        </div>

        {/* COUNTDOWN */}
        <div
          className="
            flex min-w-0 items-center justify-end gap-1
            lg:col-start-2 lg:justify-self-center lg:gap-2
          "
        >
          <div className="flex shrink-0 items-center gap-1 whitespace-nowrap">
            <Clock size={13} className="text-rose-600 sm:size-4" />

            <span className="text-[9px] font-semibold text-slate-600 sm:text-sm">
              {t("endingIn") || "Ending In"}:
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {timerItems.map((item) => (
              <div
                key={item.label}
                className="
                  flex w-[34px] shrink-0 flex-col items-center
                  rounded-md border border-slate-200
                  bg-white px-0.5 py-1 shadow-sm
                  sm:w-[52px] sm:rounded-xl sm:px-2.5 sm:py-2
                "
              >
                <span className="font-mono text-xs font-bold tabular-nums text-rose-600 sm:text-xl">
                  {String(item.value).padStart(2, "0")}
                </span>

                <span className="whitespace-nowrap text-[7px] font-medium text-slate-500 sm:text-[10px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP SPACER */}
        <div className="hidden lg:block" />
      </div>

      {/* PRODUCTS SLIDER WRAPPER */}
      <div
        className="group relative mt-3 min-w-0 px-4 sm:mt-4 sm:px-5"
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
      >
        <div className="relative min-w-0">

          {/* LEFT ARROW */}
          {products.length > 1 && !loading && (
            <button
              type="button"
              onClick={() => scroll("left")}
              className="
                absolute -left-4 sm:-left-5 top-1/2 z-30
                flex h-9 w-6 -translate-y-1/2
                items-center justify-center rounded-md
                border border-slate-200 bg-white/95
                text-slate-700 shadow-md backdrop-blur-sm
                transition-all hover:bg-rose-50 hover:text-rose-600
                active:scale-95
                sm:h-12 sm:w-8
              "
              aria-label={t("previousProducts") || "Previous"}
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* RIGHT ARROW */}
          {products.length > 1 && !loading && (
            <button
              type="button"
              onClick={() => scroll("right")}
              className="
                absolute -right-4 sm:-right-5 top-1/2 z-30
                flex h-9 w-6 -translate-y-1/2
                items-center justify-center rounded-md
                border border-slate-200 bg-white/95
                text-slate-700 shadow-md backdrop-blur-sm
                transition-all hover:bg-rose-50 hover:text-rose-600
                active:scale-95
                sm:h-12 sm:w-8
              "
              aria-label={t("nextProducts") || "Next"}
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* PRODUCT CARDS */}
          <div
            ref={sliderRef}
            className="
              grid min-w-0 grid-flow-col
              auto-cols-[calc((100%-12px)/2)]
              gap-3 overflow-x-auto px-0 pb-3
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
      </div>

      {/* VIEW ALL BUTTON */}
      <div className="mt-5 flex justify-center">
        <Link
          href="/products?type=flash-sale"
          className="
            group inline-flex items-center gap-2
            rounded-full bg-[#D6A419] px-5 py-2.5
            text-xs font-semibold text-white shadow-sm
            transition-all duration-200
            hover:bg-[#c3940f] hover:shadow-md
          "
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
