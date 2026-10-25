"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Search,
  ShoppingCart,
  Trash2,
  LoaderCircle,
  Package,
} from "lucide-react";
import { createClient } from "../../../../lib/supabase-client";

interface WishlistProduct {
  id: string;
  title: string;
  images: string[];
  pricing: {
    customerRegularPrice: number;
    customerSalePrice: number | null;
  } | null;
}

interface WishlistItem {
  id: string;
  productId: string;
  product: WishlistProduct;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadWishlist = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setItems([]);
        setError("Please sign in to view your wishlist.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load wishlist.");
      }

      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWishlist();
  }, [loadWishlist]);

  const removeItem = async (itemId: string) => {
    setBusyId(itemId);
    setError("");

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Please sign in first.");
      }

      const response = await fetch(`${API_BASE_URL}/api/wishlist/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to remove item.");
      }

      setItems((current) => current.filter((item) => item.id !== itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove item.");
    } finally {
      setBusyId(null);
    }
  };

  const addToCart = async (productId: string, itemId: string) => {
    setBusyId(itemId);
    setError("");

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Please sign in first.");
      }

      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product to cart.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not add item to cart.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const filteredItems = items.filter((item) =>
    item.product?.title
      ?.toLowerCase()
      .includes(searchTerm.trim().toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-[#0F172A]">
            <Heart size={25} className="text-[#F59E0B]" />
            My Wishlist
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Your saved products in one place.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search wishlist products..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20"
            />
          </div>

          <p className="text-sm text-gray-500">
            {items.length} {items.length === 1 ? "product" : "products"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
            {error.toLowerCase().includes("sign in") && (
              <Link href="/sign-in" className="ml-2 font-semibold underline">
                Sign in
              </Link>
            )}
          </div>
        )}

        {/* Wishlist Products */}
        {loading ? (
          <div className="flex justify-center rounded-xl border border-gray-100 bg-white py-16">
            <LoaderCircle className="animate-spin text-[#F59E0B]" size={30} />
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const product = item.product;
              const regularPrice = product.pricing?.customerRegularPrice ?? 0;
              const salePrice = product.pricing?.customerSalePrice;
              const currentPrice =
                salePrice != null && salePrice > 0 ? salePrice : regularPrice;
              const image = product.images?.[0];

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative flex h-52 items-center justify-center bg-gray-50">
                    {image ? (
                      <img
                        src={image}
                        alt={product.title}
                        className="h-full w-full object-contain p-4"
                      />
                    ) : (
                      <Package size={42} className="text-gray-300" />
                    )}

                    <button
                      type="button"
                      onClick={() => void removeItem(item.id)}
                      disabled={busyId === item.id}
                      aria-label="Remove from wishlist"
                      className="absolute right-3 top-3 rounded-full bg-white p-2 text-gray-500 shadow-sm transition hover:text-red-500 disabled:opacity-50"
                    >
                      {busyId === item.id ? (
                        <LoaderCircle size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>

                  <div className="p-4">
                    <h2 className="line-clamp-2 min-h-10 text-sm font-semibold text-[#0F172A]">
                      {product.title}
                    </h2>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-lg font-bold text-[#0F172A]">
                        ৳{currentPrice.toLocaleString("en-BD")}
                      </span>

                      {salePrice != null &&
                        salePrice > 0 &&
                        salePrice < regularPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ৳{regularPrice.toLocaleString("en-BD")}
                          </span>
                        )}
                    </div>

                    <button
                      type="button"
                      onClick={() => void addToCart(item.productId, item.id)}
                      disabled={busyId === item.id}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busyId === item.id ? (
                        <LoaderCircle size={17} className="animate-spin" />
                      ) : (
                        <ShoppingCart size={17} />
                      )}
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      onClick={() => void removeItem(item.id)}
                      disabled={busyId === item.id}
                      className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:text-red-500 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-100 bg-white py-16 text-center">
            <Heart size={45} className="mx-auto mb-3 text-gray-300" />

            <h2 className="text-base font-semibold text-[#0F172A]">
              {items.length === 0
                ? "Your wishlist is empty."
                : "No products found."}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {items.length === 0
                ? "Save products you like to find them here."
                : "Try searching with a different product name."}
            </p>

            {items.length === 0 && (
              <Link
                href="/products"
                className="mt-5 inline-flex items-center rounded-lg bg-[#0F172A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1E293B]"
              >
                Explore Products
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
