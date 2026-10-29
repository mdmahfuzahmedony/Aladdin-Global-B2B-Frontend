"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  SlidersHorizontal,
  Zap,
  Sparkles,
  TrendingUp,
  Tag,
} from "lucide-react";
import Link from "next/link";
import CategoryCard from "@/components/cards/product/CategoryCard";
import ProductCard from "@/components/cards/product/New-Arrivals-ProductCartd";

/* ─── Types ─────────────────────────────────────────────────────────────── */
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

const PRICE_RANGES = [
  { label: "All Prices",      min: 0,    max: Infinity },
  { label: "Under ৳500",     min: 0,    max: 500 },
  { label: "৳500 – ৳1,000", min: 500,  max: 1000 },
  { label: "৳1,000 – ৳5,000",min: 1000, max: 5000 },
  { label: "৳5,000 – ৳10,000",min: 5000, max: 10000 },
  { label: "Above ৳10,000",  min: 10000, max: Infinity },
];

const SHOW_LIMIT = 7;

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function getProductImage(product: Product): string {
  const image = product.images?.find((i) => i?.trim());
  if (image) return image;
  for (const color of product.attributes?.colors ?? []) {
    const ci = color.images?.find((i) => i?.trim());
    if (ci) return ci;
  }
  return "";
}

function getProductPrice(product: Product): number {
  return Number(
    product.flashSaleAttribute?.flashSalePrice ??
      product.pricing?.customerSalePrice ??
      product.pricing?.customerRegularPrice ??
      0,
  );
}

function getCategoryIds(cat: CategoryNode): Set<string> {
  const ids = new Set([cat.id]);
  const visit = (nodes: CategoryNode[]) => {
    for (const n of nodes) { ids.add(n.id); visit(n.children ?? []); }
  };
  visit(cat.children ?? []);
  return ids;
}

function categoryContainsId(cat: CategoryNode, id?: string): boolean {
  return cat.id === id || cat.children.some((c) => categoryContainsId(c, id));
}

/* ─── Sidebar Category Tree ─────────────────────────────────────────────── */
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

  const visibleChildren = !showAll
    ? category.children.slice(0, SHOW_LIMIT)
    : category.children;
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
              {showAll ? "Show less" : `View ${hiddenCount} more`}
              <ChevronDown
                size={13}
                className={`transition-transform ${showAll ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Sort pills config ──────────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: "recommended",    label: "Recommended",  icon: null },
  { value: "new-arrivals",   label: "New Arrivals",  icon: <Sparkles size={11} /> },
  { value: "flash-sale",     label: "Flash Sale",    icon: <Zap size={11} /> },
  { value: "price-low-high", label: "Price ↑",       icon: <TrendingUp size={11} /> },
  { value: "price-high-low", label: "Price ↓",       icon: <TrendingUp size={11} className="rotate-180" /> },
  { value: "newest",         label: "Newest",        icon: null },
];

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function CategoryBrowser({ slug }: { slug?: string }) {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [products, setProducts]     = useState<Product[]>([]);
  const [brands, setBrands]         = useState<Brand[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading]     = useState(true);
  const [error, setError]           = useState("");

  /* Filters */
  const [sortBy, setSortBy]               = useState("recommended");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [brandSearch, setBrandSearch]     = useState("");
  const [priceRangeIdx, setPriceRangeIdx] = useState(0); // index into PRICE_RANGES
  const [showAllBrands, setShowAllBrands] = useState(false);

  /* Subcategory slider */
  const scrollRef   = useRef<HTMLDivElement>(null);
  const autoRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);

  /* ── Fetch ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setCategoriesLoading(true);
        setProductsLoading(true);
        setError("");

        const [catRes, prodRes, brandRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/categories/main-with-count`, {
            cache: "no-store", signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/products`, {
            cache: "no-store", signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/brands`, {
            cache: "no-store", signal: controller.signal,
          }),
        ]);

        const [catJson, prodJson, brandJson] = await Promise.all([
          catRes.json(),
          prodRes.json(),
          brandRes.ok ? brandRes.json() : Promise.resolve({ data: [] }),
        ]);

        if (!catRes.ok || catJson?.success === false)
          throw new Error(catJson?.error || "Failed to load categories.");
        if (!Array.isArray(catJson?.data))
          throw new Error("Category data not found.");
        if (!prodRes.ok || prodJson?.success === false)
          throw new Error(prodJson?.error || "Failed to load products.");
        if (!Array.isArray(prodJson?.data))
          throw new Error("Product data not found.");

        setCategories(catJson.data as CategoryNode[]);
        setProducts(prodJson.data as Product[]);

        const rawBrands: Brand[] = Array.isArray(brandJson)
          ? brandJson
          : Array.isArray(brandJson?.data)
            ? brandJson.data
            : [];
        setBrands(rawBrands.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Failed to load data.");
      } finally {
        if (!controller.signal.aborted) {
          setCategoriesLoading(false);
          setProductsLoading(false);
        }
      }
    }

    void load();
    return () => controller.abort();
  }, []);

  /* ── Category path ────────────────────────────────────────────────────── */
  const categoryPath = useMemo(() => {
    if (!slug) return [];
    const find = (nodes: CategoryNode[], anc: CategoryNode[] = []): CategoryNode[] | null => {
      for (const n of nodes) {
        const path = [...anc, n];
        if (n.slug === slug) return path;
        const sub = find(n.children ?? [], path);
        if (sub) return sub;
      }
      return null;
    };
    return find(categories) ?? [];
  }, [categories, slug]);

  const currentCategory = categoryPath.at(-1);
  const selectedIds     = currentCategory ? getCategoryIds(currentCategory) : null;

  /* ── Product pipeline ─────────────────────────────────────────────────── */
  const visibleProducts = useMemo(
    () =>
      selectedIds
        ? products.filter((p) => selectedIds.has(p.category?.id ?? ""))
        : products,
    [products, selectedIds],
  );

  // Fallback brands from products when API returns none
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

  const displayedBrands = useMemo(() => {
    const q = brandSearch.trim().toLowerCase();
    const list = q
      ? effectiveBrands.filter((b) => b.name.toLowerCase().includes(q))
      : effectiveBrands;
    return showAllBrands ? list : list.slice(0, 8);
  }, [effectiveBrands, brandSearch, showAllBrands]);

  const priceRange = PRICE_RANGES[priceRangeIdx] ?? PRICE_RANGES[0];

  const filteredProducts = useMemo(() => {
    return visibleProducts.filter((p) => {
      if (selectedBrandId && p.brand?.id !== selectedBrandId) return false;
      const price = getProductPrice(p);
      if (price < priceRange.min || price > priceRange.max) return false;
      return true;
    });
  }, [visibleProducts, selectedBrandId, priceRange]);

  const displayedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
        case "new-arrivals":
          return Number(Boolean(b.newArrivalAttribute)) - Number(Boolean(a.newArrivalAttribute));
        case "flash-sale":
          return Number(Boolean(b.flashSaleAttribute)) - Number(Boolean(a.flashSaleAttribute));
        case "top-rated":
          return Number(b.topRatedAttribute?.averageRating ?? 0) - Number(a.topRatedAttribute?.averageRating ?? 0);
        case "price-low-high":
          return getProductPrice(a) - getProductPrice(b);
        case "price-high-low":
          return getProductPrice(b) - getProductPrice(a);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  /* ── Subcategory auto-slider ──────────────────────────────────────────── */
  const updateScrollBtns = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  // Start auto-slide
  const startAutoSlide = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: Math.max(el.clientWidth * 0.5, 120), behavior: "smooth" });
      }
    }, 2800);
  }, []);

  const stopAutoSlide = useCallback(() => {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollBtns();
    el.addEventListener("scroll", updateScrollBtns, { passive: true });
    // Start auto-slide when subcategories exist
    if (currentCategory && currentCategory.children.length > 0) {
      startAutoSlide();
    }
    return () => {
      el.removeEventListener("scroll", updateScrollBtns);
      stopAutoSlide();
    };
  }, [updateScrollBtns, startAutoSlide, stopAutoSlide, currentCategory]);

  const manualScroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    stopAutoSlide();
    el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.75 : el.clientWidth * 0.75, behavior: "smooth" });
    // Resume auto-slide after 5s
    setTimeout(startAutoSlide, 5000);
  };

  const hasActiveFilters = selectedBrandId !== "" || priceRangeIdx !== 0;
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
          <Link href="/categories" className="inline-flex items-center gap-1 hover:text-[#12233F]">
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
              ? `${displayedProducts.length} products in ${currentCategory.name}`
              : slug
                ? "The requested category could not be found."
                : "Browse all categories and products"}
          </p>
        </div>

        {!loading && error && (
          <div role="alert" className="rounded-xl border border-red-100 bg-white p-5 text-sm text-red-600">
            {error}
          </div>
        )}

        {!error && (!slug || currentCategory) && (
          <div className="grid items-start gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">

            {/* ── LEFT SIDEBAR ──────────────────────────────────────────── */}
            <aside className="space-y-4">

              {/* Category Tree */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-4 py-3">
                  <h2 className="text-sm font-bold text-[#12233F]">Categories</h2>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-2">
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
              </div>

              {/* Price Filter */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#12233F]">
                  <TrendingUp size={15} className="text-amber-500" />
                  Price Range
                </h3>
                <div className="space-y-1">
                  {PRICE_RANGES.map((range, idx) => (
                    <button
                      key={range.label}
                      type="button"
                      onClick={() => setPriceRangeIdx(idx)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition ${
                        priceRangeIdx === idx
                          ? "bg-[#12233F] font-bold text-white"
                          : "text-slate-600 hover:bg-slate-50 hover:text-[#12233F]"
                      }`}
                    >
                      <span>{range.label}</span>
                      {priceRangeIdx === idx && (
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#12233F]">
                  <Tag size={15} className="text-amber-500" />
                  Brand
                </h3>

                {/* Brand search */}
                <div className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
                  <Search size={13} className="shrink-0 text-slate-400" />
                  <input
                    type="text"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    placeholder="Search brand..."
                    className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-0.5">
                  {/* All brands option */}
                  <button
                    type="button"
                    onClick={() => setSelectedBrandId("")}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-xs transition ${
                      !selectedBrandId
                        ? "bg-[#12233F] font-bold text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#12233F]"
                    }`}
                  >
                    All Brands
                  </button>

                  {displayedBrands.map((brand) => (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() =>
                        setSelectedBrandId(brand.id === selectedBrandId ? "" : brand.id)
                      }
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition ${
                        selectedBrandId === brand.id
                          ? "bg-amber-50 font-bold text-[#12233F]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-[#12233F]"
                      }`}
                    >
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="h-5 w-5 rounded object-contain"
                        />
                      ) : (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[9px] font-bold text-slate-500">
                          {brand.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span className="truncate">{brand.name}</span>
                    </button>
                  ))}

                  {effectiveBrands.length > 8 && !brandSearch && (
                    <button
                      type="button"
                      onClick={() => setShowAllBrands((v) => !v)}
                      className="flex w-full items-center justify-center gap-1 py-2 text-xs font-semibold text-amber-700 hover:text-amber-800"
                    >
                      {showAllBrands
                        ? "Show less"
                        : `View ${effectiveBrands.length - 8} more`}
                      <ChevronDown
                        size={13}
                        className={`transition-transform ${showAllBrands ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}

                  {displayedBrands.length === 0 && (
                    <p className="px-3 py-2 text-xs text-slate-400">No brands found.</p>
                  )}
                </div>

                {/* Clear brand */}
                {selectedBrandId && (
                  <button
                    type="button"
                    onClick={() => setSelectedBrandId("")}
                    className="mt-2 w-full rounded-lg py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50"
                  >
                    Clear brand filter
                  </button>
                )}
              </div>

              {/* Clear all filters */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => { setSelectedBrandId(""); setPriceRangeIdx(0); }}
                  className="w-full rounded-xl border border-rose-200 bg-white py-2.5 text-xs font-bold text-rose-500 transition hover:bg-rose-50"
                >
                  Clear All Filters
                </button>
              )}
            </aside>

            {/* ── RIGHT CONTENT AREA ────────────────────────────────────── */}
            <section id="category-products" className="min-w-0">

              {/* Subcategory Auto-Slider */}
              {currentCategory && currentCategory.children.length > 0 && (
                <div
                  className="relative mb-6 rounded-xl border border-slate-200 bg-white p-4"
                  onMouseEnter={stopAutoSlide}
                  onMouseLeave={startAutoSlide}
                >
                  <h2 className="mb-3 text-sm font-bold text-[#12233F]">Subcategories</h2>

                  {/* Left button */}
                  <button
                    type="button"
                    onClick={() => manualScroll("left")}
                    disabled={!canLeft}
                    aria-label="Scroll left"
                    className={`absolute left-1.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md transition ${
                      canLeft
                        ? "border-slate-200 text-slate-700 hover:border-amber-400 hover:text-[#12233F]"
                        : "cursor-not-allowed border-slate-100 text-slate-300"
                    }`}
                  >
                    <ChevronLeft size={17} />
                  </button>

                  {/* Scrollable row */}
                  <div
                    ref={scrollRef}
                    className="mx-8 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
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

                  {/* Right button */}
                  <button
                    type="button"
                    onClick={() => manualScroll("right")}
                    disabled={!canRight}
                    aria-label="Scroll right"
                    className={`absolute right-1.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md transition ${
                      canRight
                        ? "border-slate-200 text-slate-700 hover:border-amber-400 hover:text-[#12233F]"
                        : "cursor-not-allowed border-slate-100 text-slate-300"
                    }`}
                  >
                    <ChevronRight size={17} />
                  </button>

                  {/* Dot indicators */}
                  <div className="mt-3 flex justify-center gap-1.5">
                    {currentCategory.children.map((cat) => (
                      <span
                        key={cat.id}
                        className="h-1.5 w-1.5 rounded-full bg-slate-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sort Bar */}
              <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <SlidersHorizontal size={15} className="shrink-0 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500">Sort by:</span>

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

                  <div className="ml-auto flex items-center gap-2">
                    <Link
                      href={`/products${currentCategory ? `?category=${encodeURIComponent(currentCategory.id)}` : ""}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#12233F] hover:text-amber-600"
                    >
                      Browse all <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Active filters display */}
                {(hasActiveFilters || sortBy !== "recommended") && (
                  <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2">
                    <span className="text-[11px] text-slate-400">Active:</span>
                    {sortBy !== "recommended" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#12233F]/10 px-2 py-0.5 text-[11px] font-semibold text-[#12233F]">
                        {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                        <button onClick={() => setSortBy("recommended")} className="hover:text-rose-500">×</button>
                      </span>
                    )}
                    {selectedBrandId && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                        {effectiveBrands.find((b) => b.id === selectedBrandId)?.name}
                        <button onClick={() => setSelectedBrandId("")} className="hover:text-rose-500">×</button>
                      </span>
                    )}
                    {priceRangeIdx !== 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                        {PRICE_RANGES[priceRangeIdx]?.label}
                        <button onClick={() => setPriceRangeIdx(0)} className="hover:text-rose-500">×</button>
                      </span>
                    )}
                    <span className="ml-auto text-[11px] text-slate-400">
                      {displayedProducts.length} result{displayedProducts.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Grid */}
              {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-3">
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
                        price={isFlashSale ? regularPrice : salePrice > 0 ? salePrice : regularPrice}
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
                    No products found.
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={() => { setSelectedBrandId(""); setPriceRangeIdx(0); setSortBy("recommended"); }}
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
    </main>
  );
}
