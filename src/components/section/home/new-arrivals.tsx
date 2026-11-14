
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
  regularPrice?: number;
  rating: number;
  reviewsCount: number;
  moq: string;
  stockQuantity?: number;
  shortDescription?: string;
  isNew?: boolean;
  badgeText?: string | null;
  discountBadge?: string | null;
  flashSalePrice?: number;
  flashSaleStock?: number;
  isFlashSale?: boolean;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001";

export default function NewArrivalsPage() {
  const { t } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  // Manual scroll function: scrolls 2-3 cards smoothly, wraps around if at edges
  const scroll = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.querySelector<HTMLElement>("[data-product-card]");
    const gap = 16;
    const cardsToScroll = typeof window !== "undefined" && window.innerWidth >= 1024 ? 3 : 2;

    const scrollAmount = card
      ? (card.offsetWidth + gap) * cardsToScroll
      : slider.clientWidth * 0.75;

    const isAtEnd =
      slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10;

    if (direction === "right" && isAtEnd) {
      slider.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction === "left" && slider.scrollLeft <= 5) {
      slider.scrollTo({ left: slider.scrollWidth, behavior: "smooth" });
    } else {
      slider.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Auto slider
  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      const slider = sliderRef.current;

      if (!slider || isHoveredRef.current) return;

      const card = slider.querySelector<HTMLElement>("[data-product-card]");
      const scrollAmount = card ? card.offsetWidth + 12 : 260;

      const isAtEnd =
        slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10;

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

  // Fetch new arrivals
  useEffect(() => {
    let cancelled = false;

    async function fetchNewArrivals() {
      try {
        const response = await fetch(
          `${API_URL}/api/products/home/new-arrivals`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        if (!result?.success || !Array.isArray(result?.data)) {
          throw new Error("New arrivals data পাওয়া যায়নি।");
        }

        const mappedProducts: Product[] = result.data.map((item: any) => {
          // Published reviews only
          const publishedReviews = Array.isArray(item.reviews)
            ? item.reviews.filter(
                (review: any) => review.status === "PUBLISHED"
              )
            : [];

          const reviewsCount = publishedReviews.length;

          const rating =
            reviewsCount > 0
              ? publishedReviews.reduce(
                  (total: number, review: any) =>
                    total + Number(review.rating || 0),
                  0
                ) / reviewsCount
              : 0;

          // Pricing
          const regularPrice = Number(
            item.pricing?.customerRegularPrice ?? 0
          );

          const salePrice = Number(
            item.pricing?.customerSalePrice ?? 0
          );

          const flashSalePrice = Number(
            item.flashSaleAttribute?.flashSalePrice ?? 0
          );

          const isFlashSale =
            item.flashSaleAttribute !== null &&
            item.flashSaleAttribute !== undefined &&
            flashSalePrice > 0;

          const price =
            isFlashSale
              ? flashSalePrice
              : salePrice > 0
                ? salePrice
                : regularPrice;

          return {
            id: String(item.id),
            slug: item.slug || String(item.id),
            title: item.title ?? "Untitled product",

            image:
              item.attributes?.colors?.[0]?.images?.[0] ||
              (Array.isArray(item.images) ? item.images[0] : null) ||
              item.image ||
              "📦",

            price,
            regularPrice,
            rating,
            reviewsCount,
            stockQuantity: Number(item.stockQuantity ?? 0),
            shortDescription: item.shortDescription ?? "",

            moq:
              item.attributes?.moq !== undefined &&
              item.attributes?.moq !== null
                ? String(item.attributes.moq)
                : "N/A",

            isNew: true,
            badgeText: item.newArrivalAttribute?.badgeText || "NEW",

            discountBadge:
              item.flashSaleAttribute?.discountBadge ?? null,

            flashSalePrice: flashSalePrice || undefined,

            flashSaleStock:
              item.flashSaleAttribute?.flashSaleStock ?? undefined,

            isFlashSale,
          };
        });

        if (!cancelled) {
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchNewArrivals();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-[1500px] px-2 sm:px-3">

        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {t("newArrivals")}
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              {t("discoverLatest")}
            </p>
          </div>
        </div>

        {/* PRODUCTS SLIDER WRAPPER */}
        <div
          className="group relative mt-3 min-w-0 px-0 sm:mt-4"
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
        >
          <div className="relative min-w-0">

            {/* LEFT ARROW */}
            {products.length > 0 && !loading && (
              <button
                type="button"
                onClick={() => scroll("left")}
                className="
                  absolute -left-3 sm:-left-5 top-1/2 z-30
                  flex h-9 w-6 -translate-y-1/2
                  items-center justify-center rounded-md
                  border border-slate-200 bg-white/95
                  text-slate-700 shadow-md backdrop-blur-sm
                  transition-all hover:bg-amber-50 hover:text-[#D6A419] hover:border-[#D6A419]/50
                  active:scale-95
                  sm:h-12 sm:w-8
                "
                aria-label={t("previousProducts") || "Previous"}
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* RIGHT ARROW */}
            {products.length > 0 && !loading && (
              <button
                type="button"
                onClick={() => scroll("right")}
                className="
                  absolute -right-3 sm:-right-5 top-1/2 z-30
                  flex h-9 w-6 -translate-y-1/2
                  items-center justify-center rounded-md
                  border border-slate-200 bg-white/95
                  text-slate-700 shadow-md backdrop-blur-sm
                  transition-all hover:bg-amber-50 hover:text-[#D6A419] hover:border-[#D6A419]/50
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
                gap-3

                overflow-x-auto px-0 pb-3
                snap-x snap-mandatory overscroll-x-contain
                scroll-smooth touch-pan-x

                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden

                sm:auto-cols-[calc((100%-24px)/3)]

                md:auto-cols-[calc((100%-36px)/4)]

                lg:auto-cols-[calc((100%-80px)/6)]
                lg:gap-4
              "
            >
              {loading ? (
                <div className="col-span-full py-12 text-center text-sm text-slate-500">
                  {t("loadingNewArrivals")}
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full py-12 text-center text-sm text-slate-500">
                  {t("noNewArrivals")}
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
        </div>

        {/* VIEW ALL BUTTON */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/products?type=new-arrivals"
            className="
              group inline-flex items-center gap-2
              rounded-xl border border-[#D6A419]
              bg-[#D6A419] px-5 py-2
              text-xs font-semibold text-white shadow-sm
              transition hover:border-[#c3940f]
              hover:bg-[#c3940f] sm:text-sm
            "
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
