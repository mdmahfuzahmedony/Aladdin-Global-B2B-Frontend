
"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
} from "lucide-react";
import Link from "next/link";

import CategoryCard from "@/components/cards/product/CategoryCard";
import ProductCard from "@/components/cards/product/New-Arrivals-ProductCartd";
import CategorySidebar, {
  type CategoryNode,
  type SidebarBrand,
} from "@/components/category/CategorySidebar";

/* ─── Types ────────────────────────────────────────────────────────────── */

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
  newArrivalAttribute?: {
    badgeText?: string | null;
  } | null;
  flashSaleAttribute?: {
    flashSalePrice?: number | string;
    flashSaleStock?: number | string;
    discountBadge?: string | null;
  } | null;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

/* ─── Helpers ──────────────────────────────────────────────────────────── */

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
  const ids = new Set<string>([category.id]);

  const visit = (nodes: CategoryNode[]) => {
    for (const node of nodes) {
      ids.add(node.id);
      visit(node.children ?? []);
    }
  };

  visit(category.children ?? []);

  return ids;
}

/* ─── Main Component ───────────────────────────────────────────────────── */

export default function CategoryBrowser({
  slug,
}: {
  slug?: string;
}) {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<SidebarBrand[]>([]);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");

  /* Brand filter only */
  const [selectedBrandId, setSelectedBrandId] = useState("");

  /* Sort */
  const [sortBy, setSortBy] = useState("best-seller");

  /* Subcategory slider */
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  /* ─── Fetch Categories, Products and Brands ──────────────────────────── */

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setCategoriesLoading(true);
        setProductsLoading(true);
        setError("");

        const [categoryResponse, productResponse, brandResponse] =
          await Promise.all([
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

        const [categoryJson, productJson, brandJson] = await Promise.all([
          categoryResponse.json(),
          productResponse.json(),
          brandResponse.ok
            ? brandResponse.json()
            : Promise.resolve({ data: [] }),
        ]);

        if (
          !categoryResponse.ok ||
          categoryJson?.success === false
        ) {
          throw new Error(
            categoryJson?.error || "Failed to load categories.",
          );
        }

        if (!Array.isArray(categoryJson?.data)) {
          throw new Error("Category data not found.");
        }

        if (!productResponse.ok || productJson?.success === false) {
          throw new Error(
            productJson?.error || "Failed to load products.",
          );
        }

        if (!Array.isArray(productJson?.data)) {
          throw new Error("Product data not found.");
        }

        setCategories(categoryJson.data as CategoryNode[]);
        setProducts(productJson.data as Product[]);

        const rawBrands: SidebarBrand[] = Array.isArray(brandJson)
          ? brandJson
          : Array.isArray(brandJson?.data)
            ? brandJson.data
            : [];

        setBrands(
          rawBrands.sort((a, b) => a.name.localeCompare(b.name)),
        );
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load data.",
        );
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

  /* ─── Find Current Category ──────────────────────────────────────────── */

  const categoryPath = useMemo(() => {
    if (!slug) return [];

    const findCategoryPath = (
      nodes: CategoryNode[],
      ancestors: CategoryNode[] = [],
    ): CategoryNode[] | null => {
      for (const node of nodes) {
        const path = [...ancestors, node];

        if (node.slug === slug) {
          return path;
        }

        const childPath = findCategoryPath(
          node.children ?? [],
          path,
        );

        if (childPath) return childPath;
      }

      return null;
    };

    return findCategoryPath(categories) ?? [];
  }, [categories, slug]);

  const currentCategory = categoryPath.at(-1);

  const selectedCategoryIds = currentCategory
    ? getCategoryIds(currentCategory)
    : null;

  /* ─── Filter Products by Category ────────────────────────────────────── */

  const visibleProducts = useMemo(() => {
    if (!selectedCategoryIds) return products;

    return products.filter((product) =>
      selectedCategoryIds.has(product.category?.id ?? ""),
    );
  }, [products, selectedCategoryIds]);

  /* ─── Brands ─────────────────────────────────────────────────────────── */

  const effectiveBrands: SidebarBrand[] = useMemo(() => {
    if (brands.length > 0) return brands;

    const brandMap = new Map<string, string>();

    for (const product of visibleProducts) {
      if (product.brand?.id && product.brand.name) {
        brandMap.set(product.brand.id, product.brand.name);
      }
    }

    return [...brandMap.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [brands, visibleProducts]);

  /* ─── Filter Products by Selected Brand ──────────────────────────────── */

  const displayedProducts = useMemo(() => {
    return visibleProducts.filter((product) => {
      if (
        selectedBrandId &&
        product.brand?.id !== selectedBrandId
      ) {
        return false;
      }

      return true;
    });
  }, [visibleProducts, selectedBrandId]);

  /* ─── Subcategory Slider Controls ────────────────────────────────────── */

  const updateScrollButtons = useCallback(() => {
    const element = scrollRef.current;

    if (!element) return;

    setCanLeft(element.scrollLeft > 4);

    setCanRight(
      element.scrollLeft <
        element.scrollWidth - element.clientWidth - 4,
    );
  }, []);

  const startAutoSlide = useCallback(() => {
    if (autoRef.current) {
      clearInterval(autoRef.current);
    }

    autoRef.current = setInterval(() => {
      const element = scrollRef.current;

      if (!element) return;

      const atEnd =
        element.scrollLeft >=
        element.scrollWidth - element.clientWidth - 4;

      if (atEnd) {
        element.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        element.scrollBy({
          left: Math.max(element.clientWidth * 0.5, 120),
          behavior: "smooth",
        });
      }
    }, 2800);
  }, []);

  const stopAutoSlide = useCallback(() => {
    if (autoRef.current) {
      clearInterval(autoRef.current);
      autoRef.current = null;
    }
  }, []);

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) return;

    updateScrollButtons();

    element.addEventListener("scroll", updateScrollButtons, {
      passive: true,
    });

    if (currentCategory && currentCategory.children.length > 0) {
      startAutoSlide();
    }

    return () => {
      element.removeEventListener("scroll", updateScrollButtons);
      stopAutoSlide();
    };
  }, [
    currentCategory,
    updateScrollButtons,
    startAutoSlide,
    stopAutoSlide,
  ]);

  const manualScroll = (direction: "left" | "right") => {
    const element = scrollRef.current;

    if (!element) return;

    stopAutoSlide();

    element.scrollBy({
      left:
        direction === "left"
          ? -element.clientWidth * 0.75
          : element.clientWidth * 0.75,
      behavior: "smooth",
    });

    window.setTimeout(() => {
      startAutoSlide();
    }, 5000);
  };

  const loading = categoriesLoading || productsLoading;

  /* ─── Render ─────────────────────────────────────────────────────────── */

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

          {categoryPath.map((category, index) => (
            <span
              key={category.id}
              className="inline-flex items-center gap-2"
            >
              <ChevronRight
                size={14}
                className="text-slate-400"
              />

              {index === categoryPath.length - 1 ? (
                <span className="font-semibold text-[#12233F]">
                  {category.name}
                </span>
              ) : (
                <Link
                  href={`/categories/${category.slug}`}
                  className="hover:text-[#12233F]"
                >
                  {category.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Page Title */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#12233F] sm:text-2xl">
            {currentCategory?.name ??
              (slug ? "Category not found" : "All Categories")}
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
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-white p-5 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {!error && (!slug || currentCategory) && (
          <div className="grid items-start gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">
            {/* Sidebar */}
            <CategorySidebar
              categories={categories}
              categoriesLoading={categoriesLoading}
              selectedCategoryId={currentCategory?.id}
              brands={effectiveBrands}
              selectedBrandId={selectedBrandId}
              onBrandChange={setSelectedBrandId}
              sortBy={sortBy}
              onSortChange={setSortBy}
              hasActiveFilters={!!selectedBrandId}
              onClearFilters={() => setSelectedBrandId("")}
            />

            {/* Right Content */}
            <section
              id="category-products"
              className="min-w-0"
            >
              {/* Subcategory Auto Slider */}
              {currentCategory &&
                currentCategory.children.length > 0 && (
                  <div
                    className="relative mb-6 rounded-xl border border-slate-200 bg-white p-4"
                    onMouseEnter={stopAutoSlide}
                    onMouseLeave={startAutoSlide}
                  >
                   

                    {/* Left Button */}
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

                    {/* Scrollable Categories */}
                    <div
                      ref={scrollRef}
                      className="mx-8 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
                    >
                      {currentCategory.children.map((category) => (
                        <div
                          key={category.id}
                          className="w-[calc((100%-24px)/3)] shrink-0 snap-start sm:w-[120px] lg:w-[140px]"
                        >
                          <CategoryCard category={category} />
                        </div>
                      ))}
                    </div>

                    {/* Right Button */}
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

                    {/* Dot Indicators */}
                    <div className="mt-3 flex justify-center gap-1.5">
                      {currentCategory.children.map((category) => (
                        <span
                          key={category.id}
                          className="h-1.5 w-1.5 rounded-full bg-slate-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

              {/* Product Grid */}
              {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                  {Array.from({ length: 8 }, (_, index) => (
                    <div
                      key={index}
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
                    const regularPrice = Number(
                      product.pricing?.customerRegularPrice ?? 0,
                    );

                    const salePrice = Number(
                      product.pricing?.customerSalePrice ?? 0,
                    );

                    const isFlashSale = Boolean(
                      product.flashSaleAttribute,
                    );

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
                        rating={Number(
                          product.topRatedAttribute?.averageRating ?? 0,
                        )}
                        reviewsCount={Number(
                          product.topRatedAttribute?.totalReviews ?? 0,
                        )}
                        moq={
                          product.attributes?.colors?.[0]?.sizes?.[0]
                            ?.size || "1"
                        }
                        isNew={Boolean(product.newArrivalAttribute)}
                        discountBadge={
                          isFlashSale
                            ? product.flashSaleAttribute?.discountBadge
                            : product.newArrivalAttribute?.badgeText
                        }
                        flashSalePrice={
                          product.flashSaleAttribute?.flashSalePrice != null
                            ? Number(
                                product.flashSaleAttribute.flashSalePrice,
                              )
                            : undefined
                        }
                        flashSaleStock={
                          product.flashSaleAttribute?.flashSaleStock != null
                            ? Number(
                                product.flashSaleAttribute.flashSaleStock,
                              )
                            : undefined
                        }
                        isFlashSale={isFlashSale}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-14 text-center">
                  <Search
                    className="mx-auto mb-3 text-slate-400"
                    size={24}
                  />

                  <p className="text-sm font-semibold text-slate-700">
                    No products found.
                  </p>
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
