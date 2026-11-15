"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, Package, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001";

interface SearchProduct {
  id: string;
  title: string;
  slug: string;
  images?: string[];
  category?: {
    name?: string;
  };
  pricing?: {
    customerRegularPrice?: number | string | null;
    customerSalePrice?: number | string | null;
  };
  flashSaleAttribute?: {
    flashSalePrice?: number | string | null;
  };
}

interface NavbarSearchProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

const PLACEHOLDERS_BN = [
  "পণ্য, ব্র্যান্ড বা ক্যাটাগরি খুঁজুন...",
  "খুঁজুন 'মিনিকেট চাল' বা 'Miniket Rice'...",
  "খুঁজুন 'রূপচাঁদা সয়াবিন তেল'...",
  "খুঁজুন 'খাঁটি গাওয়া ঘি' (Cow Ghee)...",
  "খুঁজুন 'সুন্দরবনের খাঁটি মধু'...",
  "খুঁজুন 'ইস্পাহানি চা পাতা'...",
  "খুঁজুন 'ম্যাগি নুডলস' (Maggi)...",
  "খুঁজুন 'চিনিগুঁড়া পোলাও চাল'...",
  "খুঁজুন 'প্রাণ খাঁটি সরিষার তেল'...",
];

const PLACEHOLDERS_EN = [
  "Search products, brands or categories...",
  "Search for 'Miniket Rice' (মিনিকেট চাল)...",
  "Search for 'Soybean Oil' (সয়াবিন তেল)...",
  "Search for 'Pure Cow Ghee' (গাওয়া ঘি)...",
  "Search for 'Natural Honey' (মধু)...",
  "Search for 'Mirzapore Tea' (চা পাতা)...",
  "Search for 'Maggi Noodles' (নুডলস)...",
  "Search for 'Aromatic Chinigura Rice'...",
  "Search for 'Mustard Oil' (সরিষার তেল)...",
];

export function NavbarSearch({
  variant = "desktop",
  className = "",
}: NavbarSearchProps) {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Animated scrolling placeholder state
  const placeholderList = language === "bn" ? PLACEHOLDERS_BN : PLACEHOLDERS_EN;
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Cycle placeholder text every 2.8s
  useEffect(() => {
    setPlaceholderIndex(0);
    setIsTransitioning(true);
  }, [language]);

  useEffect(() => {
    if (query) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setPlaceholderIndex((prev) => prev + 1);
    }, 2800);

    return () => clearInterval(interval);
  }, [query, placeholderList.length]);

  // Seamless infinite loop handler
  useEffect(() => {
    if (placeholderIndex === placeholderList.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setPlaceholderIndex(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [placeholderIndex, placeholderList.length]);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Fetch search suggestions
  const performSearch = useCallback(async (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      setResults([]);
      setTotalCount(0);
      setLoading(false);
      setIsOpen(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const url = `${API_BASE_URL}/api/products?search=${encodeURIComponent(
        trimmed,
      )}&limit=6`;

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const json = await response.json();
      const items: SearchProduct[] = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json)
          ? json
          : [];

      setResults(items);
      setTotalCount(typeof json?.total === "number" ? json.total : items.length);
      setIsOpen(true);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Navbar search error:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search on query change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!val.trim()) {
      setResults([]);
      setTotalCount(0);
      setIsOpen(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      void performSearch(val);
    }, 250);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setTotalCount(0);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsOpen(false);
    window.location.href = `/products?search=${encodeURIComponent(trimmed)}`;
  };

  const handleSelectProduct = (slug: string) => {
    setIsOpen(false);
    router.push(`/products/${encodeURIComponent(slug)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${
        variant === "desktop" ? "flex-1 min-w-0" : "w-full"
      } ${className}`}
    >
      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className={`flex min-w-0 w-full overflow-hidden rounded-md border border-white/20 bg-white transition focus-within:border-[#D6A419] focus-within:ring-1 focus-within:ring-[#D6A419] ${
          variant === "desktop" ? "h-[42px]" : "h-10 rounded-lg"
        }`}
      >
        <div className="relative flex flex-1 items-center min-w-0">
          {/* ANIMATED SCROLLING PLACEHOLDER (Smooth vertical reel) */}
          {!query && (
            <div
              className={`pointer-events-none absolute inset-y-0 left-0 right-8 flex items-center overflow-hidden select-none ${
                variant === "desktop" ? "px-4" : "px-3"
              }`}
            >
              <div className="h-6 w-full overflow-hidden relative">
                <div
                  className={`flex flex-col ${
                    isTransitioning
                      ? "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      : ""
                  }`}
                  style={{
                    transform: `translateY(-${placeholderIndex * 24}px)`,
                  }}
                >
                  {[...placeholderList, placeholderList[0]].map((text, idx) => (
                    <div
                      key={idx}
                      className="h-6 flex items-center text-slate-400 text-xs sm:text-sm truncate select-none"
                    >
                      <span className="truncate">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <input
            type="search"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (query.trim() && (results.length > 0 || loading)) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            aria-label={t("search") || "Search products"}
            className={`w-full bg-transparent text-slate-700 outline-none relative z-10 ${
              variant === "desktop"
                ? "px-4 text-sm"
                : "px-3 text-xs sm:text-sm"
            }`}
          />

          {/* LOADING SPINNER / CLEAR BUTTON */}
          <div className="flex items-center gap-1 pr-2">
            {loading && (
              <Loader2
                size={16}
                className="animate-spin text-slate-400 shrink-0"
              />
            )}
            {query.trim() && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition shrink-0"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          aria-label={t("search") || "Search"}
          className={`flex shrink-0 items-center justify-center bg-[#D6A419] text-[#12233F] transition hover:bg-[#c69a12] active:scale-95 ${
            variant === "desktop" ? "w-[55px]" : "w-10"
          }`}
        >
          <Search size={variant === "desktop" ? 20 : 18} />
        </button>
      </form>

      {/* LIVE SEARCH RESULTS DROPDOWN */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-[120] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150">
          {loading && results.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-500">
              <Loader2 size={16} className="animate-spin text-[#D6A419]" />
              <span>পণ্য খোঁজা হচ্ছে...</span>
            </div>
          ) : results.length > 0 ? (
            <div>
              {/* RESULTS HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-3.5 py-2 text-[11px] font-semibold text-slate-500">
                <span>
                  {language === "bn" ? "প্রোডাক্ট সাজেশন" : "Matching Products"}
                </span>
                <span className="text-[#D6A419] font-bold">
                  {totalCount} {language === "bn" ? "টি পণ্য" : "items"}
                </span>
              </div>

              {/* PRODUCTS LIST */}
              <div className="max-h-[340px] divide-y divide-slate-100 overflow-y-auto overscroll-contain">
                {results.map((item) => {
                  const regularPrice = Number(
                    item.pricing?.customerRegularPrice ?? 0,
                  );
                  const salePrice = Number(
                    item.flashSaleAttribute?.flashSalePrice ??
                      item.pricing?.customerSalePrice ??
                      regularPrice,
                  );
                  const image =
                    item.images && item.images.length > 0
                      ? item.images[0]
                      : "";

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectProduct(item.slug)}
                      className="group flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition hover:bg-amber-50/50"
                    >
                      {/* THUMBNAIL */}
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
                        {image ? (
                          <img
                            src={image}
                            alt={item.title}
                            className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                          />
                        ) : (
                          <Package size={20} className="text-slate-400" />
                        )}
                      </div>

                      {/* INFO */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {item.category?.name && (
                            <span className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600">
                              {item.category.name}
                            </span>
                          )}
                        </div>

                        <p className="line-clamp-1 text-xs sm:text-sm font-semibold text-[#12233f] group-hover:text-[#b38610] transition-colors">
                          {item.title}
                        </p>

                        {/* PRICE */}
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-xs font-black text-[#f95738]">
                            ৳{salePrice.toLocaleString("en-BD")}
                          </span>
                          {salePrice < regularPrice && regularPrice > 0 && (
                            <span className="text-[10px] text-slate-400 line-through">
                              ৳{regularPrice.toLocaleString("en-BD")}
                            </span>
                          )}
                        </div>
                      </div>

                      <ArrowRight
                        size={14}
                        className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#D6A419]"
                      />
                    </button>
                  );
                })}
              </div>

              {/* FOOTER: VIEW ALL */}
              <div className="border-t border-slate-100 bg-slate-50 p-2 text-center">
                <Link
                  href={`/products?search=${encodeURIComponent(query.trim())}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-[#12233F] py-2 text-xs font-bold text-white transition hover:bg-[#1a345e] active:scale-98"
                >
                  <span>
                    {language === "bn"
                      ? `"${query}" এর সবগুলো ফলাফল দেখুন (${totalCount})`
                      : `View all results for "${query}" (${totalCount})`}
                  </span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ) : (
            /* NO RESULTS */
            <div className="p-6 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Search size={20} />
              </div>
              <p className="text-xs font-bold text-slate-700">
                {language === "bn"
                  ? `"${query}" দিয়ে কোনো পণ্য খুঁজে পাওয়া যায়নি`
                  : `No products found for "${query}"`}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {language === "bn"
                  ? "বানান পরীক্ষা করুন অথবা বাংলা বা ইংরেজিতে অন্য শব্দ দিয়ে খুঁজুন (যেমন: তেল, rice, ঘি, honey)"
                  : "Check spelling or search in Bangla or English (e.g. oil, চাল, ghee, মধু)"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
