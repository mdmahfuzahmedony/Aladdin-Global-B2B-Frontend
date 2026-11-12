"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { createClient } from "../../lib/supabase-client";

export type WishlistProduct = {
  id: string;
  slug?: string;
  title: string;
  image?: string;
  price?: number;
  regularPrice?: number;
  [key: string]: any;
};

export interface WishlistContextType {
  items: WishlistProduct[];
  wishlistCount: number;
  isHydrated: boolean;
  isInWishlist: (id: string) => boolean;
  addToWishlist: (product: WishlistProduct) => Promise<boolean>;
  removeFromWishlist: (id: string) => Promise<void>;
  toggleWishlist: (product: WishlistProduct) => Promise<void>;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "aladdin_wishlist_products_v1";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load wishlist from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage:", e);
    }
  }, [items, isHydrated]);

  // Sync with backend if user has session
  useEffect(() => {
    if (!isHydrated) return;
    const syncBackend = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) return;

        const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        });

        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.items)) {
          const backendItems: WishlistProduct[] = data.items.map((i: any) => ({
            id: String(i.productId || i.product?.id),
            title: i.product?.title || "",
            image: i.product?.images?.[0] || "",
            price: Number(
              i.product?.pricing?.customerSalePrice ??
                i.product?.pricing?.customerRegularPrice ??
                0
            ),
          }));

          setItems((prev) => {
            const map = new Map<string, WishlistProduct>();
            prev.forEach((item) => map.set(item.id, item));
            backendItems.forEach((item) => map.set(item.id, item));
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.error("Backend wishlist sync error:", err);
      }
    };

    void syncBackend();
  }, [isHydrated]);

  const isInWishlist = useCallback(
    (id: string) => {
      return items.some((item) => String(item.id) === String(id));
    },
    [items]
  );

  const addToWishlist = useCallback(
    async (product: WishlistProduct): Promise<boolean> => {
      if (items.some((item) => String(item.id) === String(product.id))) {
        return false;
      }

      setItems((prev) => [...prev, product]);
      toast.success("পণ্যটি Wishlist-এ যোগ করা হয়েছে!");

      // Sync backend
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          await fetch(`${API_BASE_URL}/api/wishlist`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ productId: product.id }),
          });
        }
      } catch (err) {
        console.error("Sync add to wishlist error:", err);
      }

      return true;
    },
    [items]
  );

  const removeFromWishlist = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
    toast.info("পণ্যটি Wishlist থেকে সরানো হয়েছে।");

    // Sync backend
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        await fetch(`${API_BASE_URL}/api/wishlist/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
      }
    } catch (err) {
      console.error("Sync remove from wishlist error:", err);
    }
  }, []);

  const toggleWishlist = useCallback(
    async (product: WishlistProduct) => {
      if (items.some((item) => String(item.id) === String(product.id))) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    },
    [items, addToWishlist, removeFromWishlist]
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistCount: items.length,
        isHydrated,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
