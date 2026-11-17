"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import ProductCard from "@/components/cards/product/New-Arrivals-ProductCartd";
import type { RelatedProduct } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001";

type Props = {
  title?: string;
  products?: RelatedProduct[];
  categoryId?: string;
  currentProductId?: string;
};

export default function RelatedProducts({
  title = "সম্পর্কিত পণ্যসমূহ (Related Products)",
  products = [],
  categoryId,
  currentProductId,
}: Props) {
  const [items, setItems] = useState<RelatedProduct[]>(products);
  const [loading, setLoading] = useState(false);

  // Sync with prop when passed
  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      setItems(products);
    }
  }, [products]);

  // Fallback auto-fetch ONLY within the same category/domain if no products passed
  useEffect(() => {
    if (items.length > 0) return;
    if (!categoryId) return;

    let mounted = true;
    async function loadFallbackProducts() {
      try {
        setLoading(true);
        const catLower = (categoryId || "").toLowerCase();
        const isMedicine =
          catLower.includes("medicine") ||
          catLower.includes("otc") ||
          catLower.includes("prescription") ||
          catLower.includes("healthcare") ||
          catLower.includes("health");

        const query = isMedicine
          ? `?search=Medicine&limit=24`
          : `?categoryId=${encodeURIComponent(categoryId!)}&limit=24`;

        const res = await fetch(`${API_URL}/api/products${query}`, {
          cache: "no-store",
        });
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];

        const mapped: RelatedProduct[] = list
          .filter((p: any) => {
            if (
              String(p.id) === String(currentProductId) ||
              String(p.slug) === String(currentProductId)
            ) {
              return false;
            }

            const pCatName = String(p.category?.name || "").toLowerCase();
            const pCatId = String(p.categoryId || p.category?.id || "").toLowerCase();

            if (isMedicine) {
              return (
                (pCatName.includes("medicine") ||
                  pCatName.includes("otc") ||
                  pCatName.includes("prescription") ||
                  pCatName.includes("healthcare")) &&
                !pCatName.includes("stationery") &&
                !pCatName.includes("book")
              );
            }

            if (catLower.includes("book")) {
              return pCatName.includes("book") && !pCatName.includes("stationery");
            }

            if (catLower.includes("stationery")) {
              return pCatName.includes("stationery") && !pCatName.includes("book");
            }

            return pCatId === catLower || pCatName.includes(catLower);
          })
          .slice(0, 12)
          .map((p: any) => {
            const regPrice = Number(
              p.pricing?.customerRegularPrice ?? p.regularPrice ?? p.price ?? 0
            );
            const salePr = Number(
              p.pricing?.customerSalePrice ?? p.salePrice ?? 0
            );
            const hasSale = salePr > 0 && salePr < regPrice;
            const effectivePrice = hasSale ? salePr : regPrice;
            const discount = hasSale
              ? Math.round(((regPrice - salePr) / regPrice) * 100)
              : undefined;
            const img =
              Array.isArray(p.images) && p.images[0]
                ? p.images[0]
                : p.image || "/placeholder.png";

            return {
              id: String(p.id),
              slug: p.slug,
              name: p.title || p.name || "Product",
              image: img,
              price: effectivePrice,
              oldPrice: hasSale ? regPrice : undefined,
              rating: Number(
                p.topRatedAttribute?.averageRating ?? p.rating ?? 4.8
              ),
              reviews: Number(
                p.topRatedAttribute?.totalReviews ??
                  p.reviewsCount ??
                  p.reviews ??
                  0
              ),
              sold: Number(
                p.topSellerAttribute?.unitsSold ?? p.unitsSold ?? p.sold ?? 0
              ),
              discount,
            };
          });

        if (mounted && mapped.length > 0) {
          setItems(mapped);
        }
      } catch (err) {
        console.warn("Failed to load related products fallback:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadFallbackProducts();

    return () => {
      mounted = false;
    };
  }, [items.length, currentProductId, categoryId]);

  if (items.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-[#D6A419]">
              <Sparkles size={16} />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#12233f]">
              {title}
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            এই পণ্যের সাথে পছন্দের তালিকায় থাকা আরও কিছু জনপ্রিয় পণ্য
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#12233f] transition hover:border-[#D6A419] hover:bg-amber-50/50 hover:text-[#D6A419]"
        >
          <span>আরও দেখুন</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Grid: 6 columns on desktop using the exact New-Arrivals-ProductCartd */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-3">
        {items.map((product) => (
          <div key={product.id} className="min-w-0">
            <ProductCard
              id={product.id}
              slug={product.slug || product.id}
              title={product.name}
              image={product.image}
              price={product.price}
              regularPrice={product.oldPrice}
              rating={product.rating ?? 4.8}
              reviewsCount={product.reviews ?? 0}
              moq="1"
              stockQuantity={product.sold ? 100 : undefined}
              isNew={Boolean(product.discount)}
              badgeText={product.discount ? `${product.discount}% OFF` : undefined}
              discountBadge={product.discount ? `${product.discount}% OFF` : undefined}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
