"use client";
import { toast } from "react-toastify";


import { useState } from "react";
import Link from "next/link";
import { Heart, Star, ShoppingCart, GitCompareArrows } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { createClient } from "../../../../lib/supabase-client";

type ProductCardProps = {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  reviewsCount: number;
  moq: string;
  isNew?: boolean;
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
  rating,
  reviewsCount,
  moq,
  isNew,
  discountBadge,
  flashSalePrice,
  flashSaleStock,
  isFlashSale = false,
}: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const { isInCompare, toggleCompare } = useCompare();
  const inCompare = isInCompare(id);

  const displayPrice =
    isFlashSale && flashSalePrice && flashSalePrice > 0
      ? flashSalePrice
      : price;

  const handleToggleCompare = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    toggleCompare({
      id,
      slug,
      title,
      image,
      price: displayPrice,
      regularPrice: price !== displayPrice ? price : undefined,
      rating,
      reviewsCount,
      moq,
    });
  };

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

  const supabase = createClient();

  const getAccessToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token ?? null;
  };

  const handleAddToCart = async (
    event: React.MouseEvent<HTMLButtonElement>,
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
          data?.message || "কার্টে পণ্য যোগ করতে সমস্যা হয়েছে",
        );
      }

      toast.success("পণ্যটি কার্টে যোগ করা হয়েছে!");
    } catch (error: unknown) {
      console.error("Add To Cart Error:", error);

      toast.error(error instanceof Error ? error.message : "সমস্যা হয়েছে");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (isAddingToWishlist) return;

    try {
      setIsAddingToWishlist(true);

      const token = await getAccessToken();

      if (!token) {
        toast.warning("Wishlist-এ যোগ করতে আগে লগইন করুন।");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Wishlist-এ যোগ করতে সমস্যা হয়েছে",
        );
      }

      toast.success("পণ্যটি Wishlist-এ যোগ করা হয়েছে!");
    } catch (error: unknown) {
      console.error("Add To Wishlist Error:", error);

      toast.error(error instanceof Error ? error.message : "সমস্যা হয়েছে");
    } finally {
      setIsAddingToWishlist(false);
    }
  };



  return (
    <div className="group relative flex h-full min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-2 transition hover:border-amber-400 hover:shadow-md sm:rounded-2xl sm:p-3">
      {/* BADGE & WISHLIST */}
      <div className="mb-1.5 flex min-h-7 items-center justify-between gap-1">
        <div className="min-w-0">
          {isFlashSale && discountBadge ? (
            <span className="inline-block max-w-full truncate rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold text-white sm:text-[10px]">
              {discountBadge}
            </span>
          ) : isNew ? (
            <span className="inline-block rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white sm:text-[10px]">
              NEW
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleCompare}
            aria-label={inCompare ? "Remove from compare" : "Add to compare"}
            title={inCompare ? "তুলনা তালিকা থেকে সরান" : "তুলনা তালিকায় যোগ করুন"}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
              inCompare
                ? "bg-amber-100 text-amber-700 shadow-xs"
                : "bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-600"
            }`}
          >
            <GitCompareArrows size={13} />
          </button>

          <button
            type="button"
            onClick={handleAddToWishlist}
            disabled={isAddingToWishlist}
            aria-label="Add to wishlist"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
          >
            <Heart size={14} />
          </button>
        </div>
      </div>

      {/* PRODUCT IMAGE & DETAILS */}
      <Link href={`/products/${slug}`} className="block min-w-0">
        <div className="mb-2 flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-50 sm:h-28 lg:h-32">
          {typeof image === "string" &&
          (image.startsWith("http") || image.startsWith("/")) ? (
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="h-full w-full object-contain p-1.5"
            />
          ) : (
            <span className="text-3xl sm:text-4xl">
              {typeof image === "string" && image ? image : "📦"}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 min-h-[32px] break-words text-[11px] font-bold leading-4 text-[#12233F] sm:text-xs">
          {title}
        </h3>

        {/* RATING */}
        <div className="mt-1 flex min-w-0 items-center gap-0.5 text-amber-400">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={11}
              className="shrink-0"
              fill={index < Math.round(rating) ? "currentColor" : "none"}
            />
          ))}

          <span className="ml-0.5 truncate text-[9px] text-slate-400 sm:text-[10px]">
            ({reviewsCount})
          </span>
        </div>
      </Link>

      {/* PRICE & MOQ */}
      <div className="mt-2 border-t border-slate-100 pt-2 sm:mt-3 sm:pt-3">
        {isFlashSale && (
          <div className="mb-0.5 text-[9px] text-slate-400 line-through">
            ৳{price.toLocaleString("en-BD")}
          </div>
        )}

        <div
          className={`break-words text-xs font-extrabold sm:text-sm ${
            isFlashSale ? "text-rose-600" : "text-[#12233F]"
          }`}
        >
          ৳{displayPrice.toLocaleString("en-BD")}
        </div>

        <div className="mt-0.5 flex min-w-0 items-center justify-between gap-1 text-[9px] sm:text-[10px]">
          <span className="truncate text-slate-500">MOQ: {moq}</span>

          {isFlashSale && (
            <span className="shrink-0 font-semibold text-rose-600">
              {flashSaleStock ?? 0} left
            </span>
          )}
        </div>

        {/* ADD TO CART */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="mt-2 flex w-full min-w-0 items-center justify-center gap-1 rounded-lg bg-[#12233F] px-1.5 py-2 text-[10px] font-bold text-white transition hover:bg-[#1d3557] disabled:cursor-not-allowed disabled:opacity-50 sm:mt-3 sm:py-2 sm:text-xs"
        >
          <ShoppingCart size={13} className="shrink-0" />

          <span className="truncate">
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </span>
        </button>
      </div>
    </div>
  );
}
