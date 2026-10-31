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

  const scrollLeft = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.querySelector<HTMLElement>("[data-product-card]");
    const gap = 12;
    const scrollAmount = card
      ? (card.offsetWidth + gap) * 2
      : slider.clientWidth;

    slider.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.querySelector<HTMLElement>("[data-product-card]");
    const gap = 12;
    const scrollAmount = card
      ? (card.offsetWidth + gap) * 2
      : slider.clientWidth;

    slider.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

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

            // Use the earliest flash-sale end time
            const endTimes = result.data
              .map((item: any) => item.flashSaleAttribute?.endTime)
              .filter(Boolean)
              .map((value: string) => new Date(value))
              .filter(
                (date: Date) => !Number.isNaN(date.getTime())
              );

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

  // Flash sale countdown
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
      {/* Header Container */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-5">
        
        {/* Top Row: Title, Live Badge & Timer */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Title & Icon */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-8 w-8 shrink-0 animate-pulse items-center justify-center rounded-lg bg-rose-600 text-white shadow-sm sm:h-10 sm:w-10 sm:rounded-xl">
              <Zap size={18} className="sm:h-5 sm:w-5" />
            </div>

            <h2 className="flex items-center gap-2 font-[var(--font-poppins)] text-lg font-bold text-[#12233F] sm:text-xl">
              {t("flashSale")}
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-600 sm:text-xs">
                {t("liveNow")}
              </span>
            </h2>
          </div>

          {/* Countdown Timer Box (Top Right) */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2">
            <Clock size={14} className="shrink-0 text-rose-600 sm:h-4 sm:w-4" />
            <span className="text-[10px] font-semibold text-slate-600 sm:text-xs">
              {t("endingIn")}
            </span>
            <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-rose-600 sm:text-xs">
              <span className="rounded bg-rose-50 px-1 py-0.5 sm:px-1.5 sm:py-1">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              :
              <span className="rounded bg-rose-50 px-1 py-0.5 sm:px-1.5 sm:py-1">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              :
              <span className="rounded bg-rose-50 px-1 py-0.5 sm:px-1.5 sm:py-1">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Second Row: Subtitle / Description & View All / Controls */}
        <div className="flex items-center justify-between gap-2 border-t border-slate-200/60 pt-2.5">
          <p className="text-xs text-slate-500 sm:text-sm">
            {t("limitedDeals")}
          </p>

          <div className="flex items-center gap-2 sm:gap-3">
    
<Link
  href="/products?type=flash-sale"
  className="hidden items-center gap-1 text-sm font-semibold text-[#12233F] transition hover:text-rose-600 sm:flex"
>
  {t("viewAll")}
  <ArrowRight size={16} />
</Link>


            {/* Slider controls: mobile/tablet only */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={scrollLeft}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 sm:h-9 sm:w-9"
                aria-label={t("previousProducts")}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={scrollRight}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 sm:h-9 sm:w-9"
                aria-label={t("nextProducts")}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* PRODUCTS */}
      <div
        ref={sliderRef}
        className="
          grid grid-flow-col auto-cols-[calc((100%-12px)/2)]
          gap-3 overflow-x-auto pb-3
          snap-x snap-mandatory overscroll-x-contain
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          lg:grid-flow-row lg:grid-cols-5 lg:auto-cols-auto
          lg:gap-5 lg:overflow-x-visible lg:pb-2
        "
      >
        {loading ? (
          <div className="col-span-full py-10 text-center text-sm text-slate-500">
            {t("loadingFlashSale")}
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full py-10 text-center text-sm text-slate-500">
            {t("noFlashSale")}
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

      {/* VIEW ALL: mobile */}
      <div className="mt-4 flex justify-center sm:hidden">
        <Link
          href="/flash-sale"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#12233F]"
        >
          {t("viewAllProducts")}
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}