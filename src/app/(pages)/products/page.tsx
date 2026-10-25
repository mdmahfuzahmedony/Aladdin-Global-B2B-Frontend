"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  X,
  RotateCcw,
} from "lucide-react";
import ProductCard from "@/components/cards/product/New-Arrivals-ProductCartd";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

const PRODUCTS_PER_PAGE = 16;

type Product = {
  id: string;
  title: string;
  slug: string;
  images?: string[] | null;

  category?: {
    id?: string;
    name?: string;
  } | null;

  pricing?: {
    customerRegularPrice?: number | string | null;
    customerSalePrice?: number | string | null;
  } | null;

  attributes?: {
    colors?: {
      color?: string;
      images?: string[];
      sizes?: {
        size?: string;
        stock?: string | number;
      }[];
    }[];
  } | null;

  topRatedAttribute?: {
    averageRating?: number | string;
    totalReviews?: number | string;
  } | null;

  newArrivalAttribute?: {
    badgeText?: string | null;
  } | null;

  flashSaleAttribute?: {
    flashSalePrice?: number | string;
    flashSaleStock?: number | string;
    discountBadge?: string | null;
  } | null;

  [key: string]: unknown;
};

function FilterSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-semibold text-[#12233F] hover:bg-gray-50"
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function getRegularPrice(product: Product): number {
  return Number(product.pricing?.customerRegularPrice ?? 0);
}

function getSalePrice(product: Product): number | null {
  const value = product.pricing?.customerSalePrice;

  if (value == null || value === "") return null;

  const price = Number(value);

  return Number.isFinite(price) && price > 0 ? price : null;
}

function getDisplayPrice(product: Product): number {
  const flashPrice = product.flashSaleAttribute?.flashSalePrice;

  if (flashPrice != null && Number(flashPrice) > 0) {
    return Number(flashPrice);
  }

  return getSalePrice(product) ?? getRegularPrice(product);
}

function getProductImage(product: Product): string {
  const directImage = product.images?.find(
    (image) => typeof image === "string" && image.trim() !== "",
  );

  if (directImage) return directImage;

  for (const color of product.attributes?.colors ?? []) {
    const colorImage = color.images?.find(
      (image) => typeof image === "string" && image.trim() !== "",
    );

    if (colorImage) return colorImage;
  }

  return "";
}

function formatPrice(price: number): string {
  return `৳ ${price.toLocaleString("en-BD")}`;
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white p-3">
      <div className="aspect-square animate-pulse rounded-lg bg-gray-200" />

      <div className="mt-4 space-y-3">
        <div className="h-4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") ?? "";
  const placement = searchParams.get("type") ?? "";
  const urlCategory = searchParams.get("category") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState(urlCategory);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setSearch(urlSearch);
    setCategory(urlCategory);
  }, [urlSearch, urlCategory]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (placement) params.set("type", placement);
      if (urlSearch.trim()) params.set("search", urlSearch.trim());

      const query = params.toString();
      const url = `${API_BASE_URL}/api/products${query ? `?${query}` : ""}`;

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message || result?.error || "প্রোডাক্ট লোড করা যায়নি।",
        );
      }

      const list = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.products)
          ? result.products
          : Array.isArray(result)
            ? result
            : [];

      setProducts(list);
    } catch (err) {
      console.error("Products API error:", err);
      setProducts([]);
      setError(
        err instanceof Error
          ? err.message
          : "প্রোডাক্ট লোড করার সময় সমস্যা হয়েছে।",
      );
    } finally {
      setLoading(false);
    }
  }, [placement, urlSearch]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();

    products.forEach((product) => {
      const name = product.category?.name?.trim();

      if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
    });

    return Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [products]);

  const availableColors = useMemo(() => {
    const colors = new Set<string>();

    products.forEach((product) => {
      product.attributes?.colors?.forEach((item) => {
        if (item.color?.trim()) colors.add(item.color.trim());
      });
    });

    return Array.from(colors).sort();
  }, [products]);

  const priceBounds = useMemo(() => {
    const prices = products
      .map(getDisplayPrice)
      .filter((price) => Number.isFinite(price) && price >= 0);

    if (!prices.length) return { min: 0, max: 100000 };

    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (category) {
      list = list.filter(
        (product) =>
          product.category?.id === category ||
          product.category?.name?.toLowerCase() === category.toLowerCase(),
      );
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      list = list.filter((product) =>
        product.title.toLowerCase().includes(query),
      );
    }

    if (minPrice.trim() !== "") {
      const minimum = Number(minPrice);

      if (Number.isFinite(minimum)) {
        list = list.filter((product) => getDisplayPrice(product) >= minimum);
      }
    }

    if (maxPrice.trim() !== "") {
      const maximum = Number(maxPrice);

      if (Number.isFinite(maximum)) {
        list = list.filter((product) => getDisplayPrice(product) <= maximum);
      }
    }

    if (selectedColors.length) {
      list = list.filter((product) =>
        product.attributes?.colors?.some((item) =>
          selectedColors.includes(item.color ?? ""),
        ),
      );
    }

    if (sortBy === "price-low") {
      list.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
    } else if (sortBy === "price-high") {
      list.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
    } else if (sortBy === "name") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [products, category, search, minPrice, maxPrice, selectedColors, sortBy]);

  // Filter/search change হলে প্রথম পেজে ফিরে যাবে।
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, minPrice, maxPrice, selectedColors, placement]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startProduct =
    filteredProducts.length === 0
      ? 0
      : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;

  const endProduct = Math.min(
    currentPage * PRODUCTS_PER_PAGE,
    filteredProducts.length,
  );

  const sectionTitle = placement
    ? ({
        "best-sellers": "Best Sellers",
        "new-arrivals": "New Arrivals",
        "flash-sale": "Flash Sale",
        "top-rated": "Top Rated Products",
        featured: "Featured Products",
        trusted: "Trusted Products",
      }[placement] ?? placement)
    : category
      ? (categories.find(([name]) => name === category)?.[0] ?? category)
      : "All Products";

  const clearFilters = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedColors([]);
    setSearch("");
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) params.set("search", search.trim());
    else params.delete("search");

    const query = params.toString();
    router.push(`/products${query ? `?${query}` : ""}`);
  };

  const toggleColor = (color: string) => {
    setSelectedColors((current) =>
      current.includes(color)
        ? current.filter((item) => item !== color)
        : [...current, color],
    );
  };

  const filters = (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-2 font-bold text-[#12233F]">
          <SlidersHorizontal size={17} />
          Filters
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
        >
          <RotateCcw size={13} />
          Clear all
        </button>
      </div>

      <FilterSection title="Price Range" defaultOpen>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Minimum price</span>
            <span>Maximum price</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label>
              <span className="mb-1 block text-[10px] font-semibold uppercase text-gray-400">
                Min price (৳)
              </span>
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                placeholder={String(priceBounds.min)}
                className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-[#D6A419]"
              />
            </label>

            <label>
              <span className="mb-1 block text-[10px] font-semibold uppercase text-gray-400">
                Max price (৳)
              </span>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder={String(priceBounds.max)}
                className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-[#D6A419]"
              />
            </label>
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatPrice(priceBounds.min)}</span>
            <span>{formatPrice(priceBounds.max)}</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Category" defaultOpen>
        {categories.length ? (
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {categories.map(([name, count]) => (
              <label
                key={name}
                className="flex cursor-pointer items-center justify-between gap-2 text-sm text-gray-700"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <input
                    type="radio"
                    name="product-category"
                    checked={category === name}
                    onChange={() => setCategory(name)}
                    className="accent-[#12233F]"
                  />
                  <span className="truncate">{name}</span>
                </span>
                <span className="text-xs text-gray-400">{count}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">কোনো category পাওয়া যায়নি।</p>
        )}

        {category && (
          <button
            type="button"
            onClick={() => setCategory("")}
            className="mt-3 text-xs text-blue-600 hover:underline"
          >
            Remove category
          </button>
        )}
      </FilterSection>

      <FilterSection title="Brand">
        <p className="text-xs leading-5 text-gray-400">
          Brand filter চালু করতে API data-তে brand field প্রয়োজন।
        </p>
      </FilterSection>

      <FilterSection title="Color">
        {availableColors.length ? (
          <div className="space-y-3">
            {availableColors.map((color) => (
              <label
                key={color}
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => toggleColor(color)}
                  className="accent-[#12233F]"
                />
                {color}
              </label>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">Color data পাওয়া যায়নি।</p>
        )}
      </FilterSection>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f5f6fa]">
      <div className="mx-auto max-w-[1500px] px-3 py-5 sm:px-5 lg:px-8">
        <div className="mb-4 flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-blue-600 hover:underline"
          >
            Home
          </button>
          <ChevronRight size={15} className="text-gray-400" />
          <span className="font-medium text-gray-600">{sectionTitle}</span>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[256px_minmax(0,1fr)]">
          <aside className="hidden lg:block">{filters}</aside>

          <section id="products-grid" className="min-w-0">
            {/* Heading + product count + filters + sort */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold text-[#12233F] sm:text-2xl">
                  {sectionTitle}
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  {loading
                    ? "Loading products..."
                    : `Showing ${startProduct}-${endProduct} of ${filteredProducts.length} products`}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-[#12233F] lg:hidden"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </button>

                <label className="flex h-10 items-center rounded-lg border border-gray-200 bg-white px-2 sm:px-3">
                  <span className="mr-2 hidden text-sm text-gray-600 xl:inline">
                    Sort by:
                  </span>

                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="max-w-[135px] bg-transparent text-sm text-gray-700 outline-none sm:max-w-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </label>
              </div>
            </div>

            <form
              onSubmit={handleSearch}
              className="mb-5 flex gap-2 rounded-xl border border-gray-200 bg-white p-3"
            >
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm outline-none focus:border-[#D6A419] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-[#12233F] px-5 text-sm font-semibold text-white hover:bg-[#1b355b]"
              >
                Search
              </button>
            </form>

            {(category ||
              minPrice ||
              maxPrice ||
              selectedColors.length > 0) && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {category && (
                  <button
                    type="button"
                    onClick={() => setCategory("")}
                    className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs text-gray-700 ring-1 ring-gray-200"
                  >
                    Category: {category} <X size={13} />
                  </button>
                )}

                {(minPrice || maxPrice) && (
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                    }}
                    className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs text-gray-700 ring-1 ring-gray-200"
                  >
                    Price: {minPrice || "Any"} – {maxPrice || "Any"}
                    <X size={13} />
                  </button>
                )}

                {selectedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => toggleColor(color)}
                    className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs text-gray-700 ring-1 ring-gray-200"
                  >
                    {color} <X size={13} />
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 xl:gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
                <p className="font-semibold text-red-600">
                  প্রোডাক্ট লোড করা যায়নি
                </p>
                <p className="mt-2 text-sm text-gray-500">{error}</p>
                <button
                  type="button"
                  onClick={() => void fetchProducts()}
                  className="mt-4 rounded-lg bg-[#12233F] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && paginatedProducts.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 xl:gap-4">
                  {paginatedProducts.map((product) => {
                    const image = getProductImage(product);
                    const isFlashSale = Boolean(product.flashSaleAttribute);
                    const regularPrice = getRegularPrice(product);
                    const salePrice = getSalePrice(product);

                    return (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        slug={product.slug}
                        title={product.title}
                        image={image}
                        price={
                          isFlashSale
                            ? regularPrice
                            : (salePrice ?? regularPrice)
                        }
                        rating={Number(
                          product.topRatedAttribute?.averageRating ?? 0,
                        )}
                        reviewsCount={Number(
                          product.topRatedAttribute?.totalReviews ?? 0,
                        )}
                        moq={
                          product.attributes?.colors?.[0]?.sizes?.[0]?.size ||
                          "1"
                        }
                        isNew={Boolean(product.newArrivalAttribute)}
                        discountBadge={
                          isFlashSale
                            ? product.flashSaleAttribute?.discountBadge
                            : product.newArrivalAttribute?.badgeText
                        }
                        flashSalePrice={
                          product.flashSaleAttribute?.flashSalePrice != null
                            ? Number(product.flashSaleAttribute.flashSalePrice)
                            : undefined
                        }
                        flashSaleStock={
                          product.flashSaleAttribute?.flashSaleStock != null
                            ? Number(product.flashSaleAttribute.flashSaleStock)
                            : undefined
                        }
                        isFlashSale={isFlashSale}
                      />
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <nav
                    aria-label="Product pagination"
                    className="mt-8 flex flex-wrap items-center justify-center gap-2"
                  >
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-[#12233F] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1,
                      )
                      .reduce<(number | "...")[]>(
                        (pages, page, index, allPages) => {
                          if (index > 0 && page - allPages[index - 1] > 1) {
                            pages.push("...");
                          }

                          pages.push(page);
                          return pages;
                        },
                        [],
                      )
                      .map((page, index) =>
                        page === "..." ? (
                          <span
                            key={`dots-${index}`}
                            className="px-1 text-gray-400"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={page}
                            type="button"
                            aria-current={
                              currentPage === page ? "page" : undefined
                            }
                            onClick={() => {
                              setCurrentPage(page);
                              document
                                .getElementById("products-grid")
                                ?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                            }}
                            className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold ${
                              currentPage === page
                                ? "border-[#12233F] bg-[#12233F] text-white"
                                : "border-gray-200 bg-white text-gray-700 hover:border-[#12233F]"
                            }`}
                          >
                            {page}
                          </button>
                        ),
                      )}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-[#12233F] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </nav>
                )}

                <p className="mt-3 text-center text-xs text-gray-400">
                  Page {currentPage} of {Math.max(totalPages, 1)}
                </p>
              </>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-16 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Search size={22} className="text-gray-400" />
                </div>
                <h2 className="font-semibold text-gray-800">
                  কোনো প্রোডাক্ট পাওয়া যায়নি
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  অন্য নাম দিয়ে সার্চ করো অথবা ফিল্টার পরিবর্তন করো।
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-lg bg-[#12233F] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <div className="absolute inset-y-0 left-0 w-[min(340px,88vw)] overflow-y-auto bg-[#f5f6fa] p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#12233F]">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-lg bg-white p-2"
              >
                <X size={20} />
              </button>
            </div>

            {filters}

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-4 w-full rounded-lg bg-[#12233F] py-3 text-sm font-semibold text-white"
            >
              Show {filteredProducts.length} Products
            </button>
          </div>
        </div>
      )}
    </main>
  );
}


export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f6fa] p-8 text-center text-slate-500">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
