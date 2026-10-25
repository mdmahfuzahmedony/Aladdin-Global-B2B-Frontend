"use client";
import { toast } from "react-toastify";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Trash2,
  Heart,
  ShoppingCart,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import { createClient } from "../../../lib/supabase-client";

interface WishlistProductPricing {
  customerRegularPrice: number;
  customerSalePrice: number | null;
}

interface WishlistProduct {
  id: string;
  title: string;
  images: string[];
  pricing: WishlistProductPricing | null;
}

interface WishlistApiItem {
  id: string;
  productId: string;
  product: WishlistProduct;
}

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onWishlistChanged?: () => void;
  onCartChanged?: () => void;
}

export default function WishlistSidebar({
  isOpen,
  onClose,
  onWishlistChanged,
  onCartChanged,
}: WishlistSidebarProps) {
  const [items, setItems] = useState<WishlistApiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

  const getAccessToken = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token || null;
  }, []);

  const loadWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const accessToken = await getAccessToken();

      if (!accessToken) {
        setItems([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Wishlist load করতে সমস্যা হয়েছে",
        );
      }

      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (error) {
      console.error("Load Wishlist Error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Wishlist load করতে সমস্যা হয়েছে",
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, getAccessToken]);

  useEffect(() => {
    if (isOpen) {
      void loadWishlist();
    }
  }, [isOpen, loadWishlist]);

  const handleRemoveItem = async (itemId: string) => {
    try {
      setRemovingId(itemId);
      setErrorMessage("");

      const accessToken = await getAccessToken();

      if (!accessToken) {
        setErrorMessage("Wishlist থেকে Remove করতে আগে Login করুন।");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/wishlist/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Wishlist থেকে product remove করতে সমস্যা হয়েছে",
        );
      }

      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId),
      );

      onWishlistChanged?.();
    } catch (error) {
      console.error("Remove Wishlist Item Error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Product remove করতে সমস্যা হয়েছে",
      );
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (item: WishlistApiItem) => {
    try {
      setAddingId(item.id);
      setErrorMessage("");

      const accessToken = await getAccessToken();

      if (!accessToken) {
        setErrorMessage("Cart-এ যোগ করতে আগে Login করুন।");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          productId: item.productId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Product cart-এ add করতে সমস্যা হয়েছে",
        );
      }

      onCartChanged?.();
      toast.success("পণ্যটি কার্টে যোগ করা হয়েছে!");
    } catch (error) {
      console.error("Add Wishlist Product To Cart Error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Cart-এ product যোগ করতে সমস্যা হয়েছে",
      );
    } finally {
      setAddingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="flex w-screen max-w-sm flex-col bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-[#0F172A] px-6 py-4 text-white">
            <div className="flex items-center gap-2">
              <Heart size={20} className="text-[#F59E0B]" fill="#F59E0B" />
              <h2 className="text-lg font-bold">
                My Wishlist ({items.length})
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close wishlist"
              className="text-gray-300 transition-colors hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700">
              {errorMessage}
              <button
                type="button"
                onClick={() => void loadWishlist()}
                className="ml-2 font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Wishlist Items */}
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {loading ? (
              <div className="py-20 text-center">
                <LoaderCircle
                  size={28}
                  className="mx-auto animate-spin text-[#0F172A]"
                />
                <p className="mt-3 font-medium text-gray-500">
                  Loading wishlist...
                </p>
              </div>
            ) : items.length > 0 ? (
              items.map((item) => {
                const regularPrice =
                  Number(item.product.pricing?.customerRegularPrice) || 0;

                const salePrice = item.product.pricing?.customerSalePrice;

                const price =
                  salePrice !== null &&
                  salePrice !== undefined &&
                  Number(salePrice) >= 0 &&
                  Number(salePrice) < regularPrice
                    ? Number(salePrice)
                    : regularPrice;

                const image = item.product.images?.[0] || "";

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={item.product.title}
                        className="h-16 w-16 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-200">
                        <Heart size={22} className="text-gray-400" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h4 className="line-clamp-1 text-sm font-semibold text-[#0F172A]">
                        {item.product.title}
                      </h4>

                      <p className="mt-1 text-sm font-bold text-[#F59E0B]">
                        ৳{price.toLocaleString("en-BD")}
                      </p>

                      <button
                        type="button"
                        onClick={() => void handleAddToCart(item)}
                        disabled={
                          addingId === item.id || removingId === item.id
                        }
                        className="mt-2 flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {addingId === item.id ? (
                          <LoaderCircle size={12} className="animate-spin" />
                        ) : (
                          <ShoppingCart size={12} />
                        )}
                        {addingId === item.id ? "Adding..." : "Add to Cart"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleRemoveItem(item.id)}
                      disabled={removingId === item.id || addingId === item.id}
                      aria-label={`Remove ${item.product.title}`}
                      className="shrink-0 p-2 text-gray-400 transition-colors hover:text-red-500 disabled:opacity-50"
                    >
                      {removingId === item.id ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center">
                <Heart size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-500">
                  Your wishlist is empty
                </p>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="mt-4 inline-block text-sm font-semibold text-[#0F172A] underline"
                >
                  Browse Products
                </Link>
              </div>
            )}
          </div>

          {/* See All Wishlist */}
          <div className="border-t border-gray-100 bg-white p-5">
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800"
            >
              See All Wishlist
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
