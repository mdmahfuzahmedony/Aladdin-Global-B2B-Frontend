"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  SlidersHorizontal,
  Tag,
  Zap,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import CategoryCard from "@/components/cards/product/CategoryCard";
import ProductCard from "@/components/cards/product/New-Arrivals-ProductCartd";

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  icon: string | null;
  parentId: string | null;
  productCount: number;
  children: CategoryNode[];
};

type Brand = {
  id: string;
  name: string;
  slug?: string;
  logo?: string | null;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  createdAt?: string;
  images?: string[] | null;
  category?: { id?: string; name?: string } | null;
  brand?: { id: string; name: string } | null;
  pricing?: {
    customerRegularPrice?: number | string | null;
    customerSalePrice?: number | string | null;
  } | null;
  attributes?: {
    colors?: {
      color?: string;
      images?: string[];
      sizes?: { size?: string }[];
    }[];
  } | null;
  topRatedAttribute?: {
    averageRating?: number | string;
    totalReviews?: number | string;
  } | null;
  newArrivalAttribute?: { badgeText?: string | null } | null;
  flashSaleAttribute?: {
    flashSalePrice?: number | string;
    flashSaleStock?: number | string;
    discountBadge?: string | null;
  } | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function getProductImage(product: Product): string {
  const image = product.images?.find((item) => item?.trim());
  if (image) return image;
  for (const color of product.attributes?.colors ?? []) {
    const colorImage = color.images?.find((item) => item?.trim());
    if (colorImage) return colorImage;
  }
  return "";
}

function getCategoryIds(category: CategoryNode): Set<string> {
  const ids = new Set([category.id]);
  const visit = (nodes: CategoryNode[]) => {
    for (const node of nodes) {
      ids.add(node.id);
      visit(node.children ?? []);
    }
  };
  visit(category.children ?? []);
  return ids;
}

function categoryContainsId(category: CategoryNode, id?: string): boolean {
  return (
    category.id === id ||
    category.children.some((child) => categoryContainsId(child, id))
  );
}

/* ─── Sidebar Category Tree Item ────────────────────────────────────────── */
const SHOW_LIMIT = 7;

function CategoryTreeItem({
  category,
  selectedId,
  depth = 0,
  hideNestedCategories = false,
}: {
  category: CategoryNode;
  selectedId?: string;
  depth?: number;
  hideNestedCategories?: boolean;
}) {
  const hasChildren = category.children.length > 0 && !hideNestedCategories;
  const [expanded, setExpanded] = useState(
    depth === 0 || categoryContainsId(category, selectedId),
  );
  const [showAll, setShowAll] = useState(false);

  const visibleChildren =
    !showAll ? category.children.slice(0, SHOW_LIMIT) : category.children;
  const hiddenCount = category.children.length - SHOW_LIMIT;

  return (
    <div>
      <div
        className={`flex items-center gap-1 rounded-lg pr-2 ${
          category.id === selectedId ? "bg-amber-50" : "hover:bg-slate-50"
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-label={`${expanded ? "Collapse" : "Expand"} ${category.name}`}
            aria-expanded={expanded}
            className="flex h-8 w-6 shrink-0 items-center justify-center text-slate-400"
          >
            <ChevronDown
              size={14}
              className={`transition-transform ${expanded ? "" : "-rotate-90"}`}
            />
          </button>
        ) : (
          <span className="w-6 shrink-0" />
        )}

        <Link
          href={`/categories/${encodeURIComponent(category.slug)}`}
          aria-current={category.id === selectedId ? "page" : undefined}
          className={`flex min-w-0 flex-1 items-center gap-2 py-2 text-xs ${
            category.id === selectedId
              ? "font-semibold text-[#12233F]"
              : "text-slate-600 hover:text-[#12233F]"
          }`}
        >
          {/* ── No icon for subcategories (depth > 0) — removed per request ── */}
          <span className="truncate">{category.name}</span>
          <span className="ml-auto shrink-0 text-[10px] text-slate-400">
            {category.productCount}
          </span>
        </Link>
      </div>

      {hasChildren && expanded && (
        <div>
          {visibleChildren.map((child) => (
            <CategoryTreeItem
              key={`${child.id}-${selectedId ?? "all"}`}
              category={child}
              selectedId={selectedId}
              depth={depth + 1}
              hideNestedCategories={hideNestedCategories}
            />
          ))}
          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="flex w-full items-center justify-center gap-1 py-2 text-center text-xs font-semibold text-amber-700 hover:text-amber-800"
              style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
            >
              {showAll ? (
                <>Show less</>
              ) : (
                <>
                  View {hiddenCount} more
                  <ChevronDown size={13} />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Sort + Filter pill buttons ────────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended", icon: null },
  { value: "new-arrivals", label: "New Arrivals", icon: <Sparkles size={12} /> },
  { value: "flash-sale",   label: "Flash Sale",   icon: <Zap size={12} /> },
  { value: "price-low-high", label: "Price ↑", icon: <TrendingUp size={12} /> },
  { value: "price-high-low", label: "Price ↓", icon: <TrendingUp size={12} className="rotate-180" /> },
  { value: "newest",       label: "Newest",       icon: null },
];

/* ─── Main Component ────────────────────────────────────────────────────── */
export default function CategoryBrowser({ slug }: { slug?: string }) {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [products, setProducts]     = useState<Product[]>([]);
  const [brands, setBrands]         = useState<Brand[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading]     = useState(true);
  const [brandsLoading, setBrandsLoading]         = useState(true);
  const [error, setError]           = useState("");
  const [sortBy, setSortBy]         = useState("recommended");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [brandSearch, setBrandSearch]         = useState("");
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);

  /* Slider refs & state */
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /* ── Fetch data ───────────────────────────────────────────────────────── */
  useEffect(() => {
    const controller = new AbortController();

    async function fetchPageData() {
      try {
        setCategoriesLoading(true);
        setProductsLoading(true);
        setBrandsLoading(true);
        setError("");

        const [categoryRes, productRes, brandRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/categories/main-with-count`, {
            cache: "no-store",
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/products`, {
            cache: "no-store",
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/brands`, {
            cache: "no-store",
            signal: controller.signal,
          }),
        ]);

        const [categoryResult, productResult, brandResult] = await Promise.all([
          categoryRes.json(),
          productRes.json(),
          brandRes.ok ? brandRes.json() : Promise.resolve({ data: [] }),
        ]);

        if (!categoryRes.ok || categoryResult?.success === false)
          throw new Error(categoryResult?.error || "Failed to fetch categories.");
        if (!Array.isArray(categoryResult?.data))
          throw new Error("Category data not found.");
        if (!productRes.ok || productResult?.success === false)
          throw new Error(productResult?.error || "Failed to fetch products.");
        if (!Array.isArray(productResult?.data))
          throw new Error("Product data not found.");

        setCategories(categoryResult.data as CategoryNode[]);
        setProducts(productResult.data as Product[]);

        // Brands — accept array at root or inside `.data`
        const rawBrands: Brand[] = Array.isArray(brandResult)
          ? brandResult
          : Array.isArray(brandResult?.data)
            ? brandResult.data
            : [];
        setBrands(rawBrands.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Category page fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load page data.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setCategoriesLoading(false);
          setProductsLoading(false);
          setBrandsLoading(false);
        }
      }
    }

    void fetchPageData();
    return () => controller.abort();
  }, []);

  /* ── Category path resolution ─────────────────────────────────────────── */
  const categoryPath = useMemo(() => {
    if (!slug) return [];
    const findPath = (
      nodes: CategoryNode[],
      ancestors: CategoryNode[] = [],
    ): CategoryNode[] | null => {
      for (const node of nodes) {
        const path = [...ancestors, node];
        if (node.slug === slug) return path;
        const childPath = findPath(node.children ?? [], path);
        if (childPath) return childPath;
      }
      return null;
    };
    return findPath(categories) ?? [];
  }, [categories, slug]);

  const currentCategory = categoryPath.at(-1);
  const selectedIds = currentCategory ? getCategoryIds(currentCategory) : null;

  /* ── Product filtering & sorting ─────────────────────────────────────── */
  const visibleProducts = useMemo(
    () =>
      selectedIds
        ? products.filter((p) => selectedIds.has(p.category?.id ?? ""))
        : products,
    [products, selectedIds],
  );

  const filteredProducts = useMemo(
    () =>
      selectedBrandId
        ? visibleProducts.filter((p) => p.brand?.id === selectedBrandId)
        : visibleProducts,
    [visibleProducts, selectedBrandId],
  );

  const displayedProducts = useMemo(() => {
    const getPrice = (p: Product) =>
      Number(
        p.flashSaleAttribute?.flashSalePrice ??
          p.pricing?.customerSalePrice ??
          p.pricing?.customerRegularPrice ??
          0,
      );

    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
          );
        case "new-arrivals":
          return (
            Number(Boolean(b.newArrivalAttribute)) -
            Number(Boolean(a.newArrivalAttribute))
          );
        case "flash-sale":
          return (
            Number(Boolean(b.flashSaleAttribute)) -
            Number(Boolean(a.flashSaleAttribute))
          );
        case "top-rated":
          return (
            Number(b.topRatedAttribute?.averageRating ?? 0) -
            Number(a.topRatedAttribute?.averageRating ?? 0)
          );
        case "price-low-high":
          return getPrice(a) - getPrice(b);
        case "price-high-low":
          return getPrice(b) - getPrice(a);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  /* ── Brands for dropdown (filtered by search) ─────────────────────────── */
  const filteredBrands = useMemo(() => {
    const q = brandSearch.trim().toLowerCase();
    return q ? brands.filter((b) => b.name.toLowerCase().includes(q)) : brands;
  }, [brands, brandSearch]);

  // Fallback: if API brands empty, derive from products
  const effectiveBrands: Brand[] = useMemo(() => {
    if (brands.length > 0) return brands;
    const map = new Map<string, string>();
    for (const p of visibleProducts) {
      if (p.brand?.id && p.brand.name) map.set(p.brand.id, p.brand.name);
    }
    return [...map.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [brands, visibleProducts]);

  const selectedBrandName = effectiveBrands.find((b) => b.id === selectedBrandId)?.name;

  /* ── Subcategory slider scroll ────────────────────────────────────────── */
  const updateScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [updateScrollButtons, currentCategory]);

  const scrollSubcategories = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distance = Math.max(el.clientWidth * 0.75, 120);
    el.scrollBy({ left: direction === "left" ? -distance : distance, behavior: "smooth" });
  };

  const loading = categoriesLoading || productsLoading;

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <main className="min-h-[60vh] bg-[#f5f6fa] py-7 sm:py-10">
      <div className="mx-auto w-full max-w-[1500px] px-3 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm"
        >
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 hover:text-[#12233F]"
          >
            <Home size={14} />
            All Categories
          </Link>
          {categoryPath.map((cat, i) => (
            <span key={cat.id} className="inline-flex items-center gap-2">
              <ChevronRight size={14} className="text-slate-400" />
              {i === categoryPath.length - 1 ? (
                <span className="font-semibold text-[#12233F]">{cat.name}</span>
              ) : (
                <Link href={`/categories/${cat.slug}`} className="hover:text-[#12233F]">
                  {cat.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Page title */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#12233F] sm:text-2xl">
            {currentCategory?.name ?? (slug ? "Category not found" : "All Categories")}
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {currentCategory
              ? `Products and subcategories in ${currentCategory.name}`
              : slug
                ? "The requested category could not be found."
                : "Browse categories and products"}
          </p>
        </div>

        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-white p-5 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {!error && (!slug || currentCategory) && (
          <div className="grid items-start gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">

            {/* ── LEFT SIDEBAR ────────────────────────────────────────────── */}
            <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-4 py-3">
                <h2 className="text-sm font-bold text-[#12233F]">Categories</h2>
              </div>
              <div className="max-h-[70vh] overflow-y-auto p-2">
                {categoriesLoading ? (
                  <div className="space-y-2 p-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-8 animate-pulse rounded-lg bg-slate-100" />
                    ))}
                  </div>
                ) : (
                  categories.map((cat) => (
                    <CategoryTreeItem
                      key={`${cat.id}-${currentCategory?.id ?? "all"}`}
                      category={cat}
                      selectedId={currentCategory?.id}
                    />
                  ))
                )}
                {!categoriesLoading && categories.length === 0 && (
                  <p className="p-3 text-xs text-slate-500">No categories found.</p>
                )}
              </div>
            </aside>

            {/* ── RIGHT CONTENT AREA ──────────────────────────────────────── */}
            <section id="category-products" className="min-w-0">

              {/* Subcategory Slider */}
              {currentCategory && currentCategory.children.length > 0 && (
                <div className="relative mb-6 rounded-xl border border-slate-200 bg-white p-4">
                  <h2 className="mb-3 text-sm font-bold text-[#12233F]">
                    Subcategories
                  </h2>

                  {/* Left scroll button */}
                  <button
                    type="button"
                    onClick={() => scrollSubcategories("left")}
                    disabled={!canScrollLeft}
                    aria-label="Scroll left"
                    className={`absolute left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition ${
                      canScrollLeft
                        ? "text-slate-700 hover:border-amber-400 hover:text-[#12233F]"
                        : "cursor-not-allowed text-slate-300"
                    }`}
                  >
                    <ChevronLeft size={17} />
                  </button>

                  {/* Scrollable container */}
                  <div
                    ref={scrollContainerRef}
                    className="mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
                  >
                    {currentCategory.children.map((cat) => (
                      <div
                        key={cat.id}
                        className="w-[calc((100%-24px)/3)] shrink-0 snap-start sm:w-[120px] lg:w-[140px]"
                      >
                        <CategoryCard category={cat} />
                      </div>
                    ))}
                  </div>

                  {/* Right scroll button */}
                  <button
                    type="button"
                    onClick={() => scrollSubcategories("right")}
                    disabled={!canScrollRight}
                    aria-label="Scroll right"
                    className={`absolute right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition ${
                      canScrollRight
                        ? "text-slate-700 hover:border-amber-400 hover:text-[#12233F]"
                        : "cursor-not-allowed text-slate-300"
                    }`}
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              )}

              {/* ── Filter & Sort bar ─────────────────────────────────────── */}
              <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <SlidersHorizontal size={15} className="shrink-0 text-slate-400" />

                  {/* Sort pill buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSortBy(opt.value)}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                          sortBy === opt.value
                            ? "bg-[#12233F] text-white"
                            : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-amber-400 hover:text-[#12233F]"
                        }`}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Brand filter — custom searchable dropdown */}
                  <div className="relative ml-auto">
                    <button
                      type="button"
                      onClick={() => setShowBrandDropdown((v) => !v)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-400"
                    >
                      <Tag size={13} />
                      {selectedBrandName ? (
                        <span className="max-w-[90px] truncate">{selectedBrandName}</span>
                      ) : (
                        "All Brands"
                      )}
                      <ChevronDown size={13} className={`transition-transform ${showBrandDropdown ? "rotate-180" : ""}`} />
                    </button>

                    {showBrandDropdown && (
                      <div className="absolute right-0 top-full z-30 mt-1.5 w-56 rounded-xl border border-slate-200 bg-white shadow-lg">
                        {/* Search input */}
                        <div className="border-b border-slate-100 p-2">
                          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
                            <Search size={13} className="shrink-0 text-slate-400" />
                            <input
                              autoFocus
                              type="text"
                              value={brandSearch}
                              onChange={(e) => setBrandSearch(e.target.value)}
                              placeholder="Search brand..."
                              className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                            />
                          </div>
                        </div>

                        {/* Brand list */}
                        <ul className="max-h-52 overflow-y-auto py-1">
                          <li>
                            <button
                              type="button"
                              onClick={() => { setSelectedBrandId(""); setShowBrandDropdown(false); setBrandSearch(""); }}
                              className={`w-full px-3 py-2 text-left text-xs font-semibold transition hover:bg-slate-50 ${!selectedBrandId ? "text-[#12233F]" : "text-slate-600"}`}
                            >
                              All Brands
                            </button>
                          </li>
                          {brandsLoading ? (
                            <li className="px-3 py-4 text-center text-xs text-slate-400">Loading brands…</li>
                          ) : filteredBrands.length === 0 ? (
                            <li className="px-3 py-4 text-center text-xs text-slate-400">No brands found</li>
                          ) : (
                            filteredBrands.map((brand) => (
                              <li key={brand.id}>
                                <button
                                  type="button"
                                  onClick={() => { setSelectedBrandId(brand.id); setShowBrandDropdown(false); setBrandSearch(""); }}
                                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition hover:bg-amber-50 ${
                                    selectedBrandId === brand.id
                                      ? "font-bold text-[#12233F]"
                                      : "text-slate-600"
                                  }`}
                                >
                                  {brand.logo ? (
                                    <img
                                      src={brand.logo}
                                      alt={brand.name}
                                      className="h-5 w-5 rounded object-contain"
                                    />
                                  ) : (
                                    <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-[9px] font-bold text-slate-500">
                                      {brand.name.charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                  {brand.name}
                                </button>
                              </li>
                            ))
                          )}
                        </ul>

                        {/* Clear selection */}
                        {selectedBrandId && (
                          <div className="border-t border-slate-100 p-2">
                            <button
                              type="button"
                              onClick={() => { setSelectedBrandId(""); setShowBrandDropdown(false); }}
                              className="w-full rounded-lg py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50"
                            >
                              Clear filter
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Active filters summary */}
                {(selectedBrandId || sortBy !== "recommended") && (
                  <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2">
                    <span className="text-[11px] text-slate-400">Active filters:</span>
                    {sortBy !== "recommended" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                        {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                        <button onClick={() => setSortBy("recommended")} className="ml-0.5 text-amber-500 hover:text-amber-700">×</button>
                      </span>
                    )}
                    {selectedBrandId && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                        {selectedBrandName}
                        <button onClick={() => setSelectedBrandId("")} className="ml-0.5 text-blue-400 hover:text-blue-700">×</button>
                      </span>
                    )}
                    <span className="ml-auto text-[11px] text-slate-500">
                      {displayedProducts.length} product{displayedProducts.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* Products count + Browse all link */}
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  {displayedProducts.length} product{displayedProducts.length !== 1 ? "s" : ""}
                </p>
                <Link
                  href={`/products${currentCategory ? `?category=${encodeURIComponent(currentCategory.id)}` : ""}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#12233F] hover:text-amber-600"
                >
                  Browse all
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Product grid */}
              {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-xl border border-slate-200 bg-white p-3"
                    >
                      <div className="aspect-square rounded-lg bg-slate-200" />
                      <div className="mt-3 h-3 rounded bg-slate-200" />
                      <div className="mt-2 h-3 w-2/3 rounded bg-slate-200" />
                      <div className="mt-4 h-4 w-1/2 rounded bg-slate-200" />
                    </div>
                  ))}
                </div>
              ) : displayedProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                  {displayedProducts.map((product) => {
                    const regularPrice = Number(product.pricing?.customerRegularPrice ?? 0);
                    const salePrice    = Number(product.pricing?.customerSalePrice ?? 0);
                    const isFlashSale  = Boolean(product.flashSaleAttribute);

                    return (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        slug={product.slug}
                        title={product.title}
                        image={getProductImage(product)}
                        price={
                          isFlashSale
                            ? regularPrice
                            : salePrice > 0
                              ? salePrice
                              : regularPrice
                        }
                        rating={Number(product.topRatedAttribute?.averageRating ?? 0)}
                        reviewsCount={Number(product.topRatedAttribute?.totalReviews ?? 0)}
                        moq={product.attributes?.colors?.[0]?.sizes?.[0]?.size || "1"}
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
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-14 text-center">
                  <Search className="mx-auto mb-3 text-slate-400" size={24} />
                  <p className="text-sm font-semibold text-slate-700">
                    No products found in this category.
                  </p>
                  {(selectedBrandId || sortBy !== "recommended") && (
                    <button
                      type="button"
                      onClick={() => { setSelectedBrandId(""); setSortBy("recommended"); }}
                      className="mt-3 text-xs font-semibold text-amber-600 hover:underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </section>
          </div>
        )}

        {!loading && !error && slug && !currentCategory && (
          <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500">
            This category could not be found.
          </div>
        )}
      </div>

      {/* Close brand dropdown on outside click */}
      {showBrandDropdown && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowBrandDropdown(false)}
          aria-hidden="true"
        />
      )}
    </main>
  );
}
