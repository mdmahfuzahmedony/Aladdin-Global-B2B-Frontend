"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  Store,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import ProductCard from "@/components/cards/product/New-Arrivals-ProductCartd";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const PRODUCTS_PER_PAGE = 16;

type VendorLocation = {
  division?: string | null;
  district?: string | null;
  upazila?: string | null;
  area?: string | null;
  fullAddress?: string | null;
};

type VendorSettings = {
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
};

type VendorUser = {
  id: string;
  fullName?: string | null;
  phone?: string | null;
  email?: string | null;
};

type Vendor = {
  id: string;
  storeName: string;
  businessCategory?: string | null;
  status: string;
  location?: VendorLocation | null;
  settings?: VendorSettings | null;
  user?: VendorUser | null;
};

type ProductImage = string | { url?: string | null };

type Product = {
  id: string;
  title: string;
  sku: string;
  slug: string;
  shortDescription?: string | null;
  stockQuantity: number;
  images?: ProductImage[];
  createdAt: string;
  updatedAt: string;

  attributes?: {
    colors?: {
      images?: string[];
      sizes?: {
        sku?: string;
        size?: string;
        stock?: string | number;
      }[];
    }[];
  } | null;

  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;

  pricing?: {
    customerRegularPrice: number | string;
    customerSalePrice?: number | string | null;
  } | null;

  topRatedAttribute?: {
    averageRating?: number | null;
    totalReviews?: number | null;
  } | null;

  newArrivalAttribute?: {
    badgeText?: string | null;
  } | null;

  flashSaleAttribute?: {
    flashSalePrice?: number | string | null;
    flashSaleStock?: number | string | null;
    discountBadge?: string | null;
  } | null;
};

type ApiResponse = {
  success: boolean;
  data?: {
    vendor: Vendor;
    products: Product[];
  };
  error?: string;
  message?: string;
};

type Props = {
  params: Promise<{
    vendorId: string;
  }>;
};

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="aspect-square animate-pulse bg-slate-100" />
      <div className="space-y-3 p-3 sm:p-4">
        <div className="h-4 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 h-6 w-1/2 animate-pulse rounded bg-slate-100" />
        <div className="h-10 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function VendorStorePage({ params }: Props) {
  const router = useRouter();
  const { vendorId } = React.use(params);

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("POSITION");
  const [currentPage, setCurrentPage] = useState(1);

  // Load seller information and all seller products.
  const fetchVendorStore = async (showRefreshLoader = false) => {
    if (!vendorId) {
      setError("Vendor ID পাওয়া যায়নি।");
      setLoading(false);
      return;
    }

    try {
      setError("");

      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_URL}/api/vendors/store/${vendorId}`, {
        method: "GET",
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          `Server returned ${response.status} ${response.statusText}`,
        );
      }

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            result.message ||
            "Seller-এর প্রোডাক্ট লোড করা যায়নি।",
        );
      }

      if (!result.data) {
        throw new Error("Seller store data পাওয়া যায়নি।");
      }

      setVendor(result.data.vendor);
      setProducts(result.data.products || []);
      setCurrentPage(1);
    } catch (err: unknown) {
      console.error("Vendor Store Fetch Error:", err);

      setError(
        err instanceof Error ? err.message : "প্রোডাক্ট লোড করতে সমস্যা হয়েছে।",
      );

      setVendor(null);
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchVendorStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  // Get categories and count products in each category.
  const categories = useMemo(() => {
    const categoryMap = new Map<
      string,
      { id: string; name: string; count: number }
    >();

    products.forEach((product) => {
      if (!product.category) return;

      const existing = categoryMap.get(product.category.id);

      if (existing) {
        existing.count += 1;
      } else {
        categoryMap.set(product.category.id, {
          id: product.category.id,
          name: product.category.name,
          count: 1,
        });
      }
    });

    return Array.from(categoryMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [products]);

  // Get the effective customer price.
  function getProductPrice(product: Product) {
    if (!product.pricing) return null;

    const regularPrice = Number(product.pricing.customerRegularPrice);

    const saleValue = product.pricing.customerSalePrice;
    const salePrice =
      saleValue !== null && saleValue !== undefined ? Number(saleValue) : null;

    if (
      salePrice !== null &&
      Number.isFinite(salePrice) &&
      salePrice > 0 &&
      salePrice < regularPrice
    ) {
      return {
        current: salePrice,
        old: regularPrice,
      };
    }

    if (Number.isFinite(regularPrice) && regularPrice >= 0) {
      return {
        current: regularPrice,
        old: null,
      };
    }

    return null;
  }

  function getCurrentPrice(product: Product) {
    const flashPrice = Number(product.flashSaleAttribute?.flashSalePrice);

    if (
      product.flashSaleAttribute?.flashSalePrice != null &&
      Number.isFinite(flashPrice) &&
      flashPrice > 0
    ) {
      return flashPrice;
    }

    return getProductPrice(product)?.current ?? 0;
  }

  function getDiscount(product: Product) {
    const regularPrice = Number(product.pricing?.customerRegularPrice);

    const currentPrice = getCurrentPrice(product);

    if (
      !Number.isFinite(regularPrice) ||
      regularPrice <= 0 ||
      currentPrice <= 0 ||
      currentPrice >= regularPrice
    ) {
      return null;
    }

    return Math.round(((regularPrice - currentPrice) / regularPrice) * 100);
  }

  // Product image fallback: direct images first, variant images next.
  function getProductImage(product: Product): string {
    const directImage = product.images?.find((image) => {
      if (typeof image === "string") {
        return image.trim().length > 0;
      }

      return Boolean(image?.url?.trim());
    });

    if (typeof directImage === "string") {
      return directImage;
    }

    if (directImage && typeof directImage === "object") {
      return directImage.url || "";
    }

    for (const color of product.attributes?.colors || []) {
      const variantImage = color.images?.find(
        (url) => typeof url === "string" && url.trim().length > 0,
      );

      if (variantImage) return variantImage;
    }

    return "";
  }

  // Search, category filter, and sorting.
  const filteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesSearch =
        !searchValue ||
        product.title?.toLowerCase().includes(searchValue) ||
        product.sku?.toLowerCase().includes(searchValue) ||
        product.category?.name?.toLowerCase().includes(searchValue);

      const matchesCategory =
        categoryFilter === "ALL" || product.category?.id === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "PRICE_LOW":
          return getCurrentPrice(a) - getCurrentPrice(b);

        case "PRICE_HIGH":
          return getCurrentPrice(b) - getCurrentPrice(a);

        case "NAME":
          return a.title.localeCompare(b.title);

        case "NEWEST":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        case "POSITION":
        default:
          return 0;
      }
    });
  }, [products, search, categoryFilter, sortBy]);

  // Reset pagination when search, category, or sorting changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, safeCurrentPage]);

  const vendorLocation = useMemo(() => {
    if (!vendor?.location) return "";

    const parts = [
      vendor.location.area,
      vendor.location.upazila,
      vendor.location.district,
      vendor.location.division,
    ].filter(Boolean);

    return parts.length > 0
      ? parts.join(", ")
      : vendor.location.fullAddress || "";
  }, [vendor]);

  const pageStart =
    filteredProducts.length === 0
      ? 0
      : (safeCurrentPage - 1) * PRODUCTS_PER_PAGE + 1;

  const pageEnd = Math.min(
    safeCurrentPage * PRODUCTS_PER_PAGE,
    filteredProducts.length,
  );

  const visiblePages = useMemo(() => {
    const start = Math.max(1, safeCurrentPage - 2);
    const end = Math.min(totalPages, safeCurrentPage + 2);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [safeCurrentPage, totalPages]);

  function goToPage(page: number) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Loading skeleton.
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex animate-pulse items-center gap-4">
              <div className="h-16 w-16 shrink-0 rounded-xl bg-slate-200" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-48 rounded bg-slate-200" />
                <div className="h-3 w-64 max-w-full rounded bg-slate-100" />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
            <aside className="hidden rounded-xl border border-slate-200 bg-white p-4 lg:block">
              <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="mt-5 h-4 animate-pulse rounded bg-slate-100"
                />
              ))}
            </aside>

            <section>
              <div className="h-11 animate-pulse rounded-lg bg-slate-200" />
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                {Array.from({ length: 16 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    );
  }

  // Error state.
  if (error || !vendor) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertTriangle size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#12233f]">
            Seller Store Not Found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error || "এই seller store খুঁজে পাওয়া যায়নি।"}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void fetchVendorStore()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#12233f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1b3155]"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        {/* Seller information */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {vendor.settings?.logoUrl ? (
                  <img
                    src={vendor.settings.logoUrl}
                    alt={vendor.storeName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store size={25} className="text-[#12233f]" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-lg font-bold text-[#12233f] sm:text-xl">
                    {vendor.storeName}
                  </h1>

                  {vendor.businessCategory && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {vendor.businessCategory}
                    </span>
                  )}
                </div>

                {vendorLocation && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{vendorLocation}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <div className="sm:text-right">
                <p className="text-xs text-slate-400">Total Products</p>
                <p className="text-xl font-bold text-[#12233f]">
                  {products.length}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void fetchVendorStore(true)}
                disabled={refreshing}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* Main layout */}
        <section className="mt-5 grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
          {/* Category sidebar */}
          <aside className="h-fit rounded-xl border border-slate-200 bg-white lg:sticky lg:top-5">
            <div className="border-b border-slate-200 px-4 py-4">
              <h2 className="font-bold text-[#12233f]">Product Categories</h2>
              <p className="mt-1 text-xs text-slate-500">
                {categories.length} categories
              </p>
            </div>

            <div className="max-h-[460px] overflow-y-auto p-2">
              <button
                type="button"
                onClick={() => setCategoryFilter("ALL")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm transition ${
                  categoryFilter === "ALL"
                    ? "bg-blue-50 font-semibold text-[#12233f]"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>All Products</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  {products.length}
                </span>
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryFilter(category.id)}
                  className={`mt-1 flex w-full items-center justify-between gap-2 rounded-lg px-3 py-3 text-left text-sm transition ${
                    categoryFilter === category.id
                      ? "bg-blue-50 font-semibold text-[#12233f]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="min-w-0 truncate">{category.name}</span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* Products area */}
          <div className="min-w-0">
            {/* Search, sort, and result count */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="relative w-full xl:max-w-md">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search products..."
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#12233f] focus:ring-1 focus:ring-[#12233f]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label
                    htmlFor="sort"
                    className="text-sm font-medium text-slate-600"
                  >
                    Sort by
                  </label>

                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="h-11 min-w-[160px] rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#12233f]"
                  >
                    <option value="POSITION">Default Position</option>
                    <option value="NEWEST">Newest First</option>
                    <option value="PRICE_LOW">Price: Low to High</option>
                    <option value="PRICE_HIGH">Price: High to Low</option>
                    <option value="NAME">Product Name</option>
                  </select>

                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                    Show 16
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div>
                  <h2 className="font-semibold text-[#12233f]">
                    {categoryFilter === "ALL"
                      ? "All Products"
                      : categories.find(
                          (category) => category.id === categoryFilter,
                        )?.name || "Products"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Showing {pageStart}–{pageEnd} of {filteredProducts.length}{" "}
                    products
                  </p>
                </div>

                {(search || categoryFilter !== "ALL") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCategoryFilter("ALL");
                    }}
                    className="text-sm font-semibold text-[#12233f] hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </section>

            {/* Same ProductCard component used on the main products page */}
            {paginatedProducts.length === 0 ? (
              <div className="mt-5 flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Store size={28} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-800">
                  No products found
                </h3>

                <p className="mt-1 max-w-md text-sm text-slate-500">
                  {products.length === 0
                    ? "This seller has not added any products yet."
                    : "No products match your search or selected category."}
                </p>

                {(search || categoryFilter !== "ALL") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCategoryFilter("ALL");
                    }}
                    className="mt-4 rounded-lg bg-[#12233f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1b3155]"
                  >
                    View all products
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                {paginatedProducts.map((product) => {
                  const image = getProductImage(product);
                  const regularOrSalePrice =
                    getProductPrice(product)?.current ?? 0;

                  const flashSalePrice =
                    product.flashSaleAttribute?.flashSalePrice != null
                      ? Number(product.flashSaleAttribute.flashSalePrice)
                      : undefined;

                  const isFlashSale =
                    flashSalePrice !== undefined &&
                    Number.isFinite(flashSalePrice) &&
                    flashSalePrice > 0;

                  const rating = Number(
                    product.topRatedAttribute?.averageRating ?? 0,
                  );

                  const reviewsCount = Number(
                    product.topRatedAttribute?.totalReviews ?? 0,
                  );

                  const firstSize =
                    product.attributes?.colors?.[0]?.sizes?.[0]?.size;

                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      slug={product.slug}
                      title={product.title}
                      image={image}
                      price={regularOrSalePrice}
                      rating={rating}
                      reviewsCount={reviewsCount}
                      moq={firstSize || "1"}
                      isNew={Boolean(product.newArrivalAttribute)}
                      discountBadge={
                        isFlashSale
                          ? product.flashSaleAttribute?.discountBadge ||
                            undefined
                          : product.newArrivalAttribute?.badgeText || undefined
                      }
                      flashSalePrice={isFlashSale ? flashSalePrice : undefined}
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
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {pageStart}–{pageEnd}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {filteredProducts.length}
                  </span>{" "}
                  products
                </p>

                {totalPages > 1 && (
                  <nav
                    aria-label="Product pagination"
                    className="flex flex-wrap items-center gap-1.5"
                  >
                    <button
                      type="button"
                      aria-label="Previous page"
                      disabled={safeCurrentPage === 1}
                      onClick={() => goToPage(safeCurrentPage - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={17} />
                    </button>

                    {visiblePages[0] > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => goToPage(1)}
                          className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-300 px-2 text-sm text-slate-600 hover:bg-slate-50"
                        >
                          1
                        </button>
                        {visiblePages[0] > 2 && (
                          <span className="px-1 text-slate-400">…</span>
                        )}
                      </>
                    )}

                    {visiblePages.map((page) => (
                      <button
                        key={page}
                        type="button"
                        aria-current={
                          safeCurrentPage === page ? "page" : undefined
                        }
                        onClick={() => goToPage(page)}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold transition ${
                          safeCurrentPage === page
                            ? "bg-[#12233f] text-white"
                            : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {visiblePages[visiblePages.length - 1] < totalPages && (
                      <>
                        {visiblePages[visiblePages.length - 1] <
                          totalPages - 1 && (
                          <span className="px-1 text-slate-400">…</span>
                        )}
                        <button
                          type="button"
                          onClick={() => goToPage(totalPages)}
                          className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-300 px-2 text-sm text-slate-600 hover:bg-slate-50"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      aria-label="Next page"
                      disabled={safeCurrentPage === totalPages}
                      onClick={() => goToPage(safeCurrentPage + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </nav>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
