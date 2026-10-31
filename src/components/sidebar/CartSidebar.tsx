"use client";
import { toast } from "react-toastify";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Trash2, ShoppingBag, Plus, Minus } from "lucide-react";
import { createClient } from "../../../lib/supabase-client";
import { getValidImageUrl } from "../../../lib/image-util";

interface CartProductPricing {
  customerRegularPrice: number;
  customerSalePrice: number | null;
}

interface CartProduct {
  id: string;
  title: string;
  images: string[];
  pricing: CartProductPricing | null;
}

interface CartApiItem {
  id: string;
  productId: string;
  quantity: number;
  product: CartProduct;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items?: any;
  onCartChanged?: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  onCartChanged,
}: CartSidebarProps) {
  const router = useRouter();
  const supabase = createClient();

  const [items, setItems] = useState<CartApiItem[]>([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  const getAccessToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token || null;
  };

  const loadCart = async () => {
    try {
      setLoading(true);

      const accessToken = await getAccessToken();

      if (!accessToken) {
        setItems([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Cart load করতে সমস্যা হয়েছে");
      }

      if (Array.isArray(data?.items)) {
        setItems(data.items);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Load Cart Error:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    loadCart();
  }, [isOpen]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          quantity: newQuantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.message || "Cart quantity update করতে সমস্যা হয়েছে");
        return;
      }

      await loadCart();
      onCartChanged?.();
    } catch (error) {
      console.error("Update Cart Quantity Error:", error);
    }
  };

  const handleUpdateQuantity = (item: CartApiItem, delta: number) => {
    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) {
      return;
    }

    updateQuantity(item.id, newQuantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.message || "Product remove করতে সমস্যা হয়েছে");
        return;
      }

      setItems((currentItems) => {
        const nextItems = currentItems.filter((item) => item.id !== itemId);
        try {
          const stored = JSON.parse(localStorage.getItem("cart") || "[]");
          if (Array.isArray(stored)) {
            const updated = stored.filter(
              (it: any) =>
                it.id !== itemId &&
                it.productId !== itemId &&
                it.cartItemId !== itemId,
            );
            localStorage.setItem("cart", JSON.stringify(updated));
          }
        } catch (e) {
          console.error("Cart localStorage sync error:", e);
        }
        return nextItems;
      });

      onCartChanged?.();
    } catch (error) {
      console.error("Remove Cart Item Error:", error);
    }
  };

  const handleCheckoutClick = () => {
    onClose();
    router.push("/checkout");
  };

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => {
    const regularPrice = item.product.pricing?.customerRegularPrice ?? 0;

    const salePrice = item.product.pricing?.customerSalePrice;

    const price = salePrice ?? regularPrice;

    return acc + price * item.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="flex w-screen max-w-sm flex-col bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 bg-[#0F172A] px-6 py-4 text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#F59E0B]" />

              <h2 className="text-lg font-bold">
                Shopping Cart ({items.length})
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-gray-300 transition-colors hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {loading ? (
              <div className="py-20 text-center">
                <p className="font-medium text-gray-500">Loading cart...</p>
              </div>
            ) : items.length > 0 ? (
              items.map((item) => {
                const regularPrice =
                  item.product.pricing?.customerRegularPrice ?? 0;

                const salePrice = item.product.pricing?.customerSalePrice;

                const price = salePrice ?? regularPrice;

                const rawImage =
                  item.product.images?.[0] || (item.product as any).image || "";
                const image = getValidImageUrl(rawImage);

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                      {image ? (
                        <img
                          src={image}
                          alt={item.product.title}
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                            const fallback = event.currentTarget
                              .nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="items-center justify-center text-gray-300"
                        style={{ display: image ? "none" : "flex" }}
                      >
                        <ShoppingBag size={22} />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="line-clamp-1 text-sm font-semibold text-[#0F172A]">
                        {item.product.title}
                      </h4>

                      <p className="mt-1 text-sm font-bold text-[#F59E0B]">
                        ৳{price.toLocaleString()}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item, -1)}
                          className="rounded border border-gray-200 bg-white p-1 transition-colors hover:bg-gray-100"
                        >
                          <Minus size={12} />
                        </button>

                        <span className="px-2 text-xs font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item, 1)}
                          className="rounded border border-gray-200 bg-white p-1 transition-colors hover:bg-gray-100"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-gray-400 transition-colors hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center">
                <ShoppingBag size={48} className="mx-auto mb-3 text-gray-300" />

                <p className="font-medium text-gray-500">Your cart is empty</p>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Subtotal
                </span>

                <span className="text-lg font-bold text-[#0F172A]">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckoutClick}
                className="w-full cursor-pointer rounded-xl bg-[#F59E0B] py-3 font-bold text-white shadow-sm transition-colors hover:bg-[#d97706]"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
