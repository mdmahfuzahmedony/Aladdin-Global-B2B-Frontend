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

  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-[1500px] px-3 sm:px-6 lg:px-0">
        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-900">{t("bestSellers")}</h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              {t("customerFavorites")}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/products?type=best-sellers"
              className="hidden items-center gap-1 text-sm font-semibold text-[#12233F] sm:flex"
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
              {t("loadingBestSellers")}
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full py-10 text-center text-sm text-slate-500">
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

        {/* VIEW ALL: mobile */}
        <div className="mt-4 flex justify-center sm:hidden">
          <Link
            href="/products?placement=best-sellers"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#12233F]"
          >
            {t("viewAllProducts")}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
