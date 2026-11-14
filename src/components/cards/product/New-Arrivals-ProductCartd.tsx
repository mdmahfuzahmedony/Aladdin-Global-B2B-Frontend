"use client";

import { toast } from "react-toastify";
import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Star,
  ShoppingCart,
  ArrowLeftRight,
  Package,
} from "lucide-react";

import { useCompare } from "@/context/CompareContext";
import { useWishlist } from "@/context/WishlistContext";
import { useLanguage } from "@/context/LanguageContext";
import { createClient } from "../../../../lib/supabase-client";

type ProductCardProps = {
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

export default function ProductCard({
  id,
  slug,
  title,
  image,
  price,
  regularPrice,
  rating,
  reviewsCount,
  moq,
  stockQuantity,
  shortDescription,
  isNew,
  badgeText,
  discountBadge,
  flashSalePrice,
  flashSaleStock,
  isFlashSale = false,
}: ProductCardProps) {
  const { t } = useLanguage();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const { isInCompare, toggleCompare } = useCompare();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inCompare = isInCompare(id);
  const inWishlist = isInWishlist(id);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001";

  const supabase = createClient();

  // Ensure slug is never empty - fallback to id if slug is missing
  const rawIdentifier = (slug && String(slug).trim()) || (id && String(id).trim()) || "";
  let cleanSlug = rawIdentifier;
  try {
    while (cleanSlug.includes("%")) {
      const decoded = decodeURIComponent(cleanSlug);
      if (decoded === cleanSlug) break;
      cleanSlug = decoded;
    }
  } catch {}
  const productUrl = cleanSlug ? `/products/${cleanSlug}` : "#";

  const displayPrice =
    isFlashSale && flashSalePrice && flashSalePrice > 0
      ? flashSalePrice
      : price;

  const effectiveRegularPrice =
    regularPrice && regularPrice > displayPrice
      ? regularPrice
      : price > displayPrice
        ? price
        : 0;

  const discountPercent =
    effectiveRegularPrice > displayPrice
      ? Math.round(
          ((effectiveRegularPrice - displayPrice) / effectiveRegularPrice) * 100
        )
      : null;

  const realStock =
    typeof stockQuantity === "number"
      ? stockQuantity
      : stockQuantity
        ? Number(stockQuantity)
        : 0;

  const getAccessToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token ?? null;
  };

  // Compare
  const handleToggleCompare = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    toggleCompare({
      id,
      slug: rawIdentifier,
      title,
      image,
      price: displayPrice,
      regularPrice: effectiveRegularPrice > 0 ? effectiveRegularPrice : undefined,
      rating,
      reviewsCount,
      moq,
    });
  };

  // Wishlist toggle
  const handleToggleWishlist = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (isTogglingWishlist) return;

    try {
      setIsTogglingWishlist(true);
      await toggleWishlist({
        id,
        slug: rawIdentifier,
        title,
        image,
        price: displayPrice,
        regularPrice: effectiveRegularPrice > 0 ? effectiveRegularPrice : undefined,
      });
    } catch (error) {
      console.error("Toggle Wishlist Error:", error);
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  // Add to Cart
  const handleAddToCart = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (isAddingToCart) return;

    try {
      setIsAddingToCart(true);

      const token = await getAccessToken();

      if (!token) {
        toast.warning("কার্টে যোগ করতে আগে লগইন করুন।");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "কার্টে পণ্য যোগ করতে সমস্যা হয়েছে"
        );
      }

      toast.success("পণ্যটি কার্টে যোগ করা হয়েছে!");
    } catch (error: unknown) {
      console.error("Add To Cart Error:", error);

      toast.error(
        error instanceof Error ? error.message : "সমস্যা হয়েছে"
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="group relative flex h-full min-w-0 flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-1 sm:p-1.5 pb-2.5 sm:pb-3 shadow-xs transition-all duration-300 hover:border-amber-400 hover:shadow-lg">

      {/* FULL-CARD LINK OVERLAY */}
      <Link
        href={productUrl}
        aria-label={title}
        className="absolute inset-0 z-0 rounded-2xl"
      />

      <div className="relative z-1 pointer-events-none">
        {/* IMAGE CONTAINER */}
        <div className="relative mb-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50/70">

          {/* BADGE (TOP-LEFT: Only NEW badge if applicable, discount percent removed from over the image) */}
          {isNew && (
            <div className="absolute left-1.5 top-1.5 z-10 flex flex-col gap-1 pointer-events-none sm:left-2 sm:top-2">
              <span className="rounded-md bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm sm:px-2">
                {badgeText || "NEW"}
              </span>
            </div>
          )}

          {/* VERTICAL ACTIONS: WISHLIST & COMPARE (TOP-RIGHT) */}
          <div className="absolute right-1.5 top-1.5 z-20 flex flex-col gap-1.5 pointer-events-auto sm:right-2 sm:top-2">
            {/* Wishlist Button (Top) */}
            <button
              type="button"
              onClick={handleToggleWishlist}
              disabled={isTogglingWishlist}
              aria-label={
                inWishlist ? "Remove from wishlist" : t("addToWishlist")
              }
              title={
                inWishlist ? "Wishlist এ যুক্ত আছে" : "Wishlist এ যোগ করুন"
              }
              className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 ${
                inWishlist
                  ? "border border-[#D6A419] bg-amber-50 text-[#D6A419] shadow-amber-200/60"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#D6A419] hover:bg-amber-50 hover:text-[#D6A419]"
              }`}
            >
              <Heart
                size={15}
                className={
                  inWishlist
                    ? "fill-[#D6A419] text-[#D6A419]"
                    : "text-slate-600 transition-colors"
                }
              />
            </button>

            {/* Compare Button (Bottom) - Matching Navbar ArrowLeftRight Icon */}
            <button
              type="button"
              onClick={handleToggleCompare}
              aria-label={
                inCompare ? t("removeFromCompare") : t("addToCompare")
              }
              title={
                inCompare ? "Compare এ যুক্ত আছে" : "Compare এ যোগ করুন"
              }
              className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
                inCompare
                  ? "border border-[#D6A419] bg-amber-50 text-[#D6A419] shadow-amber-200/60"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#D6A419] hover:bg-amber-50 hover:text-[#D6A419]"
              }`}
            >
              <ArrowLeftRight
                size={15}
                className={inCompare ? "text-[#D6A419]" : "text-slate-600 transition-colors"}
              />
            </button>
          </div>

          {/* PRODUCT IMAGE */}
          <div className="flex h-full w-full items-center justify-center">
            {typeof image === "string" &&
            (image.startsWith("http") || image.startsWith("/")) ? (
              <img
                src={image}
                alt={title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="text-4xl sm:text-5xl">
                {typeof image === "string" && image ? image : "📦"}
              </span>
            )}
          </div>
        </div>

        {/* TITLE & RATING & REVIEWS */}
        <div className="block min-w-0 px-1 sm:px-1.5">
          <h3 className="line-clamp-2 min-h-[34px] text-xs font-bold leading-tight text-[#12233F] transition-colors group-hover:text-amber-600 sm:text-[13px]">
            {title}
          </h3>

          {/* RATING & REVIEWS */}
          <div className="mt-1 flex items-center gap-1">
            <Star
              size={12}
              className="shrink-0 text-amber-500 fill-amber-500"
            />
            <span className="text-[11px] font-bold text-slate-800">
              {Number(rating || 0).toFixed(1)}
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              ({reviewsCount >= 1000 ? `${(reviewsCount / 1000).toFixed(1)}k` : reviewsCount} reviews)
            </span>
          </div>
        </div>

        {/* PRICING ROW */}
        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap px-1 sm:px-1.5">
          {/* Main Display Price */}
          <span className="text-sm sm:text-base font-black text-[#f95738]">
            ৳{displayPrice.toLocaleString("en-BD")}
          </span>

          {/* Regular Strikethrough Price */}
          {effectiveRegularPrice > displayPrice && (
            <span className="text-[11px] font-medium text-slate-400 line-through">
              ৳{effectiveRegularPrice.toLocaleString("en-BD")}
            </span>
          )}

          {/* Discount Percentage Badge */}
          {discountPercent && discountPercent > 0 ? (
            <span className="rounded-md border border-emerald-200/70 bg-emerald-50 px-1 py-0.5 text-[10px] font-bold text-emerald-600">
              {discountPercent}% OFF
            </span>
          ) : null}
        </div>

        {/* STOCK INFO ROW */}
        <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-slate-700 px-1 sm:px-1.5">
          <Package size={13} className="shrink-0 text-emerald-500" />
          <span>
            {realStock > 0 ? (
              <>
                Stock: <span className="font-bold text-slate-900">{realStock}</span> pcs
              </>
            ) : (
              <span className="font-bold text-rose-500">Out of stock</span>
            )}
          </span>
          {moq && moq !== "N/A" && (
            <span className="ml-1 text-[10px] font-normal text-slate-400">
              ({t("moq")}: {moq})
            </span>
          )}
        </div>
      </div>

      {/* BOTTOM ADD TO CART BUTTON */}
      <div className="mt-2.5 relative z-20 px-1 sm:px-1.5">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0B1E3B] py-2 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-[#16305a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart size={14} className="shrink-0 text-white" />
          <span>{isAddingToCart ? t("adding") : "Add to Cart"}</span>
        </button>
      </div>

    </div>
  );
}
