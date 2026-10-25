"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";

export type CompareProduct = {
  id: string;
  slug?: string;
  title: string;
  image?: string;
  price: number;
  regularPrice?: number | null;
  category?: string | null;
  brand?: string | null;
  vendorName?: string | null;
  storeName?: string | null;
  vendorId?: string | null;
  rating?: number;
  reviewsCount?: number;
  stockQuantity?: number;
  stock?: number;
  inStock?: boolean;
  moq?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  sku?: string | null;
  attributes?: Record<string, any> | null;
};

export interface CompareContextType {
  items: CompareProduct[];
  compareItems: CompareProduct[];
  compareCount: number;
  isHydrated: boolean;
  addToCompare: (product: CompareProduct) => boolean;
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  toggleCompare: (product: CompareProduct) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE_ITEMS = 4;
const STORAGE_KEY = "aladdin_compare_products_v1";

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [compareItems, setCompareItems] = useState<CompareProduct[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCompareItems(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load compare list from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareItems));
    } catch (e) {
      console.error("Failed to save compare list to localStorage:", e);
    }
  }, [compareItems, isHydrated]);

  const isInCompare = useCallback(
    (id: string) => {
      return compareItems.some((item) => item.id === id);
    },
    [compareItems]
  );

  const addToCompare = useCallback(
    (product: CompareProduct): boolean => {
      if (compareItems.some((item) => item.id === product.id)) {
        toast.info("পণ্যটি ইতিমধ্যে তুলনার তালিকায় রয়েছে।");
        return false;
      }

      if (compareItems.length >= MAX_COMPARE_ITEMS) {
        toast.warning(
          `আপনি একসাথে সর্বোচ্চ ${MAX_COMPARE_ITEMS}টি পণ্য তুলনা করতে পারবেন।`
        );
        return false;
      }

      setCompareItems((prev) => [...prev, product]);
      toast.success("পণ্যটি তুলনার তালিকায় যোগ করা হয়েছে!");
      return true;
    },
    [compareItems]
  );

  const removeFromCompare = useCallback((id: string) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== id));
    toast.info("পণ্যটি তুলনার তালিকা থেকে সরানো হয়েছে।");
  }, []);

  const toggleCompare = useCallback(
    (product: CompareProduct) => {
      if (compareItems.some((item) => item.id === product.id)) {
        removeFromCompare(product.id);
      } else {
        addToCompare(product);
      }
    },
    [compareItems, addToCompare, removeFromCompare]
  );

  const clearCompare = useCallback(() => {
    setCompareItems([]);
    toast.info("তুলনার তালিকা খালি করা হয়েছে।");
  }, []);

  const value = useMemo(
    () => ({
      items: compareItems,
      compareItems,
      compareCount: compareItems.length,
      isHydrated,
      addToCompare,
      removeFromCompare,
      isInCompare,
      toggleCompare,
      clearCompare,
    }),
    [
      compareItems,
      isHydrated,
      addToCompare,
      removeFromCompare,
      isInCompare,
      toggleCompare,
      clearCompare,
    ]
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
