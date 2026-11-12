"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/cards/product/New-Arrivals-ProductCartd";
import JustForYouSkeleton from "./JustForYouSkeleton";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

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

export default function JustForYouSection() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(12); // Initial 2 rows of 6 cards (12 products)

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/products/home/just-for-you`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result?.error || t("productLoadError"));
        }

        const apiProducts = Array.isArray(result.data) ? result.data : [];

        const mappedProducts: Product[] = apiProducts.map((item: any) => {
          const publishedReviews = Array.isArray(item.reviews)
            ? item.reviews.filter((r: any) => r.status === "PUBLISHED")
            : [];
          const reviewsCount = publishedReviews.length;
          const rating =
            reviewsCount > 0
              ? publishedReviews.reduce(
                  (sum: number, r: any) => sum + Number(r.rating || 0),
                  0
                ) / reviewsCount
              : Number(item.topRatedAttribute?.averageRating ?? 0);

          const regularPrice = Number(item.pricing?.customerRegularPrice ?? 0);
          const salePrice = Number(item.pricing?.customerSalePrice ?? 0);
          const flashSalePrice = Number(item.flashSaleAttribute?.flashSalePrice ?? 0);
          const isFlashSale =
            item.flashSaleAttribute !== null &&
            item.flashSaleAttribute !== undefined &&
            flashSalePrice > 0;
          const price = isFlashSale
            ? flashSalePrice
            : salePrice > 0
              ? salePrice
              : regularPrice;

          const imageUrl =
            item.attributes?.colors?.[0]?.images?.[0] ||
            (Array.isArray(item.images) && item.images.length > 0
              ? item.images[0]
              : null) ||
            item.image ||
            "📦";

          return {
            id: String(item.id),
            slug: item.slug ?? String(item.id),
            title: item.title ?? "Untitled product",
            image: imageUrl,
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
                : "1 pcs",
            isNew: Boolean(item.newArrivalAttribute),
            badgeText: item.newArrivalAttribute ? "NEW" : null,
            discountBadge: item.flashSaleAttribute?.discountBadge ?? null,
            flashSalePrice: flashSalePrice || undefined,
            flashSaleStock: item.flashSaleAttribute?.flashSaleStock ?? undefined,
            isFlashSale,
          };
        });

        if (!cancelled) {
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("JUST FOR YOU PRODUCTS ERROR:", error);

        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : t("productLoadError")
          );
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [t]);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6); // Load More adds 1 row of 6 products
  };

  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-[1500px] px-2 sm:px-3">
        {/* ================= HEADER ================= */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{t("justForYou")}</h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {t("basedOnInterests")}
          </p>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <JustForYouSkeleton key={index} />
            ))}
          </div>
        )}

        {/* ================= ERROR ================= */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-sm font-semibold text-slate-500">
              {t("noProducts")}
            </p>
          </div>
        )}

        {/* ================= PRODUCTS ================= */}
        {!loading && !error && visibleProducts.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-4">
              {visibleProducts.map((product) => (
                <div key={product.id} className="min-w-0">
                  <ProductCard {...product} />
                </div>
              ))}
            </div>

            {/* ================= LOAD MORE BUTTON ================= */}
            {hasMore && (
              <div className="mt-8 text-center sm:mt-10">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-2.5 text-xs font-bold text-[#12233F] shadow-sm transition-all hover:border-[#12233F] hover:bg-slate-50 active:scale-95 sm:py-3 sm:text-sm"
                >
                  {t("loadMoreProducts")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}