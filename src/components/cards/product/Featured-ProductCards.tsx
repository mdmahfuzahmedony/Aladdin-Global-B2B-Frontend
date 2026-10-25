"use client";
import { toast } from "react-toastify";

import { useState } from "react";
import Link from "next/link";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { createClient } from "../../../../lib/supabase-client"; // আপনার প্রজেক্টের পাথ অনুযায়ী ঠিক করে নিতে পারেন

export type FeaturedProduct = {
  id: string;
  slug?: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  category: string;
  moq?: string;
};

export default function FeaturedCard({
  product,
}: {
  product: FeaturedProduct;
}) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

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
          productId: product.id,
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
          productId: product.id,
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
    <div className="group relative flex h-full w-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-amber-400 hover:shadow-md">
      <div>
        {/* Top Badge & Favorite */}
        <div className="mb-3 flex items-center justify-between">
          <span className="truncate rounded-md bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm sm:text-xs">
            {product.badge || "FEATURED"}
          </span>

          <button
            type="button"
            onClick={handleAddToWishlist}
            disabled={isAddingToWishlist}
            aria-label="Add to wishlist"
            className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
          >
            <Heart size={14} />
          </button>
        </div>

        {/* Product Image / Details Link */}
        <Link href={`/products/${product.slug || product.id}`} className="block min-w-0">
          <div className="mb-3 flex h-28 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 text-4xl transition group-hover:scale-[1.02] sm:h-32">
            {product.image.startsWith("http") ||
            product.image.startsWith("/") ? (
              <img
                src={product.image}
                alt={product.title}
                loading="lazy"
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <span>{product.image}</span>
            )}
          </div>

          <span className="block truncate text-[10px] font-semibold uppercase tracking-wide text-blue-600 sm:text-[11px]">
            {product.category}
          </span>

          <h3 className="mt-1 line-clamp-2 min-h-[32px] break-words text-xs font-bold leading-snug text-[#12233F] sm:text-sm">
            {product.title}
          </h3>

          {/* Rating & Reviews */}
          <div className="mt-2 flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.round(product.rating || 0) ? "currentColor" : "none"}
              />
            ))}

            <span className="ml-1 text-[10px] text-slate-400 sm:text-xs">
              ({product.reviewsCount || 0})
            </span>
          </div>
        </Link>
      </div>

      {/* Price & Add To Cart Section */}
      <div className="mt-3 border-t border-slate-100 pt-3">
        <div className="flex items-baseline justify-between gap-1">
          <div className="text-sm font-extrabold text-[#12233F] sm:text-base">
            ৳{product.price.toLocaleString("en-BD")}
          </div>

          {product.originalPrice && (
            <div className="text-xs text-slate-400 line-through">
              ৳{product.originalPrice.toLocaleString("en-BD")}
            </div>
          )}
        </div>

        {product.moq && (
          <div className="mt-1 text-[10px] text-slate-500 sm:text-[11px]">
            MOQ: {product.moq}
          </div>
        )}

        {/* ADD TO CART BUTTON */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="mt-3 flex w-full min-w-0 items-center justify-center gap-1.5 rounded-xl bg-[#12233F] px-2 py-2.5 text-xs font-bold text-white transition hover:bg-[#1d3557] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart size={14} className="shrink-0" />
          <span className="truncate">
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </span>
        </button>
      </div>
    </div>
  );
}